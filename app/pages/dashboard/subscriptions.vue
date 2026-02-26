<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-10 space-y-8">

    <!-- ────────────────────────────────────────────────────────────────────
         A. PAGE HEADER
    ──────────────────────────────────────────────────────────────────────── -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Subscriptions
        </h1>
        <p class="mt-1 text-sm text-slate-500">
          Track recurring payments and stay on top of billing dates.
        </p>
      </div>
      <UButton
        color="primary"
        size="md"
        class="self-start sm:self-auto shrink-0 font-semibold shadow-sm shadow-emerald-500/20"
        leading-icon="i-heroicons-plus"
        @click="openModal()"
      >
        Add subscription
      </UButton>
    </div>

    <!-- ────────────────────────────────────────────────────────────────────
         B. STATS ROW
         TODO: GET /api/subscriptions/summary
    ──────────────────────────────────────────────────────────────────────── -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">

      <!-- Monthly total -->
      <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <div class="flex items-center gap-3 mb-3">
          <div class="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center">
            <UIcon name="i-heroicons-currency-dollar" class="text-emerald-600 text-lg" />
          </div>
          <span class="text-sm font-medium text-slate-500">Monthly total</span>
        </div>
        <p class="text-3xl font-extrabold text-slate-900 tabular-nums tracking-tight">
          ${{ totalMonthlyCost.toFixed(2) }}
        </p>
        <p class="text-xs text-slate-400 mt-1">
          ${{ (totalMonthlyCost * 12).toFixed(2) }} per year
        </p>
      </div>

      <!-- Active count -->
      <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <div class="flex items-center gap-3 mb-3">
          <div class="w-9 h-9 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center">
            <UIcon name="i-heroicons-check-circle" class="text-sky-600 text-lg" />
          </div>
          <span class="text-sm font-medium text-slate-500">Active</span>
        </div>
        <p class="text-3xl font-extrabold text-slate-900">
          {{ activeSubscriptions.length }}
        </p>
        <p class="text-xs text-slate-400 mt-1">
          {{ store.subscriptions.length - activeSubscriptions.length }} paused
        </p>
      </div>

      <!-- Due this week -->
      <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <div class="flex items-center gap-3 mb-3">
          <div class="w-9 h-9 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center">
            <UIcon name="i-heroicons-calendar-days" class="text-amber-600 text-lg" />
          </div>
          <span class="text-sm font-medium text-slate-500">Due this week</span>
        </div>
        <p class="text-3xl font-extrabold text-slate-900">
          {{ upcomingBills.length }}
        </p>
        <p class="text-xs text-slate-400 mt-1">
          ${{ upcomingBillsTotal.toFixed(2) }} upcoming
        </p>
      </div>

    </div>

    <!-- ────────────────────────────────────────────────────────────────────
         C. FILTER TABS + SUBSCRIPTIONS LIST
         TODO: GET /api/subscriptions?status=active|paused
    ──────────────────────────────────────────────────────────────────────── -->
    <div class="bg-white rounded-2xl border border-slate-200 shadow-sm">

      <!-- Tabs -->
      <div class="flex items-center gap-1 px-6 py-4 border-b border-slate-100">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all"
          :class="activeTab === tab.key
            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
            : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'"
          @click="activeTab = tab.key"
        >
          {{ tab.label }}
          <span
            class="inline-flex items-center justify-center w-5 h-5 rounded-full text-xs font-semibold"
            :class="activeTab === tab.key ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'"
          >
            {{ tab.count }}
          </span>
        </button>
      </div>

      <!-- Subscription rows -->
      <div v-if="filteredSubscriptions.length > 0" class="divide-y divide-slate-100">
        <div
          v-for="sub in filteredSubscriptions"
          :key="sub.id"
          class="flex items-center gap-4 px-6 py-4 hover:bg-slate-50/60 transition-colors group"
        >
          <!-- Icon -->
          <div
            class="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105"
            :class="[colorConfig(sub.color).bg, !sub.isActive && 'opacity-40 grayscale']"
          >
            <UIcon :name="sub.icon" class="text-base" :class="colorConfig(sub.color).text" />
          </div>

          <!-- Name + meta -->
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2">
              <p
                class="text-sm font-semibold truncate"
                :class="sub.isActive ? 'text-slate-800' : 'text-slate-400'"
              >
                {{ sub.name }}
              </p>
              <UBadge v-if="!sub.isActive" color="neutral" variant="subtle" size="xs">
                Paused
              </UBadge>
            </div>
            <div class="flex items-center gap-2 mt-0.5">
              <span class="text-xs text-slate-400">{{ sub.category }}</span>
              <span class="text-slate-200">·</span>
              <span class="text-xs text-slate-400 capitalize">{{ sub.frequency }}</span>
            </div>
          </div>

          <!-- Next billing date -->
          <div class="hidden sm:block shrink-0 text-right">
            <p class="text-xs font-medium text-slate-500">
              {{ formatDate(sub.nextBillingDate) }}
            </p>
            <UBadge
              v-if="sub.isActive && daysUntil(sub.nextBillingDate) <= 7"
              :color="urgencyColor(sub.nextBillingDate)"
              variant="subtle"
              size="xs"
              class="mt-0.5"
            >
              {{ daysUntilLabel(sub.nextBillingDate) }}
            </UBadge>
          </div>

          <!-- Amount -->
          <div class="shrink-0 text-right min-w-[4.5rem]">
            <p
              class="text-sm font-bold tabular-nums"
              :class="sub.isActive ? 'text-slate-800' : 'text-slate-400'"
            >
              ${{ sub.amount.toFixed(2) }}
            </p>
            <p v-if="sub.frequency !== 'monthly'" class="text-xs text-slate-400">
              ${{ store.monthlyEquivalent(sub).toFixed(2) }}/mo
            </p>
          </div>

          <!-- Row actions (visible on hover) -->
          <div class="shrink-0 flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">

            <!-- Pause / Resume -->
            <button
              class="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              :title="sub.isActive ? 'Pause' : 'Resume'"
              @click="store.toggleActive(sub.id)"
            >
              <UIcon
                :name="sub.isActive ? 'i-heroicons-pause' : 'i-heroicons-play'"
                class="text-sm"
              />
            </button>

            <!-- Edit -->
            <button
              class="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              title="Edit"
              @click="openModal(sub)"
            >
              <UIcon name="i-heroicons-pencil" class="text-sm" />
            </button>

            <!-- Delete (single click → confirm inline) -->
            <template v-if="deleteConfirmId !== sub.id">
              <button
                class="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                title="Delete"
                @click="deleteConfirmId = sub.id"
              >
                <UIcon name="i-heroicons-trash" class="text-sm" />
              </button>
            </template>
            <template v-else>
              <div class="flex items-center gap-0.5 ml-1">
                <button
                  class="px-2 py-1 rounded-lg text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors"
                  @click="confirmDelete(sub.id)"
                >
                  Delete
                </button>
                <button
                  class="px-2 py-1 rounded-lg text-xs font-medium text-slate-500 hover:bg-slate-100 transition-colors"
                  @click="deleteConfirmId = null"
                >
                  Cancel
                </button>
              </div>
            </template>
          </div>
        </div>
      </div>

      <!-- Empty state -->
      <div
        v-else
        class="flex flex-col items-center justify-center py-16 text-center"
      >
        <div class="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
          <UIcon name="i-heroicons-credit-card" class="text-2xl text-slate-400" />
        </div>
        <p class="text-sm font-semibold text-slate-700 mb-1">No subscriptions found</p>
        <p class="text-xs text-slate-400 mb-4">
          {{ activeTab === 'all'
            ? 'Add your first recurring payment to get started.'
            : 'No subscriptions in this category.' }}
        </p>
        <UButton
          v-if="activeTab === 'all'"
          color="primary"
          size="sm"
          leading-icon="i-heroicons-plus"
          @click="openModal()"
        >
          Add subscription
        </UButton>
      </div>

      <!-- Footer -->
      <div class="px-6 py-3.5 border-t border-slate-100 flex items-center justify-between bg-slate-50/50 rounded-b-2xl">
        <p class="text-xs text-slate-400">
          {{ filteredSubscriptions.length }}
          subscription{{ filteredSubscriptions.length !== 1 ? 's' : '' }}
        </p>
        <p class="text-xs text-slate-400">
          Total monthly: <span class="font-semibold text-slate-600">${{ totalMonthlyCost.toFixed(2) }}</span>
        </p>
      </div>
    </div>

  </div>

  <!-- ────────────────────────────────────────────────────────────────────
       D. ADD / EDIT MODAL
  ──────────────────────────────────────────────────────────────────────── -->
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="showModal"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
        @click.self="closeModal"
      >
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" />

        <!-- Panel -->
        <Transition
          enter-active-class="transition duration-200 ease-out"
          enter-from-class="opacity-0 scale-95"
          enter-to-class="opacity-100 scale-100"
          leave-active-class="transition duration-150 ease-in"
          leave-from-class="opacity-100 scale-100"
          leave-to-class="opacity-0 scale-95"
        >
          <div
            v-if="showModal"
            class="relative bg-white rounded-2xl shadow-xl w-full max-w-md z-10 overflow-hidden"
          >
            <!-- Modal header -->
            <div class="flex items-center justify-between px-6 py-5 border-b border-slate-100">
              <h2 class="text-base font-bold text-slate-900">
                {{ editingId !== null ? 'Edit subscription' : 'Add subscription' }}
              </h2>
              <button
                class="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                @click="closeModal"
              >
                <UIcon name="i-heroicons-x-mark" class="text-lg" />
              </button>
            </div>

            <!-- Form body -->
            <div class="px-6 py-5 space-y-4 max-h-[70vh] overflow-y-auto">

              <!-- Name -->
              <div>
                <label class="block text-xs font-semibold text-slate-600 mb-1.5">Service name</label>
                <UInput
                  v-model="form.name"
                  placeholder="e.g. Netflix, Spotify, Gym..."
                  size="md"
                />
                <p v-if="formErrors.name" class="text-xs text-rose-500 mt-1">{{ formErrors.name }}</p>
              </div>

              <!-- Amount + Frequency -->
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block text-xs font-semibold text-slate-600 mb-1.5">Amount</label>
                  <UInput
                    v-model="form.amount"
                    type="number"
                    placeholder="0.00"
                    size="md"
                    leading-icon="i-heroicons-currency-dollar"
                    min="0"
                    step="0.01"
                  />
                  <p v-if="formErrors.amount" class="text-xs text-rose-500 mt-1">{{ formErrors.amount }}</p>
                </div>
                <div>
                  <label class="block text-xs font-semibold text-slate-600 mb-1.5">Frequency</label>
                  <select
                    v-model="form.frequency"
                    class="w-full h-9 px-3 text-sm rounded-lg border border-slate-200 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-shadow"
                  >
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                    <option value="weekly">Weekly</option>
                    <option value="daily">Daily</option>
                  </select>
                </div>
              </div>

              <!-- Category -->
              <div>
                <label class="block text-xs font-semibold text-slate-600 mb-1.5">Category</label>
                <select
                  v-model="form.category"
                  class="w-full h-9 px-3 text-sm rounded-lg border border-slate-200 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-shadow"
                >
                  <option v-for="cat in CATEGORIES" :key="cat.label" :value="cat.label">
                    {{ cat.label }}
                  </option>
                </select>
              </div>

              <!-- Next billing date -->
              <div>
                <label class="block text-xs font-semibold text-slate-600 mb-1.5">Next billing date</label>
                <input
                  v-model="form.nextBillingDate"
                  type="date"
                  class="w-full h-9 px-3 text-sm rounded-lg border border-slate-200 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-shadow"
                  :class="formErrors.nextBillingDate ? 'border-rose-400' : ''"
                />
                <p v-if="formErrors.nextBillingDate" class="text-xs text-rose-500 mt-1">{{ formErrors.nextBillingDate }}</p>
              </div>

              <!-- Color -->
              <div>
                <label class="block text-xs font-semibold text-slate-600 mb-2">Color</label>
                <div class="flex items-center gap-2.5">
                  <button
                    v-for="color in COLORS"
                    :key="color.key"
                    class="w-7 h-7 rounded-full border-2 transition-all"
                    :class="[
                      color.bg,
                      form.color === color.key
                        ? 'border-slate-800 scale-110 shadow-sm'
                        : 'border-transparent hover:scale-105',
                    ]"
                    :title="color.key"
                    @click="form.color = color.key"
                  />
                </div>
              </div>

            </div>

            <!-- Modal footer -->
            <div class="px-6 py-4 border-t border-slate-100 flex items-center justify-end gap-3 bg-slate-50/50">
              <UButton color="neutral" variant="ghost" size="sm" @click="closeModal">
                Cancel
              </UButton>
              <UButton
                color="primary"
                size="sm"
                class="font-semibold"
                @click="saveSubscription"
              >
                {{ editingId !== null ? 'Save changes' : 'Add subscription' }}
              </UButton>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useSubscriptionsStore } from '~/stores/useSubscriptionsStore'
import type { Subscription } from '~/stores/useSubscriptionsStore'

// ── Page meta ─────────────────────────────────────────────────────────────────

definePageMeta({ layout: 'dashboard' })

useSeoMeta({
  title: 'Subscriptions — Expensio',
  description: 'Track and manage your recurring payments and subscriptions.',
})

// ── Store ─────────────────────────────────────────────────────────────────────

const store = useSubscriptionsStore()

const activeSubscriptions = computed(() => store.activeSubscriptions)
const upcomingBills       = computed(() => store.upcomingBills)
const totalMonthlyCost    = computed(() => store.totalMonthlyCost)

const upcomingBillsTotal = computed(() =>
  upcomingBills.value.reduce((sum, s) => sum + s.amount, 0)
)

// ── Filter tabs ───────────────────────────────────────────────────────────────

const activeTab = ref<'all' | 'active' | 'paused'>('all')

const tabs = computed(() => [
  { key: 'all',    label: 'All',    count: store.subscriptions.length },
  { key: 'active', label: 'Active', count: activeSubscriptions.value.length },
  { key: 'paused', label: 'Paused', count: store.subscriptions.length - activeSubscriptions.value.length },
])

const filteredSubscriptions = computed(() => {
  if (activeTab.value === 'active') return store.subscriptions.filter(s => s.isActive)
  if (activeTab.value === 'paused') return store.subscriptions.filter(s => !s.isActive)
  return store.subscriptions
})

// ── Delete confirm ────────────────────────────────────────────────────────────

const deleteConfirmId = ref<number | null>(null)

function confirmDelete(id: number) {
  store.removeSubscription(id)
  deleteConfirmId.value = null
}

// ── Modal state ───────────────────────────────────────────────────────────────

const showModal  = ref(false)
const editingId  = ref<number | null>(null)

interface FormState {
  name:            string
  amount:          string
  frequency:       'daily' | 'weekly' | 'monthly' | 'yearly'
  category:        string
  nextBillingDate: string
  color:           'emerald' | 'rose' | 'sky' | 'violet' | 'amber'
}

const defaultForm = (): FormState => {
  const d = new Date()
  d.setMonth(d.getMonth() + 1, 1)
  return {
    name:            '',
    amount:          '',
    frequency:       'monthly',
    category:        'Entertainment',
    nextBillingDate: d.toISOString().split('T')[0]!,
    color:           'emerald',
  }
}

const form       = ref<FormState>(defaultForm())
const formErrors = ref<Partial<Record<keyof FormState, string>>>({})

function openModal(sub?: Subscription) {
  formErrors.value = {}
  if (sub) {
    editingId.value = sub.id
    form.value = {
      name:            sub.name,
      amount:          String(sub.amount),
      frequency:       sub.frequency,
      category:        sub.category,
      nextBillingDate: sub.nextBillingDate,
      color:           sub.color,
    }
  } else {
    editingId.value = null
    form.value = defaultForm()
  }
  showModal.value = true
}

function closeModal() {
  showModal.value = false
  editingId.value = null
}

function validateForm(): boolean {
  formErrors.value = {}
  if (!form.value.name.trim())                         formErrors.value.name = 'Name is required'
  if (!form.value.amount || Number(form.value.amount) <= 0) formErrors.value.amount = 'Enter a valid amount'
  if (!form.value.nextBillingDate)                     formErrors.value.nextBillingDate = 'Billing date is required'
  return Object.keys(formErrors.value).length === 0
}

function saveSubscription() {
  if (!validateForm()) return

  const icon = CATEGORIES.find(c => c.label === form.value.category)?.icon ?? 'i-heroicons-tag'
  const data = {
    name:            form.value.name.trim(),
    amount:          Number(form.value.amount),
    frequency:       form.value.frequency,
    category:        form.value.category,
    nextBillingDate: form.value.nextBillingDate,
    color:           form.value.color,
    icon,
  }

  if (editingId.value !== null) {
    store.updateSubscription(editingId.value, data)
  } else {
    store.addSubscription({ ...data, isActive: true })
  }
  closeModal()
}

// ── Constants ─────────────────────────────────────────────────────────────────

const CATEGORIES = [
  { label: 'Entertainment',    icon: 'i-heroicons-musical-note'  },
  { label: 'Health & Fitness', icon: 'i-heroicons-heart'          },
  { label: 'Work & Tools',     icon: 'i-heroicons-briefcase'      },
  { label: 'Cloud & Storage',  icon: 'i-heroicons-cloud'          },
  { label: 'Shopping',         icon: 'i-heroicons-shopping-cart'  },
  { label: 'Education',        icon: 'i-heroicons-academic-cap'   },
  { label: 'Finance',          icon: 'i-heroicons-credit-card'    },
  { label: 'Other',            icon: 'i-heroicons-tag'            },
]

const COLORS = [
  { key: 'emerald' as const, bg: 'bg-emerald-500' },
  { key: 'sky'     as const, bg: 'bg-sky-500'     },
  { key: 'violet'  as const, bg: 'bg-violet-500'  },
  { key: 'amber'   as const, bg: 'bg-amber-500'   },
  { key: 'rose'    as const, bg: 'bg-rose-500'    },
]

// ── Helpers ───────────────────────────────────────────────────────────────────

type Color = 'emerald' | 'rose' | 'sky' | 'violet' | 'amber'

function colorConfig(color: Color) {
  const map: Record<Color, { bg: string; text: string }> = {
    emerald: { bg: 'bg-emerald-50 border border-emerald-100', text: 'text-emerald-600' },
    rose:    { bg: 'bg-rose-50 border border-rose-100',       text: 'text-rose-500'   },
    sky:     { bg: 'bg-sky-50 border border-sky-100',         text: 'text-sky-600'    },
    violet:  { bg: 'bg-violet-50 border border-violet-100',   text: 'text-violet-600' },
    amber:   { bg: 'bg-amber-50 border border-amber-100',     text: 'text-amber-600'  },
  }
  return map[color]
}

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

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day:   'numeric',
    year:  'numeric',
  })
}
</script>
