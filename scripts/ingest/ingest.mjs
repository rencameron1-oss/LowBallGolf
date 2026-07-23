#!/usr/bin/env node
// ingest.mjs — LowballGolf nightly ingestion job (v1: drivers).
//
// For each active retailer with a known endpoint:
//   1. fetch the driver catalogue
//   2. upsert listings (raw titles preserved; match status untouched on update)
//   3. compare each price against the current `prices` row
//   4. on change: update `prices` and append to `price_history`
//   5. auto-match new listings to canonical products (confidence >= 0.75)
//   6. record the run in `scrape_runs`
//
// Run locally:
//   SUPABASE_URL=https://xxxx.supabase.co SUPABASE_SERVICE_KEY=eyJ... node ingest.mjs
//
// Node 18+. No dependencies. Talks to Supabase's REST API directly.
// The service key BYPASSES row security — never put it in the website,
// never commit it, only ever in an environment variable.

import { readFileSync } from "node:fs";
import { extractProduct, productSlug, decodeEntities, isAccessory, fingerprint } from "./matcher.mjs";

const ALIASES = JSON.parse(readFileSync(new URL("./aliases.json", import.meta.url), "utf8"));

// Known products indexed by fingerprint and slug, so listings with the
// same words in a different order reuse the existing product instead of
// spawning a duplicate. Populated in main(), updated as products are made.
const productByKey = new Map();
const productBySlug = new Map();

function registerProduct(pr) {
  productByKey.set(fingerprint(pr.brand, pr.model, pr.category, pr.is_ladies), pr);
  productBySlug.set(pr.slug, pr);
}

const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_KEY  = process.env.SUPABASE_SERVICE_KEY;
if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error("Set SUPABASE_URL and SUPABASE_SERVICE_KEY environment variables first.");
  process.exit(1);
}

const AUTO_MATCH_THRESHOLD = 0.75;
const UA = "LowballGolf/1.0 (+https://lowballgolf.com.au)";
const BROWSER_UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Safari/537.36";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// AU-egress proxy. Some stores geo-block non-Australian IPs (GitHub's
// runners are in the US). Requests flagged `au` route through a Supabase
// Edge Function pinned to Sydney, so the store sees an Australian IP.
// Running locally (already in AU)? Set AU_PROXY_OFF=1 to fetch directly.
const AU_PROXY = `${SUPABASE_URL}/functions/v1/au-fetch`;
const AU_PROXY_OFF = process.env.AU_PROXY_OFF === "1";

async function httpGet(url, { au = false, headers = {} } = {}) {
  if (!au || AU_PROXY_OFF) return fetch(url, { headers });
  return fetch(`${AU_PROXY}?url=${encodeURIComponent(url)}`, {
    headers: {
      apikey: SERVICE_KEY,
      Authorization: `Bearer ${SERVICE_KEY}`,
      "x-region": "ap-southeast-2",
    },
  });
}

// ---------------- Supabase REST helpers ----------------

async function db(method, path, body, extraHeaders = {}) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    method,
    headers: {
      apikey: SERVICE_KEY,
      Authorization: `Bearer ${SERVICE_KEY}`,
      "Content-Type": "application/json",
      ...extraHeaders,
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`${method} ${path} -> ${res.status}: ${await res.text()}`);
  const text = await res.text();
  return text ? JSON.parse(text) : null;
}
const dbGet    = (path) => db("GET", path);
const dbInsert = (path, rows) => db("POST", path, rows, { Prefer: "return=representation" });
const dbUpsert = (path, rows, onConflict) =>
  db("POST", `${path}?on_conflict=${onConflict}`, rows,
     { Prefer: "resolution=merge-duplicates,return=representation" });
const dbPatch  = (path, patch) => db("PATCH", path, patch, { Prefer: "return=minimal" });

// ---------------- store fetchers ----------------
// Each returns [{ retailer_product_id, title, url, image_url, price, rrp, in_stock }]

// Shopify stores with Markets enabled geo-price by request IP (Golf
// Paradise served USD to GitHub's US runners). Ask for Australia
// explicitly, then verify via cart.js — and refuse to ingest anything
// if the store still answers in another currency.
const SHOPIFY_AU = { "User-Agent": UA, Cookie: "localization=AU; cart_currency=AUD" };

async function assertShopifyAUD(base) {
  const res = await fetch(`${base}/cart.js`, { headers: SHOPIFY_AU });
  if (!res.ok) return; // no cart endpoint: single-currency store, safe
  const currency = (await res.json())?.currency;
  if (currency && currency !== "AUD") {
    throw new Error(`store served ${currency} prices instead of AUD; skipping to avoid corrupt data`);
  }
}

async function fetchShopify(base, collectionHandle) {
  await assertShopifyAUD(base);
  const items = [];
  for (let page = 1; page <= 10; page++) {
    const res = await fetch(
      `${base}/collections/${collectionHandle}/products.json?limit=250&page=${page}`,
      { headers: SHOPIFY_AU });
    if (!res.ok) break;
    const { products = [] } = await res.json();
    if (products.length === 0) break;
    for (const p of products) {
      const variants = (p.variants ?? []).filter((v) => parseFloat(v.price) > 0); // fix: $0 custom builds
      if (variants.length === 0) continue;
      const available = variants.filter((v) => v.available !== false);
      const pool = available.length ? available : variants;
      const compareAt = pool.map((v) => parseFloat(v.compare_at_price)).filter((n) => n > 0);
      items.push({
        retailer_product_id: String(p.id),
        title: decodeEntities(p.title),
        url: `${base}/products/${p.handle}`,
        image_url: p.images?.[0]?.src ?? null,
        price: Math.min(...pool.map((v) => parseFloat(v.price))),
        rrp: compareAt.length ? Math.max(...compareAt) : null,
        in_stock: available.length > 0,
      });
    }
    await sleep(800);
  }
  return items;
}

async function fetchWoo(base, search, au = false) {
  const items = [];
  for (let page = 1; page <= 10; page++) {
    const res = await httpGet(
      `${base}/wp-json/wc/store/v1/products?search=${encodeURIComponent(search)}&per_page=100&page=${page}`,
      { au, headers: { "User-Agent": UA } });
    if (!res.ok) break;
    const data = await res.json();
    if (!Array.isArray(data) || data.length === 0) break;
    for (const p of data) {
      const minor = 10 ** (p.prices?.currency_minor_unit ?? 2);
      const price = parseFloat(p.prices?.price ?? "0") / minor;
      if (!(price > 0)) continue;
      const rrp = p.prices?.regular_price ? parseFloat(p.prices.regular_price) / minor : null;
      items.push({
        retailer_product_id: String(p.id),
        title: decodeEntities(p.name),
        url: p.permalink,
        image_url: p.images?.[0]?.src ?? null,
        price,
        rrp: rrp && rrp !== price ? rrp : null,
        in_stock: p.is_in_stock !== false,
      });
    }
    await sleep(800);
  }
  return items;
}

// GolfBox is BigCommerce with no products.json; product data lives in the
// category-page HTML. Each card-title anchor carries the name and price
// range in its aria-label, plus the product href; the product image is
// the nearest CDN image before it.
function parseGolfBox(html) {
  const items = [];
  const re =
    /<a\s+aria-label="([^"]+?)"[\s"]*href="(https:\/\/www\.golfbox\.com\.au\/[^"]+?)"[^>]*data-event-type="product-click"[^>]*>\s*([^<]+?)\s*<\/a>/g;
  const titleIdx = [];
  let m;
  while ((m = re.exec(html))) {
    const aria = m[1];
    const url = m[2];
    const name = decodeEntities(m[3].trim());
    const priceM = aria.match(/\$\s?([\d,]+\.\d{2})/); // first $ = min of range
    if (!priceM) continue;
    const price = parseFloat(priceM[1].replace(/,/g, ""));
    if (!(price > 0)) continue;
    const slug = (url.match(/\/([^/]+)\/?$/) || [])[1] || url;
    titleIdx.push(m.index);
    const windowStart =
      titleIdx.length > 1 ? titleIdx[titleIdx.length - 2] : Math.max(0, m.index - 4000);
    const imgs = [
      ...html
        .slice(windowStart, m.index)
        .matchAll(/(?:data-src|src)="(https:\/\/cdn11\.bigcommerce\.com\/[^"]+?\.(?:jpg|jpeg|png)[^"]*)"/gi),
    ];
    items.push({
      retailer_product_id: `gb-${slug}`,
      title: name,
      url,
      image_url: imgs.length ? imgs[imgs.length - 1][1] : null,
      price,
      rrp: null,
      in_stock: true,
    });
  }
  return items;
}

async function fetchGolfBox(base, category, au = false) {
  const byId = new Map();
  for (let page = 1; page <= 10; page++) {
    const res = await httpGet(`${base}/golf-clubs/${category}/?page=${page}`, {
      au,
      headers: { "User-Agent": BROWSER_UA },
    });
    if (!res.ok) break;
    const items = parseGolfBox(await res.text());
    if (items.length === 0) break;
    for (const item of items) if (!byId.has(item.retailer_product_id)) byId.set(item.retailer_product_id, item);
    await sleep(800);
  }
  return [...byId.values()];
}

// Golf Clearance Outlet is Magento 2 (Luma). Category-page HTML lists the
// products as <li> cards; each carries a numeric product id, a
// product-item-link (name + href), a product image, and a price-box with
// finalPrice (what you pay) plus an optional oldPrice (the RRP).
function parseGCO(html) {
  const items = [];
  const blocks = html.split('data-container="product-grid"');
  for (let i = 1; i < blocks.length; i++) {
    const b = blocks[i];
    const idM = b.match(/data-product-id="(\d+)"/);
    const linkM = b.match(/<a\s+class="product-item-link"\s+href="([^"]+)"[^>]*>\s*([^<]+?)\s*<\/a>/);
    const finalM = b.match(/data-price-amount="([\d.]+)"\s+data-price-type="finalPrice"/);
    if (!idM || !linkM || !finalM) continue;
    const price = parseFloat(finalM[1]);
    if (!(price > 0)) continue;
    const oldM = b.match(/data-price-amount="([\d.]+)"\s+data-price-type="oldPrice"/);
    const rrp = oldM ? parseFloat(oldM[1]) : null;
    const imgM = b.match(/class="product-image-photo"[^>]*?\bsrc="([^"]+)"/);
    items.push({
      retailer_product_id: `gco-${idM[1]}`,
      title: decodeEntities(linkM[2].trim()),
      url: linkM[1],
      image_url: imgM ? imgM[1] : null,
      price,
      rrp: rrp && rrp > price ? rrp : null,
      in_stock: true, // out-of-stock items are hidden from category pages
    });
  }
  return items;
}

async function fetchGCO(base, category, au = false) {
  const byId = new Map();
  for (let page = 1; page <= 10; page++) {
    const res = await httpGet(`${base}/golf-clubs/${category}.html${page > 1 ? `?p=${page}` : ""}`, {
      au,
      headers: { "User-Agent": BROWSER_UA },
    });
    if (!res.ok) break;
    const items = parseGCO(await res.text());
    if (items.length === 0) break;
    for (const item of items) if (!byId.has(item.retailer_product_id)) byId.set(item.retailer_product_id, item);
    await sleep(800);
  }
  return [...byId.values()];
}

// Which fetchers per retailer slug, per category. A category may pull
// several collections (House of Golf splits shelf and custom stock).
const shopify = (...handles) => (r) =>
  Promise.all(handles.map((h) => fetchShopify(r.website_url, h))).then((lists) => {
    const byId = new Map();
    for (const item of lists.flat()) {
      if (!byId.has(item.retailer_product_id)) byId.set(item.retailer_product_id, item);
    }
    return [...byId.values()];
  });

const SOURCES = {
  "drummond-golf": [
    { category: "driver", fetch: shopify("clubs-drivers") },
    { category: "putter", fetch: shopify("golf-clubs-putters") },
    { category: "wedge",  fetch: shopify("golf-clubs-wedges") },
  ],
  "power-golf": [
    { category: "driver", fetch: shopify("drivers") },
    { category: "putter", fetch: shopify("putters") },
    { category: "wedge",  fetch: shopify("wedges") },
  ],
  "golf-paradise": [
    { category: "driver", fetch: shopify("driver") },
    { category: "putter", fetch: shopify("putter") },
    { category: "wedge",  fetch: shopify("wedges") },
  ],
  "the-golf-factory": [
    // Geo-blocks non-AU IPs — routed through the Sydney proxy.
    { category: "driver", fetch: (r) => fetchWoo(r.website_url, "driver", true) },
    { category: "putter", fetch: (r) => fetchWoo(r.website_url, "putter", true) },
    { category: "wedge",  fetch: (r) => fetchWoo(r.website_url, "wedge", true) },
  ],
  "house-of-golf": [
    { category: "driver", fetch: shopify("custom-drivers") },
    { category: "putter", fetch: shopify("putters", "custom-putters") },
    { category: "wedge",  fetch: shopify("wedges", "custom-wedges") },
  ],
  "golfbox": [
    // BigCommerce HTML scrape, via the Sydney proxy in case it geo-blocks.
    { category: "driver", fetch: (r) => fetchGolfBox(r.website_url, "drivers", true) },
    { category: "putter", fetch: (r) => fetchGolfBox(r.website_url, "putters", true) },
    { category: "wedge",  fetch: (r) => fetchGolfBox(r.website_url, "wedges", true) },
  ],
  "golf-clearance-outlet": [
    // Magento (Luma) HTML scrape; serves non-AU IPs, so fetched directly.
    { category: "driver", fetch: (r) => fetchGCO(r.website_url, "drivers") },
    { category: "putter", fetch: (r) => fetchGCO(r.website_url, "putters") },
    { category: "wedge",  fetch: (r) => fetchGCO(r.website_url, "wedges") },
  ],
};

// ---------------- per-retailer ingestion ----------------

async function ingestRetailer(retailer) {
  const sources = SOURCES[retailer.slug];
  if (!sources) { console.log(`- ${retailer.name}: no source wired, skipping`); return; }

  const [run] = await dbInsert("scrape_runs", [{ retailer_id: retailer.id }]);
  try {
    // Fetch every category, tagging items so the matcher knows the context.
    // Dedupe across categories by store product id (first category wins).
    const byExtId = new Map();
    const perCat = [];
    for (const src of sources) {
      const items = (await src.fetch(retailer)).filter((i) => !isAccessory(i.title));
      perCat.push(`${src.category}:${items.length}`);
      for (const item of items) {
        if (!byExtId.has(item.retailer_product_id)) {
          byExtId.set(item.retailer_product_id, { ...item, category: src.category });
        }
      }
    }
    const scraped = [...byExtId.values()];
    console.log(`- ${retailer.name}: ${scraped.length} listings fetched (${perCat.join(", ")})`);

    // 1. upsert listings. Only these columns are sent, so match_status,
    //    product_id and first_seen_at are preserved on existing rows.
    const now = new Date().toISOString();
    const listingRows = scraped.map((i) => ({
      retailer_id: retailer.id,
      retailer_product_id: i.retailer_product_id,
      title: i.title,
      url: i.url,
      image_url: i.image_url,
      in_stock: i.in_stock,
      active: true,
      last_seen_at: now,
    }));
    const listings = await dbUpsert("listings", listingRows, "retailer_id,retailer_product_id");
    const idByExt = new Map(listings.map((l) => [l.retailer_product_id, l]));

    // 2. current prices for this retailer's listings, in one query
    const ids = listings.map((l) => l.id).join(",");
    const current = ids.length
      ? await dbGet(`prices?listing_id=in.(${ids})&select=listing_id,price,rrp`)
      : [];
    const priceByListing = new Map(current.map((p) => [p.listing_id, p]));

    // 3. detect changes -> prices upsert + history append
    const priceUpserts = [];
    const historyRows = [];
    for (const item of scraped) {
      const listing = idByExt.get(item.retailer_product_id);
      if (!listing) continue;
      const cur = priceByListing.get(listing.id);
      const changed = !cur ||
        Number(cur.price) !== item.price ||
        (cur.rrp == null ? null : Number(cur.rrp)) !== item.rrp;
      if (changed) {
        priceUpserts.push({ listing_id: listing.id, price: item.price, rrp: item.rrp, updated_at: now });
        historyRows.push({ listing_id: listing.id, price: item.price, rrp: item.rrp, in_stock: item.in_stock });
      }
    }
    if (priceUpserts.length) await dbUpsert("prices", priceUpserts, "listing_id");
    if (historyRows.length) await dbInsert("price_history", historyRows);

    // 4. mark listings that vanished from the store as inactive
    const seenExt = scraped.map((i) => `"${i.retailer_product_id}"`).join(",");
    if (seenExt.length) {
      await dbPatch(
        `listings?retailer_id=eq.${retailer.id}&active=is.true&retailer_product_id=not.in.(${seenExt})`,
        { active: false });
    }

    // 5. auto-match listings that are still unmatched
    let matched = 0;
    for (const listing of listings.filter((l) => l.match_status === "unmatched")) {
      const category = byExtId.get(listing.retailer_product_id)?.category ?? "driver";
      const p = extractProduct(listing.title, "", category);
      if (!p || p.confidence < AUTO_MATCH_THRESHOLD) continue;

      // Route by curated alias first, then order-insensitive fingerprint,
      // then exact slug (the table's other unique key — guards against a
      // slug collision that the fingerprint tier would miss). Only create
      // a brand-new product when none of them knows this club.
      const key = fingerprint(p.brand, p.model, category, p.isLadies);
      const slug = productSlug(p, category);
      let product = ALIASES.merges[key] ? productBySlug.get(ALIASES.merges[key]) : null;
      if (!product) product = productByKey.get(key) ?? null;
      if (!product) product = productBySlug.get(slug) ?? null;
      if (!product) {
        [product] = await dbUpsert("products", [{
          brand: p.brand, model: p.model, category,
          is_ladies: p.isLadies, slug,
        }], "brand,model,category,is_ladies");
        registerProduct(product);
      }
      await dbPatch(`listings?id=eq.${listing.id}&match_status=eq.unmatched`, {
        product_id: product.id, match_status: "auto", match_confidence: p.confidence,
      });
      matched++;
    }

    await dbPatch(`scrape_runs?id=eq.${run.id}`, {
      status: "success", finished_at: new Date().toISOString(),
      listings_seen: scraped.length, listings_changed: historyRows.length,
    });
    console.log(`  ${historyRows.length} price changes, ${matched} new auto-matches`);
  } catch (err) {
    await dbPatch(`scrape_runs?id=eq.${run.id}`, {
      status: "failed", finished_at: new Date().toISOString(), error: String(err).slice(0, 500),
    });
    console.error(`  FAILED: ${err.message}`);
  }
}

// ---------------- main ----------------

const knownProducts = await dbGet("products?select=id,brand,model,category,is_ladies,slug");
for (const pr of knownProducts) registerProduct(pr);

// ONLY_RETAILER (id or slug) restricts the run to one store — handy for
// testing a newly wired scraper. Unset, it ingests every active retailer.
const only = process.env.ONLY_RETAILER;
const retailers = (await dbGet("retailers?active=is.true&select=*&order=id"))
  .filter((r) => !only || String(r.id) === only || r.slug === only);
console.log(`Ingesting ${retailers.length} retailers...`);
for (const r of retailers) await ingestRetailer(r);
console.log("Done.");
