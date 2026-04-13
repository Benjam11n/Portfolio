# Animation Guidelines

This document outlines the animation philosophy, best practices, and technical standards for the Three.js Portfolio website. All animations should be purposeful, performant, and support content consumption rather than distract from it.

## Table of Contents

- [Philosophy](#philosophy)
- [Core Principles](#core-principles)
- [Duration Limits](#duration-limits)
- [Skip Functionality](#skip-functionality)
- [Reduced Motion Support](#reduced-motion-support)
- [Using Animation Constants](#using-animation-constants)
- [Performance Monitoring](#performance-monitoring)
- [Documentation Standards](#documentation-standards)
- [Examples](#examples)

## Philosophy

Every animation in this portfolio serves a specific purpose: **to guide attention, provide feedback, or demonstrate capability**. We avoid animations that are purely decorative or distract from the content. This approach addresses common competitor pain points:

- **Avoids** animations that are too long or obnoxious (competitor pain-6-2)
- **Prevents** distracting constant movement (competitor pain-6-3)
- **Maintains** sophistication without sacrificing usability

Our goal is to impress recruiters and visitors with polished, thoughtful interactions while respecting their time and attention.

## Core Principles

### 1. Purpose-Driven Design

Every animation must answer: **"What user feedback or guidance does this provide?"**

Valid animation purposes:

- **Guide attention**: Draw focus to important elements (e.g., profile image, call-to-action)
- **Provide feedback**: Confirm user interactions (e.g., hover states, button clicks)
- **Demonstrate capability**: Showcase technical skill in a subtle way (e.g., 3D effects, smooth transitions)

Invalid animation purposes:

- Pure decoration without functional value
- Filling space or adding "movement for movement's sake"
- Showing off complex animations that don't enhance user experience

### 2. Performance First

Animations must stay within performance budgets:

- **Target FPS**: 60fps (16.67ms per frame)
- **Minimum FPS**: 30fps (33ms per frame)
- **Frame drops**: Max 10% of frames during animation

Monitor performance in development using the `useAnimationPerformance` hook.

### 3. Accessibility Always

Respect user preferences:

- **Reduced motion**: Check `prefersReducedMotion` for all animations
- **Skip functionality**: Allow users to skip animations via Escape key
- **Keyboard navigation**: Ensure all animations are keyboard-accessible

## Duration Limits

### Maximum Duration: 2 Seconds

Per our acceptance criteria, **no auto-playing animation should exceed 2 seconds** unless user-initiated. This ensures recruiters can quickly review content without waiting for long animations to complete.

### Duration Hierarchy

Use constants from `ANIMATION_DURATION`:

```typescript
QUICK: 300ms        // Micro-interactions (hover states, quick feedback)
SHORT: 350ms        // Brief transitions
MEDIUM_FAST: 500ms  // Standard entrance animations (most common)
STANDARD: 600ms     // Default transition duration
MEDIUM_SLOW: 700ms  // Deliberate reveals
LONG: 800ms         // Maximum duration (use sparingly)
MAX: 2000ms         // Absolute maximum for entire animation sequence
```

### When to Use Each Duration

- **QUICK (300ms)**: Button hovers, micro-interactions, snappy feedback
- **MEDIUM_FAST (500ms)**: Element entrances, standard transitions (default)
- **STANDARD (600ms)**: Multi-element sequences, scroll-triggered animations
- **LONG (800ms)**: Hero image introductions, emphasis moments (rare)
- **MAX (2000ms)**: Total sequence duration only, never individual animations

### Hero Animation Example

The hero section completes in **1.05 seconds** total:

```
1. Profile Image:    0.0s → 0.5s   (0.5s duration)
2. Name Reveal:      0.2s → 1.05s  (0.5s + stagger)
3. Badge:           0.6s → 0.85s  (0.25s duration)
4. Hero Text:       0.4s → 0.7s   (0.5s + stagger)
5. Buttons:         0.6s → 1.05s  (0.5s + stagger)
```

**Strategy**: Overlap animations to compress timeline while maintaining visual hierarchy.

## Skip Functionality

### Escape Key Support

Users can skip all animations by pressing the **Escape key**. This feature:

- Is implemented via `useAnimationSkipContext`
- Persists state in `localStorage` across sessions
- Shows a brief "Animations skipped" indicator
- Instantly sets all elements to their final state

### Implementation Pattern

```typescript
import { useAnimationSkipContext } from "@/lib/contexts/animation-skip-context";

const { skipAnimations } = useAnimationSkipContext();

useGSAP(() => {
  // Check skip preference before animating
  if (skipAnimations || prefersReducedMotion) {
    // Set elements to final state instantly
    gsap.set(elementRef.current, { opacity: 1, y: 0 });
    return;
  }

  // Normal animation sequence
  gsap.from(elementRef.current, {
    opacity: 0,
    y: 20,
    duration: ANIMATION_DURATION.MEDIUM_FAST / 1000,
  });
});
```

### Components with Skip Support

All section components support skip functionality:

- ✅ Hero
- ✅ Projects
- ✅ Experience
- ✅ Contact
- ✅ Tech Stack
- ✅ Certification

## Reduced Motion Support

### OS-Level Preference

Respect the `prefers-reduced-motion` media query for users with motion sensitivity or vestibular disorders.

### Implementation Pattern

```typescript
import { usePrefersReducedMotion } from "@/lib/hooks/use-prefers-reduced-motion";

const prefersReducedMotion = usePrefersReducedMotion();

useGSAP(() => {
  // Early return for reduced motion
  if (prefersReducedMotion) {
    // Set elements to final state without animation
    gsap.set(elementRef.current, { scale: 1, autoAlpha: 1 });
    return;
  }

  // Animate normally
  gsap.from(elementRef.current, {
    scale: 0,
    autoAlpha: 0,
    duration: ANIMATION_DURATION.MEDIUM_FAST / 1000,
  });
});
```

### Components with Reduced Motion Support

All animations respect reduced motion preference:

- ✅ Section entrance animations (Hero, Projects, Experience, etc.)
- ✅ Interactive effects (Card3D, ShiftText, Magnetic)
- ✅ Layout animations (Footer, ClickSpark, Dither background)

### Reduced Motion Behavior

When reduced motion is enabled:

- **Entrance animations**: Elements appear instantly at final state
- **Interactive effects**: No hover animations, tilt, or parallax
- **Background effects**: Static pattern, no continuous animation
- **User-initiated effects**: No spark particles, magnetic pull, or glare

## Using Animation Constants

All animation values should use constants from `@/lib/constants/animation.ts` to ensure consistency across the application.

### Duration Constants

```typescript
import { ANIMATION_DURATION } from "@/lib/constants/animation";

// ✅ Correct
duration: ANIMATION_DURATION.MEDIUM_FAST / 1000;

// ❌ Wrong - magic number
duration: 0.5;
```

### Easing Constants

```typescript
import { ANIMATION_EASING } from "@/lib/constants/animation";

// ✅ Correct
ease: ANIMATION_EASING.DEFAULT; // power4.out (smooth deceleration)
ease: ANIMATION_EASING.ELASTIC; // elastic.out(1, 0.75) (playful bounce)
ease: ANIMATION_EASING.BACK_STRONG; // back.out(2) (strong overshoot)

// ❌ Wrong - string literal
ease: "power4.out";
```

### Easing Guide

- **DEFAULT (power4.out)**: Standard smooth deceleration (most common)
- **POWER3 (power3.out)**: Slightly faster deceleration
- **ELASTIC**: Bouncy effect for playful interactions (hero image)
- **BACK_SUBTLE (back.out(1.2))**: Slight overshoot for emphasis
- **BACK_MEDIUM (back.out(1.5))**: Medium overshoot
- **BACK_STRONG (back.out(2))**: Strong overshoot for high emphasis (badge)

### Stagger Constants

```typescript
import { ANIMATION_STAGGER } from "@/lib/constants/animation";

// ✅ Correct
stagger: ANIMATION_STAGGER.STANDARD; // 0.1s between elements

// ❌ Wrong - magic number
stagger: 0.1;
```

### Stagger Guide

- **QUICK (0.05s)**: Rapid sequences (character-by-character text)
- **STANDARD (0.1s)**: Most multi-element animations
- **SLOW (0.15s)**: Deliberate sequences
- **VERY_SLOW (0.2s)**: Dramatic reveals (rare)

### Scroll Trigger Starts

```typescript
// ✅ Correct
start: "top 80%"; // start when section is comfortably in view

// ❌ Wrong - magic number
start: "top 80%";
```

### Performance Budget Constants

```typescript
import { ANIMATION_BUDGET } from "@/lib/constants/animation";

// Performance thresholds
ANIMATION_BUDGET.TARGET_FPS; // 60
ANIMATION_BUDGET.MIN_FPS; // 30
ANIMATION_BUDGET.MAX_FRAME_TIME; // 33ms
ANIMATION_BUDGET.MAX_FRAME_DROPS_PERCENTAGE; // 0.1 (10%)
```

## Performance Monitoring

### Use the Performance Hook

Track animation performance with `useAnimationPerformance`:

```typescript
import { useAnimationPerformance } from "@/lib/hooks/use-animation-performance";

const performanceMetrics = useAnimationPerformance();

// Start tracking when animation begins
performanceMetrics.startTracking();

// Stop tracking when animation completes
const duration = performanceMetrics.stopTracking();

// Check performance
if (performanceMetrics.fps < 30) {
  console.warn("Animation performance is poor");
}

if (performanceMetrics.frameTime > 33) {
  console.warn("Frame time exceeds 33ms budget");
}
```

### Development Mode Logging

Log performance metrics in development to identify issues:

```typescript
onComplete: () => {
  const duration = performanceMetrics.stopTracking();

  if (process.env.NODE_ENV === "development") {
    console.log("[Component] Animation complete - Performance metrics:", {
      fps: performanceMetrics.fps,
      frameTime: performanceMetrics.frameTime,
      duration: `${duration.toFixed(2)}ms`,
      frameDrops: performanceMetrics.frameDrops,
    });

    // Warn if performance is below budget
    if (performanceMetrics.fps < 30) {
      console.warn(
        "[Component] ⚠️ Poor FPS detected:",
        performanceMetrics.fps,
        "- Consider reducing animation complexity"
      );
    }
    if (performanceMetrics.frameTime > 33) {
      console.warn(
        "[Component] ⚠️ High frame time detected:",
        `${performanceMetrics.frameTime}ms`,
        "- Exceeds 33ms budget (30 FPS)"
      );
    }
  }
};
```

### Performance Budget Thresholds

- **Target**: 60 FPS (16.67ms per frame)
- **Minimum**: 30 FPS (33ms per frame)
- **Warning**: Log warnings if FPS < 30 or frame time > 33ms
- **Long tasks**: Avoid tasks > 50ms (cause jank)

### Components with Performance Monitoring

- ✅ Hero section (tracks entire animation sequence)
- Future: Add to other complex sequences as needed

## Documentation Standards

Every animation must be documented with inline comments explaining:

### 1. Purpose

What user feedback or guidance does this animation provide?

### 2. Duration

Why was this timing chosen? How does it fit the sequence?

### 3. Skipping

How does it behave when animations are skipped?

### Documentation Template

```typescript
/**
 * ELEMENT NAME ANIMATION
 * ======================
 * Purpose: [What user feedback or guidance this provides]
 *   [Additional context about why this animation matters]
 *
 * Duration: [Duration value] ([CONSTANT_NAME]) with [easing type].
 *   [Why this timing was chosen and how it fits the sequence]
 *
 * Skipping: [How it behaves when skipped]
 *   [What final state users see instantly]
 */
```

### Example from Hero Section

```typescript
/**
 * PROFILE IMAGE ANIMATION
 * ========================
 * Purpose: Draws immediate attention to the personal, human element of this portfolio.
 *   The scale-in effect with elastic easing creates a playful, energetic introduction
 *   that establishes the portfolio's creative character and invites engagement.
 *
 * Duration: 0.5s (MEDIUM_FAST) with elastic easing. This timing provides enough duration
 *   for the elastic effect to be noticeable and satisfying without feeling sluggish.
 *   The elastic easing adds bounce that reinforces the creative, dynamic tone.
 *
 * Skipping: When animations are skipped (reduced motion preference or Escape key),
 *   the image instantly appears at its final state (scale: 1, fully visible, no rotation).
 *   This ensures users see the profile photo immediately without any delay.
 */
tl.fromTo(
  imageRef.current,
  { scale: 0, x: offset, autoAlpha: 0, rotate: -15 },
  {
    scale: 1,
    x: 0,
    autoAlpha: 1,
    rotate: 0,
    duration: ANIMATION_DURATION.MEDIUM_FAST / 1000,
    ease: ANIMATION_EASING.ELASTIC,
  }
);
```

## Examples

### Complete Example: Section Animation

```typescript
"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";
import {
  ANIMATION_DURATION,
  ANIMATION_EASING,
  ANIMATION_STAGGER,
} from "@/lib/constants/animation";
import { useAnimationSkipContext } from "@/lib/contexts/animation-skip-context";
import { usePrefersReducedMotion } from "@/lib/hooks/use-prefers-reduced-motion";
import { useAnimationPerformance } from "@/lib/hooks/use-animation-performance";

export const MySection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  const { skipAnimations } = useAnimationSkipContext();
  const performanceMetrics = useAnimationPerformance();

  useGSAP(() => {
    // Skip all animations if user prefers reduced motion or if animations were skipped
    if (prefersReducedMotion || skipAnimations) {
      // Set all elements to their final state instantly
      gsap.set(".item", { opacity: 1, y: 0 });
      return;
    }

    // Start performance tracking
    performanceMetrics.startTracking();

    const tl = gsap.timeline({
      defaults: { ease: ANIMATION_EASING.DEFAULT },
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 80%", // start when section is comfortably in view
      },
      onComplete: () => {
        // Stop tracking and log metrics when animation completes
        const duration = performanceMetrics.stopTracking();
        if (process.env.NODE_ENV === "development") {
          console.log("[MySection] Animation complete - Performance metrics:", {
            fps: performanceMetrics.fps,
            frameTime: performanceMetrics.frameTime,
            duration: `${duration.toFixed(2)}ms`,
            frameDrops: performanceMetrics.frameDrops,
          });
        }
      },
    });

    /**
     * CARDS REVEAL ANIMATION
     * ======================
     * Purpose: Draws attention to project cards as they enter the viewport,
     *   creating a sense of discovery and encouraging exploration.
     *
     * Duration: 0.6s (STANDARD) per card with 0.1s stagger between cards.
     *   This timing feels substantial enough to be noticeable without feeling slow.
     *   The stagger creates a flowing, sequential reveal that guides the eye.
     *
     * Skipping: When animations are skipped, all cards instantly appear
     *   in their final state (opacity: 1, y: 0). Users can immediately
     *   scan and interact with projects without waiting.
     */
    tl.from(".item", {
      opacity: 0,
      y: 30,
      duration: ANIMATION_DURATION.STANDARD / 1000, // 0.6s
      stagger: ANIMATION_STAGGER.STANDARD, // 0.1s
      ease: ANIMATION_EASING.DEFAULT,
    });
  });

  return (
    <div ref={containerRef}>
      <div className="item">Item 1</div>
      <div className="item">Item 2</div>
      <div className="item">Item 3</div>
    </div>
  );
};
```

### Interactive Effect Example

```typescript
"use client";

import { usePrefersReducedMotion } from "@/lib/hooks/use-prefers-reduced-motion";
import { useState } from "react";

export const InteractiveButton = () => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    if (prefersReducedMotion) {
      // No animation - just show hover state
      setIsHovered(true);
      return;
    }

    // Animate hover effect
    setIsHovered(true);
    // Add GSAP or Framer Motion animation here
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    // Reset animation
  };

  return (
    <button
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`
        transition-all duration-300
        ${isHovered ? 'scale-105 shadow-lg' : 'scale-100'}
        ${prefersReducedMotion ? '' : 'hover:scale-105'}
      `}
    >
      {isHovered ? 'Hovered' : 'Normal'}
    </button>
  );
};
```

## Summary

### Quick Checklist

Before adding or modifying an animation, verify:

- [ ] **Purpose**: Does this animation serve a clear purpose (guide attention, provide feedback, demonstrate capability)?
- [ ] **Duration**: Does it complete within 2 seconds (or use QUICK/MEDIUM_FAST/STANDARD constants)?
- [ ] **Skip**: Can users skip it via Escape key?
- [ ] **Reduced Motion**: Does it respect `prefersReducedMotion`?
- [ ] **Constants**: Does it use animation constants (no magic numbers)?
- [ ] **Performance**: Is performance monitored and within budget?
- [ ] **Documentation**: Is it documented with Purpose, Duration, and Skipping behavior?

### Key Takeaways

1. **Purpose over polish**: Every animation must have a clear purpose
2. **Performance is paramount**: Monitor and optimize for 60fps
3. **Respect preferences**: Support reduced motion and skip functionality
4. **Use constants**: Ensure consistency with animation constants
5. **Document everything**: Explain purpose, duration, and skipping behavior

### Resources

- **Animation Constants**: `@/lib/constants/animation.ts`
- **Performance Hook**: `@/lib/hooks/use-animation-performance.ts`
- **Reduced Motion Hook**: `@/lib/hooks/use-prefers-reduced-motion.ts`
- **Skip Context**: `@/lib/contexts/animation-skip-context.ts`

---

**Last Updated**: 2025-01-17
**Related Spec**: Strategic Animation Enhancement (Task 019)
