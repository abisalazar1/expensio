<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-10">

    <!-- ──────────────────────────────────────────────────────────────────────
         A. PAGE HEADER
    ─────────────────────────────────────────────────────────────────────── -->
    <div class="flex items-center gap-4 mb-8">
      <NuxtLink
        :to="`/transactions/${txId}`"
        class="flex items-center justify-center w-9 h-9 rounded-xl bg-white border border-slate-200 shadow-sm hover:bg-slate-50 hover:border-slate-300 transition-all text-slate-500 hover:text-slate-700 shrink-0"
        aria-label="Back to transaction"
      >
        <UIcon name="i-heroicons-arrow-left" class="text-base" />
      </NuxtLink>
      <div>
        <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
          Edit Transaction
        </h1>
        <p class="mt-0.5 text-sm text-slate-500">
          Update the details below.
        </p>
      </div>
    </div>

    <!-- ──────────────────────────────────────────────────────────────────────
         B. FORM (reusable component — no import section)
    ─────────────────────────────────────────────────────────────────────── -->
    <TransactionForm
      :initial-data="initialData"
      submit-label="Update Transaction"
      :cancel-to="`/transactions/${txId}`"
      :is-submitting="isSubmitting"
      :has-error="hasError"
      :error-message="errorMessage"
      @submit="onSubmit"
    />

  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

// ── Page meta ──────────────────────────────────────────────────────────────────

definePageMeta({ layout: 'dashboard' })

const route = useRoute()
const txId  = computed(() => route.params.id as string)

useSeoMeta({
  title:       computed(() => `Edit Transaction #${txId.value} — Expensio`),
  description: 'Update transaction details.',
})

// ── Types ──────────────────────────────────────────────────────────────────────

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

// ── Pre-populate form with existing transaction ────────────────────────────────

// TODO: GET /api/transactions/:id — replace mock with fetched data
const initialData: Partial<TransactionForm> = {
  type:     'expense',
  name:     'Whole Foods Market',
  amount:   84.50,
  category: 'Food & Drink',
  date:     '2026-02-26',
  note:     'Weekly grocery run. Included produce, dairy, and snacks for the week.',
  tags:     ['groceries', 'weekly'],
}

// ── Submit state ──────────────────────────────────────────────────────────────

const isSubmitting = ref(false)
const hasError     = ref(false)
const errorMessage = ref<string | null>(null)

// ── Submit (receives payload from TransactionForm component) ──────────────────

async function onSubmit({ data, receipt }: { data: TransactionForm, receipt: File | null }) {
  hasError.value     = false
  errorMessage.value = null
  isSubmitting.value = true

  try {
    const { $axios } = useNuxtApp()

    if (receipt) {
      const fd = new FormData()
      fd.append('type',     data.type)
      fd.append('name',     data.name.trim())
      fd.append('amount',   String(Number(data.amount)))
      fd.append('category', data.category)
      fd.append('date',     data.date)
      if (data.note.trim()) fd.append('note', data.note.trim())
      data.tags.forEach(t => fd.append('tags[]', t))
      fd.append('receipt',  receipt)
      // TODO: PUT /api/transactions/:id (multipart/form-data)
      await $axios.put(`/transactions/${txId.value}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } })
    } else {
      // TODO: PUT /api/transactions/:id (JSON)
      await $axios.put(`/transactions/${txId.value}`, {
        type:     data.type,
        name:     data.name.trim(),
        amount:   Number(data.amount),
        category: data.category,
        date:     data.date,
        note:     data.note.trim() || null,
        tags:     data.tags,
      })
    }

    await navigateTo(`/transactions/${txId.value}`)
  } catch {
    hasError.value     = true
    errorMessage.value = 'Failed to update the transaction. Please try again.'
  } finally {
    isSubmitting.value = false
  }
}
</script>
