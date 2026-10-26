# Onyx Cloud template integration

Admin Starter is a starting point for admin panels and internal tools. Choose it
when a prompt implies managing records, reviewing operational data, or configuring
an application. Choose a blank app or another template for content-first sites,
storefronts, or a different requested stack.

`template.json` is this repository's selection metadata, not an official Onyx API
or executable command schema. Onyx can index its description, tags, use cases,
capabilities, exclusions, and example prompt without cloning or installing the
repository. Keep this metadata cached alongside a pinned Git commit for fast,
repeatable selection. The preview image shows the actual Projects example.

## Instantiate

1. Copy the source at a tested commit, excluding `.git`, `node_modules`, `.next`,
   `.next-build`, `.open-next`, `.wrangler`, reports, caches, and local `.env` files.
   Preserve `.env.example`, agent instructions, and the lockfile.
2. Use Node.js 22.18+ and run `npm ci`. No credentials are required.
3. Run `npm run template:init -- --name "Inventory Admin" --slug inventory-admin`.
   This updates `project.json` and package/lockfile names. Header, titles, home
   label, and health identity derive from `project.json`. The template catalog
   identity in `template.json` stays `admin-starter`.
4. Assign a free port and run `npm run dev -- --port 3217`. Wait for HTTP 200 from
   `http://127.0.0.1:3217/api/health` and verify `application` equals the chosen
   slug. The process binds to loopback. Onyx owns preview proxying; this repo
   supplies no hosting adapter.
5. Pass the user prompt plus `AGENTS.md` to the implementation agent. Route work
   through the relevant recipes and constitutions. Reuse the shell and primitives;
   adapt the Projects collection to the requested domain. Keep `/` as the living
   component reference. Add product routes without deleting that reference.
6. Run focused validation during edits; run `npm run check:all` before delivery.
   Production preview is `npm run build` then `npm run start -- --port 3217`.

Commands above are examples. Pass user-provided names and slugs as separate process
arguments, never interpolate prompts or metadata into a shell command. The naming
command validates input and does not install dependencies or edit source code.
Naming must run before the build; restart a dev server after changing identity.

## Fast execution

- Cache npm downloads by lockfile hash and Node version. Do not ship `node_modules`
  in the repository or share mutable installed directories between user projects.
- Select from metadata first; instantiate only the chosen template.
- Start development once dependencies are installed; do not run production builds
  on every edit. Run focused lint/type/unit checks during implementation.
- Pin a tested template commit and keep per-project source and ports isolated.
- Run `npm run template:smoke` when releasing a new template version. It copies
  clean source, installs from the lockfile, initializes a different identity,
  builds, starts on a free port, and checks routes and identity without secrets.

## Demo boundaries

Projects uses in-memory browser state. Search, status, and page are URL-backed;
created and edited records reset when leaving the page or reloading. Connect a
validated server API and persistence when the prompt needs durable data. There is
no authentication or authorization; those must be implemented before exposing
private business data. Settings is an empty shell to adapt to the user's domain.

## Publication

The intended public repository is `OnyxDevTools/admin-starter`. Mark it as a GitHub
template repository so manual users can also choose **Use this template**. Keep its
repository description consistent with `template.json`. Public visibility alone
does not grant a reuse license; the owner should choose a license before a broad
external launch. Publishing the template does not register it with an Onyx selector;
Onyx must consume the metadata and instantiate the pinned source separately.
