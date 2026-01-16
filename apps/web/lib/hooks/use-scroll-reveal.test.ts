import { renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { scrollRevealPresets, useScrollReveal } from "./use-scroll-reveal";

// Mock GSAP and ScrollTrigger
const { mockSet, mockTo, mockRegisterPlugin } = vi.hoisted(() => {
  return {
    mockSet: vi.fn(),
    mockTo: vi.fn(),
    mockRegisterPlugin: vi.fn(),
  };
});

vi.mock("gsap", () => ({
  default: {
    set: mockSet,
    to: mockTo,
    registerPlugin: mockRegisterPlugin,
  },
}));

vi.mock("gsap/ScrollTrigger", () => ({
  ScrollTrigger: {},
}));

// Mock useGSAP
vi.mock("@gsap/react", () => ({
  useGSAP: (callback: () => void, _options: unknown) => {
    callback();
  },
}));

describe("useScrollReveal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should apply default options when no preset is provided", () => {
    const containerRef = { current: document.createElement("div") };

    renderHook(() =>
      useScrollReveal(containerRef, ".item", { y: 50, duration: 1 })
    );

    expect(mockSet).toHaveBeenCalledWith(".item", {
      y: 50,
      x: 0,
      scale: undefined,
      autoAlpha: 0,
    });

    expect(mockTo).toHaveBeenCalledWith(
      ".item",
      expect.objectContaining({
        y: 0,
        x: 0,
        scale: 1,
        autoAlpha: 1,
        duration: 1,
        delay: 0,
        stagger: 0.1,
        ease: "power3.out",
      })
    );
  });

  it("should apply fadeIn preset correctly", () => {
    const containerRef = { current: document.createElement("div") };

    renderHook(() => useScrollReveal(containerRef, ".item", {}, "fadeIn"));

    expect(mockSet).toHaveBeenCalledWith(".item", {
      y: 0,
      x: 0,
      scale: undefined,
      autoAlpha: 0,
    });

    expect(mockTo).toHaveBeenCalledWith(
      ".item",
      expect.objectContaining({
        y: 0,
        x: 0,
        duration: 0.6,
        delay: 0,
        stagger: 0.05,
        ease: "power2.out",
      })
    );
  });

  it("should apply slideUp preset correctly", () => {
    const containerRef = { current: document.createElement("div") };

    renderHook(() => useScrollReveal(containerRef, ".item", {}, "slideUp"));

    expect(mockSet).toHaveBeenCalledWith(".item", {
      y: 30,
      x: 0,
      scale: undefined,
      autoAlpha: 0,
    });

    expect(mockTo).toHaveBeenCalledWith(
      ".item",
      expect.objectContaining({
        y: 0,
        x: 0,
        duration: 0.8,
        delay: 0,
        stagger: 0.1,
        ease: "power3.out",
      })
    );
  });

  it("should apply scaleUp preset correctly", () => {
    const containerRef = { current: document.createElement("div") };

    renderHook(() => useScrollReveal(containerRef, ".item", {}, "scaleUp"));

    expect(mockSet).toHaveBeenCalledWith(".item", {
      y: 0,
      x: 0,
      scale: 0.95,
      autoAlpha: 0,
    });

    expect(mockTo).toHaveBeenCalledWith(
      ".item",
      expect.objectContaining({
        y: 0,
        x: 0,
        scale: 1,
        duration: 0.6,
        delay: 0,
        stagger: 0.08,
        ease: "back.out(1.7)",
      })
    );
  });

  it("should apply quickFade preset correctly", () => {
    const containerRef = { current: document.createElement("div") };

    renderHook(() => useScrollReveal(containerRef, ".item", {}, "quickFade"));

    expect(mockSet).toHaveBeenCalledWith(".item", {
      y: 10,
      x: 0,
      scale: undefined,
      autoAlpha: 0,
    });

    expect(mockTo).toHaveBeenCalledWith(
      ".item",
      expect.objectContaining({
        y: 0,
        x: 0,
        duration: 0.4,
        delay: 0,
        stagger: 0.03,
        ease: "power1.out",
      })
    );
  });

  it("should override preset values with explicit options", () => {
    const containerRef = { current: document.createElement("div") };

    renderHook(() =>
      useScrollReveal(
        containerRef,
        ".item",
        { duration: 1.5, stagger: 0.2 },
        "fadeIn"
      )
    );

    expect(mockTo).toHaveBeenCalledWith(
      ".item",
      expect.objectContaining({
        duration: 1.5,
        stagger: 0.2,
        ease: "power2.out", // From fadeIn preset
      })
    );
  });

  it("should handle array of selectors correctly", () => {
    const containerRef = { current: document.createElement("div") };

    renderHook(() =>
      useScrollReveal(containerRef, [".title", ".description"], {}, "fadeIn")
    );

    expect(mockSet).toHaveBeenCalledWith(
      ".title, .description",
      expect.any(Object)
    );
    expect(mockTo).toHaveBeenCalledWith(
      ".title, .description",
      expect.any(Object)
    );
  });

  it("should maintain backward compatibility when preset is undefined", () => {
    const containerRef = { current: document.createElement("div") };

    renderHook(() => useScrollReveal(containerRef, ".item"));

    expect(mockSet).toHaveBeenCalled();
    expect(mockTo).toHaveBeenCalled();

    expect(mockTo).toHaveBeenCalledWith(
      ".item",
      expect.objectContaining({
        y: 0,
        x: 0,
        duration: 0.8,
        delay: 0,
        stagger: 0.1,
        ease: "power3.out",
      })
    );
  });

  it("should include scrollTrigger config in animation", () => {
    const containerRef = { current: document.createElement("div") };

    renderHook(() => useScrollReveal(containerRef, ".item", {}, "slideUp"));

    expect(mockTo).toHaveBeenCalledWith(".item", {
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 85%",
        toggleActions: "play none none none",
      },
      y: 0,
      x: 0,
      scale: 1,
      autoAlpha: 1,
      duration: 0.8,
      delay: 0,
      stagger: 0.1,
      ease: "power3.out",
    });
  });

  it("should export all required preset types", () => {
    expect(scrollRevealPresets).toBeDefined();
    expect(scrollRevealPresets.fadeIn).toBeDefined();
    expect(scrollRevealPresets.slideUp).toBeDefined();
    expect(scrollRevealPresets.scaleUp).toBeDefined();
    expect(scrollRevealPresets.quickFade).toBeDefined();
  });

  it("should have valid preset structure with all required properties", () => {
    const presets = ["fadeIn", "slideUp", "scaleUp", "quickFade"] as const;

    for (const presetName of presets) {
      const preset = scrollRevealPresets[presetName];

      expect(preset).toBeDefined();
      expect(preset).toHaveProperty("duration");
      expect(preset).toHaveProperty("stagger");
      expect(preset).toHaveProperty("ease");
      expect(preset).toHaveProperty("start");
      expect(preset).toHaveProperty("toggleActions");

      expect(typeof preset.duration).toBe("number");
      expect(typeof preset.stagger).toBe("number");
      expect(typeof preset.ease).toBe("string");
      expect(typeof preset.start).toBe("string");
      expect(typeof preset.toggleActions).toBe("string");
    }
  });

  it("should allow preset values to be overridden individually", () => {
    const containerRef = { current: document.createElement("div") };

    renderHook(() =>
      useScrollReveal(
        containerRef,
        ".item",
        { y: 100, ease: "bounce.out" },
        "slideUp"
      )
    );

    expect(mockSet).toHaveBeenCalledWith(".item", {
      y: 100, // Overridden
      x: 0,
      scale: undefined,
      autoAlpha: 0,
    });

    expect(mockTo).toHaveBeenCalledWith(
      ".item",
      expect.objectContaining({
        y: 0,
        ease: "bounce.out", // Overridden
        duration: 0.8, // From preset
      })
    );
  });
});
