---
description: 安装 cloudflared，无需 API Token 即可分享第一个本地项目。
---
# 快速开始

无需 Cloudflare 账号或 API Token，先创建一个临时公网预览。

## 1. 检查环境

安装 Node.js **22.14+** 和 [cloudflared](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/downloads/)，然后确认两者可用：

```sh
node --version
cloudflared --version
```

如果 `cloudflared` 不在 `PATH` 中，用 [`FLASH_TUNNEL_CLOUDFLARED`](../reference/environment) 指定可执行文件路径。

## 2. 在项目中运行

进入包含 `dev` 脚本的项目目录，执行：

```sh
npx flash-tunnel --mode quick
```

flash-tunnel 会识别启动命令和本地端口，启动服务，并等待 `https://…trycloudflare.com` 公网地址可访问。复制这个地址即可分享；需要预览期间，请保持终端运行。

::: tip 服务已经启动了？
可以直接连接已有服务：

```sh
npx flash-tunnel --mode quick --url http://127.0.0.1:5173 --attach
```

已启动的服务仍由你管理。flash-tunnel 只停止自己启动的子进程。
:::

## 3. 结束预览

按一次 **Ctrl+C**，等待清理结束。交互式终端还支持 **c** 复制链接、**o** 打开浏览器、**q** 退出并清理。

公网链接是临时的，下次 quick 模式运行会分配新地址。

## 经常使用时安装

::: code-group
```sh [项目依赖]
pnpm add -D flash-tunnel
pnpm exec flash-tunnel --mode quick
```
```sh [全局安装]
npm install -g flash-tunnel
flash-tunnel --mode quick
```
:::

安装为项目依赖，可以通过项目的 lockfile 固定版本。

## 可选初始化

```sh
npx flash-tunnel doctor
npx flash-tunnel init
```

`doctor` 检查环境和生效配置。生效模式为 named 时，它可能提示缺少凭据；quick 预览不需要这些凭据。`init` 会生成可选的 `flash-tunnel.ts` 配置文件。

## 下一步

- [自定义域名](./custom-domains)：接入自己的 Cloudflare 域名。
- [本地服务](./local-servers)：指定脚本、静态目录，或连接已有服务。
- [常见问题](./troubleshooting)：排查主机名校验、端口和启动失败。
