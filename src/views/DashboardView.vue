<template>
  <div class="min-h-screen flex flex-col items-center justify-center px-4 py-12">
    <div class="w-full max-w-xl bg-white/10 backdrop-blur rounded-xl shadow-lg border border-white/10 p-8 fade-in">
      <header class="mb-6 text-center">
        <h1 class="text-3xl font-semibold text-white">Welcome, {{ userName }}</h1>
        <p class="mt-2 text-sm text-slate-200">You are signed in as a <span class="font-medium text-indigo-200">{{ role }}</span>.</p>
      </header>

      <transition name="fade">
        <div v-if="toastVisible" class="mb-4 rounded-lg bg-emerald-500/90 px-4 py-3 text-sm text-white shadow">
          {{ toastMessage }}
        </div>
      </transition>

      <div class="space-y-4">
        <p class="text-sm text-slate-200">
          This is your StudyTrack dashboard. From here you can access features based on your role.
        </p>

        <button
          @click="logout"
          class="w-full rounded-lg bg-rose-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-300"
        >
          Sign Out
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useAuthStore } from '../stores/authStore'

const auth = useAuthStore()

const userName = computed(() => auth.currentUser?.fullName ?? 'Member')
const role = computed(() => auth.currentUser?.role ?? 'Student')

const toastVisible = ref(false)
const toastMessage = ref('')

watch(
  () => auth.flashMessage,
  (value) => {
    if (!value) return
    toastMessage.value = value
    toastVisible.value = true

    window.setTimeout(() => {
      toastVisible.value = false
      auth.setFlashMessage('')
    }, 3200)
  },
  { immediate: true }
)

const logout = async () => {
  await auth.logout()
}
</script>

<style scoped>
.fade-in {
  animation: fadeIn 0.35s ease-out both;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
