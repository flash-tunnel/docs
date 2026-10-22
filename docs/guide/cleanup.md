---
description: Understand normal cleanup, interrupted sessions, retention, and manual recovery commands.
---
# Cleanup and recovery

A preview is tied to its terminal session. On a normal exit, flash-tunnel removes the resources it created so temporary previews do not become abandoned infrastructure.

## Normal shutdown

Press **Ctrl+C** once, or **q** in an interactive terminal. Cleanup runs in this order:

1. Stop `cloudflared`.
2. Allow connections to drain.
3. Delete the session's DNS record.
4. Delete the tunnel.
5. Stop the local server process started by flash-tunnel.
6. Remove session state and release the project lock.

Quick mode has no account-owned DNS record to delete. A server attached through `--url` is not stopped.

## Interrupted sessions

| Situation | Behavior |
| --- | --- |
| `Ctrl+C` | Clean up, then exit with `130` |
| `SIGTERM` / `SIGHUP` | Clean up, then exit with `143` |
| Second `Ctrl+C` during shutdown | Exit immediately; retain state for recovery |
| Main process killed or terminal closed | A detached watchdog attempts recovery |
| Next startup | Sweep stale sessions, unless `--no-sweep` is set |
| Cleanup failure | Exit with `8` and retain state so cleanup can be retried |

The watchdog is a best-effort fallback. Cloud cleanup still needs network access and valid credentials. Check stale sessions after a shutdown that could not finish.

## Manual cleanup

```sh
# List leftover sessions
npx flash-tunnel clean

# Preview cleanup without changing resources
npx flash-tunnel clean --stale --dry-run

# Clean stale sessions, optionally scoped to a project
npx flash-tunnel clean --stale
npx flash-tunnel clean --project ./apps/web --stale

# Clean a specific session using its printed identifier
npx flash-tunnel clean --session ft_xxxx
```

`clean --all --yes` removes all recorded sessions. `--force` allows cleanup of a running session. Use a specific session or project when you only intend to stop one preview.

## Keeping cloud resources

```sh
npx flash-tunnel --zone example.com --keep
```

`--keep` retains the DNS record and tunnel when the process exits, and prints a cleanup command. **It does not keep your local server or `cloudflared` running.** A retained DNS record alone does not make the preview stay online.

## State and logs

Runtime data lives outside your checkout:

- Project data and logs: `~/.flash-tunnel/projects/<project-key>/`.
- Session index: `~/.flash-tunnel/sessions/`.

Inactive project data is pruned after **7 days** by default. `FLASH_TUNNEL_RETENTION_DAYS=0` disables pruning. State files are used to recover cloud resources; avoid deleting them before resolving incomplete cleanup.

The token is read from the environment and is not stored in config, state, or command arguments. DNS records and tunnels are deleted by recorded ID with ownership checks.
