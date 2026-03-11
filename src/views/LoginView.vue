<template>
  <div class="min-h-screen flex items-center justify-center px-4 py-12">
    <div class="w-full max-w-md bg-white/10 backdrop-blur rounded-xl shadow-lg border border-white/10 p-8 fade-in">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-semibold text-white">StudyTrack</h1>
        <p class="mt-2 text-sm text-slate-200">Sign in to continue to your dashboard</p>
      </div>

      <form @submit.prevent="onSubmit" class="space-y-5">
        <div>
          <label for="email" class="block text-sm font-medium text-slate-100">Email</label>
          <input
            id="email"
            v-model="email"
            @blur="touch('email')"
            type="email"
            autocomplete="email"
            :aria-invalid="!!errors.email"
            :aria-describedby="errors.email ? 'email-error' : undefined"
            class="mt-1 w-full rounded-lg border border-white/20 bg-white/5 px-4 py-2 text-white placeholder:text-slate-400 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            required
          />
          <p v-if="errors.email" id="email-error" class="mt-2 text-sm text-rose-300">{{ errors.email }}</p>
        </div>

        <div>
          <label for="password" class="block text-sm font-medium text-slate-100">Password</label>
          <div class="relative mt-1">
            <input
              id="password"
              v-model="password"
              @blur="touch('password')"
              :type="showPassword ? 'text' : 'password'"
              autocomplete="current-password"
              :aria-invalid="!!errors.password"
              :aria-describedby="errors.password ? 'password-error' : undefined"
              class="w-full rounded-lg border border-white/20 bg-white/5 px-4 py-2 pr-12 text-white placeholder:text-slate-400 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              required
            />
            <button
              type="button"
              @click="showPassword = !showPassword"
              class="absolute inset-y-0 right-2 flex items-center rounded px-2 text-sm text-slate-200 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              :aria-label="showPassword ? 'Hide password' : 'Show password'"
            >
              {{ showPassword ? 'Hide' : 'Show' }}
            </button>
          </div>
          <p v-if="errors.password" id="password-error" class="mt-2 text-sm text-rose-300">{{ errors.password }}</p>
        </div>

        <div class="mt-4">
          <button
            type="submit"
            :disabled="isSubmitting"
            class="w-full inline-flex items-center justify-center rounded-lg bg-indigo-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-300 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <span v-if="isSubmitting" class="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"></span>
            Sign In
          </button>
          <p v-if="submitError" class="mt-3 text-center text-sm text-rose-200">{{ submitError }}</p>
        </div>
      </form>

      <p class="mt-6 text-center text-sm text-slate-200">
        Don't have an account?
        <router-link class="font-semibold text-indigo-200 hover:text-white" to="/register">Register</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/authStore'

const router = useRouter()
const auth = useAuthStore()

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const isSubmitting = ref(false)
const submitError = ref('')

const touched = ref({ email: false, password: false })

const errors = ref({ email: '', password: '' })

const touch = (field) => {
  touched.value[field] = true
  validateField(field)
}

const validateField = (field) => {
  const value = field === 'email' ? email.value.trim() : password.value

  if (field === 'email') {
    if (!value) {
      errors.value.email = 'Email is required.'
      return
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    errors.value.email = emailRegex.test(value) ? '' : 'Please enter a valid email.'
    return
  }

  if (field === 'password') {
    if (!value) {
      errors.value.password = 'Password is required.'
      return
    }
    errors.value.password = value.length >= 6 ? '' : 'Password must be at least 6 characters.'
    return
  }
}

const validateForm = () => {
  touch('email')
  touch('password')
  return !errors.value.email && !errors.value.password
}

const onSubmit = async () => {
  submitError.value = ''

  if (!validateForm()) return

  isSubmitting.value = true
  try {
    await auth.login(email.value, password.value)
    // router push is handled by store, but ensure we land on dashboard
    if (router.currentRoute.value.name !== 'dashboard') {
      await router.push({ name: 'dashboard' })
    }
  } catch (err) {
    submitError.value = err.message || 'Login failed. Please try again.'
  } finally {
    isSubmitting.value = false
  }
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
