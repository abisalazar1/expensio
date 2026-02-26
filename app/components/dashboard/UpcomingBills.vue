<template>
  <div class="bg-white rounded-2xl border border-slate-200 shadow-sm">
    <!-- Header -->
    <div class="flex items-center justify-between px-6 py-5 border-b border-slate-100">
      <div>
        <h2 class="text-base font-bold text-slate-900">Upcoming Bills</h2>
        <p class="text-sm text-slate-400 mt-0.5">Due in the next 7 days</p>
      </div>
      <NuxtLink
        to="/dashboard/subscriptions"
        class="text-sm font-medium text-emerald-600 hover:text-emerald-700 flex items-center gap-1 transition-colors"
      >
        Manage
        <UIcon name="i-heroicons-arrow-right" class="text-xs" />
      </NuxtLink>
    </div>

    <!-- Bills list -->
    <div v-if="upcomingBills.length > 0" class="divide-y divide-slate-100">
      <div
        v-for="bill in upcomingBills"
        :key="bill.id"
        class="flex items-center gap-4 px-6 py-4 hover:bg-slate-50/70 transition-colors group"
      >
        <!-- Icon -->
        <div
          class="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105"
          :class="iconConfig(bill.color).bg"
        >
          <UIcon :name="bill.icon" class="text-base" :class="iconConfig(bill.color).text" />
        </div>

        <!-- Name + category -->
        <div class="flex-1 min-w-0">
          <p class="text-sm font-semibold text-slate-800 truncate">{{ bill.name }}</p>
          <p class="text-xs text-slate-400 mt-0.5">{{ bill.category }}</p>
        </div>

        <!-- Due badge -->
        <div class="shrink-0">
          <UBadge
            :color="urgencyColor(bill.nextBillingDate)"
            variant="subtle"
            size="xs"
          >
            {{ daysUntilLabel(bill.nextBillingDate) }}
          </UBadge>
        </div>

        <!-- Amount -->
        <div class="shrink-0 text-right min-w-16">
          <p class="text-sm font-bold text-slate-800 tabular-nums">${{ bill.amount.toFixed(2) }}</p>
          <p class="text-xs text-slate-400 capitalize">{{ bill.frequency }}</p>
        </div>
      </div>
    </div>

    <!-- Empty state -->
    <div v-else class="flex flex-col items-center justify-center py-10 text-center px-6">
      <div class="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center mb-3">
        <UIcon name="i-heroicons-check-circle" class="text-emerald-500 text-xl" />
      </div>
      <p class="text-sm font-semibold text-slate-700 mb-0.5">All clear!</p>
      <p class="text-xs text-slate-400">No bills due in the next 7 days.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useSubscriptionsStore } from '~/stores/useSubscriptionsStore'

const store = useSubscriptionsStore()
const upcomingBills = computed(() => store.upcomingBills)

// ── Color helpers ─────────────────────────────────────────────────────────────

type Color = 'emerald' | 'rose' | 'sky' | 'violet' | 'amber'

function iconConfig(color: Color) {
  const map: Record<Color, { bg: string; text: string }> = {
    emerald: { bg: 'bg-emerald-50 border border-emerald-100', text: 'text-emerald-600' },
    rose:    { bg: 'bg-rose-50 border border-rose-100',       text: 'text-rose-500' },
    sky:     { bg: 'bg-sky-50 border border-sky-100',         text: 'text-sky-600' },
    violet:  { bg: 'bg-violet-50 border border-violet-100',   text: 'text-violet-600' },
    amber:   { bg: 'bg-amber-50 border border-amber-100',     text: 'text-amber-600' },
  }
  return map[color]
}

// ── Date helpers ──────────────────────────────────────────────────────────────

function daysUntil(dateStr: string): number {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const target = new Date(dateStr)
  return Math.round((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
}

function daysUntilLabel(dateStr: string): string {
  const days = daysUntil(dateStr)
  if (days === 0) return 'Today'
  if (days === 1) return 'Tomorrow'
  return `In ${days} days`
}

function urgencyColor(dateStr: string): string {
  const days = daysUntil(dateStr)
  if (days === 0) return 'error'
  if (days <= 2)  return 'warning'
  return 'neutral'
}
</script>
