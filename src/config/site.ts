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
  name: "LowballGolf",
  tagline: "A clear website built with an AI coding agent",
  description:
    "LowballGolf is a modern editable website built with Astro, TinaCMS, GitHub and Netlify.",
  url: "https://lowballgolf.com.au",
  locale: 'en-AU',
  timezone: 'Australia/Melbourne',
  logo: {
    icon: '/favicon.svg',
    wordmark: "LowballGolf",
  },
  social: {
    email: "rencameron@lowballgolf.com.au",
  },
  theme: {
    primaryColor: '#f5f1e8',
    accentColor: '#2f7d6d',
  },
  booking: {
    ctaText: 'Compare Prices',
    ctaUrl: '/clubs',
    emailSubject: "Enquiry from LowballGolf",
  },
  seo: {
    titleTemplate: "%s | LowballGolf",
    defaultOgImage: '/images/starter-hero.png',
  },
};

export default siteConfig;
