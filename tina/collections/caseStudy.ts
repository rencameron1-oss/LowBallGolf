import type { Collection } from 'tinacms';

const caseStudyCollection: Collection = {
  name: 'caseStudy',
  label: 'Case Studies',
  path: 'src/content/case_studies',
  format: 'md',
  ui: {
    router: ({ document }) => `/work/${document._sys.filename}`,
  },
  fields: [
    {
      type: 'string',
      name: 'title',
      label: 'Title',
      isTitle: true,
      required: true,
    },
    { type: 'string', name: 'client', label: 'Client', required: true },
    { type: 'string', name: 'year', label: 'Year', required: true },
    { type: 'string', name: 'role', label: 'Role', required: true },
    { type: 'string', name: 'summary', label: 'Summary', ui: { component: 'textarea' }, required: true },
    { type: 'image', name: 'hero_image', label: 'Hero Image' },
    { type: 'boolean', name: 'featured', label: 'Featured' },
    { type: 'number', name: 'order', label: 'Order' },
    { type: 'string', name: 'services', label: 'Services', list: true },
    {
      type: 'object',
      name: 'stats',
      label: 'Stats',
      list: true,
      fields: [
        { type: 'string', name: 'value', label: 'Value', required: true },
        { type: 'string', name: 'label', label: 'Label', required: true },
      ],
    },
    { type: 'string', name: 'external_url', label: 'External URL' },
    {
      type: 'rich-text',
      name: 'body',
      label: 'Body',
      isBody: true,
    },
    { type: 'string', name: 'seo_title', label: 'SEO Title' },
    { type: 'string', name: 'seo_description', label: 'SEO Description', ui: { component: 'textarea' } },
  ],
};

export default caseStudyCollection;
