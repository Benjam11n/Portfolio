"use client";

import { logger } from "@repo/logger";
import { useCallback, useEffect, useRef, useState } from "react";
import { env } from "@/lib/env";

/**
 * Window interface extended with reCAPTCHA v3
 */
interface WindowWithRecaptcha extends Window {
  grecaptcha?: {
    ready: (callback: () => void) => void;
    execute: (siteKey: string, options: { action: string }) => Promise<string>;
  };
}

export type UseDeferredRecaptchaOptions = {
  onLoad?: () => void;
};

export type UseDeferredRecaptchaReturn = {
  isRecaptchaLoaded: boolean;
  isRecaptchaReady: boolean;
  loadRecaptcha: () => void;
  executeRecaptcha: (action?: string) => Promise<string | null>;
};

export const useDeferredRecaptcha = ({
  onLoad,
}: UseDeferredRecaptchaOptions = {}): UseDeferredRecaptchaReturn => {
  const [isRecaptchaLoaded, setIsRecaptchaLoaded] = useState(false);
  const [isRecaptchaReady, setIsRecaptchaReady] = useState(false);
  const scriptLoadedRef = useRef(false);

  // Initialize script loading
  const loadRecaptcha = useCallback(() => {
    if (scriptLoadedRef.current || isRecaptchaLoaded) {
      return;
    }

    scriptLoadedRef.current = true;

    // Check if global grecaptcha is already available
    if (
      typeof window !== "undefined" &&
      (window as WindowWithRecaptcha).grecaptcha
    ) {
      setIsRecaptchaLoaded(true);
      setIsRecaptchaReady(true);
      onLoad?.();
      return;
    }

    const script = document.createElement("script");
    // v3 requires the render parameter
    script.src = `https://www.google.com/recaptcha/api.js?render=${env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`;
    script.async = true;
    script.defer = true;

    script.addEventListener("load", () => {
      setIsRecaptchaLoaded(true);
      const grecaptcha = (window as WindowWithRecaptcha).grecaptcha;

      if (grecaptcha) {
        grecaptcha.ready(() => {
          setIsRecaptchaReady(true);
          onLoad?.();
        });
      }
    });

    script.addEventListener("error", () => {
      logger.error("Failed to load reCAPTCHA v3 script");
      scriptLoadedRef.current = false;
    });

    document.head.appendChild(script);
  }, [isRecaptchaLoaded, onLoad]);

  const executeRecaptcha = useCallback(
    async (action = "contact"): Promise<string | null> => {
      if (typeof window === "undefined") {
        return null;
      }

      const grecaptcha = (window as WindowWithRecaptcha).grecaptcha;
      if (!grecaptcha) {
        logger.warn("reCAPTCHA not ready when execute called");
        return null;
      }

      try {
        const token = await grecaptcha.execute(
          env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY,
          { action }
        );
        return token;
      } catch (error) {
        logger.error(error, "Error executing reCAPTCHA v3");
        return null;
      }
    },
    []
  );

  useEffect(() => {
    return () => {
      // Clean up if necessary
    };
  }, []);

  return {
    isRecaptchaLoaded,
    isRecaptchaReady,
    loadRecaptcha,
    executeRecaptcha,
  };
};
