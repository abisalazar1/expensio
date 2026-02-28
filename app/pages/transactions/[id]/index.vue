<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-10">

    <!-- ──────────────────────────────────────────────────────────────────────
         A. PAGE HEADER
    ─────────────────────────────────────────────────────────────────────── -->
    <div class="flex items-start sm:items-center justify-between gap-4 mb-8 flex-wrap">
      <div class="flex items-center gap-4">
        <NuxtLink
          to="/transactions"
          class="flex items-center justify-center w-9 h-9 rounded-xl bg-white border border-slate-200 shadow-sm hover:bg-slate-50 hover:border-slate-300 transition-all text-slate-500 hover:text-slate-700 shrink-0"
          aria-label="Back to transactions"
        >
          <UIcon name="i-heroicons-arrow-left" class="text-base" />
        </NuxtLink>
        <div>
          <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Transaction Details
          </h1>
          <p class="mt-0.5 text-sm text-slate-400 font-mono">
            #{{ txId }}
          </p>
        </div>
      </div>

      <div class="flex items-center gap-2 shrink-0">
        <NuxtLink :to="`/transactions/${txId}/edit`">
          <UButton
            color="neutral"
            variant="outline"
            size="sm"
            leading-icon="i-heroicons-pencil-square"
            class="font-semibold"
          >
            Edit
          </UButton>
        </NuxtLink>
        <UButton
          color="error"
          variant="subtle"
          size="sm"
          leading-icon="i-heroicons-trash"
          class="font-semibold"
          @click="showDeleteConfirm = true"
        >
          Delete
        </UButton>
      </div>
    </div>

    <!-- ──────────────────────────────────────────────────────────────────────
         B. MAIN CONTENT GRID
    ─────────────────────────────────────────────────────────────────────── -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">

      <!-- ── LEFT: Main card + related ─────────────────────────────────────── -->
      <div class="lg:col-span-2 space-y-6">

        <!-- Main transaction card -->
        <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <!-- Type color strip -->
          <div
            :class="[
              'h-1.5 w-full transition-colors duration-300',
              tx.type === 'income' ? 'bg-emerald-500' : 'bg-rose-500',
            ]"
          />

          <div class="p-6 sm:p-8">
            <!-- Icon + badge row -->
            <div class="flex items-start justify-between mb-6">
              <div
                :class="[
                  'w-14 h-14 rounded-2xl flex items-center justify-center border-2',
                  tx.type === 'income'
                    ? 'bg-emerald-50 border-emerald-100'
                    : 'bg-rose-50 border-rose-100',
                ]"
              >
                <UIcon
                  :name="categoryIconMap[tx.category] ?? 'i-heroicons-banknotes'"
                  :class="[
                    'text-2xl',
                    tx.type === 'income' ? 'text-emerald-600' : 'text-rose-500',
                  ]"
                />
              </div>
              <UBadge
                :color="tx.type === 'income' ? 'primary' : 'error'"
                variant="subtle"
                size="md"
              >
                <UIcon
                  :name="tx.type === 'income' ? 'i-heroicons-arrow-trending-up' : 'i-heroicons-arrow-trending-down'"
                  class="mr-1 text-xs"
                />
                {{ tx.type === 'income' ? 'Income' : 'Expense' }}
              </UBadge>
            </div>

            <!-- Name -->
            <h2 class="text-xl sm:text-2xl font-bold text-slate-900 mb-2 leading-tight">
              {{ tx.name }}
            </h2>

            <!-- Amount -->
            <p
              :class="[
                'text-4xl sm:text-5xl font-extrabold tabular-nums mb-8 leading-none',
                tx.type === 'income' ? 'text-emerald-600' : 'text-rose-500',
              ]"
            >
              <span class="text-2xl sm:text-3xl font-bold mr-0.5">
                {{ tx.type === 'income' ? '+' : '−' }}
              </span>
              {{ formatCurrency(Math.abs(tx.amount)) }}
            </p>

            <!-- Detail tiles -->
            <div class="border-t border-slate-100 pt-6 space-y-3">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <!-- Category -->
                <div class="flex items-center gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                  <div class="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center shrink-0 shadow-sm">
                    <UIcon
                      :name="categoryIconMap[tx.category] ?? 'i-heroicons-tag'"
                      class="text-sm text-slate-400"
                    />
                  </div>
                  <div>
                    <p class="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Category</p>
                    <p class="text-sm font-bold text-slate-800 mt-0.5">{{ tx.category }}</p>
                  </div>
                </div>

                <!-- Date -->
                <div class="flex items-center gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                  <div class="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center shrink-0 shadow-sm">
                    <UIcon name="i-heroicons-calendar-days" class="text-sm text-slate-400" />
                  </div>
                  <div>
                    <p class="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Date</p>
                    <p class="text-sm font-bold text-slate-800 mt-0.5">{{ formatDate(tx.date) }}</p>
                  </div>
                </div>
              </div>

              <!-- Tags -->
              <div
                v-if="tx.tags?.length"
                class="flex items-start gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-100"
              >
                <div class="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                  <UIcon name="i-heroicons-hashtag" class="text-sm text-slate-400" />
                </div>
                <div>
                  <p class="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mb-2">Tags</p>
                  <div class="flex flex-wrap gap-1.5">
                    <span
                      v-for="tag in tx.tags"
                      :key="tag"
                      class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-white text-slate-700 border border-slate-200 shadow-sm"
                    >
                      <span class="text-slate-400">#</span>{{ tag }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- Note -->
              <div
                v-if="tx.note"
                class="flex items-start gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-100"
              >
                <div class="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                  <UIcon name="i-heroicons-document-text" class="text-sm text-slate-400" />
                </div>
                <div>
                  <p class="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mb-1">Note</p>
                  <p class="text-sm text-slate-600 leading-relaxed">{{ tx.note }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Receipt (if attached) -->
        <div
          v-if="tx.receipt"
          class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
        >
          <div class="px-5 py-4 border-b border-slate-100 flex items-center gap-2">
            <UIcon name="i-heroicons-paper-clip" class="text-slate-400 text-base" />
            <h3 class="text-sm font-bold text-slate-900">Receipt</h3>
          </div>
          <div class="p-5">
            <img
              :src="tx.receipt"
              alt="Receipt"
              class="w-full max-w-sm rounded-xl border border-slate-200 object-cover shadow-sm"
            />
          </div>
        </div>

        <!-- Related transactions (same category) -->
        <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div class="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <div class="flex items-center gap-2">
              <h3 class="text-sm font-bold text-slate-900">More in</h3>
              <UBadge color="neutral" variant="subtle" size="sm">
                {{ tx.category }}
              </UBadge>
            </div>
            <NuxtLink
              to="/transactions"
              class="text-xs text-sky-600 hover:text-sky-700 font-semibold transition-colors flex items-center gap-1"
            >
              View all
              <UIcon name="i-heroicons-arrow-right" class="text-xs" />
            </NuxtLink>
          </div>

          <div v-if="relatedTransactions.length" class="divide-y divide-slate-50">
            <div
              v-for="related in relatedTransactions"
              :key="related.id"
              role="link"
              tabindex="0"
              class="flex items-center gap-4 px-5 py-3.5 hover:bg-slate-50/70 transition-colors cursor-pointer group"
              @click="navigateTo(`/transactions/${related.id}`)"
              @keydown.enter="navigateTo(`/transactions/${related.id}`)"
            >
              <div
                :class="[
                  'w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border',
                  related.type === 'income'
                    ? 'bg-emerald-50 border-emerald-100'
                    : 'bg-rose-50 border-rose-100',
                ]"
              >
                <UIcon
                  :name="categoryIconMap[related.category] ?? 'i-heroicons-tag'"
                  :class="[
                    'text-base',
                    related.type === 'income' ? 'text-emerald-500' : 'text-rose-500',
                  ]"
                />
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-semibold text-slate-800 truncate group-hover:text-slate-900 transition-colors">
                  {{ related.name }}
                </p>
                <p class="text-xs text-slate-400 mt-0.5">{{ related.dateLabel }}</p>
              </div>
              <p
                :class="[
                  'text-sm font-bold tabular-nums shrink-0',
                  related.type === 'income' ? 'text-emerald-600' : 'text-rose-500',
                ]"
              >
                {{ related.type === 'income' ? '+' : '−' }}{{ formatCurrency(Math.abs(related.amount)) }}
              </p>
              <UIcon
                name="i-heroicons-chevron-right"
                class="text-slate-300 group-hover:text-slate-500 transition-colors shrink-0 text-sm"
              />
            </div>
          </div>

          <div v-else class="px-5 py-10 text-center">
            <UIcon name="i-heroicons-inbox" class="text-3xl text-slate-200 mb-2" />
            <p class="text-sm text-slate-400">No other transactions in this category.</p>
          </div>
        </div>

      </div>

      <!-- ── RIGHT: Sidebar ────────────────────────────────────────────────── -->
      <div class="lg:col-span-1">
        <div class="lg:sticky lg:top-6 space-y-4">

          <!-- Quick actions -->
          <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
            <p class="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Actions</p>
            <div class="space-y-2">
              <NuxtLink :to="`/transactions/${txId}/edit`" class="block">
                <UButton
                  color="primary"
                  variant="subtle"
                  size="md"
                  block
                  leading-icon="i-heroicons-pencil-square"
                  class="font-semibold"
                >
                  Edit transaction
                </UButton>
              </NuxtLink>
              <UButton
                color="error"
                variant="subtle"
                size="md"
                block
                leading-icon="i-heroicons-trash"
                class="font-semibold"
                @click="showDeleteConfirm = true"
              >
                Delete transaction
              </UButton>
              <NuxtLink to="/transactions" class="block">
                <UButton
                  color="neutral"
                  variant="ghost"
                  size="md"
                  block
                  leading-icon="i-heroicons-list-bullet"
                  class="font-semibold text-slate-500"
                >
                  All transactions
                </UButton>
              </NuxtLink>
            </div>
          </div>

          <!-- Metadata -->
          <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
            <p class="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">Metadata</p>
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <span class="text-xs text-slate-400">Transaction ID</span>
                <span class="text-xs font-mono font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                  #{{ txId }}
                </span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-xs text-slate-400">Created</span>
                <span class="text-xs font-semibold text-slate-600">{{ tx.createdAt }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-xs text-slate-400">Last updated</span>
                <span class="text-xs font-semibold text-slate-600">{{ tx.updatedAt }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-xs text-slate-400">Source</span>
                <UBadge color="neutral" variant="subtle" size="xs">Manual</UBadge>
              </div>
            </div>
          </div>

          <!-- Budget impact (expense) or income insight -->
          <div
            :class="[
              'rounded-2xl border shadow-sm p-5',
              tx.type === 'expense'
                ? 'bg-amber-50 border-amber-100'
                : 'bg-emerald-50 border-emerald-100',
            ]"
          >
            <div class="flex items-start gap-3">
              <UIcon
                :name="tx.type === 'expense' ? 'i-heroicons-chart-bar' : 'i-heroicons-sparkles'"
                :class="[
                  'text-lg mt-0.5 shrink-0',
                  tx.type === 'expense' ? 'text-amber-500' : 'text-emerald-500',
                ]"
              />
              <div class="flex-1 min-w-0">
                <p
                  :class="[
                    'text-sm font-bold mb-1',
                    tx.type === 'expense' ? 'text-amber-800' : 'text-emerald-800',
                  ]"
                >
                  {{ tx.type === 'expense' ? 'Budget impact' : 'Income recorded' }}
                </p>
                <p
                  :class="[
                    'text-xs leading-relaxed',
                    tx.type === 'expense' ? 'text-amber-700' : 'text-emerald-700',
                  ]"
                >
                  <template v-if="tx.type === 'expense'">
                    This is <strong>{{ budgetImpactPercent }}%</strong> of your
                    <em>{{ tx.category }}</em> budget this month.
                  </template>
                  <template v-else>
                    Great! This income boosts your monthly savings rate.
                  </template>
                </p>
                <div
                  v-if="tx.type === 'expense'"
                  class="mt-2.5 h-1.5 bg-amber-200 rounded-full overflow-hidden"
                >
                  <div
                    class="h-full bg-amber-500 rounded-full transition-all duration-500"
                    :style="{ width: `${Math.min(budgetImpactPercent, 100)}%` }"
                  />
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

    </div>

    <!-- ──────────────────────────────────────────────────────────────────────
         C. DELETE CONFIRMATION MODAL
    ─────────────────────────────────────────────────────────────────────── -->
    <UModal v-model:open="showDeleteConfirm">
      <template #content>
        <div class="p-6 sm:p-8">
          <div class="flex items-center gap-4 mb-5">
            <div class="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center shrink-0">
              <UIcon name="i-heroicons-trash" class="text-xl text-rose-500" />
            </div>
            <div>
              <h3 class="text-base font-bold text-slate-900">Delete this transaction?</h3>
              <p class="text-sm text-slate-500 mt-0.5">This action cannot be undone.</p>
            </div>
          </div>

          <div class="bg-slate-50 rounded-xl border border-slate-100 p-4 mb-6">
            <div class="flex items-center justify-between gap-4">
              <div class="min-w-0">
                <p class="text-sm font-semibold text-slate-800 truncate">{{ tx.name }}</p>
                <p class="text-xs text-slate-400 mt-0.5">
                  {{ tx.category }} · {{ formatDate(tx.date) }}
                </p>
              </div>
              <p
                :class="[
                  'text-base font-bold tabular-nums shrink-0',
                  tx.type === 'income' ? 'text-emerald-600' : 'text-rose-500',
                ]"
              >
                {{ tx.type === 'income' ? '+' : '−' }}{{ formatCurrency(Math.abs(tx.amount)) }}
              </p>
            </div>
          </div>

          <div class="flex gap-3">
            <UButton
              color="error"
              size="md"
              class="flex-1 font-semibold"
              :loading="isDeleting"
              leading-icon="i-heroicons-trash"
              @click="onDelete"
            >
              {{ isDeleting ? 'Deleting...' : 'Delete' }}
            </UButton>
            <UButton
              color="neutral"
              variant="outline"
              size="md"
              class="flex-1 font-semibold"
              :disabled="isDeleting"
              @click="showDeleteConfirm = false"
            >
              Cancel
            </UButton>
          </div>
        </div>
      </template>
    </UModal>

  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

// ── Page meta ──────────────────────────────────────────────────────────────────

definePageMeta({ layout: 'dashboard' })

const route = useRoute()
const txId  = computed(() => route.params.id as string)

useSeoMeta({
  title:       computed(() => `Transaction #${txId.value} — Expensio`),
  description: 'View full transaction details.',
})

// ── Types ──────────────────────────────────────────────────────────────────────

type TransactionType = 'expense' | 'income'

interface Transaction {
  id:        number
  name:      string
  category:  string
  type:      TransactionType
  amount:    number
  date:      string
  note:      string | null
  tags:      string[]
  receipt:   string | null
  createdAt: string
  updatedAt: string
}

interface RelatedTransaction {
  id:        number
  name:      string
  category:  string
  type:      TransactionType
  amount:    number
  dateLabel: string
}

// ── Constants ──────────────────────────────────────────────────────────────────

// Hardcoded map — avoids Tailwind purge issues with dynamic class names
const categoryIconMap: Record<string, string> = {
  'Food & Drink':  'i-heroicons-shopping-bag',
  'Income':        'i-heroicons-banknotes',
  'Housing':       'i-heroicons-home',
  'Transport':     'i-heroicons-truck',
  'Utilities':     'i-heroicons-bolt',
  'Health':        'i-heroicons-heart',
  'Entertainment': 'i-heroicons-tv',
  'Shopping':      'i-heroicons-shopping-cart',
  'Other':         'i-heroicons-ellipsis-horizontal-circle',
}

// ── Mock data ──────────────────────────────────────────────────────────────────

// TODO: GET /api/transactions/:id
const tx = ref<Transaction>({
  id:        Number(txId.value),
  name:      'Whole Foods Market',
  category:  'Food & Drink',
  type:      'expense',
  amount:    84.50,
  date:      '2026-02-26',
  note:      'Weekly grocery run. Included produce, dairy, and snacks for the week.',
  tags:      ['groceries', 'weekly'],
  receipt:   null,
  createdAt: 'Feb 26, 2026',
  updatedAt: 'Feb 26, 2026',
})

// TODO: GET /api/transactions?category=:category&exclude_id=:id&limit=3
const relatedTransactions = ref<RelatedTransaction[]>([
  { id: 5,  name: "Trader Joe's",      category: 'Food & Drink', type: 'expense', amount: 54.20, dateLabel: 'Feb 20' },
  { id: 12, name: 'Starbucks',         category: 'Food & Drink', type: 'expense', amount: 6.75,  dateLabel: 'Feb 18' },
  { id: 8,  name: 'Local Farm Market', category: 'Food & Drink', type: 'expense', amount: 32.00, dateLabel: 'Feb 14' },
])

// TODO: compute from GET /api/budgets?category=:category (% of monthly budget used)
const budgetImpactPercent = ref(68)

// ── Delete flow ────────────────────────────────────────────────────────────────

const showDeleteConfirm = ref(false)
const isDeleting        = ref(false)

async function onDelete(): Promise<void> {
  isDeleting.value = true
  try {
    // TODO: DELETE /api/transactions/:id
    const { $axios } = useNuxtApp()
    await $axios.delete(`/transactions/${txId.value}`)
    await navigateTo('/transactions')
  } catch {
    // keep modal open on failure
  } finally {
    isDeleting.value = false
  }
}

// ── Formatters ─────────────────────────────────────────────────────────────────

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style:                 'currency',
    currency:              'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

function formatDate(iso: string): string {
  const parts = iso.split('-').map(Number)
  const year  = parts[0] as number
  const month = parts[1] as number
  const day   = parts[2] as number
  const d = new Date(year, month - 1, day)
  return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
}
</script>
