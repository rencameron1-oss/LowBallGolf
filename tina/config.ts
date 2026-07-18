import { defineConfig } from 'tinacms';
import { registerDynamicAdminLinks } from '@bands/ui/tina';
import testimonialCollection from './collections/testimonial';
import postCollection from './collections/post';
import pageCollection from './collections/page';
import homeCollection from './collections/home';
import navigationCollection from './collections/navigation';
import caseStudyCollection from './collections/caseStudy';
import siteSettingsCollection from './collections/siteSettings';
import { fontPreviewFieldPlugin } from './fields/fontPreviewSelect';

export default defineConfig({
  branch:
    process.env.GITHUB_BRANCH ||
    process.env.VERCEL_GIT_COMMIT_REF ||
    process.env.HEAD ||
    'main',
  clientId: process.env.TINA_CLIENT_ID || null,
  token: process.env.TINA_TOKEN || null,

  admin: {
    auth: {
      useLocalAuth: process.env.TINA_PUBLIC_IS_LOCAL === 'true',
    },
  },

  build: {
    outputFolder: 'admin',
    publicFolder: 'public',
    host: '127.0.0.1',
  },

  media: {
    tina: {
      mediaRoot: 'images',
      publicFolder: 'public',
    },
  },

  search: {
    tina: {
      indexerToken: process.env.TINA_SEARCH_TOKEN || '',
      stopwordLanguages: ['eng'],
    },
    indexBatchSize: 100,
    maxSearchIndexFieldLength: 100,
  },

  schema: {
    collections: [
      homeCollection,
      pageCollection,
      caseStudyCollection,
      postCollection,
      testimonialCollection,
      navigationCollection,
      siteSettingsCollection,
    ],
  },

  // "Live Data" sidebar group: register iframe-embedded admin pages here.
  // Lesson 2 (D1-backed contact submissions) will populate this list. The
  // helper is wired up now so colleagues only have to add a new entry to make
  // their first dynamic admin page show up inside Tina.
  cmsCallback: (cms) => {
    cms.fields.add(fontPreviewFieldPlugin);
    registerDynamicAdminLinks(cms, [
      // Example: once you add /src/pages/admin/messages.astro and a D1
      // database, uncomment this line and the entry appears in Tina's sidebar:
      // { name: 'Contact submissions', url: '/admin/messages', icon: 'M' },
    ]);
    return cms;
  },
});
