import type { ReactNode, RefObject } from "react";

interface CursorContentProps {
  contentRef: RefObject<HTMLDivElement | null>;
  renderedIcon: ReactNode;
  renderedLabel: string;
  showLabel: boolean;
}

export const CursorContent = ({
  contentRef,
  renderedIcon,
  renderedLabel,
  showLabel,
}: CursorContentProps) => (
  <div className="flex items-center gap-1.5" ref={contentRef}>
    {renderedIcon && (
      <span className="selective-hover-cursor-icon" data-visible={showLabel}>
        {renderedIcon}
      </span>
    )}
    {renderedLabel && <span data-visible={showLabel}>{renderedLabel}</span>}
  </div>
);
