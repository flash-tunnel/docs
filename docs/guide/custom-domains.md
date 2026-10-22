---
description: Set up a Cloudflare API token and share a preview on your own domain.
---
# Custom domains

Named mode creates a Cloudflare Tunnel and a DNS record for a hostname on your domain. It removes both on normal exit unless you pass `--keep`.

## Prepare a domain and token

Your domain must be an active zone in your Cloudflare account. Create a **Custom token** in the [Cloudflare dashboard](https://dash.cloudflare.com/profile/api-tokens) with these permissions, scoped to the account and zone you use:

| Permission | Used for |
| --- | --- |
| Account · Cloudflare Tunnel · Edit | Create/delete tunnels, configure ingress, clean connections |
| Zone · DNS · Edit | Create/delete CNAME records and check conflicts |
| Zone · Zone · Read | Discover the zone |
| Account · Account Settings · Read | Discover the account |

The dashboard may use **Write** instead of **Edit**. See the project's [README](https://github.com/flash-tunnel/flash-tunnel#cloudflare-token-permissions) for the permission list maintained with the code.

## Set your token

::: code-group
```sh [macOS / Linux]
export CLOUDFLARE_API_TOKEN='your_token_here'
```
```powershell [PowerShell]
$env:CLOUDFLARE_API_TOKEN = 'your_token_here'
```
:::

The token is read **only from the environment**. Keep it out of your config file and Git history.

## Start a preview

```sh
npx flash-tunnel --zone example.com
```

By default, the subdomain uses `{project}-{rand}`. For example, a project named `my-app` could get `my-app-a1b2.example.com`. The random suffix helps avoid collisions and stale DNS caches.

Choose a fixed label or full hostname:

```sh
npx flash-tunnel --zone example.com --subdomain demo
npx flash-tunnel --hostname demo.example.com
```

If account discovery is ambiguous, set `CLOUDFLARE_ACCOUNT_ID`. You can also set `CLOUDFLARE_ZONE_ID` explicitly. See [environment variables](../reference/environment).

## Subdomain templates

| Placeholder | Value |
| --- | --- |
| `{project}` | Slug derived from the project directory |
| `{branch}` | Git branch, normalized for DNS |
| `{rand}` | Random suffix |
| `{rand:6}` | Random suffix with the requested length |
| `{session}` | Session identifier |
| `{ts}` | Timestamp |

```sh
npx flash-tunnel --zone example.com --subdomain '{project}-{branch}-{rand:6}'
```

::: warning Multi-level names
A hostname such as `demo.team.example.com` needs `--allow-multilevel` and suitable Cloudflare certificate coverage, such as Advanced Certificate. Prefer a single label unless you have configured that coverage.
:::

## DNS conflicts

flash-tunnel checks ownership before replacing records. If you get `RECORD_CONFLICT`, choose another subdomain or inspect the existing record first. `--overwrite` replaces records created outside flash-tunnel; use it only when you intend to replace that record.

For repeatable settings, save the domain in [`flash-tunnel.ts`](./configuration). For resource retention and manual cleanup, see [cleanup and recovery](./cleanup).
