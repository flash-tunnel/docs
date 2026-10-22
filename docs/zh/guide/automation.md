---
description: 在脚本和 CI 中使用 NDJSON 事件、就绪文件与回调。
---
# CI 与自动化

组合 `--json`、`--ready-file`、`--on-ready` 和 `--auto-stop`，可以让脚本或 CI 管理预览生命周期。

## 机器可读输出

```sh
npx flash-tunnel --mode quick --json --auto-stop 20m
```

`--json` 向 stdout 输出 **NDJSON**：每行一个 JSON 对象。请按行处理，不要将整个输出当作单个 JSON 文档。人类可读日志和回调输出进入 stderr。

`ready` 事件包含公网地址和会话信息。以下标识和地址仅为示例：

```json
{"type":"ready","url":"https://your-preview.trycloudflare.com","localUrl":"http://127.0.0.1:5173","tunnelId":"example-tunnel","sessionId":"ft_example"}
```

Named 模式还可能包含 `hostname`；存在到期时间时会包含 `expiresAt`。消费方应允许增加其他字段。

## 就绪文件

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

预览可用期间进程会持续运行。在另一个进程中轮询该文件，读取其 `url` 字段。每次运行应使用新路径，避免误读上次会话。相对路径以 CLI 工作目录为基准，父目录会自动创建。

## 就绪后执行命令

```sh
npx flash-tunnel --mode quick --on-ready 'node scripts/check-preview.mjs' --auto-stop 20m
```

回调会继承以下环境变量：

| 变量 | 内容 |
| --- | --- |
| `FLASH_TUNNEL_URL` | 公网预览 URL |
| `FLASH_TUNNEL_LOCAL_URL` | 本地服务 URL |
| `FLASH_TUNNEL_SESSION_ID` | 会话标识 |
| `FLASH_TUNNEL_TUNNEL_ID` | 隧道标识 |
| `FLASH_TUNNEL_HOSTNAME` | 公网主机名，存在时提供 |
| `FLASH_TUNNEL_EXPIRES_AT` | 到期时间，存在时提供 |

回调异步执行。**回调结束不会停止隧道，回调退出码也不会成为 CLI 的测试结果。** 在 CI 中，请将测试作为前台步骤运行，并在结束后显式停止预览。

## 有时限的 CI 脚本

以下 Bash 示例假设已安装项目依赖和 `cloudflared`，并且可以调用 `flash-tunnel` 可执行文件，例如提前执行了 `npm install -g flash-tunnel`。正式 CI 建议固定 CLI 版本，以便复现构建。

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
# 在这里使用 PREVIEW_URL 运行浏览器或集成测试。
```

`--auto-stop` 在 shell 退出清理之外，再提供运行时限。Named 模式应从 CI 密钥存储注入 Cloudflare Token，并让凭据持续可用直到清理完成。
