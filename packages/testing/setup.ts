import { vi } from "vitest";
import "@testing-library/jest-dom";

// Mock GSAP
vi.mock("gsap", () => ({
  default: {
    from: vi.fn(),
    fromTo: vi.fn(),
    quickTo: vi.fn(() => vi.fn()),
    registerPlugin: vi.fn(),
    set: vi.fn(),
    timeline: vi.fn(() => ({
      from: vi.fn(),
      fromTo: vi.fn(),
      pause: vi.fn(),
      paused: vi.fn(),
      play: vi.fn(),
      set: vi.fn(),
      to: vi.fn(),
    })),
    to: vi.fn(),
  },
}));

vi.mock("@gsap/react", () => ({
  useGSAP: () => ({
    contextSafe: <T extends (...args: unknown[]) => unknown>(fn: T) => fn,
  }),
}));

// Mock ResizeObserver
const ResizeObserverMock = vi.fn(() => ({
  disconnect: vi.fn(),
  observe: vi.fn(),
  unobserve: vi.fn(),
}));

vi.stubGlobal("ResizeObserver", ResizeObserverMock);

// Mock IntersectionObserver
class IntersectionObserverMock implements IntersectionObserver {
  readonly root: Element | null = null;
  readonly rootMargin: string = "";
  readonly thresholds: readonly number[] = [];

  constructor(
    callback: IntersectionObserverCallback,
    options?: IntersectionObserverInit
  ) {
    this.callback = callback;
    this.options = options;
  }

  callback: IntersectionObserverCallback;
  options?: IntersectionObserverInit;

  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
  takeRecords = vi.fn(() => []);
}

vi.stubGlobal("IntersectionObserver", IntersectionObserverMock);

// Mock Canvas 2D context
const mockCanvasContext = {
  arc: vi.fn(),
  beginPath: vi.fn(),
  clearRect: vi.fn(),
  drawImage: vi.fn(),
  fill: vi.fn(),
  fillRect: vi.fn(),
  fillText: vi.fn(),
  lineTo: vi.fn(),
  measureText: vi.fn(() => ({ width: 0 })),
  moveTo: vi.fn(),
  restore: vi.fn(),
  rotate: vi.fn(),
  save: vi.fn(),
  scale: vi.fn(),
  stroke: vi.fn(),
  translate: vi.fn(),
};

HTMLCanvasElement.prototype.getContext = ((type: string) => {
  if (type === "2d") {
    return mockCanvasContext as unknown as CanvasRenderingContext2D;
  }
  return null;
}) as unknown as HTMLCanvasElement["getContext"];

// Mock requestAnimationFrame
vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) =>
  setTimeout(callback, 0)
);
vi.stubGlobal("cancelAnimationFrame", (id: number) => clearTimeout(id));

// Mock matchMedia
Object.defineProperty(window, "matchMedia", {
  value: vi.fn().mockImplementation((query) => ({
    addEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
    matches: false,
    media: query,
    onchange: null,
    removeEventListener: vi.fn(),
  })),
  writable: true,
});
