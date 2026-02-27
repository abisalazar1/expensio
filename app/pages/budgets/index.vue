<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-10">

    <!-- ──────────────────────────────────────────────────────────────────────
         A. PAGE HEADER
    ─────────────────────────────────────────────────────────────────────── -->
    <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
      <div>
        <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
          Budgets
        </h1>
        <p class="mt-0.5 text-sm text-slate-500">
          Manage spending limits and track progress for {{ currentMonthLabel }}.
        </p>
      </div>

      <div class="flex flex-wrap items-center gap-3">
        <!-- Period toggle -->
        <div class="flex gap-1 p-1 bg-slate-100 rounded-xl">
          <button
            v-for="p in PERIODS"
            :key="p.value"
            type="button"
            :class="[
              'px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200',
              activePeriod === p.value
                ? 'bg-white text-slate-800 shadow-sm'
                : 'text-slate-500 hover:text-slate-700',
            ]"
            @click="activePeriod = p.value"
          >
            {{ p.label }}
          </button>
        </div>

        <!-- Copy last month -->
        <button
          type="button"
          class="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-800 transition-all shadow-sm"
          @click="copyLastMonth"
        >
          <UIcon name="i-heroicons-document-duplicate" class="text-base" />
          Copy last month
        </button>

        <!-- New budget CTA -->
        <UButton
          color="primary"
          size="sm"
          leading-icon="i-heroicons-plus"
          class="font-semibold shadow-sm shadow-emerald-500/20"
          @click="openCreateModal"
        >
          New Budget
        </UButton>
      </div>
    </div>

    <!-- Copy success alert -->
    <UAlert
      v-if="copySuccess"
      color="primary"
      variant="subtle"
      icon="i-heroicons-check-circle"
      description="Last month's budgets have been applied. Adjust limits as needed."
      class="mb-6"
    />

    <!-- ──────────────────────────────────────────────────────────────────────
         B. STATS STRIP
    ─────────────────────────────────────────────────────────────────────── -->
    <!-- TODO: GET /api/budgets/summary -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <DashboardStatCard
        title="Total Budgeted"
        :value="formatCurrency(totalBudgeted)"
        :change="0"
        change-label="this period"
        icon="i-heroicons-banknotes"
        color="sky"
      />
      <DashboardStatCard
        title="Total Spent"
        :value="formatCurrency(totalSpent)"
        :change="-4"
        change-label="vs last month"
        icon="i-heroicons-arrow-trending-up"
        color="rose"
      />
      <DashboardStatCard
        title="Remaining"
        :value="formatCurrency(totalRemaining)"
        :change="0"
        change-label="left to spend"
        icon="i-heroicons-shield-check"
        color="emerald"
      />
      <DashboardStatCard
        title="Over Budget"
        :value="String(overBudgetCount)"
        :change="0"
        :change-label="`of ${budgets.length} categor${budgets.length === 1 ? 'y' : 'ies'}`"
        icon="i-heroicons-exclamation-triangle"
        color="amber"
      />
    </div>

    <!-- ──────────────────────────────────────────────────────────────────────
         C. BUDGET LIST
    ─────────────────────────────────────────────────────────────────────── -->
    <div class="mb-8">

      <!-- Section header + status filter pills -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <div class="flex items-center gap-2">
          <h2 class="text-base font-bold text-slate-900">Your Budgets</h2>
          <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600">
            {{ budgets.length }}
          </span>
        </div>
        <div class="flex flex-wrap gap-1.5">
          <button
            v-for="f in STATUS_FILTERS"
            :key="f.value"
            type="button"
            :class="[
              'px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-200',
              activeFilter === f.value
                ? statusFilterActiveClass(f.value)
                : 'border-slate-200 bg-white text-slate-500 hover:text-slate-700 hover:border-slate-300',
            ]"
            @click="activeFilter = f.value"
          >
            {{ f.label }}
            <span v-if="f.value !== 'all'" class="ml-1 opacity-60">{{ filterCount(f.value) }}</span>
          </button>
        </div>
      </div>

      <!-- Budget cards grid -->
      <div v-if="filteredBudgets.length" class="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <BudgetsBudgetCard
          v-for="budget in filteredBudgets"
          :key="budget.id"
          :budget="budget"
          @edit="openEditModal"
          @delete="deleteBudget"
        />
      </div>

      <!-- Empty state -->
      <div v-else class="bg-white rounded-2xl border border-slate-200 shadow-sm p-14 text-center">
        <UIcon name="i-heroicons-chart-bar" class="text-4xl text-slate-300 mb-3" />
        <p class="text-base font-semibold text-slate-700 mb-1">
          {{ activeFilter === 'all' ? 'No budgets yet' : `No "${statusFilterLabel}" budgets` }}
        </p>
        <p class="text-sm text-slate-400 mb-5">
          {{
            activeFilter === 'all'
              ? 'Create your first budget to start tracking your spending.'
              : 'Great — no categories fall in this range right now.'
          }}
        </p>
        <UButton
          v-if="activeFilter === 'all'"
          color="primary"
          size="sm"
          leading-icon="i-heroicons-plus"
          @click="openCreateModal"
        >
          Create Budget
        </UButton>
        <button
          v-else
          type="button"
          class="text-sm text-slate-400 hover:text-slate-600 transition-colors"
          @click="activeFilter = 'all'"
        >
          View all budgets
        </button>
      </div>
    </div>

    <!-- ──────────────────────────────────────────────────────────────────────
         D. BUDGET VS ACTUAL CHART
    ─────────────────────────────────────────────────────────────────────── -->
    <BudgetsBudgetVsActualChart
      v-if="budgets.length"
      :budgets="budgets"
      :month-label="currentMonthLabel"
    />

    <!-- ──────────────────────────────────────────────────────────────────────
         E. MONTHLY HISTORY (collapsible)
    ─────────────────────────────────────────────────────────────────────── -->
    <!-- TODO: GET /api/budgets/history -->
    <div v-if="budgets.length" class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <button
        type="button"
        class="w-full flex items-center justify-between px-6 py-4 hover:bg-slate-50 transition-colors"
        @click="showHistory = !showHistory"
      >
        <div class="flex items-center gap-2">
          <h2 class="text-base font-bold text-slate-900">Monthly History</h2>
          <span class="text-xs text-slate-400 font-normal">last 3 months</span>
        </div>
        <UIcon
          :name="showHistory ? 'i-heroicons-chevron-up' : 'i-heroicons-chevron-down'"
          class="text-slate-400 text-base"
        />
      </button>

      <div v-show="showHistory" class="overflow-x-auto border-t border-slate-100">
        <table class="w-full text-sm">
          <thead>
            <tr class="bg-slate-50 border-b border-slate-100">
              <th class="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Category
              </th>
              <th
                v-for="month in historyMonths"
                :key="month.label"
                class="px-5 py-3 text-center text-xs font-semibold text-slate-500 uppercase tracking-wide whitespace-nowrap"
              >
                {{ month.label }}
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-50">
            <tr
              v-for="budget in budgets"
              :key="budget.id"
              class="hover:bg-slate-50/50 transition-colors"
            >
              <td class="px-5 py-3.5">
                <div class="flex items-center gap-2">
                  <UIcon :name="budget.icon" :class="['text-sm shrink-0', colorMap[budget.color].icon]" />
                  <span class="text-sm font-medium text-slate-700">{{ budget.name }}</span>
                </div>
              </td>
              <td v-for="(histSpent, i) in budget.history" :key="i" class="px-5 py-3.5 text-center">
                <div class="inline-flex flex-col items-center gap-0.5">
                  <div class="flex items-center gap-1">
                    <span
                      class="w-2 h-2 rounded-full inline-block shrink-0"
                      :class="historyDotClass(histSpent, budget.limit)"
                    />
                    <span class="text-xs font-semibold text-slate-700 tabular-nums">
                      {{ formatCurrency(histSpent) }}
                    </span>
                  </div>
                  <span class="text-[10px] text-slate-400 tabular-nums">
                    / {{ formatCurrency(budget.limit) }}
                  </span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- ──────────────────────────────────────────────────────────────────────
         F. CREATE / EDIT MODAL
    ─────────────────────────────────────────────────────────────────────── -->
    <Transition name="modal">
      <div
        v-if="showModal"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
        @click.self="closeModal"
      >
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" @click="closeModal" />

        <!-- Modal panel -->
        <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-md z-10 overflow-hidden">

          <!-- Modal header -->
          <div class="flex items-center justify-between px-6 py-5 border-b border-slate-100">
            <h2 class="text-base font-bold text-slate-900">
              {{ editingBudget ? 'Edit Budget' : 'New Budget' }}
            </h2>
            <button
              type="button"
              class="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all"
              @click="closeModal"
            >
              <UIcon name="i-heroicons-x-mark" class="text-base" />
            </button>
          </div>

          <!-- Modal body -->
          <div class="px-6 py-5 space-y-5 max-h-[65vh] overflow-y-auto">

            <!-- Category -->
            <div>
              <label class="block text-xs font-semibold text-slate-600 mb-1.5">
                Category <span class="text-rose-500">*</span>
              </label>
              <div class="relative">
                <div class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 z-10">
                  <UIcon
                    :name="CATEGORY_ICONS[modalForm.name] ?? 'i-heroicons-tag'"
                    class="text-slate-400 text-base"
                  />
                </div>
                <select
                  v-model="modalForm.name"
                  :disabled="!!editingBudget"
                  class="w-full appearance-none bg-white border border-slate-200 rounded-lg pl-9 pr-8 py-2.5 text-sm text-slate-700 font-medium shadow-sm outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-400 transition-all hover:border-slate-300 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <option value="">Select a category</option>
                  <option v-for="cat in availableCategories" :key="cat" :value="cat">{{ cat }}</option>
                </select>
                <div class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
                  <UIcon name="i-heroicons-chevron-down" class="text-slate-400 text-sm" />
                </div>
              </div>
            </div>

            <!-- Budget limit -->
            <div>
              <label class="block text-xs font-semibold text-slate-600 mb-1.5">
                Budget limit <span class="text-rose-500">*</span>
              </label>
              <UInput
                v-model="modalForm.limit"
                type="number"
                placeholder="0"
                :min="1"
                :step="1"
                size="lg"
                class="w-full"
              >
                <template #leading>
                  <span class="text-slate-400 text-sm font-medium select-none">$</span>
                </template>
              </UInput>
            </div>

            <!-- Period -->
            <div>
              <label class="block text-xs font-semibold text-slate-600 mb-1.5">Period</label>
              <div class="grid grid-cols-3 gap-2 p-1 bg-slate-100 rounded-xl">
                <button
                  v-for="p in PERIODS"
                  :key="p.value"
                  type="button"
                  :class="[
                    'py-2 rounded-lg text-xs font-semibold transition-all duration-200',
                    modalForm.period === p.value
                      ? 'bg-white text-slate-800 shadow-sm'
                      : 'text-slate-500 hover:text-slate-700',
                  ]"
                  @click="modalForm.period = p.value"
                >
                  {{ p.label }}
                </button>
              </div>
            </div>

            <!-- Color -->
            <div>
              <label class="block text-xs font-semibold text-slate-600 mb-2">Color</label>
              <div class="flex gap-2.5">
                <button
                  v-for="c in BUDGET_COLORS"
                  :key="c.value"
                  type="button"
                  :class="[
                    'w-8 h-8 rounded-full border-2 transition-all duration-150 flex items-center justify-center',
                    c.bg,
                    modalForm.color === c.value
                      ? 'border-slate-800 scale-110'
                      : 'border-transparent hover:scale-110',
                  ]"
                  :aria-label="`Color: ${c.value}`"
                  @click="modalForm.color = c.value"
                >
                  <UIcon
                    v-if="modalForm.color === c.value"
                    name="i-heroicons-check"
                    class="text-white text-xs"
                  />
                </button>
              </div>
            </div>

            <!-- Alert threshold -->
            <div>
              <label class="block text-xs font-semibold text-slate-600 mb-1.5">
                Alert me when spending reaches
              </label>
              <div class="grid grid-cols-4 gap-2">
                <button
                  v-for="t in ALERT_THRESHOLDS"
                  :key="t.value"
                  type="button"
                  :class="[
                    'py-2 rounded-lg text-xs font-semibold border transition-all',
                    modalForm.alertThreshold === t.value
                      ? 'border-amber-300 bg-amber-50 text-amber-700'
                      : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:text-slate-700',
                  ]"
                  @click="modalForm.alertThreshold = t.value"
                >
                  {{ t.label }}
                </button>
              </div>
            </div>

            <!-- Rollover toggle -->
            <button
              type="button"
              :class="[
                'flex items-center gap-3 w-full p-3.5 rounded-xl border transition-all text-left',
                modalForm.rollover
                  ? 'border-emerald-200 bg-emerald-50'
                  : 'border-slate-200 bg-white hover:bg-slate-50',
              ]"
              @click="modalForm.rollover = !modalForm.rollover"
            >
              <div
                :class="[
                  'w-5 h-5 rounded flex items-center justify-center shrink-0 border transition-all',
                  modalForm.rollover
                    ? 'bg-emerald-500 border-emerald-500'
                    : 'border-slate-300 bg-white',
                ]"
              >
                <UIcon
                  v-if="modalForm.rollover"
                  name="i-heroicons-check"
                  class="text-white text-[10px]"
                />
              </div>
              <div>
                <p class="text-sm font-semibold text-slate-700">Roll over unused budget</p>
                <p class="text-xs text-slate-400 mt-0.5">Carry remaining amount to the next period</p>
              </div>
            </button>

            <!-- Modal error -->
            <UAlert
              v-if="modalError"
              color="error"
              variant="subtle"
              icon="i-heroicons-exclamation-circle"
              :description="modalError"
            />
          </div>

          <!-- Modal footer -->
          <div class="px-6 py-4 border-t border-slate-100 flex gap-3">
            <button
              type="button"
              class="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-all shadow-sm"
              @click="closeModal"
            >
              Cancel
            </button>
            <UButton
              color="primary"
              size="md"
              :loading="modalSaving"
              :disabled="modalSaving"
              leading-icon="i-heroicons-check"
              class="flex-1 font-semibold shadow-sm shadow-emerald-500/20"
              @click="saveBudget"
            >
              {{ editingBudget ? 'Save Changes' : 'Create Budget' }}
            </UButton>
          </div>

        </div>
      </div>
    </Transition>

  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'

// ── Page meta ─────────────────────────────────────────────────────────────────

definePageMeta({ layout: 'dashboard' })

useSeoMeta({
  title: 'Budgets — Expensio',
  description: 'Manage your spending limits and track budget progress.',
})

// ── Types ─────────────────────────────────────────────────────────────────────

type BudgetPeriod = 'monthly' | 'weekly' | 'yearly'
type BudgetColor  = 'emerald' | 'sky' | 'violet' | 'amber' | 'rose'
type BudgetStatus = 'on-track' | 'heads-up' | 'over'

interface Budget {
  id:             number
  name:           string
  icon:           string
  color:          BudgetColor
  limit:          number
  spent:          number
  period:         BudgetPeriod
  rollover:       boolean
  alertThreshold: number        // fraction e.g. 0.8 = 80%
  history:        [number, number, number]  // spent for oldest → newest 3 months
}

// ── Constants ─────────────────────────────────────────────────────────────────

const PERIODS = [
  { label: 'Monthly', value: 'monthly' as BudgetPeriod },
  { label: 'Weekly',  value: 'weekly'  as BudgetPeriod },
  { label: 'Yearly',  value: 'yearly'  as BudgetPeriod },
]

const STATUS_FILTERS = [
  { label: 'All',         value: 'all' },
  { label: 'On Track',    value: 'on-track' },
  { label: 'Heads Up',    value: 'heads-up' },
  { label: 'Over Budget', value: 'over' },
]

const ALERT_THRESHOLDS = [
  { label: '70%', value: 0.70 },
  { label: '80%', value: 0.80 },
  { label: '90%', value: 0.90 },
  { label: '95%', value: 0.95 },
]

const BUDGET_COLORS: { value: BudgetColor; bg: string }[] = [
  { value: 'emerald', bg: 'bg-emerald-500' },
  { value: 'sky',     bg: 'bg-sky-500'     },
  { value: 'violet',  bg: 'bg-violet-500'  },
  { value: 'amber',   bg: 'bg-amber-500'   },
  { value: 'rose',    bg: 'bg-rose-500'    },
]

const CATEGORY_ICONS: Record<string, string> = {
  'Food & Drink':  'i-heroicons-shopping-bag',
  'Housing':       'i-heroicons-home',
  'Transport':     'i-heroicons-truck',
  'Utilities':     'i-heroicons-bolt',
  'Health':        'i-heroicons-heart',
  'Entertainment': 'i-heroicons-tv',
  'Shopping':      'i-heroicons-shopping-cart',
  'Other':         'i-heroicons-ellipsis-horizontal-circle',
}

const ALL_CATEGORIES = Object.keys(CATEGORY_ICONS)

// Hardcoded color class maps — prevents Tailwind purge issues with dynamic class names
const colorMap: Record<BudgetColor, { bg: string; icon: string; bar: string }> = {
  emerald: { bg: 'bg-emerald-50 border-emerald-100', icon: 'text-emerald-600', bar: 'bg-emerald-500' },
  sky:     { bg: 'bg-sky-50 border-sky-100',         icon: 'text-sky-600',     bar: 'bg-sky-500'     },
  violet:  { bg: 'bg-violet-50 border-violet-100',   icon: 'text-violet-600',  bar: 'bg-violet-500'  },
  amber:   { bg: 'bg-amber-50 border-amber-100',     icon: 'text-amber-600',   bar: 'bg-amber-500'   },
  rose:    { bg: 'bg-rose-50 border-rose-100',       icon: 'text-rose-600',    bar: 'bg-rose-500'    },
}

// ── Mock data ─────────────────────────────────────────────────────────────────

// TODO: GET /api/budgets
const budgets = ref<Budget[]>([
  { id: 1, name: 'Food & Drink',  icon: 'i-heroicons-shopping-bag', color: 'emerald', limit: 400, spent: 340, period: 'monthly', rollover: false, alertThreshold: 0.80, history: [310, 380, 340] },
  { id: 2, name: 'Transport',     icon: 'i-heroicons-truck',         color: 'sky',     limit: 150, spent: 95,  period: 'monthly', rollover: false, alertThreshold: 0.80, history: [120, 100,  95] },
  { id: 3, name: 'Entertainment', icon: 'i-heroicons-tv',            color: 'violet',  limit: 80,  spent: 72,  period: 'monthly', rollover: false, alertThreshold: 0.80, history: [ 90,  65,  72] },
  { id: 4, name: 'Shopping',      icon: 'i-heroicons-shopping-cart', color: 'rose',    limit: 200, spent: 215, period: 'monthly', rollover: false, alertThreshold: 0.80, history: [150, 180, 215] },
  { id: 5, name: 'Utilities',     icon: 'i-heroicons-bolt',          color: 'amber',   limit: 120, spent: 98,  period: 'monthly', rollover: true,  alertThreshold: 0.90, history: [105, 110,  98] },
  { id: 6, name: 'Health',        icon: 'i-heroicons-heart',         color: 'emerald', limit: 100, spent: 45,  period: 'monthly', rollover: false, alertThreshold: 0.80, history: [ 30,  60,  45] },
])

// ── Reactive page state ───────────────────────────────────────────────────────

const activePeriod    = ref<BudgetPeriod>('monthly')
const activeFilter = ref('all')
const copySuccess  = ref(false)
const showHistory  = ref(false)

// ── Modal state ───────────────────────────────────────────────────────────────

const showModal     = ref(false)
const editingBudget = ref<Budget | null>(null)
const modalSaving   = ref(false)
const modalError    = ref<string | null>(null)

const modalForm = reactive({
  name:           '',
  color:          'emerald' as BudgetColor,
  limit:          null as number | null,
  period:         'monthly' as BudgetPeriod,
  rollover:       false,
  alertThreshold: 0.8,
})

// ── Computed stats ────────────────────────────────────────────────────────────

const totalBudgeted   = computed(() => budgets.value.reduce((s, b) => s + b.limit, 0))
const totalSpent      = computed(() => budgets.value.reduce((s, b) => s + b.spent, 0))
const totalRemaining  = computed(() => totalBudgeted.value - totalSpent.value)
const overBudgetCount = computed(() => budgets.value.filter(b => b.spent > b.limit).length)
const filteredBudgets = computed(() => {
  if (activeFilter.value === 'all') return budgets.value
  return budgets.value.filter(b => budgetStatus(b) === activeFilter.value)
})

const availableCategories = computed(() => {
  if (editingBudget.value) return ALL_CATEGORIES
  const used = new Set(budgets.value.map(b => b.name))
  return ALL_CATEGORIES.filter(c => !used.has(c))
})

// ── Date helpers ──────────────────────────────────────────────────────────────

const currentMonthLabel = computed(() =>
  new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
)

const historyMonths = computed(() => {
  // Returns the 3 months corresponding to history[0], [1], [2] (oldest → newest)
  return [2, 1, 0].map((monthsAgo) => {
    const d = new Date()
    d.setMonth(d.getMonth() - monthsAgo)
    return { label: d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }) }
  })
})

// ── Budget status helpers ─────────────────────────────────────────────────────

function budgetStatus(b: Budget): BudgetStatus {
  const pct = b.spent / b.limit
  if (pct >= 1) return 'over'
  if (pct >= b.alertThreshold) return 'heads-up'
  return 'on-track'
}

// ── History dot ───────────────────────────────────────────────────────────────

function historyDotClass(spent: number, limit: number): string {
  const pct = spent / limit
  if (pct >= 1)   return 'bg-rose-500'
  if (pct >= 0.8) return 'bg-amber-500'
  return 'bg-emerald-500'
}

// ── Filter helpers ────────────────────────────────────────────────────────────

function filterCount(status: string): number {
  return budgets.value.filter(b => budgetStatus(b) === status).length
}

function statusFilterActiveClass(filter: string): string {
  if (filter === 'over')      return 'border-rose-200 bg-rose-50 text-rose-700'
  if (filter === 'heads-up')  return 'border-amber-200 bg-amber-50 text-amber-700'
  if (filter === 'on-track')  return 'border-emerald-200 bg-emerald-50 text-emerald-700'
  return 'border-slate-300 bg-slate-100 text-slate-700'
}

const statusFilterLabel = computed(() =>
  STATUS_FILTERS.find(f => f.value === activeFilter.value)?.label ?? activeFilter.value,
)


// ── Modal operations ──────────────────────────────────────────────────────────

function openCreateModal(): void {
  editingBudget.value      = null
  modalForm.name           = ''
  modalForm.color          = 'emerald'
  modalForm.limit          = null
  modalForm.period         = activePeriod.value
  modalForm.rollover       = false
  modalForm.alertThreshold = 0.8
  modalError.value         = null
  showModal.value          = true
}

function openEditModal(b: Budget): void {
  editingBudget.value      = b
  modalForm.name           = b.name
  modalForm.color          = b.color
  modalForm.limit          = b.limit
  modalForm.period         = b.period
  modalForm.rollover       = b.rollover
  modalForm.alertThreshold = b.alertThreshold
  modalError.value         = null
  showModal.value          = true
}

function closeModal(): void {
  showModal.value     = false
  editingBudget.value = null
}

async function saveBudget(): Promise<void> {
  if (!modalForm.name) {
    modalError.value = 'Please select a category.'
    return
  }
  if (!modalForm.limit || Number(modalForm.limit) <= 0) {
    modalError.value = 'Please enter a valid budget limit.'
    return
  }
  modalSaving.value = true
  modalError.value  = null
  try {
    // TODO: POST /api/budgets  or  PATCH /api/budgets/:id
    await new Promise(resolve => setTimeout(resolve, 400))

    if (editingBudget.value) {
      const idx = budgets.value.findIndex(b => b.id === editingBudget.value!.id)
      if (idx !== -1) {
        budgets.value[idx] = {
          ...budgets.value[idx]!,
          color:          modalForm.color,
          limit:          Number(modalForm.limit),
          period:         modalForm.period,
          rollover:       modalForm.rollover,
          alertThreshold: modalForm.alertThreshold,
        }
      }
    } else {
      budgets.value.push({
        id:             Date.now(),
        name:           modalForm.name,
        icon:           CATEGORY_ICONS[modalForm.name] ?? 'i-heroicons-tag',
        color:          modalForm.color,
        limit:          Number(modalForm.limit),
        spent:          0,
        period:         modalForm.period,
        rollover:       modalForm.rollover,
        alertThreshold: modalForm.alertThreshold,
        history:        [0, 0, 0],
      })
    }
    closeModal()
  } catch {
    modalError.value = 'Failed to save. Please try again.'
  } finally {
    modalSaving.value = false
  }
}

// ── Delete ────────────────────────────────────────────────────────────────────

function deleteBudget(id: number): void {
  budgets.value = budgets.value.filter(b => b.id !== id)
  // TODO: DELETE /api/budgets/:id
}

// ── Copy last month ───────────────────────────────────────────────────────────

function copyLastMonth(): void {
  // TODO: POST /api/budgets/copy-last-month
  copySuccess.value = true
  setTimeout(() => { copySuccess.value = false }, 4000)
}

// ── Formatters ────────────────────────────────────────────────────────────────

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style:                 'currency',
    currency:              'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
