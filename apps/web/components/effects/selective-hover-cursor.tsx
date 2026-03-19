"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  HOVER_CURSOR_LABEL_ATTRIBUTE,
  HOVER_CURSOR_SELECTOR,
} from "@/lib/constants/interaction";
import { usePrefersReducedMotion } from "@/lib/hooks/ui/use-prefers-reduced-motion";

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
  const labelElementRef = useRef<HTMLSpanElement>(null);
  const clearLabelTimeoutRef = useRef<number | null>(null);
  const labelRef = useRef("");
  const moveXRef = useRef<((value: number) => gsap.core.Tween) | null>(null);
  const moveYRef = useRef<((value: number) => gsap.core.Tween) | null>(null);
  const isVisibleRef = useRef(false);
  const prefersReducedMotion = usePrefersReducedMotion();
  const [label, setLabel] = useState("");
  const [displayLabel, setDisplayLabel] = useState("");
  const [expandedWidth, setExpandedWidth] = useState(CURSOR_LABEL_MIN_WIDTH);
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
      gsap.set(cursorBodyRef.current, {
        width: CURSOR_DOT_SIZE,
        minWidth: CURSOR_DOT_SIZE,
        height: CURSOR_DOT_SIZE,
        paddingInline: 0,
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
      setLabel("");
      setDisplayLabel("");
      setExpandedWidth(CURSOR_LABEL_MIN_WIDTH);
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
        setCursorLabel("");
        return;
      }

      setActiveState(false);
      setCursorLabel("");

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

      const nextX = event.clientX + POINTER_OFFSET;
      const nextY = event.clientY + POINTER_OFFSET;

      if (!isVisibleRef.current && cursorRef.current) {
        gsap.set(cursorRef.current, {
          x: nextX,
          y: nextY,
        });
      }

      setCursorLabel(
        hoverTarget.getAttribute(HOVER_CURSOR_LABEL_ATTRIBUTE) ?? ""
      );
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

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("mouseout", handleWindowMouseOut);
      window.removeEventListener("blur", hideCursor);
    };
  }, [shouldEnable]);

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
    if (!(shouldEnable && label.length > 0 && labelElementRef.current)) {
      return;
    }

    const labelElement = labelElementRef.current;
    const nextWidth = Math.max(
      CURSOR_LABEL_MIN_WIDTH,
      Math.ceil(labelElement.getBoundingClientRect().width) +
        CURSOR_LABEL_PADDING * 2
    );

    setExpandedWidth((currentWidth) =>
      currentWidth === nextWidth ? currentWidth : nextWidth
    );
  }, [label, shouldEnable]);

  const showLabel = label.length > 0;
  const hasDisplayLabel = displayLabel.length > 0;
  const cursorStyle = {
    width: showLabel ? expandedWidth : CURSOR_DOT_SIZE,
    minWidth: showLabel ? expandedWidth : CURSOR_DOT_SIZE,
    height: showLabel ? CURSOR_LABEL_HEIGHT : CURSOR_DOT_SIZE,
    paddingInline: showLabel ? CURSOR_LABEL_PADDING : 0,
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
        {hasDisplayLabel && (
          <span data-visible={showLabel} ref={labelElementRef}>
            {displayLabel}
          </span>
        )}
      </div>
    </div>
  );
};
