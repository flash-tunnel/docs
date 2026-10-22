---
description: Supported flash-tunnel.ts fields, defaults, and units, checked against the config types and resolver.
---
# Configuration reference

Import `defineConfig` from `flash-tunnel` for editor completion. See [configuration basics](../guide/configuration) for discovery, paths, and precedence.

## Domain

| Field | Type | Default / behavior |
| --- | --- | --- |
| `domain.provider` | `string` | `'cloudflare'` |
| `domain.zone` | `string` | Inferred when possible; otherwise supply a zone |
| `domain.subdomain` | `string` | `'{project}-{rand}'` |

Supply a full hostname through `--hostname` or `FLASH_TUNNEL_HOSTNAME`. `domain.hostname` is not part of the config interface. Subdomain placeholders are documented in [custom domains](../guide/custom-domains#subdomain-templates).

## Server

| Field | Type | Default / behavior |
| --- | --- | --- |
| `server.command` | `string` | Auto-detected startup script |
| `server.cwd` | `string` | Config directory when a file is loaded; otherwise the project directory |
| `server.port` | `number` | Detected from script / framework / server mode |
| `server.url` | `string` | Existing server to attach to |
| `server.dir` | `string` | Static directory to serve |
| `server.timeout` | `number` | `60000` milliseconds; positive integer |

`command`, `url`, and `dir` describe different server modes; choose one. Relative paths resolve from the config directory. `--attach` requires a URL and cannot be combined with a command.

## Tunnel

| Field | Type | Default |
| --- | --- | --- |
| `tunnel.provider` | `string` | `'cloudflare'` |
| `tunnel.mode` | `'named' \| 'quick'` | `'named'` |
| `tunnel.name` | `string` | `'flash-tunnel-{project}-{rand}'` |

Quick mode obtains a random `trycloudflare.com` URL and ignores a generated named-mode hostname. Built-in provider support can be inspected with `flash-tunnel providers`; setting a provider string alone does not install a new adapter.

## Cloudflare provider

| Field | Type | Default / behavior |
| --- | --- | --- |
| `providers.cloudflare.accountId` | `string` | Discovered from the token when unambiguous |
| `providers.cloudflare.zoneId` | `string` | Resolved from the zone name |
| `providers.cloudflare.cloudflaredPath` | `string` | `'cloudflared'` |
| `providers.cloudflare.originRequest.httpHostHeader` | `string` | Optional origin Host-header override |
| `providers.cloudflare.originRequest.noTLSVerify` | `boolean` | Optional origin TLS-verification override |

`noTLSVerify: true` disables verification of the origin certificate. Use it only when you deliberately need that behavior for a local HTTPS server.

There is no API-token field. Credentials come from `CLOUDFLARE_API_TOKEN` only.

## Automatic shutdown

| Field | Type | Default / behavior |
| --- | --- | --- |
| `autoStopAfter` | `string \| number` | No automatic time limit unless configured |

Use `'90s'`, `'30m'`, `'2h'`, or a number in milliseconds. At expiry, flash-tunnel stops the session and cleans up.

## Example with an existing server

```ts
import { defineConfig } from 'flash-tunnel'

export default defineConfig({
  server: { url: 'http://127.0.0.1:3000' },
  tunnel: { mode: 'quick' },
  autoStopAfter: '30m'
})
```

Definitions are maintained in the source [config types](https://github.com/flash-tunnel/flash-tunnel/blob/main/packages/config/src/types.ts) and [config resolver](https://github.com/flash-tunnel/flash-tunnel/blob/main/packages/core/src/config/resolve.ts).
