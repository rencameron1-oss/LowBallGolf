/**
 * @bands/ui/tina — canonical Tina block templates.
 *
 * Every export is a Tina `Template`. Each site composes its block palette
 * by importing the subset it needs and passing them into `pageBlocks.templates`.
 *
 * Base set sourced from the richest existing site schema, with magazine
 * blocks and music blocks merged on top. PAGE_LIST descriptions are
 * generic so operators get a neutral hint regardless of which site.
 */
import type { Template } from 'tinacms';

const PAGE_HINT = 'Enter a site path (e.g. /about) or full URL';

// ─── Hero Block ────────────────────────────────────────────────
export const heroBlock: Template = {
  name: 'heroBlock',
  label: 'Hero Banner',
  ui: { previewSrc: '/block-previews/heroBlock.svg', category: 'Heroes & Banners' },
  fields: [
    { type: 'image', name: 'background_image', label: 'Background Image' },
    { type: 'string', name: 'heading', label: 'Heading' },
    { type: 'string', name: 'subheading', label: 'Subheading', ui: { component: 'textarea' } },
    {
      type: 'number',
      name: 'overlay_opacity',
      label: 'Overlay Opacity (0–100)',
      ui: {
        validate: (value: number) => {
          if (value !== undefined && (value < 0 || value > 100)) {
            return 'Must be between 0 and 100';
          }
        },
      },
    },
    { type: 'string', name: 'cta_text', label: 'Primary CTA Text' },
    { type: 'string', name: 'cta_url', label: 'Primary CTA URL', description: PAGE_HINT },
    { type: 'string', name: 'cta_secondary_text', label: 'Secondary CTA Text' },
    { type: 'string', name: 'cta_secondary_url', label: 'Secondary CTA URL', description: PAGE_HINT },
    {
      type: 'string',
      name: 'min_height',
      label: 'Minimum Height',
      options: [
        { value: 'small', label: 'Small' },
        { value: 'medium', label: 'Medium' },
        { value: 'large', label: 'Large' },
        { value: 'fullscreen', label: 'Fullscreen' },
      ],
    },
  ],
};

// ─── Rich Text Block ───────────────────────────────────────────
export const richTextBlock: Template = {
  name: 'richTextBlock',
  label: 'Rich Text',
  ui: { previewSrc: '/block-previews/richTextBlock.svg', category: 'Content' },
  fields: [
    { type: 'rich-text', name: 'body', label: 'Body', isBody: false },
    {
      type: 'string',
      name: 'max_width',
      label: 'Max Width',
      options: [
        { value: 'narrow', label: 'Narrow' },
        { value: 'default', label: 'Default' },
        { value: 'wide', label: 'Wide' },
      ],
    },
    {
      type: 'string',
      name: 'alignment',
      label: 'Alignment',
      options: [
        { value: 'left', label: 'Left' },
        { value: 'center', label: 'Center' },
      ],
    },
  ],
};

// ─── Image + Text Block ────────────────────────────────────────
export const imageTextBlock: Template = {
  name: 'imageTextBlock',
  label: 'Image & Text',
  ui: { previewSrc: '/block-previews/imageTextBlock.svg', category: 'Content' },
  fields: [
    { type: 'image', name: 'image', label: 'Image' },
    { type: 'string', name: 'image_alt', label: 'Image Alt Text' },
    { type: 'string', name: 'heading', label: 'Heading' },
    { type: 'rich-text', name: 'body', label: 'Body', isBody: false },
    {
      type: 'string',
      name: 'image_position',
      label: 'Image Position',
      options: [
        { value: 'left', label: 'Left' },
        { value: 'right', label: 'Right' },
      ],
    },
    { type: 'string', name: 'cta_text', label: 'CTA Text' },
    { type: 'string', name: 'cta_url', label: 'CTA URL', description: PAGE_HINT },
    {
      type: 'string',
      name: 'background',
      label: 'Background',
      options: [
        { value: 'default', label: 'Default' },
        { value: 'surface', label: 'Surface' },
        { value: 'surface-alt', label: 'Surface Alt' },
      ],
    },
  ],
};

// ─── Full Width Image Block ────────────────────────────────────
export const fullWidthImageBlock: Template = {
  name: 'fullWidthImageBlock',
  label: 'Full-Width Image',
  ui: { previewSrc: '/block-previews/fullWidthImageBlock.svg', category: 'Heroes & Banners' },
  fields: [
    { type: 'image', name: 'image', label: 'Image' },
    { type: 'string', name: 'image_alt', label: 'Image Alt Text' },
    { type: 'string', name: 'heading', label: 'Heading' },
    { type: 'string', name: 'subheading', label: 'Subheading' },
    { type: 'boolean', name: 'overlay', label: 'Show Overlay' },
    { type: 'boolean', name: 'parallax', label: 'Parallax Effect' },
  ],
};

// ─── Video Embed Block ─────────────────────────────────────────
export const videoEmbedBlock: Template = {
  name: 'videoEmbedBlock',
  label: 'Video Embed',
  ui: { previewSrc: '/block-previews/videoEmbedBlock.svg', category: 'Media' },
  fields: [
    { type: 'string', name: 'youtube_id', label: 'YouTube Video URL or ID', required: true, description: 'Paste the full YouTube URL or just the video ID' },
    { type: 'string', name: 'title', label: 'Title' },
    { type: 'string', name: 'description', label: 'Description', ui: { component: 'textarea' } },
    {
      type: 'string',
      name: 'max_width',
      label: 'Max Width',
      options: [
        { value: 'narrow', label: 'Narrow' },
        { value: 'default', label: 'Default' },
        { value: 'wide', label: 'Wide' },
      ],
    },
  ],
};

// ─── Testimonial Highlight Block ───────────────────────────────
export const testimonialHighlightBlock: Template = {
  name: 'testimonialHighlightBlock',
  label: 'Testimonial Highlight',
  ui: { previewSrc: '/block-previews/testimonialHighlightBlock.svg', category: 'People & Testimonials' },
  fields: [
    { type: 'string', name: 'quote', label: 'Quote', required: true, ui: { component: 'textarea' } },
    { type: 'string', name: 'author_name', label: 'Author Name', required: true },
    { type: 'string', name: 'author_role', label: 'Author Role' },
    { type: 'image', name: 'author_image', label: 'Author Image' },
    { type: 'number', name: 'rating', label: 'Rating (1–5)' },
    {
      type: 'string',
      name: 'background',
      label: 'Background',
      options: [
        { value: 'default', label: 'Default' },
        { value: 'surface', label: 'Surface' },
        { value: 'accent', label: 'Accent' },
      ],
    },
  ],
};

// ─── Stats Block ───────────────────────────────────────────────
export const statsBlock: Template = {
  name: 'statsBlock',
  label: 'Stats Row',
  ui: { previewSrc: '/block-previews/statsBlock.svg', category: 'Layout & Utility' },
  fields: [
    {
      type: 'object',
      name: 'stats',
      label: 'Stats',
      list: true,
      ui: {
        itemProps: (item: Record<string, string>) => ({ label: item?.label || 'Stat' }),
      },
      fields: [
        { type: 'string', name: 'value', label: 'Value' },
        { type: 'string', name: 'label', label: 'Label' },
      ],
    },
    {
      type: 'string',
      name: 'background',
      label: 'Background',
      options: [
        { value: 'default', label: 'Default' },
        { value: 'surface', label: 'Surface' },
      ],
    },
  ],
};

// ─── Gallery Block ─────────────────────────────────────────────
export const galleryBlock: Template = {
  name: 'galleryBlock',
  label: 'Image Gallery',
  ui: { previewSrc: '/block-previews/galleryBlock.svg', category: 'Media' },
  fields: [
    {
      type: 'object',
      name: 'images',
      label: 'Images',
      list: true,
      ui: {
        itemProps: (item: Record<string, string>) => ({ label: item?.alt || 'Image' }),
      },
      fields: [
        { type: 'image', name: 'src', label: 'Image' },
        { type: 'string', name: 'alt', label: 'Alt Text' },
        { type: 'string', name: 'caption', label: 'Caption' },
        {
          type: 'string',
          name: 'focus',
          label: 'Crop Focus',
          description: 'Where to focus when cropping the image',
          options: [
            { value: 'top', label: 'Top (faces/heads)' },
            { value: 'center', label: 'Center' },
            { value: 'bottom', label: 'Bottom' },
          ],
        },
      ],
    },
    {
      type: 'string',
      name: 'columns',
      label: 'Columns',
      options: [
        { value: '2', label: '2 Columns' },
        { value: '3', label: '3 Columns' },
        { value: '4', label: '4 Columns' },
      ],
    },
  ],
};

// ─── CTA Banner Block ──────────────────────────────────────────
export const ctaBannerBlock: Template = {
  name: 'ctaBannerBlock',
  label: 'CTA Banner',
  ui: { previewSrc: '/block-previews/ctaBannerBlock.svg', category: 'Heroes & Banners' },
  fields: [
    { type: 'string', name: 'eyebrow', label: 'Eyebrow' },
    { type: 'string', name: 'heading', label: 'Heading' },
    { type: 'string', name: 'subheading', label: 'Subheading' },
    { type: 'string', name: 'cta_text', label: 'CTA Text' },
    { type: 'string', name: 'cta_url', label: 'CTA URL', description: PAGE_HINT },
    { type: 'string', name: 'secondary_cta_text', label: 'Secondary CTA Text' },
    { type: 'string', name: 'secondary_cta_url', label: 'Secondary CTA URL', description: PAGE_HINT },
    { type: 'image', name: 'background_image', label: 'Background Image' },
    {
      type: 'string',
      name: 'background_style',
      label: 'Background Style',
      options: [
        { value: 'gradient', label: 'Gradient' },
        { value: 'image', label: 'Image' },
        { value: 'solid', label: 'Solid' },
      ],
    },
  ],
};

// ─── FAQ Block ─────────────────────────────────────────────────
export const faqBlock: Template = {
  name: 'faqBlock',
  label: 'FAQ Accordion',
  ui: { previewSrc: '/block-previews/faqBlock.svg', category: 'Content' },
  fields: [
    { type: 'string', name: 'heading', label: 'Heading' },
    {
      type: 'object',
      name: 'items',
      label: 'FAQ Items',
      list: true,
      ui: {
        itemProps: (item: Record<string, string>) => ({ label: item?.question || 'Question' }),
      },
      fields: [
        { type: 'string', name: 'question', label: 'Question' },
        { type: 'string', name: 'answer', label: 'Answer', ui: { component: 'textarea' } },
      ],
    },
  ],
};

// ─── Feature Cards Block ───────────────────────────────────────
export const featureCardsBlock: Template = {
  name: 'featureCardsBlock',
  label: 'Feature Cards',
  ui: { previewSrc: '/block-previews/featureCardsBlock.svg', category: 'Cards & Grids' },
  fields: [
    { type: 'string', name: 'kicker', label: 'Section Kicker' },
    { type: 'string', name: 'heading', label: 'Heading' },
    { type: 'string', name: 'subheading', label: 'Subheading' },
    {
      type: 'object',
      name: 'cards',
      label: 'Cards',
      list: true,
      ui: {
        itemProps: (item: Record<string, string>) => ({ label: item?.heading || 'Card' }),
      },
      fields: [
        {
          type: 'string',
          name: 'icon',
          label: 'Icon',
          options: [
            { value: 'music', label: 'Music' },
            { value: 'mic', label: 'Microphone' },
            { value: 'star', label: 'Star' },
            { value: 'calendar', label: 'Calendar' },
            { value: 'heart', label: 'Heart' },
            { value: 'users', label: 'Users' },
            { value: 'award', label: 'Award' },
            { value: 'sparkles', label: 'Sparkles' },
          ],
        },
        { type: 'string', name: 'heading', label: 'Heading' },
        { type: 'string', name: 'description', label: 'Description', ui: { component: 'textarea' } },
      ],
    },
    {
      type: 'string',
      name: 'columns',
      label: 'Columns',
      options: [
        { value: '2', label: '2 Columns' },
        { value: '3', label: '3 Columns' },
        { value: '4', label: '4 Columns' },
      ],
    },
  ],
};

// ─── Tabbed Feature Block ────────────────────────────────────
export const tabbedFeatureBlock: Template = {
  name: 'tabbedFeatureBlock',
  label: 'Tabbed Feature',
  ui: { previewSrc: '/block-previews/tabbedFeatureBlock.svg', category: 'Cards & Grids' },
  fields: [
    { type: 'string', name: 'kicker', label: 'Section Kicker' },
    { type: 'string', name: 'heading', label: 'Section Heading' },
    { type: 'string', name: 'subheading', label: 'Section Subheading', ui: { component: 'textarea' } },
    {
      type: 'string',
      name: 'layout',
      label: 'Image Position',
      options: [
        { value: 'image-right', label: 'Image on Right' },
        { value: 'image-left', label: 'Image on Left' },
      ],
    },
    {
      type: 'object',
      name: 'tabs',
      label: 'Tabs',
      list: true,
      ui: {
        itemProps: (item: Record<string, string>) => ({ label: item?.label || item?.heading || 'Tab' }),
      },
      fields: [
        { type: 'string', name: 'label', label: 'Tab Label', required: true, description: 'Short label shown in the tab nav' },
        { type: 'image', name: 'image', label: 'Image' },
        { type: 'string', name: 'image_alt', label: 'Image Alt Text' },
        { type: 'string', name: 'heading', label: 'Heading' },
        { type: 'string', name: 'body', label: 'Body Text', ui: { component: 'textarea' } },
        { type: 'string', name: 'cta_text', label: 'CTA Text', description: 'Leave empty for no button' },
        { type: 'string', name: 'cta_url', label: 'CTA URL', description: PAGE_HINT },
        { type: 'boolean', name: 'cta_open_in_new_tab', label: 'Open CTA in New Tab' },
      ],
    },
  ],
};

// ─── Showcase Grid Block ──────────────────────────────────────
export const showcaseGridBlock: Template = {
  name: 'showcaseGridBlock',
  label: 'Showcase Card Grid',
  ui: { previewSrc: '/block-previews/showcaseGridBlock.svg', category: 'Cards & Grids' },
  fields: [
    { type: 'string', name: 'kicker', label: 'Section Kicker' },
    { type: 'string', name: 'heading', label: 'Heading' },
    { type: 'string', name: 'subheading', label: 'Subheading', ui: { component: 'textarea' } },
    {
      type: 'object',
      name: 'items',
      label: 'Cards',
      list: true,
      ui: {
        itemProps: (item: Record<string, string>) => ({ label: item?.title || 'Card' }),
      },
      fields: [
        { type: 'string', name: 'url', label: 'Link URL' },
        { type: 'image', name: 'image', label: 'Image' },
        { type: 'string', name: 'eyebrow', label: 'Eyebrow / Meta' },
        { type: 'string', name: 'title', label: 'Title', required: true },
        { type: 'string', name: 'summary', label: 'Summary', ui: { component: 'textarea' } },
        { type: 'string', name: 'chips', label: 'Chips', list: true },
        {
          type: 'object',
          name: 'stats',
          label: 'Stats',
          list: true,
          ui: {
            itemProps: (item: Record<string, string>) => ({ label: item?.value || item?.label || 'Stat' }),
          },
          fields: [
            { type: 'string', name: 'value', label: 'Value', description: 'Big number or short phrase, e.g. "200%" or "5→15"' },
            { type: 'string', name: 'label', label: 'Label', description: 'Short description, e.g. "Melbourne office growth"' },
          ],
        },
      ],
    },
    {
      type: 'string',
      name: 'columns',
      label: 'Columns',
      options: [
        { value: '2', label: '2 Columns' },
        { value: '3', label: '3 Columns' },
        { value: '4', label: '4 Columns' },
      ],
    },
    {
      type: 'string',
      name: 'image_fit',
      label: 'Image Fit',
      description: 'Contain (for logos) adds a white backdrop with padding. Cover (for photos) fills the card.',
      options: [
        { value: 'cover', label: 'Cover (Photos)' },
        { value: 'contain', label: 'Contain (Logos)' },
      ],
    },
    {
      type: 'string',
      name: 'image_aspect',
      label: 'Image Aspect Ratio',
      options: [
        { value: '16/10', label: '16:10 (Landscape)' },
        { value: '3/2', label: '3:2' },
        { value: '4/3', label: '4:3' },
        { value: '1/1', label: '1:1 (Square)' },
      ],
    },
  ],
};

// ─── Article Grid Block ───────────────────────────────────────
export const articleGridBlock: Template = {
  name: 'articleGridBlock',
  label: 'Article Card Grid',
  ui: { previewSrc: '/block-previews/articleGridBlock.svg', category: 'Cards & Grids' },
  fields: [
    { type: 'string', name: 'kicker', label: 'Section Kicker' },
    { type: 'string', name: 'heading', label: 'Heading' },
    { type: 'string', name: 'subheading', label: 'Subheading', ui: { component: 'textarea' } },
    {
      type: 'object',
      name: 'items',
      label: 'Articles',
      list: true,
      ui: {
        itemProps: (item: Record<string, string>) => ({ label: item?.title || 'Article' }),
      },
      fields: [
        { type: 'string', name: 'url', label: 'Link URL' },
        { type: 'image', name: 'image', label: 'Image' },
        { type: 'string', name: 'meta', label: 'Meta Line' },
        { type: 'string', name: 'title', label: 'Title', required: true },
        { type: 'string', name: 'excerpt', label: 'Excerpt', ui: { component: 'textarea' } },
      ],
    },
    {
      type: 'string',
      name: 'columns',
      label: 'Columns',
      options: [
        { value: '2', label: '2 Columns' },
        { value: '3', label: '3 Columns' },
        { value: '4', label: '4 Columns' },
      ],
    },
  ],
};

// ─── Brand Grid Block ─────────────────────────────────────────
export const brandGridBlock: Template = {
  name: 'brandGridBlock',
  label: 'Brand Card Grid',
  ui: { previewSrc: '/block-previews/brandGridBlock.svg', category: 'Cards & Grids' },
  fields: [
    { type: 'string', name: 'kicker', label: 'Section Kicker' },
    { type: 'string', name: 'heading', label: 'Heading' },
    { type: 'string', name: 'subheading', label: 'Subheading', ui: { component: 'textarea' } },
    {
      type: 'object',
      name: 'items',
      label: 'Brands',
      list: true,
      ui: {
        itemProps: (item: Record<string, string>) => ({ label: item?.name || 'Brand' }),
      },
      fields: [
        { type: 'string', name: 'name', label: 'Name', required: true },
        { type: 'string', name: 'summary', label: 'Summary', ui: { component: 'textarea' } },
        { type: 'image', name: 'image', label: 'Image' },
        { type: 'string', name: 'url', label: 'URL' },
        { type: 'string', name: 'status', label: 'Status Label' },
        { type: 'boolean', name: 'open_in_new_tab', label: 'Open in New Tab' },
      ],
    },
    {
      type: 'string',
      name: 'columns',
      label: 'Columns',
      options: [
        { value: '2', label: '2 Columns' },
        { value: '3', label: '3 Columns' },
        { value: '4', label: '4 Columns' },
        { value: '5', label: '5 Columns' },
      ],
    },
    {
      type: 'string',
      name: 'theme',
      label: 'Theme',
      description: 'Visual preset. Logos use white backdrop with padding; Photos fills the card.',
      options: [
        { value: 'default', label: 'Default (Surface w/ Logo Backdrop)' },
        { value: 'light', label: 'Light (White Cards)' },
        { value: 'minimal', label: 'Minimal (No Card Chrome)' },
        { value: 'dark', label: 'Dark (Inverted)' },
        { value: 'photo', label: 'Photo (Full-Bleed Cover)' },
      ],
    },
    { type: 'string', name: 'cta_text', label: 'More Button Text', description: 'e.g. "View All" — leave empty for no button' },
    { type: 'string', name: 'cta_url', label: 'More Button URL', description: PAGE_HINT },
    { type: 'boolean', name: 'cta_open_in_new_tab', label: 'Open Button Link in New Tab' },
  ],
};

// ─── Testimonial Grid Block ───────────────────────────────────
export const testimonialGridBlock: Template = {
  name: 'testimonialGridBlock',
  label: 'Testimonial Grid',
  ui: { previewSrc: '/block-previews/testimonialGridBlock.svg', category: 'Cards & Grids' },
  fields: [
    { type: 'string', name: 'kicker', label: 'Section Kicker' },
    { type: 'string', name: 'heading', label: 'Heading' },
    { type: 'string', name: 'subheading', label: 'Subheading', ui: { component: 'textarea' } },
    {
      type: 'object',
      name: 'items',
      label: 'Testimonials',
      list: true,
      ui: {
        itemProps: (item: Record<string, string>) => ({ label: item?.author_name || 'Testimonial' }),
      },
      fields: [
        { type: 'string', name: 'meta', label: 'Meta Label' },
        { type: 'string', name: 'quote', label: 'Quote', ui: { component: 'textarea' }, required: true },
        { type: 'string', name: 'author_name', label: 'Author Name', required: true },
        { type: 'string', name: 'author_role', label: 'Role / Title' },
        { type: 'string', name: 'organisation', label: 'Organisation' },
      ],
    },
    {
      type: 'string',
      name: 'columns',
      label: 'Columns',
      options: [
        { value: '2', label: '2 Columns' },
        { value: '3', label: '3 Columns' },
        { value: '4', label: '4 Columns' },
      ],
    },
  ],
};

// ─── Team Block ────────────────────────────────────────────────
export const teamBlock: Template = {
  name: 'teamBlock',
  label: 'People / Team Showcase',
  ui: { previewSrc: '/block-previews/teamBlock.svg', category: 'People & Testimonials' },
  fields: [
    { type: 'string', name: 'heading', label: 'Heading' },
    { type: 'string', name: 'subheading', label: 'Subheading' },
    {
      type: 'object',
      name: 'members',
      label: 'Members',
      list: true,
      ui: {
        itemProps: (item: Record<string, string>) => ({ label: item?.name || 'Member' }),
      },
      fields: [
        { type: 'string', name: 'name', label: 'Name' },
        { type: 'string', name: 'role', label: 'Role' },
        { type: 'image', name: 'image', label: 'Image' },
        { type: 'string', name: 'bio', label: 'Bio', ui: { component: 'textarea' } },
        { type: 'string', name: 'cta_text', label: 'Button Text', description: 'e.g. "More" — leave empty for no button' },
        { type: 'string', name: 'cta_url', label: 'Button URL', description: PAGE_HINT },
      ],
    },
  ],
};

// ─── Spacer Block ──────────────────────────────────────────────
export const spacerBlock: Template = {
  name: 'spacerBlock',
  label: 'Spacer / Divider',
  ui: { previewSrc: '/block-previews/spacerBlock.svg', category: 'Layout & Utility' },
  fields: [
    {
      type: 'string',
      name: 'size',
      label: 'Size',
      options: [
        { value: 'small', label: 'Small' },
        { value: 'medium', label: 'Medium' },
        { value: 'large', label: 'Large' },
      ],
    },
    {
      type: 'string',
      name: 'style',
      label: 'Style',
      options: [
        { value: 'empty', label: 'Empty Space' },
        { value: 'line', label: 'Line' },
        { value: 'accent-line', label: 'Accent Line' },
        { value: 'dots', label: 'Dots' },
      ],
    },
  ],
};

// ─── Contact Info Block ────────────────────────────────────────
export const contactInfoBlock: Template = {
  name: 'contactInfoBlock',
  label: 'Contact Info Card',
  ui: { previewSrc: '/block-previews/contactInfoBlock.svg', category: 'Layout & Utility' },
  fields: [
    { type: 'string', name: 'heading', label: 'Heading' },
    { type: 'string', name: 'email', label: 'Email Address', required: true },
    { type: 'string', name: 'email_subject', label: 'Email Subject Line', description: 'Pre-filled subject when someone clicks the email link' },
    { type: 'string', name: 'location', label: 'Location' },
    { type: 'string', name: 'location_detail', label: 'Location Detail', description: 'e.g. "Available Australia-wide"' },
    { type: 'string', name: 'response_time', label: 'Response Time Text' },
    { type: 'string', name: 'cta_text', label: 'Button Text' },
  ],
};

// ─── Pull Quote Block ──────────────────────────────────────────
export const pullQuoteBlock: Template = {
  name: 'pullQuoteBlock',
  label: 'Pull Quote',
  ui: { previewSrc: '/block-previews/pullQuoteBlock.svg', category: 'Content' },
  fields: [
    { type: 'string', name: 'quote', label: 'Quote', required: true, ui: { component: 'textarea' } },
    { type: 'string', name: 'attribution', label: 'Attribution' },
    {
      type: 'string',
      name: 'style',
      label: 'Style',
      options: [
        { value: 'default', label: 'Default' },
        { value: 'accent', label: 'Accent' },
        { value: 'large', label: 'Large Display' },
      ],
    },
  ],
};

// ─── Podcast Grid Block ────────────────────────────────────────
export const podcastGridBlock: Template = {
  name: 'podcastGridBlock',
  label: 'Podcast Grid',
  ui: { previewSrc: '/block-previews/podcastGridBlock.svg', category: 'Magazine' },
  fields: [
    { type: 'string', name: 'kicker', label: 'Section Kicker' },
    { type: 'string', name: 'heading', label: 'Heading' },
    { type: 'string', name: 'subheading', label: 'Subheading', ui: { component: 'textarea' } },
    {
      type: 'string',
      name: 'series',
      label: 'Filter by Series',
      description: 'Leave blank to show all',
    },
    { type: 'number', name: 'limit', label: 'Max Episodes', description: 'Leave blank for no limit' },
    {
      type: 'string',
      name: 'columns',
      label: 'Columns',
      options: [
        { value: '2', label: '2 Columns' },
        { value: '3', label: '3 Columns' },
        { value: '4', label: '4 Columns' },
      ],
    },
    { type: 'string', name: 'cta_text', label: 'CTA Text' },
    { type: 'string', name: 'cta_url', label: 'CTA URL', description: PAGE_HINT },
  ],
};

// ─── Newsletter Block ──────────────────────────────────────────
export const newsletterBlock: Template = {
  name: 'newsletterBlock',
  label: 'Newsletter Signup',
  ui: { previewSrc: '/block-previews/newsletterBlock.svg', category: 'Magazine' },
  fields: [
    { type: 'string', name: 'heading', label: 'Heading' },
    { type: 'string', name: 'subheading', label: 'Subheading', ui: { component: 'textarea' } },
    { type: 'string', name: 'placeholder', label: 'Email Placeholder' },
    { type: 'string', name: 'cta_text', label: 'Submit Button Text' },
    { type: 'string', name: 'success_message', label: 'Success Message' },
    {
      type: 'string',
      name: 'background',
      label: 'Background',
      options: [
        { value: 'default', label: 'Default' },
        { value: 'surface', label: 'Surface' },
        { value: 'accent', label: 'Accent' },
      ],
    },
  ],
};

// ─── Social Links Block ────────────────────────────────────────
export const socialLinksBlock: Template = {
  name: 'socialLinksBlock',
  label: 'Social Links',
  ui: { previewSrc: '/block-previews/socialLinksBlock.svg', category: 'Magazine' },
  fields: [
    { type: 'string', name: 'heading', label: 'Heading' },
    {
      type: 'object',
      name: 'links',
      label: 'Links',
      list: true,
      ui: {
        itemProps: (item: Record<string, string>) => ({ label: item?.platform || 'Link' }),
      },
      fields: [
        {
          type: 'string',
          name: 'platform',
          label: 'Platform',
          options: [
            { value: 'facebook', label: 'Facebook' },
            { value: 'instagram', label: 'Instagram' },
            { value: 'twitter', label: 'Twitter / X' },
            { value: 'linkedin', label: 'LinkedIn' },
            { value: 'youtube', label: 'YouTube' },
            { value: 'tiktok', label: 'TikTok' },
            { value: 'spotify', label: 'Spotify' },
            { value: 'email', label: 'Email' },
          ],
        },
        { type: 'string', name: 'url', label: 'URL' },
        { type: 'string', name: 'label', label: 'Label (optional)' },
      ],
    },
  ],
};

// ─── Contributor Grid Block ────────────────────────────────────
export const contributorGridBlock: Template = {
  name: 'contributorGridBlock',
  label: 'Contributor Grid',
  ui: { previewSrc: '/block-previews/contributorGridBlock.svg', category: 'Magazine' },
  fields: [
    { type: 'string', name: 'kicker', label: 'Section Kicker' },
    { type: 'string', name: 'heading', label: 'Heading' },
    { type: 'string', name: 'subheading', label: 'Subheading', ui: { component: 'textarea' } },
    { type: 'number', name: 'limit', label: 'Max Contributors' },
    {
      type: 'string',
      name: 'columns',
      label: 'Columns',
      options: [
        { value: '2', label: '2 Columns' },
        { value: '3', label: '3 Columns' },
        { value: '4', label: '4 Columns' },
      ],
    },
  ],
};

// ─── Song List Block (bands) ───────────────────────────────────
export const songListBlock: Template = {
  name: 'songListBlock',
  label: 'Song List',
  ui: { previewSrc: '/block-previews/songListBlock.svg', category: 'Music & Entertainment' },
  fields: [
    { type: 'string', name: 'heading', label: 'Heading' },
    { type: 'string', name: 'subheading', label: 'Subheading' },
    {
      type: 'object',
      name: 'songs',
      label: 'Songs',
      list: true,
      ui: {
        itemProps: (item: Record<string, string>) => ({ label: item?.title || 'Song' }),
      },
      fields: [
        { type: 'string', name: 'title', label: 'Title', required: true },
        { type: 'string', name: 'artist', label: 'Artist' },
        { type: 'string', name: 'year', label: 'Year' },
        { type: 'string', name: 'notes', label: 'Notes' },
      ],
    },
    {
      type: 'string',
      name: 'columns',
      label: 'Columns',
      options: [
        { value: '1', label: 'Single Column' },
        { value: '2', label: '2 Columns' },
        { value: '3', label: '3 Columns' },
      ],
    },
  ],
};

// ═══════════════════════════════════════════════════════════════
// Article & Podcast Layout Blocks (Magazine)
// ═══════════════════════════════════════════════════════════════

// ─── Featured Article Block ────────────────────────────────────
export const articleFeaturedBlock: Template = {
  name: 'articleFeaturedBlock',
  label: 'Featured Article',
  ui: { previewSrc: '/block-previews/articleFeaturedBlock.svg', category: 'Magazine' },
  fields: [
    { type: 'string', name: 'kicker', label: 'Section Kicker' },
    { type: 'string', name: 'heading', label: 'Heading' },
    {
      type: 'string',
      name: 'layout',
      label: 'Layout',
      options: [
        { value: 'hero', label: 'Hero (full-width image above)' },
        { value: 'split', label: 'Split (image left, text right)' },
        { value: 'overlay', label: 'Overlay (text over image)' },
      ],
    },
    {
      type: 'string',
      name: 'source',
      label: 'Article Source',
      description: 'Leave blank to auto-select the latest featured article, or enter a slug',
    },
    { type: 'boolean', name: 'show_category', label: 'Show Category Badge' },
    { type: 'boolean', name: 'show_author', label: 'Show Author' },
    { type: 'boolean', name: 'show_date', label: 'Show Date' },
    { type: 'boolean', name: 'show_excerpt', label: 'Show Excerpt' },
    { type: 'string', name: 'cta_text', label: 'CTA Text', description: 'e.g. "Read More"' },
  ],
};

// ─── Article List Block ────────────────────────────────────────
export const articleListBlock: Template = {
  name: 'articleListBlock',
  label: 'Article List',
  ui: { previewSrc: '/block-previews/articleListBlock.svg', category: 'Magazine' },
  fields: [
    { type: 'string', name: 'kicker', label: 'Section Kicker' },
    { type: 'string', name: 'heading', label: 'Heading' },
    { type: 'string', name: 'subheading', label: 'Subheading', ui: { component: 'textarea' } },
    {
      type: 'string',
      name: 'layout',
      label: 'Layout',
      options: [
        { value: 'cards', label: 'Card Grid' },
        { value: 'list', label: 'Compact List' },
        { value: 'magazine', label: 'Magazine (featured + grid)' },
        { value: 'newspaper', label: 'Newspaper (multi-column)' },
      ],
    },
    {
      type: 'string',
      name: 'category',
      label: 'Filter by Category',
      description: 'Leave blank for all categories',
      options: [
        { value: '', label: 'All Categories' },
        { value: 'arts', label: 'Arts & Culture' },
        { value: 'careers', label: 'Careers' },
        { value: 'fashion', label: 'Fashion & Style' },
        { value: 'food', label: 'Food & Lifestyle' },
        { value: 'health', label: 'Health & Wellness' },
        { value: 'relationships', label: 'Relationships' },
        { value: 'business', label: 'Business' },
        { value: 'news', label: 'News' },
      ],
    },
    { type: 'number', name: 'limit', label: 'Max Articles', description: 'Leave blank to show all' },
    {
      type: 'string',
      name: 'sort',
      label: 'Sort Order',
      options: [
        { value: 'newest', label: 'Newest First' },
        { value: 'oldest', label: 'Oldest First' },
        { value: 'featured', label: 'Featured First' },
      ],
    },
    { type: 'boolean', name: 'show_category_badges', label: 'Show Category Badges' },
    { type: 'boolean', name: 'show_author', label: 'Show Author' },
    { type: 'boolean', name: 'show_date', label: 'Show Date' },
    { type: 'boolean', name: 'show_excerpt', label: 'Show Excerpts' },
    { type: 'boolean', name: 'show_images', label: 'Show Images' },
    {
      type: 'string',
      name: 'columns',
      label: 'Columns (for grid/newspaper)',
      options: [
        { value: '2', label: '2 Columns' },
        { value: '3', label: '3 Columns' },
        { value: '4', label: '4 Columns' },
      ],
    },
    { type: 'string', name: 'cta_text', label: 'View All CTA Text' },
    { type: 'string', name: 'cta_url', label: 'View All URL', description: PAGE_HINT },
  ],
};

// ─── Article Carousel Block ────────────────────────────────────
export const articleCarouselBlock: Template = {
  name: 'articleCarouselBlock',
  label: 'Article Carousel',
  ui: { previewSrc: '/block-previews/articleCarouselBlock.svg', category: 'Magazine' },
  fields: [
    { type: 'string', name: 'kicker', label: 'Section Kicker' },
    { type: 'string', name: 'heading', label: 'Heading' },
    { type: 'string', name: 'subheading', label: 'Subheading', ui: { component: 'textarea' } },
    {
      type: 'string',
      name: 'category',
      label: 'Filter by Category',
      description: 'Leave blank for all',
    },
    { type: 'number', name: 'limit', label: 'Max Articles', description: 'Default: 8' },
    {
      type: 'string',
      name: 'card_style',
      label: 'Card Style',
      options: [
        { value: 'standard', label: 'Standard (image + text)' },
        { value: 'compact', label: 'Compact (thumbnail + title)' },
        { value: 'overlay', label: 'Overlay (text over image)' },
      ],
    },
    { type: 'boolean', name: 'autoplay', label: 'Auto-scroll' },
    { type: 'number', name: 'autoplay_interval', label: 'Interval (seconds)', description: 'Default: 5' },
  ],
};

// ─── Podcast Featured Block ────────────────────────────────────
export const podcastFeaturedBlock: Template = {
  name: 'podcastFeaturedBlock',
  label: 'Featured Podcast Episode',
  ui: { previewSrc: '/block-previews/podcastFeaturedBlock.svg', category: 'Magazine' },
  fields: [
    { type: 'string', name: 'kicker', label: 'Section Kicker' },
    { type: 'string', name: 'heading', label: 'Heading' },
    {
      type: 'string',
      name: 'layout',
      label: 'Layout',
      options: [
        { value: 'hero', label: 'Hero (large artwork + details)' },
        { value: 'inline', label: 'Inline (artwork left, details right)' },
        { value: 'minimal', label: 'Minimal (title + player only)' },
      ],
    },
    {
      type: 'string',
      name: 'source',
      label: 'Episode',
      description: 'Leave blank for latest episode, or enter a slug',
    },
    { type: 'string', name: 'series', label: 'Filter by Series' },
    { type: 'boolean', name: 'show_description', label: 'Show Description' },
    { type: 'boolean', name: 'show_guest', label: 'Show Guest Info' },
    { type: 'boolean', name: 'show_links', label: 'Show Listen Links' },
    { type: 'string', name: 'cta_text', label: 'CTA Text' },
    { type: 'string', name: 'cta_url', label: 'CTA URL', description: PAGE_HINT },
  ],
};

// ─── Category Navigation Block ─────────────────────────────────
export const categoryNavBlock: Template = {
  name: 'categoryNavBlock',
  label: 'Category Navigation',
  ui: { previewSrc: '/block-previews/categoryNavBlock.svg', category: 'Magazine' },
  fields: [
    { type: 'string', name: 'heading', label: 'Heading' },
    {
      type: 'string',
      name: 'style',
      label: 'Style',
      options: [
        { value: 'pills', label: 'Pill Buttons' },
        { value: 'tabs', label: 'Tab Bar' },
        { value: 'dropdown', label: 'Dropdown' },
        { value: 'cards', label: 'Category Cards (with images)' },
      ],
    },
    {
      type: 'object',
      name: 'categories',
      label: 'Categories',
      list: true,
      ui: {
        itemProps: (item: Record<string, string>) => ({ label: item?.label || 'Category' }),
      },
      fields: [
        { type: 'string', name: 'label', label: 'Label', required: true },
        { type: 'string', name: 'slug', label: 'Slug', required: true },
        { type: 'image', name: 'image', label: 'Image (for card style)' },
        { type: 'string', name: 'description', label: 'Description' },
        { type: 'number', name: 'count', label: 'Article Count (auto-filled at build)' },
      ],
    },
    { type: 'boolean', name: 'show_counts', label: 'Show Article Counts' },
    { type: 'string', name: 'base_url', label: 'Base URL', description: 'e.g. /articles' },
  ],
};

// ─── Expanding Hover List Block ────────────────────────────────
export const expandingHoverListBlock: Template = {
  name: 'expandingHoverListBlock',
  label: 'Expanding Hover List',
  ui: { previewSrc: '/block-previews/expandingHoverListBlock.svg', category: 'Cards & Grids' },
  fields: [
    { type: 'string', name: 'kicker', label: 'Section Kicker' },
    { type: 'string', name: 'heading', label: 'Heading' },
    { type: 'string', name: 'subheading', label: 'Subheading', ui: { component: 'textarea' } },
    { type: 'string', name: 'cta_text', label: 'CTA Text', description: 'Optional link shown top-right (e.g. "View the work")' },
    { type: 'string', name: 'cta_url', label: 'CTA URL', description: PAGE_HINT },
    {
      type: 'object',
      name: 'items',
      label: 'Items',
      list: true,
      ui: {
        itemProps: (item: Record<string, string>) => ({ label: item?.label || 'Item' }),
      },
      fields: [
        { type: 'string', name: 'label', label: 'Label', description: 'Short title (e.g. "Product focus")' },
        { type: 'string', name: 'description', label: 'Description', description: 'Revealed on hover', ui: { component: 'textarea' } },
      ],
    },
    {
      type: 'string',
      name: 'number_style',
      label: 'Number Style',
      options: [
        { value: 'padded', label: 'Padded (01, 02, …)' },
        { value: 'plain', label: 'Plain (1, 2, …)' },
      ],
    },
    {
      type: 'string',
      name: 'background',
      label: 'Background',
      options: [
        { value: 'default', label: 'Default' },
        { value: 'dark', label: 'Dark' },
        { value: 'accent', label: 'Accent / Tinted' },
      ],
    },
  ],
};

// Re-export heroSliderBlock from the sibling file.
export { heroSliderBlock } from './heroSlider';
