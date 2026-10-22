---
description: 配置 Cloudflare API Token，通过自己的域名分享本地预览。
---
# 自定义域名

Named 模式会创建 Cloudflare Tunnel 和域名下的 DNS 记录。正常退出时删除这两项资源，除非传入 `--keep`。

## 准备域名与 Token

域名必须已在 Cloudflare 账号中成为 active 状态的 Zone。在 [Cloudflare 控制台](https://dash.cloudflare.com/profile/api-tokens)创建 **Custom token**，限定到使用的账号和 Zone，并授予以下权限：

| 权限 | 用途 |
| --- | --- |
| Account · Cloudflare Tunnel · Edit | 创建 / 删除隧道、配置 ingress、清理连接 |
| Zone · DNS · Edit | 创建 / 删除 CNAME 记录、检查冲突 |
| Zone · Zone · Read | 查询 Zone |
| Account · Account Settings · Read | 查询账号 |

控制台可能将 **Edit** 显示为 **Write**。也可以查看与代码一同维护的[项目 README](https://github.com/flash-tunnel/flash-tunnel/blob/main/README_CN.md)。

## 设置 Token

::: code-group
```sh [macOS / Linux]
export CLOUDFLARE_API_TOKEN='your_token_here'
```
```powershell [PowerShell]
$env:CLOUDFLARE_API_TOKEN = 'your_token_here'
```
:::

Token **仅从环境变量读取**。不要写入配置文件或 Git 历史。

## 启动预览

```sh
npx flash-tunnel --zone example.com
```

默认子域名模板为 `{project}-{rand}`。例如，`my-app` 项目可能分配到 `my-app-a1b2.example.com`。随机后缀可以减少命名冲突和旧 DNS 缓存带来的影响。

也可以指定固定名称或完整主机名：

```sh
npx flash-tunnel --zone example.com --subdomain demo
npx flash-tunnel --hostname demo.example.com
```

无法自动确定账号时，设置 `CLOUDFLARE_ACCOUNT_ID`。也可以用 `CLOUDFLARE_ZONE_ID` 显式指定 Zone，详见[环境变量](../reference/environment)。

## 子域名模板

| 占位符 | 含义 |
| --- | --- |
| `{project}` | 由项目目录名生成的 slug |
| `{branch}` | 适用于 DNS 的 Git 分支名 |
| `{rand}` | 随机后缀 |
| `{rand:6}` | 指定长度的随机后缀 |
| `{session}` | 会话标识 |
| `{ts}` | 时间戳 |

```sh
npx flash-tunnel --zone example.com --subdomain '{project}-{branch}-{rand:6}'
```

::: warning 多级子域名
`demo.team.example.com` 这样的地址需要 `--allow-multilevel`，并需要 Cloudflare 证书覆盖，例如 Advanced Certificate。没有配置相应证书时，建议使用单级子域名。
:::

## DNS 冲突

flash-tunnel 会检查记录归属。遇到 `RECORD_CONFLICT` 时，可以换一个子域名，或先检查已有记录。`--overwrite` 会替换其他工具创建的记录，请仅在确实需要替换时使用。

需要固定配置时，将域名写入 [`flash-tunnel.ts`](./configuration)。保留资源和手动回收方式见[清理与恢复](./cleanup)。
