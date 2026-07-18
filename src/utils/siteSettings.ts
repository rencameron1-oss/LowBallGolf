import fs from 'node:fs';
import {
  brandColorSchemeKeys,
  brandColorSchemes,
  brandFontPresetKeys,
  brandFontPresets,
  buildGoogleFontStylesheetUrl,
  defaultBrandColors,
  defaultSiteSettings,
  googleFontCatalog,
  googleFontKeys,
  headerStyleOptions,
  layoutCornerOptions,
  layoutSpacingOptions,
  layoutWidthOptions,
  logoShapeOptions,
  type BrandColorKey,
  type BrandColorSchemeKey,
  type BrandFontPresetKey,
  type GoogleFontKey,
  type HeaderStyle,
  type LayoutCorners,
  type LayoutSpacing,
  type LayoutWidth,
  type LogoMode,
  type LogoShape,
  type SiteSettings,
} from '../config/brand';

const SITE_SETTINGS_PATH = 'src/content/site_settings/main.json';
const hexColorPattern = /^#(?:[0-9a-f]{3}|[0-9a-f]{6})$/i;

const normalizeString = (value: unknown, fallback = '') =>
  typeof value === 'string' && value.trim().length > 0 ? value.trim() : fallback;

const normalizeOptionalString = (value: unknown) =>
  typeof value === 'string' && value.trim().length > 0 ? value.trim() : '';

const normalizeColor = (value: unknown, fallback: string) => {
  if (typeof value !== 'string') {
    return fallback;
  }

  const normalized = value.trim();
  return hexColorPattern.test(normalized) ? normalized : fallback;
};

const hexToRgbTriplet = (hex: string) => {
  const normalized = hex.replace('#', '');
  const fullHex =
    normalized.length === 3
      ? normalized
          .split('')
          .map((char) => `${char}${char}`)
          .join('')
      : normalized;

  const value = Number.parseInt(fullHex, 16);
  const red = (value >> 16) & 255;
  const green = (value >> 8) & 255;
  const blue = value & 255;

  return `${red} ${green} ${blue}`;
};

const normalizeFontPreset = (value: unknown): BrandFontPresetKey =>
  typeof value === 'string' && brandFontPresetKeys.includes(value as BrandFontPresetKey)
    ? (value as BrandFontPresetKey)
    : defaultSiteSettings.brand.font_preset;

const normalizeGoogleFontKey = (value: unknown, fallback: GoogleFontKey): GoogleFontKey =>
  typeof value === 'string' && googleFontKeys.includes(value as GoogleFontKey)
    ? (value as GoogleFontKey)
    : fallback;

const normalizeColorScheme = (value: unknown): BrandColorSchemeKey =>
  typeof value === 'string' && brandColorSchemeKeys.includes(value as BrandColorSchemeKey)
    ? (value as BrandColorSchemeKey)
    : defaultSiteSettings.brand.color_scheme;

const normalizeLogoMode = (value: unknown): LogoMode =>
  value === 'image' || value === 'initials' || value === 'text'
    ? value
    : defaultSiteSettings.brand.logo_mode;

const normalizeLogoShape = (value: unknown): LogoShape =>
  typeof value === 'string' && logoShapeOptions.some((option) => option.value === value)
    ? (value as LogoShape)
    : defaultSiteSettings.brand.logo_shape;

const normalizeLayoutWidth = (value: unknown): LayoutWidth =>
  typeof value === 'string' && layoutWidthOptions.some((option) => option.value === value)
    ? (value as LayoutWidth)
    : defaultSiteSettings.layout.width;

const normalizeLayoutSpacing = (value: unknown): LayoutSpacing =>
  typeof value === 'string' && layoutSpacingOptions.some((option) => option.value === value)
    ? (value as LayoutSpacing)
    : defaultSiteSettings.layout.spacing;

const normalizeLayoutCorners = (value: unknown): LayoutCorners =>
  typeof value === 'string' && layoutCornerOptions.some((option) => option.value === value)
    ? (value as LayoutCorners)
    : defaultSiteSettings.layout.corners;

const normalizeHeaderStyle = (value: unknown): HeaderStyle =>
  typeof value === 'string' && headerStyleOptions.some((option) => option.value === value)
    ? (value as HeaderStyle)
    : defaultSiteSettings.layout.header_style;

export const getSiteSettings = (): SiteSettings => {
  let rawSettings: Partial<SiteSettings> = {};

  try {
    rawSettings = JSON.parse(fs.readFileSync(SITE_SETTINGS_PATH, 'utf-8')) as Partial<SiteSettings>;
  } catch {}

  const defaultBrand = defaultSiteSettings.brand;
  const rawBrand = rawSettings.brand || {};
  const rawColors = rawBrand.colors || {};
  const colorScheme = normalizeColorScheme(rawBrand.color_scheme);
  const schemeColors = brandColorSchemes[colorScheme].colors;
  const colorFallbacks = colorScheme === 'custom' ? defaultBrand.colors : schemeColors;
  const fontPresetKey = normalizeFontPreset(rawBrand.font_preset);
  const fontPreset = brandFontPresets[fontPresetKey];
  const headingFont = normalizeGoogleFontKey(rawBrand.heading_font, fontPreset.headingFont);
  const bodyFont = normalizeGoogleFontKey(rawBrand.body_font, fontPreset.bodyFont);
  const heroFont = normalizeGoogleFontKey(rawBrand.hero_font, fontPreset.heroFont);
  const logoFont = normalizeGoogleFontKey(rawBrand.logo_font, fontPreset.logoFont);

  const colors = Object.fromEntries(
    (Object.keys(defaultBrandColors) as BrandColorKey[]).map((key) => [
      key,
      colorScheme === 'custom'
        ? normalizeColor(rawColors[key], colorFallbacks[key])
        : schemeColors[key],
    ])
  ) as Record<BrandColorKey, string>;
  const rawLayout = rawSettings.layout || {};

  return {
    title: normalizeString(rawSettings.title, defaultSiteSettings.title),
    location: normalizeString(rawSettings.location, defaultSiteSettings.location),
    contact_intro: normalizeString(rawSettings.contact_intro, defaultSiteSettings.contact_intro),
    footer_note: normalizeString(rawSettings.footer_note, defaultSiteSettings.footer_note),
    brand: {
      color_scheme: colorScheme,
      logo_mode: normalizeLogoMode(rawBrand.logo_mode),
      logo_text: normalizeString(rawBrand.logo_text, defaultBrand.logo_text),
      logo_initials: normalizeString(rawBrand.logo_initials, defaultBrand.logo_initials),
      logo_shape: normalizeLogoShape(rawBrand.logo_shape),
      logo_image_light: normalizeOptionalString(rawBrand.logo_image_light),
      logo_image_dark: normalizeOptionalString(rawBrand.logo_image_dark),
      font_preset: fontPresetKey,
      heading_font: headingFont,
      body_font: bodyFont,
      hero_font: heroFont,
      logo_font: logoFont,
      colors,
    },
    layout: {
      width: normalizeLayoutWidth(rawLayout.width),
      spacing: normalizeLayoutSpacing(rawLayout.spacing),
      corners: normalizeLayoutCorners(rawLayout.corners),
      header_style: normalizeHeaderStyle(rawLayout.header_style),
    },
  };
};

export const getResolvedSiteSettings = () => {
  const settings = getSiteSettings();
  const fontPreset = brandFontPresets[settings.brand.font_preset];
  const headingFontKey = settings.brand.heading_font || fontPreset.headingFont;
  const bodyFontKey = settings.brand.body_font || fontPreset.bodyFont;
  const heroFontKey = settings.brand.hero_font || fontPreset.heroFont;
  const logoFont = googleFontCatalog[settings.brand.logo_font] || googleFontCatalog[fontPreset.logoFont];
  const headingFont = googleFontCatalog[headingFontKey];
  const bodyFont = googleFontCatalog[bodyFontKey];
  const heroFont = googleFontCatalog[heroFontKey];
  const stylesheetUrl = buildGoogleFontStylesheetUrl([
    headingFontKey,
    bodyFontKey,
    heroFontKey,
    settings.brand.logo_font,
  ]);

  const cssVariables = {
    '--color-brand-primary': settings.brand.colors.primary,
    '--color-brand-primary-soft': settings.brand.colors.primary_soft,
    '--color-brand-accent': settings.brand.colors.accent,
    '--color-brand-accent-light': settings.brand.colors.accent_light,
    '--color-brand-text': settings.brand.colors.text,
    '--color-brand-muted': settings.brand.colors.muted,
    '--color-brand-surface': settings.brand.colors.surface,
    '--color-brand-surface-alt': settings.brand.colors.surface_alt,
    '--color-brand-border': settings.brand.colors.border,
    '--color-brand-champagne': settings.brand.colors.champagne,
    '--color-brand-ink': settings.brand.colors.ink,
    '--color-brand-dark-surface': settings.brand.colors.dark_surface,
    '--color-brand-dark-surface-alt': settings.brand.colors.dark_surface_alt,
    '--color-brand-dark-border': settings.brand.colors.dark_border,
    '--color-brand-dark-accent': settings.brand.colors.dark_accent,
    '--color-brand-dark-accent-light': settings.brand.colors.dark_accent_light,
    '--color-brand-accent-rgb': hexToRgbTriplet(settings.brand.colors.accent),
    '--color-brand-dark-surface-rgb': hexToRgbTriplet(settings.brand.colors.dark_surface),
    '--color-brand-dark-accent-rgb': hexToRgbTriplet(settings.brand.colors.dark_accent),
    '--font-heading': headingFont.family,
    '--font-body': bodyFont.family,
    '--font-hero-heading': heroFont.family,
    '--font-logo': logoFont.family,
    '--layout-page-max': settings.layout.width === 'contained' ? '68rem' : settings.layout.width === 'wide' ? '88rem' : '80rem',
    '--layout-content-max': settings.layout.width === 'contained' ? '58rem' : settings.layout.width === 'wide' ? '76rem' : '64rem',
    '--layout-section-padding': settings.layout.spacing === 'compact' ? '4rem' : settings.layout.spacing === 'spacious' ? '8rem' : '6rem',
    '--layout-section-padding-mobile': settings.layout.spacing === 'compact' ? '3rem' : settings.layout.spacing === 'spacious' ? '5.5rem' : '4rem',
    '--layout-card-radius': settings.layout.corners === 'sharp' ? '0.35rem' : settings.layout.corners === 'rounded' ? '1.8rem' : '1rem',
    '--layout-pill-radius': settings.layout.corners === 'sharp' ? '0.35rem' : '9999px',
  } as const;

  const cssText = Object.entries(cssVariables)
    .map(([key, value]) => `${key}: ${value}`)
    .join('; ');

  return {
    settings,
    brand: {
      ...settings.brand,
      fontPreset,
      headingFont,
      bodyFont,
      heroFont,
      logoFont,
      stylesheetUrl,
      cssVariables,
      cssText,
    },
  };
};
