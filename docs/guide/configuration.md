---
description: Create flash-tunnel.ts and understand configuration precedence and relative paths.
---
# Configure a project

The config file is optional. Use CLI flags for a one-off preview, or save repeated settings in `flash-tunnel.ts`.

## Generate a config

```sh
pnpm add -D flash-tunnel
pnpm exec flash-tunnel init
```

`init` creates `flash-tunnel.ts` in the current directory. It refuses to replace an existing file unless you pass `--force`.

## A typical configuration

```ts
import { defineConfig } from 'flash-tunnel'

export default defineConfig({
  domain: {
    zone: 'example.com',
    subdomain: '{project}-{rand}'
  },
  server: {
    command: 'pnpm dev',
    port: 5173,
    timeout: 90_000
  },
  tunnel: { mode: 'named' },
  autoStopAfter: '2h'
})
```

`server.timeout` is in **milliseconds**. `autoStopAfter` accepts a duration string such as `'30m'` or `'2h'`, or a number in milliseconds. Keep `CLOUDFLARE_API_TOKEN` in your environment.

## A token-free default

```ts
import { defineConfig } from 'flash-tunnel'

export default defineConfig({
  tunnel: { mode: 'quick' }
})
```

Now `pnpm exec flash-tunnel` uses quick mode without repeating the flag.

## Discovery and relative paths

flash-tunnel looks for `flash-tunnel.ts` in the project directory and walks upward to the Git root. Use `--config` to select a file explicitly:

```sh
npx flash-tunnel --config ./config/flash-tunnel.ts --mode quick
```

Relative paths in configuration are resolved from the **config file's directory**. If the file lives in `config/`, use `server.cwd: '..'` to run a script from the project root.

## Precedence

**CLI flags → environment variables → config file → auto-detection / defaults.**

Only settings with an environment-variable mapping participate in that layer. For example, `--port 4000` overrides `FLASH_TUNNEL_PORT`, which overrides `server.port`.

Inspect the effective configuration and its sources without creating cloud resources:

```sh
npx flash-tunnel --mode quick --dry-run
```

The full set of fields is in the [configuration reference](../reference/config). Hostnames are supplied through `--hostname` or `FLASH_TUNNEL_HOSTNAME`; `domain.hostname` is not a supported typed config field.
