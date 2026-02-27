<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-10 space-y-6">

    <!-- ────────────────────────────────────────────────────────────────────
         A. PAGE HEADER
    ──────────────────────────────────────────────────────────────────────── -->
    <div>
      <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Reports</h1>
      <p class="mt-1 text-sm text-slate-500">
        Select a date range and categories to build a custom chart.
      </p>
    </div>

    <!-- ────────────────────────────────────────────────────────────────────
         B. FILTER BAR
    ──────────────────────────────────────────────────────────────────────── -->
    <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-5 space-y-4">

      <!-- Row 1: date presets + chart type toggle -->
      <div class="flex flex-col sm:flex-row sm:items-center gap-3">

        <!-- Date presets -->
        <div class="flex flex-wrap gap-1.5">
          <button
            v-for="preset in DATE_PRESETS"
            :key="preset.key"
            class="px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all"
            :class="activePreset === preset.key
              ? 'bg-slate-800 text-white border-slate-800 shadow-sm'
              : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300 hover:text-slate-700'"
            @click="activePreset = preset.key"
          >
            {{ preset.label }}
          </button>
        </div>

        <div class="flex-1" />

        <!-- Chart type toggle -->
        <div class="flex items-center p-1 bg-slate-100 rounded-xl gap-0.5 self-start sm:self-auto">
          <button
            v-for="ct in CHART_TYPES"
            :key="ct.key"
            class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
            :class="chartType === ct.key
              ? 'bg-white text-slate-800 shadow-sm'
              : 'text-slate-500 hover:text-slate-700'"
            @click="chartType = ct.key"
          >
            <UIcon :name="ct.icon" class="text-sm" />
            {{ ct.label }}
          </button>
        </div>
      </div>

      <!-- Divider -->
      <div class="border-t border-slate-100" />

      <!-- Row 2: category chips -->
      <div>
        <div class="flex items-center justify-between mb-2.5">
          <p class="text-xs font-semibold text-slate-400 uppercase tracking-wide">Filter by category</p>
          <button
            v-if="selectedCategories.length > 0"
            class="text-xs text-emerald-600 hover:text-emerald-700 font-medium transition-colors"
            @click="selectedCategories = []"
          >
            Clear all
          </button>
        </div>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="cat in CATEGORIES"
            :key="cat.label"
            class="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all"
            :class="selectedCategories.includes(cat.label)
              ? 'bg-emerald-500 text-white border-emerald-500 shadow-sm'
              : 'bg-white text-slate-600 border-slate-200 hover:border-emerald-300 hover:text-emerald-700'"
            @click="toggleCategory(cat.label)"
          >
            <UIcon :name="cat.icon" class="text-xs" />
            {{ cat.label }}
          </button>
        </div>
      </div>
    </div>

    <!-- ────────────────────────────────────────────────────────────────────
         C. SUMMARY STRIP
         TODO: GET /api/reports/summary?from=...&to=...&categories=...
    ──────────────────────────────────────────────────────────────────────── -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">

      <!-- Total income -->
      <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex items-center gap-4">
        <div class="w-11 h-11 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0">
          <UIcon name="i-heroicons-arrow-trending-up" class="text-emerald-600 text-lg" />
        </div>
        <div class="min-w-0">
          <p class="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-0.5">Total Income</p>
          <p class="text-xl font-extrabold text-emerald-600 tabular-nums truncate">{{ fmt(totalIncome) }}</p>
          <p class="text-xs text-slate-400 mt-0.5">{{ activePeriodLabel }}</p>
        </div>
      </div>

      <!-- Total expenses -->
      <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex items-center gap-4">
        <div class="w-11 h-11 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center shrink-0">
          <UIcon name="i-heroicons-arrow-trending-down" class="text-rose-500 text-lg" />
        </div>
        <div class="min-w-0">
          <p class="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-0.5">
            Total Expenses{{ selectedCategories.length ? ` (${categoryLabel})` : '' }}
          </p>
          <p class="text-xl font-extrabold text-rose-500 tabular-nums truncate">{{ fmt(totalExpenses) }}</p>
          <p class="text-xs text-slate-400 mt-0.5">{{ activePeriodLabel }}</p>
        </div>
      </div>

      <!-- Net balance -->
      <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex items-center gap-4">
        <div
          class="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
          :class="netBalance >= 0
            ? 'bg-sky-50 border border-sky-100'
            : 'bg-rose-50 border border-rose-100'"
        >
          <UIcon
            name="i-heroicons-banknotes"
            class="text-lg"
            :class="netBalance >= 0 ? 'text-sky-600' : 'text-rose-500'"
          />
        </div>
        <div class="min-w-0">
          <p class="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-0.5">Net Balance</p>
          <p
            class="text-xl font-extrabold tabular-nums truncate"
            :class="netBalance >= 0 ? 'text-sky-600' : 'text-rose-500'"
          >
            {{ netBalance >= 0 ? '' : '-' }}{{ fmt(Math.abs(netBalance)) }}
          </p>
          <p class="text-xs text-slate-400 mt-0.5">Income minus expenses</p>
        </div>
      </div>
    </div>

    <!-- ────────────────────────────────────────────────────────────────────
         D. CHART CARD
         TODO: GET /api/reports/chart?type=...&from=...&to=...&categories=...
    ──────────────────────────────────────────────────────────────────────── -->
    <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">

      <!-- Card header -->
      <div class="flex items-start justify-between mb-5">
        <div>
          <h2 class="text-base font-bold text-slate-900">{{ chartTitle }}</h2>
          <p class="text-sm text-slate-400 mt-0.5">
            {{ activePeriodLabel }}{{ selectedCategories.length ? ` · ${categoryLabel}` : '' }}
          </p>
        </div>
        <!-- Active chart type badge -->
        <div class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 shrink-0">
          <UIcon :name="activeChartType.icon" class="text-slate-400 text-sm" />
          <span class="text-xs font-medium text-slate-500">{{ activeChartType.label }}</span>
        </div>
      </div>

      <!-- Charts are canvas-based — must render client-side only -->
      <ClientOnly>
        <template #fallback>
          <div class="flex items-center justify-center h-90">
            <div class="flex flex-col items-center gap-3">
              <div class="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
              <p class="text-xs text-slate-400">Loading chart…</p>
            </div>
          </div>
        </template>

        <!-- ── Bar chart ── -->
        <template v-if="chartType === 'bar'">
          <div v-if="barData.length === 0" class="flex flex-col items-center justify-center h-64 text-center">
            <div class="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mb-3">
              <UIcon name="i-heroicons-chart-bar" class="text-2xl text-slate-300" />
            </div>
            <p class="text-sm font-semibold text-slate-500">No data for this selection</p>
            <p class="text-xs text-slate-400 mt-1">Try selecting a wider date range.</p>
          </div>
          <ReportsBarChart v-else :data="barData" :height="360" />
        </template>

        <!-- ── Line chart ── -->
        <template v-else-if="chartType === 'line'">
          <div v-if="lineData.every(d => d.value === 0)" class="flex flex-col items-center justify-center h-64 text-center">
            <div class="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mb-3">
              <UIcon name="i-heroicons-presentation-chart-line" class="text-2xl text-slate-300" />
            </div>
            <p class="text-sm font-semibold text-slate-500">No expense data for this selection</p>
            <p class="text-xs text-slate-400 mt-1">Try a different category or date range.</p>
          </div>
          <ReportsLineChart v-else :data="lineData" :height="360" />
        </template>

        <!-- ── Donut chart ── -->
        <template v-else-if="chartType === 'donut'">
          <div v-if="donutData.length === 0" class="flex flex-col items-center justify-center h-64 text-center">
            <div class="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mb-3">
              <UIcon name="i-heroicons-chart-pie" class="text-2xl text-slate-300" />
            </div>
            <p class="text-sm font-semibold text-slate-500">No expense data for this selection</p>
            <p class="text-xs text-slate-400 mt-1">Try a different category or date range.</p>
          </div>
          <div v-else class="flex items-center justify-center py-4">
            <ReportsDonutChart :data="donutData" :size="220" />
          </div>
        </template>
      </ClientOnly>

    </div>

    <!-- ────────────────────────────────────────────────────────────────────
         E. TOP CATEGORIES BREAKDOWN (bar + line modes only)
         TODO: included in GET /api/reports/chart response
    ──────────────────────────────────────────────────────────────────────── -->
    <div
      v-if="chartType !== 'donut' && topCategories.length > 0"
      class="bg-white rounded-2xl border border-slate-200 shadow-sm"
    >
      <!-- Section header -->
      <div class="flex items-center justify-between px-6 py-4 border-b border-slate-100">
        <div>
          <h2 class="text-sm font-bold text-slate-900">Spending by Category</h2>
          <p class="text-xs text-slate-400 mt-0.5">Expenses only · {{ activePeriodLabel }}</p>
        </div>
        <UBadge color="neutral" variant="subtle" size="xs">
          {{ topCategories.length }} {{ topCategories.length === 1 ? 'category' : 'categories' }}
        </UBadge>
      </div>

      <!-- Category rows -->
      <div class="divide-y divide-slate-50">
        <div
          v-for="(cat, i) in topCategories"
          :key="cat.name"
          class="flex items-center gap-4 px-6 py-3.5 hover:bg-slate-50/60 transition-colors"
        >
          <!-- Rank -->
          <span class="text-xs font-bold text-slate-300 w-4 shrink-0 tabular-nums">#{{ i + 1 }}</span>

          <!-- Category icon -->
          <div
            class="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
            :style="{ background: cat.color + '18' }"
          >
            <UIcon :name="CATEGORY_ICON_MAP[cat.name] || 'i-heroicons-tag'" class="text-sm" :style="{ color: cat.color }" />
          </div>

          <!-- Name + progress bar -->
          <div class="flex-1 min-w-0">
            <div class="flex items-center justify-between mb-1.5">
              <span class="text-sm font-semibold text-slate-700 truncate">{{ cat.name }}</span>
              <span class="text-sm font-bold text-slate-800 tabular-nums ml-4 shrink-0">{{ fmt(cat.amount) }}</span>
            </div>
            <div class="h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                class="h-full rounded-full transition-all duration-500"
                :style="{ width: `${cat.pct}%`, background: cat.color }"
              />
            </div>
          </div>

          <!-- Pct + count -->
          <div class="text-right shrink-0 min-w-13">
            <p class="text-sm font-bold text-slate-600 tabular-nums">{{ cat.pct }}%</p>
            <p class="text-xs text-slate-400">{{ cat.count }} txn{{ cat.count === 1 ? '' : 's' }}</p>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// ── Page meta ──────────────────────────────────────────────────────────────────

definePageMeta({ layout: 'dashboard' })

useSeoMeta({
  title: 'Reports — Expensio',
  description: 'Build custom expense charts by date range and category.',
})

// ── Filter constants ───────────────────────────────────────────────────────────

const DATE_PRESETS = [
  { key: 'this_month',    label: 'This month' },
  { key: 'last_month',    label: 'Last month' },
  { key: 'last_3_months', label: '3 months' },
  { key: 'last_6_months', label: '6 months' },
  { key: 'this_year',     label: 'This year' },
]

const CHART_TYPES = [
  { key: 'bar',   icon: 'i-heroicons-chart-bar',              label: 'Bar' },
  { key: 'line',  icon: 'i-heroicons-presentation-chart-line', label: 'Line' },
  { key: 'donut', icon: 'i-heroicons-chart-pie',              label: 'Donut' },
]

const CATEGORIES = [
  { label: 'Food & Drink',  icon: 'i-heroicons-shopping-bag' },
  { label: 'Transport',     icon: 'i-heroicons-truck' },
  { label: 'Entertainment', icon: 'i-heroicons-musical-note' },
  { label: 'Utilities',     icon: 'i-heroicons-bolt' },
  { label: 'Shopping',      icon: 'i-heroicons-shopping-cart' },
  { label: 'Healthcare',    icon: 'i-heroicons-heart' },
  { label: 'Travel',        icon: 'i-heroicons-globe-alt' },
]

// For the bottom breakdown table
const CATEGORY_ICON_MAP = {
  'Food & Drink':  'i-heroicons-shopping-bag',
  'Transport':     'i-heroicons-truck',
  'Entertainment': 'i-heroicons-musical-note',
  'Utilities':     'i-heroicons-bolt',
  'Shopping':      'i-heroicons-shopping-cart',
  'Healthcare':    'i-heroicons-heart',
  'Travel':        'i-heroicons-globe-alt',
}

const CATEGORY_COLORS = {
  'Food & Drink':  '#10b981',
  'Transport':     '#38bdf8',
  'Entertainment': '#a78bfa',
  'Utilities':     '#fbbf24',
  'Shopping':      '#f472b6',
  'Healthcare':    '#34d399',
  'Travel':        '#fb923c',
}

// ── Filter state ───────────────────────────────────────────────────────────────

const activePreset = ref('this_month')
const chartType = ref('bar')
const selectedCategories = ref([])

function toggleCategory(label) {
  const idx = selectedCategories.value.indexOf(label)
  if (idx === -1) selectedCategories.value.push(label)
  else selectedCategories.value.splice(idx, 1)
}

// ── Mock data ─────────────────────────────────────────────────────────────────
// TODO: GET /api/reports/transactions?from=...&to=...
// Transactions spanning Sep 2025 – Feb 2026

const ALL_TRANSACTIONS = [
  // ── Sep 2025 ──────────────────────────────────────────────────────────────
  { id: 1,  date: '2025-09-01', name: 'Monthly Salary',         category: 'Income',        type: 'income',  amount: 3200 },
  { id: 2,  date: '2025-09-03', name: 'Uber',                   category: 'Transport',     type: 'expense', amount: 18.40 },
  { id: 3,  date: '2025-09-05', name: 'Whole Foods',            category: 'Food & Drink',  type: 'expense', amount: 89.50 },
  { id: 4,  date: '2025-09-07', name: 'Pharmacy',               category: 'Healthcare',    type: 'expense', amount: 24.80 },
  { id: 5,  date: '2025-09-08', name: 'Electricity Bill',       category: 'Utilities',     type: 'expense', amount: 88.20 },
  { id: 6,  date: '2025-09-10', name: 'Coffee Shop',            category: 'Food & Drink',  type: 'expense', amount: 14.60 },
  { id: 7,  date: '2025-09-12', name: 'Metro Card',             category: 'Transport',     type: 'expense', amount: 33 },
  { id: 8,  date: '2025-09-15', name: 'Netflix',                category: 'Entertainment', type: 'expense', amount: 15.99 },
  { id: 9,  date: '2025-09-17', name: 'Restaurant',             category: 'Food & Drink',  type: 'expense', amount: 52.30 },
  { id: 10, date: '2025-09-18', name: 'Amazon Order',           category: 'Shopping',      type: 'expense', amount: 134.99 },
  { id: 11, date: '2025-09-22', name: 'Freelance Project',      category: 'Income',        type: 'income',  amount: 800 },
  { id: 12, date: '2025-09-23', name: 'Gym Membership',         category: 'Healthcare',    type: 'expense', amount: 45 },
  { id: 13, date: '2025-09-25', name: 'Restaurant Dinner',      category: 'Food & Drink',  type: 'expense', amount: 64.80 },
  { id: 14, date: '2025-09-27', name: 'Internet Bill',          category: 'Utilities',     type: 'expense', amount: 59.99 },
  // ── Oct 2025 ──────────────────────────────────────────────────────────────
  { id: 15, date: '2025-10-01', name: 'Monthly Salary',         category: 'Income',        type: 'income',  amount: 3200 },
  { id: 16, date: '2025-10-03', name: 'Supermarket',            category: 'Food & Drink',  type: 'expense', amount: 95.40 },
  { id: 17, date: '2025-10-04', name: 'Coffee Shop',            category: 'Food & Drink',  type: 'expense', amount: 28.50 },
  { id: 18, date: '2025-10-06', name: 'Uber',                   category: 'Transport',     type: 'expense', amount: 21.20 },
  { id: 19, date: '2025-10-08', name: 'Internet Bill',          category: 'Utilities',     type: 'expense', amount: 59.99 },
  { id: 20, date: '2025-10-11', name: 'Metro Card',             category: 'Transport',     type: 'expense', amount: 33 },
  { id: 21, date: '2025-10-13', name: 'Dinner Out',             category: 'Food & Drink',  type: 'expense', amount: 74.20 },
  { id: 22, date: '2025-10-15', name: 'Spotify',                category: 'Entertainment', type: 'expense', amount: 9.99 },
  { id: 23, date: '2025-10-18', name: 'IKEA',                   category: 'Shopping',      type: 'expense', amount: 245.60 },
  { id: 24, date: '2025-10-21', name: 'Doctor Visit',           category: 'Healthcare',    type: 'expense', amount: 80 },
  { id: 25, date: '2025-10-22', name: 'Side Gig',               category: 'Income',        type: 'income',  amount: 450 },
  { id: 26, date: '2025-10-24', name: 'Whole Foods',            category: 'Food & Drink',  type: 'expense', amount: 92.30 },
  { id: 27, date: '2025-10-26', name: 'Cinema',                 category: 'Entertainment', type: 'expense', amount: 24 },
  { id: 28, date: '2025-10-29', name: 'Gas Bill',               category: 'Utilities',     type: 'expense', amount: 68.40 },
  // ── Nov 2025 ──────────────────────────────────────────────────────────────
  { id: 29, date: '2025-11-01', name: 'Monthly Salary',         category: 'Income',        type: 'income',  amount: 3200 },
  { id: 30, date: '2025-11-02', name: 'Coffee & Breakfast',     category: 'Food & Drink',  type: 'expense', amount: 18.90 },
  { id: 31, date: '2025-11-05', name: 'Uber',                   category: 'Transport',     type: 'expense', amount: 16.80 },
  { id: 32, date: '2025-11-06', name: 'Airbnb Weekend',         category: 'Travel',        type: 'expense', amount: 180 },
  { id: 33, date: '2025-11-07', name: 'Restaurant',             category: 'Food & Drink',  type: 'expense', amount: 68.40 },
  { id: 34, date: '2025-11-10', name: 'Gas Bill',               category: 'Utilities',     type: 'expense', amount: 72.40 },
  { id: 35, date: '2025-11-12', name: 'Pharmacy',               category: 'Healthcare',    type: 'expense', amount: 32 },
  { id: 36, date: '2025-11-14', name: 'Uber Eats',              category: 'Food & Drink',  type: 'expense', amount: 42.80 },
  { id: 37, date: '2025-11-17', name: 'Streaming Bundle',       category: 'Entertainment', type: 'expense', amount: 22.99 },
  { id: 38, date: '2025-11-18', name: 'Gym Membership',         category: 'Healthcare',    type: 'expense', amount: 45 },
  { id: 39, date: '2025-11-20', name: 'Supermarket',            category: 'Food & Drink',  type: 'expense', amount: 88.60 },
  { id: 40, date: '2025-11-22', name: 'Cinema Tickets',         category: 'Entertainment', type: 'expense', amount: 32.50 },
  { id: 41, date: '2025-11-25', name: 'Freelance Project',      category: 'Income',        type: 'income',  amount: 1200 },
  { id: 42, date: '2025-11-28', name: 'Black Friday Shopping',  category: 'Shopping',      type: 'expense', amount: 312.80 },
  { id: 43, date: '2025-11-29', name: 'Amazon Deals',           category: 'Shopping',      type: 'expense', amount: 89.99 },
  // ── Dec 2025 ──────────────────────────────────────────────────────────────
  { id: 44, date: '2025-12-01', name: 'Monthly Salary',         category: 'Income',        type: 'income',  amount: 3200 },
  { id: 45, date: '2025-12-03', name: 'Coffee Shop',            category: 'Food & Drink',  type: 'expense', amount: 22.50 },
  { id: 46, date: '2025-12-05', name: 'Christmas Gifts',        category: 'Shopping',      type: 'expense', amount: 420 },
  { id: 47, date: '2025-12-06', name: 'Uber',                   category: 'Transport',     type: 'expense', amount: 24.60 },
  { id: 48, date: '2025-12-08', name: 'Electricity Bill',       category: 'Utilities',     type: 'expense', amount: 102.60 },
  { id: 49, date: '2025-12-10', name: 'More Gifts',             category: 'Shopping',      type: 'expense', amount: 156 },
  { id: 50, date: '2025-12-12', name: 'Holiday Dinner',         category: 'Food & Drink',  type: 'expense', amount: 148.40 },
  { id: 51, date: '2025-12-14', name: 'Gym Membership',         category: 'Healthcare',    type: 'expense', amount: 45 },
  { id: 52, date: '2025-12-15', name: 'Flight Tickets',         category: 'Travel',        type: 'expense', amount: 380 },
  { id: 53, date: '2025-12-18', name: 'Hotel Stay',             category: 'Travel',        type: 'expense', amount: 220 },
  { id: 54, date: '2025-12-20', name: 'Year-End Bonus',         category: 'Income',        type: 'income',  amount: 2000 },
  { id: 55, date: '2025-12-22', name: 'Restaurant',             category: 'Food & Drink',  type: 'expense', amount: 96.20 },
  { id: 56, date: '2025-12-24', name: 'Supermarket',            category: 'Food & Drink',  type: 'expense', amount: 112.80 },
  { id: 57, date: '2025-12-28', name: 'Party Supplies',         category: 'Shopping',      type: 'expense', amount: 88.50 },
  // ── Jan 2026 ──────────────────────────────────────────────────────────────
  { id: 58, date: '2026-01-01', name: 'Monthly Salary',         category: 'Income',        type: 'income',  amount: 3200 },
  { id: 59, date: '2026-01-03', name: 'Uber',                   category: 'Transport',     type: 'expense', amount: 19.80 },
  { id: 60, date: '2026-01-05', name: 'Supermarket',            category: 'Food & Drink',  type: 'expense', amount: 76.80 },
  { id: 61, date: '2026-01-07', name: 'Pharmacy',               category: 'Healthcare',    type: 'expense', amount: 35 },
  { id: 62, date: '2026-01-08', name: 'Coffee Shop',            category: 'Food & Drink',  type: 'expense', amount: 18.50 },
  { id: 63, date: '2026-01-10', name: 'Internet Bill',          category: 'Utilities',     type: 'expense', amount: 59.99 },
  { id: 64, date: '2026-01-11', name: 'Cinema',                 category: 'Entertainment', type: 'expense', amount: 22 },
  { id: 65, date: '2026-01-13', name: 'Metro Card',             category: 'Transport',     type: 'expense', amount: 33 },
  { id: 66, date: '2026-01-14', name: 'Gym Membership',         category: 'Healthcare',    type: 'expense', amount: 45 },
  { id: 67, date: '2026-01-15', name: 'Restaurant',             category: 'Food & Drink',  type: 'expense', amount: 58.40 },
  { id: 68, date: '2026-01-17', name: 'Uber',                   category: 'Transport',     type: 'expense', amount: 28.60 },
  { id: 69, date: '2026-01-20', name: 'Freelance Project',      category: 'Income',        type: 'income',  amount: 950 },
  { id: 70, date: '2026-01-21', name: 'Spotify',                category: 'Entertainment', type: 'expense', amount: 9.99 },
  { id: 71, date: '2026-01-22', name: 'Gym Membership',         category: 'Healthcare',    type: 'expense', amount: 45 },
  { id: 72, date: '2026-01-23', name: 'Amazon',                 category: 'Shopping',      type: 'expense', amount: 67.99 },
  { id: 73, date: '2026-01-24', name: 'Supermarket',            category: 'Food & Drink',  type: 'expense', amount: 72 },
  { id: 74, date: '2026-01-26', name: 'Coffee Shop',            category: 'Food & Drink',  type: 'expense', amount: 34.20 },
  { id: 75, date: '2026-01-28', name: 'Netflix',                category: 'Entertainment', type: 'expense', amount: 15.99 },
  { id: 76, date: '2026-01-29', name: 'Gas Bill',               category: 'Utilities',     type: 'expense', amount: 71.20 },
  // ── Feb 2026 ──────────────────────────────────────────────────────────────
  { id: 77, date: '2026-02-01', name: 'Monthly Salary',         category: 'Income',        type: 'income',  amount: 3200 },
  { id: 78, date: '2026-02-03', name: 'Uber',                   category: 'Transport',     type: 'expense', amount: 15.50 },
  { id: 79, date: '2026-02-05', name: 'Whole Foods Market',     category: 'Food & Drink',  type: 'expense', amount: 82.50 },
  { id: 80, date: '2026-02-06', name: 'Pharmacy',               category: 'Healthcare',    type: 'expense', amount: 28 },
  { id: 81, date: '2026-02-09', name: 'Electric Bill',          category: 'Utilities',     type: 'expense', amount: 94.20 },
  { id: 82, date: '2026-02-10', name: 'Coffee Shop',            category: 'Food & Drink',  type: 'expense', amount: 22.40 },
  { id: 83, date: '2026-02-11', name: 'Metro Card',             category: 'Transport',     type: 'expense', amount: 33 },
  { id: 84, date: '2026-02-12', name: "Valentine's Dinner",     category: 'Food & Drink',  type: 'expense', amount: 112.80 },
  { id: 85, date: '2026-02-13', name: 'Amazon',                 category: 'Shopping',      type: 'expense', amount: 67.99 },
  { id: 86, date: '2026-02-15', name: 'Spotify',                category: 'Entertainment', type: 'expense', amount: 9.99 },
  { id: 87, date: '2026-02-16', name: 'Restaurant',             category: 'Food & Drink',  type: 'expense', amount: 48.60 },
  { id: 88, date: '2026-02-18', name: 'Gym Membership',         category: 'Healthcare',    type: 'expense', amount: 45 },
  { id: 89, date: '2026-02-19', name: 'Streaming Bundle',       category: 'Entertainment', type: 'expense', amount: 14.99 },
  { id: 90, date: '2026-02-21', name: 'Freelance Project',      category: 'Income',        type: 'income',  amount: 1200 },
  { id: 91, date: '2026-02-23', name: 'Uber Eats',              category: 'Food & Drink',  type: 'expense', amount: 34.80 },
  { id: 92, date: '2026-02-24', name: 'Supermarket',            category: 'Food & Drink',  type: 'expense', amount: 91.20 },
  { id: 93, date: '2026-02-25', name: 'Netflix',                category: 'Entertainment', type: 'expense', amount: 15.99 },
  { id: 94, date: '2026-02-26', name: 'Gas Station',            category: 'Transport',     type: 'expense', amount: 45 },
  { id: 95, date: '2026-02-27', name: 'Coffee Shop',            category: 'Food & Drink',  type: 'expense', amount: 7.40 },
]

// ── Date range ────────────────────────────────────────────────────────────────

const TODAY = new Date('2026-02-27')

const dateRange = computed(() => {
  const y = TODAY.getFullYear()
  const m = TODAY.getMonth()
  switch (activePreset.value) {
    case 'this_month':    return { start: new Date(y, m, 1),     end: TODAY }
    case 'last_month':    return { start: new Date(y, m - 1, 1), end: new Date(y, m, 0) }
    case 'last_3_months': return { start: new Date(y, m - 2, 1), end: TODAY }
    case 'last_6_months': return { start: new Date(y, m - 5, 1), end: TODAY }
    case 'this_year':     return { start: new Date(y, 0, 1),     end: TODAY }
    default:              return { start: new Date(y, m, 1),     end: TODAY }
  }
})

const activePeriodLabel = computed(() => {
  const { start, end } = dateRange.value
  const fmt = d => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  if (activePreset.value === 'this_month') {
    return TODAY.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  }
  return `${fmt(start)} – ${fmt(end)}`
})

// ── Filtered transactions ─────────────────────────────────────────────────────

const filteredTransactions = computed(() => {
  const { start, end } = dateRange.value
  return ALL_TRANSACTIONS.filter(tx => {
    const d = new Date(tx.date)
    if (d < start || d > end) return false
    // Category filter applies only to expenses (income always included)
    if (tx.type === 'expense' && selectedCategories.value.length > 0) {
      return selectedCategories.value.includes(tx.category)
    }
    return true
  })
})

// ── Summary stats ─────────────────────────────────────────────────────────────

const totalIncome = computed(() =>
  filteredTransactions.value
    .filter(tx => tx.type === 'income')
    .reduce((s, tx) => s + tx.amount, 0)
)

const totalExpenses = computed(() =>
  filteredTransactions.value
    .filter(tx => tx.type === 'expense')
    .reduce((s, tx) => s + tx.amount, 0)
)

const netBalance = computed(() => totalIncome.value - totalExpenses.value)

// ── Grouping helpers ──────────────────────────────────────────────────────────

// For 1-month ranges: group by week. For multi-month: group by calendar month.
const useWeeklyGrouping = computed(() =>
  activePreset.value === 'this_month' || activePreset.value === 'last_month'
)

function weekLabel(day) {
  if (day <= 7)  return 'W1'
  if (day <= 14) return 'W2'
  if (day <= 21) return 'W3'
  return 'W4'
}

function weekIndex(day) {
  if (day <= 7)  return 0
  if (day <= 14) return 1
  if (day <= 21) return 2
  return 3
}

function monthKey(dateStr) {
  const d = new Date(dateStr)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

function monthLabel(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', year: '2-digit' })
}

// ── Bar chart data ────────────────────────────────────────────────────────────

const barData = computed(() => {
  const txs = filteredTransactions.value
  if (useWeeklyGrouping.value) {
    const weeks = [
      { label: 'Week 1', income: 0, expenses: 0 },
      { label: 'Week 2', income: 0, expenses: 0 },
      { label: 'Week 3', income: 0, expenses: 0 },
      { label: 'Week 4', income: 0, expenses: 0 },
    ]
    txs.forEach(tx => {
      const idx = weekIndex(new Date(tx.date).getDate())
      if (tx.type === 'income') weeks[idx].income += tx.amount
      else weeks[idx].expenses += tx.amount
    })
    return weeks
  }
  // Group by month
  const months = {}
  txs.forEach(tx => {
    const key = monthKey(tx.date)
    if (!months[key]) months[key] = { label: monthLabel(tx.date), income: 0, expenses: 0, _key: key }
    if (tx.type === 'income') months[key].income += tx.amount
    else months[key].expenses += tx.amount
  })
  return Object.values(months).sort((a, b) => a._key.localeCompare(b._key))
})

// ── Line chart data (expenses only) ──────────────────────────────────────────

const lineData = computed(() => {
  const txs = filteredTransactions.value.filter(tx => tx.type === 'expense')
  if (useWeeklyGrouping.value) {
    const weeks = [
      { label: 'Week 1', value: 0 },
      { label: 'Week 2', value: 0 },
      { label: 'Week 3', value: 0 },
      { label: 'Week 4', value: 0 },
    ]
    txs.forEach(tx => {
      weeks[weekIndex(new Date(tx.date).getDate())].value += tx.amount
    })
    return weeks
  }
  const months = {}
  txs.forEach(tx => {
    const key = monthKey(tx.date)
    if (!months[key]) months[key] = { label: monthLabel(tx.date), value: 0, _key: key }
    months[key].value += tx.amount
  })
  return Object.values(months).sort((a, b) => a._key.localeCompare(b._key))
})

// ── Donut chart data (expenses by category) ───────────────────────────────────

const donutData = computed(() => {
  const expenses = filteredTransactions.value.filter(tx => tx.type === 'expense')
  const byCat = {}
  expenses.forEach(tx => {
    if (!byCat[tx.category]) byCat[tx.category] = 0
    byCat[tx.category] += tx.amount
  })
  return Object.entries(byCat)
    .map(([label, value]) => ({ label, value, color: CATEGORY_COLORS[label] || '#94a3b8' }))
    .sort((a, b) => b.value - a.value)
})

// ── Top categories (for bar/line modes) ───────────────────────────────────────

const topCategories = computed(() => {
  const expenses = filteredTransactions.value.filter(tx => tx.type === 'expense')
  const totalExp = expenses.reduce((s, tx) => s + tx.amount, 0)
  const byCat = {}
  expenses.forEach(tx => {
    if (!byCat[tx.category]) byCat[tx.category] = { amount: 0, count: 0 }
    byCat[tx.category].amount += tx.amount
    byCat[tx.category].count++
  })
  return Object.entries(byCat)
    .map(([name, { amount, count }]) => ({
      name,
      amount,
      count,
      pct: totalExp > 0 ? Math.round((amount / totalExp) * 100) : 0,
      color: CATEGORY_COLORS[name] || '#94a3b8',
    }))
    .sort((a, b) => b.amount - a.amount)
})

// ── UI helpers ────────────────────────────────────────────────────────────────

const activeChartType = computed(() =>
  CHART_TYPES.find(ct => ct.key === chartType.value) || CHART_TYPES[0]
)

const chartTitle = computed(() => {
  if (chartType.value === 'bar')   return 'Income vs Expenses'
  if (chartType.value === 'line')  return 'Expense Trend'
  return 'Spending Breakdown'
})

const categoryLabel = computed(() => {
  const n = selectedCategories.value.length
  if (n === 0) return 'All categories'
  if (n === 1) return selectedCategories.value[0]
  return `${n} categories`
})

// ── Formatter ─────────────────────────────────────────────────────────────────

function fmt(v) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0,
  }).format(v)
}
</script>
