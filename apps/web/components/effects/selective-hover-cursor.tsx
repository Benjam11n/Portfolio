"use client";

import { ArrowUpRight, Pause, Play } from "lucide-react";
import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
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

const POINTER_MEDIA_QUERY = "(hover: hover) and (pointer: fine)";
const POINTER_OFFSET = 12;
const CURSOR_DOT_SIZE = 18;
const CURSOR_LABEL_HEIGHT = 28;
const CURSOR_LABEL_PADDING = 20;
const CURSOR_LABEL_MIN_WIDTH = 84;

interface CursorState {
  displayLabel: string;
  icon: string;
  label: string;
  visible: boolean;
  x: number;
  y: number;
}

type CursorAction =
  | { type: "hide" }
  | { type: "reset" }
  | { icon: string; label: string; type: "show"; x: number; y: number };

const EMPTY_CURSOR_STATE: CursorState = {
  displayLabel: "",
  icon: "",
  label: "",
  visible: false,
  x: -9999,
  y: -9999,
};

const cursorReducer = (
  state: CursorState,
  action: CursorAction
): CursorState => {
  switch (action.type) {
    case "hide": {
      return { ...state, visible: false };
    }
    case "reset": {
      return EMPTY_CURSOR_STATE;
    }
    case "show": {
      return {
        displayLabel: action.label || state.displayLabel,
        icon: action.icon,
        label: action.label,
        visible: true,
        x: action.x,
        y: action.y,
      };
    }
    default: {
      return state;
    }
  }
};

const getFinePointerSnapshot = () =>
  window.matchMedia(POINTER_MEDIA_QUERY).matches;

const subscribeToFinePointer = (onStoreChange: () => void) => {
  const mediaQuery = window.matchMedia(POINTER_MEDIA_QUERY);
  mediaQuery.addEventListener("change", onStoreChange);

  return () => {
    mediaQuery.removeEventListener("change", onStoreChange);
  };
};

const useFinePointer = () =>
  useSyncExternalStore(
    subscribeToFinePointer,
    getFinePointerSnapshot,
    () => false
  );

const getHoverTarget = (clientX: number, clientY: number) =>
  document.elementFromPoint(clientX, clientY)?.closest(HOVER_CURSOR_SELECTOR) ??
  null;

const getCursorContent = (target: Element) => ({
  icon: target.getAttribute(HOVER_CURSOR_ICON_ATTRIBUTE) ?? "",
  label: target.getAttribute(HOVER_CURSOR_LABEL_ATTRIBUTE) ?? "",
});

export const SelectiveHoverCursor = () => {
  const contentRef = useRef<HTMLDivElement>(null);
  const latestPointerRef = useRef<{ x: number; y: number } | null>(null);
  const supportsFinePointer = useFinePointer();
  const prefersReducedMotion = usePrefersReducedMotion();
  const shouldEnable = supportsFinePointer && !prefersReducedMotion;
  const [cursor, dispatchCursor] = useReducer(
    cursorReducer,
    EMPTY_CURSOR_STATE
  );
  const [contentWidth, setContentWidth] = useState(0);

  useEffect(() => {
    if (!shouldEnable) {
      latestPointerRef.current = null;
      dispatchCursor({ type: "reset" });
      return;
    }

    const updateCursor = (clientX: number, clientY: number) => {
      latestPointerRef.current = { x: clientX, y: clientY };

      const target = getHoverTarget(clientX, clientY);
      if (!target) {
        dispatchCursor({ type: "hide" });
        return;
      }

      const { icon, label } = getCursorContent(target);
      dispatchCursor({
        icon,
        label,
        type: "show",
        x: clientX + POINTER_OFFSET,
        y: clientY + POINTER_OFFSET,
      });
    };

    const hideCursor = () => {
      latestPointerRef.current = null;
      dispatchCursor({ type: "hide" });
    };

    const handlePointerMove = (event: PointerEvent) => {
      updateCursor(event.clientX, event.clientY);
    };

    const handleWindowMouseOut = (event: MouseEvent) => {
      if (event.relatedTarget === null) {
        hideCursor();
      }
    };

    const syncFromLatestPointer = () => {
      const latestPointer = latestPointerRef.current;
      if (!latestPointer) {
        return;
      }

      updateCursor(latestPointer.x, latestPointer.y);
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("resize", syncFromLatestPointer);
    window.addEventListener("scroll", syncFromLatestPointer, { passive: true });
    window.addEventListener("mouseout", handleWindowMouseOut);
    window.addEventListener("blur", hideCursor);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("resize", syncFromLatestPointer);
      window.removeEventListener("scroll", syncFromLatestPointer);
      window.removeEventListener("mouseout", handleWindowMouseOut);
      window.removeEventListener("blur", hideCursor);
    };
  }, [shouldEnable]);

  const renderedLabel =
    cursor.label || (cursor.visible && cursor.icon ? "" : cursor.displayLabel);
  const showLabel = cursor.visible && (cursor.label.length > 0 || cursor.icon);
  const renderedIcon = CURSOR_ICON_MAP[cursor.icon] ?? null;

  useLayoutEffect(() => {
    if (!contentRef.current) {
      setContentWidth(0);
      return;
    }

    setContentWidth(contentRef.current.scrollWidth);
  }, [renderedLabel, renderedIcon]);

  const expandedWidth = Math.max(
    CURSOR_LABEL_MIN_WIDTH,
    contentWidth + CURSOR_LABEL_PADDING * 2
  );
  const cursorStyle = useMemo(
    () => ({
      height: showLabel ? CURSOR_LABEL_HEIGHT : CURSOR_DOT_SIZE,
      minWidth: showLabel ? expandedWidth : CURSOR_DOT_SIZE,
      paddingInline: showLabel ? CURSOR_LABEL_PADDING : 0,
      width: showLabel ? expandedWidth : CURSOR_DOT_SIZE,
    }),
    [expandedWidth, showLabel]
  );

  if (!shouldEnable) {
    return null;
  }

  return (
    <div
      aria-hidden="true"
      className="selective-hover-cursor-layer"
      data-active={cursor.visible}
      data-hover-cursor-overlay
      style={{
        opacity: cursor.visible ? 1 : 0,
        transform: `translate3d(${cursor.x}px, ${cursor.y}px, 0) scale(${
          cursor.visible ? 1 : 0.85
        })`,
      }}
    >
      <div className="selective-hover-cursor" style={cursorStyle}>
        <div className="flex items-center gap-1.5" ref={contentRef}>
          {renderedIcon && (
            <span
              className="selective-hover-cursor-icon"
              data-visible={showLabel}
            >
              {renderedIcon}
            </span>
          )}
          {renderedLabel && (
            <span data-visible={showLabel}>{renderedLabel}</span>
          )}
        </div>
      </div>
    </div>
  );
};
