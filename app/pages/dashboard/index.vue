<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-10 space-y-8">

      <!-- ────────────────────────────────────────────────────────────────────
           A. PAGE HEADER
      ──────────────────────────────────────────────────────────────────────── -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {{ greeting }}, Alex! 👋
          </h1>
          <p class="mt-1 text-sm text-slate-500">
            Here's your financial overview for {{ currentMonthYear }}.
          </p>
        </div>
        <!-- TODO: wire to real "add transaction" modal/page -->
        <UButton
          color="primary"
          size="md"
          class="self-start sm:self-auto shrink-0 font-semibold shadow-sm shadow-emerald-500/20"
          leading-icon="i-heroicons-plus"
        >
          Add transaction
        </UButton>
      </div>

      <!-- ────────────────────────────────────────────────────────────────────
           B. STATS ROW
           TODO: replace mock data with API call — GET /api/dashboard/stats
      ──────────────────────────────────────────────────────────────────────── -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <DashboardStatCard
          title="Total Income"
          value="$4,280"
          :change="12"
          change-label="vs last month"
          icon="i-heroicons-arrow-trending-up"
          color="emerald"
        />
        <DashboardStatCard
          title="Total Expenses"
          value="$2,150"
          :change="-5"
          change-label="vs last month"
          icon="i-heroicons-arrow-trending-down"
          color="rose"
        />
        <DashboardStatCard
          title="Net Savings"
          value="$2,130"
          :change="8"
          change-label="vs last month"
          icon="i-heroicons-banknotes"
          color="sky"
        />
        <DashboardStatCard
          title="Budget Used"
          value="68%"
          :change="-3"
          change-label="of monthly budget"
          icon="i-heroicons-chart-bar"
          color="amber"
        />
      </div>

      <!-- ────────────────────────────────────────────────────────────────────
           C. MAIN CONTENT — 2-column grid
      ──────────────────────────────────────────────────────────────────────── -->
      <div class="grid grid-cols-1 lg:grid-cols-5 gap-6">

        <!-- Left column: Spending Overview Chart (~60%) -->
        <div class="lg:col-span-3">
          <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 h-full">
            <!-- Card header -->
            <div class="flex items-start justify-between mb-1">
              <div>
                <h2 class="text-base font-bold text-slate-900">Spending Overview</h2>
                <p class="text-sm text-slate-400 mt-0.5">Last 4 weeks</p>
              </div>
              <div class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200">
                <UIcon name="i-heroicons-calendar-days" class="text-slate-400 text-sm" />
                <span class="text-xs font-medium text-slate-500">Monthly</span>
              </div>
            </div>

            <!-- Summary row -->
            <div class="flex items-center gap-6 mb-5 pt-4 border-t border-slate-100">
              <div>
                <p class="text-xs text-slate-400 mb-0.5">Total income</p>
                <p class="text-lg font-bold text-emerald-600">$4,280</p>
              </div>
              <div class="h-8 w-px bg-slate-100" />
              <div>
                <p class="text-xs text-slate-400 mb-0.5">Total expenses</p>
                <p class="text-lg font-bold text-rose-500">$2,150</p>
              </div>
              <div class="h-8 w-px bg-slate-100" />
              <div>
                <p class="text-xs text-slate-400 mb-0.5">Net savings</p>
                <p class="text-lg font-bold text-sky-600">$2,130</p>
              </div>
            </div>

            <!--
              TODO: replace chartData with real API data
              GET /api/dashboard/chart?period=monthly&weeks=4
            -->
            <DashboardExpenseChart :data="chartData" :height="260" />
          </div>
        </div>

        <!-- Right column: Budget Progress (~40%) -->
        <div class="lg:col-span-2">
          <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 h-full flex flex-col">
            <!-- Card header -->
            <div class="flex items-center justify-between mb-5">
              <div>
                <h2 class="text-base font-bold text-slate-900">Budget Progress</h2>
                <p class="text-sm text-slate-400 mt-0.5">February 2026</p>
              </div>
              <UBadge color="warning" variant="subtle" size="xs">
                3 days left
              </UBadge>
            </div>

            <!--
              TODO: replace budgets with real API data
              GET /api/dashboard/budgets
            -->
            <div class="space-y-5 flex-1">
              <div
                v-for="budget in budgets"
                :key="budget.name"
                class="group"
              >
                <!-- Budget row: icon + name + amounts -->
                <div class="flex items-center gap-3 mb-2">
                  <div
                    class="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                    :class="budgetIconConfig(budget.color).bg"
                  >
                    <UIcon
                      :name="budget.icon"
                      class="text-sm"
                      :class="budgetIconConfig(budget.color).icon"
                    />
                  </div>
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center justify-between">
                      <span class="text-sm font-medium text-slate-700 truncate">{{ budget.name }}</span>
                      <div class="flex items-center gap-1 ml-2 shrink-0">
                        <span class="text-sm font-semibold" :class="budgetAmountColor(budget)">
                          ${{ budget.spent }}
                        </span>
                        <span class="text-xs text-slate-400">/ ${{ budget.total }}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Progress bar -->
                <div class="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    class="h-full rounded-full transition-all duration-500"
                    :class="budgetBarColor(budget)"
                    :style="{ width: `${Math.min((budget.spent / budget.total) * 100, 100)}%` }"
                  />
                </div>

                <!-- Percentage + status -->
                <div class="flex items-center justify-between mt-1.5">
                  <span class="text-xs text-slate-400">
                    {{ Math.round((budget.spent / budget.total) * 100) }}% used
                  </span>
                  <span
                    v-if="(budget.spent / budget.total) >= 0.9"
                    class="text-xs font-medium text-rose-600"
                  >
                    Near limit
                  </span>
                  <span
                    v-else-if="(budget.spent / budget.total) >= 0.7"
                    class="text-xs font-medium text-amber-600"
                  >
                    Heads up
                  </span>
                  <span
                    v-else
                    class="text-xs font-medium text-emerald-600"
                  >
                    On track
                  </span>
                </div>
              </div>
            </div>

            <!-- Total budget footer -->
            <div class="mt-5 pt-4 border-t border-slate-100">
              <div class="flex items-center justify-between mb-2">
                <span class="text-xs font-medium text-slate-500">Overall budget</span>
                <span class="text-xs font-semibold text-slate-700">68% used</span>
              </div>
              <div class="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  class="h-full rounded-full bg-gradient-to-r from-emerald-400 via-sky-400 to-amber-400 transition-all duration-700"
                  style="width: 68%"
                />
              </div>
              <p class="text-xs text-slate-400 mt-1.5">$2,150 spent of $3,200 total budget</p>
            </div>
          </div>
        </div>

      </div>

      <!-- ────────────────────────────────────────────────────────────────────
           D. UPCOMING BILLS
      ──────────────────────────────────────────────────────────────────────── -->
      <DashboardUpcomingBills />

      <!-- ────────────────────────────────────────────────────────────────────
           E. RECENT TRANSACTIONS
           TODO: replace with real API data — GET /api/transactions?limit=8&sort=date_desc
      ──────────────────────────────────────────────────────────────────────── -->
      <div class="bg-white rounded-2xl border border-slate-200 shadow-sm">
        <!-- Section header -->
        <div class="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <div>
            <h2 class="text-base font-bold text-slate-900">Recent Transactions</h2>
            <p class="text-sm text-slate-400 mt-0.5">Your latest activity</p>
          </div>
          <NuxtLink
            to="/transactions"
            class="text-sm font-medium text-emerald-600 hover:text-emerald-700 flex items-center gap-1 transition-colors"
          >
            View all
            <UIcon name="i-heroicons-arrow-right" class="text-xs" />
          </NuxtLink>
        </div>

        <!-- Transaction list -->
        <div class="divide-y divide-slate-100">
          <div
            v-for="tx in transactions"
            :key="tx.id"
            class="flex items-center gap-4 px-6 py-4 hover:bg-slate-50/70 transition-colors group"
          >
            <!-- Category icon -->
            <div
              class="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105"
              :class="tx.type === 'income' ? 'bg-emerald-50 border border-emerald-100' : 'bg-rose-50 border border-rose-100'"
            >
              <UIcon
                :name="tx.icon"
                class="text-base"
                :class="tx.type === 'income' ? 'text-emerald-600' : 'text-rose-500'"
              />
            </div>

            <!-- Name + category -->
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

            <!-- Date -->
            <div class="hidden sm:block shrink-0 text-right">
              <p class="text-xs text-slate-400 font-medium">{{ tx.date }}</p>
            </div>

            <!-- Amount -->
            <div class="shrink-0 text-right min-w-18">
              <p
                class="text-sm font-bold tabular-nums"
                :class="tx.type === 'income' ? 'text-emerald-600' : 'text-rose-500'"
              >
                {{ tx.type === 'income' ? '+' : '' }}{{ formatAmount(tx.amount) }}
              </p>
              <p class="text-xs text-slate-400 sm:hidden mt-0.5">{{ tx.date }}</p>
            </div>
          </div>
        </div>

        <!-- Empty state (hidden when transactions exist) -->
        <div
          v-if="transactions.length === 0"
          class="flex flex-col items-center justify-center py-16 text-center"
        >
          <div class="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
            <UIcon name="i-heroicons-inbox" class="text-2xl text-slate-400" />
          </div>
          <p class="text-sm font-semibold text-slate-700 mb-1">No transactions yet</p>
          <p class="text-xs text-slate-400 mb-4">Add your first transaction to get started.</p>
          <UButton color="primary" size="sm" leading-icon="i-heroicons-plus">
            Add transaction
          </UButton>
        </div>

        <!-- Footer -->
        <div class="px-6 py-3.5 border-t border-slate-100 flex items-center justify-between bg-slate-50/50 rounded-b-2xl">
          <p class="text-xs text-slate-400">Showing {{ transactions.length }} of 24 transactions</p>
          <NuxtLink
            to="/transactions"
            class="text-xs font-medium text-emerald-600 hover:text-emerald-700 transition-colors"
          >
            See all transactions
          </NuxtLink>
        </div>
      </div>

      <!-- ────────────────────────────────────────────────────────────────────
           F. QUICK INSIGHTS STRIP
           TODO: replace with computed insights from API data
      ──────────────────────────────────────────────────────────────────────── -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 pb-4">

        <!-- Insight 1: Biggest expense -->
        <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex items-center gap-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group">
          <div class="w-10 h-10 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <UIcon name="i-heroicons-fire" class="text-rose-500 text-lg" />
          </div>
          <div class="min-w-0">
            <p class="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-0.5">
              Biggest expense
            </p>
            <p class="text-sm font-bold text-slate-800 truncate">Rent</p>
            <p class="text-xs text-slate-500 mt-0.5">$1,200 this month</p>
          </div>
        </div>

        <!-- Insight 2: Top saving opportunity -->
        <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex items-center gap-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group">
          <div class="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <UIcon name="i-heroicons-light-bulb" class="text-amber-500 text-lg" />
          </div>
          <div class="min-w-0">
            <p class="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-0.5">
              Saving opportunity
            </p>
            <p class="text-sm font-bold text-slate-800 truncate">Dining out</p>
            <p class="text-xs text-slate-500 mt-0.5">$340 spent — could save $100</p>
          </div>
        </div>

        <!-- Insight 3: Days until month end -->
        <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex items-center gap-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group">
          <div class="w-10 h-10 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <UIcon name="i-heroicons-clock" class="text-sky-500 text-lg" />
          </div>
          <div class="min-w-0">
            <p class="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-0.5">
              Month end
            </p>
            <p class="text-sm font-bold text-slate-800">{{ daysUntilMonthEnd }} days left</p>
            <p class="text-xs text-slate-500 mt-0.5">Stay on track — you're doing great!</p>
          </div>
        </div>

      </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

// ── Page meta ─────────────────────────────────────────────────────────────────

definePageMeta({ layout: 'dashboard' })

useSeoMeta({
  title: 'Dashboard — Expensio',
  description: 'Your personal finance overview: income, expenses, budgets, and trends.',
})

// ── Types ─────────────────────────────────────────────────────────────────────

interface Transaction {
  id: number
  name: string
  category: string
  icon: string
  date: string
  amount: number
  type: 'income' | 'expense'
}

interface Budget {
  name: string
  spent: number
  total: number
  icon: string
  color: 'emerald' | 'sky' | 'violet' | 'amber' | 'rose'
}

interface ChartDataPoint {
  label: string
  income: number
  expenses: number
}

// ── Greeting (time-based) ─────────────────────────────────────────────────────

const greeting = computed((): string => {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 18) return 'Good afternoon'
  return 'Good evening'
})

const currentMonthYear = computed((): string => {
  return new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
})

const daysUntilMonthEnd = computed((): number => {
  const now = new Date()
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0)
  return lastDay.getDate() - now.getDate()
})

// ── Mock data — TODO: replace with API calls ──────────────────────────────────

// TODO: GET /api/transactions?limit=8&sort=date_desc
const transactions: Transaction[] = [
  { id: 1, name: 'Whole Foods Market', category: 'Food & Drink', icon: 'i-heroicons-shopping-bag', date: 'Today', amount: -82.50, type: 'expense' },
  { id: 2, name: 'Freelance Payment', category: 'Income', icon: 'i-heroicons-briefcase', date: 'Today', amount: 1200.00, type: 'income' },
  { id: 3, name: 'Spotify Premium', category: 'Entertainment', icon: 'i-heroicons-musical-note', date: 'Yesterday', amount: -9.99, type: 'expense' },
  { id: 4, name: 'Electric Bill', category: 'Utilities', icon: 'i-heroicons-bolt', date: 'Feb 23', amount: -94.20, type: 'expense' },
  { id: 5, name: 'Monthly Salary', category: 'Income', icon: 'i-heroicons-banknotes', date: 'Feb 22', amount: 3200.00, type: 'income' },
  { id: 6, name: 'Uber Eats', category: 'Food & Drink', icon: 'i-heroicons-truck', date: 'Feb 21', amount: -34.80, type: 'expense' },
  { id: 7, name: 'Netflix', category: 'Entertainment', icon: 'i-heroicons-tv', date: 'Feb 20', amount: -15.99, type: 'expense' },
  { id: 8, name: 'Coffee Shop', category: 'Food & Drink', icon: 'i-heroicons-cake', date: 'Feb 20', amount: -7.40, type: 'expense' },
]

// TODO: GET /api/dashboard/budgets
const budgets: Budget[] = [
  { name: 'Food & Drink', spent: 340, total: 400, icon: 'i-heroicons-shopping-bag', color: 'emerald' },
  { name: 'Transport', spent: 95, total: 150, icon: 'i-heroicons-truck', color: 'sky' },
  { name: 'Entertainment', spent: 72, total: 80, icon: 'i-heroicons-musical-note', color: 'violet' },
  { name: 'Utilities', spent: 94, total: 100, icon: 'i-heroicons-bolt', color: 'amber' },
]

// TODO: GET /api/dashboard/chart?period=monthly&weeks=4
const chartData: ChartDataPoint[] = [
  { label: 'Week 1', income: 1200, expenses: 520 },
  { label: 'Week 2', income: 800, expenses: 680 },
  { label: 'Week 3', income: 1500, expenses: 390 },
  { label: 'Week 4', income: 780, expenses: 560 },
]

// ── Budget helpers ────────────────────────────────────────────────────────────

type BudgetIconConfig = { bg: string; icon: string }

function budgetIconConfig(color: Budget['color']): BudgetIconConfig {
  const map: Record<Budget['color'], BudgetIconConfig> = {
    emerald: { bg: 'bg-emerald-50 border border-emerald-100', icon: 'text-emerald-600' },
    sky:     { bg: 'bg-sky-50 border border-sky-100',         icon: 'text-sky-600' },
    violet:  { bg: 'bg-violet-50 border border-violet-100',   icon: 'text-violet-600' },
    amber:   { bg: 'bg-amber-50 border border-amber-100',     icon: 'text-amber-600' },
    rose:    { bg: 'bg-rose-50 border border-rose-100',       icon: 'text-rose-600' },
  }
  return map[color]
}

function budgetBarColor(budget: Budget): string {
  const pct = budget.spent / budget.total
  if (pct >= 0.9) return 'bg-rose-500'
  if (pct >= 0.7) return 'bg-amber-500'
  return 'bg-emerald-500'
}

function budgetAmountColor(budget: Budget): string {
  const pct = budget.spent / budget.total
  if (pct >= 0.9) return 'text-rose-600'
  if (pct >= 0.7) return 'text-amber-600'
  return 'text-slate-800'
}

// ── Amount formatter ──────────────────────────────────────────────────────────

function formatAmount(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Math.abs(value))
}
</script>
