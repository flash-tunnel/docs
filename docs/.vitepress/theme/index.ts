import { h } from 'vue'
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import TerminalPreview from './components/TerminalPreview.vue'
import HomeSections from './components/HomeSections.vue'
import './style.css'

export default {
  extends: DefaultTheme,
  Layout: () => h(DefaultTheme.Layout, null, {
    'home-hero-image': () => h(TerminalPreview),
    'home-features-after': () => h(HomeSections)
  })
} satisfies Theme
