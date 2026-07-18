// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

const isLocalTinaDev = process.env.TINA_PUBLIC_IS_LOCAL === 'true';
const tinaAdminProxy = isLocalTinaDev
  ? {
      '/admin': {
        target: 'http://127.0.0.1:4010',
        changeOrigin: true,
        ws: true,
      },
    }
  : undefined;

// https://astro.build/config
export default defineConfig({
  site: process.env.PUBLIC_SITE_URL || 'https://example.com',
  output: 'static',
  server: {
    host: '0.0.0.0', // Expose on network
    port: 4330
  },
  vite: {
    plugins: [tailwindcss()],
    server: {
      proxy: tinaAdminProxy,
    },
    ssr: {
      noExternal: ['@bands/ui'],
    },
  },
  integrations: [sitemap()],
  redirects: {
    '/home': '/',
    '/admin': '/admin/index.html',
    '/contact-us': '/contact'
  },
});
