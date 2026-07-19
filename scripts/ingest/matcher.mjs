// matcher.mjs — turns a raw store listing title into a canonical product guess.
// Kept as its own module so it can be unit-tested and improved without
// touching the scraper. Category-aware: drivers, putters, and wedges each
// bring their own vocabulary quirks.
//   - HTML entities decoded before matching
//   - accessories (headcovers, mats, grips etc) filtered out
//   - ladies models carry their own flag and can never merge with men's
//   - bare year suffixes ("'25") stripped
//   - model->brand hint map for lines whose titles omit the brand
//   - putters KEEP numeric tokens (head numbers like #7 identify the
//     model); drivers/wedges drop them (they're lofts)

const BRANDS = [
  "taylormade", "callaway", "titleist", "ping", "cobra", "mizuno", "srixon",
  "cleveland", "wilson", "pxg", "tour edge", "honma", "yonex", "odyssey",
  "scotty cameron", "bettinardi", "evnroll", "lab golf", "xxio",
];

// Model lines that identify a brand even when the title omits it.
// Checked BEFORE the vendor field, which stores sometimes get wrong.
// Keys must be single tokens as they appear AFTER punctuation stripping
// (hyphens become spaces; dots survive).
const MODEL_BRAND_HINTS = {
  // drivers
  hibore: "cleveland", launcher: "cleveland",
  qi10: "taylormade", qi35: "taylormade", qi4d: "taylormade", stealth: "taylormade",
  r7: "taylormade",
  paradym: "callaway", quantum: "callaway", rogue: "callaway", elyte: "callaway",
  g440: "ping", g430: "ping",
  zxi: "srixon", zx5: "srixon", zx7: "srixon",
  darkspeed: "cobra", aerojet: "cobra",
  jpx: "mizuno",
  // putters
  spider: "taylormade",
  toulon: "odyssey",
  phantom: "scotty cameron", newport: "scotty cameron", squareback: "scotty cameron",
  fastback: "scotty cameron", futura: "scotty cameron",
  "df3": "lab golf", "df2.1": "lab golf", "oz.1i": "lab golf", "oz.1": "lab golf",
  "link.1": "lab golf", mezz: "lab golf",
  frontline: "cleveland",
  // wedges
  vokey: "titleist", sm9: "titleist", sm10: "titleist", sm11: "titleist",
  rtx: "cleveland", rtz: "cleveland", cbx: "cleveland", zipcore: "cleveland",
  mg3: "taylormade", mg4: "taylormade", mg5: "taylormade",
  jaws: "callaway", opus: "callaway", cb12: "callaway",
  glide: "ping", s159: "ping",
  t22: "mizuno",
};

const NOISE = new Set([
  "driver", "drivers", "putter", "putters", "wedge", "wedges", "golf", "club",
  "mens", "men", "s",
  "rh", "lh", "right", "left", "hand", "handed", "hd", "regular", "stiff",
  "senior", "flex", "shaft", "graphite", "steel", "custom", "the", "stock",
  "with", "and", "new", "2023", "2024", "2025", "2026",
  "degree", "deg", "loft", "bounce",
]);

// Bare two-digit year tokens are noise for drivers/wedges, but on putters
// numbers can be model identity, so years are handled by the quote-strip
// only there.
const YEAR_TOKENS = new Set(["23", "24", "25", "26"]);

// Store-to-store naming synonyms, applied to the stripped lowercase title
// before tokenising so "Milled Grind 4" and "MG4" fingerprint identically.
// Keep entries conservative: only true synonyms, never product-line
// variants (Elyte vs Elyte X are different clubs).
const PHRASE_SYNONYMS = [
  [/\bmilled grind (\d)\b/g, "mg$1"],
  [/\bsquare to square\b/g, "s2s"],
  [/\bdouble bend\b/g, "db"],
  [/\bsingle bend\b/g, "sgb"],
  [/\btwo ball\b/g, "2 ball"],
  [/\bone ball\b/g, "1 ball"],
  [/\b1 2 ball\b/g, "half ball"], // "1/2 Ball" after punctuation strip
  [/\bcounter ?balanced?\b/g, "cb"],
];

export function applySynonyms(t) {
  for (const [re, sub] of PHRASE_SYNONYMS) t = t.replace(re, sub);
  return t;
}

// Order-insensitive product identity: brand + category + gender + the SET
// of model words. Two titles with the same words in different order are
// the same club; different words are (assumed) different clubs.
export function fingerprint(brand, model, category, isLadies) {
  return [
    String(brand).toLowerCase(),
    category,
    isLadies ? "l" : "m",
    String(model).toLowerCase().split(/\s+/).filter(Boolean).sort().join(" "),
  ].join("|");
}

export function decodeEntities(s) {
  return s
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&ndash;/g, "–")
    .replace(/&rsquo;/g, "'");
}

export function isAccessory(title) {
  return /\b(head\s?covers?|covers?|grips?|shaft only|towels?|markers?|tees|gloves?|mats?|putting (?:mats?|mirrors?|aids?)|training|practice|alignment)\b/i.test(
    title
  );
}

// Returns { brand, model, isLadies, confidence } or null when no useful
// extraction is possible. Confidence is a crude 0-1: how sure we are that
// brand+model identify one real club.
export function extractProduct(rawTitle, vendor = "", category = "driver") {
  const title = decodeEntities(rawTitle);
  if (isAccessory(title)) return null;

  const isLadies = /\b(ladies|women'?s|womens)\b/i.test(title);

  // strip punctuation AFTER the ladies test (apostrophes matter there)
  const t = applySynonyms(
    title.toLowerCase()
      .replace(/'\d\d\b/g, " ")          // "'25" year suffixes
      .replace(/[^a-z0-9. ]/g, " ")
  );

  const tokens = t.split(/\s+/).filter(Boolean);

  // Brand: title first, then model-line hints, then vendor (least trusted).
  let brand = BRANDS.find((b) => t.includes(b)) || null;
  if (!brand && t.includes("l.a.b")) brand = "lab golf";
  if (!brand) {
    const hintToken = tokens.find((w) => MODEL_BRAND_HINTS[w]);
    if (hintToken) brand = MODEL_BRAND_HINTS[hintToken];
  }
  if (!brand) brand = BRANDS.find((b) => vendor.toLowerCase().includes(b)) || null;
  if (!brand) return null;

  // Pure numbers are lofts on drivers/wedges (drop) but head numbers on
  // putters ("#7", "HB Soft 2") that identify the model (keep).
  const keepNumbers = category === "putter";

  const modelTokens = tokens
    .filter((w) =>
      !NOISE.has(w) &&
      !BRANDS.includes(w) &&
      !brand.split(" ").includes(w) &&
      !/^(ladies|women.?s|womens)$/.test(w) &&
      (keepNumbers ? true : !/^\d+(\.\d+)?$/.test(w)) &&
      (keepNumbers || !YEAR_TOKENS.has(w)))
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
  const special = {
    taylormade: "TaylorMade",
    pxg: "PXG",
    "tour edge": "Tour Edge",
    ping: "PING",
    "scotty cameron": "Scotty Cameron",
    "lab golf": "L.A.B. Golf",
  };
  return special[b] ?? b.charAt(0).toUpperCase() + b.slice(1);
}

export function productSlug(p, category = "driver") {
  return [p.brand, p.model, p.isLadies ? "ladies" : "", category]
    .filter(Boolean).join(" ").toLowerCase().replace(/[^a-z0-9]+/g, "-");
}
