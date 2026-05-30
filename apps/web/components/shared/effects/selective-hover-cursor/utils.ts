import {
  CURSOR_LABEL_MIN_WIDTH,
  CURSOR_LABEL_PADDING,
  POINTER_OFFSET,
} from "@/components/shared/effects/selective-hover-cursor/constants";
import type {
  CursorAction,
  CursorState,
} from "@/components/shared/effects/selective-hover-cursor/types";
import {
  HOVER_CURSOR_ICON_ATTRIBUTE,
  HOVER_CURSOR_LABEL_ATTRIBUTE,
  HOVER_CURSOR_SELECTOR,
} from "@/lib/constants/interaction";

export const EMPTY_CURSOR_STATE: CursorState = {
  displayLabel: "",
  icon: "",
  label: "",
  visible: false,
  x: -9999,
  y: -9999,
};

export const cursorReducer = (
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

export const getHoverTarget = (clientX: number, clientY: number) =>
  document.elementFromPoint(clientX, clientY)?.closest(HOVER_CURSOR_SELECTOR) ??
  null;

export const getCursorContent = (target: Element) => ({
  icon: target.getAttribute(HOVER_CURSOR_ICON_ATTRIBUTE) ?? "",
  label: target.getAttribute(HOVER_CURSOR_LABEL_ATTRIBUTE) ?? "",
});

export const getCursorPosition = (clientX: number, clientY: number) => ({
  x: clientX + POINTER_OFFSET,
  y: clientY + POINTER_OFFSET,
});

export const getRenderedLabel = (cursor: CursorState) => {
  if (cursor.label) {
    return cursor.label;
  }

  if (cursor.visible && cursor.icon) {
    return "";
  }

  return cursor.displayLabel;
};

export const shouldShowLabel = (cursor: CursorState) =>
  cursor.visible && (cursor.label.length > 0 || cursor.icon.length > 0);

export const getExpandedCursorWidth = (contentWidth: number) =>
  Math.max(CURSOR_LABEL_MIN_WIDTH, contentWidth + CURSOR_LABEL_PADDING * 2);
