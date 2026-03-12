<template>
  <div
    class="rounded-xl border border-white/10 bg-white/5 p-4 shadow-sm transition hover:shadow-md hover:bg-white/10"
    :class="{ 'opacity-60': task.status === 'Completed' }"
  >
    <div class="flex items-start justify-between gap-3">
      <label class="flex items-center gap-2">
        <input
          type="checkbox"
          class="h-4 w-4 text-indigo-500"
          :checked="task.status === 'Completed'"
          @change="$emit('toggle-complete', task.id)"
        />
        <span
          class="text-base font-semibold"
          :class="{ 'line-through text-slate-400': task.status === 'Completed' }"
        >
          {{ task.title }}
        </span>
      </label>

      <span
        class="rounded-full px-2 py-1 text-xs font-semibold"
        :class="priorityClass"
      >
        {{ task.priority }}
      </span>
    </div>

    <div class="mt-3 flex flex-wrap items-center gap-2 text-sm text-slate-200">
      <span class="rounded-full bg-white/10 px-2 py-1">{{ task.subject }}</span>
      <span class="inline-flex items-center gap-1">
        <span class="text-xs">📅</span>
        {{ task.deadline }}
      </span>
    </div>

    <div class="mt-4 flex items-center justify-between gap-3">
      <span class="rounded-full px-2 py-1 text-xs font-semibold" :class="statusClass">
        {{ task.status }}
      </span>

      <div class="flex items-center gap-2">
        <button
          type="button"
          class="rounded-md bg-white/5 px-3 py-1 text-xs font-semibold text-white hover:bg-white/10"
          @click="$emit('edit', task)"
        >
          ✏️
        </button>
        <button
          type="button"
          class="rounded-md bg-red-500/20 px-3 py-1 text-xs font-semibold text-red-100 hover:bg-red-500/30"
          @click="$emit('delete', task.id)"
        >
          🗑️
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { toRefs } from 'vue'

const props = defineProps({
  task: {
    type: Object,
    required: true,
  },
})

const { task } = toRefs(props)

const priorityClass = computed(() => {
  switch (task.value.priority) {
    case 'High':
      return 'bg-red-500/20 text-red-100'
    case 'Medium':
      return 'bg-amber-500/20 text-amber-100'
    default:
      return 'bg-emerald-500/20 text-emerald-100'
  }
})

const statusClass = computed(() => {
  switch (task.value.status) {
    case 'Completed':
      return 'bg-emerald-500/20 text-emerald-100'
    case 'Overdue':
      return 'bg-red-500/20 text-red-100'
    default:
      return 'bg-amber-500/20 text-amber-100'
  }
})
</script>
