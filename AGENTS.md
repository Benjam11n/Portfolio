# AGENTS.md

## Repo

- pnpm + Turbo monorepo for a personal portfolio.
- `apps/web` is the product: Next.js App Router, motion, 3D, contact flows.
- `packages/*` is shared infrastructure only: analytics, logger, SEO, security,
  testing, Next config, TypeScript config.
- Keep product code in `apps/web`; move code to packages only for real ongoing
  reuse.

## Communication

- Use `caveman` skill for user-facing responses by default, intensity `ultra`.
- Suspend caveman when user asks for normal, formal, or fuller explanation.
- Keep code, commits, PRs, docs, and other durable artifacts in normal writing.

## Commands

- Run commands from repo root with `pnpm`.
- Prefer root scripts: `pnpm build`, `pnpm lint`, `pnpm fix`,
  `pnpm typecheck`, `pnpm test:ci`.
- For app-only work use: `pnpm --filter web dev|build|test|test:ci|test:e2e`.
- Never start a dev server unless explicitly asked.
- Before finalizing code changes, run `pnpm fix`.
- For meaningful app changes, run at least `pnpm lint` and `pnpm typecheck`.
- Use `pnpm knip` for dead-code/dependency cleanup.
- Use `pnpm homepage:media-check` when touching homepage media or visual assets.

## Code

- Prefer explicit types, small modules, and straightforward control flow.
- Keep static content/data in constants.
- Keep app-specific behavior close to where it is used.
- Use existing `zod` / `createEnv` env patterns; avoid ad hoc `process.env`.
- Preserve Vitest unit/component tests and Playwright e2e patterns.

## UI

- Preserve the current polished, minimal, motion-forward direction.
- Reuse existing UI primitives, utilities, and theme tokens.
- Use GSAP, Framer Motion, and Three.js intentionally, with reduced-motion
  support.
- Keep layouts responsive, readable, keyboard-accessible, and performant.

## Component Architecture

- `components/sections/*` composes page sections only; keep section orchestration
  thin.
- `components/features/*` owns domain-specific UI and behavior.
- `components/shared/*` is for genuinely reusable app components, not one-off
  feature code.
- `components/shared/effects/*` is for reusable visual/interaction effects.
- `components/bits/*` is for low-level visual primitives and self-contained
  animation bits.
- `components/ui/*` is for unstyled or lightly styled base primitives.
- Prefer feature-local `constants.ts`, `utils.ts`, hooks, tests, and small child
  components when a component grows.
- Use `index.ts` only as a narrow public entry for component folders; avoid broad
  barrel files.
- Do not leave root-level compatibility exports when moving components; update
  imports directly.

## Imports

- Use `@/` aliases for app imports.
- Import feature internals from their concrete file unless using that folder's
  public `index.ts`.
- Avoid cross-feature imports unless the dependency is truly shared; move it to
  `shared` only after reuse is real.

## Compatibility

- Do not leave shims, aliases, compatibility wrappers, or backward-compatibility
  paths just to reduce churn.
- Prefer updating callers directly unless the old path is required by an active
  external contract.

## Guardrails

- Do not weaken security, env validation, analytics, or shared package wiring.
- Do not ignore performance when changing animation-heavy sections.
- Avoid broad refactors unless they remove clear complexity.
