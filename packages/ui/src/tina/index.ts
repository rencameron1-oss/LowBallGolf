// @bands/ui/tina — shared Tina schema fragments.
// Every canonical block template is exported so each site can compose its palette.
export {
  // Common blocks
  heroBlock,
  richTextBlock,
  imageTextBlock,
  fullWidthImageBlock,
  videoEmbedBlock,
  testimonialHighlightBlock,
  statsBlock,
  galleryBlock,
  ctaBannerBlock,
  faqBlock,
  featureCardsBlock,
  expandingHoverListBlock,
  testimonialGridBlock,
  teamBlock,
  spacerBlock,
  contactInfoBlock,
  // Advanced blocks
  showcaseGridBlock,
  articleGridBlock,
  brandGridBlock,
  tabbedFeatureBlock,
  heroSliderBlock,
  // Magazine blocks
  pullQuoteBlock,
  podcastGridBlock,
  newsletterBlock,
  socialLinksBlock,
  contributorGridBlock,
  // Music and entertainment
  songListBlock,
  // Article & Podcast layouts (Magazine)
  articleFeaturedBlock,
  articleListBlock,
  articleCarouselBlock,
  podcastFeaturedBlock,
  categoryNavBlock,
} from './blocks';

// Hero slider field fragments (for composing into collection-level fields)
export {
  heroLayoutOptions,
  heroThemeOptions,
  heroEffectOptions,
  heroHeadingFontOptions,
  heroHeadingSizeOptions,
  heroPanelFields,
  graffitiFields,
  heroSlideFields,
  heroSliderFields,
} from './heroSlider';

// "Live Data" sidebar entries: wrap a site's dynamic admin pages inside Tina
// via iframe so editors don't have to leave the CMS to view submissions,
// availability, products, etc.
export {
  registerDynamicAdminLinks,
  type DynamicAdminLink,
} from './dynamicAdminLinks';
