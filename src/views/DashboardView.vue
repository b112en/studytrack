<template>
  <div>
    <AdminDashboard v-if="isAdmin" />

    <div v-else class="min-h-screen flex flex-col items-center justify-center px-4 py-12">
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

          <div class="grid gap-3 sm:grid-cols-2">
            <div class="rounded-xl border card-theme p-4">
              <p class="text-xs uppercase tracking-wide text-slate-400">Task Progress</p>
              <p class="mt-1 text-2xl font-semibold text-white">{{ completedTasks }} / {{ totalTasks }} done</p>
              <div class="mt-2 h-2 w-full rounded-full bg-white/20">
                <div
                  class="h-full rounded-full bg-emerald-400 transition-all"
                  :style="{ width: totalTasks > 0 ? `${Math.round((completedTasks / totalTasks) * 100)}%` : '0%' }"
                ></div>
              </div>
            </div>
            <div class="rounded-xl border card-theme p-4">
              <p class="text-xs uppercase tracking-wide text-slate-400">Study Tip</p>
              <p class="mt-2 text-sm text-slate-200">{{ studyTip }}</p>
            </div>
          </div>

          <button
            @click="logout"
            class="w-full rounded-lg bg-rose-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-300"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useAuthStore } from '../stores/authStore'
import { useTaskStore } from '../stores/taskStore'
import AdminDashboard from './AdminDashboard.vue'

const auth = useAuthStore()
const taskStore = useTaskStore()

const userName = computed(() => auth.currentUser?.fullName ?? 'Member')
const role = computed(() => auth.currentUser?.role ?? 'Student')
const isAdmin = computed(() => role.value === 'Admin')

const totalTasks = computed(() => taskStore.totalTasks)
const completedTasks = computed(() => taskStore.completedTasks)
const studyTips = ['Break complex topics into shorter sessions.', 'Practice with flashcards and self quizzes.', 'Teach someone else what you learned today.', 'Set a realistic goal and take a short walk after each achievement.']
const studyTip = computed(() => studyTips[new Date().getDate() % studyTips.length])

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
