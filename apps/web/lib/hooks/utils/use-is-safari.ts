"use client";

import { useHasHydrated } from "@/lib/hooks/ui/use-has-hydrated";

export const isSafariUserAgent = (userAgent: string) =>
  userAgent.includes("AppleWebKit") &&
  userAgent.includes("Safari") &&
  !userAgent.includes("Chrome") &&
  !userAgent.includes("Chromium") &&
  !userAgent.includes("Edg/");

export const useIsSafari = () => {
  const hasHydrated = useHasHydrated();

  return hasHydrated && isSafariUserAgent(navigator.userAgent);
};
