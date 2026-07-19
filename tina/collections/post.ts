import type { Collection } from 'tinacms';
import { pageBlocks } from './blocks';

const postCollection: Collection = {
  name: 'post',
  label: 'Writing',
  path: 'src/content/posts',
  format: 'md',
  ui: {
    router: ({ document }) => `/posts/${document._sys.filename}`,
  },
  fields: [
    {
      type: 'string',
      name: 'title',
      label: 'Title',
      isTitle: true,
      required: true,
    },
    { type: 'boolean', name: 'draft', label: 'Draft' },
    { type: 'datetime', name: 'pubDate', label: 'Publish Date', required: true },
    { type: 'datetime', name: 'updatedDate', label: 'Updated Date' },
    { type: 'string', name: 'author', label: 'Author' },
    { type: 'string', name: 'excerpt', label: 'Excerpt', ui: { component: 'textarea' }, required: true },
    { type: 'image', name: 'hero_image', label: 'Hero Image' },
    {
      type: 'string',
      name: 'category',
      label: 'Category',
      options: [
        { value: 'guides', label: 'Guides' },
        { value: 'deals', label: 'Deals' },
        { value: 'reviews', label: 'Reviews' },
        { value: 'news', label: 'News' },
      ],
    },
    { type: 'string', name: 'tags', label: 'Tags', list: true },
    { type: 'boolean', name: 'featured', label: 'Featured' },
    { type: 'number', name: 'order', label: 'Order' },
    {
      type: 'rich-text',
      name: 'body',
      label: 'Body',
      isBody: true,
    },
    pageBlocks,
    { type: 'string', name: 'related_posts', label: 'Related Posts', list: true },
    { type: 'string', name: 'seo_title', label: 'SEO Title' },
    { type: 'string', name: 'seo_description', label: 'SEO Description', ui: { component: 'textarea' } },
  ],
};

export default postCollection;
