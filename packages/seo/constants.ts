/** SEO constants for Portfolio */

export const KEYWORDS = [
  "three.js",
  "react",
  "next.js",
  "portfolio",
  "developer",
  "web development",
  "benjamin wang",
  "ben",
  "benjamin wang jiayuan",
  "nus",
  "computer science",
  "national university of singapore",
  "cs",
  "singapore",
  "swe",
  "aumovio",
  "cvwo",
  "software engineer",
];

export const SITE_URL = "https://codedbyben.com";

export const APPLICATION_NAME = "Benjamin Wang Jiayuan Portfolio";
export const AUTHOR = {
  name: "Benjamin Wang",
  url: SITE_URL,
} as const;
export const CREATOR = "Benjamin Wang";
export const PUBLISHER = "Benjamin Wang";

export const REFERRER = "origin-when-cross-origin" as const;

export const ROBOTS = {
  follow: true,
  googleBot: {
    follow: true,
    index: true,
    "max-image-preview": "large" as const,
    "max-snippet": -1,
    "max-video-preview": -1,
    noimageindex: false,
  },
  index: true,
  nocache: false,
} as const;

export const ICONS = {
  apple: [{ sizes: "180x180", type: "image/png", url: "/apple-icon.png" }],
  icon: [
    { sizes: "32x32", type: "image/png", url: "/icon.png" },
    { sizes: "16x16", type: "image/png", url: "/icon.png" },
  ],
  shortcut: "/icon.png",
};

export const VERIFICATION = {
  yahoo: process.env.YAHOO_SITE_VERIFICATION || "",
  yandex: process.env.YANDEX_SITE_VERIFICATION || "",
} as const;

export const THEME_COLOR = "#000000";
export const MSAPPLICATION_TILE_COLOR = "#000000";

export const OPEN_GRAPH_DEFAULTS = {
  locale: "en_US" as const,
  siteName: APPLICATION_NAME,
  type: "website" as const,
} as const;

export const TWITTER_CARD_DEFAULTS = {
  card: "summary_large_image" as const,
} as const;

export const DEFAULT_IMAGE = {
  alt: "Benjamin Wang Portfolio",
  height: 630,
  type: "image/png" as const,
  url: "/api/og",
  width: 1200,
} as const;

export const OTHER_META = {
  "apple-mobile-web-app-capable": "yes",
  "apple-mobile-web-app-status-bar-style": "default",
  "apple-mobile-web-app-title": APPLICATION_NAME,
  "application-name": APPLICATION_NAME,
  "color-scheme": "dark",
  "msapplication-TileColor": MSAPPLICATION_TILE_COLOR,
  "msapplication-config": "/browserconfig.xml",
  "theme-color": THEME_COLOR,
} as const;
