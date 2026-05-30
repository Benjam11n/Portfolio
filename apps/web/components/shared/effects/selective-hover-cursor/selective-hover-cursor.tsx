"use client";

import { useRef } from "react";

import { CURSOR_ICON_MAP } from "@/components/shared/effects/selective-hover-cursor/constants";
import { CursorContent } from "@/components/shared/effects/selective-hover-cursor/cursor-content";
import {
  useCursorPresentation,
  useFinePointer,
  useHoverCursorState,
} from "@/components/shared/effects/selective-hover-cursor/hooks";
import {
  getRenderedLabel,
  shouldShowLabel,
} from "@/components/shared/effects/selective-hover-cursor/utils";
import { usePrefersReducedMotion } from "@/lib/hooks/ui/use-prefers-reduced-motion";

export const SelectiveHoverCursor = () => {
  const contentRef = useRef<HTMLDivElement>(null);
  const supportsFinePointer = useFinePointer();
  const prefersReducedMotion = usePrefersReducedMotion();
  const shouldEnable = supportsFinePointer && !prefersReducedMotion;
  const cursor = useHoverCursorState(shouldEnable);
  const cursorStyle = useCursorPresentation(cursor, contentRef);
  const renderedLabel = getRenderedLabel(cursor);
  const showLabel = shouldShowLabel(cursor);
  const renderedIcon = CURSOR_ICON_MAP[cursor.icon] ?? null;

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
        <CursorContent
          contentRef={contentRef}
          renderedIcon={renderedIcon}
          renderedLabel={renderedLabel}
          showLabel={showLabel}
        />
      </div>
    </div>
  );
};
