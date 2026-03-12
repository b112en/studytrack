<template>
  <div class="p-6">
    <header class="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-2xl font-semibold text-white">User Management</h1>
        <p class="mt-1 text-sm text-slate-300">Manage all system users</p>
      </div>
      <button
        type="button"
        class="inline-flex items-center gap-2 rounded-lg bg-indigo-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-400"
        @click="openAddModal"
      >
        + Add User
      </button>
    </header>

    <section class="mb-6 grid gap-4 md:grid-cols-3">
      <div class="rounded-xl border border-white/10 bg-white/5 p-4">
        <label class="text-xs font-semibold text-slate-300">Search</label>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search by name or email"
          class="mt-2 w-full rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-white outline-none focus:border-indigo-400"
        />
      </div>
      <div class="rounded-xl border border-white/10 bg-white/5 p-4">
        <label class="text-xs font-semibold text-slate-300">Role</label>
        <FancySelect
          v-model="filterRole"
          :options="[
            { value: 'All', label: 'All' },
            { value: 'Student', label: 'Student' },
            { value: 'Admin', label: 'Admin' },
          ]"
          placeholder="All"
          class="mt-2"
        />
      </div>
      <div class="rounded-xl border border-white/10 bg-white/5 p-4">
        <label class="text-xs font-semibold text-slate-300">Sort</label>
        <FancySelect
          v-model="sortBy"
          :options="[
            { value: 'name', label: 'Name' },
            { value: 'joined', label: 'Joined' },
          ]"
          placeholder="Name"
          class="mt-2"
        />
      </div>
    </section>

    <div class="rounded-xl border border-white/10 bg-white/5 p-4 overflow-x-auto">
      <table class="w-full text-left text-sm">
        <thead>
          <tr class="text-xs uppercase tracking-wide text-slate-400">
            <th class="py-3">Avatar</th>
            <th class="py-3">Full Name</th>
            <th class="py-3">Email</th>
            <th class="py-3">Role</th>
            <th class="py-3">Joined</th>
            <th class="py-3">Status</th>
            <th class="py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="user in paginatedUsers"
            :key="user.id"
            class="border-t border-white/10 hover:bg-white/5"
          >
            <td class="py-3">
              <div class="flex items-center gap-2">
                <div class="h-8 w-8 flex items-center justify-center rounded-full bg-indigo-500 text-sm font-semibold text-white">
                  {{ user.fullName.charAt(0).toUpperCase() }}
                </div>
              </div>
            </td>
            <td class="py-3">{{ user.fullName }}</td>
            <td class="py-3 text-slate-300">{{ user.email }}</td>
            <td class="py-3">
              <span
                class="inline-flex items-center rounded-full px-2 py-1 text-[11px] font-semibold"
                :class="
                  user.role === 'Admin'
                    ? 'bg-purple-500/20 text-purple-100'
                    : 'bg-sky-500/20 text-sky-100'
                "
              >
                {{ user.role }}
              </span>
            </td>
            <td class="py-3">{{ user.joined }}</td>
            <td class="py-3">
              <span
                class="inline-flex items-center rounded-full px-2 py-1 text-[11px] font-semibold"
                :class="user.status === 'Active' ? 'bg-emerald-500/20 text-emerald-100' : 'bg-slate-500/20 text-slate-100'"
              >
                {{ user.status }}
              </span>
            </td>
            <td class="py-3">
              <div class="flex items-center gap-2">
                <button
                  type="button"
                  class="rounded-md bg-white/5 px-3 py-1 text-xs font-semibold text-white hover:bg-white/10"
                  @click="viewUser(user)"
                >
                  👁️
                </button>
                <button
                  type="button"
                  class="rounded-md bg-red-500/20 px-3 py-1 text-xs font-semibold text-red-100 hover:bg-red-500/30"
                  @click="confirmRemoveUser(user.id)"
                >
                  🗑️
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <div class="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-slate-200">
        <div>Showing {{ paginatedUsers.length }} of {{ filteredUsers.length }} users</div>
        <div class="flex items-center gap-2">
          <button
            type="button"
            class="rounded-md bg-white/5 px-3 py-1 text-xs font-semibold text-white hover:bg-white/10"
            :disabled="currentPage === 1"
            @click="currentPage--"
          >
            Previous
          </button>
          <button
            type="button"
            class="rounded-md bg-white/5 px-3 py-1 text-xs font-semibold text-white hover:bg-white/10"
            :disabled="currentPage === totalPages"
            @click="currentPage++"
          >
            Next
          </button>
        </div>
      </div>
    </div>

    <!-- Add User Modal -->
    <transition name="modal">
      <div
        v-if="isModalOpen"
        class="fixed inset-0 z-50 flex items-center justify-center px-4"
      >
        <div class="absolute inset-0 bg-black/60" @click="closeModal"></div>
        <div class="relative w-full max-w-md rounded-xl border border-white/10 bg-slate-900 p-6 shadow-xl">
          <div class="flex items-start justify-between gap-4">
            <div>
              <h2 class="text-xl font-semibold text-white">Add User</h2>
              <p class="text-sm text-slate-400">Create a new account for the system.</p>
            </div>
            <button
              type="button"
              class="rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
              @click="closeModal"
              aria-label="Close"
            >
              ✕
            </button>
          </div>

          <form @submit.prevent="saveUser" class="mt-6 space-y-4">
            <div>
              <label class="text-sm font-semibold text-white">Full Name</label>
              <input
                v-model="form.fullName"
                type="text"
                class="mt-1 w-full rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-white outline-none focus:border-indigo-400"
              />
              <p v-if="errors.fullName" class="mt-1 text-xs text-rose-300">{{ errors.fullName }}</p>
            </div>

            <div>
              <label class="text-sm font-semibold text-white">Email</label>
              <input
                v-model="form.email"
                type="email"
                class="mt-1 w-full rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-white outline-none focus:border-indigo-400"
              />
              <p v-if="errors.email" class="mt-1 text-xs text-rose-300">{{ errors.email }}</p>
            </div>

            <div>
              <label class="text-sm font-semibold text-white">Password</label>
              <input
                v-model="form.password"
                type="password"
                class="mt-1 w-full rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-white outline-none focus:border-indigo-400"
              />
              <p v-if="errors.password" class="mt-1 text-xs text-rose-300">{{ errors.password }}</p>
            </div>

            <div>
              <label class="text-sm font-semibold text-white">Role</label>
              <select
                v-model="form.role"
                class="mt-1 w-full rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-white outline-none focus:border-indigo-400"
              >
                <option value="Student">Student</option>
                <option value="Admin">Admin</option>
              </select>
            </div>

            <div class="flex justify-end gap-3 pt-2">
              <button
                type="button"
                class="rounded-lg border border-white/20 bg-white/5 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10"
                @click="closeModal"
              >
                Cancel
              </button>
              <button
                type="submit"
                class="rounded-lg bg-indigo-500 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-400"
              >
                Add User
              </button>
            </div>
          </form>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useUserStore } from '../stores/userStore'
import { useAuthStore } from '../stores/authStore'
import FancySelect from '../components/FancySelect.vue'

const userStore = useUserStore()
const auth = useAuthStore()

const searchQuery = ref('')
const filterRole = ref('All')
const sortBy = ref('name')

const currentPage = ref(1)
const pageSize = 10

const isModalOpen = ref(false)

const form = ref({
  fullName: '',
  email: '',
  password: '',
  role: 'Student',
})

const errors = ref({})

const filteredUsers = computed(() => {
  let list = [...userStore.users]

  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    list = list.filter(
      (u) =>
        u.fullName.toLowerCase().includes(query) ||
        u.email.toLowerCase().includes(query)
    )
  }

  if (filterRole.value !== 'All') {
    list = list.filter((u) => u.role === filterRole.value)
  }

  if (sortBy.value === 'name') {
    list.sort((a, b) => a.fullName.localeCompare(b.fullName))
  } else {
    list.sort((a, b) => new Date(b.joined) - new Date(a.joined))
  }

  return list
})

const totalPages = computed(() => Math.max(1, Math.ceil(filteredUsers.value.length / pageSize)))

const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredUsers.value.slice(start, start + pageSize)
})

function openAddModal() {
  isModalOpen.value = true
  form.value = { fullName: '', email: '', password: '', role: 'Student' }
  errors.value = {}
}

function closeModal() {
  isModalOpen.value = false
}

function validate() {
  errors.value = {}
  if (!form.value.fullName.trim()) {
    errors.value.fullName = 'Full name is required.'
  }
  if (!form.value.email.trim()) {
    errors.value.email = 'Email is required.'
  }
  if (!form.value.password.trim()) {
    errors.value.password = 'Password is required.'
  }
  return Object.keys(errors.value).length === 0
}

function saveUser() {
  if (!validate()) return
  userStore.addUser({
    fullName: form.value.fullName,
    email: form.value.email,
    role: form.value.role,
    joined: new Date().toISOString().slice(0, 10),
  })
  window.alert('User added successfully')
  closeModal()
}

function confirmRemoveUser(id) {
  if (window.confirm('Remove this user?')) {
    userStore.removeUser(id)
    window.alert('User removed successfully')
  }
}

function viewUser(user) {
  window.alert(`${user.fullName} (${user.email})`)
}
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 175ms ease, transform 175ms ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: scale(0.98);
}
</style>
