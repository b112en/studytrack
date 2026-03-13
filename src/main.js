import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import App from './App.vue'
import './style.css'

const app = createApp(App)
app.use(createPinia())

// Ensure theme state is initialized before mount
import { useThemeStore } from './stores/themeStore'
const themeStore = useThemeStore()
if (themeStore.theme) {
  themeStore.setTheme(themeStore.theme)
}

app.use(router)
app.mount('#app')
