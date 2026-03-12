import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import router from '../router'
import { useUserStore } from './userStore'

export const useAuthStore = defineStore('auth', () => {
  const userStore = useUserStore()
  const users = computed(() => userStore.users)

  const currentUser = ref(null)
  const flashMessage = ref('')

  const isAuthenticated = computed(() => !!currentUser.value)

  const userRole = computed(() => currentUser.value?.role ?? '')
  const userInitial = computed(() => {
    const name = currentUser.value?.fullName ?? ''
    return name ? name.trim().charAt(0).toUpperCase() : ''
  })

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
      joined: new Date().toISOString().slice(0, 10),
      status: 'Active',
    }

    userStore.addUser(newUser)
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
    userRole,
    userInitial,
    flashMessage,
    setFlashMessage,
    register,
    login,
    logout,
  }
})
