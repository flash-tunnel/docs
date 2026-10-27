---
description: 了解 flash-tunnel 的用途、预览工作流程，以及 quick 和 named 两种隧道模式。
---
# 认识 flash-tunnel

**一条命令，把本地服务变成可分享的公网预览。** flash-tunnel 自动识别项目、启动服务，通过 Cloudflare Tunnel 连接公网，并在退出时清理资源。

你可以把开发中的页面发给同事评审，用手机打开电脑上的应用，或给客户一个演示地址，无需先部署构建产物。

::: info 早期预览
flash-tunnel 目前处于 `0.x` 阶段，接口和行为可能调整。本文档以[项目仓库](https://github.com/flash-tunnel/flash-tunnel)中的实际实现为依据。相较 0.1.0 的改进见 [0.2.0 待发布说明](../releases/0.2.0)。
:::

## 两种分享方式

| | Quick 模式 | Named 模式 |
| --- | --- | --- |
| 公网地址 | 随机 `*.trycloudflare.com` 地址 | Cloudflare 域名下的主机名 |
| Cloudflare 账号 / Token | 不需要 | 需要 |
| DNS 管理 | 不在你的账号中创建 DNS | 创建并删除 CNAME 记录 |
| 适用场景 | 临时演示、联调 | 有辨识度的预览地址 |
| 启动命令 | `npx flash-tunnel --mode quick` | `npx flash-tunnel --zone example.com` |

默认使用 **named** 模式。需要免 Token 的临时地址时，请显式传入 `--mode quick`。每次 quick 会话的地址都会变化。

## 一次运行会做什么？

1. 识别框架、包管理器、启动脚本和端口。
2. 启动本地服务、托管静态目录，或连接已有 URL。
3. 启动 Cloudflare Tunnel；named 模式还会通过 API 创建隧道和 DNS 记录。
4. 等待公网地址可访问，随后打印链接。
5. 退出时停止进程，删除本次会话创建的云端资源。

意外中断时，独立 watchdog 和启动扫描会协助回收遗留会话。它们的边界和重试命令见[清理与恢复](./cleanup)。

## 环境要求

- Node.js **22.14 或更新版本**。
- `cloudflared` 可执行文件，位于 `PATH` 中，或通过配置显式指定。
- 一个本地项目、构建好的静态目录，或正在运行的 HTTP 服务。
- named 模式还需要：Cloudflare 账号、已生效的域名，以及 API Token。

## 从这里开始

[创建第一个预览](./quick-start)、[接入自己的域名](./custom-domains)，或在[命令行参考](../reference/cli)中查找参数。
