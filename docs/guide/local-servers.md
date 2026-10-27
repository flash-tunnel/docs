---
description: How server detection works and how to attach, serve static files, or override a command.
---
# Local servers

flash-tunnel can start a project script, serve a static directory, or connect to a server that is already running.

## Automatic detection

Detection reads `package.json`, package-manager lockfiles, and build output.

Package-manager discovery starts in the application's working directory and walks upward. In each directory it checks a supported `packageManager` declaration first, then pnpm, Yarn, Bun, and npm lockfiles. The nearest match wins: a child app's lockfile takes priority over a parent's declaration. If nothing matches, it falls back to npm.

The search includes the Git or workspace root and stops there. Boundaries are a `.git` file or directory, `pnpm-workspace.yaml`, or a `package.json` with `workspaces`; without one, discovery stops at the filesystem root. Build and start use the same discovery rules. This inheritance behavior is available starting with [0.2.0](../releases/0.2.0).

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

Unknown projects with a `dev` or `start` script can also work; specify the command and port when needed.

### Port selection and conflicts

The port preference is **explicit settings → script arguments → framework defaults → generic defaults**. Explicit settings include `--port`, `FLASH_TUNNEL_PORT`, and `server.port`; scripts and explicit commands can provide `--port`, `-p`, or `PORT=`.

The [0.2.0 changes](../releases/0.2.0) distinguish fixed ports from estimates:

- **Explicit or script ports:** a conflict is reported before the command starts. Use a different port, or intentionally reuse the existing service.
- **Framework or generic defaults:** an occupied estimate does not block the command from starting. flash-tunnel reads its output to find the actual local URL. A listener already occupying the estimated port is excluded, even if that same port is printed in the logs.
- **Static mode:** the built-in server binds the selected port, so conflicts still need to be resolved.

If an estimated port is occupied and your command prints no local URL, supply the actual port with `--port`. This option tells flash-tunnel where to expect the server; it does not append arguments to your startup command. Configure the server itself to listen on that port as well.

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

If the project root has no runnable script, flash-tunnel looks one level under `apps/*` and `packages/*`. An interactive terminal offers a selection; CI and other non-interactive runs report `WORKSPACE_REQUIRED` with candidate paths so you can pass `--cwd` explicitly.

## Attach to an existing server

```sh
npx flash-tunnel --mode quick --url http://127.0.0.1:3000 --attach
```

`--attach` requires `--url` and cannot be combined with `server.command`. An attached server is not stopped on exit. To reuse a service on the selected port, pass `--reuse` or confirm reuse in a fixed-port conflict prompt. An occupied guessed port alone does not authorize reuse.

## Share static output

```sh
pnpm build
npx flash-tunnel --mode quick --static dist
```

Pass `--static` without a directory to detect `dist`, `build`, or `out`. Static mode expects an `index.html` file. Do not combine `server.dir` / `--static` with `server.command` or `server.url`.

## Hostname checks

For supported Vite versions, flash-tunnel injects `__VITE_ADDITIONAL_SERVER_ALLOWED_HOSTS` into the server it starts. Named mode allows the exact hostname; quick mode allows `.trycloudflare.com`. An existing value is preserved.

For a server you started yourself, configure the allowed hostname before launching it. Prefer a specific hostname or the required domain suffix over disabling host validation entirely. See [troubleshooting](./troubleshooting).
