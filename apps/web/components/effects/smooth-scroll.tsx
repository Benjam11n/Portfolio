"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "@/lib/hooks/ui/use-prefers-reduced-motion";

export const SmoothScroll = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const prefersReducedMotion = usePrefersReducedMotion();
  const prefersReducedMotionRef = useRef(prefersReducedMotion);

  useEffect(() => {
    prefersReducedMotionRef.current = prefersReducedMotion;
  }, [prefersReducedMotion]);

  useEffect(() => {
    // Apply smooth scroll behavior via CSS
    if (prefersReducedMotion) {
      document.documentElement.style.scrollBehavior = "auto";
    } else {
      document.documentElement.style.scrollBehavior = "smooth";
    }

    return () => {
      document.documentElement.style.scrollBehavior = "auto";
    };
  }, [prefersReducedMotion]);

  useEffect(() => {
    if (pathname !== "/" || !window.location.hash) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      const id = window.location.hash.substring(1);
      const element = document.getElementById(id);

      if (element) {
        element.scrollIntoView({
          behavior: prefersReducedMotionRef.current ? "auto" : "smooth",
          block: "start",
        });
      }
    }, 100);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [pathname]);

  useEffect(() => {
    if (pathname !== "/") {
      return;
    }

    const handleHashChange = () => {
      const id = window.location.hash.substring(1);
      if (!id) {
        return;
      }

      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({
          behavior: prefersReducedMotionRef.current ? "auto" : "smooth",
          block: "start",
        });
      }
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, [pathname]);

  return <>{children}</>;
};
