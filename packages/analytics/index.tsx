"use client";

import {
  Analytics as VercelAnalytics,
  track as vercelTrack,
} from "@vercel/analytics/react";
import posthogClient from "posthog-js";
import type { PostHog } from "posthog-js";
import type { ReactNode } from "react";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

// Types
type AnalyticsProperties = Record<
  string,
  string | number | boolean | undefined
>;

interface Analytics {
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
}

// Provider
interface PostHogContextValue {
  posthog: PostHog | null;
  isInitialized: boolean;
}

const PostHogContext = createContext<PostHogContextValue | undefined>(
  undefined
);

interface AnalyticsProviderProps {
  children: ReactNode;
  writeKey: string;
  host?: string;
  disabled?: boolean;
}

/**
 * Unified Analytics Provider component
 * Wraps the application with both PostHog and Vercel Analytics
 */
export const AnalyticsProvider = ({
  children,
  writeKey,
  host,
  disabled = false,
}: AnalyticsProviderProps) => {
  const [posthogInstance, setPosthog] = useState<PostHog | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (disabled || !writeKey) {
      setIsInitialized(true);
      return;
    }

    // Initialize PostHog
    posthogClient.init(writeKey, {
      api_host: host ?? "https://us.i.posthog.com",
      capture_pageview: "history_change",
      defaults: "2025-05-24",
      disable_session_recording: true,
      persistence: "localStorage",
    });

    setPosthog(posthogClient);
    setIsInitialized(true);
  }, [writeKey, host, disabled]);

  const contextValue = useMemo(
    () => ({
      isInitialized,
      posthog: posthogInstance,
    }),
    [isInitialized, posthogInstance]
  );

  return (
    <PostHogContext.Provider value={contextValue}>
      {children}
      <VercelAnalytics />
    </PostHogContext.Provider>
  );
};

/**
 * Hook to access PostHog instance (Internal use or specific PostHog needs)
 * @throws Error if used outside AnalyticsProvider
 */
export const usePostHogContext = (): PostHogContextValue => {
  const context = useContext(PostHogContext);
  if (!context) {
    throw new Error("usePostHogContext must be used within AnalyticsProvider");
  }
  return context;
};

// Hooks

/**
 * Hook to access the PostHog instance directly
 * @returns PostHog instance or null if not initialized
 */
export const usePostHog = () => {
  const { posthog: posthogInstance } = usePostHogContext();
  return posthogInstance;
};

/**
 * Hook to access simplified analytics interface
 * @returns Analytics interface with track, identify, and reset methods
 */
export const useAnalytics = (): Analytics => {
  const { posthog: posthogInstance, isInitialized } = usePostHogContext();

  return {
    getPostHog: () => posthogInstance,

    identify: (userId: string, properties?: AnalyticsProperties) => {
      if (isInitialized && posthogInstance) {
        posthogInstance.identify(userId, properties);
      }
    },

    reset: () => {
      if (isInitialized && posthogInstance) {
        posthogInstance.reset();
      }
    },

    track: (event: string, properties?: AnalyticsProperties) => {
      vercelTrack(event, properties);

      if (isInitialized && posthogInstance) {
        posthogInstance.capture(event, properties);
      }
    },
  };
};

/**
 * Standalone track function for non-hook usage
 * Tracks to both Vercel Analytics and PostHog (if initialized globally, though PostHog usually requires client instance)
 * Note: For PostHog, strict usage often requires the instance from the hook/context.
 * However, Vercel Analytics 'track' works globally if initialized.
 * This helper primarily wraps Vercel's track and checks for window.posthog presence as fallback or enhancement.
 */
export const trackEvent = (event: string, properties?: AnalyticsProperties) => {
  vercelTrack(event, properties);
  posthogClient.capture(event, properties);
};
