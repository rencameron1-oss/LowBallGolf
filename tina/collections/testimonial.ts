import type { Collection } from 'tinacms';

const testimonialCollection: Collection = {
  name: 'testimonial',
  label: 'Testimonials',
  path: 'src/content/testimonials',
  format: 'md',
  fields: [
    {
      type: 'string',
      name: 'author_name',
      label: 'Author Name',
      isTitle: true,
      required: true,
    },
    { type: 'string', name: 'author_role', label: 'Role / Title' },
    { type: 'string', name: 'organisation', label: 'Organisation' },
    { type: 'image', name: 'author_image', label: 'Author Image' },
    { type: 'string', name: 'quote', label: 'Quote', ui: { component: 'textarea' }, required: true },
    {
      type: 'string',
      name: 'source',
      label: 'Source',
      options: [
        { value: 'client', label: 'Client' },
        { value: 'colleague', label: 'Colleague' },
        { value: 'partner', label: 'Partner' },
      ],
    },
    { type: 'boolean', name: 'featured', label: 'Featured' },
    { type: 'number', name: 'order', label: 'Display Order' },
    {
      type: 'rich-text',
      name: 'body',
      label: 'Long Form Testimonial',
      isBody: true,
    },
  ],
};

export default testimonialCollection;
