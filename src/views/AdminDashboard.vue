<template>
  <div class="p-6">
    <!-- Header -->
    <header class="mb-6">
      <h1 class="text-3xl font-semibold text-white">Welcome back, {{ currentUser?.fullName ?? 'Admin' }}</h1>
      <p class="mt-2 text-sm text-slate-300">Here is your system overview</p>
    </header>

    <!-- Stats cards -->
    <section class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <div class="rounded-xl border card-theme p-6 shadow-sm">
        <div class="flex items-center justify-between">
          <div class="text-3xl">👥</div>
          <span class="text-xs font-semibold uppercase tracking-wide text-slate-400">Total Users</span>
        </div>
        <div class="mt-4 text-3xl font-bold text-purple-200">{{ totalUsers }}</div>
      </div>

      <div class="rounded-xl border card-theme p-6 shadow-sm">
        <div class="flex items-center justify-between">
          <div class="text-3xl">📋</div>
          <span class="text-xs font-semibold uppercase tracking-wide text-slate-400">Total Tasks</span>
        </div>
        <div class="mt-4 text-3xl font-bold text-sky-200">{{ totalTasks }}</div>
      </div>

      <div class="rounded-xl border card-theme p-6 shadow-sm">
        <div class="flex items-center justify-between">
          <div class="text-3xl">🎓</div>
          <span class="text-xs font-semibold uppercase tracking-wide text-slate-400">Active Students</span>
        </div>
        <div class="mt-4 text-3xl font-bold text-emerald-200">{{ activeStudents }}</div>
      </div>

      <div class="rounded-xl border card-theme p-6 shadow-sm">
        <div class="flex items-center justify-between">
          <div class="text-3xl">📊</div>
          <span class="text-xs font-semibold uppercase tracking-wide text-slate-400">Completed Today</span>
        </div>
        <div class="mt-4 text-3xl font-bold text-amber-200">{{ tasksCompletedToday }}</div>
      </div>
    </section>

    <!-- Users Table + Recent activity -->
    <section class="mt-8 grid gap-6 lg:grid-cols-2">
      <div class="rounded-xl border card-theme p-6 shadow-sm">
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-semibold text-white">Users</h2>
          <span class="text-sm text-slate-400">{{ users.length }} total</span>
        </div>

        <div class="mt-4 overflow-x-auto">
          <table class="w-full text-left text-sm">
            <thead>
              <tr class="text-xs uppercase tracking-wide text-slate-400">
                <th class="py-2">Name</th>
                <th class="py-2">Email</th>
                <th class="py-2">Role</th>
                <th class="py-2">Joined</th>
                <th class="py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="user in users"
                :key="user.id"
                class="border-t border-white/10 hover:bg-white/5"
              >
                <td class="py-2">{{ user.fullName }}</td>
                <td class="py-2 text-slate-300">{{ user.email }}</td>
                <td class="py-2">
                  <span
                    class="inline-flex rounded-full px-2 py-1 text-[11px] font-semibold"
                    :class="
                      user.role === 'Admin'
                        ? 'bg-purple-500/20 text-purple-100'
                        : 'bg-sky-500/20 text-sky-100'
                    "
                  >
                    {{ user.role }}
                  </span>
                </td>
                <td class="py-2 text-slate-300">{{ user.joined }}</td>
                <td class="py-2">
                  <div class="flex gap-2">
                    <button
                      type="button"
                      class="rounded-md bg-white/5 px-3 py-1 text-xs font-semibold text-white hover:bg-white/10"
                      @click="viewUser(user)"
                    >
                      View
                    </button>
                    <button
                      type="button"
                      class="rounded-md bg-red-500/20 px-3 py-1 text-xs font-semibold text-red-100 hover:bg-red-500/30"
                      @click="confirmRemoveUser(user.id)"
                    >
                      Remove
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="rounded-xl border card-theme p-6 shadow-sm">
        <h2 class="text-xl font-semibold text-white">Recent System Activity</h2>
        <ul class="mt-4 space-y-3">
          <li
            v-for="(activity, index) in recentActivities"
            :key="index"
            class="flex items-start gap-3 rounded-lg bg-white/5 p-4"
          >
            <span class="mt-1 text-lg">•</span>
            <div class="flex-1 text-sm">
              <p class="text-white">{{ activity.message }}</p>
              <p class="text-xs text-slate-400">{{ activity.time }}</p>
            </div>
          </li>
        </ul>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useAuthStore } from '../stores/authStore'
import { useUserStore } from '../stores/userStore'
import { useTaskStore } from '../stores/taskStore'

const auth = useAuthStore()
const userStore = useUserStore()
const taskStore = useTaskStore()

const currentUser = computed(() => auth.currentUser)
const users = computed(() => userStore.users)
const totalUsers = computed(() => userStore.totalUsers)
const activeStudents = computed(() => userStore.activeStudents)
const totalTasks = computed(() => taskStore.totalTasks)
const tasksCompletedToday = computed(() => taskStore.tasksCompletedToday)

const recentActivities = computed(() => {
  const completed = taskStore.tasks
    .filter((t) => t.status === 'Completed')
    .slice(-5)
    .reverse()

  return completed.map((t) => ({
    message: `${t.title} marked complete`,
    time: t.completedAt || 'Recently',
  }))
})

function confirmRemoveUser(id) {
  if (window.confirm('Remove this user?')) {
    userStore.removeUser(id)
  }
}

function viewUser(user) {
  // Placeholder: could open a modal or route to detail view
  window.alert(`${user.fullName} (${user.email})`)
}
</script>
