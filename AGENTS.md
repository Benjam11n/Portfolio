# AGENTS.md

## Workspace Overview

- This repo is a `pnpm` + Turbo monorepo for a personal portfolio site.
- `apps/web` is the main product: a Next.js App Router site with interactive
  motion, 3D scenes, and contact flows.
- `packages/*` holds shared support code only: config, SEO, security, logging,
  testing, and TypeScript presets.
- Keep app code in `apps/web` unless logic is clearly reused across packages or
  runtime boundaries.

## Communication Defaults

- Use the `caveman` skill by default for user-facing responses in this
  workspace.
- Default intensity is `ultra`.
- If the user explicitly asks for normal writing, formal writing, or more
  explanation, suspend `caveman` until the request is complete.
- Keep code, commit messages, PR text, and other durable project artifacts in
  normal style unless the user explicitly asks otherwise.

## Stable Workflow Rules

- Run commands from the repository root with `pnpm`.
- Prefer root scripts when they fit:
  `pnpm build`, `pnpm lint`, `pnpm fix`, `pnpm typecheck`, `pnpm test:ci`.
- Use filtered commands for app-specific work:
  `pnpm --filter web dev|build|test|test:ci|test:e2e`.
- Never start a dev server unless the user explicitly asks for it.
- Before finalizing code changes, run `pnpm fix`.
- After meaningful changes, run the relevant checks for what changed. Minimum
  default for app code: `pnpm lint` and `pnpm typecheck`.

## Monorepo Practices

- Treat `apps/web` as the source of product behavior and UI composition.
- Treat `packages/seo`, `packages/security`, `packages/logger`,
  `packages/testing`, `packages/next-config`, and
  `packages/typescript-config` as focused shared infrastructure.
- Do not move code into `packages/*` just to avoid small duplication.
- Add shared packages only when reuse is real and ongoing.
- Keep exports narrow. Avoid broad barrel files and vague utility buckets.

## Code Quality Defaults

- Optimize for readability and straightforward control flow first.
- Prefer explicit types, validated boundaries, and small modules.
- Keep content/data in constants when it is static; keep behavior close to where
  it is used when it is app-specific.
- Reuse existing env and validation patterns with `zod` and `createEnv` rather
  than ad hoc `process.env` access.
- Respect existing test shape: Vitest for unit/component coverage, Playwright
  for end-to-end flows.

## UI Defaults

- Preserve the current visual direction: polished, minimal, motion-forward, but
  still readable and fast.
- Use animation intentionally. GSAP, Framer Motion, and Three.js should support
  hierarchy or delight, not distract from content.
- Favor responsive layouts, sharp spacing, and obvious navigation over extra
  decorative surfaces.
- Reuse existing UI primitives, utility patterns, and theme tokens before
  inventing new ones.
- Keep accessibility in scope: semantic markup, keyboard support, reduced
  motion awareness, and sensible fallbacks for heavy visual effects.

## Guardrails

- Do not silently weaken security, env validation, or analytics wiring in shared
  packages.
- Do not bypass performance concerns when touching animation-heavy sections.
- Avoid broad refactors unless they remove clear complexity or repeated pain.
