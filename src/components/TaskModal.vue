<template>
  <transition name="modal">
    <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div class="absolute inset-0 bg-black/60" @click="close"></div>

      <div class="relative w-full max-w-lg rounded-xl border border-white/10 bg-slate-900 p-6 shadow-xl">
        <div class="flex items-start justify-between gap-4">
          <div>
            <h2 class="text-xl font-semibold text-white">
              {{ isEdit ? 'Edit Task' : 'Add New Task' }}
            </h2>
            <p class="text-sm text-slate-400">
              {{ isEdit ? 'Update task details below.' : 'Fill out the form to add a new task.' }}
            </p>
          </div>
          <button
            type="button"
            class="rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
            @click="close"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <form @submit.prevent="handleSave" class="mt-6 space-y-4">
          <div>
            <label class="text-sm font-semibold text-white">Title</label>
            <input
              v-model="form.title"
              type="text"
              placeholder="Enter task title"
              class="mt-1 w-full rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-white outline-none focus:border-indigo-400"
            />
            <p v-if="errors.title" class="mt-1 text-xs text-rose-300">{{ errors.title }}</p>
          </div>

          <div class="grid gap-4 sm:grid-cols-2">
            <div>
              <label class="text-sm font-semibold text-white">Subject</label>
              <FancySelect
                v-model="form.subject"
                :options="[{ value: '', label: 'Select a subject' }, ...subjects.map((s) => ({ value: s.name, label: s.name }))]"
                placeholder="Select a subject"
                class="mt-1"
              />
              <p v-if="errors.subject" class="mt-1 text-xs text-rose-300">{{ errors.subject }}</p>
            </div>

            <div>
              <label class="text-sm font-semibold text-white">Deadline</label>
              <input
                v-model="form.deadline"
                type="date"
                :min="today"
                class="mt-1 w-full rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-white outline-none focus:border-indigo-400"
              />
              <p v-if="errors.deadline" class="mt-1 text-xs text-rose-300">{{ errors.deadline }}</p>
            </div>
          </div>

          <div class="grid gap-4 sm:grid-cols-2">
            <div>
              <label class="text-sm font-semibold text-white">Priority</label>
              <FancySelect
                v-model="form.priority"
                :options="[
                  { value: '', label: 'Select priority' },
                  { value: 'Low', label: 'Low' },
                  { value: 'Medium', label: 'Medium' },
                  { value: 'High', label: 'High' },
                ]"
                placeholder="Select priority"
                class="mt-1"
              />
              <p v-if="errors.priority" class="mt-1 text-xs text-rose-300">{{ errors.priority }}</p>
            </div>

            <div>
              <label class="text-sm font-semibold text-white">Status</label>
              <FancySelect
                v-model="form.status"
                :options="[
                  { value: 'Pending', label: 'Pending' },
                  { value: 'Completed', label: 'Completed' },
                ]"
                placeholder="Select status"
                class="mt-1"
              />
            </div>
          </div>

          <div>
            <label class="text-sm font-semibold text-white">Description</label>
            <textarea
              v-model="form.description"
              rows="3"
              placeholder="Add a description..."
              class="mt-1 w-full resize-none rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-white outline-none focus:border-indigo-400"
            />
          </div>

          <div class="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              class="rounded-lg border border-white/20 bg-white/5 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10"
              @click="close"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="rounded-lg bg-indigo-500 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-400"
            >
              {{ isEdit ? 'Update Task' : 'Add Task' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { computed, watch, ref } from 'vue'
import { useSubjectStore } from '../stores/subjectStore'
import FancySelect from './FancySelect.vue'

const props = defineProps({
  isOpen: { type: Boolean, required: true },
  task: { type: Object, default: null },
})

const emits = defineEmits(['close', 'save'])

const subjectStore = useSubjectStore()
const subjects = computed(() => subjectStore.subjects)

const today = new Date().toISOString().slice(0, 10)

const defaultForm = () => ({
  title: '',
  subject: '',
  deadline: today,
  priority: '',
  status: 'Pending',
  description: '',
})

const form = ref(defaultForm())
const errors = ref({})

const isEdit = computed(() => !!props.task)

function resetForm() {
  errors.value = {}
  if (props.task) {
    form.value = {
      title: props.task.title,
      subject: props.task.subject,
      deadline: props.task.deadline,
      priority: props.task.priority,
      status: props.task.status,
      description: props.task.description,
    }
  } else {
    form.value = defaultForm()
  }
}

function validate() {
  errors.value = {}

  if (!form.value.title.trim()) {
    errors.value.title = 'Title is required.'
  }
  if (!form.value.subject) {
    errors.value.subject = 'Please select a subject.'
  }
  if (!form.value.deadline) {
    errors.value.deadline = 'Deadline is required.'
  }
  if (!form.value.priority) {
    errors.value.priority = 'Please select a priority.'
  }

  return Object.keys(errors.value).length === 0
}

function close() {
  emits('close')
}

function handleSave() {
  if (!validate()) return
  emits('save', {
    ...form.value,
  })
  resetForm()
}

watch(
  () => props.isOpen,
  (open) => {
    if (open) {
      resetForm()
    }
  }
)
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
