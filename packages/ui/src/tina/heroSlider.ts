import type { Template, TinaField } from 'tinacms';

const PAGE_LIST =
  'Enter a site path (e.g. /about) or full URL';
const HERO_VIDEO_HELP =
  'Optional path to an .mp4 or .webm inside /public, for example /videos/hero/reel.mp4';
const IMAGE_FIELD_HELP =
  'Use a file from /public. Overlay panels can use an image, or a short .mp4/.webm path entered manually. Blank values are treated as empty so you can safely remove and replace slide artwork.';

const normalizeOptionalImageValue = (value: any) => {
  if (typeof value === 'string') {
    const normalized = value.trim();
    return normalized.length > 0 ? normalized : undefined;
  }

  return value || undefined;
};

const optionalImageUi = {
  parse: normalizeOptionalImageValue,
  format: normalizeOptionalImageValue,
};

export const heroLayoutOptions = [
  { value: 'dot-grid', label: 'Dot Reveal' },
  { value: 'poster', label: 'Poster Wall' },
  { value: 'mural', label: 'Image-led Mural' },
  { value: 'parallax', label: 'Parallax Stage' },
  { value: 'video', label: 'Video Stage' },
];

export const heroThemeOptions = [
  { value: 'dark', label: 'Dark' },
  { value: 'light', label: 'Light' },
];

export const heroEffectOptions = [
  { value: 'particles', label: 'Particles' },
  { value: 'grid', label: 'Grid' },
  { value: 'orbs', label: 'Glow Orbs' },
  { value: 'scanlines', label: 'Scanlines' },
  { value: 'mobile-glow', label: 'Mobile Glow' },
];

export const heroHeadingFontOptions = [
  { value: 'site', label: 'Site hero font' },
  { value: 'heading', label: 'Site heading font' },
  { value: 'body', label: 'Site body font' },
  { value: 'logo', label: 'Logo font' },
];

export const heroHeadingSizeOptions = [
  { value: 'compact', label: 'Compact' },
  { value: 'balanced', label: 'Balanced' },
  { value: 'statement', label: 'Statement' },
];

export const heroPanelFields: TinaField[] = [
  {
    type: 'string',
    name: 'kind',
    label: 'Panel Kind',
    required: true,
    options: [
      { value: 'image', label: 'Image' },
      { value: 'type', label: 'Type' },
    ],
  },
  {
    type: 'string',
    name: 'variant',
    label: 'Panel Style',
    options: [
      { value: 'landscape', label: 'Landscape' },
      { value: 'support', label: 'Support' },
      { value: 'note', label: 'Note' },
      { value: 'type', label: 'Type' },
      { value: 'manifesto', label: 'Manifesto' },
    ],
  },
  { type: 'string', name: 'label', label: 'Label' },
  {
    type: 'string',
    name: 'title',
    label: 'Title',
    required: true,
    ui: { component: 'textarea' },
  },
  {
    type: 'string',
    name: 'meta',
    label: 'Supporting Text',
    ui: { component: 'textarea' },
  },
  {
    type: 'image',
    name: 'image',
    label: 'Image / Video',
    description: IMAGE_FIELD_HELP,
    ui: optionalImageUi,
  },
  {
    type: 'string',
    name: 'top',
    label: 'Top Position',
    description: 'CSS value such as 8% or 7rem',
  },
  {
    type: 'string',
    name: 'left',
    label: 'Left Position',
    description: 'CSS value such as 62% or 2rem',
  },
  {
    type: 'string',
    name: 'width',
    label: 'Width',
    description: 'CSS value such as 18% or 14rem',
  },
  {
    type: 'string',
    name: 'rotate',
    label: 'Rotation',
    description: 'CSS angle such as -4deg',
  },
];

export const graffitiFields: TinaField[] = [
  { type: 'string', name: 'text', label: 'Text', required: true },
  {
    type: 'string',
    name: 'top',
    label: 'Top Position',
    description: 'CSS value such as 16%',
  },
  {
    type: 'string',
    name: 'left',
    label: 'Left Position',
    description: 'CSS value such as 72%',
  },
  {
    type: 'string',
    name: 'rotate',
    label: 'Rotation',
    description: 'CSS angle such as 5deg',
  },
];

export const heroSlideFields: TinaField[] = [
  {
    type: 'string',
    name: 'name',
    label: 'Slide Name',
    description: 'Internal label shown in Tina for this slide.',
  },
  {
    type: 'string',
    name: 'tab_label',
    label: 'Tab Label',
    description: 'Short label used in the slider navigation. Defaults to the slide name or heading.',
  },
  {
    type: 'number',
    name: 'duration_seconds',
    label: 'Slide Duration (seconds)',
    description: 'How long this slide should stay active before rotating. Leave empty to use the slider default.',
  },
  {
    type: 'string',
    name: 'layout',
    label: 'Layout',
    required: true,
    options: heroLayoutOptions,
  },
  {
    type: 'string',
    name: 'theme',
    label: 'Theme',
    options: heroThemeOptions,
  },
  {
    type: 'string',
    name: 'effects',
    label: 'Overlay Effects',
    list: true,
    options: heroEffectOptions,
    description:
      'Stack subtle overlays like particles, grid lines, glow orbs, scanlines, or a mobile-only glow on top of the slide.',
  },
  {
    type: 'string',
    name: 'eyebrow',
    label: 'Eyebrow',
    description: 'Small label above the slide heading.',
  },
  {
    type: 'string',
    name: 'heading',
    label: 'Heading',
    required: true,
    ui: { component: 'textarea' },
  },
  {
    type: 'string',
    name: 'heading_font',
    label: 'Heading Font',
    description: 'Choose which site font this hero slide should use.',
    options: heroHeadingFontOptions,
  },
  {
    type: 'string',
    name: 'heading_size',
    label: 'Heading Size',
    description: 'Use Compact for longer headings so the words breathe.',
    options: heroHeadingSizeOptions,
  },
  {
    type: 'string',
    name: 'subheading',
    label: 'Subheading',
    required: true,
    ui: { component: 'textarea' },
  },
  {
    type: 'image',
    name: 'background_image',
    label: 'Background Image',
    description: `Main full-bleed image for this slide. ${IMAGE_FIELD_HELP}`,
    ui: optionalImageUi,
  },
  {
    type: 'image',
    name: 'image',
    label: 'Feature Image / Portrait',
    description: `Optional portrait or feature image that sits above the background. ${IMAGE_FIELD_HELP}`,
    ui: optionalImageUi,
  },
  {
    type: 'string',
    name: 'video_url',
    label: 'Background Video URL',
    description: HERO_VIDEO_HELP,
  },
  {
    type: 'image',
    name: 'video_poster_image',
    label: 'Video Poster Image',
    description: `Fallback image shown before the video loads, or when no video is available. ${IMAGE_FIELD_HELP}`,
    ui: optionalImageUi,
  },
  {
    type: 'string',
    name: 'badges',
    label: 'Badges',
    list: true,
  },
  {
    type: 'object',
    name: 'panels',
    label: 'Overlay Panels',
    description: 'Floating image or type panels layered on top of the slide.',
    list: true,
    ui: {
      itemProps: (item: Record<string, string>) => ({
        label: item?.title || item?.label || 'Overlay panel',
      }),
    },
    fields: heroPanelFields,
  },
  {
    type: 'object',
    name: 'graffiti',
    label: 'Graffiti Notes',
    description: 'Loose handwritten notes used by the poster and mural layouts.',
    list: true,
    ui: {
      itemProps: (item: Record<string, string>) => ({
        label: item?.text || 'Graffiti note',
      }),
    },
    fields: graffitiFields,
  },
  {
    type: 'string',
    name: 'primary_cta_text',
    label: 'Primary CTA Text',
    description: 'Optional per-slide override. Leave empty to use the slider default.',
  },
  {
    type: 'string',
    name: 'primary_cta_url',
    label: 'Primary CTA URL',
    description: `Optional per-slide override. ${PAGE_LIST}`,
  },
  {
    type: 'string',
    name: 'secondary_cta_text',
    label: 'Secondary CTA Text',
    description: 'Optional per-slide override. Leave empty to use the slider default.',
  },
  {
    type: 'string',
    name: 'secondary_cta_url',
    label: 'Secondary CTA URL',
    description: `Optional per-slide override. ${PAGE_LIST}`,
  },
];

export const heroSliderFields: TinaField[] = [
  {
    type: 'number',
    name: 'autoplay_seconds',
    label: 'Default Autoplay Seconds',
    description:
      'Fallback timing for the slider. Each slide can override this with its own duration. Use 0 to disable autoplay.',
  },
  {
    type: 'string',
    name: 'primary_cta_text',
    label: 'Default Primary CTA Text',
  },
  {
    type: 'string',
    name: 'primary_cta_url',
    label: 'Default Primary CTA URL',
    description: PAGE_LIST,
  },
  {
    type: 'string',
    name: 'secondary_cta_text',
    label: 'Default Secondary CTA Text',
  },
  {
    type: 'string',
    name: 'secondary_cta_url',
    label: 'Default Secondary CTA URL',
    description: PAGE_LIST,
  },
  {
    type: 'object',
    name: 'slides',
    label: 'Slides',
    description:
      'Build the slider with one or more slides. Open a slide item to edit its Background Image, Feature Image / Portrait, video, badges, and overlay panels.',
    list: true,
    ui: {
      itemProps: (item: Record<string, string>) => ({
        label: item?.name || item?.tab_label || item?.heading || 'Hero slide',
      }),
    },
    fields: heroSlideFields,
  },
];

export const heroSliderBlock: Template = {
  name: 'heroSliderBlock',
  label: 'Hero Slider',
  ui: { previewSrc: '/block-previews/heroSliderBlock.svg', category: 'Heroes & Banners' },
  fields: heroSliderFields,
};
