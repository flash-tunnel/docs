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

The planned 0.2.0 release reports `NO_RUNNABLE_SCRIPT` for a directory with no runnable server. If runnable apps are found under `apps/*` or `packages/*`, a non-interactive run reports `WORKSPACE_REQUIRED` with their paths. Choose one with `--cwd`; detection does not select an arbitrary app in CI.

If a child app unexpectedly uses npm, check for a nearer lockfile or workspace boundary. The [package-manager inheritance rules](./local-servers#automatic-detection) use the nearest declaration and stop at the Git or workspace root.

## Port or hostname problems

- `PORT_IN_USE` means a fixed port or the static server's port is occupied. Configure both the server and flash-tunnel to use another port, or intentionally reuse the service with `--reuse` / `--url <url> --attach`.
- With the planned 0.2.0 behavior, an occupied framework or generic default is only an estimate: the command can start and report a different local URL. If it prints no URL, provide the actual port explicitly. See [port selection and conflicts](./local-servers#port-selection-and-conflicts).
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
