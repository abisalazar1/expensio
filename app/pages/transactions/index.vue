<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-10 space-y-6">

    <!-- ────────────────────────────────────────────────────────────────────
         A. PAGE HEADER
    ──────────────────────────────────────────────────────────────────────── -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Transactions
        </h1>
        <p class="mt-1 text-sm text-slate-500">
          A full record of your income and expenses.
        </p>
      </div>
      <UButton
        to="/transactions/create"
        color="primary"
        size="md"
        leading-icon="i-heroicons-plus"
        class="self-start sm:self-auto shrink-0 font-semibold shadow-sm shadow-emerald-500/20"
      >
        Add transaction
      </UButton>
    </div>

    <!-- ────────────────────────────────────────────────────────────────────
         B. STATS ROW
         TODO: replace with real computed values from GET /api/transactions/stats
    ──────────────────────────────────────────────────────────────────────── -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <DashboardStatCard
        title="Transactions"
        :value="String(allTransactions.length)"
        :change="4"
        change-label="vs last month"
        icon="i-heroicons-clipboard-document-list"
        color="sky"
      />
      <DashboardStatCard
        title="Total Income"
        :value="formatCurrency(totalIncome)"
        :change="8"
        change-label="vs last month"
        icon="i-heroicons-arrow-trending-up"
        color="emerald"
      />
      <DashboardStatCard
        title="Total Expenses"
        :value="formatCurrency(totalExpenses)"
        :change="-12"
        change-label="vs last month"
        icon="i-heroicons-arrow-trending-down"
        color="rose"
      />
      <DashboardStatCard
        title="Net Balance"
        :value="formatCurrency(netBalance)"
        :change="15"
        change-label="vs last month"
        icon="i-heroicons-scale"
        color="violet"
      />
    </div>

    <!-- ────────────────────────────────────────────────────────────────────
         C. FILTER BAR + TRANSACTION LIST
         TODO: wire filters to GET /api/transactions?search=&type=&category=&range=&page=
    ──────────────────────────────────────────────────────────────────────── -->
    <div class="bg-white rounded-2xl border border-slate-200 shadow-sm">

      <!-- Filter bar -->
      <div class="px-5 py-4 border-b border-slate-100 flex flex-col sm:flex-row gap-3 flex-wrap">
        <!-- Search -->
        <div class="flex-1 min-w-48">
          <UInput
            v-model="search"
            placeholder="Search transactions..."
            leading-icon="i-heroicons-magnifying-glass"
            size="sm"
          />
        </div>

        <!-- Type filter pills -->
        <div class="flex items-center gap-1 bg-slate-100 rounded-lg p-1 shrink-0">
          <button
            v-for="t in typeOptions"
            :key="t.value"
            class="px-3 py-1.5 rounded-md text-xs font-semibold transition-all"
            :class="selectedType === t.value
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-500 hover:text-slate-700'"
            @click="selectedType = t.value"
          >
            {{ t.label }}
          </button>
        </div>

        <!-- Category select -->
        <div class="relative shrink-0">
          <UIcon
            name="i-heroicons-tag"
            class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm pointer-events-none z-10"
          />
          <select
            v-model="selectedCategory"
            class="appearance-none pl-8 pr-8 py-2 text-sm font-medium text-slate-700 bg-slate-50 border border-slate-200 rounded-lg hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 cursor-pointer transition-colors"
          >
            <option value="">All categories</option>
            <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
          </select>
          <UIcon
            name="i-heroicons-chevron-down"
            class="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs pointer-events-none"
          />
        </div>

        <!-- Date range select -->
        <div class="relative shrink-0">
          <UIcon
            name="i-heroicons-calendar-days"
            class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm pointer-events-none z-10"
          />
          <select
            v-model="selectedRange"
            class="appearance-none pl-8 pr-8 py-2 text-sm font-medium text-slate-700 bg-slate-50 border border-slate-200 rounded-lg hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 cursor-pointer transition-colors"
          >
            <option v-for="r in dateRanges" :key="r.value" :value="r.value">{{ r.label }}</option>
          </select>
          <UIcon
            name="i-heroicons-chevron-down"
            class="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs pointer-events-none"
          />
        </div>
      </div>

      <!-- Sub-header: result count + sort label -->
      <div class="px-6 py-3 border-b border-slate-100 bg-slate-50/60 flex items-center justify-between">
        <p class="text-xs text-slate-500">
          <template v-if="filteredTransactions.length > 0">
            Showing
            <span class="font-semibold text-slate-700">{{ paginationStart }}–{{ paginationEnd }}</span>
            of
            <span class="font-semibold text-slate-700">{{ filteredTransactions.length }}</span>
            transactions
          </template>
          <template v-else>
            No results
          </template>
        </p>
        <div class="flex items-center gap-1.5 text-xs text-slate-400">
          <UIcon name="i-heroicons-arrows-up-down" class="text-base" />
          <span>Newest first</span>
        </div>
      </div>

      <!-- Transaction rows -->
      <div class="divide-y divide-slate-100">
        <div
          v-for="tx in paginatedTransactions"
          :key="tx.id"
          class="flex items-center gap-4 px-6 py-4 hover:bg-slate-50/70 transition-colors group cursor-pointer"
        >
          <!-- Category icon -->
          <div
            class="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-150 group-hover:scale-105"
            :class="tx.type === 'income'
              ? 'bg-emerald-50 border border-emerald-100'
              : 'bg-rose-50 border border-rose-100'"
          >
            <UIcon
              :name="tx.icon"
              class="text-base"
              :class="tx.type === 'income' ? 'text-emerald-600' : 'text-rose-500'"
            />
          </div>

          <!-- Name + badge -->
          <div class="flex-1 min-w-0">
            <p class="text-sm font-semibold text-slate-800 truncate">{{ tx.name }}</p>
            <div class="flex items-center gap-2 mt-0.5">
              <UBadge
                :color="tx.type === 'income' ? 'primary' : 'neutral'"
                variant="subtle"
                size="xs"
              >
                {{ tx.category }}
              </UBadge>
            </div>
          </div>

          <!-- Date (hidden on mobile) -->
          <div class="hidden md:block shrink-0 text-right">
            <p class="text-xs font-medium text-slate-500">{{ tx.dateLabel }}</p>
            <p class="text-xs text-slate-300 mt-0.5">{{ tx.dateFormatted }}</p>
          </div>

          <!-- Amount -->
          <div class="shrink-0 text-right min-w-20">
            <p
              class="text-sm font-bold tabular-nums"
              :class="tx.type === 'income' ? 'text-emerald-600' : 'text-rose-500'"
            >
              {{ tx.type === 'income' ? '+' : '−' }}{{ formatCurrency(Math.abs(tx.amount)) }}
            </p>
            <p class="text-xs text-slate-400 md:hidden mt-0.5">{{ tx.dateLabel }}</p>
          </div>

          <!-- Row chevron -->
          <div class="shrink-0">
            <UIcon
              name="i-heroicons-chevron-right"
              class="text-slate-300 text-base group-hover:text-slate-400 transition-colors"
            />
          </div>
        </div>
      </div>

      <!-- Empty state -->
      <div
        v-if="filteredTransactions.length === 0"
        class="flex flex-col items-center justify-center py-20 text-center"
      >
        <div class="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
          <UIcon name="i-heroicons-funnel" class="text-2xl text-slate-400" />
        </div>
        <p class="text-sm font-semibold text-slate-700 mb-1">No transactions found</p>
        <p class="text-xs text-slate-400 mb-5">Try adjusting your filters or search term.</p>
        <UButton size="sm" variant="ghost" color="neutral" @click="clearFilters">
          Clear filters
        </UButton>
      </div>

      <!-- Pagination footer -->
      <div
        v-if="totalPages > 1"
        class="px-6 py-4 border-t border-slate-100 flex items-center justify-between gap-4"
      >
        <!-- Result summary -->
        <p class="text-xs text-slate-400 shrink-0 hidden sm:block">
          Page {{ currentPage }} of {{ totalPages }}
        </p>

        <!-- Page controls -->
        <div class="flex items-center gap-1 mx-auto sm:mx-0">
          <!-- Previous -->
          <button
            :disabled="currentPage === 1"
            class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            @click="currentPage--"
          >
            <UIcon name="i-heroicons-chevron-left" class="text-xs" />
            <span class="hidden sm:inline">Previous</span>
          </button>

          <!-- Page numbers -->
          <template v-for="page in visiblePages" :key="String(page)">
            <button
              v-if="page !== '...'"
              class="w-8 h-8 rounded-lg text-sm font-semibold transition-all"
              :class="page === currentPage
                ? 'bg-emerald-500 text-white shadow-sm shadow-emerald-500/30'
                : 'text-slate-600 hover:bg-slate-100'"
              @click="currentPage = page as number"
            >
              {{ page }}
            </button>
            <span
              v-else
              class="w-8 h-8 flex items-center justify-center text-sm text-slate-400 select-none"
            >
              …
            </span>
          </template>

          <!-- Next -->
          <button
            :disabled="currentPage === totalPages"
            class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            @click="currentPage++"
          >
            <span class="hidden sm:inline">Next</span>
            <UIcon name="i-heroicons-chevron-right" class="text-xs" />
          </button>
        </div>

        <!-- Mobile page label -->
        <p class="text-xs text-slate-400 shrink-0 sm:hidden">
          {{ currentPage }} / {{ totalPages }}
        </p>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'

// ── Page meta ─────────────────────────────────────────────────────────────────

definePageMeta({ layout: 'dashboard' })

useSeoMeta({
  title: 'Transactions — Expensio',
  description: 'View and manage all your income and expense transactions.',
})

// ── Types ─────────────────────────────────────────────────────────────────────

interface Transaction {
  id: number
  name: string
  category: string
  icon: string
  date: string        // ISO YYYY-MM-DD for sorting/filtering
  dateLabel: string   // Relative label: "Today", "Yesterday", "Feb 24"
  dateFormatted: string // Full label: "Feb 26, 2026"
  amount: number      // Positive for income, negative for expense
  type: 'income' | 'expense'
}

// ── Constants ─────────────────────────────────────────────────────────────────

const PER_PAGE = 8

// ── Filter state ──────────────────────────────────────────────────────────────

const search = ref('')
const selectedType = ref<'all' | 'income' | 'expense'>('all')
const selectedCategory = ref('')
const selectedRange = ref('this-month')
const currentPage = ref(1)

// ── Filter options ────────────────────────────────────────────────────────────

const typeOptions = [
  { label: 'All',     value: 'all' as const },
  { label: 'Income',  value: 'income' as const },
  { label: 'Expense', value: 'expense' as const },
]

const dateRanges = [
  { label: 'This month',    value: 'this-month' },
  { label: 'Last month',    value: 'last-month' },
  { label: 'Last 3 months', value: 'last-3-months' },
  { label: 'All time',      value: 'all-time' },
]

// ── Mock data ─────────────────────────────────────────────────────────────────
// TODO: GET /api/transactions?search=&type=&category=&range=&page=&per_page=

const allTransactions: Transaction[] = [
  { id: 1,  name: 'Whole Foods Market',   category: 'Food & Drink',  icon: 'i-heroicons-shopping-bag',        date: '2026-02-26', dateLabel: 'Today',     dateFormatted: 'Feb 26, 2026', amount: -82.50,   type: 'expense' },
  { id: 2,  name: 'Freelance Payment',    category: 'Income',        icon: 'i-heroicons-briefcase',           date: '2026-02-26', dateLabel: 'Today',     dateFormatted: 'Feb 26, 2026', amount: 1080.00,  type: 'income'  },
  { id: 3,  name: 'Uber Eats',            category: 'Food & Drink',  icon: 'i-heroicons-truck',               date: '2026-02-25', dateLabel: 'Yesterday', dateFormatted: 'Feb 25, 2026', amount: -34.80,   type: 'expense' },
  { id: 4,  name: 'Coffee Shop',          category: 'Food & Drink',  icon: 'i-heroicons-cake',                date: '2026-02-24', dateLabel: 'Feb 24',    dateFormatted: 'Feb 24, 2026', amount: -7.40,    type: 'expense' },
  { id: 5,  name: 'Spotify Premium',      category: 'Entertainment', icon: 'i-heroicons-musical-note',        date: '2026-02-23', dateLabel: 'Feb 23',    dateFormatted: 'Feb 23, 2026', amount: -9.99,    type: 'expense' },
  { id: 6,  name: 'Electric Bill',        category: 'Utilities',     icon: 'i-heroicons-bolt',                date: '2026-02-23', dateLabel: 'Feb 23',    dateFormatted: 'Feb 23, 2026', amount: -94.20,   type: 'expense' },
  { id: 7,  name: 'Monthly Salary',       category: 'Income',        icon: 'i-heroicons-banknotes',           date: '2026-02-22', dateLabel: 'Feb 22',    dateFormatted: 'Feb 22, 2026', amount: 3200.00,  type: 'income'  },
  { id: 8,  name: 'Netflix',              category: 'Entertainment', icon: 'i-heroicons-tv',                  date: '2026-02-20', dateLabel: 'Feb 20',    dateFormatted: 'Feb 20, 2026', amount: -15.99,   type: 'expense' },
  { id: 9,  name: 'Gym Membership',       category: 'Health',        icon: 'i-heroicons-heart',               date: '2026-02-18', dateLabel: 'Feb 18',    dateFormatted: 'Feb 18, 2026', amount: -29.99,   type: 'expense' },
  { id: 10, name: 'Internet Bill',        category: 'Utilities',     icon: 'i-heroicons-signal',              date: '2026-02-17', dateLabel: 'Feb 17',    dateFormatted: 'Feb 17, 2026', amount: -49.99,   type: 'expense' },
  { id: 11, name: 'Pharmacy',             category: 'Health',        icon: 'i-heroicons-plus-circle',         date: '2026-02-16', dateLabel: 'Feb 16',    dateFormatted: 'Feb 16, 2026', amount: -18.50,   type: 'expense' },
  { id: 12, name: 'Bus Pass',             category: 'Transport',     icon: 'i-heroicons-map',                 date: '2026-02-15', dateLabel: 'Feb 15',    dateFormatted: 'Feb 15, 2026', amount: -45.00,   type: 'expense' },
  { id: 13, name: 'Dinner Out',           category: 'Food & Drink',  icon: 'i-heroicons-cake',                date: '2026-02-14', dateLabel: 'Feb 14',    dateFormatted: 'Feb 14, 2026', amount: -78.00,   type: 'expense' },
  { id: 14, name: 'Side Project Revenue', category: 'Income',        icon: 'i-heroicons-currency-dollar',     date: '2026-02-13', dateLabel: 'Feb 13',    dateFormatted: 'Feb 13, 2026', amount: 350.00,   type: 'income'  },
  { id: 15, name: 'Amazon Purchase',      category: 'Shopping',      icon: 'i-heroicons-shopping-cart',       date: '2026-02-12', dateLabel: 'Feb 12',    dateFormatted: 'Feb 12, 2026', amount: -67.30,   type: 'expense' },
  { id: 16, name: 'Water Bill',           category: 'Utilities',     icon: 'i-heroicons-beaker',              date: '2026-02-11', dateLabel: 'Feb 11',    dateFormatted: 'Feb 11, 2026', amount: -32.00,   type: 'expense' },
  { id: 17, name: 'Fuel',                 category: 'Transport',     icon: 'i-heroicons-truck',               date: '2026-02-10', dateLabel: 'Feb 10',    dateFormatted: 'Feb 10, 2026', amount: -55.00,   type: 'expense' },
  { id: 18, name: 'Book Store',           category: 'Shopping',      icon: 'i-heroicons-book-open',           date: '2026-02-09', dateLabel: 'Feb 9',     dateFormatted: 'Feb 9, 2026',  amount: -24.99,   type: 'expense' },
  { id: 19, name: 'Dividend Payment',     category: 'Income',        icon: 'i-heroicons-chart-bar',           date: '2026-02-07', dateLabel: 'Feb 7',     dateFormatted: 'Feb 7, 2026',  amount: 87.50,    type: 'income'  },
  { id: 20, name: 'Rent',                 category: 'Housing',       icon: 'i-heroicons-home',                date: '2026-02-01', dateLabel: 'Feb 1',     dateFormatted: 'Feb 1, 2026',  amount: -1200.00, type: 'expense' },
]

// ── Derived filter options ────────────────────────────────────────────────────

const categories = computed(() =>
  [...new Set(allTransactions.map(t => t.category))].sort()
)

// ── Stats (computed from full dataset) ────────────────────────────────────────

const totalIncome = computed(() =>
  allTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0)
)

const totalExpenses = computed(() =>
  allTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + Math.abs(t.amount), 0)
)

const netBalance = computed(() => totalIncome.value - totalExpenses.value)

// ── Filtering ─────────────────────────────────────────────────────────────────

const filteredTransactions = computed(() => {
  let result = [...allTransactions]

  // Text search
  const q = search.value.trim().toLowerCase()
  if (q) {
    result = result.filter(t =>
      t.name.toLowerCase().includes(q) || t.category.toLowerCase().includes(q)
    )
  }

  // Type filter
  if (selectedType.value !== 'all') {
    result = result.filter(t => t.type === selectedType.value)
  }

  // Category filter
  if (selectedCategory.value) {
    result = result.filter(t => t.category === selectedCategory.value)
  }

  // Date range filter
  // TODO: replace with real date comparison against today when using live data
  if (selectedRange.value !== 'all-time') {
    const now = new Date()
    const cutoff = new Date(now)
    if (selectedRange.value === 'this-month') {
      cutoff.setDate(1)
    } else if (selectedRange.value === 'last-month') {
      cutoff.setMonth(cutoff.getMonth() - 1)
      cutoff.setDate(1)
    } else if (selectedRange.value === 'last-3-months') {
      cutoff.setMonth(cutoff.getMonth() - 3)
    }
    cutoff.setHours(0, 0, 0, 0)
    result = result.filter(t => new Date(t.date) >= cutoff)
  }

  return result
})

// ── Pagination ────────────────────────────────────────────────────────────────

const totalPages = computed(() =>
  Math.max(1, Math.ceil(filteredTransactions.value.length / PER_PAGE))
)

const paginationStart = computed(() =>
  filteredTransactions.value.length === 0 ? 0 : (currentPage.value - 1) * PER_PAGE + 1
)

const paginationEnd = computed(() =>
  Math.min(currentPage.value * PER_PAGE, filteredTransactions.value.length)
)

const paginatedTransactions = computed(() => {
  const start = (currentPage.value - 1) * PER_PAGE
  return filteredTransactions.value.slice(start, start + PER_PAGE)
})

// Page numbers with ellipsis for large page counts
const visiblePages = computed((): (number | '...')[] => {
  const total = totalPages.value
  const current = currentPage.value

  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }

  const pages: (number | '...')[] = [1]

  if (current > 3) pages.push('...')

  const rangeStart = Math.max(2, current - 1)
  const rangeEnd = Math.min(total - 1, current + 1)
  for (let i = rangeStart; i <= rangeEnd; i++) pages.push(i)

  if (current < total - 2) pages.push('...')

  pages.push(total)

  return pages
})

// Reset to page 1 whenever any filter changes
watch([search, selectedType, selectedCategory, selectedRange], () => {
  currentPage.value = 1
})

// ── Actions ───────────────────────────────────────────────────────────────────

function clearFilters(): void {
  search.value = ''
  selectedType.value = 'all'
  selectedCategory.value = ''
  selectedRange.value = 'this-month'
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value)
}
</script>
