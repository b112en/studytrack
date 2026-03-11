import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import router from '../router'

export const useAuthStore = defineStore('auth', () => {
  const users = ref([
    {
      id: 1,
      fullName: 'Demo User',
      email: 'user@example.com',
      password: 'Password1!',
      role: 'Student',
    },
  ])

  const currentUser = ref(null)
  const flashMessage = ref('')

  const isAuthenticated = computed(() => !!currentUser.value)

  const setFlashMessage = (message) => {
    flashMessage.value = message
  }

  const register = async (fullName, email, password, role) => {
    setFlashMessage('')
    const normalizedEmail = email.trim().toLowerCase()

    // Fake network delay
    await new Promise((resolve) => setTimeout(resolve, 400))

    const exists = users.value.some((u) => u.email.toLowerCase() === normalizedEmail)
    if (exists) {
      const error = new Error('Email already exists')
      error.code = 'EMAIL_EXISTS'
      throw error
    }

    const newUser = {
      id: Date.now(),
      fullName: fullName.trim(),
      email: normalizedEmail,
      password,
      role,
    }

    users.value.push(newUser)
    currentUser.value = newUser
    setFlashMessage('Account created successfully!')

    // Redirect based on role
    await router.push({ name: 'dashboard' })

    return newUser
  }

  const login = async (email, password) => {
    const normalizedEmail = email.trim().toLowerCase()

    // Fake network delay
    await new Promise((resolve) => setTimeout(resolve, 350))

    const user = users.value.find((u) => u.email.toLowerCase() === normalizedEmail)
    if (!user || user.password !== password) {
      const error = new Error('Invalid email or password')
      error.code = 'INVALID_CREDENTIALS'
      throw error
    }

    currentUser.value = user
    setFlashMessage('Welcome back!')

    await router.push({ name: 'dashboard' })

    return user
  }

  const logout = async () => {
    currentUser.value = null
    await router.push({ name: 'login' })
  }

  return {
    users,
    currentUser,
    isAuthenticated,
    flashMessage,
    setFlashMessage,
    register,
    login,
    logout,
  }
})
