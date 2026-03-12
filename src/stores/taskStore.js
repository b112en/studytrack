import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

function todayISO() {
  return new Date().toISOString().slice(0, 10)
}

export const useTaskStore = defineStore('task', () => {
  const tasks = ref([
    {
      id: 1,
      title: 'Finish math homework',
      subject: 'Mathematics',
      deadline: '2025-03-20',
      status: 'Pending',
      description: 'Complete chapter 5 exercises.',
      priority: 'High',
      completedAt: null,
    },
    {
      id: 2,
      title: 'Read history notes',
      subject: 'History',
      deadline: '2025-03-18',
      status: 'Completed',
      description: 'Review notes for the quiz.',
      priority: 'Medium',
      completedAt: '2025-03-17',
    },
    {
      id: 3,
      title: 'Physics lab report',
      subject: 'Physics',
      deadline: '2025-03-25',
      status: 'Pending',
      description: 'Write conclusions and upload.',
      priority: 'Low',
      completedAt: null,
    },
  ])

  const totalTasks = computed(() => tasks.value.length)
  const completedTasks = computed(() => tasks.value.filter((t) => t.status === 'Completed').length)
  const tasksCompletedToday = computed(() =>
    tasks.value.filter((t) => t.completedAt === todayISO()).length
  )

  function addTask(task) {
    tasks.value.push({
      id: Date.now(),
      ...task,
      status: task.status ?? 'Pending',
      completedAt: task.status === 'Completed' ? todayISO() : null,
    })
  }

  function updateTask(id, updates) {
    const task = tasks.value.find((t) => t.id === id)
    if (!task) return
    Object.assign(task, updates)
    if (updates.status === 'Completed') {
      task.completedAt = todayISO()
    }
  }

  function deleteTask(id) {
    tasks.value = tasks.value.filter((t) => t.id !== id)
  }

  function markComplete(id) {
    const task = tasks.value.find((t) => t.id === id)
    if (!task) return
    task.status = 'Completed'
    task.completedAt = todayISO()
  }

  return {
    tasks,
    totalTasks,
    completedTasks,
    tasksCompletedToday,
    addTask,
    updateTask,
    deleteTask,
    markComplete,
  }
})
