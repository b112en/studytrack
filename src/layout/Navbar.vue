<template>
  <div class="h-full px-4 flex items-center justify-between">
    <div class="flex items-center gap-3">
      <button
        type="button"
        class="p-2 rounded-md hover:bg-slate-800 md:hidden"
        @click="$emit('toggle-sidebar')"
        aria-label="Toggle sidebar"
      >
        <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      <h1 class="text-lg font-semibold tracking-wide">{{ pageTitle }}</h1>
    </div>

    <div class="flex items-center gap-4">
      <div class="relative">
        <input
          v-model="search"
          type="text"
          placeholder="Search..."
          class="w-32 md:w-44 transition-all duration-200 ease-in-out rounded-full bg-white/5 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-400 focus:w-64 focus:outline-none"
        />
      </div>

      <button
        type="button"
        class="relative p-2 rounded-full hover:bg-slate-800"
        aria-label="Notifications"
      >
        <span class="text-lg">🔔</span>
        <span
          v-if="notifications > 0"
          class="absolute -top-1 -right-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-semibold text-white"
        >
          {{ notifications > 9 ? '9+' : notifications }}
        </span>
      </button>

      <div class="relative" ref="dropdownRef">
        <button
          type="button"
          class="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-500 text-sm font-semibold text-white hover:bg-indigo-400"
          @click="toggleDropdown"
          aria-label="User menu"
        >
          {{ userInitial }}
        </button>

        <transition name="fade">
          <div
            v-if="isDropdownOpen"
            class="absolute right-0 mt-2 w-52 rounded-xl border border-white/10 bg-slate-950 p-3 shadow-lg"
          >
            <div class="space-y-0.5">
              <p class="text-sm font-semibold text-white">{{ currentUser?.fullName ?? 'User' }}</p>
              <p class="text-xs text-slate-400">{{ currentUser?.role ?? '' }}</p>
            </div>

            <div class="my-2 h-px bg-white/5"></div>

            <button
              type="button"
              class="w-full rounded-md px-3 py-2 text-left text-sm text-slate-100 hover:bg-white/5"
              @click="goToProfile"
            >
              Profile
            </button>

            <button
              type="button"
              class="w-full rounded-md px-3 py-2 text-left text-sm text-slate-100 hover:bg-white/5"
              @click="logout"
            >
              Logout
            </button>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../stores/authStore'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()

const currentUser = computed(() => auth.currentUser)
const userInitial = computed(() => auth.userInitial)

const pageTitle = computed(() => {
  const name = route.name ? String(route.name) : ''
  return name ? name.charAt(0).toUpperCase() + name.slice(1) : 'StudyTrack'
})

const search = ref('')

const notifications = ref(0)

const isDropdownOpen = ref(false)
const dropdownRef = ref(null)

function toggleDropdown() {
  isDropdownOpen.value = !isDropdownOpen.value
}

function closeDropdown() {
  isDropdownOpen.value = false
}

function handleClickOutside(event) {
  if (!dropdownRef.value) return
  if (!dropdownRef.value.contains(event.target)) {
    closeDropdown()
  }
}

function goToProfile() {
  closeDropdown()
  router.push({ name: 'settings' })
}

function logout() {
  closeDropdown()
  auth.logout()
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
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
