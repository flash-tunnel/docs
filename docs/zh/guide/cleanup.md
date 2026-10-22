---
description: 了解正常清理、意外中断、状态保留与手动恢复命令。
---
# 清理与恢复

预览与终端会话绑定。正常退出时，flash-tunnel 会回收自己创建的资源，避免临时预览留下无人管理的基础设施。

## 正常退出

按一次 **Ctrl+C**，或在交互式终端按 **q**。清理顺序为：

1. 停止 `cloudflared`。
2. 等待连接排空。
3. 删除本次会话的 DNS 记录。
4. 删除隧道。
5. 停止 flash-tunnel 启动的本地服务进程。
6. 删除会话状态，释放项目锁。

Quick 模式没有账号内的 DNS 记录需要删除。通过 `--url` 连接的已有服务不会被停止。

## 意外中断

| 情况 | 行为 |
| --- | --- |
| `Ctrl+C` | 清理后以 `130` 退出 |
| `SIGTERM` / `SIGHUP` | 清理后以 `143` 退出 |
| 清理时再次按 `Ctrl+C` | 立即退出，保留状态供恢复 |
| 主进程被杀或终端关闭 | 独立 watchdog 尝试回收 |
| 下次启动 | 扫描过期会话，除非设置 `--no-sweep` |
| 清理失败 | 以 `8` 退出，保留状态以便重试 |

Watchdog 是尽力执行的兜底机制。云端清理仍需要网络和有效凭据；遇到未能完成的退出，应检查遗留会话。

## 手动清理

```sh
# 列出遗留会话
npx flash-tunnel clean

# 预览清理操作，不修改资源
npx flash-tunnel clean --stale --dry-run

# 清理过期会话，也可以限定项目
npx flash-tunnel clean --stale
npx flash-tunnel clean --project ./apps/web --stale

# 使用启动时打印的标识清理指定会话
npx flash-tunnel clean --session ft_xxxx
```

`clean --all --yes` 会清理全部已记录会话；`--force` 允许清理仍在运行的会话。如果只想停止一个预览，优先指定会话或项目。

## 保留云端资源

```sh
npx flash-tunnel --zone example.com --keep
```

`--keep` 在退出时保留 DNS 记录和隧道，并打印手动清理命令。**它不会让本地服务或 `cloudflared` 持续运行。** 仅保留 DNS 记录，不能让预览继续在线。

## 状态与日志

运行时数据保存在项目目录之外：

- 项目数据与日志：`~/.flash-tunnel/projects/<project-key>/`。
- 会话索引：`~/.flash-tunnel/sessions/`。

不活跃的项目数据默认在 **7 天**后清理。`FLASH_TUNNEL_RETENTION_DAYS=0` 可以关闭过期清理。状态文件用于恢复云端资源，清理未完成前不要直接删除。

Token 只从环境变量读取，不保存到配置、状态或命令参数中。删除 DNS 和隧道时使用记录的 ID，并检查资源归属。
