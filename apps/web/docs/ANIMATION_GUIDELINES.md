# Animation Guidelines

Keep motion polished, brief, accessible, and cheap to render. Animation should
guide attention or confirm interaction without delaying access to content.

## Tools

- Use GSAP for timelines, scroll reveals, and imperative effects.
- Use Framer Motion for component state and layout transitions.
- Use React Three Fiber only for effects that need WebGL.
- Reuse `ANIMATION_DURATION`, `ANIMATION_EASING`, and `ANIMATION_STAGGER` from
  `@/lib/constants/animation` when they fit.

Keep animation behavior close to its feature. Shared hooks and effects belong
in `lib/hooks/animation` or `components/shared/effects` only when genuinely
reused.

## Rules

- Prefer transforms and opacity over layout-changing properties.
- Keep automatic sequences under two seconds. Most transitions should take
  300–800 ms.
- Avoid continuous animation unless it materially improves the experience.
- Scope GSAP selectors and clean up timelines, listeners, timers, and animation
  frames on unmount.
- Do not hide content until JavaScript runs unless the final state is restored
  for every skip path.
- Test keyboard interaction, responsive layouts, and touch behavior.

## Reduced and skipped motion

Use `useShouldReduceMotion` for the app-level motion decision. OS reduced-motion
preference maps directly to the low visual-performance tier, so those users see
the final state immediately. Disable parallax, tilt, particles, and continuous
movement where practical.

The global `AnimationSkipContext` toggles skipped animation with Escape.
Features using it must render their final state and stop ongoing work when
`skipAnimations` is true.

Use `useVisualPerformanceTier` for tiered visual quality. Use
`useShouldReduceMotion` when an animation only needs a binary stop-motion
decision; it returns `true` for the low tier.

## Performance

- Target smooth interaction and avoid long main-thread tasks.
- Pause off-screen, hidden, or inactive continuous effects.
- Prefer demand rendering for Three.js scenes.
- Keep shader resolution and update frequency as low as visual quality allows.
- Measure complex changes on representative desktop and mobile hardware.

Current dither background uses demand rendering. High-tier devices render at
`dpr={0.35}` and 12 FPS; medium-tier devices use `dpr={0.25}` and 8 FPS. The
low tier does not mount the dither. It pauses when inactive, disabled, reduced,
or globally skipped. Run `pnpm homepage:media-check` when changing homepage
visual assets.

## Review checklist

- Motion has a clear purpose.
- Reduced-motion and Escape paths show usable final content.
- Work stops when the effect is not visible or active.
- Cleanup prevents orphaned timers, listeners, and timelines.
- Animation remains readable and responsive without obvious jank.
