# apps/web

Main Next.js application for the portfolio site.

Public-facing overview lives in the repository root [`README.md`](../README.md). This file stays intentionally small and app-specific.

## Run

```bash
pnpm install
cp apps/web/.env.example apps/web/.env.local
pnpm --filter web dev
```

## Useful Commands

```bash
pnpm --filter web build
pnpm --filter web test:ci
pnpm --filter web test:e2e
pnpm --filter web homepage:media-check
```

## Notes

- App Router entrypoints live in [`app`](./app)
- UI components live in [`components`](./components)
- Typed content, hooks, env, and runtime logic live in [`lib`](./lib)
- Animation and media guidance live in [`docs`](./docs)
