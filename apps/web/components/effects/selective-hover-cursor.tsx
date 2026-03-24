"use client";

import { useGSAP } from "@gsap/react";
import gsapCore from "gsap";
import { ArrowUpRight, Pause, Play } from "lucide-react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

import {
  HOVER_CURSOR_ICON_ATTRIBUTE,
  HOVER_CURSOR_LABEL_ATTRIBUTE,
  HOVER_CURSOR_SELECTOR,
} from "@/lib/constants/interaction";
import { usePrefersReducedMotion } from "@/lib/hooks/ui/use-prefers-reduced-motion";

const CURSOR_ICON_MAP: Record<string, ReactNode> = {
  "arrow-up-right": <ArrowUpRight height={12} width={12} />,
  pause: <Pause height={12} width={12} />,
  play: <Play height={12} width={12} />,
};

const POINTER_OFFSET = 12;
const POINTER_MEDIA_QUERY = "(hover: hover) and (pointer: fine)";
const CURSOR_DOT_SIZE = 18;
const CURSOR_LABEL_HEIGHT = 28;
const CURSOR_LABEL_PADDING = 11;
const CURSOR_LABEL_MIN_WIDTH = 84;
const CURSOR_LABEL_EXIT_DURATION_MS = 180;

export const SelectiveHoverCursor = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorBodyRef = useRef<HTMLDivElement>(null);
  const contentWrapperRef = useRef<HTMLDivElement>(null);
  const clearLabelTimeoutRef = useRef<number | null>(null);
  const labelRef = useRef("");
  const moveXRef = useRef<ReturnType<typeof gsapCore.quickTo> | null>(null);
  const moveYRef = useRef<ReturnType<typeof gsapCore.quickTo> | null>(null);
  const isVisibleRef = useRef(false);
  const prefersReducedMotion = usePrefersReducedMotion();
  const [label, setLabel] = useState("");
  const [icon, setIcon] = useState("");
  const [displayLabel, setDisplayLabel] = useState("");
  const [expandedWidth, setExpandedWidth] = useState(CURSOR_LABEL_MIN_WIDTH);
  const [supportsFinePointer, setSupportsFinePointer] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const shouldEnable = supportsFinePointer && !prefersReducedMotion;

  const [hoverTarget, setHoverTarget] = useState<Element | null>(null);

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

      gsapCore.set(cursorRef.current, {
        opacity: 0,
        scale: 0.7,
        x: -9999,
        y: -9999,
      });
      gsapCore.set(cursorBodyRef.current, {
        height: CURSOR_DOT_SIZE,
        minWidth: CURSOR_DOT_SIZE,
        paddingInline: 0,
        width: CURSOR_DOT_SIZE,
      });

      moveXRef.current = gsapCore.quickTo(cursorRef.current, "x", {
        duration: 0.3,
        ease: "back.out(1.2)",
      });
      moveYRef.current = gsapCore.quickTo(cursorRef.current, "y", {
        duration: 0.3,
        ease: "back.out(1.2)",
      });
    },
    { dependencies: [shouldEnable], scope: cursorRef }
  );

  useEffect(() => {
    if (!(shouldEnable && cursorRef.current)) {
      setIsActive(false);
      setLabel("");
      setIcon("");
      setDisplayLabel("");
      setExpandedWidth(CURSOR_LABEL_MIN_WIDTH);
      setHoverTarget(null);
      return;
    }

    const setActiveState = (nextState: boolean) => {
      setIsActive((currentState) =>
        currentState === nextState ? currentState : nextState
      );
    };

    const setCursorLabel = (nextLabel: string) => {
      if (labelRef.current === nextLabel) {
        return;
      }

      labelRef.current = nextLabel;
      setLabel(nextLabel);
    };

    const updateFromTarget = (target: Element) => {
      setCursorLabel(target.getAttribute(HOVER_CURSOR_LABEL_ATTRIBUTE) ?? "");
      setIcon(target.getAttribute(HOVER_CURSOR_ICON_ATTRIBUTE) ?? "");
    };

    const showCursor = () => {
      if (!cursorRef.current || isVisibleRef.current) {
        setActiveState(true);
        return;
      }

      isVisibleRef.current = true;
      setActiveState(true);

      gsapCore.to(cursorRef.current, {
        duration: 0.22,
        ease: "back.out(1.8)",
        opacity: 1,
        overwrite: "auto",
        scale: 1,
      });
    };

    const hideCursor = () => {
      if (!cursorRef.current) {
        setActiveState(false);
        setCursorLabel("");
        setIcon("");
        return;
      }

      setActiveState(false);
      setCursorLabel("");
      setIcon("");

      if (!isVisibleRef.current) {
        return;
      }

      isVisibleRef.current = false;

      gsapCore.to(cursorRef.current, {
        duration: 0.16,
        ease: "power2.out",
        opacity: 0,
        overwrite: "auto",
        scale: 0.85,
      });
    };

    const handlePointerMove = (event: PointerEvent) => {
      const target =
        event.target instanceof Element
          ? event.target.closest(HOVER_CURSOR_SELECTOR)
          : null;

      setHoverTarget(target);

      if (!target) {
        hideCursor();
        return;
      }

      const nextX = event.clientX + POINTER_OFFSET;
      const nextY = event.clientY + POINTER_OFFSET;

      if (!isVisibleRef.current && cursorRef.current) {
        gsapCore.set(cursorRef.current, {
          x: nextX,
          y: nextY,
        });
      }

      updateFromTarget(target);
      moveXRef.current?.(nextX);
      moveYRef.current?.(nextY);
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

    // Watch current target for attribute changes
    let observer: MutationObserver | null = null;
    if (hoverTarget) {
      updateFromTarget(hoverTarget);
      observer = new MutationObserver(() => updateFromTarget(hoverTarget));
      observer.observe(hoverTarget, {
        attributeFilter: [
          HOVER_CURSOR_LABEL_ATTRIBUTE,
          HOVER_CURSOR_ICON_ATTRIBUTE,
        ],
        attributes: true,
      });
    }

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("mouseout", handleWindowMouseOut);
      window.removeEventListener("blur", hideCursor);
      observer?.disconnect();
    };
  }, [shouldEnable, hoverTarget]);

  useEffect(() => {
    if (clearLabelTimeoutRef.current !== null) {
      window.clearTimeout(clearLabelTimeoutRef.current);
      clearLabelTimeoutRef.current = null;
    }

    if (!shouldEnable) {
      setDisplayLabel("");
      return;
    }

    if (label.length > 0) {
      setDisplayLabel(label);
      return;
    }

    clearLabelTimeoutRef.current = window.setTimeout(() => {
      setDisplayLabel("");
      clearLabelTimeoutRef.current = null;
    }, CURSOR_LABEL_EXIT_DURATION_MS);

    return () => {
      if (clearLabelTimeoutRef.current !== null) {
        window.clearTimeout(clearLabelTimeoutRef.current);
        clearLabelTimeoutRef.current = null;
      }
    };
  }, [label, shouldEnable]);

  useLayoutEffect(() => {
    if (
      !(
        shouldEnable &&
        (label.length > 0 || icon.length > 0) &&
        contentWrapperRef.current
      )
    ) {
      return;
    }

    const contentWidth = contentWrapperRef.current.scrollWidth;
    const nextWidth = Math.max(
      CURSOR_LABEL_MIN_WIDTH,
      contentWidth + CURSOR_LABEL_PADDING * 2
    );

    setExpandedWidth((currentWidth) =>
      currentWidth === nextWidth ? currentWidth : nextWidth
    );
  }, [label, icon, shouldEnable]);

  const showLabel = label.length > 0 || icon.length > 0;
  const hasDisplayLabel = displayLabel.length > 0;
  const hasIcon = icon.length > 0;
  const renderedIcon = CURSOR_ICON_MAP[icon] ?? null;
  const cursorStyle = {
    height: showLabel ? CURSOR_LABEL_HEIGHT : CURSOR_DOT_SIZE,
    minWidth: showLabel ? expandedWidth : CURSOR_DOT_SIZE,
    paddingInline: showLabel ? CURSOR_LABEL_PADDING : 0,
    width: showLabel ? expandedWidth : CURSOR_DOT_SIZE,
  };

  if (!shouldEnable) {
    return null;
  }

  return (
    <div
      aria-hidden="true"
      className="selective-hover-cursor-layer"
      data-active={isActive}
      data-hover-cursor-overlay
      ref={cursorRef}
    >
      <div
        className="selective-hover-cursor"
        ref={cursorBodyRef}
        style={cursorStyle}
      >
        <div className="flex items-center gap-1.5" ref={contentWrapperRef}>
          {hasIcon && renderedIcon && (
            <span
              className="selective-hover-cursor-icon"
              data-visible={showLabel}
            >
              {renderedIcon}
            </span>
          )}
          {hasDisplayLabel && (
            <span data-visible={showLabel}>{displayLabel}</span>
          )}
        </div>
      </div>
    </div>
  );
};
