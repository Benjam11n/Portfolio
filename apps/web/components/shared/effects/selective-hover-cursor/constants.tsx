import { ArrowUpRight, Pause, Play } from "lucide-react";
import type { ReactNode } from "react";

export const CURSOR_ICON_MAP: Record<string, ReactNode> = {
  "arrow-up-right": <ArrowUpRight height={12} width={12} />,
  pause: <Pause height={12} width={12} />,
  play: <Play height={12} width={12} />,
};

export const POINTER_MEDIA_QUERY = "(hover: hover) and (pointer: fine)";
export const POINTER_OFFSET = 12;
export const CURSOR_DOT_SIZE = 18;
export const CURSOR_LABEL_HEIGHT = 28;
export const CURSOR_LABEL_PADDING = 20;
export const CURSOR_LABEL_MIN_WIDTH = 84;
