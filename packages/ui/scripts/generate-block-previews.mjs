#!/usr/bin/env node
// generate-block-previews.mjs — emit wireframe SVG thumbnails for every
// @bands/ui block template. Output: packages/ui/src/block-previews/*.svg
//
// Each SVG is 320x200, consistent style, rough wireframe hinting at the
// block's layout so operators can spot the right block in the Tina picker
// without having to read labels. Real screenshots can replace these later.
//
// Run: node scripts/generate-block-previews.mjs

import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = resolve(__dirname, '..', 'src', 'block-previews');
mkdirSync(OUT_DIR, { recursive: true });

// Colour palette — neutral so previews read on any site theme.
const BG = '#0f172a';      // slate-900
const SURF = '#1e293b';    // slate-800
const INK = '#e2e8f0';     // slate-200
const DIM = '#64748b';     // slate-500
const ACCENT = '#f59e0b';  // amber-500

const W = 320;
const H = 200;

// Render at 60% of the viewBox so thumbnails don't dominate the block picker.
// The viewBox stays 320x200 (no internal-coordinate changes), the browser scales.
const RENDER_W = Math.round(W * 0.6);   // 192
const RENDER_H = Math.round(H * 0.6);   // 120

const wrap = (inner) => `<svg xmlns="http://www.w3.org/2000/svg" width="${RENDER_W}" height="${RENDER_H}" viewBox="0 0 ${W} ${H}" font-family="system-ui, -apple-system, sans-serif">
  <rect width="${W}" height="${H}" fill="${BG}"/>
  ${inner}
</svg>`;

const label = (text, x = W / 2, y = H - 12) => {
  // Escape XML entities so labels like "Image & Text" don't break SVG parsing.
  const safe = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return `<text x="${x}" y="${y}" fill="${DIM}" font-size="11" text-anchor="middle" font-weight="500">${safe}</text>`;
};

const box = (x, y, w, h, fill = SURF, rx = 4) =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${fill}"/>`;

const line = (x, y, w, h = 4, fill = DIM) => box(x, y, w, h, fill, 2);

// ─── Per-block templates ──────────────────────────────────────────────
const templates = {
  heroBlock: `
    ${box(0, 0, W, H - 28, SURF, 0)}
    ${line(40, 70, W - 80, 12, INK)}
    ${line(40, 92, W - 120, 6)}
    ${box(40, 116, 60, 20, ACCENT)}
    ${box(108, 116, 60, 20, SURF)}
    ${label('Hero Banner')}`,
  heroSliderBlock: `
    ${box(0, 0, W, H - 28, SURF, 0)}
    ${line(40, 70, W - 80, 12, INK)}
    ${line(40, 92, W - 120, 6)}
    ${box(40, 116, 60, 20, ACCENT)}
    <circle cx="${W / 2 - 14}" cy="${H - 48}" r="3" fill="${INK}"/>
    <circle cx="${W / 2}" cy="${H - 48}" r="3" fill="${DIM}"/>
    <circle cx="${W / 2 + 14}" cy="${H - 48}" r="3" fill="${DIM}"/>
    ${label('Hero Slider')}`,
  richTextBlock: `
    ${line(40, 40, 140, 10, INK)}
    ${line(40, 62, W - 80, 5)}
    ${line(40, 74, W - 80, 5)}
    ${line(40, 86, W - 100, 5)}
    ${line(40, 108, W - 80, 5)}
    ${line(40, 120, W - 80, 5)}
    ${line(40, 132, W - 110, 5)}
    ${label('Rich Text')}`,
  imageTextBlock: `
    ${box(20, 30, 130, 120, SURF)}
    <polygon points="40,120 80,80 110,110 140,90 140,130 40,130" fill="${DIM}"/>
    <circle cx="70" cy="62" r="8" fill="${DIM}"/>
    ${line(170, 50, 120, 10, INK)}
    ${line(170, 70, 120, 4)}
    ${line(170, 80, 110, 4)}
    ${line(170, 90, 120, 4)}
    ${box(170, 115, 60, 18, ACCENT)}
    ${label('Image & Text')}`,
  fullWidthImageBlock: `
    ${box(10, 20, W - 20, H - 50, SURF)}
    <polygon points="30,130 90,80 140,120 200,70 290,130 290,150 30,150" fill="${DIM}"/>
    <circle cx="240" cy="55" r="10" fill="${DIM}"/>
    ${label('Full-Width Image')}`,
  videoEmbedBlock: `
    ${box(40, 30, W - 80, 130, SURF)}
    <circle cx="${W / 2}" cy="${H / 2 - 8}" r="28" fill="${ACCENT}"/>
    <polygon points="${W / 2 - 8},${H / 2 - 20} ${W / 2 - 8},${H / 2 + 4} ${W / 2 + 12},${H / 2 - 8}" fill="${BG}"/>
    ${label('Video Embed')}`,
  testimonialHighlightBlock: `
    ${box(30, 30, W - 60, 130, SURF)}
    <text x="50" y="72" fill="${ACCENT}" font-size="34" font-weight="700">"</text>
    ${line(70, 64, 180, 5, INK)}
    ${line(70, 78, 160, 5, INK)}
    ${line(70, 92, 140, 5)}
    <circle cx="60" cy="130" r="8" fill="${DIM}"/>
    ${line(78, 126, 60, 4, INK)}
    ${line(78, 136, 40, 3)}
    ${label('Testimonial Highlight')}`,
  testimonialGridBlock: `
    ${box(20, 30, 90, 120, SURF)}
    ${box(115, 30, 90, 120, SURF)}
    ${box(210, 30, 90, 120, SURF)}
    <text x="32" y="58" fill="${ACCENT}" font-size="18">"</text>
    ${line(32, 70, 66, 3, INK)}${line(32, 78, 50, 3)}
    <text x="127" y="58" fill="${ACCENT}" font-size="18">"</text>
    ${line(127, 70, 66, 3, INK)}${line(127, 78, 50, 3)}
    <text x="222" y="58" fill="${ACCENT}" font-size="18">"</text>
    ${line(222, 70, 66, 3, INK)}${line(222, 78, 50, 3)}
    ${label('Testimonial Grid')}`,
  statsBlock: `
    <text x="60" y="90" fill="${ACCENT}" font-size="32" font-weight="700" text-anchor="middle">24</text>
    ${line(30, 110, 60, 4, INK)}
    <text x="${W / 2}" y="90" fill="${ACCENT}" font-size="32" font-weight="700" text-anchor="middle">100+</text>
    ${line(130, 110, 60, 4, INK)}
    <text x="260" y="90" fill="${ACCENT}" font-size="32" font-weight="700" text-anchor="middle">∞</text>
    ${line(230, 110, 60, 4, INK)}
    ${label('Stats Row')}`,
  galleryBlock: `
    ${box(20, 30, 90, 70, SURF)}${box(115, 30, 90, 70, SURF)}${box(210, 30, 90, 70, SURF)}
    ${box(20, 105, 90, 55, SURF)}${box(115, 105, 90, 55, SURF)}${box(210, 105, 90, 55, SURF)}
    <circle cx="45" cy="50" r="6" fill="${DIM}"/><circle cx="140" cy="50" r="6" fill="${DIM}"/><circle cx="235" cy="50" r="6" fill="${DIM}"/>
    ${label('Image Gallery')}`,
  ctaBannerBlock: `
    ${box(0, 40, W, 100, SURF, 0)}
    ${line(60, 64, 200, 10, INK)}
    ${line(80, 84, 160, 5)}
    ${box(110, 104, 100, 24, ACCENT)}
    ${label('CTA Banner')}`,
  faqBlock: `
    ${line(40, 30, 120, 8, INK)}
    ${box(30, 50, W - 60, 24, SURF)}<text x="46" y="67" fill="${INK}" font-size="11">?</text>${line(60, 62, 180, 4, INK)}
    ${box(30, 80, W - 60, 24, SURF)}<text x="46" y="97" fill="${INK}" font-size="11">?</text>${line(60, 92, 180, 4, INK)}
    ${box(30, 110, W - 60, 24, SURF)}<text x="46" y="127" fill="${INK}" font-size="11">?</text>${line(60, 122, 180, 4, INK)}
    ${label('FAQ Accordion')}`,
  featureCardsBlock: `
    ${box(20, 40, 85, 120, SURF)}<circle cx="62" cy="70" r="10" fill="${ACCENT}"/>${line(30, 90, 65, 4, INK)}${line(30, 100, 45, 3)}
    ${box(117, 40, 85, 120, SURF)}<circle cx="160" cy="70" r="10" fill="${ACCENT}"/>${line(127, 90, 65, 4, INK)}${line(127, 100, 45, 3)}
    ${box(215, 40, 85, 120, SURF)}<circle cx="257" cy="70" r="10" fill="${ACCENT}"/>${line(225, 90, 65, 4, INK)}${line(225, 100, 45, 3)}
    ${label('Feature Cards')}`,
  teamBlock: `
    ${box(30, 40, 85, 120, SURF)}<circle cx="72" cy="75" r="18" fill="${DIM}"/>${line(45, 110, 55, 4, INK)}${line(52, 120, 40, 3)}
    ${box(120, 40, 85, 120, SURF)}<circle cx="162" cy="75" r="18" fill="${DIM}"/>${line(135, 110, 55, 4, INK)}${line(142, 120, 40, 3)}
    ${box(210, 40, 85, 120, SURF)}<circle cx="252" cy="75" r="18" fill="${DIM}"/>${line(225, 110, 55, 4, INK)}${line(232, 120, 40, 3)}
    ${label('Team / People')}`,
  spacerBlock: `
    ${line(40, 90, W - 80, 2, DIM)}
    ${line(40, 100, W - 80, 2, DIM)}
    ${label('Spacer')}`,
  contactInfoBlock: `
    ${box(30, 30, W - 60, 130, SURF)}
    ${line(50, 50, 120, 9, INK)}
    <circle cx="58" cy="80" r="5" fill="${ACCENT}"/>${line(72, 76, 160, 4, INK)}
    <circle cx="58" cy="100" r="5" fill="${ACCENT}"/>${line(72, 96, 140, 4, INK)}
    <circle cx="58" cy="120" r="5" fill="${ACCENT}"/>${line(72, 116, 120, 4, INK)}
    ${box(50, 135, 70, 18, ACCENT)}
    ${label('Contact Info')}`,
  showcaseGridBlock: `
    ${line(40, 24, 100, 8, ACCENT)}${line(40, 38, 180, 10, INK)}
    ${box(20, 60, 85, 100, SURF)}<polygon points="25,120 55,90 105,140 105,155 25,155" fill="${DIM}"/>
    ${box(117, 60, 85, 100, SURF)}<polygon points="122,120 152,90 202,140 202,155 122,155" fill="${DIM}"/>
    ${box(215, 60, 85, 100, SURF)}<polygon points="220,120 250,90 300,140 300,155 220,155" fill="${DIM}"/>
    ${label('Showcase Card Grid')}`,
  articleGridBlock: `
    ${box(20, 30, 85, 130, SURF)}${box(20, 30, 85, 65, DIM)}${line(30, 105, 65, 5, INK)}${line(30, 115, 55, 3)}
    ${box(117, 30, 85, 130, SURF)}${box(117, 30, 85, 65, DIM)}${line(127, 105, 65, 5, INK)}${line(127, 115, 55, 3)}
    ${box(215, 30, 85, 130, SURF)}${box(215, 30, 85, 65, DIM)}${line(225, 105, 65, 5, INK)}${line(225, 115, 55, 3)}
    ${label('Article Card Grid')}`,
  brandGridBlock: `
    ${box(20, 40, 85, 60, SURF)}<text x="62" y="78" fill="${INK}" font-size="14" text-anchor="middle" font-weight="700">Aa</text>
    ${box(117, 40, 85, 60, SURF)}<text x="160" y="78" fill="${INK}" font-size="14" text-anchor="middle" font-weight="700">Bb</text>
    ${box(215, 40, 85, 60, SURF)}<text x="258" y="78" fill="${INK}" font-size="14" text-anchor="middle" font-weight="700">Cc</text>
    ${box(20, 105, 85, 55, SURF)}${box(117, 105, 85, 55, SURF)}${box(215, 105, 85, 55, SURF)}
    ${label('Brand Card Grid')}`,
  pullQuoteBlock: `
    <text x="40" y="80" fill="${ACCENT}" font-size="60" font-weight="700">"</text>
    ${line(80, 60, 200, 6, INK)}
    ${line(80, 76, 200, 6, INK)}
    ${line(80, 92, 160, 6, INK)}
    ${line(80, 120, 80, 4)}
    ${label('Pull Quote')}`,
  podcastGridBlock: `
    ${box(20, 40, 85, 110, SURF)}<circle cx="62" cy="75" r="18" fill="${ACCENT}"/><polygon points="56,66 56,84 72,75" fill="${BG}"/>${line(30, 110, 65, 4, INK)}${line(30, 120, 45, 3)}
    ${box(117, 40, 85, 110, SURF)}<circle cx="160" cy="75" r="18" fill="${ACCENT}"/><polygon points="154,66 154,84 170,75" fill="${BG}"/>${line(127, 110, 65, 4, INK)}${line(127, 120, 45, 3)}
    ${box(215, 40, 85, 110, SURF)}<circle cx="257" cy="75" r="18" fill="${ACCENT}"/><polygon points="251,66 251,84 267,75" fill="${BG}"/>${line(225, 110, 65, 4, INK)}${line(225, 120, 45, 3)}
    ${label('Podcast Grid')}`,
  newsletterBlock: `
    ${box(30, 30, W - 60, 130, SURF)}
    ${line(80, 60, 160, 10, INK)}
    ${line(80, 80, 160, 4)}
    ${box(50, 105, 160, 24, BG)}${line(60, 115, 100, 3)}
    ${box(215, 105, 60, 24, ACCENT)}
    ${label('Newsletter Signup')}`,
  socialLinksBlock: `
    ${line(40, 40, 120, 8, INK)}
    <circle cx="60" cy="100" r="16" fill="${SURF}"/><text x="60" y="106" fill="${ACCENT}" font-size="15" text-anchor="middle" font-weight="700">f</text>
    <circle cx="105" cy="100" r="16" fill="${SURF}"/><text x="105" y="106" fill="${ACCENT}" font-size="15" text-anchor="middle" font-weight="700">IG</text>
    <circle cx="150" cy="100" r="16" fill="${SURF}"/><text x="150" y="106" fill="${ACCENT}" font-size="15" text-anchor="middle" font-weight="700">X</text>
    <circle cx="195" cy="100" r="16" fill="${SURF}"/><text x="195" y="106" fill="${ACCENT}" font-size="15" text-anchor="middle" font-weight="700">in</text>
    <circle cx="240" cy="100" r="16" fill="${SURF}"/><text x="240" y="106" fill="${ACCENT}" font-size="13" text-anchor="middle" font-weight="700">YT</text>
    ${label('Social Links')}`,
  contributorGridBlock: `
    ${box(20, 40, 85, 120, SURF)}<circle cx="62" cy="72" r="16" fill="${DIM}"/>${line(30, 100, 65, 4, INK)}${line(30, 110, 45, 3)}
    ${box(117, 40, 85, 120, SURF)}<circle cx="160" cy="72" r="16" fill="${DIM}"/>${line(127, 100, 65, 4, INK)}${line(127, 110, 45, 3)}
    ${box(215, 40, 85, 120, SURF)}<circle cx="257" cy="72" r="16" fill="${DIM}"/>${line(225, 100, 65, 4, INK)}${line(225, 110, 45, 3)}
    ${label('Contributor Grid')}`,
  songListBlock: `
    ${line(40, 30, 120, 8, INK)}
    ${box(30, 50, W - 60, 22, SURF)}<text x="42" y="66" fill="${ACCENT}" font-size="11">♪</text>${line(58, 58, 140, 4, INK)}${line(240, 58, 40, 3)}
    ${box(30, 78, W - 60, 22, SURF)}<text x="42" y="94" fill="${ACCENT}" font-size="11">♪</text>${line(58, 86, 140, 4, INK)}${line(240, 86, 40, 3)}
    ${box(30, 106, W - 60, 22, SURF)}<text x="42" y="122" fill="${ACCENT}" font-size="11">♪</text>${line(58, 114, 140, 4, INK)}${line(240, 114, 40, 3)}
    ${box(30, 134, W - 60, 22, SURF)}<text x="42" y="150" fill="${ACCENT}" font-size="11">♪</text>${line(58, 142, 140, 4, INK)}${line(240, 142, 40, 3)}
    ${label('Song List')}`,
  // ── Article & Podcast Layout blocks ──────────────────────────
  articleFeaturedBlock: `
    ${box(20, 20, W - 40, 90, SURF)}
    <text x="40" y="50" fill="${ACCENT}" font-size="8" font-weight="600">FEATURED</text>
    ${line(40, 60, 180, 8, INK)}${line(40, 75, 140, 4)}
    ${line(40, 88, 200, 3)}
    ${box(20, 120, W - 40, 50, SURF)}${line(30, 135, 120, 4, INK)}${line(30, 148, 180, 3)}${line(30, 158, 80, 3)}
    ${label('Featured Article')}`,
  articleListBlock: `
    ${line(40, 25, 100, 6, INK)}${line(160, 25, 80, 4)}
    ${box(20, 42, 88, 55, SURF)}${line(30, 52, 68, 4, INK)}${line(30, 62, 50, 3)}${line(30, 72, 60, 3)}
    ${box(116, 42, 88, 55, SURF)}${line(126, 52, 68, 4, INK)}${line(126, 62, 50, 3)}${line(126, 72, 60, 3)}
    ${box(212, 42, 88, 55, SURF)}${line(222, 52, 68, 4, INK)}${line(222, 62, 50, 3)}${line(222, 72, 60, 3)}
    ${box(20, 105, 88, 55, SURF)}${line(30, 115, 68, 4, INK)}${line(30, 125, 50, 3)}${line(30, 135, 60, 3)}
    ${box(116, 105, 88, 55, SURF)}${line(126, 115, 68, 4, INK)}${line(126, 125, 50, 3)}${line(126, 135, 60, 3)}
    ${box(212, 105, 88, 55, SURF)}${line(222, 115, 68, 4, INK)}${line(222, 125, 50, 3)}${line(222, 135, 60, 3)}
    ${label('Article List')}`,
  articleCarouselBlock: `
    ${line(40, 25, 120, 6, INK)}
    <polygon points="15,90 25,80 25,100" fill="${ACCENT}"/>
    ${box(35, 40, 75, 115, SURF)}${line(45, 50, 55, 40, DIM)}${line(45, 100, 55, 5, INK)}${line(45, 112, 45, 3)}${line(45, 122, 55, 3)}
    ${box(118, 40, 75, 115, SURF)}${line(128, 50, 55, 40, DIM)}${line(128, 100, 55, 5, INK)}${line(128, 112, 45, 3)}${line(128, 122, 55, 3)}
    ${box(201, 40, 75, 115, SURF)}${line(211, 50, 55, 40, DIM)}${line(211, 100, 55, 5, INK)}${line(211, 112, 45, 3)}${line(211, 122, 55, 3)}
    <polygon points="305,90 295,80 295,100" fill="${ACCENT}"/>
    ${label('Article Carousel')}`,
  podcastFeaturedBlock: `
    ${box(20, 20, 100, 100, SURF)}<circle cx="70" cy="60" r="24" fill="${DIM}"/>
    <text x="70" y="67" fill="${ACCENT}" font-size="18" text-anchor="middle" font-weight="700">▶</text>
    ${line(28, 95, 84, 5, INK)}
    ${line(140, 30, 140, 8, INK)}${line(140, 50, 120, 4)}${line(140, 62, 140, 3)}${line(140, 72, 100, 3)}
    ${box(140, 90, W - 160, 22, DIM)}${line(150, 100, 100, 3, INK)}
    <circle cx="152" cy="100" r="6" fill="${ACCENT}"/>
    ${label('Featured Podcast')}`,
  categoryNavBlock: `
    ${line(100, 30, 120, 6, INK)}
    ${box(20, 55, 68, 28, ACCENT, 14)}<text x="54" y="74" fill="${BG}" font-size="10" text-anchor="middle" font-weight="600">All</text>
    ${box(96, 55, 68, 28, SURF, 14)}${line(108, 67, 44, 4, INK)}
    ${box(172, 55, 68, 28, SURF, 14)}${line(184, 67, 44, 4, INK)}
    ${box(248, 55, 52, 28, SURF, 14)}${line(258, 67, 32, 4, INK)}
    ${box(20, 100, 60, 55, SURF)}${line(28, 108, 44, 30, DIM)}${line(28, 144, 40, 3, INK)}
    ${box(88, 100, 60, 55, SURF)}${line(96, 108, 44, 30, DIM)}${line(96, 144, 40, 3, INK)}
    ${box(156, 100, 60, 55, SURF)}${line(164, 108, 44, 30, DIM)}${line(164, 144, 40, 3, INK)}
    ${box(224, 100, 60, 55, SURF)}${line(232, 108, 44, 30, DIM)}${line(232, 144, 40, 3, INK)}
    ${label('Category Navigation')}`,
};

let count = 0;
for (const [name, body] of Object.entries(templates)) {
  const out = resolve(OUT_DIR, `${name}.svg`);
  writeFileSync(out, wrap(body));
  count++;
}

console.log(`wrote ${count} previews to ${OUT_DIR}`);
