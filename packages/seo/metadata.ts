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

const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
const siteUrl =
  process.env.SITE_URL || process.env.VERCEL_PROJECT_PRODUCTION_URL;

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
    title: parsedTitle,
    description,
    keywords,
    applicationName: APPLICATION_NAME,
    metadataBase: siteUrl ? new URL(`${protocol}://${siteUrl}`) : undefined,
    authors: [AUTHOR],
    creator: CREATOR,
    publisher: PUBLISHER,
    referrer: REFERRER,
    category: "Technology",
    classification: "Portfolio",
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    robots,
    alternates: canonical ? { canonical } : undefined,
    openGraph: {
      ...OPEN_GRAPH_DEFAULTS,
      title: parsedTitle,
      description,
      url: siteUrl,
      images: image ? [image] : [DEFAULT_IMAGE],
    },
    twitter: {
      ...TWITTER_CARD_DEFAULTS,
      title: parsedTitle,
      description,
      images: image ? [image] : [DEFAULT_IMAGE.url],
    },
    icons: ICONS,
    manifest: "/manifest.json",
    verification: VERIFICATION,
    other: OTHER_META,
    appleWebApp: {
      capable: true,
      statusBarStyle: "default",
      title: parsedTitle,
    },
  };

  const metadata: Metadata = merge(defaultMetadata, properties);

  return metadata;
};
