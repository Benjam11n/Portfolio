import { renderHook, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useDeferredRecaptcha } from "./use-deferred-recaptcha";
import type { Grecaptcha } from "@repo/testing/test-types";

// Mock env
vi.mock("@/lib/env", () => ({
  env: {
    NEXT_PUBLIC_RECAPTCHA_SITE_KEY: "test-site-key",
  },
}));

// Mock logger
vi.mock("@repo/logger", () => ({
  logger: {
    error: vi.fn(),
    warn: vi.fn(),
  },
}));

describe("useDeferredRecaptcha", () => {
  let _scriptLoaded = false;
  let _readyCallback: (() => void) | null = null;
  const mockExecute = vi.fn();

  beforeEach(() => {
    _scriptLoaded = false;
    _readyCallback = null;
    mockExecute.mockClear();
    vi.clearAllMocks();

    // Reset window properties
    // @ts-expect-error
    window.grecaptcha = undefined;

    // Mock document.createElement and appendChild for script loading
    const originalCreateElement = document.createElement;
    vi.spyOn(document, "createElement").mockImplementation((tagName) => {
      const element = originalCreateElement.call(document, tagName);
      if (tagName === "script") {
        setTimeout(() => {
          // Simulate script load
          _scriptLoaded = true;
          // Set up global grecaptcha
          (window as unknown as { grecaptcha?: Grecaptcha }).grecaptcha = {
            ready: (cb: () => void) => {
              _readyCallback = cb;
              cb();
            },
            execute: mockExecute,
            render: () => "mock-widget-id",
          } satisfies Grecaptcha;
          element.dispatchEvent(new Event("load"));
        }, 10);
      }
      return element;
    });

    vi.spyOn(document.head, "appendChild");
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should initialize with blocked state", () => {
    const { result } = renderHook(() => useDeferredRecaptcha());

    expect(result.current.isRecaptchaLoaded).toBe(false);
    expect(result.current.isRecaptchaReady).toBe(false);
  });

  it("should load recaptcha script when loadRecaptcha is called", async () => {
    const { result } = renderHook(() => useDeferredRecaptcha());

    result.current.loadRecaptcha();

    expect(document.createElement).toHaveBeenCalledWith("script");
    expect(document.head.appendChild).toHaveBeenCalled();

    await waitFor(() => {
      expect(result.current.isRecaptchaLoaded).toBe(true);
    });

    await waitFor(() => {
      expect(result.current.isRecaptchaReady).toBe(true);
    });
  });

  it("should execute onLoad callback when ready", async () => {
    const onLoadMock = vi.fn();
    const { result } = renderHook(() =>
      useDeferredRecaptcha({ onLoad: onLoadMock })
    );

    result.current.loadRecaptcha();

    await waitFor(() => {
      expect(onLoadMock).toHaveBeenCalled();
    });
  });

  it("should not reload script if already loaded", async () => {
    const { result } = renderHook(() => useDeferredRecaptcha());

    result.current.loadRecaptcha();
    await waitFor(() => expect(result.current.isRecaptchaLoaded).toBe(true));

    // Clear mocks to verify no new calls
    vi.clearAllMocks();

    // Call load again
    result.current.loadRecaptcha();

    expect(document.createElement).not.toHaveBeenCalled();
    expect(document.head.appendChild).not.toHaveBeenCalled();
  });

  it("should execute recaptcha action successfully", async () => {
    mockExecute.mockResolvedValue("test-token");
    const { result } = renderHook(() => useDeferredRecaptcha());

    // Load first
    result.current.loadRecaptcha();
    await waitFor(() => expect(result.current.isRecaptchaReady).toBe(true));

    const token = await result.current.executeRecaptcha("submit");

    expect(mockExecute).toHaveBeenCalledWith("test-site-key", {
      action: "submit",
    });
    expect(token).toBe("test-token");
  });

  it("should return null if execute called before ready", async () => {
    const { result } = renderHook(() => useDeferredRecaptcha());

    // Note: NOT loading recaptcha

    const token = await result.current.executeRecaptcha("submit");
    expect(token).toBeNull();
    expect(mockExecute).not.toHaveBeenCalled();
  });

  it("should handle execution errors", async () => {
    mockExecute.mockRejectedValue(new Error("Execution failed"));
    const { result } = renderHook(() => useDeferredRecaptcha());

    // Load first
    result.current.loadRecaptcha();
    await waitFor(() => expect(result.current.isRecaptchaReady).toBe(true));

    const token = await result.current.executeRecaptcha("submit");

    expect(token).toBeNull();
  });
});
