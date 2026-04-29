"use client";

import { useGSAP } from "@gsap/react";
import gsapCore from "gsap";
import { ArrowUpRight, Pause, Play } from "lucide-react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { Dispatch, ReactNode, RefObject, SetStateAction } from "react";

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
const CURSOR_LABEL_PADDING = 20;
const CURSOR_LABEL_MIN_WIDTH = 84;
const CURSOR_LABEL_EXIT_DURATION_MS = 180;

const getContentSignature = (label: string, icon: string) =>
  `${icon}::${label}`;

const useFinePointer = () => {
  const [supportsFinePointer, setSupportsFinePointer] = useState(false);

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

  return supportsFinePointer;
};

interface UseCursorAnimationOptions {
  contentSignatureRef: RefObject<string>;
  cursorBodyRef: RefObject<HTMLDivElement | null>;
  cursorRef: RefObject<HTMLDivElement | null>;
  isVisibleRef: RefObject<boolean>;
  latestPointerRef: RefObject<{ x: number; y: number } | null>;
  latestViewportPointerRef: RefObject<{ x: number; y: number } | null>;
  moveXRef: RefObject<ReturnType<typeof gsapCore.quickTo> | null>;
  moveYRef: RefObject<ReturnType<typeof gsapCore.quickTo> | null>;
  pendingShowRef: RefObject<boolean>;
  shouldEnable: boolean;
}

const useCursorAnimation = ({
  contentSignatureRef,
  cursorBodyRef,
  cursorRef,
  isVisibleRef,
  latestPointerRef,
  latestViewportPointerRef,
  moveXRef,
  moveYRef,
  pendingShowRef,
  shouldEnable,
}: UseCursorAnimationOptions) => {
  useGSAP(
    () => {
      if (!(shouldEnable && cursorRef.current)) {
        moveXRef.current = null;
        moveYRef.current = null;
        isVisibleRef.current = false;
        pendingShowRef.current = false;
        latestPointerRef.current = null;
        latestViewportPointerRef.current = null;
        contentSignatureRef.current = "";
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
};

interface UseHoverCursorTargetOptions {
  contentSignatureRef: RefObject<string>;
  cursorRef: RefObject<HTMLDivElement | null>;
  hoverTarget: Element | null;
  iconRef: RefObject<string>;
  isVisibleRef: RefObject<boolean>;
  labelRef: RefObject<string>;
  latestPointerRef: RefObject<{ x: number; y: number } | null>;
  latestViewportPointerRef: RefObject<{ x: number; y: number } | null>;
  moveXRef: RefObject<ReturnType<typeof gsapCore.quickTo> | null>;
  moveYRef: RefObject<ReturnType<typeof gsapCore.quickTo> | null>;
  pendingShowRef: RefObject<boolean>;
  setDisplayLabel: Dispatch<SetStateAction<string>>;
  setExpandedWidth: Dispatch<SetStateAction<number>>;
  setHoverTarget: Dispatch<SetStateAction<Element | null>>;
  setIcon: Dispatch<SetStateAction<string>>;
  setIsActive: Dispatch<SetStateAction<boolean>>;
  setLabel: Dispatch<SetStateAction<string>>;
  shouldEnable: boolean;
}

const useHoverCursorTarget = ({
  contentSignatureRef,
  cursorRef,
  hoverTarget,
  iconRef,
  isVisibleRef,
  labelRef,
  latestPointerRef,
  latestViewportPointerRef,
  moveXRef,
  moveYRef,
  pendingShowRef,
  setDisplayLabel,
  setExpandedWidth,
  setHoverTarget,
  setIcon,
  setIsActive,
  setLabel,
  shouldEnable,
}: UseHoverCursorTargetOptions) => {
  useEffect(() => {
    if (!(shouldEnable && cursorRef.current)) {
      setIsActive(false);
      setLabel("");
      setIcon("");
      setDisplayLabel("");
      setExpandedWidth(CURSOR_LABEL_MIN_WIDTH);
      setHoverTarget(null);
      labelRef.current = "";
      iconRef.current = "";
      contentSignatureRef.current = "";
      pendingShowRef.current = false;
      latestPointerRef.current = null;
      latestViewportPointerRef.current = null;
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

    const setCursorIcon = (nextIcon: string) => {
      if (iconRef.current === nextIcon) {
        return;
      }

      iconRef.current = nextIcon;
      setIcon(nextIcon);
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

    const updateFromTarget = (target: Element) => {
      const nextLabel = target.getAttribute(HOVER_CURSOR_LABEL_ATTRIBUTE) ?? "";
      const nextIcon = target.getAttribute(HOVER_CURSOR_ICON_ATTRIBUTE) ?? "";
      const nextSignature = getContentSignature(nextLabel, nextIcon);
      const signatureChanged = contentSignatureRef.current !== nextSignature;

      setCursorLabel(nextLabel);
      setCursorIcon(nextIcon);

      if (signatureChanged) {
        contentSignatureRef.current = nextSignature;
        pendingShowRef.current = true;
        setActiveState(false);

        if (cursorRef.current) {
          gsapCore.set(cursorRef.current, { opacity: 0 });
        }

        isVisibleRef.current = false;
        return false;
      }

      pendingShowRef.current = false;
      return true;
    };

    const hideCursor = () => {
      if (!cursorRef.current) {
        setActiveState(false);
        setCursorLabel("");
        setCursorIcon("");
        pendingShowRef.current = false;
        return;
      }

      setActiveState(false);
      setCursorLabel("");
      setCursorIcon("");
      pendingShowRef.current = false;

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

    if (!cursorRef.current) {
      setHoverTarget(null);
      return;
    }

    const syncCursorTarget = (clientX: number, clientY: number) => {
      const target =
        document
          .elementFromPoint(clientX, clientY)
          ?.closest(HOVER_CURSOR_SELECTOR) ?? null;

      setHoverTarget(target);

      if (!target) {
        hideCursor();
        return;
      }

      const nextX = clientX + POINTER_OFFSET;
      const nextY = clientY + POINTER_OFFSET;
      latestPointerRef.current = { x: nextX, y: nextY };

      if (!isVisibleRef.current && cursorRef.current) {
        gsapCore.set(cursorRef.current, {
          x: nextX,
          y: nextY,
        });
      }

      const canShowNow = updateFromTarget(target);
      moveXRef.current?.(nextX);
      moveYRef.current?.(nextY);

      if (canShowNow) {
        showCursor();
      }
    };

    const handlePointerMove = (event: PointerEvent) => {
      latestViewportPointerRef.current = {
        x: event.clientX,
        y: event.clientY,
      };
      syncCursorTarget(event.clientX, event.clientY);
    };

    let scrollSyncFrame: number | null = null;

    const syncCursorTargetFromLatestPointer = () => {
      const latestViewportPointer = latestViewportPointerRef.current;

      if (!latestViewportPointer) {
        return;
      }

      syncCursorTarget(latestViewportPointer.x, latestViewportPointer.y);
    };

    const scheduleCursorTargetSync = () => {
      if (scrollSyncFrame !== null) {
        return;
      }

      scrollSyncFrame = window.requestAnimationFrame(() => {
        scrollSyncFrame = null;
        syncCursorTargetFromLatestPointer();
      });
    };

    const handleWindowMouseOut = (event: MouseEvent) => {
      if (event.relatedTarget === null) {
        hideCursor();
      }
    };

    const handleWindowBlur = () => {
      latestPointerRef.current = null;
      latestViewportPointerRef.current = null;
      hideCursor();
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("resize", scheduleCursorTargetSync);
    window.addEventListener("scroll", scheduleCursorTargetSync, {
      passive: true,
    });
    window.addEventListener("mouseout", handleWindowMouseOut);
    window.addEventListener("blur", handleWindowBlur);

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
      if (scrollSyncFrame !== null) {
        window.cancelAnimationFrame(scrollSyncFrame);
      }

      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("resize", scheduleCursorTargetSync);
      window.removeEventListener("scroll", scheduleCursorTargetSync);
      window.removeEventListener("mouseout", handleWindowMouseOut);
      window.removeEventListener("blur", handleWindowBlur);
      observer?.disconnect();
    };
  }, [
    contentSignatureRef,
    cursorRef,
    hoverTarget,
    iconRef,
    isVisibleRef,
    labelRef,
    latestPointerRef,
    latestViewportPointerRef,
    moveXRef,
    moveYRef,
    pendingShowRef,
    setDisplayLabel,
    setExpandedWidth,
    setHoverTarget,
    setIcon,
    setIsActive,
    setLabel,
    shouldEnable,
  ]);
};

export const SelectiveHoverCursor = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorBodyRef = useRef<HTMLDivElement>(null);
  const contentWrapperRef = useRef<HTMLDivElement>(null);
  const clearLabelTimeoutRef = useRef<number | null>(null);
  const labelRef = useRef("");
  const iconRef = useRef("");
  const contentSignatureRef = useRef("");
  const pendingShowRef = useRef(false);
  const latestPointerRef = useRef<{ x: number; y: number } | null>(null);
  const latestViewportPointerRef = useRef<{ x: number; y: number } | null>(
    null
  );
  const moveXRef = useRef<ReturnType<typeof gsapCore.quickTo> | null>(null);
  const moveYRef = useRef<ReturnType<typeof gsapCore.quickTo> | null>(null);
  const isVisibleRef = useRef(false);
  const prefersReducedMotion = usePrefersReducedMotion();
  const [label, setLabel] = useState("");
  const [icon, setIcon] = useState("");
  const [displayLabel, setDisplayLabel] = useState("");
  const [expandedWidth, setExpandedWidth] = useState(CURSOR_LABEL_MIN_WIDTH);
  const supportsFinePointer = useFinePointer();
  const [isActive, setIsActive] = useState(false);
  const shouldEnable = supportsFinePointer && !prefersReducedMotion;

  const [hoverTarget, setHoverTarget] = useState<Element | null>(null);

  useCursorAnimation({
    contentSignatureRef,
    cursorBodyRef,
    cursorRef,
    isVisibleRef,
    latestPointerRef,
    latestViewportPointerRef,
    moveXRef,
    moveYRef,
    pendingShowRef,
    shouldEnable,
  });

  useHoverCursorTarget({
    contentSignatureRef,
    cursorRef,
    hoverTarget,
    iconRef,
    isVisibleRef,
    labelRef,
    latestPointerRef,
    latestViewportPointerRef,
    moveXRef,
    moveYRef,
    pendingShowRef,
    setDisplayLabel,
    setExpandedWidth,
    setHoverTarget,
    setIcon,
    setIsActive,
    setLabel,
    shouldEnable,
  });

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

    if (cursorBodyRef.current) {
      gsapCore.set(cursorBodyRef.current, {
        height: CURSOR_LABEL_HEIGHT,
        minWidth: nextWidth,
        paddingInline: CURSOR_LABEL_PADDING,
        width: nextWidth,
      });
    }

    setExpandedWidth((currentWidth) =>
      currentWidth === nextWidth ? currentWidth : nextWidth
    );

    if (!pendingShowRef.current || !cursorRef.current) {
      return;
    }

    const nextPointer = latestPointerRef.current;
    if (nextPointer) {
      gsapCore.set(cursorRef.current, nextPointer);
    }

    pendingShowRef.current = false;
    isVisibleRef.current = true;
    setIsActive(true);

    gsapCore.to(cursorRef.current, {
      duration: 0.22,
      ease: "back.out(1.8)",
      opacity: 1,
      overwrite: "auto",
      scale: 1,
    });
  }, [label, icon, shouldEnable]);

  const showLabel = label.length > 0 || icon.length > 0;
  const renderedLabel = label.length > 0 ? label : displayLabel;
  const hasDisplayLabel = renderedLabel.length > 0;
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
            <span data-visible={showLabel}>{renderedLabel}</span>
          )}
        </div>
      </div>
    </div>
  );
};
