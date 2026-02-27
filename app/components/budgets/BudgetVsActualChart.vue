<template>
  <!-- TODO: GET /api/budgets/comparison -->
  <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 mb-6">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
      <div>
        <h2 class="text-base font-bold text-slate-900">Budget vs Actual</h2>
        <p class="text-sm text-slate-400 mt-0.5">All categories for {{ monthLabel }}</p>
      </div>
      <div class="flex items-center gap-4 text-xs text-slate-500">
        <span class="flex items-center gap-1.5">
          <span class="w-3 h-2.5 rounded-sm bg-slate-300 inline-block" />
          Budget limit
        </span>
        <span class="flex items-center gap-1.5">
          <span class="w-3 h-2.5 rounded-sm bg-emerald-400 inline-block" />
          Amount spent
        </span>
      </div>
    </div>

    <!-- Per-category rows -->
    <div class="space-y-5">
      <div v-for="budget in sortedByLimit" :key="budget.id" class="flex items-center gap-4">
        <!-- Category label -->
        <div class="w-32 shrink-0 flex items-center gap-2">
          <UIcon :name="budget.icon" :class="['text-sm shrink-0', colorMap[budget.color].icon]" />
          <span class="text-xs font-medium text-slate-600 truncate">{{ budget.name }}</span>
        </div>

        <!-- Bar tracks -->
        <div class="flex-1 space-y-1.5">
          <!-- Budget limit bar -->
          <div class="h-2.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              class="h-full bg-slate-300 rounded-full transition-all duration-500"
              :style="{ width: `${(budget.limit / maxBudgetLimit) * 100}%` }"
            />
          </div>
          <!-- Spent bar -->
          <div class="h-2.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              class="h-full rounded-full transition-all duration-500"
              :class="budgetBarColorClass(budget)"
              :style="{ width: `${Math.min((budget.spent / maxBudgetLimit) * 100, 100)}%` }"
            />
          </div>
        </div>

        <!-- Amounts -->
        <div class="w-24 shrink-0 text-right">
          <p class="text-xs font-semibold text-slate-700 tabular-nums">{{ formatCurrency(budget.spent) }}</p>
          <p class="text-[10px] text-slate-400 tabular-nums">/ {{ formatCurrency(budget.limit) }}</p>
        </div>
      </div>
    </div>

    <!-- Overall totals row -->
    <div class="mt-6 pt-5 border-t border-slate-100 flex items-center gap-4">
      <div class="w-32 shrink-0">
        <span class="text-xs font-bold text-slate-700">Overall</span>
      </div>
      <div class="flex-1">
        <div class="h-2.5 bg-slate-100 rounded-full overflow-hidden">
          <div
            class="h-full rounded-full transition-all duration-500"
            :class="overallBarColor"
            :style="{ width: `${Math.min(overallPct * 100, 100)}%` }"
          />
        </div>
      </div>
      <div class="w-24 shrink-0 text-right">
        <p class="text-xs font-semibold text-slate-700">{{ Math.round(overallPct * 100) }}% used</p>
        <p class="text-[10px] text-slate-400 tabular-nums">
          {{ formatCurrency(totalSpent) }} / {{ formatCurrency(totalBudgeted) }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

type BudgetColor = 'emerald' | 'sky' | 'violet' | 'amber' | 'rose'

interface Budget {
  id:     number
  name:   string
  icon:   string
  color:  BudgetColor
  limit:  number
  spent:  number
  alertThreshold: number
}

const props = defineProps<{
  budgets:    Budget[]
  monthLabel: string
}>()

// Hardcoded color class maps — prevents Tailwind purge issues with dynamic class names
const colorMap: Record<BudgetColor, { icon: string; bar: string }> = {
  emerald: { icon: 'text-emerald-600', bar: 'bg-emerald-500' },
  sky:     { icon: 'text-sky-600',     bar: 'bg-sky-500'     },
  violet:  { icon: 'text-violet-600',  bar: 'bg-violet-500'  },
  amber:   { icon: 'text-amber-600',   bar: 'bg-amber-500'   },
  rose:    { icon: 'text-rose-600',    bar: 'bg-rose-500'    },
}

const sortedByLimit  = computed(() => [...props.budgets].sort((a, b) => b.limit - a.limit))
const maxBudgetLimit = computed(() => Math.max(...props.budgets.map(b => b.limit), 1))
const totalBudgeted  = computed(() => props.budgets.reduce((s, b) => s + b.limit, 0))
const totalSpent     = computed(() => props.budgets.reduce((s, b) => s + b.spent, 0))
const overallPct     = computed(() => totalBudgeted.value > 0 ? totalSpent.value / totalBudgeted.value : 0)

const overallBarColor = computed(() => {
  if (overallPct.value >= 1)   return 'bg-rose-500'
  if (overallPct.value >= 0.8) return 'bg-amber-500'
  return 'bg-emerald-500'
})

function budgetBarColorClass(b: Budget): string {
  const pct = b.spent / b.limit
  if (pct >= 1)               return 'bg-rose-500'
  if (pct >= b.alertThreshold) return 'bg-amber-500'
  return colorMap[b.color].bar
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style:                 'currency',
    currency:              'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}
</script>
