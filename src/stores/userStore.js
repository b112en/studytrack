import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useUserStore = defineStore('user', () => {
  const users = ref([
    {
      id: 1,
      fullName: 'John Doe',
      email: 'john@study.com',
      role: 'Student',
      joined: '2025-01-15',
      status: 'Active',
    },
    {
      id: 2,
      fullName: 'Alice Smith',
      email: 'alice@study.com',
      role: 'Admin',
      joined: '2025-01-10',
      status: 'Active',
    },
    {
      id: 3,
      fullName: 'Bob Johnson',
      email: 'bob@study.com',
      role: 'Student',
      joined: '2025-02-01',
      status: 'Active',
    },
  ])

  const totalUsers = computed(() => users.value.length)
  const activeStudents = computed(() => users.value.filter((u) => u.role === 'Student').length)

  function addUser(newUser) {
    users.value.push({
      id: Date.now(),
      status: 'Active',
      ...newUser,
    })
  }

  function removeUser(id) {
    users.value = users.value.filter((u) => u.id !== id)
  }

  function updateUser(id, updates) {
    const user = users.value.find((u) => u.id === id)
    if (!user) return
    Object.assign(user, updates)
  }

  return {
    users,
    totalUsers,
    activeStudents,
    addUser,
    removeUser,
    updateUser,
  }
})
