import type { Template } from 'tinacms';
import {
  // Heroes & Banners
  heroBlock,
  heroSliderBlock,
  ctaBannerBlock,
  fullWidthImageBlock,
  // Content
  richTextBlock,
  imageTextBlock,
  pullQuoteBlock,
  faqBlock,
  // Cards & Grids
  featureCardsBlock,
  expandingHoverListBlock,
  showcaseGridBlock,
  articleGridBlock,
  brandGridBlock,
  tabbedFeatureBlock,
  testimonialGridBlock,
  // Media
  videoEmbedBlock,
  galleryBlock,
  // Magazine
  podcastGridBlock,
  newsletterBlock,
  contributorGridBlock,
  socialLinksBlock,
  articleFeaturedBlock,
  articleListBlock,
  articleCarouselBlock,
  podcastFeaturedBlock,
  categoryNavBlock,
  // People & Testimonials
  testimonialHighlightBlock,
  teamBlock,
  // Music & Entertainment
  songListBlock,
  // Layout & Utility
  spacerBlock,
  contactInfoBlock,
  statsBlock,
} from '@bands/ui/tina';

const PAGE_HINT = 'Enter a site path (e.g. /about) or full URL';

// Local block: auto-lists case studies from the caseStudies collection.
const caseStudyListBlock: Template = {
  name: 'caseStudyListBlock',
  label: 'Case Study List',
  ui: { category: 'Cards & Grids' },
  fields: [
    { type: 'string', name: 'kicker', label: 'Section Kicker' },
    { type: 'string', name: 'heading', label: 'Heading' },
    { type: 'string', name: 'subheading', label: 'Subheading', ui: { component: 'textarea' } },
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
    { type: 'number', name: 'limit', label: 'Limit', description: 'Max number to show (leave empty for all)' },
    { type: 'string', name: 'cta_text', label: 'CTA Text', description: 'e.g. "View All" — leave empty for no button' },
    { type: 'string', name: 'cta_url', label: 'CTA URL', description: PAGE_HINT },
  ],
};

// Full superset — every canonical block is available in the palette.
// Categories group them in the visual selector via ui.category on each template.
export const blockTemplates: Template[] = [
  // Heroes & Banners
  heroBlock,
  heroSliderBlock,
  ctaBannerBlock,
  fullWidthImageBlock,
  // Content
  richTextBlock,
  imageTextBlock,
  pullQuoteBlock,
  faqBlock,
  // Cards & Grids
  featureCardsBlock,
  expandingHoverListBlock,
  showcaseGridBlock,
  articleGridBlock,
  brandGridBlock,
  tabbedFeatureBlock,
  caseStudyListBlock,
  testimonialGridBlock,
  // Media
  videoEmbedBlock,
  galleryBlock,
  // Magazine
  podcastGridBlock,
  newsletterBlock,
  contributorGridBlock,
  socialLinksBlock,
  articleFeaturedBlock,
  articleListBlock,
  articleCarouselBlock,
  podcastFeaturedBlock,
  categoryNavBlock,
  // People & Testimonials
  testimonialHighlightBlock,
  teamBlock,
  // Music & Entertainment
  songListBlock,
  // Layout & Utility
  spacerBlock,
  contactInfoBlock,
  statsBlock,
];

export const pageBlocks = {
  type: 'object' as const,
  name: 'blocks',
  label: 'Components',
  description: 'Add, reorder, and duplicate reusable page components.',
  list: true,
  ui: {
    visualSelector: true,
  },
  templates: blockTemplates,
};
