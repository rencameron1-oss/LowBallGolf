import type { Collection } from 'tinacms';
import { heroSliderFields } from '@bands/ui/tina';
import { pageBlocks } from './blocks';

const homeCollection: Collection = {
  name: 'home',
  label: 'Homepage',
  path: 'src/content/home',
  format: 'md',
  ui: {
    allowedActions: {
      create: false,
      delete: false,
    },
    router: () => '/',
  },
  fields: [
    {
      type: 'string',
      name: 'title',
      label: 'Title (internal)',
      isTitle: true,
      required: true,
    },
    {
      type: 'object',
      name: 'hero',
      label: 'Hero Slider',
      description:
        'The main homepage hero is now a true slider with one or more slides. Open a slide under Slides to edit its Background Image, Feature Image / Portrait, video, badges, and overlay panels.',
      fields: heroSliderFields,
    },
    pageBlocks,
    { type: 'string', name: 'seo_title', label: 'SEO Title' },
    { type: 'string', name: 'seo_description', label: 'SEO Description', ui: { component: 'textarea' } },
  ],
};

export default homeCollection;
