---
description: Consume NDJSON events, readiness files, and hooks in scripts or CI.
---
# CI and automation

Use `--json`, `--ready-file`, `--on-ready`, and `--auto-stop` to coordinate previews with scripts and CI jobs.

## Machine-readable output

```sh
npx flash-tunnel --mode quick --json --auto-stop 20m
```

`--json` writes **NDJSON** to stdout: one JSON object per line. Read the stream line by line instead of parsing all output as one JSON document. Human logs and hook output go to stderr.

The `ready` event contains the public URL and session details. Example (identifiers and URL are illustrative):

```json
{"type":"ready","url":"https://your-preview.trycloudflare.com","localUrl":"http://127.0.0.1:5173","tunnelId":"example-tunnel","sessionId":"ft_example"}
```

Named mode can also include `hostname`; `expiresAt` is present when an expiry is available. Consumers should tolerate additional fields.

## A readiness file

::: code-group
```sh [macOS / Linux]
READY_FILE="$(mktemp -d)/ready.json"
npx flash-tunnel --mode quick --json --ready-file "$READY_FILE" --auto-stop 20m
```
```powershell [PowerShell]
$readyFile = Join-Path $env:TEMP ('flash-tunnel-' + [guid]::NewGuid() + '.json')
npx flash-tunnel --mode quick --json --ready-file $readyFile --auto-stop 20m
```
:::

The process keeps running while the preview is available. From another process, poll for the file and read its `url` property. Use a fresh path for each run to avoid reading a previous session. Relative paths resolve from the CLI's working directory; parent directories are created automatically.

## Run a command when ready

```sh
npx flash-tunnel --mode quick --on-ready 'node scripts/check-preview.mjs' --auto-stop 20m
```

The hook inherits these variables:

| Variable | Value |
| --- | --- |
| `FLASH_TUNNEL_URL` | Public preview URL |
| `FLASH_TUNNEL_LOCAL_URL` | Local server URL |
| `FLASH_TUNNEL_SESSION_ID` | Session identifier |
| `FLASH_TUNNEL_TUNNEL_ID` | Tunnel identifier |
| `FLASH_TUNNEL_HOSTNAME` | Public hostname, when available |
| `FLASH_TUNNEL_EXPIRES_AT` | Expiry, when available |

The hook runs asynchronously. **Its completion does not stop the tunnel, and its exit status is not the CLI's test result.** For a CI check, run tests as a separate foreground step and explicitly stop the preview afterward.

## A bounded CI shell script

This Bash example assumes the project dependencies and `cloudflared` are installed, and the `flash-tunnel` executable is available (for example, after `npm install -g flash-tunnel`). Pin your CLI version for reproducible builds.

```bash
set -euo pipefail
preview_dir="$(mktemp -d)"
ready_file="$preview_dir/ready.json"
flash-tunnel --mode quick --json --ready-file "$ready_file" --auto-stop 20m &
preview_pid=$!
cleanup() {
  kill -TERM "$preview_pid" 2>/dev/null || true
  wait "$preview_pid" || true
}
trap cleanup EXIT

for ((attempt = 0; attempt < 120; attempt++)); do
  test -f "$ready_file" && break
  kill -0 "$preview_pid" 2>/dev/null || { echo 'Preview exited before ready'; exit 1; }
  sleep 1
done
test -f "$ready_file" || { echo 'Preview timed out'; exit 1; }
export PREVIEW_URL
PREVIEW_URL="$(node -e 'console.log(JSON.parse(require("node:fs").readFileSync(process.argv[1], "utf8")).url)' "$ready_file")"
curl --fail --retry 3 "$PREVIEW_URL"
# Run your browser / integration tests here using PREVIEW_URL.
```

`--auto-stop` is a time limit in addition to the shell's cleanup trap. In named mode, inject the Cloudflare token from your CI secret store and keep it available until cleanup completes.
