import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import {
  brandColorSchemeKeys,
  brandFontPresetKeys,
  headerStyleOptions,
  layoutCornerOptions,
  layoutSpacingOptions,
  layoutWidthOptions,
  googleFontKeys,
} from './config/brand';

const heroLayoutSchema = z.enum(['dot-grid', 'poster', 'mural', 'parallax', 'video']);
const heroThemeSchema = z.enum(['dark', 'light']);
const heroEffectSchema = z.enum(['particles', 'grid', 'scanlines', 'mobile-glow']);
const heroHeadingFontSchema = z.enum(['site', 'heading', 'body', 'logo']);
const heroHeadingSizeSchema = z.enum(['compact', 'balanced', 'statement']);
const optionalMediaPathSchema = z.preprocess((value) => {
  if (typeof value === 'string') {
    const normalized = value.trim();
    return normalized.length > 0 ? normalized : undefined;
  }

  return value;
}, z.string().optional());
const optionalGoogleFontKeySchema = z.preprocess((value) => {
  if (typeof value === 'string' && value.trim().length === 0) {
    return undefined;
  }

  return value;
}, z.enum(googleFontKeys).optional());

const heroPanelSchema = z.object({
  kind: z.enum(['image', 'type']).default('image'),
  variant: z.enum(['landscape', 'support', 'note', 'type', 'manifesto']).default('landscape'),
  label: z.string().optional(),
  title: z.string(),
  meta: z.string().optional(),
  image: optionalMediaPathSchema,
  top: z.string().optional(),
  left: z.string().optional(),
  width: z.string().optional(),
  rotate: z.string().optional(),
});

const heroGraffitiSchema = z.object({
  text: z.string(),
  top: z.string().optional(),
  left: z.string().optional(),
  rotate: z.string().optional(),
});

const heroSlideSchema = z.object({
  name: z.string().optional(),
  tab_label: z.string().optional(),
  duration_seconds: z.coerce.number().optional(),
  layout: heroLayoutSchema.default('poster'),
  theme: heroThemeSchema.default('dark'),
  effects: z.array(heroEffectSchema).default([]),
  eyebrow: z.string().optional(),
  heading: z.string(),
  heading_font: heroHeadingFontSchema.default('site'),
  heading_size: heroHeadingSizeSchema.default('balanced'),
  subheading: z.string(),
  background_image: optionalMediaPathSchema,
  image: optionalMediaPathSchema,
  video_url: optionalMediaPathSchema,
  video_poster_image: optionalMediaPathSchema,
  badges: z.array(z.string()).default([]),
  panels: z.array(heroPanelSchema).default([]),
  graffiti: z.array(heroGraffitiSchema).default([]),
  primary_cta_text: z.string().optional(),
  primary_cta_url: z.string().optional(),
  secondary_cta_text: z.string().optional(),
  secondary_cta_url: z.string().optional(),
});

const home = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/home' }),
  schema: z.object({
    title: z.string(),
    hero: z.object({
      autoplay_seconds: z.coerce.number().default(7),
      primary_cta_text: z.string(),
      primary_cta_url: z.string(),
      secondary_cta_text: z.string(),
      secondary_cta_url: z.string(),
      slides: z.array(heroSlideSchema).min(1),
    }),
    blocks: z.array(z.any()).default([]),
    seo_title: z.string().optional(),
    seo_description: z.string().optional(),
  }),
});

const pages = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/pages' }),
  schema: z.object({
    title: z.string(),
    hero_heading: z.string().optional(),
    hero_subheading: z.string().optional(),
    hero_image: z.string().optional(),
    hero_slider: z
      .object({
        autoplay_seconds: z.coerce.number().default(7),
        primary_cta_text: z.string().optional(),
        primary_cta_url: z.string().optional(),
        secondary_cta_text: z.string().optional(),
        secondary_cta_url: z.string().optional(),
        slides: z.array(heroSlideSchema).default([]),
      })
      .optional(),
    intro: z.string().optional(),
    blocks: z.array(z.any()).optional(),
    seo_title: z.string().optional(),
    seo_description: z.string().optional(),
  }),
});

const caseStudies = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/case_studies' }),
  schema: z.object({
    title: z.string(),
    client: z.string(),
    year: z.string(),
    role: z.string(),
    summary: z.string(),
    hero_image: z.string().optional(),
    featured: z.boolean().default(false),
    order: z.number().default(0),
    services: z.array(z.string()).default([]),
    stats: z.array(z.object({
      label: z.string(),
      value: z.string(),
    })).default([]),
    external_url: z.string().url().optional(),
    seo_title: z.string().optional(),
    seo_description: z.string().optional(),
  }),
});

const posts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    author: z.string().default('Site Owner'),
    excerpt: z.string(),
    hero_image: z.string().optional(),
    category: z.enum(['strategy', 'delivery', 'leadership', 'ai', 'creative']).default('strategy'),
    tags: z.array(z.string()).default([]),
    featured: z.boolean().default(false),
    order: z.number().default(0),
    draft: z.boolean().default(false),
    blocks: z.array(z.any()).optional(),
    related_posts: z.array(z.string()).default([]),
    seo_title: z.string().optional(),
    seo_description: z.string().optional(),
  }),
});

const testimonials = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/testimonials' }),
  schema: z.object({
    author_name: z.string(),
    author_role: z.string().optional(),
    organisation: z.string().optional(),
    author_image: z.string().optional(),
    quote: z.string(),
    featured: z.boolean().default(false),
    order: z.number().default(0),
    source: z.enum(['client', 'colleague', 'partner']).default('client'),
  }),
});

const navigation = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/navigation' }),
  schema: z.object({
    title: z.string(),
    items: z.array(z.object({
      label: z.string(),
      href: z.string(),
      children: z.array(z.object({
        label: z.string(),
        href: z.string(),
      })).optional(),
    })).default([]),
  }),
});

const siteSettings = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/site_settings' }),
  schema: z.object({
    title: z.string(),
    location: z.string(),
    contact_intro: z.string(),
    footer_note: z.string(),
    brand: z.object({
      color_scheme: z.enum(brandColorSchemeKeys).default('starter'),
      logo_mode: z.enum(['text', 'initials', 'image']).default('text'),
      logo_text: z.string(),
      logo_initials: z.string().default('AS'),
      logo_shape: z.enum(['soft-square', 'circle', 'plain']).default('soft-square'),
      logo_image_light: z.string().optional(),
      logo_image_dark: z.string().optional(),
      font_preset: z.enum(brandFontPresetKeys).default('starter-readable'),
      heading_font: optionalGoogleFontKeySchema,
      body_font: optionalGoogleFontKeySchema,
      hero_font: optionalGoogleFontKeySchema,
      logo_font: z.enum(googleFontKeys).default('inter'),
      colors: z.object({
        primary: z.string(),
        primary_soft: z.string(),
        accent: z.string(),
        accent_light: z.string(),
        text: z.string(),
        muted: z.string(),
        surface: z.string(),
        surface_alt: z.string(),
        border: z.string(),
        champagne: z.string(),
        ink: z.string(),
        dark_surface: z.string(),
        dark_surface_alt: z.string(),
        dark_border: z.string(),
        dark_accent: z.string(),
        dark_accent_light: z.string(),
      }),
    }),
    layout: z.object({
      width: z.enum(layoutWidthOptions.map((option) => option.value) as ['contained', 'balanced', 'wide']).default('balanced'),
      spacing: z.enum(layoutSpacingOptions.map((option) => option.value) as ['compact', 'balanced', 'spacious']).default('balanced'),
      corners: z.enum(layoutCornerOptions.map((option) => option.value) as ['sharp', 'soft', 'rounded']).default('soft'),
      header_style: z.enum(headerStyleOptions.map((option) => option.value) as ['glass', 'solid', 'minimal']).default('glass'),
    }),
  }),
});

export const collections = {
  home,
  pages,
  caseStudies,
  posts,
  testimonials,
  navigation,
  siteSettings,
};
