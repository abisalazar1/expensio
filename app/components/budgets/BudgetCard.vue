<template>
  <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden group">
    <!-- Status color stripe -->
    <div :class="['h-1 w-full transition-colors', stripeClass]" />

    <!-- Card body -->
    <div class="p-5">

      <!-- Row 1: icon + name + badges + action buttons -->
      <div class="flex items-start justify-between gap-3 mb-4">
        <div class="flex items-center gap-3">
          <div
            :class="[
              'w-10 h-10 rounded-xl flex items-center justify-center border shrink-0',
              colorMap[budget.color].bg,
            ]"
          >
            <UIcon :name="budget.icon" :class="['text-lg', colorMap[budget.color].icon]" />
          </div>
          <div>
            <p class="text-sm font-bold text-slate-900">{{ budget.name }}</p>
            <div class="flex items-center gap-1.5 mt-0.5">
              <UBadge :color="statusBadgeColor" variant="subtle" size="xs">
                {{ statusLabel }}
              </UBadge>
              <span
                v-if="budget.rollover"
                class="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-500 border border-slate-200"
              >
                Rollover
              </span>
            </div>
          </div>
        </div>

        <!-- Edit + delete (revealed on hover) -->
        <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
          <button
            type="button"
            class="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all"
            aria-label="Edit budget"
            @click="$emit('edit', budget)"
          >
            <UIcon name="i-heroicons-pencil" class="text-sm" />
          </button>
          <button
            type="button"
            class="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-all"
            aria-label="Delete budget"
            @click="showDeleteConfirm = true"
          >
            <UIcon name="i-heroicons-trash" class="text-sm" />
          </button>
        </div>
      </div>

      <!-- Row 2: spent amount + sparkline -->
      <div class="flex items-end justify-between mb-3">
        <div>
          <div class="flex items-baseline gap-1.5">
            <span :class="['text-2xl font-extrabold tabular-nums', amountColor]">
              {{ formatCurrency(budget.spent) }}
            </span>
            <span class="text-sm text-slate-400 font-medium">
              / {{ formatCurrency(budget.limit) }}
            </span>
          </div>
          <p class="text-xs text-slate-400 mt-0.5">
            {{ formatCurrency(Math.max(budget.limit - budget.spent, 0)) }} remaining
          </p>
        </div>

        <!-- 3-month sparkline (inline SVG, no library) -->
        <div class="flex flex-col items-end gap-1 shrink-0">
          <span class="text-[10px] text-slate-400 font-medium">3-month trend</span>
          <svg width="52" height="24">
            <rect
              v-for="(histSpent, i) in budget.history"
              :key="i"
              :x="i * 18"
              :y="24 - Math.min(Math.round((histSpent / budget.limit) * 24), 24)"
              width="14"
              :height="Math.min(Math.round((histSpent / budget.limit) * 24), 24)"
              rx="3"
              :fill="sparklineColor(histSpent)"
              opacity="0.85"
            />
          </svg>
        </div>
      </div>

      <!-- Row 3: progress bar -->
      <div class="mb-3">
        <div class="flex items-center justify-between mb-1.5">
          <span class="text-xs text-slate-500 font-medium">
            {{ Math.round(pct) }}% used
          </span>
          <span class="text-xs font-medium" :class="amountColor">
            {{ thresholdLabel }}
          </span>
        </div>
        <div class="h-2.5 bg-slate-100 rounded-full overflow-hidden">
          <div
            class="h-full rounded-full transition-all duration-500"
            :class="barColorClass"
            :style="{ width: `${pct}%` }"
          />
        </div>
      </div>

      <!-- Row 4: projected month-end warning -->
      <div
        v-if="hasProjectedOverage"
        class="flex items-center gap-2 px-3 py-2 bg-amber-50 rounded-lg border border-amber-100"
      >
        <UIcon name="i-heroicons-exclamation-triangle" class="text-amber-500 text-sm shrink-0" />
        <p class="text-xs text-amber-700 font-medium">
          Projected: <strong>{{ formatCurrency(projectedMonthEnd) }}</strong>
          — {{ formatCurrency(projectedMonthEnd - budget.limit) }} over limit at this rate
        </p>
      </div>

    </div>

    <!-- Delete confirmation panel -->
    <div
      v-if="showDeleteConfirm"
      class="flex items-center justify-between gap-3 px-5 py-3 bg-rose-50 border-t border-rose-100"
    >
      <p class="text-xs font-medium text-rose-700">Delete this budget permanently?</p>
      <div class="flex gap-2 shrink-0">
        <button
          type="button"
          class="px-3 py-1.5 text-xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-all"
          @click="showDeleteConfirm = false"
        >
          Cancel
        </button>
        <button
          type="button"
          class="px-3 py-1.5 text-xs font-semibold text-white bg-rose-500 rounded-lg hover:bg-rose-600 transition-all"
          @click="$emit('delete', budget.id)"
        >
          Delete
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

type BudgetColor = 'emerald' | 'sky' | 'violet' | 'amber' | 'rose'

interface Budget {
  id:             number
  name:           string
  icon:           string
  color:          BudgetColor
  limit:          number
  spent:          number
  rollover:       boolean
  alertThreshold: number
  history:        [number, number, number]
}

const props = defineProps<{ budget: Budget }>()
const emit  = defineEmits<{
  edit:   [budget: Budget]
  delete: [id: number]
}>()

const showDeleteConfirm = ref(false)

// Hardcoded color class maps — prevents Tailwind purge issues with dynamic class names
const colorMap: Record<BudgetColor, { bg: string; icon: string; bar: string }> = {
  emerald: { bg: 'bg-emerald-50 border-emerald-100', icon: 'text-emerald-600', bar: 'bg-emerald-500' },
  sky:     { bg: 'bg-sky-50 border-sky-100',         icon: 'text-sky-600',     bar: 'bg-sky-500'     },
  violet:  { bg: 'bg-violet-50 border-violet-100',   icon: 'text-violet-600',  bar: 'bg-violet-500'  },
  amber:   { bg: 'bg-amber-50 border-amber-100',     icon: 'text-amber-600',   bar: 'bg-amber-500'   },
  rose:    { bg: 'bg-rose-50 border-rose-100',       icon: 'text-rose-600',    bar: 'bg-rose-500'    },
}

// ── Status ────────────────────────────────────────────────────────────────────

type Status = 'on-track' | 'heads-up' | 'over'

const status = computed((): Status => {
  const ratio = props.budget.spent / props.budget.limit
  if (ratio >= 1)                        return 'over'
  if (ratio >= props.budget.alertThreshold) return 'heads-up'
  return 'on-track'
})

const statusBadgeColor = computed((): 'error' | 'warning' | 'primary' => {
  if (status.value === 'over')     return 'error'
  if (status.value === 'heads-up') return 'warning'
  return 'primary'
})

const statusLabel = computed(() => {
  if (status.value === 'over')     return 'Over Budget'
  if (status.value === 'heads-up') return 'Heads Up'
  return 'On Track'
})

// ── Visual helpers ────────────────────────────────────────────────────────────

const pct = computed(() => Math.min((props.budget.spent / props.budget.limit) * 100, 100))

const barColorClass = computed(() => {
  if (status.value === 'over')     return 'bg-rose-500'
  if (status.value === 'heads-up') return 'bg-amber-500'
  return colorMap[props.budget.color].bar
})

const stripeClass = computed(() => {
  if (status.value === 'over')     return 'bg-rose-400'
  if (status.value === 'heads-up') return 'bg-amber-400'
  return colorMap[props.budget.color].bar
})

const amountColor = computed(() => {
  if (status.value === 'over')     return 'text-rose-600'
  if (status.value === 'heads-up') return 'text-amber-600'
  return 'text-slate-800'
})

const thresholdLabel = computed(() => {
  if (status.value === 'over') return `$${(props.budget.spent - props.budget.limit).toFixed(0)} over`
  return `Alert at ${Math.round(props.budget.alertThreshold * 100)}%`
})

function sparklineColor(spent: number): string {
  const ratio = spent / props.budget.limit
  if (ratio >= 1)   return '#f43f5e'  // rose-500
  if (ratio >= 0.8) return '#f59e0b'  // amber-500
  return '#10b981'                    // emerald-500
}

// ── Projection ────────────────────────────────────────────────────────────────

const projectedMonthEnd = computed(() => {
  const day = new Date().getDate()
  const daysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate()
  return Math.round((props.budget.spent / day) * daysInMonth)
})

const hasProjectedOverage = computed(() =>
  props.budget.spent < props.budget.limit && projectedMonthEnd.value > props.budget.limit,
)

// ── Formatter ─────────────────────────────────────────────────────────────────

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style:                 'currency',
    currency:              'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}
</script>
