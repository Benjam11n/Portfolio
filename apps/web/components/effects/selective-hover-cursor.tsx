"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useEffect, useRef, useState } from "react";
import { HOVER_CURSOR_SELECTOR } from "@/lib/constants/interaction";
import { usePrefersReducedMotion } from "@/lib/hooks/ui/use-prefers-reduced-motion";

const POINTER_OFFSET = 12;
const POINTER_MEDIA_QUERY = "(hover: hover) and (pointer: fine)";

export const SelectiveHoverCursor = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const moveXRef = useRef<((value: number) => gsap.core.Tween) | null>(null);
  const moveYRef = useRef<((value: number) => gsap.core.Tween) | null>(null);
  const isVisibleRef = useRef(false);
  const prefersReducedMotion = usePrefersReducedMotion();
  const [supportsFinePointer, setSupportsFinePointer] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const shouldEnable = supportsFinePointer && !prefersReducedMotion;

  useEffect(() => {
    const mediaQuery = window.matchMedia(POINTER_MEDIA_QUERY);

    const updateSupport = () => {
      setSupportsFinePointer(mediaQuery.matches);
    };

    updateSupport();
    mediaQuery.addEventListener("change", updateSupport);

    return () => {
      mediaQuery.removeEventListener("change", updateSupport);
    };
  }, []);

  useGSAP(
    () => {
      if (!(shouldEnable && cursorRef.current)) {
        moveXRef.current = null;
        moveYRef.current = null;
        isVisibleRef.current = false;
        return;
      }

      gsap.set(cursorRef.current, {
        x: -9999,
        y: -9999,
        opacity: 0,
        scale: 0.7,
      });

      moveXRef.current = gsap.quickTo(cursorRef.current, "x", {
        duration: 0.3,
        ease: "back.out(1.2)",
      });
      moveYRef.current = gsap.quickTo(cursorRef.current, "y", {
        duration: 0.3,
        ease: "back.out(1.2)",
      });
    },
    { dependencies: [shouldEnable], scope: cursorRef }
  );

  useEffect(() => {
    if (!(shouldEnable && cursorRef.current)) {
      setIsActive(false);
      return;
    }

    const setActiveState = (nextState: boolean) => {
      setIsActive((currentState) =>
        currentState === nextState ? currentState : nextState
      );
    };

    const showCursor = () => {
      if (!cursorRef.current || isVisibleRef.current) {
        setActiveState(true);
        return;
      }

      isVisibleRef.current = true;
      setActiveState(true);

      gsap.to(cursorRef.current, {
        opacity: 1,
        scale: 1,
        duration: 0.22,
        ease: "back.out(1.8)",
        overwrite: "auto",
      });
    };

    const hideCursor = () => {
      if (!cursorRef.current) {
        setActiveState(false);
        return;
      }

      setActiveState(false);

      if (!isVisibleRef.current) {
        return;
      }

      isVisibleRef.current = false;

      gsap.to(cursorRef.current, {
        opacity: 0,
        scale: 0.85,
        duration: 0.16,
        ease: "power2.out",
        overwrite: "auto",
      });
    };

    const handlePointerMove = (event: PointerEvent) => {
      const hoverTarget =
        event.target instanceof Element
          ? event.target.closest(HOVER_CURSOR_SELECTOR)
          : null;

      if (!hoverTarget) {
        hideCursor();
        return;
      }

      moveXRef.current?.(event.clientX + POINTER_OFFSET);
      moveYRef.current?.(event.clientY + POINTER_OFFSET);
      showCursor();
    };

    const handleWindowMouseOut = (event: MouseEvent) => {
      if (event.relatedTarget === null) {
        hideCursor();
      }
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("mouseout", handleWindowMouseOut);
    window.addEventListener("blur", hideCursor);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("mouseout", handleWindowMouseOut);
      window.removeEventListener("blur", hideCursor);
    };
  }, [shouldEnable]);

  if (!shouldEnable) {
    return null;
  }

  return (
    <div
      aria-hidden="true"
      className="selective-hover-cursor"
      data-active={isActive}
      data-hover-cursor-overlay
      ref={cursorRef}
    />
  );
};
