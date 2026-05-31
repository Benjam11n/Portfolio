"use client";

import {
  Analytics as VercelAnalytics,
  track as vercelTrack,
} from "@vercel/analytics/react";
import type { posthog } from "posthog-js";
import type { ReactNode } from "react";
import { useEffect } from "react";

type AnalyticsProperties = Record<
  string,
  string | number | boolean | undefined
>;

type PosthogClient = typeof posthog;

let posthogClient: Promise<PosthogClient> | null = null;

const importPosthog = async () => {
  const posthogModule = await import("posthog-js");
  return posthogModule.posthog;
};

const loadPosthog = () => {
  posthogClient ??= importPosthog();
  return posthogClient;
};

const initializePosthog = async (
  writeKey: string,
  host: string | undefined
) => {
  const client = await loadPosthog();
  client.init(writeKey, {
    api_host: host ?? "https://us.i.posthog.com",
    capture_pageview: "history_change",
    defaults: "2025-05-24",
    disable_session_recording: true,
    persistence: "localStorage",
  });
};

interface AnalyticsProviderProps {
  children: ReactNode;
  writeKey: string;
  host?: string;
  disabled?: boolean;
}

export const AnalyticsProvider = ({
  children,
  writeKey,
  host,
  disabled = false,
}: AnalyticsProviderProps) => {
  useEffect(() => {
    if (disabled || !writeKey) {
      return;
    }

    initializePosthog(writeKey, host);
  }, [disabled, host, writeKey]);

  return (
    <>
      {children}
      <VercelAnalytics />
    </>
  );
};

const capturePosthogEvent = async (
  event: string,
  properties?: AnalyticsProperties
) => {
  try {
    const client = await loadPosthog();
    client.capture(event, properties);
  } catch {
    // Analytics should never block app flows.
  }
};

export const trackEvent = (event: string, properties?: AnalyticsProperties) => {
  vercelTrack(event, properties);
  capturePosthogEvent(event, properties);
};
