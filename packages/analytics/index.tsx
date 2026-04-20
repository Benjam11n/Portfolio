"use client";

import {
  Analytics as VercelAnalytics,
  track as vercelTrack,
} from "@vercel/analytics/react";
import posthogClient from "posthog-js";
import type { ReactNode } from "react";
import { useEffect } from "react";

type AnalyticsProperties = Record<
  string,
  string | number | boolean | undefined
>;

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

    posthogClient.init(writeKey, {
      api_host: host ?? "https://us.i.posthog.com",
      capture_pageview: "history_change",
      defaults: "2025-05-24",
      disable_session_recording: true,
      persistence: "localStorage",
    });
  }, [disabled, host, writeKey]);

  return (
    <>
      {children}
      <VercelAnalytics />
    </>
  );
};

export const trackEvent = (event: string, properties?: AnalyticsProperties) => {
  vercelTrack(event, properties);
  posthogClient.capture(event, properties);
};
