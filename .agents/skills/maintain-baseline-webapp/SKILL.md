---
name: maintain-baseline-webapp
description: Maintain Admin Starter safely and consistently. Use for implementation, refactoring, debugging, dependency upgrades, configuration changes, UI maintenance, test updates, repository cleanup, or template preparation in this repository. Route each task through the project architecture, relevant library constitutions, existing recipes and patterns, scoped validation, and a concise evidence-based handoff.
---

# Maintain Admin Starter

Preserve the repository's architecture and quality gates while making the
smallest complete change. Treat `AGENTS.md` as the governing project contract.

## 1. Establish scope and current state

1. Read `AGENTS.md`.
2. Inspect `git status --short`; preserve user changes and avoid unrelated
   cleanup.
3. Classify the request before acting:
   - Explain or review: inspect and report; do not mutate.
   - Diagnose: find and evidence the cause; fix only when requested.
   - Change: implement, test, and finish all applicable definition-of-done
     items.
   - Publish or delete: require explicit authorization and verify the exact
     repository target before changing external state.
4. Inspect the current implementation and nearby tests before choosing an
   abstraction.

## 2. Load only authoritative context

Always read the relevant document under `docs/architecture/`, then read
`docs/constitutions/index.md`. Load only constitutions for libraries touched by
the task.

Use this routing guide:

| Change                                      | Required context                                                                                   |
| ------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| Routes, layouts, server rendering, handlers | `system-design.md`, `nextjs.md`, `typescript.md`                                                   |
| Components, hooks, providers                | `frontend-design.md`, `react.md`, `typescript.md`                                                  |
| Styling or primitives                       | `frontend-design.md`, `ui-design.md`, plus `tailwind.md`, `shadcn.md`, or `radix.md` as applicable |
| Environment configuration                   | `system-design.md`, `nextjs.md`, `t3-env.md`, `zod.md`                                             |
| Unit or browser tests                       | `vitest.md` or `playwright.md`                                                                     |
| Dependencies or dead code                   | the library constitution, `knip.md`, and `prettier.md`                                             |

Check `docs/recipes/index.md` before composing a page, form, dialog, collection,
or URL-filtered table. Adapt the matching recipe instead of inventing a parallel
pattern.

## 3. Implement within ownership boundaries

- Keep routes and layouts in `app/`; prefer Server Components.
- Keep shell components in `app/components/` and Overview-only sections in
  `app/(app)/_components/`.
- Keep reusable, behavior-free primitives in `components/ui/`.
- Keep framework-independent helpers and domain modules in `lib/`.
- Add `'use client'` only at the lowest boundary that needs browser state,
  hooks, or event handlers.
- Use strict TypeScript; do not add `any`, unsafe casts, `@ts-ignore`, JavaScript
  files, placeholders, or speculative abstractions.
- Preserve visible validation, errors, warnings, loading states, and actionable
  status feedback.
- Update existing tests when behavior changes. Add tests at the nearest useful
  boundary rather than duplicating coverage.

When changing a primitive in `components/ui/`, add or update its working example
on `/` in the same change. Do not add a separate style-guide route. Use `demo-`
for demonstration control IDs.

## 4. Maintain configuration and dependencies

- Prefer existing dependencies and abstractions.
- For a new library, add a focused constitution under `docs/constitutions/` and
  an index row.
- Keep environment schemas in root `env.ts`; mirror non-secret names in
  `.env.example`.
- Use the package manager and preserve the lockfile. Review manifest and lockfile
  diffs for unintended upgrades.
- Run Knip after dependency or entry-point changes. Configure genuine framework
  entry points narrowly; never silence broad directories.
- Ignore generated build artifacts in lint, formatting, and version control
  rather than editing generated output.

## 5. Preserve the template runtime boundary

- Treat this as a standard Node.js Next.js app. Do not add hosting adapters,
  deployment configuration, or alternate runtimes unless explicitly requested.
- Keep generated app identity in `project.json` and template catalog identity in
  `template.json`. Naming runs before the production build.
- Keep the starter credential-free. Clearly identify demo data and its lifetime.
- Onyx owns project isolation, process ports, and preview proxying.
- Validate template releases with `npm run template:smoke` from a clean copy.
- Publishing a repository requires user authorization; never expose local env
  files, generated output, or dependencies.

## 6. Validate proportionally

Run focused checks while iterating, then complete the applicable gate:

- Documentation-only: `npm run format:check` and `git diff --check`.
- `lib/` behavior: focused Vitest, then `npm run check`.
- UI, routing, shell, or client flows: `npm run check`, then
  `npm run test:e2e` when browser dependencies are available.
- Before handoff, prefer `npm run check:all` when its full scope is applicable
  and browser dependencies are available.

Do not weaken tests, lint rules, strict compiler settings, or quality gates to
make a change pass. Fix the underlying issue.

## 7. Hand off with evidence

Lead with the outcome. Summarize changed behavior and important files, list the
validation that passed, and state any remaining risk or required external step.
Mention destructive actions and whether recovery is possible. Do not claim a
deployment succeeded until the live endpoint has been verified.
