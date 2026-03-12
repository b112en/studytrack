<template>
  <div class="p-6">
    <header class="mb-6">
      <h1 class="text-2xl font-semibold text-white">My Progress</h1>
      <p class="mt-2 text-sm text-slate-300">Track your study performance</p>
    </header>

    <!-- Overall progress -->
    <section class="mb-8 rounded-xl border border-white/10 bg-white/5 p-6 shadow-sm">
      <div class="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 class="text-lg font-semibold text-white">Overall completion</h2>
          <p class="text-sm text-slate-300">Based on completed tasks vs total tasks.</p>
        </div>
        <div class="flex items-center gap-6">
          <div class="relative">
            <div class="h-32 w-32 rounded-full bg-white/10"></div>
            <div
              class="absolute inset-0 flex items-center justify-center"
            >
              <div class="text-center">
                <div :class="progressColorClass" class="text-4xl font-bold">
                  {{ completionPercentage }}%
                </div>
                <div class="text-xs text-slate-300">Completed</div>
              </div>
            </div>
          </div>
          <div>
            <p class="text-sm text-slate-200">Completed <span class="font-semibold">{{ completedTasks }}</span> of <span class="font-semibold">{{ totalTasks }}</span> tasks.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Progress per subject -->
    <section class="mb-8">
      <h2 class="mb-4 text-lg font-semibold text-white">Progress by subject</h2>
      <div class="space-y-4">
        <div
          v-for="subject in subjects"
          :key="subject.id"
          class="rounded-xl border border-white/10 bg-white/5 p-4"
        >
          <div class="flex items-center justify-between">
            <div>
              <div class="text-sm font-semibold text-white">{{ subject.name }}</div>
              <div class="text-xs text-slate-300">{{ subject.completed }} / {{ subject.total }} tasks completed</div>
            </div>
            <div class="text-sm font-semibold text-slate-100">{{ subject.percentage }}%</div>
          </div>
          <div class="mt-3 h-2 w-full overflow-hidden rounded-full bg-white/10">
            <div
              class="h-full rounded-full"
              :style="{ width: subject.percentage + '%', backgroundColor: subject.color }"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- Weekly summary cards -->
    <section class="mb-8">
      <h2 class="mb-4 text-lg font-semibold text-white">Weekly summary</h2>
      <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div class="rounded-xl border border-white/10 bg-white/5 p-5 shadow-sm">
          <div class="text-sm font-semibold text-slate-300">Tasks completed this week</div>
          <div class="mt-3 text-2xl font-bold text-white">{{ weeklyCompleted }}</div>
        </div>
        <div class="rounded-xl border border-white/10 bg-white/5 p-5 shadow-sm">
          <div class="text-sm font-semibold text-slate-300">Tasks added this week</div>
          <div class="mt-3 text-2xl font-bold text-white">{{ weeklyAdded }}</div>
        </div>
        <div class="rounded-xl border border-white/10 bg-white/5 p-5 shadow-sm">
          <div class="text-sm font-semibold text-slate-300">Most productive subject</div>
          <div class="mt-3 text-2xl font-bold text-white">{{ topSubject || '—' }}</div>
        </div>
        <div class="rounded-xl border border-white/10 bg-white/5 p-5 shadow-sm">
          <div class="text-sm font-semibold text-slate-300">Upcoming deadlines</div>
          <div class="mt-3 text-2xl font-bold text-white">{{ upcomingDeadlines.length }}</div>
        </div>
      </div>
    </section>

    <!-- Upcoming deadlines -->
    <section class="mb-8">
      <h2 class="mb-4 text-lg font-semibold text-white">Upcoming deadlines</h2>
      <div class="space-y-3">
        <div
          v-for="task in upcomingDeadlines"
          :key="task.id"
          class="flex flex-col gap-2 rounded-xl border border-white/10 bg-white/5 p-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <div class="text-sm font-semibold text-white">{{ task.title }}</div>
            <div class="text-xs text-slate-300">{{ task.subject }}</div>
          </div>
          <div class="flex items-center gap-3 text-xs">
            <span
              class="rounded-full px-2 py-1 font-semibold"
              :class="urgencyClass(task)"
            >
              {{ daysRemaining(task.deadline) }}
            </span>
            <span class="rounded-full px-2 py-1 bg-white/10 text-xs font-semibold text-slate-200">
              {{ task.status }}
            </span>
          </div>
        </div>
      </div>
    </section>

    <!-- Recent activity -->
    <section>
      <h2 class="mb-4 text-lg font-semibold text-white">Recent activity</h2>
      <ul class="space-y-3">
        <li
          v-for="item in recentCompleted"
          :key="item.id"
          class="rounded-xl border border-white/10 bg-white/5 p-4"
        >
          <div class="flex flex-col gap-1">
            <div class="text-sm font-semibold text-white">{{ item.title }}</div>
            <div class="text-xs text-slate-300">{{ item.subject }} • Completed on {{ item.completedAt }}</div>
          </div>
        </li>
      </ul>
    </section>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useTaskStore } from '../stores/taskStore'
import { useSubjectStore } from '../stores/subjectStore'

const taskStore = useTaskStore()
const subjectStore = useSubjectStore()

const totalTasks = computed(() => taskStore.totalTasks)
const completedTasks = computed(() => taskStore.completedTasks)
const completionPercentage = computed(() => {
  if (totalTasks.value === 0) return 0
  return Math.round((completedTasks.value / totalTasks.value) * 100)
})

const progressColorClass = computed(() => {
  if (completionPercentage.value >= 70) return 'text-emerald-300'
  if (completionPercentage.value >= 40) return 'text-amber-300'
  return 'text-rose-300'
})

const subjects = computed(() => {
  const tasks = taskStore.tasks
  const groups = subjectStore.subjects.map((s) => ({
    ...s,
    completed: 0,
    total: 0,
    percentage: 0,
  }))

  groups.forEach((group) => {
    const groupTasks = tasks.filter((t) => t.subject === group.name)
    group.total = groupTasks.length
    group.completed = groupTasks.filter((t) => t.status === 'Completed').length
    group.percentage = group.total === 0 ? 0 : Math.round((group.completed / group.total) * 100)
  })

  return groups
})

const weeklyCompleted = computed(() => {
  const weekAgo = new Date()
  weekAgo.setDate(weekAgo.getDate() - 7)
  return taskStore.tasks.filter((t) => {
    if (!t.completedAt) return false
    return new Date(t.completedAt) >= weekAgo
  }).length
})

const weeklyAdded = computed(() => {
  const weekAgo = new Date()
  weekAgo.setDate(weekAgo.getDate() - 7)
  return taskStore.tasks.filter((t) => new Date(t.deadline) >= weekAgo).length
})

const topSubject = computed(() => {
  const sorted = subjects.value
    .slice()
    .sort((a, b) => b.percentage - a.percentage)
  return sorted.length ? sorted[0].name : ''
})

const upcomingDeadlines = computed(() => {
  const now = new Date()
  const inSeven = new Date()
  inSeven.setDate(inSeven.getDate() + 7)

  return taskStore.tasks
    .filter((t) => {
      const due = new Date(t.deadline)
      return due >= now && due <= inSeven
    })
    .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
})

function daysRemaining(deadline) {
  const diff = Math.ceil((new Date(deadline) - new Date()) / (1000 * 60 * 60 * 24))
  if (diff <= 0) return 'Due today'
  return `Due in ${diff} day${diff === 1 ? '' : 's'}`
}

function urgencyClass(task) {
  const diff = Math.ceil((new Date(task.deadline) - new Date()) / (1000 * 60 * 60 * 24))
  if (diff <= 1) return 'bg-red-500/20 text-red-100'
  if (diff <= 3) return 'bg-amber-500/20 text-amber-100'
  return 'bg-emerald-500/20 text-emerald-100'
}

const recentCompleted = computed(() =>
  taskStore.tasks
    .filter((t) => t.status === 'Completed')
    .slice(-5)
    .reverse()
)
</script>
