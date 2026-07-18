/**
 * Cloudflare Worker entry.
 *
 * Static pages are served from `./dist` (Astro's build output) via the
 * ASSETS binding. Anything that needs a real backend — like the contact
 * form — is routed here first.
 *
 * If you add another dynamic feature later, register a new handler at the
 * top of `fetch()` the same way `/api/contact` is wired below.
 */

import { handleContact } from './worker/contact';
import type { Env as ContactEnv } from './worker/contact';

export interface Env extends ContactEnv {
  ASSETS: Fetcher;
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === '/api/contact' || url.pathname.startsWith('/api/contact/')) {
      try {
        const res = await handleContact(request, env, url.pathname, ctx);
        if (res) return res;
        return new Response('Not Found', { status: 404 });
      } catch (err) {
        console.error('contact worker error', err);
        return new Response(JSON.stringify({ error: 'internal error' }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        });
      }
    }

    // Any other /api/* path is a routing miss — return uncacheable JSON 404
    // so the static 404.html page doesn't get edge-cached and mask new endpoints.
    if (url.pathname.startsWith('/api/')) {
      return new Response(JSON.stringify({ error: 'Not Found' }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store',
        },
      });
    }

    return env.ASSETS.fetch(request);
  },
};
