import { vi } from "vitest";

interface ToastMock {
  error: (...args: unknown[]) => void;
  success: (...args: unknown[]) => void;
}

export const toast: ToastMock = {
  error: vi.fn(),
  success: vi.fn(),
};
