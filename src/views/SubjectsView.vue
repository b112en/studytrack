<template>
  <div class="p-6">
    <header class="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-2xl font-semibold text-white">Subjects</h1>
        <p class="mt-1 text-sm text-slate-300">Manage your study subjects</p>
      </div>

      <button
        type="button"
        class="inline-flex items-center gap-2 rounded-lg bg-indigo-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-400"
        @click="openAddModal"
      >
        + Add Subject
      </button>
    </header>

    <div v-if="subjects.length === 0" class="rounded-xl border border-white/10 bg-white/5 p-6 text-center">
      <p class="text-sm text-slate-200">No subjects yet. Add your first subject!</p>
    </div>

    <div v-else class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <div
        v-for="subject in subjects"
        :key="subject.id"
        class="rounded-xl border border-white/10 bg-white/5 p-5 shadow-sm"
      >
        <div class="flex items-start justify-between gap-3">
          <div>
            <div class="mb-2 flex items-center gap-2">
              <span
                class="h-3 w-3 rounded-full"
                :style="{ backgroundColor: themeColor(subject.color) }"
              />
              <h2 class="text-lg font-semibold text-white">{{ subject.name }}</h2>
            </div>
            <p class="text-sm text-slate-300">{{ subject.description }}</p>
          </div>

          <div class="text-right">
            <div class="text-xs font-semibold text-slate-400">Tasks</div>
            <div class="mt-1 text-lg font-bold text-white">{{ subject.taskCount }}</div>
          </div>
        </div>

        <div class="mt-4 flex gap-2">
          <button
            type="button"
            class="flex-1 rounded-lg bg-white/5 px-3 py-2 text-sm font-semibold text-white hover:bg-white/10"
            @click="openEditModal(subject)"
          >
            Edit
          </button>
          <button
            type="button"
            class="flex-1 rounded-lg bg-red-500/20 px-3 py-2 text-sm font-semibold text-red-100 hover:bg-red-500/30"
            @click="confirmDelete(subject.id)"
          >
            Delete
          </button>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <transition name="modal">
      <div
        v-if="isModalOpen"
        class="fixed inset-0 z-50 flex items-center justify-center px-4"
      >
        <div class="absolute inset-0 bg-black/60" @click="closeModal"></div>
        <div class="relative w-full max-w-lg rounded-xl border border-white/10 bg-slate-900 p-6 shadow-xl">
          <div class="flex items-start justify-between gap-4">
            <div>
              <h2 class="text-xl font-semibold text-white">
                {{ editingSubject ? 'Edit Subject' : 'Add Subject' }}
              </h2>
              <p class="text-sm text-slate-400">
                {{ editingSubject ? 'Update your subject details.' : 'Create a new subject to organize your tasks.' }}
              </p>
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

          <form @submit.prevent="saveSubject" class="mt-6 space-y-4">
            <div>
              <label class="text-sm font-semibold text-white">Subject name</label>
              <input
                v-model="form.name"
                type="text"
                placeholder="Enter subject name"
                class="mt-1 w-full rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-white outline-none focus:border-indigo-400"
              />
              <p v-if="errors.name" class="mt-1 text-xs text-rose-300">{{ errors.name }}</p>
            </div>

            <div>
              <label class="text-sm font-semibold text-white">Description</label>
              <textarea
                v-model="form.description"
                rows="3"
                placeholder="Add a short description..."
                class="mt-1 w-full resize-none rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-white outline-none focus:border-indigo-400"
              />
            </div>

            <div>
              <label class="text-sm font-semibold text-white">Color</label>
              <div class="mt-2 flex flex-wrap gap-2">
                <button
                  v-for="color in colorOptions"
                  :key="color"
                  type="button"
                  class="h-9 w-9 rounded-full border border-white/10"
                  :class="{
                    'ring-2 ring-white': form.color === color,
                  }"
                  :style="{ backgroundColor: themeColor(color) }"
                  @click="form.color = color"
                >
                  <span v-if="form.color === color" class="text-sm text-white">✓</span>
                </button>
              </div>
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
                {{ editingSubject ? 'Update Subject' : 'Add Subject' }}
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
import { useSubjectStore } from '../stores/subjectStore'

const subjectStore = useSubjectStore()

const subjects = computed(() => subjectStore.subjects)

const isModalOpen = ref(false)
const editingSubject = ref(null)

const form = ref({
  name: '',
  description: '',
  color: 'blue',
})

const errors = ref({})

const colorOptions = ['red', 'blue', 'green', 'yellow', 'purple', 'pink', 'orange', 'teal']

function themeColor(color) {
  const palette = {
    red: '#f87171',
    blue: '#60a5fa',
    green: '#34d399',
    yellow: '#facc15',
    purple: '#a78bfa',
    pink: '#f472b6',
    orange: '#fb923c',
    teal: '#2dd4bf',
  }
  return palette[color] || palette.blue
}

function openAddModal() {
  editingSubject.value = null
  form.value = { name: '', description: '', color: 'blue' }
  errors.value = {}
  isModalOpen.value = true
}

function openEditModal(subject) {
  editingSubject.value = subject
  form.value = { ...subject }
  errors.value = {}
  isModalOpen.value = true
}

function closeModal() {
  isModalOpen.value = false
}

function validate() {
  errors.value = {}
  if (!form.value.name.trim()) {
    errors.value.name = 'Subject name is required.'
  }
  return Object.keys(errors.value).length === 0
}

function saveSubject() {
  if (!validate()) return
  if (editingSubject.value) {
    subjectStore.updateSubject(editingSubject.value.id, { ...form.value })
    window.alert('Subject updated successfully')
  } else {
    subjectStore.addSubject({ ...form.value })
    window.alert('Subject added successfully')
  }
  closeModal()
}

function confirmDelete(id) {
  if (window.confirm('Delete this subject?')) {
    subjectStore.deleteSubject(id)
    window.alert('Subject deleted successfully')
  }
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
