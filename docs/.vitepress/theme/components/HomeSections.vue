<script setup lang="ts">
import { computed } from 'vue'
import { useData } from 'vitepress'
const { lang } = useData()
const zh = computed(() => lang.value.startsWith('zh'))
const prefix = computed(() => zh.value ? '/zh' : '')
const steps = computed(() => zh.value ? [
  ['识别项目', '找到框架、启动脚本和端口。'],
  ['启动隧道', '连接本地服务，等待公网验证。'],
  ['分享链接', '让同事和客户直接打开预览。'],
  ['退出清理', '回收 DNS、隧道和子进程。']
] : [
  ['Detect', 'Find the framework, script, and port.'],
  ['Connect', 'Start the tunnel. Verify the public URL.'],
  ['Share', 'Let teammates open your preview.'],
  ['Clean up', 'Remove DNS, tunnel, and child processes.']
])
</script>

<template>
  <div class="home-sections">
    <section class="workflow-section" aria-labelledby="workflow-title">
      <p class="eyebrow">{{ zh ? '从开发到分享' : 'FROM YOUR TERMINAL TO THEIR BROWSER' }}</p>
      <h2 id="workflow-title">{{ zh ? '整个流程，一条命令。' : 'The whole workflow. One command.' }}</h2>
      <div class="workflow-grid">
        <div v-for="(step, i) in steps" :key="i" class="workflow-step">
          <span class="step-number">0{{ i + 1 }}</span>
          <h3>{{ step[0] }}</h3><p>{{ step[1] }}</p>
        </div>
      </div>
    </section>
    <section class="paths-section" aria-labelledby="paths-title">
      <div class="paths-heading"><p class="eyebrow">{{ zh ? '选择适合你的方式' : 'PICK YOUR PATH' }}</p><h2 id="paths-title">{{ zh ? '临时演示，还是自有域名？' : 'A quick demo or your own domain?' }}</h2><p>{{ zh ? '同一套工作流，按需选择。' : 'The same workflow, on your terms.' }}</p></div>
      <a class="path-card" :href="`${prefix}/guide/quick-start.html`"><span class="path-tag">QUICK</span><h3>{{ zh ? '现在就分享' : 'Share something now' }}</h3><p>{{ zh ? '无需账号或 Token，拿到临时公网链接，适合演示和联调。' : 'A temporary public URL without an account or token. Great for demos and collaboration.' }}</p><span class="path-link">{{ zh ? '快速开始' : 'Get started' }} <span aria-hidden="true">↗</span></span></a>
      <a class="path-card" :href="`${prefix}/guide/custom-domains.html`"><span class="path-tag">NAMED</span><h3>{{ zh ? '用上你的域名' : 'Make it your domain' }}</h3><p>{{ zh ? '连接 Cloudflare 账号，自动创建隧道与 DNS，预览地址更有辨识度。' : 'Connect your Cloudflare account. Create a tunnel and DNS record with a recognizable preview URL.' }}</p><span class="path-link">{{ zh ? '配置自定义域名' : 'Set up a custom domain' }} <span aria-hidden="true">↗</span></span></a>
    </section>
    <div class="home-note"><span class="preview-badge">EARLY PREVIEW</span><p>{{ zh ? 'flash-tunnel 仍处于 0.0.x 早期阶段，接口和行为可能调整。遇到问题，欢迎一起改进。' : 'flash-tunnel is in early preview (0.0.x). APIs and behavior may change. Help us shape what comes next.' }} <a href="https://github.com/flash-tunnel/flash-tunnel/issues">{{ zh ? '提交反馈' : 'Share feedback' }} <span aria-hidden="true">↗</span></a></p></div>
  </div>
</template>
