---
description: 启动预览、检查环境和清理会话所需的命令与参数。
---
# 命令行参考

示例使用 `npx flash-tunnel`。安装为项目依赖时使用 `pnpm exec flash-tunnel`，全局安装后可直接调用 `flash-tunnel`。

## 命令

| 命令 | 用途 |
| --- | --- |
| `flash-tunnel [root]` | 启动预览；可用位置参数指定项目目录 |
| `flash-tunnel start` | 显式启动子命令 |
| `flash-tunnel doctor` | 检查 Node、配置、凭据、Zone、cloudflared、端口与会话 |
| `flash-tunnel init` | 创建 `flash-tunnel.ts` |
| `flash-tunnel clean` | 列出或清理已记录会话 |
| `flash-tunnel providers` | 列出可用适配器与能力 |

`--help` 查看命令用法，`--version` 查看已安装版本。

## 启动：本地服务

| 参数 | 含义 |
| --- | --- |
| `--cwd <dir>` | 项目目录 |
| `--config <path>` | 指定配置文件 |
| `--port <port>` | 显式指定期望端口，不会给服务命令追加参数 |
| `--command <command>` | 启动服务的命令 |
| `--url <url>` | 已有服务 URL |
| `--attach` | 仅连接已有服务，必须提供 `--url` |
| `--static [dir]` | 托管静态目录，省略目录时探测构建产物 |
| `--dev` | 强制使用 dev 脚本 |
| `--build` | 启动前执行 build 脚本 |
| `--reuse` | 复用端口上已监听的服务 |

对于命令启动的服务，待发布的 0.2.0 会区分固定端口和框架 / 通用默认估计值。估计端口被占用时，可以从服务日志中确认实际 URL；只有主动选择才会复用已有监听。详见[端口选择与冲突](../guide/local-servers#端口选择与冲突)。

## 启动：隧道与域名

| 参数 | 含义 |
| --- | --- |
| `--mode <mode>` | `named`（默认）或 `quick` |
| `--zone <domain>` | Cloudflare Zone，例如 `example.com` |
| `--hostname <fqdn>` | 完整公网主机名，优先于 zone/subdomain 拼接 |
| `--subdomain <label>` | 字面量标签或[模板](../guide/custom-domains#子域名模板) |
| `--allow-multilevel` | 允许多级子域名，需要相应证书覆盖 |
| `--overwrite` | 替换非本工具创建的 DNS 记录 |
| `--auto-stop <duration>` | 指定时长后停止并清理，如 `30m`、`2h` |
| `--keep` | 退出时保留云端 DNS / 隧道资源 |
| `--no-sweep` | 跳过启动时的过期会话扫描 |

## 启动：输出与自动化

| 参数 | 含义 |
| --- | --- |
| `--dry-run` | 打印生效配置与来源，不创建资源 |
| `--json` | 向 stdout 输出 NDJSON |
| `--ready-file <path>` | 将就绪数据写入 JSON 文件 |
| `--on-ready <command>` | 就绪后执行命令 |
| `--open` | 在交互式终端中就绪后打开浏览器 |
| `--no-open` | 不打开浏览器（默认） |
| `--verbose` | 透传服务和 cloudflared 日志 |
| `--silent` | 仅输出错误 |
| `--no-color` | 关闭终端颜色 |
| `--no-spinner` | 关闭加载动画 |
| `-y, --yes` | 禁用提示并使用默认值 |

JSON 模式、CI、非 TTY 输出，以及 `FLASH_TUNNEL_NO_OPEN=1` 时，`--open` 不会打开浏览器。

## 清理

不提供选择条件时，`clean` 列出会话。使用以下参数选择并清理资源：

| 参数 | 含义 |
| --- | --- |
| `--session <id>` | 选择单个会话 |
| `--project <dir>` | 选择某个项目的会话 |
| `--stale` | 选择所属进程已结束的会话 |
| `--all` | 选择全部已记录会话，必须配合 `--yes` |
| `--dry-run` | 预览清理内容 |
| `--yes` | 确认大范围清理 |
| `--force` | 允许清理运行中的会话 |
| `--json` / `--silent` | 机器可读 / 仅错误输出 |

## Doctor、init 与 providers

- `doctor`：`--cwd <dir>`、`--config <path>`、`--json`、`--silent`。
- `init`：`--cwd <dir>`、`--force`（覆盖已有配置）、`--json`、`--silent`。
- `providers`：`--json`、`--silent`。

另见[配置项](./config)、[环境变量](./environment)与[退出码](../guide/troubleshooting#退出码)。
