---
description: 了解服务自动探测，指定启动命令、托管静态文件或连接已运行的服务。
---
# 本地服务

flash-tunnel 可以启动项目脚本、托管静态目录，或连接已经运行的服务。

## 自动探测

探测会读取 `package.json`、包管理器 lockfile 和构建产物。声明的 `packageManager` 优先；否则依次检查 pnpm、Yarn、Bun 和 npm 的 lockfile，最终回退到 npm。

启动选择顺序如下：

1. 显式配置的 `server.command`、`server.url` 或 `server.dir`。
2. 已有构建产物时的 `preview` 脚本。
3. `dev` 脚本。
4. `start` 脚本。
5. 含有 `index.html` 的 `dist`、`build` 或 `out` 静态目录。

如果只有 `preview` 脚本但没有构建产物，需要先构建。`--dev` 跳过 preview 选择；`--build` 则在启动前运行项目的 build 脚本。

### 已识别的框架

| 框架 | 开发端口 | 预览 / 启动端口 |
| --- | --- | --- |
| Next.js / Nuxt | 3000 | 3000 |
| Astro | 4321 | 4321 |
| Vite / SvelteKit | 5173 | 4173 |
| Vue CLI | 8080 | 8080 |
| Create React App | 3000 | 3000 |
| Angular | 4200 | 4200 |
| Storybook | 6006 | 6006 |
| Umi | 8000 | 8000 |

显式设置的端口、从脚本中解析到的端口优先于框架默认值。包含 `dev` 或 `start` 脚本的其他项目也可以使用；必要时指定命令和端口。

## 指定启动命令

```sh
npx flash-tunnel --mode quick --command 'pnpm dev' --port 5173
npx flash-tunnel --mode quick --dev
npx flash-tunnel --mode quick --build
```

在 monorepo 中，用 `--cwd` 指向应用：

```sh
npx flash-tunnel --mode quick --cwd apps/web
```

## 连接已有服务

```sh
npx flash-tunnel --mode quick --url http://127.0.0.1:3000 --attach
```

`--attach` 必须与 `--url` 一起使用，且不能与 `server.command` 并用。退出时不会停止已有服务。`--reuse` 是另一个选项，用于复用所选端口上已监听的服务。

## 分享静态产物

```sh
pnpm build
npx flash-tunnel --mode quick --static dist
```

`--static` 不带目录时，会探测 `dist`、`build` 或 `out`。静态模式需要 `index.html` 文件。不要将 `server.dir` / `--static` 与 `server.command` 或 `server.url` 并用。

## 主机名校验

对于支持的 Vite 版本，flash-tunnel 会向自己启动的服务注入 `__VITE_ADDITIONAL_SERVER_ALLOWED_HOSTS`：named 模式放行准确的主机名，quick 模式放行 `.trycloudflare.com`。已有的环境变量值会被保留。

如果服务由你提前启动，需要在启动前配置允许的主机名。优先放行具体主机名或必要的域名后缀，详见[常见问题](./troubleshooting)。
