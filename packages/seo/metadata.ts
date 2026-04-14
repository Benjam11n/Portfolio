import merge from "lodash.merge";
import type { Metadata } from "next";

import {
  APPLICATION_NAME,
  AUTHOR,
  CREATOR,
  DEFAULT_IMAGE,
  ICONS,
  KEYWORDS,
  OPEN_GRAPH_DEFAULTS,
  OTHER_META,
  PUBLISHER,
  REFERRER,
  ROBOTS,
  SITE_URL,
  TWITTER_CARD_DEFAULTS,
  VERIFICATION,
} from "./constants";

type MetadataGenerator = Omit<Metadata, "description" | "title"> & {
  title: string;
  description: string;
  image?: string;
  canonical?: string;
  keywords?: string[];
  robots?: Metadata["robots"];
};

export const createMetadata = ({
  title,
  description,
  image,
  canonical,
  keywords = KEYWORDS,
  robots = ROBOTS,
  ...properties
}: MetadataGenerator): Metadata => {
  const parsedTitle = `${title} | ${APPLICATION_NAME}`;
  const defaultMetadata: Metadata = {
    alternates: canonical ? { canonical } : undefined,
    appleWebApp: {
      capable: true,
      statusBarStyle: "default",
      title: parsedTitle,
    },
    applicationName: APPLICATION_NAME,
    authors: [AUTHOR],
    category: "Technology",
    classification: "Portfolio",
    creator: CREATOR,
    description,
    formatDetection: {
      address: false,
      email: false,
      telephone: false,
    },
    icons: ICONS,
    keywords,
    manifest: "/manifest.webmanifest",
    metadataBase: new URL(SITE_URL),
    openGraph: {
      ...OPEN_GRAPH_DEFAULTS,
      description,
      images: image ? [image] : [DEFAULT_IMAGE],
      title,
      url: SITE_URL,
    },
    other: OTHER_META,
    publisher: PUBLISHER,
    referrer: REFERRER,
    robots,
    title: parsedTitle,
    twitter: {
      ...TWITTER_CARD_DEFAULTS,
      description,
      images: image ? [image] : [DEFAULT_IMAGE.url],
      title: parsedTitle,
    },
    verification: VERIFICATION,
  };

  const metadata: Metadata = merge(defaultMetadata, properties);

  return metadata;
};
