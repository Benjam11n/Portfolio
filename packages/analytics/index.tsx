"use client";

import {
  Analytics as VercelAnalytics,
  track as vercelTrack,
} from "@vercel/analytics/react";
import posthog, { type PostHog } from "posthog-js";
import type { ReactNode } from "react";
import { createContext, useContext, useEffect, useState } from "react";

// Types
type AnalyticsProperties = Record<
  string,
  string | number | boolean | undefined
>;

type Analytics = {
  /**
   * Track a custom event
   * @param event - Event name
   * @param properties - Event properties
   */
  track(event: string, properties?: AnalyticsProperties): void;

  /**
   * Identify a user
   * @param userId - Unique user identifier
   * @param properties - User properties
   */
  identify(userId: string, properties?: AnalyticsProperties): void;

  /**
   * Reset the user identity (on logout)
   */
  reset(): void;

  /**
   * Get the underlying PostHog instance
   */
  getPostHog(): PostHog | null;
};

// Provider
type PostHogContextValue = {
  posthog: PostHog | null;
  isInitialized: boolean;
};

const PostHogContext = createContext<PostHogContextValue | undefined>(
  undefined
);

type AnalyticsProviderProps = {
  children: ReactNode;
  writeKey: string; // PostHog API Key
  host?: string; // PostHog Host
  disabled?: boolean;
};

/**
 * Unified Analytics Provider component
 * Wraps the application with both PostHog and Vercel Analytics
 */
export function AnalyticsProvider({
  children,
  writeKey,
  host,
  disabled = false,
}: AnalyticsProviderProps) {
  const [posthogInstance, setPosthog] = useState<PostHog | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (disabled || !writeKey) {
      setIsInitialized(true);
      return;
    }

    // Initialize PostHog
    posthog.init(writeKey, {
      api_host: host ?? "https://us.i.posthog.com",
      persistence: "localStorage",
      defaults: "2025-05-24",
      capture_pageview: "history_change",
      disable_session_recording: true,
    });

    setPosthog(posthog);
    setIsInitialized(true);
  }, [writeKey, host, disabled]);

  const contextValue: PostHogContextValue = {
    posthog: posthogInstance,
    isInitialized,
  };

  return (
    <PostHogContext.Provider value={contextValue}>
      {children}
      <VercelAnalytics />
    </PostHogContext.Provider>
  );
}

/**
 * Hook to access PostHog instance (Internal use or specific PostHog needs)
 * @throws Error if used outside AnalyticsProvider
 */
export function usePostHogContext(): PostHogContextValue {
  const context = useContext(PostHogContext);
  if (!context) {
    throw new Error("usePostHogContext must be used within AnalyticsProvider");
  }
  return context;
}

// Hooks

/**
 * Hook to access the PostHog instance directly
 * @returns PostHog instance or null if not initialized
 */
export function usePostHog() {
  const { posthog } = usePostHogContext();
  return posthog;
}

/**
 * Hook to access simplified analytics interface
 * @returns Analytics interface with track, identify, and reset methods
 */
export function useAnalytics(): Analytics {
  const { posthog, isInitialized } = usePostHogContext();

  return {
    track: (event: string, properties?: AnalyticsProperties) => {
      // Track in Vercel Analytics
      vercelTrack(event, properties);

      // Track in PostHog
      if (isInitialized && posthog) {
        posthog.capture(event, properties);
      }
    },

    identify: (userId: string, properties?: AnalyticsProperties) => {
      if (isInitialized && posthog) {
        posthog.identify(userId, properties);
      }
    },

    reset: () => {
      if (isInitialized && posthog) {
        posthog.reset();
      }
    },

    getPostHog: () => posthog,
  };
}

/**
 * Standalone track function for non-hook usage
 * Tracks to both Vercel Analytics and PostHog (if initialized globally, though PostHog usually requires client instance)
 * Note: For PostHog, strict usage often requires the instance from the hook/context.
 * However, Vercel Analytics 'track' works globally if initialized.
 * This helper primarily wraps Vercel's track and checks for window.posthog presence as fallback or enhancement.
 */
export function trackEvent(event: string, properties?: AnalyticsProperties) {
  // Track in Vercel Analytics
  vercelTrack(event, properties);

  // Track in PostHog if available on window (common pattern for non-react usage)
  // or if imported globally (posthog-js singleton)
  // PostHog JS singleton handles state, so this should work if init was called.
  posthog.capture(event, properties);
}
