"use client";

import "lenis/dist/lenis.css";
import Lenis from "lenis";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export const SmoothScroll = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - 2 ** (-10 * t)), // https://www.desmos.com/calculator/brs54l4xou
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  // Scroll to top only when navigating to projects routes
  useEffect(() => {
    if (pathname.startsWith("/projects")) {
      window.scrollTo(0, 0);
    }
  }, [pathname]);

  return <>{children}</>;
};
