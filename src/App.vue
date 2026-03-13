<template>
  <div
    :class="[
      'min-h-screen transition-colors duration-300',
      theme === 'dark' ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100' : 'bg-gradient-to-br from-slate-100 via-slate-50 to-white text-slate-900',
    ]
  "
  >
    <router-view />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useThemeStore } from './stores/themeStore'

const themeStore = useThemeStore()
const theme = computed(() => themeStore.theme)
</script>

<style>
html,
body,
#app {
  height: 100%;
}

:root {
  --card-bg: rgba(15, 23, 42, 0.4);
  --card-border: rgba(148, 163, 184, 0.2);
}

html.light {
  --card-bg: rgba(255, 255, 255, 0.8);
  --card-border: rgba(148, 163, 184, 0.25);
}

.card-theme {
  background-color: var(--card-bg);
  border-color: var(--card-border);
}
</style>
