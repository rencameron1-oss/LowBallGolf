import type { Collection } from 'tinacms';

const PAGE_LIST = 'Pages: / /about /work /writing /contact /posts /work/ssw-melbourne-growth /work/excel-australasia-brand-central /work/venture-and-brand-platforms';

const navigationCollection: Collection = {
  name: 'navigation',
  label: 'Navigation',
  path: 'src/content/navigation',
  format: 'json',
  ui: {
    allowedActions: {
      create: false,
      delete: false,
    },
    global: true,
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
      name: 'items',
      label: 'Menu Items',
      list: true,
      ui: {
        itemProps: (item: Record<string, any>) => ({
          label: item?.label || 'Menu Item',
        }),
      },
      fields: [
        { type: 'string', name: 'label', label: 'Label', required: true },
        { type: 'string', name: 'href', label: 'URL', required: true, description: PAGE_LIST },
        {
          type: 'object',
          name: 'children',
          label: 'Submenu Items',
          list: true,
          ui: {
            itemProps: (item: Record<string, any>) => ({
              label: item?.label || 'Submenu Item',
            }),
          },
          fields: [
            { type: 'string', name: 'label', label: 'Label', required: true },
            { type: 'string', name: 'href', label: 'URL', required: true, description: PAGE_LIST },
          ],
        },
      ],
    },
  ],
};

export default navigationCollection;
