---
description: Install cloudflared and share your first local project without an API token.
---
# Quick start

Create a temporary public preview without a Cloudflare account or API token.

## 1. Check prerequisites

Install Node.js **22.14+** and [cloudflared](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/downloads/). Then verify both are available:

```sh
node --version
cloudflared --version
```

If `cloudflared` is installed outside your `PATH`, set [`FLASH_TUNNEL_CLOUDFLARED`](../reference/environment) to its executable path.

## 2. Run inside your project

Open a terminal in a project with a `dev` script and run:

```sh
npx flash-tunnel --mode quick
```

flash-tunnel detects the startup command and local port, starts the server, and waits until a public `https://…trycloudflare.com` URL responds. Copy that URL and share it. Keep the terminal running for as long as you need the preview.

::: tip Already running your server?
Connect to it directly:

```sh
npx flash-tunnel --mode quick --url http://127.0.0.1:5173 --attach
```

An attached server remains yours to stop. flash-tunnel only stops child processes it started.
:::

## 3. Stop the preview

Press **Ctrl+C** once and allow cleanup to finish. In an interactive terminal, **c** copies the URL, **o** opens it, and **q** stops the preview with cleanup.

The public URL is temporary. A later quick-mode run receives a new address.

## Install for repeated use

::: code-group
```sh [Project dependency]
pnpm add -D flash-tunnel
pnpm exec flash-tunnel --mode quick
```
```sh [Global install]
npm install -g flash-tunnel
flash-tunnel --mode quick
```
:::

A project dependency lets you pin the version with your project's lockfile.

## Optional setup

```sh
npx flash-tunnel doctor
npx flash-tunnel init
```

`doctor` checks the environment and effective configuration. It may report missing credentials when the effective mode is named; quick previews do not need those credentials. `init` creates an optional `flash-tunnel.ts` file.

## Where next?

- [Custom domains](./custom-domains): use your Cloudflare domain.
- [Local servers](./local-servers): choose scripts, static files, or an existing server.
- [Troubleshooting](./troubleshooting): resolve host checks, ports, or startup failures.
