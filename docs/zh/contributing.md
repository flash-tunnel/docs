---
description: 参与 flash-tunnel 开发或维护中英文 VitePress 文档。
---
# 参与贡献

项目分为两个仓库：

- [flash-tunnel/flash-tunnel](https://github.com/flash-tunnel/flash-tunnel)：CLI、核心逻辑、配置与 Cloudflare 适配器。
- [flash-tunnel/docs](https://github.com/flash-tunnel/docs)：独立的 VitePress 文档站。

## 开发 CLI

使用 Node.js **22.14+**，以及仓库 `packageManager` 字段指定的 pnpm 版本。

```sh
git clone git@github.com:flash-tunnel/flash-tunnel.git
cd flash-tunnel
pnpm install
pnpm build
pnpm ft --version
pnpm lint
pnpm typecheck
pnpm test
```

端到端测试需要显式启用，并会使用真实 Cloudflare 资源：

```sh
FLASH_TUNNEL_E2E=1 pnpm test:e2e
```

PowerShell 下先设置 `$env:FLASH_TUNNEL_E2E = '1'`，再执行 `pnpm test:e2e`。启用前请阅读仓库的测试配置，并提供限定权限的凭据。

## 维护文档

```sh
git clone git@github.com:flash-tunnel/docs.git flash-tunnel-docs
cd flash-tunnel-docs
pnpm install
pnpm dev
```

英文页面位于 `docs/`，中文位于对应的 `docs/zh/` 路径。请同步维护两种语言、导航和示例。增加选项说明前，应先对照源码确认实际行为。

提交前执行：

```sh
pnpm typecheck
pnpm check
pnpm build
pnpm preview
```

构建会检查 Markdown 链接；结构检查会验证语言页面对应关系和发布必需文件。预览时，请检查两种语言、手机导航、代码块与表格。

## 发布

推送到 `main` 会自动构建并部署至 GitHub Pages。Pull Request 只做校验，不发布。仓库设置与自定义域名 DNS 配置见[文档仓库 README](https://github.com/flash-tunnel/docs#deployment)。

导航结构、主题变量与阅读间距参考复用了 imba97 的 MIT 开源 pmpx / Synra 文档站。flash-tunnel 和本文档均使用 MIT 协议。
