<script setup lang="ts">
import { computed, onUnmounted, ref } from 'vue'
import { useData } from 'vitepress'

const { lang } = useData()
const zh = computed(() => lang.value.startsWith('zh'))
const copied = ref(false)
const failed = ref(false)
let timer: ReturnType<typeof setTimeout> | undefined
const command = 'npx flash-tunnel --mode quick'
async function copy() {
  try {
    await navigator.clipboard.writeText(command)
    copied.value = true
    failed.value = false
  } catch {
    failed.value = true
  }
  clearTimeout(timer)
  timer = setTimeout(() => { copied.value = false; failed.value = false }, 2500)
}
onUnmounted(() => clearTimeout(timer))
</script>

<template>
  <div class="terminal-wrap">
    <div class="terminal" :aria-label="zh ? '命令运行示例' : 'Example terminal session'">
      <div class="terminal-bar">
        <span class="terminal-dots" aria-hidden="true"><i /><i /><i /></span>
        <span>~/your-next-idea</span>
        <span class="terminal-shell">zsh</span>
      </div>
      <div class="terminal-body">
        <div class="terminal-command"><span class="prompt" aria-hidden="true">$</span><code>{{ command }}</code></div>
        <div class="terminal-spacer" />
        <div><span class="terminal-check">✓</span> <span class="terminal-muted">detect</span> <span>Vite · pnpm · :5173</span></div>
        <div><span class="terminal-check">✓</span> <span class="terminal-muted">local</span> <span>http://localhost:5173</span></div>
        <div><span class="terminal-check">✓</span> <span class="terminal-muted">tunnel</span> <span>Cloudflare · quick</span></div>
        <div class="terminal-spacer" />
        <div class="terminal-public"><span class="terminal-status" />https://your-preview.trycloudflare.com</div>
        <div class="terminal-hint">{{ zh ? '复制链接。分享想法。Ctrl+C 自动清理。' : 'Copy the link. Share the idea. Ctrl+C to clean up.' }}</div>
      </div>
      <div class="terminal-bottom">
        <span>{{ zh ? '无需 Token · 无需配置文件' : 'No token. No config file.' }}</span>
        <button type="button" @click="copy">{{ copied ? (zh ? '已复制' : 'Copied!') : (zh ? '复制命令' : 'Copy command') }}</button>
      </div>
    </div>
    <p class="terminal-caption" role="status" aria-live="polite">{{ failed ? (zh ? '复制失败，请手动选择上方命令。' : 'Select the command above to copy it manually.') : (zh ? '示例输出 · 每次运行都会生成新的临时地址' : 'Illustrative output · a new temporary URL on every run') }}</p>
  </div>
</template>
