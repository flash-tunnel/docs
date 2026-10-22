import assert from 'node:assert/strict'
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('..', import.meta.url))
const docs = join(root, 'docs')
const dist = join(docs, '.vitepress/dist')

function files(dir, suffix, prefix = '') {
  return readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    if (entry.name.startsWith('.')) return []
    const path = `${prefix}${entry.name}`
    return entry.isDirectory() ? files(join(dir, entry.name), suffix, `${path}/`) : entry.name.endsWith(suffix) ? [path] : []
  })
}

const english = files(docs, '.md').filter(path => !path.startsWith('zh/')).sort()
const chinese = files(join(docs, 'zh'), '.md').sort()
assert.deepEqual(chinese, english, 'English and Chinese routes must match')
assert.equal(readFileSync(join(docs, 'public/CNAME'), 'utf8').trim(), 'flash-tunnel.imba97.dev')
for (const path of [...english, ...chinese.map(path => `zh/${path}`)]) {
  const source = readFileSync(join(docs, path), 'utf8')
  assert.ok(path.endsWith('index.md') || /^# .+/m.test(source), `Missing page heading: ${path}`)
}
console.log(`Validated ${english.length} pages per language and custom domain.`)

if (process.argv.includes('--built')) {
  assert.ok(existsSync(dist), 'Build the site before checking generated output')
  assert.equal(readFileSync(join(dist, 'CNAME'), 'utf8').trim(), 'flash-tunnel.imba97.dev')
  assert.ok(existsSync(join(dist, '.nojekyll')), 'Missing .nojekyll')
  assert.ok(existsSync(join(dist, 'sitemap.xml')), 'Missing sitemap')
  const htmlFiles = files(dist, '.html')
  let checked = 0
  for (const page of htmlFiles) {
    const html = readFileSync(join(dist, page), 'utf8')
    if (page !== '404.html') {
      const expected = `https://flash-tunnel.imba97.dev/${page.replace(/index\.html$/, '')}`
      assert.ok(html.includes(`rel="canonical" href="${expected}"`), `Incorrect canonical: ${page}`)
    }
    for (const [, encoded] of html.matchAll(/(?:href|src)="([^"\s]+)"/g)) {
      const href = encoded.replaceAll('&amp;', '&')
      if (/^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(href)) continue
      const [pathname, hash] = href.split('#')
      const clean = decodeURIComponent(pathname.split('?')[0])
      let target = clean.startsWith('/') ? join(dist, clean.slice(1)) : resolve(dirname(join(dist, page)), clean || page.split('/').at(-1))
      if (clean.endsWith('/')) target = join(target, 'index.html')
      assert.ok(existsSync(target), `Broken generated link in ${page}: ${href}`)
      if (hash && target.endsWith('.html')) {
        const id = decodeURIComponent(hash)
        assert.ok(readFileSync(target, 'utf8').includes(`id="${id}"`), `Broken anchor in ${page}: ${href}`)
      }
      checked++
    }
  }
  console.log(`Validated ${htmlFiles.length} HTML pages and ${checked} local links/assets/anchors.`)
}
