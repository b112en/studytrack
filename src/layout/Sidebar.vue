<template>
  <div class="h-full min-h-screen flex flex-col bg-slate-900">
    <div class="px-4 py-6 border-b border-slate-800">
      <div class="flex items-center gap-3">
        <div class="h-10 w-10 flex items-center justify-center rounded-xl bg-indigo-500 text-lg font-bold text-white">
          S
        </div>
        <div>
          <div class="text-lg font-semibold text-white">StudyTrack</div>
          <div class="text-xs text-slate-400">Academic progress hub</div>
        </div>
      </div>
    </div>

    <nav class="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
      <template v-for="(item, index) in visibleNav" :key="index">
        <router-link
          :to="item.to"
          class="group flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all duration-150"
          :class="navLinkClasses(item)"
          @click="$emit('close')"
        >
          <span class="h-5 w-5">{{ item.icon }}</span>
          <span class="truncate">{{ item.label }}</span>
        </router-link>
      </template>
    </nav>

    <div class="border-t border-slate-800 px-4 py-4">
      <div class="flex items-center gap-3">
        <div class="h-10 w-10 flex items-center justify-center rounded-full bg-indigo-500 text-sm font-semibold text-white">
          {{ userInitial }}
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-semibold text-white truncate">{{ currentUser?.fullName ?? 'Guest' }}</p>
          <p
            class="text-xs font-semibold"
            :class="{
              'text-indigo-200': userRole === 'Student',
              'text-purple-200': userRole === 'Admin',
              'text-slate-400': !userRole,
            }"
          >
            <span
              class="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold"
              :class="{
                'bg-indigo-500/20 text-indigo-100': userRole === 'Student',
                'bg-purple-500/20 text-purple-100': userRole === 'Admin',
              }"
            >
              {{ userRole || 'Guest' }}
            </span>
          </p>
        </div>
      </div>

      <button
        type="button"
        class="mt-3 flex w-full items-center justify-center gap-2 rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
        @click="logout"
      >
        <span>Logout</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '../stores/authStore'

const auth = useAuthStore()
const route = useRoute()

const currentUser = computed(() => auth.currentUser)
const userRole = computed(() => auth.userRole)
const userInitial = computed(() => auth.userInitial)

const navItems = [
  { label: 'Dashboard', to: '/dashboard', icon: '🏠' },
  { label: 'Tasks', to: '/tasks', icon: '✅' },
  { label: 'Subjects', to: '/subjects', icon: '📚' },
  { label: 'Progress', to: '/progress', icon: '📊' },
  { label: 'Settings', to: '/settings', icon: '⚙️' },
  { label: 'Users', to: '/users', icon: '👥', roles: ['Admin'] },
  { label: 'System Overview', to: '/overview', icon: '🖥️', roles: ['Admin'] },
]

const visibleNav = computed(() => {
  const role = userRole.value
  return navItems.filter((item) => {
    if (!item.roles) return true
    return item.roles.includes(role)
  })
})

function navLinkClasses(item) {
  const isActive = route.path === item.to
  return {
    'bg-indigo-500/20 text-indigo-300 border-l-2 border-indigo-400': isActive,
    'text-slate-200 hover:bg-white/5': !isActive,
  }
}

function logout() {
  auth.logout()
}
</script>
