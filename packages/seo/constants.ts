/** SEO constants for Portfolio */

export const KEYWORDS = [
  "three.js",
  "react",
  "next.js",
  "portfolio",
  "developer",
  "web development",
];

export const APPLICATION_NAME = "Benjamin Wang Portfolio";
export const AUTHOR = {
  name: "Benjamin Wang",
  url: process.env.SITE_URL,
} as const;
export const CREATOR = "Benjamin Wang";
export const PUBLISHER = "Benjamin Wang";

export const REFERRER = "origin-when-cross-origin" as const;

export const ROBOTS = {
  index: true,
  follow: true,
  nocache: false,
  googleBot: {
    index: true,
    follow: true,
    noimageindex: false,
    "max-video-preview": -1,
    "max-image-preview": "large" as const,
    "max-snippet": -1,
  },
} as const;

export const ICONS = {
  icon: [
    { url: "/icon.png", sizes: "32x32", type: "image/png" },
    { url: "/icon.png", sizes: "16x16", type: "image/png" },
  ],
  apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
  shortcut: "/icon.png",
};

export const VERIFICATION = {
  yandex: process.env.YANDEX_SITE_VERIFICATION || "",
  yahoo: process.env.YAHOO_SITE_VERIFICATION || "",
} as const;

export const THEME_COLOR = "#000000";
export const MSAPPLICATION_TILE_COLOR = "#000000";

export const OPEN_GRAPH_DEFAULTS = {
  type: "website" as const,
  locale: "en_US" as const,
  siteName: APPLICATION_NAME,
} as const;

export const TWITTER_CARD_DEFAULTS = {
  card: "summary_large_image" as const,
} as const;

export const DEFAULT_IMAGE = {
  url: "/icon.png",
  width: 1200,
  height: 630,
  alt: "Benjamin Wang Portfolio",
  type: "image/png" as const,
} as const;

export const OTHER_META = {
  "theme-color": THEME_COLOR,
  "color-scheme": "dark",
  "apple-mobile-web-app-capable": "yes",
  "apple-mobile-web-app-status-bar-style": "default",
  "apple-mobile-web-app-title": APPLICATION_NAME,
  "application-name": APPLICATION_NAME,
  "msapplication-TileColor": MSAPPLICATION_TILE_COLOR,
  "msapplication-config": "/browserconfig.xml",
} as const;
