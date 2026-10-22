---
description: How server detection works and how to attach, serve static files, or override a command.
---
# Local servers

flash-tunnel can start a project script, serve a static directory, or connect to a server that is already running.

## Automatic detection

Detection reads `package.json`, package-manager lockfiles, and build output. A declared `packageManager` takes priority over lockfiles; otherwise it checks pnpm, Yarn, Bun, then npm, with npm as the fallback.

The startup preference is:

1. An explicit `server.command`, `server.url`, or `server.dir`.
2. A `preview` script when build output exists.
3. A `dev` script.
4. A `start` script.
5. A static `dist`, `build`, or `out` directory containing `index.html`.

If only a `preview` script exists and no build output is found, build the project first. `--dev` skips preview selection; `--build` runs the project's build script before starting.

### Recognized frameworks

| Framework | Dev port | Preview / start port |
| --- | --- | --- |
| Next.js / Nuxt | 3000 | 3000 |
| Astro | 4321 | 4321 |
| Vite / SvelteKit | 5173 | 4173 |
| Vue CLI | 8080 | 8080 |
| Create React App | 3000 | 3000 |
| Angular | 4200 | 4200 |
| Storybook | 6006 | 6006 |
| Umi | 8000 | 8000 |

Explicit port settings and ports parsed from scripts take priority over framework defaults. Unknown projects with a `dev` or `start` script can also work; specify the command and port when needed.

## Choose a command

```sh
npx flash-tunnel --mode quick --command 'pnpm dev' --port 5173
npx flash-tunnel --mode quick --dev
npx flash-tunnel --mode quick --build
```

In a monorepo, point `--cwd` at the app:

```sh
npx flash-tunnel --mode quick --cwd apps/web
```

## Attach to an existing server

```sh
npx flash-tunnel --mode quick --url http://127.0.0.1:3000 --attach
```

`--attach` requires `--url` and cannot be combined with `server.command`. An attached server is not stopped on exit. `--reuse` is a separate option for reusing a server already listening on the selected port.

## Share static output

```sh
pnpm build
npx flash-tunnel --mode quick --static dist
```

Pass `--static` without a directory to detect `dist`, `build`, or `out`. Static mode expects an `index.html` file. Do not combine `server.dir` / `--static` with `server.command` or `server.url`.

## Hostname checks

For supported Vite versions, flash-tunnel injects `__VITE_ADDITIONAL_SERVER_ALLOWED_HOSTS` into the server it starts. Named mode allows the exact hostname; quick mode allows `.trycloudflare.com`. An existing value is preserved.

For a server you started yourself, configure the allowed hostname before launching it. Prefer a specific hostname or the required domain suffix over disabling host validation entirely. See [troubleshooting](./troubleshooting).
