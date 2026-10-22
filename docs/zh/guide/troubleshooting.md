---
description: 排查 cloudflared、Cloudflare 权限、DNS 冲突、本地服务和清理失败。
---
# 常见问题

先检查环境，再查看生效配置：

```sh
npx flash-tunnel doctor
npx flash-tunnel --mode quick --dry-run
```

启动失败时，在原命令后加 `--verbose` 查看细节。提交问题时，请提供 CLI 版本、操作系统、执行命令和错误码，并从粘贴的日志中移除凭据。

## cloudflared 无法启动

执行 `cloudflared --version`。找不到命令时，请[安装 cloudflared](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/downloads/)，或通过 `FLASH_TUNNEL_CLOUDFLARED` 指定可执行文件路径。安装 npm CLI 不会同时安装 `cloudflared`。

## 认证与域名错误

| 错误 | 检查项 |
| --- | --- |
| `AUTH_INVALID` / `403` | Token 是否有效、账号 / Zone 范围，以及[四项权限](./custom-domains)是否齐全 |
| `ACCOUNT_NOT_FOUND` | 设置正确的 `CLOUDFLARE_ACCOUNT_ID` |
| `ZONE_NOT_FOUND` / `ZONE_NOT_ACTIVE` | `--zone` 指定的域名是否在 Token 对应账号中生效 |
| `RECORD_CONFLICT` | 换一个子域名，或在使用 `--overwrite` 前确认已有 DNS 记录 |

Quick 模式不需要 Token。如果只需要临时地址，请显式传入 `--mode quick`。

## 找不到可运行脚本

进入应用目录，或使用 `--cwd apps/web`。也可以指定 `--command 'pnpm dev' --port 5173`，或构建后使用 `--static dist`。只有 `preview` 脚本但没有产物时，需要先构建。

## 端口与主机名问题

- 端口被占用时，使用 `--port <n>` 更换端口、通过 `--reuse` 复用，或用 `--url` 连接已有服务。
- 公网页面提示 **Blocked request / host is not allowed** 时，检查开发服务的 allowed-host 配置。flash-tunnel 只向自己启动的服务注入 Vite 额外主机名环境变量。
- 连接已有 Vite 服务时，需要放行相应主机名后重启服务。Quick 模式所需后缀为 `.trycloudflare.com`。
- 公网就绪检测超时，先确认本地 URL 可访问，再从 `--verbose` 输出中检查 `cloudflared` 错误。

## 退出之后预览无法访问

隧道需要本地服务和 `cloudflared` 持续运行。`--keep` 只保留云端记录，不保留这些进程。分享期间请保持终端会话运行。

## 快捷键或清理没有响应

先点击终端，再使用 **c**、**o**、**q** 或 **Ctrl+C**。快捷键需要交互式 TTY，在 CI 中不会启用。

如果清理以 `8` 退出，恢复网络和凭据后重试：

```sh
npx flash-tunnel clean --stale
```

单个保留会话可以用 `clean --session <id>` 清理。恢复成功前请保留状态文件，详见[清理与恢复](./cleanup)。

## 退出码

| 退出码 | 含义 |
| --- | --- |
| `0` | 成功完成 |
| `1` | 未分类或意外错误 |
| `2` | 配置、确认或项目锁错误 |
| `3` | 本地服务 / 构建失败 |
| `4` | 认证、权限或账号错误 |
| `5` | 隧道失败 |
| `6` | DNS / Zone / 记录失败 |
| `7` | 公网 URL 验证失败 |
| `8` | 清理未完成，需要使用保留状态重试 |
| `130` | Ctrl+C 中断并清理 |
| `143` | SIGTERM / SIGHUP 结束并清理 |

清理未完成时，可能用 `8` 覆盖之前的退出状态，以提示需要恢复。

仍有问题？欢迎[提交 Issue](https://github.com/flash-tunnel/flash-tunnel/issues)。
