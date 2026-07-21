import { vi } from "vitest";

export const secure: (
  allow: unknown[],
  sourceRequest?: Request
) => Promise<void> = vi.fn(() => Promise.resolve());
