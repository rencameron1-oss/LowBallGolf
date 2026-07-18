// matcher.mjs — turns a raw store listing title into a canonical product guess.
// Kept as its own module so it can be unit-tested and improved without
// touching the scraper. All four known POC bugs are fixed here:
//   1. HTML entities decoded before matching
//   2. accessories (headcovers etc, singular OR plural) filtered out
//   3. "lite" treated as part of the model, not noise
//   4. ladies models carry their own flag and can never merge with men's
// Plus: bare year suffixes ("'25", "25") stripped, and a model->brand hint
// map for lines whose titles omit the brand (fixes Cleveland HiBore keyed
// as Srixon via a bad vendor field).

const BRANDS = [
  "taylormade", "callaway", "titleist", "ping", "cobra", "mizuno", "srixon",
  "cleveland", "wilson", "pxg", "tour edge", "honma", "yonex", "odyssey",
];

// Model lines that identify a brand even when the title omits it.
// Checked BEFORE the vendor field, which stores sometimes get wrong.
const MODEL_BRAND_HINTS = {
  hibore: "cleveland", launcher: "cleveland",
  qi10: "taylormade", qi35: "taylormade", qi4d: "taylormade", stealth: "taylormade",
  paradym: "callaway", quantum: "callaway", rogue: "callaway",
  g440: "ping", g430: "ping",
  zxi: "srixon", zx5: "srixon", zx7: "srixon",
  darkspeed: "cobra", aerojet: "cobra",
};

const NOISE = new Set([
  "driver", "drivers", "golf", "club", "mens", "men", "s",
  "rh", "lh", "right", "left", "hand", "handed", "hd", "regular", "stiff",
  "senior", "flex", "shaft", "graphite", "steel", "custom", "the",
  "with", "and", "new", "2023", "2024", "2025", "2026", "23", "24", "25", "26",
  "degree", "deg",
]);

export function decodeEntities(s) {
  return s
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&ndash;/g, "\u2013")
    .replace(/&rsquo;/g, "'");
}

export function isAccessory(title) {
  return /\b(head\s?covers?|covers?|grips?|shaft only|towels?|markers?|tees|gloves?)\b/i.test(title);
}

// Returns { brand, model, isLadies, confidence } or null when no useful
// extraction is possible. Confidence is a crude 0-1: how sure we are that
// brand+model identify one real club.
export function extractProduct(rawTitle, vendor = "") {
  const title = decodeEntities(rawTitle);
  if (isAccessory(title)) return null;

  const isLadies = /\b(ladies|women'?s|womens)\b/i.test(title);

  // strip punctuation AFTER the ladies test (apostrophes matter there)
  const t = title.toLowerCase()
    .replace(/'\d\d\b/g, " ")            // "'25" year suffixes
    .replace(/[^a-z0-9. ]/g, " ");

  const tokens = t.split(/\s+/).filter(Boolean);

  // Brand: title first, then model-line hints, then vendor (least trusted).
  let brand = BRANDS.find((b) => t.includes(b)) || null;
  if (!brand) {
    const hintToken = tokens.find((w) => MODEL_BRAND_HINTS[w]);
    if (hintToken) brand = MODEL_BRAND_HINTS[hintToken];
  }
  if (!brand) brand = BRANDS.find((b) => vendor.toLowerCase().includes(b)) || null;
  if (!brand) return null;

  const modelTokens = tokens
    .filter((w) =>
      !NOISE.has(w) &&
      !BRANDS.includes(w) &&
      !/^(ladies|women.?s|womens)$/.test(w) &&
      !/^\d+(\.\d+)?$/.test(w))            // pure numbers are lofts, not models
    .slice(0, 4);
  if (modelTokens.length === 0) return null;

  // Confidence: brand found in title itself beats hint beats vendor;
  // 1-3 model tokens is the sweet spot, 4 suggests unstripped noise.
  let confidence = 0.5;
  if (t.includes(brand)) confidence += 0.25;
  else if (tokens.some((w) => MODEL_BRAND_HINTS[w] === brand)) confidence += 0.2;
  if (modelTokens.length <= 3) confidence += 0.2;

  return {
    brand: titleCaseBrand(brand),
    model: modelTokens.join(" ").toUpperCase(),
    isLadies,
    confidence: Math.min(confidence, 0.95),  // auto-matching is never 1.0
  };
}

function titleCaseBrand(b) {
  const special = { taylormade: "TaylorMade", pxg: "PXG", "tour edge": "Tour Edge", ping: "PING" };
  return special[b] ?? b.charAt(0).toUpperCase() + b.slice(1);
}

export function productSlug(p) {
  return [p.brand, p.model, p.isLadies ? "ladies" : "", "driver"]
    .filter(Boolean).join(" ").toLowerCase().replace(/[^a-z0-9]+/g, "-");
}
