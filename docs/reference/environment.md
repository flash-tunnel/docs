---
description: Environment variables for credentials, preview settings, output, and lifecycle hooks.
---
# Environment variables

For supported settings, environment variables override the config file and are overridden by CLI flags.

## Credentials and account

| Variable | Purpose |
| --- | --- |
| `CLOUDFLARE_API_TOKEN` | The only API credential source; required for named mode |
| `CLOUDFLARE_ACCOUNT_ID` | Select the Cloudflare account explicitly |
| `CLOUDFLARE_ZONE_ID` | Select the Cloudflare zone explicitly |

Tokens are not written to config, state, or command arguments. Use a CI secret store when running unattended. See [token permissions](../guide/custom-domains).

## Preview configuration

| Variable | Mapping / meaning |
| --- | --- |
| `FLASH_TUNNEL_ZONE` | `domain.zone` |
| `FLASH_TUNNEL_HOSTNAME` | Full public hostname; overrides zone/subdomain generation |
| `FLASH_TUNNEL_MODE` | `tunnel.mode`: `named` or `quick` |
| `FLASH_TUNNEL_PORT` | `server.port` |
| `FLASH_TUNNEL_COMMAND` | `server.command` |
| `FLASH_TUNNEL_CLOUDFLARED` | `providers.cloudflare.cloudflaredPath` |
| `FLASH_TUNNEL_AUTO_STOP` | `autoStopAfter`, e.g. `30m` |
| `FLASH_TUNNEL_TUNNEL_PROVIDER` | `tunnel.provider` |
| `FLASH_TUNNEL_DNS_PROVIDER` | `domain.provider` |

## Output and state

| Variable | Meaning |
| --- | --- |
| `FLASH_TUNNEL_NO_OPEN=1` | Suppress browser opening, even with `--open` |
| `FLASH_TUNNEL_RETENTION_DAYS` | Inactive project-state retention; default `7`, `0` disables pruning |
| `NO_COLOR` / `FORCE_COLOR` | Control terminal coloring |
| `CI` | Enable non-interactive fallbacks; disable shortcuts / automatic browser opening |

## Variables passed to child processes

The local server is started with `FLASH_TUNNEL=1`. Supported Vite servers also receive `__VITE_ADDITIONAL_SERVER_ALLOWED_HOSTS` if it is not already set.

`--on-ready` receives `FLASH_TUNNEL_URL`, `FLASH_TUNNEL_LOCAL_URL`, `FLASH_TUNNEL_SESSION_ID`, `FLASH_TUNNEL_TUNNEL_ID`, and optional `FLASH_TUNNEL_HOSTNAME` / `FLASH_TUNNEL_EXPIRES_AT`. These are hook outputs rather than general input settings. See [automation](../guide/automation).
