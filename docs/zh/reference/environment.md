---
description: 凭据、预览设置、输出与生命周期回调所使用的环境变量。
---
# 环境变量

对于支持的字段，环境变量覆盖配置文件，命令行参数又会覆盖环境变量。

## 凭据与账号

| 变量 | 用途 |
| --- | --- |
| `CLOUDFLARE_API_TOKEN` | 唯一 API 凭据来源，named 模式必需 |
| `CLOUDFLARE_ACCOUNT_ID` | 显式指定 Cloudflare 账号 |
| `CLOUDFLARE_ZONE_ID` | 显式指定 Cloudflare Zone |

Token 不写入配置、状态或命令参数。无人值守运行时请使用 CI 密钥存储，权限配置见[自定义域名](../guide/custom-domains)。

## 预览配置

| 变量 | 映射 / 含义 |
| --- | --- |
| `FLASH_TUNNEL_ZONE` | `domain.zone` |
| `FLASH_TUNNEL_HOSTNAME` | 完整公网主机名，优先于 zone/subdomain 拼接 |
| `FLASH_TUNNEL_MODE` | `tunnel.mode`：`named` 或 `quick` |
| `FLASH_TUNNEL_PORT` | `server.port` |
| `FLASH_TUNNEL_COMMAND` | `server.command` |
| `FLASH_TUNNEL_CLOUDFLARED` | `providers.cloudflare.cloudflaredPath` |
| `FLASH_TUNNEL_AUTO_STOP` | `autoStopAfter`，例如 `30m` |
| `FLASH_TUNNEL_TUNNEL_PROVIDER` | `tunnel.provider` |
| `FLASH_TUNNEL_DNS_PROVIDER` | `domain.provider` |

## 输出与状态

| 变量 | 含义 |
| --- | --- |
| `FLASH_TUNNEL_NO_OPEN=1` | 即使设置 `--open` 也不打开浏览器 |
| `FLASH_TUNNEL_RETENTION_DAYS` | 不活跃项目状态的保留天数，默认 `7`，`0` 关闭过期清理 |
| `NO_COLOR` / `FORCE_COLOR` | 控制终端颜色 |
| `CI` | 使用非交互式回退行为，关闭快捷键和自动打开浏览器 |

## 传给子进程的变量

本地服务启动时会收到 `FLASH_TUNNEL=1`。对于支持的 Vite 服务，如果没有已有值，还会收到 `__VITE_ADDITIONAL_SERVER_ALLOWED_HOSTS`。

`--on-ready` 会收到 `FLASH_TUNNEL_URL`、`FLASH_TUNNEL_LOCAL_URL`、`FLASH_TUNNEL_SESSION_ID`、`FLASH_TUNNEL_TUNNEL_ID`，以及可选的 `FLASH_TUNNEL_HOSTNAME` / `FLASH_TUNNEL_EXPIRES_AT`。这些属于回调输出，不是通用输入配置，详见[自动化](../guide/automation)。
