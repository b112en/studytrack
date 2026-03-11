<template>
  <div class="min-h-screen flex items-center justify-center px-4 py-12">
    <div class="w-full max-w-md bg-white/10 backdrop-blur rounded-xl shadow-lg border border-white/10 p-8 fade-in">
      <div class="text-center mb-8">
        <div class="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-sky-400 shadow-lg">
          <span class="text-2xl">📘</span>
        </div>
        <h1 class="text-3xl font-semibold text-white">StudyTrack</h1>
        <p class="mt-2 text-sm text-slate-200">Create your account to get started</p>
      </div>

      <form @submit.prevent="onSubmit" class="space-y-5">
        <div>
          <label for="fullName" class="block text-sm font-medium text-slate-100">Full Name</label>
          <input
            id="fullName"
            v-model="fullName"
            @blur="touch('fullName')"
            type="text"
            autocomplete="name"
            :aria-invalid="!!errors.fullName"
            :aria-describedby="errors.fullName ? 'fullName-error' : undefined"
            class="mt-1 w-full rounded-lg border border-white/20 bg-white/5 px-4 py-2 text-white placeholder:text-slate-400 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            required
          />
          <p v-if="errors.fullName" id="fullName-error" class="mt-2 text-sm text-rose-300">{{ errors.fullName }}</p>
        </div>

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
              autocomplete="new-password"
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

          <div class="mt-3">
            <div class="h-2 w-full overflow-hidden rounded-full bg-white/10">
              <div
                class="h-full transition-all"
                :class="passwordStrength.class"
                :style="{ width: passwordStrength.width }"
              />
            </div>
            <p class="mt-1 text-xs font-medium text-slate-200">Strength: <span :class="passwordStrength.classText">{{ passwordStrength.label }}</span></p>
          </div>
        </div>

        <div>
          <label for="confirmPassword" class="block text-sm font-medium text-slate-100">Confirm Password</label>
          <div class="relative mt-1">
            <input
              id="confirmPassword"
              v-model="confirmPassword"
              @blur="touch('confirmPassword')"
              :type="showConfirmPassword ? 'text' : 'password'"
              autocomplete="new-password"
              :aria-invalid="!!errors.confirmPassword"
              :aria-describedby="errors.confirmPassword ? 'confirmPassword-error' : undefined"
              class="w-full rounded-lg border border-white/20 bg-white/5 px-4 py-2 pr-12 text-white placeholder:text-slate-400 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              required
            />
            <button
              type="button"
              @click="showConfirmPassword = !showConfirmPassword"
              class="absolute inset-y-0 right-2 flex items-center rounded px-2 text-sm text-slate-200 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              :aria-label="showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'"
            >
              {{ showConfirmPassword ? 'Hide' : 'Show' }}
            </button>
          </div>
          <p v-if="errors.confirmPassword" id="confirmPassword-error" class="mt-2 text-sm text-rose-300">{{ errors.confirmPassword }}</p>
        </div>

        <div class="relative" @focusout="onRoleFocusOut">
          <label class="block text-sm font-medium text-slate-100">Role</label>

          <button
            type="button"
            @click="toggleRoleMenu"
            :aria-expanded="roleMenuOpen"
            :aria-invalid="!!errors.role"
            :aria-describedby="errors.role ? 'role-error' : undefined"
            class="mt-1 w-full flex items-center justify-between rounded-lg border border-white/20 bg-white/5 px-4 py-2 text-left text-white shadow-sm transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            <span class="flex items-center gap-2">
              <span
                v-if="role"
                class="inline-flex items-center gap-2 rounded-full px-2 py-0.5 text-xs font-semibold text-white"
                :class="role === 'Admin' ? 'bg-purple-500/70' : 'bg-sky-500/70'"
              >
                <span class="h-2 w-2 rounded-full" :class="role === 'Admin' ? 'bg-purple-300' : 'bg-sky-300'"></span>
                {{ role }}
              </span>
              <span v-else class="text-slate-400">Select role</span>
            </span>

            <span class="text-slate-200">▾</span>
          </button>

          <transition name="fade">
            <ul
              v-if="roleMenuOpen"
              role="listbox"
              class="absolute z-20 mt-1 w-full overflow-hidden rounded-lg border border-white/15 bg-slate-950/80 shadow-lg backdrop-blur"
            >
              <li
                v-for="option in roleOptions"
                :key="option.value"
                @click="selectRole(option.value)"
                @keydown.enter.prevent="selectRole(option.value)"
                tabindex="0"
                class="flex items-center justify-between gap-2 px-4 py-2 text-sm text-white transition hover:bg-white/10 focus:bg-white/10 focus:outline-none"
              >
                <span class="flex items-center gap-2">
                  <span class="h-2 w-2 rounded-full" :class="option.color"></span>
                  {{ option.label }}
                </span>
                <span v-if="role === option.value" class="text-indigo-200">✓</span>
              </li>
            </ul>
          </transition>

          <p v-if="errors.role" id="role-error" class="mt-2 text-sm text-rose-300">{{ errors.role }}</p>
        </div>

        <div>
          <button
            type="submit"
            :disabled="isSubmitting"
            class="w-full inline-flex items-center justify-center rounded-lg bg-indigo-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-300 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <span v-if="isSubmitting" class="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"></span>
            Create Account
          </button>
          <p v-if="submitError" class="mt-3 text-center text-sm text-rose-200">{{ submitError }}</p>
        </div>
      </form>

      <p class="mt-6 text-center text-sm text-slate-200">
        Already have an account?
        <router-link class="font-semibold text-indigo-200 hover:text-white" to="/login">Sign In</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useAuthStore } from '../stores/authStore'

const auth = useAuthStore()

const fullName = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const role = ref('')

const showPassword = ref(false)
const showConfirmPassword = ref(false)

const isSubmitting = ref(false)
const submitError = ref('')

const roleOptions = [{ label: 'Student', value: 'Student', color: 'bg-sky-300' }, { label: 'Admin', value: 'Admin', color: 'bg-purple-300' }]
const roleMenuOpen = ref(false)

const touched = ref({ fullName: false, email: false, password: false, confirmPassword: false, role: false })
const errors = ref({ fullName: '', email: '', password: '', confirmPassword: '', role: '' })

const passwordStrength = computed(() => {
  if (!password.value) {
    return { label: 'Weak', width: '0%', class: 'bg-rose-400', classText: 'text-rose-200' }
  }

  const hasNumber = /\d/.test(password.value)
  const hasSpecial = /[^A-Za-z0-9]/.test(password.value)

  if (password.value.length < 6) {
    return { label: 'Weak', width: '25%', class: 'bg-rose-400', classText: 'text-rose-200' }
  }

  if (password.value.length >= 6 && (!hasNumber || !hasSpecial)) {
    return { label: 'Fair', width: '60%', class: 'bg-amber-400', classText: 'text-amber-200' }
  }

  return { label: 'Strong', width: '100%', class: 'bg-emerald-400', classText: 'text-emerald-200' }
})

const touch = (field) => {
  touched.value[field] = true
  validateField(field)
}

const toggleRoleMenu = () => {
  roleMenuOpen.value = !roleMenuOpen.value
  if (!roleMenuOpen.value) {
    touch('role')
  }
}

const selectRole = (value) => {
  role.value = value
  roleMenuOpen.value = false
  touch('role')
}

const onRoleFocusOut = (event) => {
  if (!event.currentTarget.contains(event.relatedTarget)) {
    roleMenuOpen.value = false
    touch('role')
  }
}

const validateField = (field) => {
  if (field === 'fullName') {
    if (!fullName.value.trim()) {
      errors.value.fullName = 'Full name is required.'
      return
    }
    errors.value.fullName = fullName.value.trim().length >= 2 ? '' : 'Full name must be at least 2 characters.'
    return
  }

  if (field === 'email') {
    if (!email.value.trim()) {
      errors.value.email = 'Email is required.'
      return
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    errors.value.email = emailRegex.test(email.value.trim()) ? '' : 'Please enter a valid email.'
    return
  }

  if (field === 'password') {
    if (!password.value) {
      errors.value.password = 'Password is required.'
      return
    }
    if (password.value.length < 6) {
      errors.value.password = 'Password must be at least 6 characters.'
      return
    }
    if (!/\d/.test(password.value)) {
      errors.value.password = 'Password must contain at least one number.'
      return
    }

    errors.value.password = ''
    return
  }

  if (field === 'confirmPassword') {
    if (!confirmPassword.value) {
      errors.value.confirmPassword = 'Please confirm your password.'
      return
    }
    errors.value.confirmPassword = confirmPassword.value === password.value ? '' : 'Passwords do not match.'
    return
  }

  if (field === 'role') {
    errors.value.role = role.value ? '' : 'Please select a role.'
    return
  }
}

watch([fullName, email, password, confirmPassword, role], (_, __, onCleanup) => {
  // Re-validate fields that have been touched as user types.
  Object.keys(touched.value).forEach((field) => {
    if (touched.value[field]) {
      validateField(field)
    }
  })
})

const validateForm = () => {
  touch('fullName')
  touch('email')
  touch('password')
  touch('confirmPassword')
  touch('role')

  return (
    !errors.value.fullName &&
    !errors.value.email &&
    !errors.value.password &&
    !errors.value.confirmPassword &&
    !errors.value.role
  )
}

const onSubmit = async () => {
  submitError.value = ''
  if (!validateForm()) return

  isSubmitting.value = true
  try {
    await auth.register(fullName.value, email.value, password.value, role.value)
  } catch (err) {
    submitError.value = err.message || 'Unable to create account.'
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

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
