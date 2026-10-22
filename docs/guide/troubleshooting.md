---
description: Resolve cloudflared, Cloudflare permissions, DNS conflicts, local server, and cleanup failures.
---
# Troubleshooting

Start with an environment check and inspect your effective config:

```sh
npx flash-tunnel doctor
npx flash-tunnel --mode quick --dry-run
```

For startup details, add `--verbose` to the command that failed. When reporting an issue, include the CLI version, operating system, command, and error code. Remove credentials from pasted logs.

## cloudflared cannot start

Run `cloudflared --version`. If it cannot be found, [install it](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/downloads/) or set `FLASH_TUNNEL_CLOUDFLARED` to the executable's path. Installing the npm CLI does not install `cloudflared`.

## Authentication and domain errors

| Error | Check |
| --- | --- |
| `AUTH_INVALID` / `403` | Token validity, account/zone scope, and all four [permissions](./custom-domains) |
| `ACCOUNT_NOT_FOUND` | Set the intended `CLOUDFLARE_ACCOUNT_ID` |
| `ZONE_NOT_FOUND` / `ZONE_NOT_ACTIVE` | The domain passed to `--zone` is active in the token's account |
| `RECORD_CONFLICT` | Choose another subdomain, or inspect the existing DNS record before `--overwrite` |

Quick mode does not need a token. If you only need a temporary address, pass `--mode quick` explicitly.

## No runnable script found

Run in the application directory, or select it with `--cwd apps/web`. Set an explicit `--command 'pnpm dev' --port 5173`, or use `--static dist` after building. A `preview` script without build output requires a build first.

## Port or hostname problems

- For an occupied port, choose `--port <n>`, use `--reuse`, or attach with `--url`.
- If the public page says **Blocked request / host is not allowed**, check the dev server's allowed-host configuration. flash-tunnel injects Vite's extra-host environment variable only into servers it starts.
- If you attached an existing Vite server, restart it with the required hostname allowed. For quick mode, the necessary suffix is `.trycloudflare.com`.
- If public readiness times out, confirm the local URL responds and inspect `--verbose` output for `cloudflared` errors.

## The preview stops after exit

The tunnel needs both the local server and `cloudflared` to remain running. `--keep` retains cloud records, not those processes. Keep the terminal session open while sharing.

## Shortcuts or cleanup do not respond

Click the terminal before using **c**, **o**, **q**, or **Ctrl+C**. Shortcuts require an interactive TTY and are disabled in CI.

If cleanup exits with `8`, restore network access and credentials, then retry:

```sh
npx flash-tunnel clean --stale
```

For one retained session, use `clean --session <id>`. Keep the state files until recovery succeeds. See [cleanup and recovery](./cleanup).

## Exit codes

| Code | Meaning |
| --- | --- |
| `0` | Completed successfully |
| `1` | Unclassified or unexpected error |
| `2` | Configuration, confirmation, or project-lock error |
| `3` | Local server / build failure |
| `4` | Authentication, permission, or account failure |
| `5` | Tunnel failure |
| `6` | DNS / zone / record failure |
| `7` | Public URL verification failure |
| `8` | Incomplete cleanup; retry using saved session state |
| `130` | Interrupted with Ctrl+C after cleanup |
| `143` | Stopped by SIGTERM / SIGHUP after cleanup |

An incomplete cleanup can replace an earlier exit status with `8` so recovery is not missed.

Still stuck? [Open an issue](https://github.com/flash-tunnel/flash-tunnel/issues).
