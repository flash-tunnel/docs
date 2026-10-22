# flash-tunnel-docs

The independent English / 简体中文 documentation for [flash-tunnel](https://github.com/flash-tunnel/flash-tunnel).

- Website: **https://flash-tunnel.imba97.dev**
- Repository: **git@github.com:flash-tunnel/docs.git**
- Framework: **VitePress 1.6.4**, Vue 3, TypeScript

## Local development

Use Node.js **22.14+** (CI uses Node 24) and **pnpm 12.14.0**.

```sh
pnpm install
pnpm dev
```

```sh
pnpm typecheck
pnpm check
pnpm build
pnpm check:build
pnpm preview
```

`pnpm check` checks locale parity and publishing files. VitePress checks Markdown links during the build. `pnpm check:build` verifies all generated local links, assets, anchors, canonical URLs, the CNAME file, and sitemap.

Scripts under `scripts/` are written in TypeScript and executed with `esno`. They are included in `pnpm typecheck`.

## Content structure

```text
docs/
  index.md                  English home
  guide/                    Getting started and usage
  reference/                CLI, config, environment
  contributing.md
  zh/                       Chinese pages with identical paths
  public/                   Logo, CNAME, robots.txt
  .vitepress/
    config.mts              Locales, navigation, search, metadata
    theme/                  Shared theme and homepage components
```

Both locales have the same routes and navigation order. VitePress's language switch preserves the corresponding page. Search is local and includes Chinese word segmentation, with no external search service required.

The homepage uses a terminal illustration, a copyable quick-start command, feature cards, and a four-step workflow. Documentation uses the default VitePress layout with adjusted reading spacing, responsive tables, code groups, an outline, edit links, and light/dark themes.

## Deployment

The workflow in `.github/workflows/deploy.yml` validates pull requests and deploys `main` to **GitHub Pages** with an Actions artifact. It uses the committed lockfile. No custom deploy token is required.

One-time repository setup:

1. Open [Settings → Pages](https://github.com/flash-tunnel/docs/settings/pages).
2. Select **GitHub Actions** as the publishing source.
3. Set **Custom domain** to `flash-tunnel.imba97.dev` and save.
4. In the DNS provider for `imba97.dev`, create:

   | Type | Name | Target |
   | --- | --- | --- |
   | CNAME | `flash-tunnel` | `flash-tunnel.github.io` |

5. If using Cloudflare DNS, start with **DNS only** while GitHub verifies DNS and provisions its certificate. Enable **Enforce HTTPS** in Pages once available.
6. Push to `main` or run the workflow manually, and confirm the deployment in the Actions tab.

`docs/public/CNAME` is included in the build. **With an Actions-based deployment, this file does not configure the repository's custom-domain setting: set the domain in Settings → Pages as well.**

The site's `base` is `/` because it uses a custom domain. Routes keep `.html` extensions so direct visits and refreshes work on GitHub Pages without a rewrite rule. Sitemap, canonical URLs, and language alternates use the custom domain.

GitHub's instructions: [publishing source](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site), [custom domains](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site). Framework deployment guide: [VitePress](https://vuejs.github.io/vitepress/v1/guide/deploy).

## Reuse and maintenance

Navigation structure, theme-token conventions, and reading rhythm were adapted from imba97's MIT-licensed pmpx and Synra documentation projects. The homepage components and flash-tunnel content are tailored to this project. See [LICENSE](LICENSE).

When updating content, verify behavior against `flash-tunnel/flash-tunnel`, especially `packages/config/src/types.ts`, `packages/core/src/config/resolve.ts`, and `packages/cli/src/index.ts`. Keep both languages in sync.

## 中文说明

这是独立的 `flash-tunnel-docs` 项目，源代码仓库为 `flash-tunnel/docs`。英文位于 `docs/`，中文位于 `docs/zh/`。本地使用 `pnpm dev`，提交前运行类型检查、双语结构检查、构建与构建产物检查。

推送 `main` 后通过 GitHub Actions 部署到 GitHub Pages。首次发布需要在仓库 Pages 设置中选择 GitHub Actions、保存自定义域名，并将 DNS 的 `flash-tunnel` CNAME 指向 `flash-tunnel.github.io`。仅提交 `CNAME` 文件不会自动完成仓库域名设置。
