#!/usr/bin/env node
// dedupe.mjs — find and resolve duplicate products created by store
// naming differences.
//
//   npm run dedupe report                      list candidate duplicate pairs
//   npm run dedupe merge <keep-slug> <dup-slug>   merge dup into keep
//   npm run dedupe distinct <slug-a> <slug-b>     mark pair as different clubs
//
// Merges repoint every listing (price history rides along, it hangs off
// listings), delete the duplicate product, and record the decision in
// aliases.json so future scrapes route that naming straight to the
// canonical product. "distinct" decisions are recorded so the report
// stops suggesting the pair.

import { readFileSync, writeFileSync } from "node:fs";
import { fingerprint } from "./matcher.mjs";

const SUPABASE_URL = process.env.SUPABASE_URL?.trim();
const SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY?.trim();
if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error("Set SUPABASE_URL and SUPABASE_SERVICE_KEY environment variables first.");
  process.exit(1);
}

const ALIAS_PATH = new URL("./aliases.json", import.meta.url);
const aliases = JSON.parse(readFileSync(ALIAS_PATH, "utf8"));
const saveAliases = () =>
  writeFileSync(ALIAS_PATH, JSON.stringify(aliases, null, 2) + "\n");

async function db(method, path, body) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    method,
    headers: {
      apikey: SERVICE_KEY,
      Authorization: `Bearer ${SERVICE_KEY}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`${method} ${path} -> ${res.status}: ${await res.text()}`);
  const text = await res.text();
  return text ? JSON.parse(text) : null;
}

const tokens = (model) => new Set(String(model).toLowerCase().split(/\s+/).filter(Boolean));
const isSubset = (a, b) => [...a].every((t) => b.has(t));
const jaccard = (a, b) => {
  const inter = [...a].filter((t) => b.has(t)).length;
  return inter / (a.size + b.size - inter);
};
const distinctKey = (s1, s2) => [s1, s2].sort().join("::");
const distinctSet = new Set(aliases.distinct.map((p) => distinctKey(p[0], p[1])));

async function loadProducts() {
  const products = await db("GET", "products?select=id,brand,model,category,is_ladies,slug");
  const listings = await db(
    "GET",
    "listings?select=product_id,retailers(name),prices(price)&active=is.true&match_status=in.(auto,confirmed)&product_id=not.is.null"
  );
  const stats = new Map();
  for (const l of listings) {
    if (!l.prices) continue;
    let s = stats.get(l.product_id);
    if (!s) stats.set(l.product_id, (s = { stores: new Set(), prices: [] }));
    s.stores.add(l.retailers.name);
    s.prices.push(Number(l.prices.price));
  }
  return { products, stats };
}

async function prune() {
  const { products, stats } = await loadProducts();
  const orphans = products.filter((p) => !stats.has(p.id));
  for (const p of orphans) {
    // Clear any lingering listing references (inactive ones), then delete.
    await db("PATCH", `listings?product_id=eq.${p.id}`, { product_id: null, match_status: "unmatched" });
    await db("DELETE", `products?id=eq.${p.id}`);
  }
  console.log(`Pruned ${orphans.length} product(s) with no active matched listings.`);
}

async function report() {
  const { products, stats } = await loadProducts();
  const groups = new Map();
  for (const p of products) {
    if (!stats.has(p.id)) continue; // orphans are prune's job, not review's
    const g = `${p.brand}|${p.category}|${p.is_ladies}`;
    if (!groups.has(g)) groups.set(g, []);
    groups.get(g).push(p);
  }

  const pairs = [];
  for (const group of groups.values()) {
    for (let i = 0; i < group.length; i++) {
      for (let j = i + 1; j < group.length; j++) {
        const a = group[i], b = group[j];
        if (distinctSet.has(distinctKey(a.slug, b.slug))) continue;
        const ta = tokens(a.model), tb = tokens(b.model);
        const extra = Math.abs(ta.size - tb.size);
        const subset = (isSubset(ta, tb) || isSubset(tb, ta)) && extra <= 1;
        const jac = jaccard(ta, tb);
        if (!subset && jac < 0.66) continue;

        const sa = stats.get(a.id), sb = stats.get(b.id);
        const minA = Math.min(...sa.prices), minB = Math.min(...sb.prices);
        const ratio = Math.max(minA, minB) / Math.min(minA, minB);
        if (ratio > 1.6) continue; // price gap says different clubs — not worth review time
        const crossStore = new Set([...sa.stores, ...sb.stores]).size > Math.max(sa.stores.size, sb.stores.size);
        pairs.push({ a, b, sa, sb, minA, minB, jac, subset, crossStore });
      }
    }
  }

  // Cross-store merges unlock new comparisons — show them first.
  pairs.sort((x, y) => Number(y.crossStore) - Number(x.crossStore) || y.jac - x.jac);

  const MAX = 40;
  pairs.slice(0, MAX).forEach((p, idx) => {
    console.log(`\n#${idx + 1} [${p.a.category}] ${p.a.brand}${p.crossStore ? "  ★ merging would connect stores" : ""}`);
    console.log(`  A: "${p.a.model}"  (${p.a.slug})  ${p.sa.stores.size} store(s), from $${p.minA}`);
    console.log(`  B: "${p.b.model}"  (${p.b.slug})  ${p.sb.stores.size} store(s), from $${p.minB}`);
    console.log(`  ${p.subset ? "one name contains the other" : `word overlap ${(p.jac * 100).toFixed(0)}%`}`);
    console.log(`  merge:    npm run dedupe merge ${p.a.slug} ${p.b.slug}`);
    console.log(`  distinct: npm run dedupe distinct ${p.a.slug} ${p.b.slug}`);
  });
  console.log(
    pairs.length === 0
      ? "\nNo candidate duplicates found."
      : `\n${pairs.length} candidate pair(s)${pairs.length > MAX ? `, showing top ${MAX}` : ""}.`
  );
}

async function merge(keepSlug, dupSlug) {
  const [keep] = await db("GET", `products?slug=eq.${keepSlug}&select=*`);
  const [dup] = await db("GET", `products?slug=eq.${dupSlug}&select=*`);
  if (!keep || !dup) throw new Error("slug not found");
  if (keep.id === dup.id) throw new Error("same product");

  const moved = await db("PATCH", `listings?product_id=eq.${dup.id}`, { product_id: keep.id });
  await db("DELETE", `products?id=eq.${dup.id}`);

  aliases.merges[fingerprint(dup.brand, dup.model, dup.category, dup.is_ladies)] = keep.slug;
  saveAliases();
  console.log(
    `Merged "${dup.brand} ${dup.model}" into "${keep.brand} ${keep.model}" — ${moved?.length ?? 0} listing(s) repointed, decision recorded in aliases.json.`
  );
}

async function distinct(slugA, slugB) {
  const key = distinctKey(slugA, slugB);
  if (!distinctSet.has(key)) {
    aliases.distinct.push([slugA, slugB].sort());
    saveAliases();
  }
  console.log(`Recorded: ${slugA} and ${slugB} are different clubs.`);
}

const [cmd, arg1, arg2] = process.argv.slice(2);
if (cmd === "report") await report();
else if (cmd === "prune") await prune();
else if (cmd === "merge" && arg1 && arg2) await merge(arg1, arg2);
else if (cmd === "distinct" && arg1 && arg2) await distinct(arg1, arg2);
else {
  console.log("usage: npm run dedupe report | merge <keep> <dup> | distinct <a> <b>");
  process.exit(1);
}
