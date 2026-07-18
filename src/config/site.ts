export interface SiteConfig {
  name: string;
  tagline: string;
  description: string;
  url: string;
  locale: string;
  timezone: string;
  logo: {
    light?: string;
    dark?: string;
    icon: string;
    wordmark: string;
  };
  social: {
    linkedin?: string;
    facebook?: string;
    instagram?: string;
    youtube?: string;
    tiktok?: string;
    email: string;
    phone?: string;
  };
  theme: {
    primaryColor: string;
    accentColor: string;
  };
  booking: {
    ctaText: string;
    ctaUrl: string;
    emailSubject: string;
  };
  seo: {
    titleTemplate: string;
    defaultOgImage: string;
  };
}

const siteConfig: SiteConfig = {
  name: 'Agentic Site Starter',
  tagline: 'A clean, editable website starter for people learning to build with AI coding agents.',
  description:
    'Agentic Site Starter is a transportable Astro and TinaCMS website template designed for novice creators using GitHub, Cloudflare, and AI coding agents.',
  url: 'https://example.com',
  locale: 'en-AU',
  timezone: 'Australia/Melbourne',
  logo: {
    icon: '/favicon.svg',
    wordmark: 'Agentic Starter',
  },
  social: {
    email: 'hello@example.com',
  },
  theme: {
    primaryColor: '#f5f1e8',
    accentColor: '#2f7d6d',
  },
  booking: {
    ctaText: 'Start Editing',
    ctaUrl: '/contact',
    emailSubject: 'Website enquiry',
  },
  seo: {
    titleTemplate: '%s | Agentic Site Starter',
    defaultOgImage: '/images/starter-hero.png',
  },
};

export default siteConfig;
