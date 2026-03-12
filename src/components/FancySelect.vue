<template>
  <div class="relative" ref="root">
    <button
      type="button"
      class="w-full flex items-center justify-between rounded-lg border border-white/20 bg-white/5 px-4 py-2 text-left text-white shadow-sm transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-400"
      @click="toggle"
      :aria-expanded="isOpen"
      :aria-haspopup="true"
    >
      <span class="truncate">
        <span v-if="selected">
          <span v-if="selected.icon" class="mr-2">{{ selected.icon }}</span>
          {{ selected.label }}
        </span>
        <span v-else class="text-slate-400">{{ placeholder }}</span>
      </span>
      <span class="text-slate-200">▾</span>
    </button>

    <transition name="fade">
      <ul
        v-if="isOpen"
        class="absolute z-20 mt-1 w-full overflow-hidden rounded-lg border border-white/15 bg-slate-950/90 shadow-lg backdrop-blur"
      >
        <li
          v-for="option in options"
          :key="option.value"
          @click="select(option.value)"
          class="flex items-center justify-between gap-2 px-4 py-2 text-sm text-white transition hover:bg-white/10 focus:bg-white/10 focus:outline-none"
          tabindex="0"
        >
          <span class="flex items-center gap-2">
            <span v-if="option.icon" class="h-2 w-2 rounded-full">{{ option.icon }}</span>
            {{ option.label }}
          </span>
          <span v-if="option.value === modelValue" class="text-indigo-200">✓</span>
        </li>
      </ul>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({
  modelValue: { type: [String, Number, null], default: null },
  options: { type: Array, default: () => [] },
  placeholder: { type: String, default: 'Select...' },
})

const emits = defineEmits(['update:modelValue'])

const isOpen = ref(false)
const root = ref(null)

const selected = computed(() => props.options.find((o) => o.value === props.modelValue))

function toggle() {
  isOpen.value = !isOpen.value
}

function select(value) {
  emits('update:modelValue', value)
  isOpen.value = false
}

function onClickOutside(event) {
  if (!root.value) return
  if (!root.value.contains(event.target)) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', onClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', onClickOutside)
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 150ms ease-in-out;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
