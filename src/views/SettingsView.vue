<template>
  <div class="p-6 space-y-6">
    <header>
      <h1 class="text-2xl font-semibold text-white">Settings</h1>
      <p class="mt-1 text-sm text-slate-300">Manage your account preferences</p>
    </header>

    <!-- Profile Settings -->
    <section class="rounded-xl border border-white/10 bg-white/5 p-6 shadow-sm">
      <h2 class="text-lg font-semibold text-white">Profile</h2>
      <div class="mt-4 grid gap-6 lg:grid-cols-2">
        <div class="flex flex-col items-center gap-4 rounded-xl border border-white/10 bg-white/5 p-6">
          <div class="flex h-20 w-20 items-center justify-center rounded-full bg-indigo-500 text-3xl font-semibold text-white">
            {{ userInitial }}
          </div>
          <div class="text-center">
            <div class="text-sm font-semibold text-white">{{ currentUser?.fullName }}</div>
            <div class="text-xs text-slate-400">{{ currentUser?.email }}</div>
          </div>
        </div>

        <form @submit.prevent="saveProfile" class="space-y-4">
          <div>
            <label class="text-sm font-semibold text-white">Full Name</label>
            <input
              v-model="profileForm.fullName"
              type="text"
              class="mt-1 w-full rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-white outline-none focus:border-indigo-400"
            />
          </div>

          <div>
            <label class="text-sm font-semibold text-white">Email</label>
            <input
              v-model="profileForm.email"
              type="email"
              class="mt-1 w-full rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-white outline-none focus:border-indigo-400"
            />
          </div>

          <div>
            <label class="text-sm font-semibold text-white">Role</label>
            <div class="mt-1 inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-slate-200">
              {{ currentUser?.role }}
            </div>
          </div>

          <div class="flex justify-end">
            <button
              type="submit"
              class="rounded-lg bg-indigo-500 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-400"
            >
              Update Profile
            </button>
          </div>
        </form>
      </div>
    </section>

    <!-- Change Password -->
    <section class="rounded-xl border border-white/10 bg-white/5 p-6 shadow-sm">
      <h2 class="text-lg font-semibold text-white">Change Password</h2>
      <form @submit.prevent="savePassword" class="mt-4 space-y-4">
        <div>
          <label class="text-sm font-semibold text-white">Current Password</label>
          <div class="relative mt-1">
            <input
              v-model="passwordForm.current"
              :type="showCurrent ? 'text' : 'password'"
              class="w-full rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-white outline-none focus:border-indigo-400"
            />
            <button
              type="button"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-300"
              @click="showCurrent = !showCurrent"
            >
              {{ showCurrent ? 'Hide' : 'Show' }}
            </button>
          </div>
        </div>

        <div>
          <label class="text-sm font-semibold text-white">New Password</label>
          <div class="relative mt-1">
            <input
              v-model="passwordForm.new"
              :type="showNew ? 'text' : 'password'"
              class="w-full rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-white outline-none focus:border-indigo-400"
            />
            <button
              type="button"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-300"
              @click="showNew = !showNew"
            >
              {{ showNew ? 'Hide' : 'Show' }}
            </button>
          </div>
          <p class="mt-1 text-xs text-slate-400">Password must be at least 6 characters and include a number.</p>
        </div>

        <div>
          <label class="text-sm font-semibold text-white">Confirm New Password</label>
          <div class="relative mt-1">
            <input
              v-model="passwordForm.confirm"
              :type="showConfirm ? 'text' : 'password'"
              class="w-full rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-white outline-none focus:border-indigo-400"
            />
            <button
              type="button"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-300"
              @click="showConfirm = !showConfirm"
            >
              {{ showConfirm ? 'Hide' : 'Show' }}
            </button>
          </div>
        </div>

        <div class="flex justify-end">
          <button
            type="submit"
            class="rounded-lg bg-indigo-500 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-400"
          >
            Update Password
          </button>
        </div>
      </form>
    </section>

    <!-- Preferences -->
    <section class="rounded-xl border border-white/10 bg-white/5 p-6 shadow-sm">
      <h2 class="text-lg font-semibold text-white">Preferences</h2>
      <form @submit.prevent="savePreferences" class="mt-4 space-y-4">
        <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p class="text-sm font-semibold text-white">Theme</p>
            <p class="text-xs text-slate-400">Toggle between light and dark mode (visual only).</p>
          </div>
          <div class="flex items-center gap-3">
            <span class="text-sm text-slate-200">Light</span>
            <button
              type="button"
              class="relative inline-flex h-6 w-12 items-center rounded-full bg-white/10 p-1"
              @click="themeStore.toggleTheme()"
            >
              <span
                class="h-4 w-4 rounded-full bg-indigo-500 transition-transform"
                :class="theme === 'dark' ? 'translate-x-6' : 'translate-x-0'"
              />
            </button>
            <span class="text-sm text-slate-200">Dark</span>
          </div>
          <p class="mt-1 text-xs text-slate-300">Current theme: <strong class="text-indigo-300">{{ theme }}</strong></p>
        </div>

        <div class="grid gap-3 md:grid-cols-3">
          <label class="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-3">
            <input
              type="checkbox"
              v-model="preferences.emailNotifications"
              class="h-4 w-4 text-indigo-500"
            />
            <span class="text-sm text-white">Email notifications</span>
          </label>
          <label class="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-3">
            <input
              type="checkbox"
              v-model="preferences.deadlineReminders"
              class="h-4 w-4 text-indigo-500"
            />
            <span class="text-sm text-white">Deadline reminders</span>
          </label>
          <label class="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-3">
            <input
              type="checkbox"
              v-model="preferences.weeklySummary"
              class="h-4 w-4 text-indigo-500"
            />
            <span class="text-sm text-white">Weekly summary</span>
          </label>
        </div>

        <div class="flex justify-end">
          <button
            type="submit"
            class="rounded-lg bg-indigo-500 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-400"
          >
            Save Preferences
          </button>
        </div>
      </form>
    </section>

    <!-- Danger zone -->
    <section class="rounded-xl border border-red-500/30 bg-slate-900/40 p-6">
      <h2 class="text-lg font-semibold text-white">Danger Zone</h2>
      <p class="mt-2 text-sm text-slate-300">Delete your account and all related data.</p>
      <button
        type="button"
        class="mt-4 rounded-lg border border-red-500 bg-red-500/20 px-4 py-2 text-sm font-semibold text-red-100 hover:bg-red-500/30"
        @click="confirmDeleteAccount"
      >
        Delete Account
      </button>
    </section>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useAuthStore } from '../stores/authStore'
import { useThemeStore } from '../stores/themeStore'

const auth = useAuthStore()
const themeStore = useThemeStore()

const currentUser = computed(() => auth.currentUser)
const userInitial = computed(() => auth.userInitial)
const theme = computed(() => themeStore.theme)

const profileForm = ref({
  fullName: currentUser.value?.fullName ?? '',
  email: currentUser.value?.email ?? '',
})

const passwordForm = ref({
  current: '',
  new: '',
  confirm: '',
})

const showCurrent = ref(false)
const showNew = ref(false)
const showConfirm = ref(false)

const preferences = ref({
  emailNotifications: true,
  deadlineReminders: true,
  weeklySummary: true,
})

function saveProfile() {
  if (!currentUser.value) return
  auth.currentUser.fullName = profileForm.value.fullName
  auth.currentUser.email = profileForm.value.email
  window.alert('Profile updated successfully')
}

function savePassword() {
  if (!currentUser.value) return
  if (passwordForm.value.current !== currentUser.value.password) {
    window.alert('Current password is incorrect')
    return
  }
  if (passwordForm.value.new.length < 6 || !/\d/.test(passwordForm.value.new)) {
    window.alert('New password must be at least 6 characters and include a number')
    return
  }
  if (passwordForm.value.new !== passwordForm.value.confirm) {
    window.alert('Password confirmation does not match')
    return
  }
  currentUser.value.password = passwordForm.value.new
  window.alert('Password updated successfully')
  passwordForm.value = { current: '', new: '', confirm: '' }
}

function savePreferences() {
  themeStore.setTheme(theme.value)
  window.alert('Preferences saved — theme updated')
}

function confirmDeleteAccount() {
  if (window.confirm('Delete your account? This cannot be undone.')) {
    auth.logout()
    window.alert('Account deleted. Redirecting to registration.')
  }
}
</script>
