export interface CursorState {
  displayLabel: string;
  icon: string;
  label: string;
  visible: boolean;
  x: number;
  y: number;
}

export type CursorAction =
  | { type: "hide" }
  | { type: "reset" }
  | { icon: string; label: string; type: "show"; x: number; y: number };
