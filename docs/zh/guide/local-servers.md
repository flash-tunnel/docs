---
description: 了解服务自动探测，指定启动命令、托管静态文件或连接已运行的服务。
---
# 本地服务

flash-tunnel 可以启动项目脚本、托管静态目录，或连接已经运行的服务。

## 自动探测

探测会读取 `package.json`、包管理器 lockfile 和构建产物。

包管理器从应用的工作目录开始向上查找。每层先检查受支持的 `packageManager` 声明，再依次检查 pnpm、Yarn、Bun 和 npm 的 lockfile。就近匹配：子应用的 lockfile 优先于父目录的声明。完全没有匹配时回退到 npm。

查找会包含 Git 或 workspace 根目录，并在该层停止。边界可以是 `.git` 文件或目录、`pnpm-workspace.yaml`，或声明了 `workspaces` 的 `package.json`；没有这些标记时，查找到文件系统根目录。构建与启动使用相同规则。向上继承行为属于 [0.2.0 待发布改进](../releases/0.2.0)。

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

包含 `dev` 或 `start` 脚本的其他项目也可以使用；必要时指定命令和端口。

### 端口选择与冲突

端口优先级为：**显式设置 → 脚本参数 → 框架默认值 → 通用默认值**。显式设置包括 `--port`、`FLASH_TUNNEL_PORT`、`server.port`；项目脚本和显式启动命令支持解析 `--port`、`-p`、`PORT=`。

[0.2.0 待发布改进](../releases/0.2.0)区分固定端口和估计值：

- **显式设置或脚本端口**：启动命令前检查冲突。可以更换端口，或主动选择复用已有服务。
- **框架或通用默认端口**：估计端口被占用时，仍会启动命令，并从输出中寻找实际本地 URL。启动前已占用估计端口的监听会被排除，即使日志打印了相同端口，也不会直接连接它。
- **静态模式**：内置服务会绑定所选端口，因此仍需处理冲突。

如果估计端口被占用，且命令不输出本地 URL，请用 `--port` 指定实际端口。这个参数告诉 flash-tunnel 应在哪里等待服务，不会自动给启动命令追加参数；服务自身也需要配置为监听该端口。

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

项目根目录没有可运行脚本时，会检查 `apps/*` 和 `packages/*` 下一层目录。交互式终端会提供选择；CI 等非交互环境会报告 `WORKSPACE_REQUIRED` 并列出候选路径，需要显式传入 `--cwd`。

## 连接已有服务

```sh
npx flash-tunnel --mode quick --url http://127.0.0.1:3000 --attach
```

`--attach` 必须与 `--url` 一起使用，且不能与 `server.command` 并用。退出时不会停止已有服务。需要复用所选端口上的服务时，传入 `--reuse`，或在固定端口冲突提示中确认复用。仅发现猜测端口被占用，不会自动复用。

## 分享静态产物

```sh
pnpm build
npx flash-tunnel --mode quick --static dist
```

`--static` 不带目录时，会探测 `dist`、`build` 或 `out`。静态模式需要 `index.html` 文件。不要将 `server.dir` / `--static` 与 `server.command` 或 `server.url` 并用。

## 主机名校验

对于支持的 Vite 版本，flash-tunnel 会向自己启动的服务注入 `__VITE_ADDITIONAL_SERVER_ALLOWED_HOSTS`：named 模式放行准确的主机名，quick 模式放行 `.trycloudflare.com`。已有的环境变量值会被保留。

如果服务由你提前启动，需要在启动前配置允许的主机名。优先放行具体主机名或必要的域名后缀，详见[常见问题](./troubleshooting)。
