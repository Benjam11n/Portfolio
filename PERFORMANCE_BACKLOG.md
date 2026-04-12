# Performance Backlog

This file tracks the remaining performance work that was identified after the
phase 1 homepage payload reduction pass.

## Priority 1

### Add a shared capability and network policy layer

Create a single client utility or hook that determines whether the current
device/session should receive a `lite`, `standard`, or `rich` experience.

Inputs:

- `prefers-reduced-motion`
- `navigator.connection.saveData`
- `navigator.connection.effectiveType`
- hover/pointer capability
- viewport size
- optional `navigator.deviceMemory`

Outputs:

- `performanceMode`
- `allowPreviewVideo`
- `allowBackgroundEffects`
- `allow3DCardEffects`
- `allowSmoothScroll`

Reason:

- expensive visual decisions are currently scattered
- this gives one place to gate animation-adjacent enhancements for slower
  networks and weaker devices

### Broader server/client split on homepage

Convert more homepage sections into server-rendered shells plus small client
enhancers.

Priority candidates:

- `Projects`
- `Certifications`
- `Experience`
- `Contact`

Potential later candidates:

- `Hero`
- `About`

Reason:

- too much of the homepage still hydrates as client code
- static markup and content should render server-side wherever interaction is
  not required

## Priority 2

### Add explicit asset budgets

Define size budgets for homepage media:

- no raw GIFs on homepage
- preview videos capped
- posters capped
- homepage-specific image size thresholds

Reason:

- prevents regressions when adding new projects or media

### Add CI checks for media regressions

Add a script that fails if:

- homepage preview media exceeds configured size limits
- a homepage project points at a full demo video instead of preview media
- a homepage GIF exceeds threshold

Reason:

- this prevents accidentally reintroducing large startup payloads

## Priority 3

### Reduce homepage route JS further

The homepage JS bundle was reduced somewhat, but it is still heavy.

Continue isolating non-GSAP payloads:

- keep modal-only logic lazy
- keep form-only logic lazy
- investigate whether markdown rendering used on the homepage can be partially
  pre-rendered server-side
- trim unnecessary client-only wrappers where possible

Reason:

- media transfer was the biggest win, but JS weight is still meaningful

## Priority 4

### Add repeatable performance measurement workflow

Document a standard before/after audit process for homepage changes:

- Chrome DevTools network capture
- Lighthouse mobile run
- production build chunk comparison
- verification that no homepage video requests happen before user intent

Reason:

- performance work is easier to maintain when everyone measures the same way

### Add homepage-specific PR checklist

Add checklist items for changes affecting `/`:

- did startup requests increase?
- did any new large media get added?
- does reduced-motion still behave correctly?
- does mobile still avoid desktop-only enhancements?

Reason:

- helps catch regressions during normal feature work

## Nice-To-Have

### Upgrade posters to WebP when tooling supports it

Current preview posters are JPEG because the local ffmpeg build used during
phase 1 did not include WebP encoding support.

Future improvement:

- switch preview posters to WebP after confirming toolchain support

### Add richer slow-network fallbacks

Examples:

- static-only fallback mode for all decorative visuals
- simplified interaction affordances for low-capability sessions

Reason:

- useful once the shared capability policy exists

## Suggested Execution Order

1. shared capability/network policy
2. broader server/client homepage split
3. asset budgets and CI checks
4. JS bundle reduction follow-up
5. measurement workflow and PR checklist
