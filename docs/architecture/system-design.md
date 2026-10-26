# System Design

## Purpose

This repository is a Next.js application skeleton for building a focused
desktop web application. It preserves routing, a shared navigation shell, a
dark design system, reusable UI primitives, client data-management libraries,
and representative pages without defining a product domain. Onyx selects this
starter for admin panels and internal tools, then adapts it from a user prompt.

## Runtime

- Next.js App Router on the standard Node.js runtime
- React Server Components by default
- Client Components only for browser state, event handling, or interactive
  library integrations
- Loopback-only local development through `npm run dev`
- Standard production preview through `npm run build` and `npm run start`
- No hosting or alternate-runtime adapter
- Onyx owns project isolation, assigned ports, and preview proxying

`project.json` owns the generated app name and package namespace. Run
`npm run template:init` before building to update this identity and package files.
The shell, metadata, and health response read that file directly. `template.json`
keeps the reusable template's catalog identity, selection hints, and runtime
contract; it is not an official Onyx API. See `docs/template-integration.md`.

There are no external services, authentication providers, databases, streams,
or privileged integrations in the skeleton.

## Route map

- `app/(app)/layout.tsx` owns the persistent application shell.
- `app/(app)/page.tsx` serves `/`, combining the overview, design-system
  reference, and UI kitchen sink.
- `app/(app)/projects/page.tsx` serves `/projects`; its local `_components/` own
  the demo collection and validated create/edit dialog.
- `app/(app)/settings/page.tsx` serves `/settings`.
- `app/api/health/route.ts` serves `/api/health`.

The `(app)` route group does not appear in URLs. It groups pages that share the
sidebar and application header while leaving room for future standalone route
groups such as authentication.

## Ownership boundaries

- `app/` owns routes, layouts, application providers, and route-specific UI.
- `app/(app)/_components/` owns Overview-only sections
  (`FoundationsSection`, `ControlsSection`, `PatternsSection`).
- `app/components/` owns shell components shared across routes (`AppSidebar`,
  `PageHeader`).
- `components/ui/` owns project-controlled shadcn/Radix primitives and contains
  no application behavior.
- `lib/` owns framework-independent utilities and future domain modules.
- `docs/architecture/` records system and frontend decisions.
- `docs/constitutions/` defines implementation rules by library.

## State and data flow

Server Components own initial rendering. TanStack Query is available through
the root provider for future remote server state. Form state belongs in React
Hook Form, runtime validation belongs in Zod, and URL-relevant state belongs in
nuqs-backed search parameters. Zustand is retained for future shared,
client-owned state but no store should be introduced until a concrete
cross-route requirement exists. Projects keeps demo rows in route-local memory,
with search, status, and pagination in nuqs URL state. Changes reset when the
route unmounts or reloads; this is explicitly labeled in the UI.

## Agent and contribution surface

- `AGENTS.md` defines the required agent workflow, Overview component contract,
  and definition of done.
- `docs/constitutions/` holds per-library implementation rules.
- `docs/recipes/` holds feature scaffolds for common page shapes.
- `CONTRIBUTING.md` and the pull request template enforce Conventional Commits
  and the same checklist.

## Validation

`npm run check` runs ESLint, strict TypeScript, Prettier verification, Knip
dead-code analysis, Vitest unit tests, and a standard Next.js production build.
Playwright exercises the application shell and representative client
interactions through `npm run test:e2e`; axe fails the suite on serious or
critical violations across `/`, `/projects`, `/settings`, and opened overlay
states in desktop and mobile Chromium. `npm run check:all` is the complete local
quality gate. Browser tests always start their own server on `E2E_PORT` (3217 by
default), fail on collisions, and verify project identity through health and
branding. `npm run template:smoke` verifies clean install, naming, build, health,
and route rendering from a fresh copy on an available port. GitHub Actions runs `check`, e2e, and an advisory `npm audit`, uses
read-only repository permissions, and retains failed Playwright diagnostics.
Dependabot keeps npm and Actions dependencies current. Husky runs lint-staged
(Prettier) on commit.

The `(app)` segment provides `loading.tsx` and `error.tsx`. Root `error.tsx`
and `global-error.tsx` cover failures outside the shell. `next.config.ts` sets
baseline security headers (`X-Content-Type-Options`, `X-Frame-Options`,
`Referrer-Policy`, `Permissions-Policy`).

## Non-goals

- Hosting adapters, deployment automation, or static-export variants
- Product-domain models or workflows
- Placeholder external integrations
- Background schedulers or persistent client runtimes without a feature need
