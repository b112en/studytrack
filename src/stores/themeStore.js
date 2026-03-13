import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

const STORAGE_KEY = 'studytrack-theme'

function applyTheme(theme) {
  const root = document.documentElement
  root.classList.toggle('light', theme === 'light')
  root.classList.toggle('dark', theme === 'dark')

  if (theme === 'light') {
    root.style.colorScheme = 'light'
  } else {
    root.style.colorScheme = 'dark'
  }
}

export const useThemeStore = defineStore('theme', () => {
  const theme = ref(localStorage.getItem(STORAGE_KEY) || 'dark')

  function setTheme(value) {
    theme.value = value === 'light' ? 'light' : 'dark'
  }

  function toggleTheme() {
    theme.value = theme.value === 'dark' ? 'light' : 'dark'
  }

  watch(theme, (value) => {
    localStorage.setItem(STORAGE_KEY, value)
    applyTheme(value)
  }, { immediate: true })

  return {
    theme,
    setTheme,
    toggleTheme,
  }
})
