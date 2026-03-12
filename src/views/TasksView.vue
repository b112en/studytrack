<template>
  <div class="p-6">
    <!-- Header -->
    <header class="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-2xl font-semibold text-white">My Tasks</h1>
        <p class="mt-1 text-sm text-slate-300">Manage your study tasks</p>
      </div>

      <button
        type="button"
        class="inline-flex items-center gap-2 rounded-lg bg-indigo-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-400"
        @click="openAddModal"
      >
        + Add Task
      </button>
    </header>

    <!-- Filters -->
    <section class="mb-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <div class="rounded-xl border border-white/10 bg-white/5 p-4">
        <label class="text-xs font-semibold text-slate-300">Search</label>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search by title"
          class="mt-2 w-full rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-white outline-none focus:border-indigo-400"
        />
      </div>

      <div class="rounded-xl border border-white/10 bg-white/5 p-4">
        <label class="text-xs font-semibold text-slate-300">Status</label>
        <select
          v-model="filterStatus"
          class="mt-2 w-full rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-white outline-none focus:border-indigo-400"
        >
          <option value="All">All</option>
          <option value="Pending">Pending</option>
          <option value="Completed">Completed</option>
          <option value="Overdue">Overdue</option>
        </select>
      </div>

      <div class="rounded-xl border border-white/10 bg-white/5 p-4">
        <label class="text-xs font-semibold text-slate-300">Subject</label>
        <FancySelect
          v-model="filterSubject"
          :options="[{ value: 'All', label: 'All' }, ...subjects.map((s) => ({ value: s.name, label: s.name }))]"
          placeholder="All"
          class="mt-2"
        />
      </div>

      <div class="rounded-xl border border-white/10 bg-white/5 p-4">
        <label class="text-xs font-semibold text-slate-300">Sort by</label>
        <select
          v-model="sortBy"
          class="mt-2 w-full rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-white outline-none focus:border-indigo-400"
        >
          <option value="deadline">Deadline</option>
          <option value="priority">Priority</option>
          <option value="title">Title</option>
        </select>
      </div>
    </section>

    <!-- Task list -->
    <section>
      <div v-if="filteredTasks.length === 0" class="rounded-xl border border-white/10 bg-white/5 p-6 text-center">
        <p class="text-sm text-slate-200">No tasks found. Add your first task!</p>
      </div>

      <div v-else class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <TaskCard
          v-for="task in filteredTasks"
          :key="task.id"
          :task="task"
          @edit="openEditModal"
          @delete="confirmDelete"
          @toggle-complete="toggleComplete"
        />
      </div>
    </section>

    <TaskModal
      :isOpen="isModalOpen"
      :task="selectedTask"
      @close="closeModal"
      @save="handleSaveTask"
    />
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useTaskStore } from '../stores/taskStore'
import { useSubjectStore } from '../stores/subjectStore'
import TaskCard from '../components/TaskCard.vue'
import TaskModal from '../components/TaskModal.vue'
import FancySelect from '../components/FancySelect.vue'

const taskStore = useTaskStore()
const subjectStore = useSubjectStore()

const searchQuery = ref('')
const filterStatus = ref('All')
const filterSubject = ref('All')
const sortBy = ref('deadline')

const isModalOpen = ref(false)
const selectedTask = ref(null)

const subjects = computed(() => subjectStore.subjects)

const filteredTasks = computed(() => {
  let tasks = [...taskStore.tasks]

  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    tasks = tasks.filter((t) => t.title.toLowerCase().includes(query))
  }

  if (filterStatus.value !== 'All') {
    tasks = tasks.filter((t) => t.status === filterStatus.value)
  }

  if (filterSubject.value !== 'All') {
    tasks = tasks.filter((t) => t.subject === filterSubject.value)
  }

  const sortKey = sortBy.value
  tasks.sort((a, b) => {
    if (sortKey === 'deadline') {
      return a.deadline.localeCompare(b.deadline)
    }
    if (sortKey === 'priority') {
      const order = { High: 1, Medium: 2, Low: 3 }
      return (order[a.priority] || 9) - (order[b.priority] || 9)
    }
    if (sortKey === 'title') {
      return a.title.localeCompare(b.title)
    }
    return 0
  })

  return tasks
})

function openAddModal() {
  selectedTask.value = null
  isModalOpen.value = true
}

function openEditModal(task) {
  selectedTask.value = { ...task }
  isModalOpen.value = true
}

function closeModal() {
  isModalOpen.value = false
}

function handleSaveTask(payload) {
  if (selectedTask.value) {
    taskStore.updateTask(selectedTask.value.id, payload)
  } else {
    taskStore.addTask(payload)
  }
  isModalOpen.value = false
  window.alert(selectedTask.value ? 'Task updated successfully' : 'Task added successfully')
}

function confirmDelete(id) {
  if (window.confirm('Delete this task?')) {
    taskStore.deleteTask(id)
    window.alert('Task deleted successfully')
  }
}

function toggleComplete(id) {
  taskStore.markComplete(id)
  window.alert('Task marked as complete')
}
</script>
