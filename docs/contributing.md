---
description: Contribute to flash-tunnel or its bilingual VitePress documentation.
---
# Contributing

There are two repositories:

- [flash-tunnel/flash-tunnel](https://github.com/flash-tunnel/flash-tunnel): the CLI, core, config, and Cloudflare adapter.
- [flash-tunnel/docs](https://github.com/flash-tunnel/docs): this independent VitePress site.

## Work on the CLI

Use Node.js **22.14+** and the pnpm version declared in the repository's `packageManager` field.

```sh
git clone git@github.com:flash-tunnel/flash-tunnel.git
cd flash-tunnel
pnpm install
pnpm build
pnpm ft --version
pnpm lint
pnpm typecheck
pnpm test
```

The end-to-end suite is opt-in and uses real Cloudflare resources:

```sh
FLASH_TUNNEL_E2E=1 pnpm test:e2e
```

On PowerShell, set `$env:FLASH_TUNNEL_E2E = '1'` before running `pnpm test:e2e`. Read the repository's test setup and provide scoped credentials before enabling it.

## Work on these docs

```sh
git clone git@github.com:flash-tunnel/docs.git flash-tunnel-docs
cd flash-tunnel-docs
pnpm install
pnpm dev
```

English pages live under `docs/`; Chinese pages mirror the same paths under `docs/zh/`. Keep both versions, navigation, and examples aligned. Verify CLI behavior against source before describing a new option.

Before submitting:

```sh
pnpm typecheck
pnpm check
pnpm build
pnpm preview
```

The build checks Markdown links. The structure check verifies locale parity and required publishing files. Preview both languages and check mobile navigation, code blocks, and tables.

## Deployment

Pushes to `main` build and deploy to GitHub Pages. Pull requests run validation without deploying. See the [documentation README](https://github.com/flash-tunnel/docs#deployment) for repository settings and custom-domain DNS setup.

The navigation, theme tokens, and reading rhythm were adapted from imba97's MIT-licensed pmpx / Synra documentation. Both flash-tunnel and these docs use the MIT License.
