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

import { extractProduct, productSlug, decodeEntities, isAccessory } from "./matcher.mjs";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_KEY  = process.env.SUPABASE_SERVICE_KEY;
if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error("Set SUPABASE_URL and SUPABASE_SERVICE_KEY environment variables first.");
  process.exit(1);
}

const AUTO_MATCH_THRESHOLD = 0.75;
const UA = "LowballGolf/1.0 (+https://lowballgolf.com.au)";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

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

async function fetchShopify(base, collectionHandle) {
  const items = [];
  for (let page = 1; page <= 10; page++) {
    const res = await fetch(
      `${base}/collections/${collectionHandle}/products.json?limit=250&page=${page}`,
      { headers: { "User-Agent": UA } });
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

async function fetchWoo(base, search) {
  const items = [];
  for (let page = 1; page <= 10; page++) {
    const res = await fetch(
      `${base}/wp-json/wc/store/v1/products?search=${encodeURIComponent(search)}&per_page=100&page=${page}`,
      { headers: { "User-Agent": UA } });
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

// Which fetcher + arguments per retailer slug. GolfBox (Searchanise) and
// Golf Clearance Outlet (Magento scrape) are deliberately not wired yet.
const SOURCES = {
  "drummond-golf":    (r) => fetchShopify(r.website_url, "clubs-drivers"),
  "power-golf":       (r) => fetchShopify(r.website_url, "drivers"),
  "golf-paradise":    (r) => fetchShopify(r.website_url, "driver"),
  "the-golf-factory": (r) => fetchWoo(r.website_url, "driver"),
  "house-of-golf":    (r) => fetchShopify(r.website_url, "custom-drivers"),
};

// ---------------- per-retailer ingestion ----------------

async function ingestRetailer(retailer) {
  const fetchCatalog = SOURCES[retailer.slug];
  if (!fetchCatalog) { console.log(`- ${retailer.name}: no source wired, skipping`); return; }

  const [run] = await dbInsert("scrape_runs", [{ retailer_id: retailer.id }]);
  try {
    const scraped = (await fetchCatalog(retailer)).filter((i) => !isAccessory(i.title));
    console.log(`- ${retailer.name}: ${scraped.length} listings fetched`);

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
      const p = extractProduct(listing.title);
      if (!p || p.confidence < AUTO_MATCH_THRESHOLD) continue;
      const [product] = await dbUpsert("products", [{
        brand: p.brand, model: p.model, category: "driver",
        is_ladies: p.isLadies, slug: productSlug(p),
      }], "brand,model,category,is_ladies");
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

const retailers = await dbGet("retailers?active=is.true&select=*&order=id");
console.log(`Ingesting ${retailers.length} retailers...`);
for (const r of retailers) await ingestRetailer(r);
console.log("Done.");
