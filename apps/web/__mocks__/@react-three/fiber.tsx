import { vi } from "vitest";

interface ThreeMock {
  gl: { getPixelRatio: () => number };
  invalidate: () => void;
  size: { height: number; width: number };
  viewport: { height: number; width: number };
}

export const Canvas = vi.fn((_: unknown) => <div data-testid="canvas" />);
export const useThree: () => ThreeMock = vi.fn(() => ({
  gl: { getPixelRatio: () => 1 },
  invalidate: vi.fn(),
  size: { height: 100, width: 100 },
  viewport: { height: 1, width: 1 },
}));
