<template>
  <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">

    <!-- ──────────────────────────────────────────────────────────────────────
         LEFT COLUMN: FORM (2/3 width)
    ─────────────────────────────────────────────────────────────────────── -->
    <div class="lg:col-span-2">
      <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">

        <UForm :state="formData" :validate="validate" @submit="onFormSubmit" class="space-y-6">

          <!-- 1. TYPE TOGGLE ─────────────────────────────────────────── -->
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-2">
              Transaction type
            </label>
            <div class="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl">
              <button
                type="button"
                :class="[
                  'flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-semibold transition-all duration-200',
                  formData.type === 'expense'
                    ? 'bg-white text-rose-600 shadow-sm border border-rose-100 shadow-rose-500/10'
                    : 'text-slate-500 hover:text-slate-700',
                ]"
                @click="setType('expense')"
              >
                <UIcon name="i-heroicons-arrow-trending-down" class="text-base shrink-0" />
                Expense
              </button>
              <button
                type="button"
                :class="[
                  'flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-semibold transition-all duration-200',
                  formData.type === 'income'
                    ? 'bg-white text-emerald-600 shadow-sm border border-emerald-100 shadow-emerald-500/10'
                    : 'text-slate-500 hover:text-slate-700',
                ]"
                @click="setType('income')"
              >
                <UIcon name="i-heroicons-arrow-trending-up" class="text-base shrink-0" />
                Income
              </button>
            </div>
          </div>

          <!-- 2. TRANSACTION NAME ─────────────────────────────────────── -->
          <UFormField label="Transaction name" name="name" required>
            <UInput
              v-model="formData.name"
              type="text"
              placeholder="e.g. Whole Foods Market"
              leading-icon="i-heroicons-pencil"
              size="lg"
              class="w-full"
            />
          </UFormField>

          <!-- 3. AMOUNT ──────────────────────────────────────────────── -->
          <UFormField label="Amount" name="amount" required>
            <UInput
              v-model="formData.amount"
              type="number"
              placeholder="0.00"
              :min="0.01"
              :step="0.01"
              size="lg"
              class="w-full"
            >
              <template #leading>
                <span class="text-slate-400 text-sm font-medium select-none">$</span>
              </template>
            </UInput>
          </UFormField>

          <!-- 4. CATEGORY ────────────────────────────────────────────── -->
          <UFormField label="Category" name="category" required>
            <div class="relative flex items-center">
              <div class="pointer-events-none absolute left-3 z-10 flex items-center">
                <UIcon
                  :name="categoryIconMap[formData.category] ?? 'i-heroicons-tag'"
                  class="text-slate-400 text-base"
                />
              </div>
              <select
                v-model="formData.category"
                class="w-full appearance-none bg-white border border-slate-200 rounded-lg pl-9 pr-9 py-2.5 text-sm text-slate-700 font-medium shadow-sm outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-400 transition-all hover:border-slate-300 cursor-pointer"
              >
                <option value="" disabled>Select a category</option>
                <option
                  v-for="cat in filteredCategories"
                  :key="cat"
                  :value="cat"
                >
                  {{ cat }}
                </option>
              </select>
              <div class="pointer-events-none absolute right-3 flex items-center">
                <UIcon name="i-heroicons-chevron-down" class="text-slate-400 text-sm" />
              </div>
            </div>
          </UFormField>

          <!-- 5. DATE ────────────────────────────────────────────────── -->
          <UFormField label="Date" name="date" required>
            <UInput
              v-model="formData.date"
              type="date"
              leading-icon="i-heroicons-calendar-days"
              size="lg"
              class="w-full"
            />
          </UFormField>

          <!-- 6. NOTE ────────────────────────────────────────────────── -->
          <UFormField label="Note" name="note">
            <textarea
              v-model="formData.note"
              placeholder="Optional note..."
              rows="3"
              class="w-full bg-white border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 shadow-sm outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-400 transition-all hover:border-slate-300 resize-none"
            />
          </UFormField>

          <!-- 7. TAGS ─────────────────────────────────────────────────── -->
          <UFormField label="Tags" name="tags">
            <div class="space-y-2">
              <!-- Existing tags as chips -->
              <div v-if="formData.tags.length" class="flex flex-wrap gap-1.5">
                <span
                  v-for="tag in formData.tags"
                  :key="tag"
                  class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200"
                >
                  #{{ tag }}
                  <button
                    type="button"
                    class="text-slate-400 hover:text-rose-500 transition-colors"
                    :aria-label="`Remove tag ${tag}`"
                    @click="removeTag(tag)"
                  >
                    <UIcon name="i-heroicons-x-mark" class="text-[10px]" />
                  </button>
                </span>
              </div>
              <!-- Input row -->
              <div class="flex gap-2">
                <UInput
                  v-model="tagInput"
                  type="text"
                  placeholder="Add a tag..."
                  leading-icon="i-heroicons-hashtag"
                  size="lg"
                  class="flex-1"
                  @keydown="onTagKeydown"
                />
                <button
                  type="button"
                  :disabled="!tagInput.trim()"
                  class="flex items-center justify-center w-11 h-11 rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
                  aria-label="Add tag"
                  @click="addTag"
                >
                  <UIcon name="i-heroicons-plus" class="text-base" />
                </button>
              </div>
              <p class="text-xs text-slate-400">Press Enter or comma to quickly add a tag.</p>
            </div>
          </UFormField>

          <!-- 8. RECEIPT PHOTO ─────────────────────────────────────────── -->
          <UFormField label="Receipt photo" name="receipt">
            <!-- Drop zone (no file selected) -->
            <div v-if="!receiptFile">
              <div
                role="button"
                tabindex="0"
                class="border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all group"
                :class="receiptIsDragging
                  ? 'border-emerald-400 bg-emerald-50/50'
                  : 'border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/20'"
                @click="receiptInputRef?.click()"
                @keydown.enter="receiptInputRef?.click()"
                @dragover.prevent="receiptIsDragging = true"
                @dragleave="receiptIsDragging = false"
                @drop.prevent="onReceiptDrop"
              >
                <UIcon
                  name="i-heroicons-camera"
                  class="text-3xl mb-2 transition-colors"
                  :class="receiptIsDragging ? 'text-emerald-400' : 'text-slate-300 group-hover:text-emerald-400'"
                />
                <p class="text-sm font-medium text-slate-500 group-hover:text-slate-700 transition-colors">
                  Click or drag a photo here
                </p>
                <p class="text-xs text-slate-400 mt-0.5">PNG, JPG, WEBP — max 10 MB</p>
              </div>
              <input
                ref="receiptInputRef"
                type="file"
                accept="image/*"
                class="hidden"
                @change="onReceiptChange"
              />
            </div>
            <!-- Thumbnail preview (file selected) -->
            <div v-else class="flex items-start gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
              <img
                :src="receiptPreviewUrl ?? ''"
                alt="Receipt preview"
                class="w-20 h-20 rounded-lg object-cover border border-slate-200 shrink-0"
              />
              <div class="flex-1 min-w-0">
                <p class="text-sm font-semibold text-slate-700 truncate">{{ receiptFile.name }}</p>
                <p class="text-xs text-slate-400 mt-0.5">{{ formatFileSize(receiptFile.size) }}</p>
                <button
                  type="button"
                  class="mt-2 flex items-center gap-1 text-xs text-rose-500 hover:text-rose-700 font-medium transition-colors"
                  @click="removeReceipt"
                >
                  <UIcon name="i-heroicons-trash" class="text-sm" />
                  Remove
                </button>
              </div>
            </div>
          </UFormField>

          <!-- ERROR ALERT ─────────────────────────────────────────────── -->
          <UAlert
            v-if="hasError"
            color="error"
            variant="subtle"
            icon="i-heroicons-exclamation-circle"
            :description="errorMessage ?? undefined"
          />

          <!-- SUBMIT ──────────────────────────────────────────────────── -->
          <div class="space-y-3 pt-1">
            <UButton
              type="submit"
              :color="formData.type === 'income' ? 'primary' : 'error'"
              size="lg"
              block
              :loading="isSubmitting"
              :disabled="isSubmitting"
              leading-icon="i-heroicons-check"
              :class="[
                'font-semibold',
                formData.type === 'income'
                  ? 'shadow-sm shadow-emerald-500/20'
                  : 'shadow-sm shadow-rose-500/20',
              ]"
            >
              {{ isSubmitting ? 'Saving...' : submitLabel }}
            </UButton>

            <div class="text-center">
              <NuxtLink
                :to="cancelTo"
                class="text-sm text-slate-400 hover:text-slate-600 transition-colors"
              >
                Cancel
              </NuxtLink>
            </div>
          </div>

        </UForm>
      </div>
    </div>

    <!-- ──────────────────────────────────────────────────────────────────────
         RIGHT COLUMN: LIVE PREVIEW CARD (1/3 width)
    ─────────────────────────────────────────────────────────────────────── -->
    <div class="lg:col-span-1">
      <div class="lg:sticky lg:top-6">
        <p class="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 px-1">
          Preview
        </p>

        <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <!-- Color strip -->
          <div
            :class="[
              'h-1.5 w-full transition-colors duration-300',
              formData.type === 'income' ? 'bg-emerald-500' : 'bg-rose-500',
            ]"
          />

          <div class="p-5">
            <!-- Icon + type badge row -->
            <div class="flex items-center justify-between mb-4">
              <div
                :class="[
                  'w-12 h-12 rounded-xl flex items-center justify-center border transition-colors duration-300',
                  formData.type === 'income'
                    ? 'bg-emerald-50 border-emerald-100'
                    : 'bg-rose-50 border-rose-100',
                ]"
              >
                <UIcon
                  :name="categoryIconMap[formData.category] ?? 'i-heroicons-banknotes'"
                  :class="[
                    'text-xl transition-colors duration-300',
                    formData.type === 'income' ? 'text-emerald-600' : 'text-rose-500',
                  ]"
                />
              </div>
              <UBadge
                :color="formData.type === 'income' ? 'primary' : 'error'"
                variant="subtle"
                size="sm"
              >
                {{ formData.type === 'income' ? 'Income' : 'Expense' }}
              </UBadge>
            </div>

            <!-- Receipt thumbnail in preview -->
            <div v-if="receiptPreviewUrl" class="mb-4">
              <img
                :src="receiptPreviewUrl"
                alt="Receipt"
                class="w-full h-28 object-cover rounded-lg border border-slate-200"
              />
            </div>

            <!-- Transaction name -->
            <p
              :class="[
                'text-base font-bold truncate mb-1',
                formData.name ? 'text-slate-900' : 'text-slate-400',
              ]"
            >
              {{ formData.name || 'Transaction name' }}
            </p>

            <!-- Amount -->
            <p
              :class="[
                'text-2xl font-extrabold tabular-nums transition-colors duration-300',
                formData.type === 'income' ? 'text-emerald-600' : 'text-rose-500',
                formData.tags.length ? 'mb-3' : 'mb-4',
              ]"
            >
              {{ previewAmount }}
            </p>

            <!-- Tags in preview -->
            <div v-if="formData.tags.length" class="flex flex-wrap gap-1 mb-4">
              <span
                v-for="tag in formData.tags"
                :key="tag"
                class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-600 border border-slate-200"
              >
                #{{ tag }}
              </span>
            </div>

            <!-- Divider + meta rows -->
            <div class="border-t border-slate-100 pt-4 space-y-2.5">
              <div class="flex items-center justify-between">
                <span class="text-xs text-slate-400 font-medium">Category</span>
                <span class="text-xs font-semibold text-slate-700">
                  {{ formData.category || '—' }}
                </span>
              </div>

              <div class="flex items-center justify-between">
                <span class="text-xs text-slate-400 font-medium">Date</span>
                <span class="text-xs font-semibold text-slate-700">
                  {{ formData.date ? formatDate(formData.date) : '—' }}
                </span>
              </div>

              <div v-if="formData.note" class="flex items-start justify-between gap-3">
                <span class="text-xs text-slate-400 font-medium shrink-0">Note</span>
                <span class="text-xs text-slate-600 text-right line-clamp-2">
                  {{ formData.note }}
                </span>
              </div>

              <div v-if="receiptFile" class="flex items-center justify-between">
                <span class="text-xs text-slate-400 font-medium">Receipt</span>
                <span class="flex items-center gap-1 text-xs font-semibold text-emerald-600">
                  <UIcon name="i-heroicons-paper-clip" class="text-sm" />
                  Attached
                </span>
              </div>
            </div>
          </div>
        </div>

        <p class="text-xs text-slate-400 mt-3 px-1 text-center leading-relaxed">
          Fill in the form to see your transaction preview update in real time.
        </p>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import type { FormError, FormSubmitEvent } from '@nuxt/ui'
import { computed, onMounted, onUnmounted, reactive, ref } from 'vue'

// ── Props & emits ─────────────────────────────────────────────────────────────

type TransactionType = 'expense' | 'income'

interface TransactionForm {
  type:     TransactionType
  name:     string
  amount:   number | null
  category: string
  date:     string
  note:     string
  tags:     string[]
}

interface SubmitPayload {
  data:    TransactionForm
  receipt: File | null
}

const props = withDefaults(defineProps<{
  initialData?:  Partial<TransactionForm>
  submitLabel?:  string
  cancelTo?:     string
  isSubmitting?: boolean
  hasError?:     boolean
  errorMessage?: string | null
}>(), {
  initialData:  () => ({}),
  submitLabel:  'Save Transaction',
  cancelTo:     '/transactions',
  isSubmitting: false,
  hasError:     false,
  errorMessage: null,
})

const emit = defineEmits<{
  submit: [payload: SubmitPayload]
}>()

// ── Constants ─────────────────────────────────────────────────────────────────

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

const ALL_EXPENSE_CATEGORIES = [
  'Food & Drink',
  'Housing',
  'Transport',
  'Utilities',
  'Health',
  'Entertainment',
  'Shopping',
  'Other',
] as const

const INCOME_CATEGORIES = [
  'Income',
  'Other',
] as const

// ── Helpers ───────────────────────────────────────────────────────────────────

function getTodayISO(): string {
  const d  = new Date()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${mm}-${dd}`
}

// ── Form state ────────────────────────────────────────────────────────────────

const formData = reactive<TransactionForm>({
  type:     'expense',
  name:     '',
  amount:   null,
  category: '',
  date:     getTodayISO(),
  note:     '',
  tags:     [],
})

// Merge initialData on mount (handles edit mode pre-population)
onMounted(() => {
  const d = props.initialData
  if (!d) return
  if (d.type)     formData.type     = d.type
  if (d.name)     formData.name     = d.name
  if (d.amount != null) formData.amount = d.amount
  if (d.category) formData.category = d.category
  if (d.date)     formData.date     = d.date
  if (d.note)     formData.note     = d.note
  if (d.tags)     formData.tags     = [...d.tags]
})

// ── Derived state ─────────────────────────────────────────────────────────────

const filteredCategories = computed((): readonly string[] => {
  return formData.type === 'income' ? INCOME_CATEGORIES : ALL_EXPENSE_CATEGORIES
})

const previewAmount = computed((): string => {
  const val = Number(formData.amount)
  if (!formData.amount || isNaN(val) || val <= 0) return '$0.00'
  return formatCurrency(val)
})

// ── Type toggle ───────────────────────────────────────────────────────────────

function setType(type: TransactionType): void {
  formData.type = type
  const available: readonly string[] = type === 'income' ? INCOME_CATEGORIES : ALL_EXPENSE_CATEGORIES
  if (!available.includes(formData.category)) {
    formData.category = ''
  }
}

// ── Tags ──────────────────────────────────────────────────────────────────────

const tagInput = ref('')

function addTag(): void {
  const tag = tagInput.value.trim().replace(/,+$/, '').trim()
  if (tag && !formData.tags.includes(tag)) {
    formData.tags.push(tag)
  }
  tagInput.value = ''
}

function removeTag(tag: string): void {
  const idx = formData.tags.indexOf(tag)
  if (idx !== -1) formData.tags.splice(idx, 1)
}

function onTagKeydown(e: KeyboardEvent): void {
  if (e.key === 'Enter' || e.key === ',') {
    e.preventDefault()
    addTag()
  }
}

// ── Receipt photo ─────────────────────────────────────────────────────────────

const receiptInputRef   = ref<HTMLInputElement | null>(null)
const receiptFile       = ref<File | null>(null)
const receiptPreviewUrl = ref<string | null>(null)
const receiptIsDragging = ref(false)

function setReceiptFile(file: File | null): void {
  if (receiptPreviewUrl.value) URL.revokeObjectURL(receiptPreviewUrl.value)
  receiptFile.value       = file
  receiptPreviewUrl.value = file ? URL.createObjectURL(file) : null
}

function onReceiptChange(e: Event): void {
  const file = (e.target as HTMLInputElement).files?.[0] ?? null
  setReceiptFile(file)
}

function onReceiptDrop(e: DragEvent): void {
  receiptIsDragging.value = false
  const file = e.dataTransfer?.files?.[0] ?? null
  if (file && file.type.startsWith('image/')) setReceiptFile(file)
}

function removeReceipt(): void {
  setReceiptFile(null)
  if (receiptInputRef.value) receiptInputRef.value.value = ''
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024)          return `${bytes} B`
  if (bytes < 1024 * 1024)   return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

// ── Validation ────────────────────────────────────────────────────────────────

const validate = (state: TransactionForm): FormError[] => {
  const errors: FormError[] = []

  if (!state.name.trim()) {
    errors.push({ name: 'name', message: 'Transaction name is required.' })
  }

  if (state.amount === null || Number(state.amount) <= 0) {
    errors.push({ name: 'amount', message: 'Please enter a valid amount greater than $0.00.' })
  }

  if (!state.category) {
    errors.push({ name: 'category', message: 'Please select a category.' })
  }

  if (!state.date) {
    errors.push({ name: 'date', message: 'Date is required.' })
  }

  return errors
}

// ── Submit — bubble up to parent ──────────────────────────────────────────────

function onFormSubmit(_event: FormSubmitEvent<TransactionForm>): void {
  emit('submit', {
    data:    { ...formData, tags: [...formData.tags] },
    receipt: receiptFile.value,
  })
}

// ── Formatters ────────────────────────────────────────────────────────────────

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
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

// ── Cleanup ───────────────────────────────────────────────────────────────────

onUnmounted(() => {
  if (receiptPreviewUrl.value) URL.revokeObjectURL(receiptPreviewUrl.value)
})
</script>
