---
description: What flash-tunnel does, how previews work, and when to use quick or named tunnels.
---
# Meet flash-tunnel

**One command turns a local server into a shareable public preview.** flash-tunnel detects your project, starts its server, connects it through Cloudflare Tunnel, and cleans up after you exit.

Use it to review a work in progress with a teammate, open a local app on a phone, or give a client a link to a demo without deploying a build first.

::: info Early preview
flash-tunnel is currently in the `0.x` stage. APIs and behavior may change. These docs describe the implementation in the [project repository](https://github.com/flash-tunnel/flash-tunnel). See the [planned 0.2.0 changes](../releases/0.2.0) for improvements since 0.1.0.
:::

## Two ways to share

| | Quick mode | Named mode |
| --- | --- | --- |
| Public address | Random `*.trycloudflare.com` URL | A hostname on your Cloudflare domain |
| Cloudflare account / token | Not required | Required |
| DNS management | No DNS record in your account | Creates and removes a CNAME record |
| Best for | Temporary demos, collaboration | Recognizable preview URLs |
| Start | `npx flash-tunnel --mode quick` | `npx flash-tunnel --zone example.com` |

The default mode is **named**. Pass `--mode quick` explicitly when you want a token-free temporary URL. Quick URLs change between sessions.

## What happens when you run it?

1. Detect the framework, package manager, startup script, and port.
2. Start the local server, serve a static directory, or attach to an existing URL.
3. Start a Cloudflare Tunnel; named mode also creates the tunnel and DNS record through the API.
4. Wait for the public URL to respond, then print the link.
5. On exit, stop the processes and remove session-owned cloud resources.

A detached watchdog and startup sweep help recover sessions after an interrupted exit. See [cleanup and recovery](./cleanup) for their limits and retry commands.

## What you need

- Node.js **22.14 or newer**.
- The `cloudflared` executable, available on your `PATH` or configured explicitly.
- A local project, a built static directory, or an already running HTTP server.
- For named mode: a Cloudflare account, an active domain, and an API token.

## Start here

[Create your first preview](./quick-start), [connect your own domain](./custom-domains), or look up a flag in the [CLI reference](../reference/cli).
