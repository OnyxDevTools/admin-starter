# Contributing

## Commits

Use [Conventional Commits](https://www.conventionalcommits.org/):

| Prefix      | Use for                                 |
| ----------- | --------------------------------------- |
| `feat:`     | New user-facing capability              |
| `fix:`      | Bug fix                                 |
| `docs:`     | Documentation, constitutions, recipes   |
| `chore:`    | Tooling, deps, CI, config               |
| `test:`     | Unit or e2e tests only                  |
| `refactor:` | Internal change with no behavior change |

Examples:

```text
feat: add project archive dialog
fix: dim SwitchField label when unchecked
docs: add validated-form recipe
chore: restore CI workflow
```

Keep each commit focused. Prefer a short subject line that states why the change exists.

## Environment

Use Node.js 22.18+ (see `.nvmrc`). CI reads the same file.

## Pull requests

Use the repository pull request template. Before opening a PR, run:

```bash
npm run check:all
npm run template:smoke
```

Pre-commit runs `lint-staged` (Prettier) via husky. Do not bypass hooks unless
explicitly required.

## Agent workflow

Follow `AGENTS.md`. Prefer recipes under `docs/recipes/` and constitutions under
`docs/constitutions/` over inventing patterns.
