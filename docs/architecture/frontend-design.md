# Frontend Design

## Composition

The root layout owns fonts, metadata, theme CSS, the global toaster, and the
shared provider boundary. `AppProviders` composes the nuqs adapter, TanStack
Query client, and global Radix tooltip provider. The `(app)` layout owns the
persistent sidebar, top application bar, and main content bounds. Pages remain
Server Components unless interactivity requires a smaller client boundary.

## Component layers

### Application components

`app/components/` contains components tied to the application shell or shared
page composition. They may understand routes and application terminology.

### UI primitives

`components/ui/` contains project-owned shadcn components. Primitives expose
presentation and accessible interaction behavior but do not fetch data, manage
domain state, or choose application copy.

Prefer a local component for a pattern used by one route. Promote it to
`app/components/` only after reuse or stable shell ownership is demonstrated.
Overview-only composition lives under `app/(app)/_components/`; its page module
only orders those cohesive sections.

## Client boundaries

- `AppSidebar` is a Client Component because it reads the current pathname.
- `AppProviders` is a Client Component because TanStack Query, nuqs, and Radix
  Tooltip own client state.
- Radix interaction primitives are Client Components.
- Static HTML primitives such as Card, Input, Label, and Table remain compatible
  with Server Components.
- Interactive Overview demonstrations live in `PatternsSection` under
  `app/(app)/_components/`, which owns the client boundary for overlays, menus,
  URL state, toasts, validated forms, and tables.

## Visual system

`app/globals.css` is the source of truth for theme tokens. Components consume
semantic utilities such as `bg-card`, `text-foreground`, and `border-border`.
Application and documentation code should not duplicate literal token values.

The interface uses one dark theme, soft warm foreground text, neutral surfaces,
one blue action color, and semantic success, warning, and destructive colors.
Spacing and typography establish hierarchy before additional surfaces or
decoration.

## Interaction rules

- Use semantic HTML and visible focus states.
- Use shadcn/Radix Dialog or Alert Dialog for blocking modal workflows.
- Never use native browser dialogs or popup windows for application workflows.
- Use inline validation and status feedback for non-blocking outcomes.
- Controls that look actionable must have implemented behavior.

## Responsive behavior

Pages use mobile-first natural reflow. The application shell currently reserves
a fixed compact sidebar on every viewport. A different mobile navigation model
should be designed before route density exceeds the available narrow-screen
space.

## Error and loading behavior

`(app)/loading.tsx` owns the content-shaped skeleton while a segment loads.
`(app)/error.tsx` owns recoverable errors inside the shell. Root `error.tsx`
and `global-error.tsx` cover failures outside or above the shell. Feature
routes should add local loading or error boundaries only when they can provide
more specific recovery behavior.

## Template example

Projects demonstrates URL-backed search, status filtering, and pagination with
TanStack Table sorting. Its local client components own seeded in-memory rows
and a React Hook Form/Zod create/edit dialog. No UI primitives or remote API
are introduced for this example. The demo reset behavior stays visible. The
Overview remains the component reference; product features use their own routes.
