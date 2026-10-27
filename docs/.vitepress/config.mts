import { defineConfig, type DefaultTheme } from 'vitepress'

const origin = 'https://flash-tunnel.imba97.dev'
const repo = 'https://github.com/flash-tunnel/flash-tunnel'
const docsRepo = 'https://github.com/flash-tunnel/docs'

// Adapted from the pmpx / Synra documentation: mirrored navigation and shared theme.
function sidebar(zh: boolean): DefaultTheme.SidebarItem[] {
  const prefix = zh ? '/zh' : ''
  const item = (en: string, cn: string, path: string) => ({ text: zh ? cn : en, link: `${prefix}${path}` })
  return [
    {
      text: zh ? '开始使用' : 'Getting started',
      items: [item('Introduction', '项目介绍', '/guide/introduction'), item('Quick start', '快速开始', '/guide/quick-start')]
    },
    {
      text: zh ? '使用指南' : 'Guides',
      items: [
        item('Custom domains', '自定义域名', '/guide/custom-domains'),
        item('Local servers', '本地服务', '/guide/local-servers'),
        item('Configuration', '配置项目', '/guide/configuration'),
        item('Cleanup & recovery', '清理与恢复', '/guide/cleanup'),
        item('CI & automation', 'CI 与自动化', '/guide/automation')
      ]
    },
    {
      text: zh ? '参考' : 'Reference',
      items: [
        item('CLI commands', '命令行', '/reference/cli'),
        item('Configuration options', '配置项', '/reference/config'),
        item('Environment variables', '环境变量', '/reference/environment')
      ]
    },
    {
      text: zh ? '更多' : 'Resources',
      items: [item('Troubleshooting', '常见问题', '/guide/troubleshooting'), item('0.2.0 release notes', '0.2.0 更新说明', '/releases/0.2.0'), item('Contributing', '参与贡献', '/contributing')]
    }
  ]
}

export default defineConfig({
  title: 'flash-tunnel',
  description: 'Turn a local dev server into a shareable preview with one command.',
  lang: 'en-US',
  base: '/',
  // GitHub Pages serves .html files directly, including on a fresh deep-link visit.
  cleanUrls: false,
  lastUpdated: true,
  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/logo.svg' }],
    ['meta', { name: 'theme-color', content: '#191827' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:site_name', content: 'flash-tunnel' }],
    ['meta', { name: 'twitter:card', content: 'summary' }]
  ],
  markdown: { theme: { light: 'github-light', dark: 'github-dark' } },
  themeConfig: {
    logo: { src: '/logo.svg', alt: '' },
    socialLinks: [{ icon: 'github', link: repo }],
    externalLinkIcon: true,
    search: {
      provider: 'local',
      options: {
        locales: {
          zh: {
            translations: {
              button: { buttonText: '搜索文档', buttonAriaLabel: '搜索文档' },
              modal: {
                noResultsText: '没有找到相关内容', resetButtonTitle: '清除搜索',
                displayDetails: '显示详细列表', backButtonTitle: '返回',
                footer: { selectText: '选择', navigateText: '切换', closeText: '关闭' }
              }
            }
          }
        },
        miniSearch: {
          // VitePress 1.6 needs explicit segmentation for Chinese prose.
          options: {
            tokenize: (text) => Array.from(new Intl.Segmenter('zh', { granularity: 'word' }).segment(text))
              .filter(part => part.isWordLike).map(part => part.segment.toLowerCase())
          }
        }
      }
    }
  },
  locales: {
    root: {
      label: 'English', lang: 'en-US',
      themeConfig: {
        nav: [
          { text: 'Guide', link: '/guide/quick-start', activeMatch: '^/guide/' },
          { text: 'Reference', link: '/reference/cli', activeMatch: '^/reference/' },
          { text: 'Resources', items: [{ text: 'npm', link: 'https://www.npmjs.com/package/flash-tunnel' }, { text: 'Releases', link: `${repo}/releases` }, { text: 'Contributing', link: '/contributing' }] }
        ],
        sidebar: sidebar(false),
        outline: { level: [2, 3], label: 'On this page' },
        editLink: { pattern: `${docsRepo}/edit/main/docs/:path`, text: 'Edit this page on GitHub' },
        docFooter: { prev: 'Previous page', next: 'Next page' },
        lastUpdated: { text: 'Last updated', formatOptions: { dateStyle: 'medium' } },
        footer: { message: 'Released under the MIT License.', copyright: 'Made by imba97 · Powered by Cloudflare Tunnel' }
      }
    },
    zh: {
      label: '简体中文', lang: 'zh-CN', link: '/zh/',
      description: '一条命令，把本地服务变成可分享的公网预览。',
      themeConfig: {
        nav: [
          { text: '指南', link: '/zh/guide/quick-start', activeMatch: '^/zh/guide/' },
          { text: '参考', link: '/zh/reference/cli', activeMatch: '^/zh/reference/' },
          { text: '资源', items: [{ text: 'npm', link: 'https://www.npmjs.com/package/flash-tunnel' }, { text: '版本发布', link: `${repo}/releases` }, { text: '参与贡献', link: '/zh/contributing' }] }
        ],
        sidebar: sidebar(true),
        outline: { level: [2, 3], label: '本页目录' },
        editLink: { pattern: `${docsRepo}/edit/main/docs/:path`, text: '在 GitHub 上编辑此页' },
        docFooter: { prev: '上一页', next: '下一页' },
        lastUpdated: { text: '最后更新', formatOptions: { dateStyle: 'medium' } },
        langMenuLabel: '切换语言', sidebarMenuLabel: '目录', returnToTopLabel: '返回顶部',
        darkModeSwitchLabel: '外观', lightModeSwitchTitle: '切换浅色模式', darkModeSwitchTitle: '切换深色模式',
        skipToContentLabel: '跳转到内容',
        notFound: { title: '页面未找到', quote: '这个地址暂时没有内容，可以从首页重新出发。', linkLabel: '返回首页', linkText: '返回首页' },
        footer: { message: '基于 MIT 协议开源发布。', copyright: '由 imba97 开发 · 基于 Cloudflare Tunnel' }
      }
    }
  },
  sitemap: { hostname: origin },
  transformHead({ pageData }) {
    if (pageData.relativePath === '404.md') return [['meta', { name: 'robots', content: 'noindex' }]]
    const path = pageData.relativePath.replace(/index\.md$/, '').replace(/\.md$/, '.html')
    const zh = path.startsWith('zh/')
    const shared = zh ? path.slice(3) : path
    const enUrl = `${origin}/${shared}`
    const zhUrl = `${origin}/zh/${shared}`
    const url = zh ? zhUrl : enUrl
    return [
      ['link', { rel: 'canonical', href: url }],
      ['link', { rel: 'alternate', hreflang: 'en', href: enUrl }],
      ['link', { rel: 'alternate', hreflang: 'zh-CN', href: zhUrl }],
      ['link', { rel: 'alternate', hreflang: 'x-default', href: enUrl }],
      ['meta', { property: 'og:url', content: url }],
      ['meta', { property: 'og:title', content: pageData.title ? `${pageData.title} | flash-tunnel` : 'flash-tunnel' }],
      ['meta', { property: 'og:description', content: pageData.description || (zh ? '一条命令，把本地服务变成可分享的公网预览。' : 'Turn a local dev server into a shareable preview with one command.') }],
      ['meta', { property: 'og:image', content: `${origin}/logo.svg` }]
    ]
  }
})
