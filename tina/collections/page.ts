import type { Collection } from 'tinacms';
import { pageBlocks } from './blocks';
import { heroSliderFields } from '@bands/ui/tina';

const pageCollection: Collection = {
  name: 'page',
  label: 'Pages',
  path: 'src/content/pages',
  format: 'md',
  ui: {
    router: ({ document }) => {
      const path = document._sys.relativePath?.replace('.md', '') || document._sys.filename;
      return `/${path.toLowerCase()}`;
    },
  },
  fields: [
    {
      type: 'string',
      name: 'title',
      label: 'Page Title',
      isTitle: true,
      required: true,
    },
    { type: 'string', name: 'hero_heading', label: 'Hero Heading' },
    { type: 'string', name: 'hero_subheading', label: 'Hero Subheading', ui: { component: 'textarea' } },
    { type: 'image', name: 'hero_image', label: 'Hero Image' },
    {
      type: 'object',
      name: 'hero_slider',
      label: 'Hero Slider',
      description: 'Optional creative slider shown at the top of the page. If slides are added here, this replaces the simple page hero.',
      fields: heroSliderFields,
    },
    { type: 'string', name: 'intro', label: 'Intro', ui: { component: 'textarea' } },
    {
      type: 'rich-text',
      name: 'body',
      label: 'Body',
      isBody: true,
    },
    pageBlocks,
    { type: 'string', name: 'seo_title', label: 'SEO Title' },
    { type: 'string', name: 'seo_description', label: 'SEO Description', ui: { component: 'textarea' } },
  ],
};

export default pageCollection;
