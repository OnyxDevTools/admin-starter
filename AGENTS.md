# Project Agent Instructions

## Required workflow

Before modifying code:

1. Read the relevant architecture document under `docs/architecture/`.
2. Read `docs/constitutions/index.md`.
3. Read only the constitutions for libraries involved in the task.
4. Prefer an existing recipe under `docs/recipes/` when the task matches one.
5. Inspect existing project patterns before introducing new ones.

Do not load every constitution for every task.

## Onyx template workflow

- This is the `admin-starter` template for admin panels and internal tools.
- Read `docs/template-integration.md` when changing template setup or selection.
- Implement the user's domain by adapting the existing shell, Projects example,
  and recipes. Keep `/` as the component reference.
- Keep template identity in `template.json`; generated app identity lives in
  `project.json` and is initialized through `npm run template:init`.
- The starter requires no credentials. Demo project changes are in memory only;
  use the included Onyx Task adapter for persistence; add authentication and authorization before exposing database data.
- Use focused validation while editing and the full checks before delivery. Run
  `npm run template:smoke` when changing template setup, naming, or dependencies.

## Core requirements

- Use strict TypeScript.
- Preserve functionality outside the requested scope.
- Do not use placeholders in implementation code.
- Follow the existing project structure and naming.
- Prefer existing abstractions over introducing new ones.
- Update tests when behavior changes and a test suite exists.
- Treat this as a local-only Next.js application running on the standard Node.js runtime.
- Do not add hosting, deployment, or alternate-runtime adapters unless explicitly requested.

## Product UI direction

- Optimize for a clean, compact, control-driven interface.
- Communicate behavior through clear labels, visible control states, and concise data presentation.
- Preserve actionable validation, error, warning, and live status feedback.
- Avoid persistent helper copy or redundant action descriptions unless requested.

## Architecture authority

Design documents under `docs/architecture/` define intended system design. Do not silently depart from documented architecture.

Library-specific rules are indexed in `docs/constitutions/index.md`.

Feature scaffolds live under `docs/recipes/`. Prefer a recipe over inventing a new page composition.

## Overview component contract

`/` (Overview) is the living design-system and UI kitchen sink.

- Every new or materially changed primitive in `components/ui/` must ship with a working Overview example in the same change.
- Prefer refining an existing Overview card over adding a parallel demo elsewhere.
- Do not reintroduce a separate `/style-guide` route.

## Naming conventions

- Overview-only sections live in `app/(app)/_components/` as three named
  exports: `FoundationsSection`, `ControlsSection`, and `PatternsSection`.
- Shell components shared across routes live in `app/components/` with named
  exports (`AppSidebar`, `PageHeader`).
- Demo control IDs use a `demo-` prefix, not `sink-` or feature-specific jargon.

## Definition of done

A change is not complete until applicable items are finished:

1. Implementation matches the relevant constitutions and architecture docs.
2. New libraries have a constitution entry and an index row in `docs/constitutions/index.md`.
3. New or changed UI primitives have an Overview example.
4. New environment variables are wired in `env.ts` and documented in `.env.example`.
5. Behavior covered by unit tests (`lib/`) or Playwright (`e2e/`) has tests updated.
6. `npm run check` passes (lint, typecheck, format, dead code, unit tests, build).
7. Shell-visible navigation or baseline client flows have Playwright coverage when they change.
8. `npm run check:all` passes before handoff when browser dependencies are available.

## Commits and pull requests

- Use Conventional Commits (`feat:`, `fix:`, `docs:`, `chore:`, `test:`, `refactor:`).
- Keep commits focused; do not mix unrelated refactors with feature work.
- Fill the pull request template checklist before requesting review.

## Onyx persistence

Read `docs/onyx.md` before persistence changes. Keep SDK imports server-only,
externalized in Next, and lazy. Use the downloaded-config resolver; never expose
credentials or publish schemas during startup/build. `lib/onyx/tasks.ts` owns the
typed Task example. Authorize before using it in routes; use bounded pagination,
insert-only creation, filtered updates/deletes, and sanitized errors. No retries
or transaction guarantees for mutations. Run `npm run test:onyx`.
