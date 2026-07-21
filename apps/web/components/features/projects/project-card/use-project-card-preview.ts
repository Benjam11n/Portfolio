"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import {
  FINE_HOVER_MEDIA_QUERY,
  PROJECT_PREVIEW_DELAY_MS,
} from "@/components/features/projects/project-card/constants";
import { useShouldReduceMotion } from "@/lib/hooks/performance/use-should-reduce-motion";
import { useMobileDetection } from "@/lib/hooks/utils/use-mobile-detection";

interface UseProjectCardPreviewOptions {
  hasPreviewVideo: boolean;
}

export const useProjectCardPreview = ({
  hasPreviewVideo,
}: UseProjectCardPreviewOptions) => {
  const isMobile = useMobileDetection();
  const shouldReduceMotion = useShouldReduceMotion();
  const previewTimeoutRef = useRef<number | null>(null);
  const previewVideoRef = useRef<HTMLVideoElement>(null);
  const [hasFineHover, setHasFineHover] = useState(false);
  const [shouldLoadPreview, setShouldLoadPreview] = useState(false);
  const [isPreviewVisible, setIsPreviewVisible] = useState(false);

  const canPreview =
    hasPreviewVideo && !isMobile && !shouldReduceMotion && hasFineHover;

  useEffect(() => {
    const mediaQuery = window.matchMedia(FINE_HOVER_MEDIA_QUERY);
    const updateMatch = (event?: MediaQueryListEvent) => {
      setHasFineHover(event?.matches ?? mediaQuery.matches);
    };

    updateMatch();
    mediaQuery.addEventListener("change", updateMatch);

    return () => {
      mediaQuery.removeEventListener("change", updateMatch);
    };
  }, []);

  useEffect(
    () => () => {
      if (previewTimeoutRef.current) {
        window.clearTimeout(previewTimeoutRef.current);
      }
    },
    []
  );

  const clearPreviewIntentTimeout = useCallback(() => {
    if (previewTimeoutRef.current) {
      window.clearTimeout(previewTimeoutRef.current);
      previewTimeoutRef.current = null;
    }
  }, []);

  const tryPlayPreview = useCallback(async () => {
    const video = previewVideoRef.current;
    if (!video) {
      return;
    }

    try {
      await video.play();
    } catch {
      // Ignore autoplay failures and keep the poster visible.
    }
  }, []);

  const handleStartPreview = useCallback(() => {
    if (!canPreview) {
      return;
    }

    clearPreviewIntentTimeout();
    previewTimeoutRef.current = window.setTimeout(() => {
      setShouldLoadPreview(true);
      setIsPreviewVisible(true);
    }, PROJECT_PREVIEW_DELAY_MS);
  }, [canPreview, clearPreviewIntentTimeout]);

  const handleStopPreview = useCallback(() => {
    clearPreviewIntentTimeout();
    setIsPreviewVisible(false);

    const video = previewVideoRef.current;
    if (!video) {
      return;
    }

    video.pause();
    video.currentTime = 0;
  }, [clearPreviewIntentTimeout]);

  const handlePreviewLoadedData = useCallback(() => {
    if (!isPreviewVisible) {
      return;
    }

    tryPlayPreview();
  }, [isPreviewVisible, tryPlayPreview]);

  useEffect(() => {
    if (!(canPreview && shouldLoadPreview && isPreviewVisible)) {
      return;
    }

    tryPlayPreview();
  }, [canPreview, isPreviewVisible, shouldLoadPreview, tryPlayPreview]);

  return {
    handlePreviewLoadedData,
    handleStartPreview,
    handleStopPreview,
    isPreviewVisible,
    previewVideoRef,
    shouldLoadPreview,
  };
};
