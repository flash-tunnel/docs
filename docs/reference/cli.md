---
description: Commands and flags for starting previews, checking the environment, and cleaning sessions.
---
# CLI reference

Examples use `npx flash-tunnel`. With a project dependency use `pnpm exec flash-tunnel`; with a global installation use `flash-tunnel` directly.

## Commands

| Command | Purpose |
| --- | --- |
| `flash-tunnel [root]` | Start a preview; optional positional project directory |
| `flash-tunnel start` | Explicit start command |
| `flash-tunnel doctor` | Check Node, config, credentials, zone, cloudflared, ports, and sessions |
| `flash-tunnel init` | Create `flash-tunnel.ts` |
| `flash-tunnel clean` | List or clean recorded sessions |
| `flash-tunnel providers` | List available adapters and capabilities |

Use `--help` for command usage and `--version` for the installed version.

## Start: local server

| Flag | Meaning |
| --- | --- |
| `--cwd <dir>` | Project directory |
| `--config <path>` | Explicit config file |
| `--port <port>` | Explicit expected local port; does not add arguments to the server command |
| `--command <command>` | Command to start the server |
| `--url <url>` | Existing server URL |
| `--attach` | Only attach; requires `--url` |
| `--static [dir]` | Serve a directory; detect build output if omitted |
| `--dev` | Force the dev script instead of preview |
| `--build` | Run the build script first |
| `--reuse` | Reuse a server already listening on the port |

Starting with 0.2.0, command servers distinguish fixed ports from framework/default estimates. A busy estimate can be replaced by the URL printed by the server; existing listeners are only reused with an explicit choice. See [port selection and conflicts](../guide/local-servers#port-selection-and-conflicts).

## Start: tunnel and domain

| Flag | Meaning |
| --- | --- |
| `--mode <mode>` | `named` (default) or `quick` |
| `--zone <domain>` | Cloudflare zone, e.g. `example.com` |
| `--hostname <fqdn>` | Full public hostname; takes precedence over zone/subdomain generation |
| `--subdomain <label>` | Literal label or [template](../guide/custom-domains#subdomain-templates) |
| `--allow-multilevel` | Allow multi-level subdomains; requires appropriate certificate coverage |
| `--overwrite` | Replace DNS records not created by this tool |
| `--auto-stop <duration>` | Stop and clean up after a duration, e.g. `30m`, `2h` |
| `--keep` | Retain cloud DNS/tunnel resources on exit |
| `--no-sweep` | Skip startup scanning of stale sessions |

## Start: output and automation

| Flag | Meaning |
| --- | --- |
| `--dry-run` | Print effective config and sources without creating resources |
| `--json` | Emit NDJSON to stdout |
| `--ready-file <path>` | Write the ready payload to a JSON file |
| `--on-ready <command>` | Run a command once ready |
| `--open` | Open a browser when ready in an interactive terminal |
| `--no-open` | Do not open a browser (default) |
| `--verbose` | Stream server and cloudflared logs |
| `--silent` | Only print errors |
| `--no-color` | Disable terminal colors |
| `--no-spinner` | Disable the spinner |
| `-y, --yes` | Disable prompts and use defaults |

`--open` is suppressed in JSON mode, CI, non-TTY output, or when `FLASH_TUNNEL_NO_OPEN=1`.

## Clean

With no selector, `clean` lists sessions. Use selectors to remove resources:

| Flag | Meaning |
| --- | --- |
| `--session <id>` | Select one session |
| `--project <dir>` | Select sessions for a project |
| `--stale` | Select sessions whose owning process has gone |
| `--all` | Select every recorded session; requires `--yes` |
| `--dry-run` | Show planned removals |
| `--yes` | Confirm broad cleanup |
| `--force` | Allow cleanup of a running session |
| `--json` / `--silent` | Machine-readable / errors-only output |

## Doctor, init, and providers

- `doctor`: `--cwd <dir>`, `--config <path>`, `--json`, `--silent`.
- `init`: `--cwd <dir>`, `--force` (overwrite config), `--json`, `--silent`.
- `providers`: `--json`, `--silent`.

See [configuration](./config), [environment variables](./environment), and [exit codes](../guide/troubleshooting#exit-codes).
