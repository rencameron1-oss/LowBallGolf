const defaultEffectsByLayout: Record<string, string[]> = {
  'dot-grid': ['grid'],
  poster: ['orbs'],
  mural: ['particles'],
  parallax: ['particles', 'grid'],
  video: ['scanlines'],
};

const normalizeEffects = (layout: string, effects: string[] = []) => {
  if (effects.length > 0) {
    return effects;
  }

  return defaultEffectsByLayout[layout] ?? [];
};

const heroHeadingFontValues = ['site', 'heading', 'body', 'logo'];
const heroHeadingSizeValues = ['compact', 'balanced', 'statement'];

const normalizeOption = (value: unknown, allowedValues: string[], fallback: string) =>
  typeof value === 'string' && allowedValues.includes(value) ? value : fallback;

export const normalizeHeroSlides = (sliderContent: any = {}) => {
  const slides = Array.isArray(sliderContent?.slides) ? sliderContent.slides : [];

  return slides.map((slide: any, index: number) => ({
    id: slide?.name
      ? slide.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
      : `hero-slide-${index + 1}`,
    name: slide?.name || '',
    layout: slide?.layout || 'mural',
    theme: slide?.theme || (slide?.layout === 'dot-grid' ? 'light' : 'dark'),
    durationSeconds: slide?.duration_seconds ?? sliderContent?.autoplay_seconds ?? 7,
    backgroundImage: slide?.background_image || '',
    image: slide?.image || '',
    videoUrl: slide?.video_url || '',
    videoPosterImage: slide?.video_poster_image || slide?.background_image || '',
    effects: normalizeEffects(slide?.layout || 'mural', slide?.effects ?? []),
    tab: slide?.tab_label || slide?.name || `Slide ${index + 1}`,
    eyebrow: slide?.eyebrow || '',
    heroHeading: slide?.heading || '',
    heroText: slide?.subheading || '',
    headingFont: normalizeOption(slide?.heading_font, heroHeadingFontValues, 'site'),
    headingSize: normalizeOption(slide?.heading_size, heroHeadingSizeValues, 'balanced'),
    badges: slide?.badges ?? [],
    posters: slide?.panels ?? [],
    graffiti: slide?.graffiti ?? [],
    primaryCtaText: slide?.primary_cta_text || sliderContent?.primary_cta_text || '',
    primaryCtaUrl: slide?.primary_cta_url || sliderContent?.primary_cta_url || '',
    secondaryCtaText: slide?.secondary_cta_text || sliderContent?.secondary_cta_text || '',
    secondaryCtaUrl: slide?.secondary_cta_url || sliderContent?.secondary_cta_url || '',
  }));
};
