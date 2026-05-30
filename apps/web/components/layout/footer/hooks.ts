"use client";

import { useEffect, useState } from "react";

import {
  formatFooterTime,
  getNextMinuteDelay,
} from "@/components/layout/footer/utils";

interface FooterClock {
  time?: string;
  year?: number;
}

export const useFooterTime = () => {
  const [clock, setClock] = useState<FooterClock>();

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    const scheduleUpdate = () => {
      if (document.hidden) {
        return;
      }

      const now = new Date();
      setClock({ time: formatFooterTime(), year: now.getFullYear() });
      timeoutId = setTimeout(scheduleUpdate, getNextMinuteDelay(now));
    };

    const handleVisibilityChange = () => {
      clearTimeout(timeoutId);
      timeoutId = undefined;

      if (!document.hidden) {
        scheduleUpdate();
      }
    };

    timeoutId = setTimeout(scheduleUpdate, 0);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return clock;
};
