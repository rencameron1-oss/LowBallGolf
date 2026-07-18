/**
 * Register sidebar entries inside the TinaCMS admin that open a site's own
 * dynamic admin pages (contact submissions, member availability, products,
 * etc.) inside an iframe.
 *
 * Each site's `tina/config.ts` calls `registerDynamicAdminLinks(cms, [...])`
 * from inside `cmsCallback`. Sites with no dynamic pages pass an empty list
 * and nothing extra appears in Tina's sidebar.
 *
 * Why iframes? The dynamic admin pages are real Astro routes served by the
 * same Worker on the same origin. Embedding them inside Tina via iframe means:
 *   - The colleague never has to leave Tina to view live data.
 *   - Existing cookie-based auth on the dynamic pages keeps working.
 *   - Each admin page can keep its own UI without being rebuilt as a Tina
 *     plugin. They are just normal pages.
 *
 * If a site grows beyond ~7 dynamic admin sections, replace the flat list with
 * a launcher screen that lets editors pick one. Until then this stays simple.
 */
import { createElement } from 'react';

export interface DynamicAdminLink {
  /** Sidebar label shown to the editor, e.g. "Contact submissions". */
  name: string;
  /** Same-origin path to iframe, e.g. "/admin/contacts". */
  url: string;
  /** Optional short string shown as the sidebar icon. */
  icon?: string;
  /** Optional ordering hint (lower numbers float to the top). */
  weight?: number;
}

const iframeStyle = {
  display: 'block',
  width: '100%',
  height: '100%',
  border: 0,
};

const iconStyle = {
  fontSize: '1.1em',
  display: 'inline-block',
  lineHeight: 1,
};

export const registerDynamicAdminLinks = (
  cms: { plugins: { add: (plugin: unknown) => void } },
  links: DynamicAdminLink[]
): void => {
  // Sort by optional weight so editors get a stable order regardless of how
  // each site's config lists them.
  const sorted = [...links].sort(
    (a, b) => (a.weight ?? 0) - (b.weight ?? 0)
  );

  for (const link of sorted) {
    cms.plugins.add({
      __type: 'screen',
      name: link.name,
      // Group the entries together in the sidebar under "Live data" so they
      // sit apart from the content collections.
      navCategory: 'Live Data',
      Icon: () =>
        createElement('span', { style: iconStyle }, link.icon ?? 'LD'),
      Component: () =>
        createElement('iframe', {
          src: link.url,
          title: link.name,
          style: iframeStyle,
        }),
      layout: 'fullscreen',
    });
  }
};
