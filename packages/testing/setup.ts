import "@testing-library/jest-dom";
import { vi } from "vitest";

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  observe() {
    // Mock implementation
  }
  unobserve() {
    // Mock implementation
  }
  disconnect() {
    // Mock implementation
  }
};

// Mock Canvas 2D context
HTMLCanvasElement.prototype.getContext = ((type: string) => {
  if (type === "2d") {
    return {
      clearRect: vi.fn(),
      beginPath: vi.fn(),
      moveTo: vi.fn(),
      lineTo: vi.fn(),
      stroke: vi.fn(),
      fill: vi.fn(),
      arc: vi.fn(),
    };
  }
  return null;
}) as unknown as HTMLCanvasElement["getContext"];

// Mock requestAnimationFrame
global.requestAnimationFrame = (callback) => setTimeout(callback, 0);
global.cancelAnimationFrame = (id) => clearTimeout(id);
