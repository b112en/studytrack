import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSubjectStore = defineStore('subject', () => {
  const subjects = ref([
    {
      id: 1,
      name: 'Mathematics',
      color: 'blue',
      description: 'Calculus and Algebra',
      taskCount: 3,
    },
    {
      id: 2,
      name: 'History',
      color: 'yellow',
      description: 'World History',
      taskCount: 2,
    },
    {
      id: 3,
      name: 'Physics',
      color: 'purple',
      description: 'Mechanics and Waves',
      taskCount: 4,
    },
  ])

  function addSubject(subject) {
    subjects.value.push({
      id: Date.now(),
      taskCount: 0,
      ...subject,
    })
  }

  function updateSubject(id, updates) {
    const subject = subjects.value.find((s) => s.id === id)
    if (!subject) return
    Object.assign(subject, updates)
  }

  function deleteSubject(id) {
    subjects.value = subjects.value.filter((s) => s.id !== id)
  }

  return {
    subjects,
    addSubject,
    updateSubject,
    deleteSubject,
  }
})
