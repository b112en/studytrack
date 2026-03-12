<template>
  <div class="min-h-screen flex bg-slate-950 text-slate-100">
    <!-- Desktop sidebar -->
    <aside class="hidden md:block w-64 fixed inset-y-0 left-0 top-0 border-r border-slate-800 bg-slate-950">
      <Sidebar />
    </aside>

    <!-- Mobile sidebar overlay -->
    <transition name="fade">
      <div
        v-if="isSidebarOpen"
        class="fixed inset-0 z-40 md:hidden"
        aria-modal="true"
        role="dialog"
      >
        <div class="absolute inset-0 bg-black/50" @click="closeSidebar" />
        <aside class="relative w-64 h-full bg-slate-950 border-r border-slate-800 shadow-xl">
          <Sidebar @close="closeSidebar" />
        </aside>
      </div>
    </transition>

    <!-- Main content -->
    <div class="flex-1 flex flex-col md:ml-64">
      <header class="fixed top-0 left-0 right-0 md:left-64 h-16 border-b border-white/10 bg-slate-900/95 backdrop-blur">
        <Navbar @toggle-sidebar="toggleSidebar" />
      </header>

      <main class="flex-1 pt-16 overflow-auto bg-slate-950">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import Sidebar from './Sidebar.vue'
import Navbar from './Navbar.vue'

const route = useRoute()
const isSidebarOpen = ref(false)

function toggleSidebar() {
  isSidebarOpen.value = !isSidebarOpen.value
}

function closeSidebar() {
  isSidebarOpen.value = false
}

watch(route, () => {
  // Close mobile sidebar when navigating
  closeSidebar()
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 150ms ease-in-out;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
