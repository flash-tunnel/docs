---
description: 对照配置类型和解析实现整理的 flash-tunnel.ts 字段、默认值与单位。
---
# 配置项参考

从 `flash-tunnel` 导入 `defineConfig` 可以获得编辑器补全。文件查找、路径与优先级见[配置项目](../guide/configuration)。

## 域名

| 字段 | 类型 | 默认值 / 行为 |
| --- | --- | --- |
| `domain.provider` | `string` | `'cloudflare'` |
| `domain.zone` | `string` | 能推断时自动选择，否则需要提供 |
| `domain.subdomain` | `string` | `'{project}-{rand}'` |

完整主机名通过 `--hostname` 或 `FLASH_TUNNEL_HOSTNAME` 提供。`domain.hostname` 不属于配置接口。子域名占位符见[自定义域名](../guide/custom-domains#子域名模板)。

## 本地服务

| 字段 | 类型 | 默认值 / 行为 |
| --- | --- | --- |
| `server.command` | `string` | 自动识别启动脚本 |
| `server.cwd` | `string` | 已加载配置时为配置目录，否则为项目目录 |
| `server.port` | `number` | 从脚本 / 框架 / 服务模式中探测 |
| `server.url` | `string` | 要连接的已有服务地址 |
| `server.dir` | `string` | 要托管的静态目录 |
| `server.timeout` | `number` | `60000` 毫秒，正整数 |

`command`、`url`、`dir` 对应不同服务模式，请选择其中一种。相对路径以配置目录为基准。`--attach` 需要 URL，且不能与 command 并用。

设置 `server.port` 后，端口属于显式设置，会在启动命令前检查冲突，但不会改变命令自身的参数。没有配置端口时，待发布的 0.2.0 可以在默认端口被占用后，从服务输出中读取实际 URL，详见[本地服务](../guide/local-servers#端口选择与冲突)。

## 隧道

| 字段 | 类型 | 默认值 |
| --- | --- | --- |
| `tunnel.provider` | `string` | `'cloudflare'` |
| `tunnel.mode` | `'named' \| 'quick'` | `'named'` |
| `tunnel.name` | `string` | `'flash-tunnel-{project}-{rand}'` |

Quick 模式分配随机 `trycloudflare.com` 地址，并忽略生成的 named 主机名。内置适配器支持情况可通过 `flash-tunnel providers` 查看；仅填写 provider 字符串不会安装新适配器。

## Cloudflare 配置

| 字段 | 类型 | 默认值 / 行为 |
| --- | --- | --- |
| `providers.cloudflare.accountId` | `string` | 无歧义时通过 Token 自动发现 |
| `providers.cloudflare.zoneId` | `string` | 通过 Zone 名称解析 |
| `providers.cloudflare.cloudflaredPath` | `string` | `'cloudflared'` |
| `providers.cloudflare.originRequest.httpHostHeader` | `string` | 可选，覆盖源站 Host 请求头 |
| `providers.cloudflare.originRequest.noTLSVerify` | `boolean` | 可选，覆盖源站 TLS 验证行为 |

`noTLSVerify: true` 会关闭源站证书验证。仅在明确需要连接这类本地 HTTPS 服务时使用。

配置中没有 API Token 字段。凭据仅来自 `CLOUDFLARE_API_TOKEN`。

## 自动停止

| 字段 | 类型 | 默认值 / 行为 |
| --- | --- | --- |
| `autoStopAfter` | `string \| number` | 未配置时没有自动时限 |

可以使用 `'90s'`、`'30m'`、`'2h'`，或毫秒数值。到期时，flash-tunnel 会停止会话并清理。

## 连接已有服务的示例

```ts
import { defineConfig } from 'flash-tunnel'

export default defineConfig({
  server: { url: 'http://127.0.0.1:3000' },
  tunnel: { mode: 'quick' },
  autoStopAfter: '30m'
})
```

字段定义维护在源码的[配置类型](https://github.com/flash-tunnel/flash-tunnel/blob/main/packages/config/src/types.ts)和[配置解析器](https://github.com/flash-tunnel/flash-tunnel/blob/main/packages/core/src/config/resolve.ts)中。
