---
description: 创建 flash-tunnel.ts，了解配置优先级和相对路径的解析方式。
---
# 配置项目

配置文件是可选的。临时预览可以直接使用命令行参数，经常使用的设置则可以保存到 `flash-tunnel.ts`。

## 生成配置

```sh
pnpm add -D flash-tunnel
pnpm exec flash-tunnel init
```

`init` 在当前目录生成 `flash-tunnel.ts`。已有同名文件时不会覆盖，除非传入 `--force`。

## 常用配置

```ts
import { defineConfig } from 'flash-tunnel'

export default defineConfig({
  domain: {
    zone: 'example.com',
    subdomain: '{project}-{rand}'
  },
  server: {
    command: 'pnpm dev',
    port: 5173,
    timeout: 90_000
  },
  tunnel: { mode: 'named' },
  autoStopAfter: '2h'
})
```

`server.timeout` 的单位是**毫秒**。`autoStopAfter` 支持 `'30m'`、`'2h'` 这样的时长字符串，也支持毫秒数值。`CLOUDFLARE_API_TOKEN` 请保存在环境变量中。

## 默认使用免 Token 模式

```ts
import { defineConfig } from 'flash-tunnel'

export default defineConfig({
  tunnel: { mode: 'quick' }
})
```

此后执行 `pnpm exec flash-tunnel`，就会使用 quick 模式，无需每次加参数。

## 文件发现与相对路径

flash-tunnel 从项目目录向上查找 `flash-tunnel.ts`，直到 Git 根目录。可以用 `--config` 显式指定：

```sh
npx flash-tunnel --config ./config/flash-tunnel.ts --mode quick
```

配置中的相对路径以**配置文件所在目录**为基准。如果文件位于 `config/`，可以设置 `server.cwd: '..'`，从项目根目录执行脚本。

## 优先级

**命令行参数 → 环境变量 → 配置文件 → 自动探测 / 默认值。**

只有定义了环境变量映射的字段才有这一层。例如，`--port 4000` 会覆盖 `FLASH_TUNNEL_PORT`，后者又会覆盖 `server.port`。

查看生效配置及来源，且不创建云端资源：

```sh
npx flash-tunnel --mode quick --dry-run
```

全部字段见[配置项参考](../reference/config)。完整主机名应通过 `--hostname` 或 `FLASH_TUNNEL_HOSTNAME` 提供；`domain.hostname` 并非类型定义支持的配置字段。
