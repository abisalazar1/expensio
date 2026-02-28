<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-10">

    <!-- ──────────────────────────────────────────────────────────────────────
         A. PAGE HEADER
    ─────────────────────────────────────────────────────────────────────── -->
    <div class="flex items-center gap-4 mb-8">
      <NuxtLink
        to="/transactions"
        class="flex items-center justify-center w-9 h-9 rounded-xl bg-white border border-slate-200 shadow-sm hover:bg-slate-50 hover:border-slate-300 transition-all text-slate-500 hover:text-slate-700 shrink-0"
        aria-label="Back to transactions"
      >
        <UIcon name="i-heroicons-arrow-left" class="text-base" />
      </NuxtLink>
      <div>
        <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
          Add Transaction
        </h1>
        <p class="mt-0.5 text-sm text-slate-500">
          Record a new income or expense entry.
        </p>
      </div>
    </div>

    <!-- ──────────────────────────────────────────────────────────────────────
         B. MODE TABS
    ─────────────────────────────────────────────────────────────────────── -->
    <div class="flex gap-1 p-1 bg-slate-100 rounded-xl w-fit mb-8">
      <button
        type="button"
        :class="[
          'flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200',
          mode === 'manual' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700',
        ]"
        @click="mode = 'manual'"
      >
        <UIcon name="i-heroicons-pencil-square" class="text-base" />
        Add Manually
      </button>
      <button
        type="button"
        :class="[
          'flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200',
          mode === 'csv' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700',
        ]"
        @click="mode = 'csv'"
      >
        <UIcon name="i-heroicons-arrow-up-tray" class="text-base" />
        Import CSV
      </button>
    </div>

    <!-- ──────────────────────────────────────────────────────────────────────
         C. MANUAL FORM
    ─────────────────────────────────────────────────────────────────────── -->
    <!-- ──────────────────────────────────────────────────────────────────────
         C. MANUAL FORM / D. CSV IMPORT
    ─────────────────────────────────────────────────────────────────────── -->
    <TransactionForm
      v-if="mode === 'manual'"
      cancel-to="/transactions"
      :is-submitting="isSubmitting"
      :has-error="hasError"
      :error-message="errorMessage"
      @submit="onSubmit"
    />
    <div v-else class="max-w-5xl">

      <!-- Step 1: No file yet — drop zone -->
      <div v-if="!csvParsed">
        <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
          <div
            role="button"
            tabindex="0"
            class="border-2 border-dashed rounded-xl p-14 text-center cursor-pointer transition-all"
            :class="csvIsDragging
              ? 'border-sky-400 bg-sky-50'
              : 'border-slate-200 hover:border-sky-300 hover:bg-sky-50/30'"
            @click="csvInputRef?.click()"
            @keydown.enter="csvInputRef?.click()"
            @dragover.prevent="csvIsDragging = true"
            @dragleave="csvIsDragging = false"
            @drop.prevent="onCsvDrop"
          >
            <UIcon
              name="i-heroicons-document-arrow-up"
              class="text-5xl mb-3 transition-colors"
              :class="csvIsDragging ? 'text-sky-400' : 'text-slate-300'"
            />
            <p class="text-base font-semibold text-slate-600 mb-1">Drop your CSV file here</p>
            <p class="text-sm text-slate-400">or click to browse — .csv files only</p>
          </div>
          <input
            ref="csvInputRef"
            type="file"
            accept=".csv,text/csv"
            class="hidden"
            @change="onCsvFileChange"
          />

          <div class="mt-6 p-4 bg-slate-50 rounded-xl border border-slate-200">
            <p class="text-xs font-semibold text-slate-500 mb-1">Expected format</p>
            <p class="text-xs text-slate-400 leading-relaxed">
              Your CSV must have at least a <strong>date</strong>, a <strong>name / description</strong>,
              and an <strong>amount</strong> column. Most bank export formats work out of the box.
              You'll be able to map any column names in the next step.
            </p>
          </div>

          <UAlert
            v-if="csvParseError"
            color="error"
            variant="subtle"
            icon="i-heroicons-exclamation-circle"
            :description="csvParseError"
            class="mt-4"
          />
        </div>
      </div>

      <!-- Step 2: File parsed — column mapping + preview + import -->
      <div v-else class="space-y-6">

        <!-- Column mapping card -->
        <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
          <div class="flex items-center justify-between mb-5">
            <div>
              <h2 class="text-base font-bold text-slate-900">Map Columns</h2>
              <p class="text-sm text-slate-500 mt-0.5">
                {{ csvRows.length }} rows detected in
                <span class="font-semibold text-slate-700">{{ csvFileName }}</span>
              </p>
            </div>
            <button
              type="button"
              class="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 font-medium transition-colors"
              @click="resetCsv"
            >
              <UIcon name="i-heroicons-arrow-path" class="text-base" />
              Change file
            </button>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            <!-- Date column -->
            <div>
              <label class="block text-xs font-semibold text-slate-600 mb-1.5">
                Date column <span class="text-rose-500">*</span>
              </label>
              <select
                v-model="csvColDate"
                class="w-full appearance-none bg-white border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-700 shadow-sm outline-none focus:ring-2 focus:ring-sky-500/40 focus:border-sky-400 transition-all hover:border-slate-300 cursor-pointer"
              >
                <option value="">— select column —</option>
                <option v-for="h in csvHeaders" :key="h" :value="h">{{ h }}</option>
              </select>
            </div>

            <!-- Name column -->
            <div>
              <label class="block text-xs font-semibold text-slate-600 mb-1.5">
                Name / Description <span class="text-rose-500">*</span>
              </label>
              <select
                v-model="csvColName"
                class="w-full appearance-none bg-white border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-700 shadow-sm outline-none focus:ring-2 focus:ring-sky-500/40 focus:border-sky-400 transition-all hover:border-slate-300 cursor-pointer"
              >
                <option value="">— select column —</option>
                <option v-for="h in csvHeaders" :key="h" :value="h">{{ h }}</option>
              </select>
            </div>

            <!-- Amount column -->
            <div>
              <label class="block text-xs font-semibold text-slate-600 mb-1.5">
                Amount <span class="text-rose-500">*</span>
              </label>
              <select
                v-model="csvColAmount"
                class="w-full appearance-none bg-white border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-700 shadow-sm outline-none focus:ring-2 focus:ring-sky-500/40 focus:border-sky-400 transition-all hover:border-slate-300 cursor-pointer"
              >
                <option value="">— select column —</option>
                <option v-for="h in csvHeaders" :key="h" :value="h">{{ h }}</option>
              </select>
            </div>

            <!-- Type column (optional) -->
            <div>
              <label class="block text-xs font-semibold text-slate-600 mb-1.5">
                Type column
                <span class="ml-1 text-[10px] font-normal text-slate-400">(optional)</span>
              </label>
              <select
                v-model="csvColType"
                class="w-full appearance-none bg-white border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-700 shadow-sm outline-none focus:ring-2 focus:ring-sky-500/40 focus:border-sky-400 transition-all hover:border-slate-300 cursor-pointer"
              >
                <option value="">— not in CSV —</option>
                <option v-for="h in csvHeaders" :key="h" :value="h">{{ h }}</option>
              </select>
            </div>

            <!-- Category column (optional) -->
            <div>
              <label class="block text-xs font-semibold text-slate-600 mb-1.5">
                Category column
                <span class="ml-1 text-[10px] font-normal text-slate-400">(optional)</span>
              </label>
              <select
                v-model="csvColCategory"
                class="w-full appearance-none bg-white border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-700 shadow-sm outline-none focus:ring-2 focus:ring-sky-500/40 focus:border-sky-400 transition-all hover:border-slate-300 cursor-pointer"
              >
                <option value="">— not in CSV —</option>
                <option v-for="h in csvHeaders" :key="h" :value="h">{{ h }}</option>
              </select>
            </div>

            <!-- Default type (shown only when no type column is mapped) -->
            <div v-if="!csvColType">
              <label class="block text-xs font-semibold text-slate-600 mb-1.5">Default type</label>
              <div class="grid grid-cols-2 gap-1 p-1 bg-slate-100 rounded-lg">
                <button
                  type="button"
                  :class="[
                    'py-2 rounded-md text-xs font-semibold transition-all',
                    csvDefaultType === 'expense'
                      ? 'bg-white text-rose-600 shadow-sm'
                      : 'text-slate-500 hover:text-slate-700',
                  ]"
                  @click="csvDefaultType = 'expense'"
                >
                  Expense
                </button>
                <button
                  type="button"
                  :class="[
                    'py-2 rounded-md text-xs font-semibold transition-all',
                    csvDefaultType === 'income'
                      ? 'bg-white text-emerald-600 shadow-sm'
                      : 'text-slate-500 hover:text-slate-700',
                  ]"
                  @click="csvDefaultType = 'income'"
                >
                  Income
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Preview table -->
        <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div class="px-5 py-4 border-b border-slate-100">
            <h2 class="text-sm font-bold text-slate-900">
              Preview
              <span class="font-normal text-slate-400 ml-1">
                ({{ csvPreviewRows.length }} of {{ csvRows.length }} rows)
              </span>
            </h2>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead>
                <tr class="bg-slate-50 border-b border-slate-100">
                  <th class="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide whitespace-nowrap">Date</th>
                  <th class="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Name</th>
                  <th class="px-4 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wide">Amount</th>
                  <th class="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Type</th>
                  <th class="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Category</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-50">
                <tr
                  v-for="(row, i) in csvPreviewRows"
                  :key="i"
                  class="hover:bg-slate-50/50 transition-colors"
                >
                  <td class="px-4 py-3 text-slate-500 whitespace-nowrap text-xs">
                    {{ csvColDate ? row[csvColDate] : '—' }}
                  </td>
                  <td class="px-4 py-3 font-medium text-slate-800">
                    {{ csvColName ? (row[csvColName] || '—') : '—' }}
                  </td>
                  <td
                    class="px-4 py-3 text-right font-semibold tabular-nums"
                    :class="csvResolveType(row) === 'income' ? 'text-emerald-600' : 'text-rose-500'"
                  >
                    {{ csvColAmount ? formatCurrency(parseAmount(row[csvColAmount] ?? '')) : '—' }}
                  </td>
                  <td class="px-4 py-3">
                    <UBadge
                      :color="csvResolveType(row) === 'income' ? 'primary' : 'error'"
                      variant="subtle"
                      size="sm"
                    >
                      {{ csvResolveType(row) }}
                    </UBadge>
                  </td>
                  <td class="px-4 py-3 text-slate-500 text-xs">
                    {{ csvColCategory ? (row[csvColCategory] || '—') : '—' }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div
            v-if="csvRows.length > 5"
            class="px-5 py-3 border-t border-slate-100 text-xs text-slate-400 text-center"
          >
            + {{ csvRows.length - 5 }} more rows not shown in preview
          </div>
        </div>

        <!-- Import alerts -->
        <UAlert
          v-if="csvImportError"
          color="error"
          variant="subtle"
          icon="i-heroicons-exclamation-circle"
          :description="csvImportError"
        />
        <UAlert
          v-if="csvImportSuccess"
          color="primary"
          variant="subtle"
          icon="i-heroicons-check-circle"
          :description="csvImportSuccess"
        />

        <!-- Import button -->
        <div class="flex flex-col sm:flex-row items-center gap-4">
          <UButton
            type="button"
            color="primary"
            size="lg"
            :loading="csvIsImporting"
            :disabled="csvIsImporting || !csvMappingValid"
            leading-icon="i-heroicons-arrow-up-tray"
            class="font-semibold shadow-sm shadow-emerald-500/20 sm:w-auto w-full"
            @click="onImportCSV"
          >
            {{ csvIsImporting ? 'Importing...' : `Import ${csvRows.length} Transaction${csvRows.length !== 1 ? 's' : ''}` }}
          </UButton>
          <NuxtLink
            to="/transactions"
            class="text-sm text-slate-400 hover:text-slate-600 transition-colors"
          >
            Cancel
          </NuxtLink>
        </div>

      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

// ── Page meta ─────────────────────────────────────────────────────────────────

definePageMeta({ layout: 'dashboard' })

useSeoMeta({
  title:       'Add Transaction — Expensio',
  description: 'Record a new income or expense transaction.',
})

// ── Types ─────────────────────────────────────────────────────────────────────

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

interface CsvRow { [key: string]: string }

// ── Mode ──────────────────────────────────────────────────────────────────────

const mode = ref<'manual' | 'csv'>('manual')

// ── Manual form submit state (passed as props to TransactionForm) ──────────────

const isSubmitting = ref(false)
const hasError     = ref(false)
const errorMessage = ref<string | null>(null)

// ── Helpers ───────────────────────────────────────────────────────────────────

function getTodayISO(): string {
  const d  = new Date()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${mm}-${dd}`
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style:                 'currency',
    currency:              'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

// ── CSV import ────────────────────────────────────────────────────────────────

const csvInputRef      = ref<HTMLInputElement | null>(null)
const csvFileName      = ref('')
const csvHeaders       = ref<string[]>([])
const csvRows          = ref<CsvRow[]>([])
const csvIsDragging    = ref(false)
const csvIsImporting   = ref(false)
const csvImportError   = ref<string | null>(null)
const csvImportSuccess = ref<string | null>(null)
const csvParseError    = ref<string | null>(null)

const csvColDate     = ref('')
const csvColName     = ref('')
const csvColAmount   = ref('')
const csvColType     = ref('')
const csvColCategory = ref('')
const csvDefaultType = ref<TransactionType>('expense')

const csvParsed      = computed(() => csvHeaders.value.length > 0)
const csvPreviewRows = computed(() => csvRows.value.slice(0, 5))
const csvMappingValid = computed(() =>
  !!csvColDate.value && !!csvColName.value && !!csvColAmount.value,
)

// Basic CSV line parser — handles quoted fields containing commas
function parseCsvLine(line: string): string[] {
  const result: string[] = []
  let current  = ''
  let inQuotes = false
  for (let i = 0; i < line.length; i++) {
    const ch = line[i]
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') { current += '"'; i++ }
      else { inQuotes = !inQuotes }
    } else if (ch === ',' && !inQuotes) {
      result.push(current.trim())
      current = ''
    } else {
      current += ch
    }
  }
  result.push(current.trim())
  return result
}

function parseCsvText(text: string): { headers: string[], rows: CsvRow[] } {
  const lines = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n').trim().split('\n')
  if (lines.length < 2) return { headers: [], rows: [] }
  const headers = parseCsvLine(lines[0] as string)
  const rows = lines.slice(1).filter(l => l.trim()).map((line) => {
    const values = parseCsvLine(line)
    const row: CsvRow = {}
    headers.forEach((h, i) => { row[h] = values[i] ?? '' })
    return row
  })
  return { headers, rows }
}

// Auto-detect common column header names
function autoDetectColumns(headers: string[]): void {
  const n = (s: string) => s.toLowerCase().trim()
  const DATE_KEYS   = ['date', 'transaction date', 'trans date', 'date posted', 'posted date', 'value date']
  const NAME_KEYS   = ['name', 'description', 'memo', 'payee', 'merchant', 'narrative', 'details', 'transaction']
  const AMOUNT_KEYS = ['amount', 'debit', 'credit', 'value', 'sum', 'transaction amount']
  const TYPE_KEYS   = ['type', 'transaction type', 'credit/debit', 'dr/cr']
  const CAT_KEYS    = ['category', 'categories', 'tag', 'label']
  csvColDate.value     = headers.find(h => DATE_KEYS.includes(n(h)))   ?? ''
  csvColName.value     = headers.find(h => NAME_KEYS.includes(n(h)))   ?? ''
  csvColAmount.value   = headers.find(h => AMOUNT_KEYS.includes(n(h))) ?? ''
  csvColType.value     = headers.find(h => TYPE_KEYS.includes(n(h)))   ?? ''
  csvColCategory.value = headers.find(h => CAT_KEYS.includes(n(h)))    ?? ''
}

async function loadCsvFile(file: File): Promise<void> {
  csvParseError.value    = null
  csvImportError.value   = null
  csvImportSuccess.value = null
  try {
    const text = await file.text()
    const { headers, rows } = parseCsvText(text)
    if (!headers.length) throw new Error('Could not detect column headers.')
    if (!rows.length)    throw new Error('The file appears to be empty.')
    csvFileName.value = file.name
    csvHeaders.value  = headers
    csvRows.value     = rows
    autoDetectColumns(headers)
  } catch (err: unknown) {
    csvParseError.value = err instanceof Error ? err.message : 'Failed to parse the CSV file.'
  }
}

async function onCsvFileChange(e: Event): Promise<void> {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (file) await loadCsvFile(file)
}

function onCsvDrop(e: DragEvent): void {
  csvIsDragging.value = false
  const file = e.dataTransfer?.files?.[0]
  if (file) loadCsvFile(file)
}

function resetCsv(): void {
  csvFileName.value      = ''
  csvHeaders.value       = []
  csvRows.value          = []
  csvColDate.value       = ''
  csvColName.value       = ''
  csvColAmount.value     = ''
  csvColType.value       = ''
  csvColCategory.value   = ''
  csvImportError.value   = null
  csvImportSuccess.value = null
  csvParseError.value    = null
  if (csvInputRef.value) csvInputRef.value.value = ''
}

function parseAmount(val: string): number {
  return Math.abs(parseFloat(val.replace(/[^0-9.\-]/g, '')) || 0)
}

function csvResolveType(row: CsvRow): TransactionType {
  if (!csvColType.value) return csvDefaultType.value
  const val = (row[csvColType.value] ?? '').toLowerCase().trim()
  if (['income', 'credit', 'deposit', 'cr', 'payment received'].includes(val)) return 'income'
  return 'expense'
}

async function onImportCSV(): Promise<void> {
  if (!csvMappingValid.value) return
  csvIsImporting.value   = true
  csvImportError.value   = null
  csvImportSuccess.value = null
  try {
    const { $axios } = useNuxtApp()
    const transactions = csvRows.value.map(row => ({
      type:     csvResolveType(row),
      name:     (csvColName.value ? row[csvColName.value] : '') || 'Imported transaction',
      amount:   parseAmount(csvColAmount.value ? (row[csvColAmount.value] ?? '') : ''),
      category: (csvColCategory.value ? row[csvColCategory.value] : '') || 'Other',
      date:     csvColDate.value ? row[csvColDate.value] : getTodayISO(),
      note:     null,
    }))

    // TODO: POST /api/transactions/bulk
    await $axios.post('/transactions/bulk', { transactions })

    const count = transactions.length
    csvImportSuccess.value = `Successfully imported ${count} transaction${count !== 1 ? 's' : ''}.`
    setTimeout(() => navigateTo('/transactions'), 1500)
  } catch {
    csvImportError.value = 'Failed to import transactions. Please try again.'
  } finally {
    csvIsImporting.value = false
  }
}

// ── Submit (receives payload from TransactionForm component) ──────────────────

async function onSubmit({ data, receipt }: { data: TransactionForm, receipt: File | null }) {
  hasError.value     = false
  errorMessage.value = null
  isSubmitting.value = true

  try {
    const { $axios } = useNuxtApp()

    if (receipt) {
      // Multipart when a receipt is attached
      const fd = new FormData()
      fd.append('type',     data.type)
      fd.append('name',     data.name.trim())
      fd.append('amount',   String(Number(data.amount)))
      fd.append('category', data.category)
      fd.append('date',     data.date)
      if (data.note.trim()) fd.append('note', data.note.trim())
      data.tags.forEach(t => fd.append('tags[]', t))
      fd.append('receipt',  receipt)
      // TODO: POST /api/transactions (multipart/form-data)
      await $axios.post('/transactions', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
    } else {
      // TODO: POST /api/transactions (JSON)
      await $axios.post('/transactions', {
        type:     data.type,
        name:     data.name.trim(),
        amount:   Number(data.amount),
        category: data.category,
        date:     data.date,
        note:     data.note.trim() || null,
        tags:     data.tags,
      })
    }

    await navigateTo('/transactions')
  } catch {
    hasError.value     = true
    errorMessage.value = 'Failed to save the transaction. Please try again.'
  } finally {
    isSubmitting.value = false
  }
}
</script>
