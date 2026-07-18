"use client";

import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import type { RefObject } from "react";

import {
  CURSOR_DOT_SIZE,
  CURSOR_ICON_MAP,
  CURSOR_LABEL_HEIGHT,
  CURSOR_LABEL_PADDING,
  POINTER_MEDIA_QUERY,
} from "@/components/shared/effects/selective-hover-cursor/constants";
import type { CursorState } from "@/components/shared/effects/selective-hover-cursor/types";
import {
  cursorReducer,
  EMPTY_CURSOR_STATE,
  getCursorContent,
  getCursorPosition,
  getExpandedCursorWidth,
  getHoverTarget,
  getRenderedLabel,
  shouldShowLabel,
} from "@/components/shared/effects/selective-hover-cursor/utils";

const getFinePointerSnapshot = () =>
  window.matchMedia(POINTER_MEDIA_QUERY).matches;

const subscribeToFinePointer = (onStoreChange: () => void) => {
  const mediaQuery = window.matchMedia(POINTER_MEDIA_QUERY);
  mediaQuery.addEventListener("change", onStoreChange);

  return () => {
    mediaQuery.removeEventListener("change", onStoreChange);
  };
};

export const useFinePointer = () =>
  useSyncExternalStore(
    subscribeToFinePointer,
    getFinePointerSnapshot,
    () => false
  );

export const useHoverCursorState = (enabled: boolean) => {
  const latestPointerRef = useRef<{ x: number; y: number } | null>(null);
  const [cursor, dispatchCursor] = useReducer(
    cursorReducer,
    EMPTY_CURSOR_STATE
  );

  useEffect(() => {
    if (!enabled) {
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

      const position = getCursorPosition(clientX, clientY);
      const { icon, label } = getCursorContent(target);
      dispatchCursor({
        icon,
        label,
        type: "show",
        x: position.x,
        y: position.y,
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

    let scrollFrameId: number | null = null;
    const handleScroll = () => {
      if (scrollFrameId !== null) {
        return;
      }

      scrollFrameId = window.requestAnimationFrame(() => {
        scrollFrameId = null;
        syncFromLatestPointer();
      });
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("resize", syncFromLatestPointer);
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("mouseout", handleWindowMouseOut);
    window.addEventListener("blur", hideCursor);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("resize", syncFromLatestPointer);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mouseout", handleWindowMouseOut);
      window.removeEventListener("blur", hideCursor);
      if (scrollFrameId !== null) {
        window.cancelAnimationFrame(scrollFrameId);
      }
    };
  }, [enabled]);

  return cursor;
};

export const useCursorPresentation = (
  cursor: CursorState,
  contentRef: RefObject<HTMLDivElement | null>
) => {
  const [contentWidth, setContentWidth] = useState(0);
  const renderedLabel = getRenderedLabel(cursor);
  const showLabel = shouldShowLabel(cursor);
  const renderedIcon = CURSOR_ICON_MAP[cursor.icon] ?? null;

  useLayoutEffect(() => {
    const contentElement = contentRef.current;

    if (!contentElement) {
      setContentWidth(0);
      return;
    }

    setContentWidth(contentElement.scrollWidth);
  }, [contentRef, renderedLabel, renderedIcon]);

  const expandedWidth = getExpandedCursorWidth(contentWidth);

  return useMemo(
    () => ({
      height: showLabel ? CURSOR_LABEL_HEIGHT : CURSOR_DOT_SIZE,
      minWidth: showLabel ? expandedWidth : CURSOR_DOT_SIZE,
      paddingInline: showLabel ? CURSOR_LABEL_PADDING : 0,
      width: showLabel ? expandedWidth : CURSOR_DOT_SIZE,
    }),
    [expandedWidth, showLabel]
  );
};
