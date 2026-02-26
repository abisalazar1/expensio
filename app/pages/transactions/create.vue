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
    <div v-if="mode === 'manual'" class="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">

      <!-- ── LEFT COLUMN: FORM (2/3 width) ─────────────────────────────── -->
      <div class="lg:col-span-2">
        <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">

          <UForm :state="formData" :validate="validate" @submit="onSubmit" class="space-y-6">

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
                {{ isSubmitting ? 'Saving...' : 'Save Transaction' }}
              </UButton>

              <div class="text-center">
                <NuxtLink
                  to="/transactions"
                  class="text-sm text-slate-400 hover:text-slate-600 transition-colors"
                >
                  Cancel
                </NuxtLink>
              </div>
            </div>

          </UForm>
        </div>
      </div>

      <!-- ── RIGHT COLUMN: LIVE PREVIEW CARD (1/3 width) ──────────────── -->
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

    <!-- ──────────────────────────────────────────────────────────────────────
         D. CSV IMPORT
    ─────────────────────────────────────────────────────────────────────── -->
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
import type { FormError, FormSubmitEvent } from '@nuxt/ui'
import { computed, onUnmounted, reactive, ref } from 'vue'

// ── Page meta ─────────────────────────────────────────────────────────────────

definePageMeta({ layout: 'dashboard' })

useSeoMeta({
  title: 'Add Transaction — Expensio',
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

// ── Constants ─────────────────────────────────────────────────────────────────

// Hardcoded color maps — avoids Tailwind purge issues with dynamic class names
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

// ── Mode ──────────────────────────────────────────────────────────────────────

const mode = ref<'manual' | 'csv'>('manual')

// ── Helpers ───────────────────────────────────────────────────────────────────

function getTodayISO(): string {
  const d  = new Date()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${mm}-${dd}`
}

// ── Reactive form state ───────────────────────────────────────────────────────

const formData = reactive<TransactionForm>({
  type:     'expense',
  name:     '',
  amount:   null,
  category: '',
  date:     getTodayISO(),
  note:     '',
  tags:     [],
})

const isSubmitting = ref(false)
const hasError     = ref(false)
const errorMessage = ref<string | null>(null)

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

const receiptInputRef  = ref<HTMLInputElement | null>(null)
const receiptFile      = ref<File | null>(null)
const receiptPreviewUrl = ref<string | null>(null)
const receiptIsDragging = ref(false)

function setReceiptFile(file: File | null): void {
  if (receiptPreviewUrl.value) URL.revokeObjectURL(receiptPreviewUrl.value)
  receiptFile.value      = file
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

// ── Submit ────────────────────────────────────────────────────────────────────

const onSubmit = async (_event: FormSubmitEvent<TransactionForm>) => {
  hasError.value     = false
  errorMessage.value = null
  isSubmitting.value = true

  try {
    const { $axios } = useNuxtApp()

    if (receiptFile.value) {
      // Multipart when a receipt is attached
      const fd = new FormData()
      fd.append('type',     formData.type)
      fd.append('name',     formData.name.trim())
      fd.append('amount',   String(Number(formData.amount)))
      fd.append('category', formData.category)
      fd.append('date',     formData.date)
      if (formData.note.trim()) fd.append('note', formData.note.trim())
      formData.tags.forEach(t => fd.append('tags[]', t))
      fd.append('receipt',  receiptFile.value)
      // TODO: POST /api/transactions (multipart/form-data)
      await $axios.post('/transactions', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
    } else {
      // TODO: POST /api/transactions (JSON)
      await $axios.post('/transactions', {
        type:     formData.type,
        name:     formData.name.trim(),
        amount:   Number(formData.amount),
        category: formData.category,
        date:     formData.date,
        note:     formData.note.trim() || null,
        tags:     formData.tags,
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

// ── Cleanup ───────────────────────────────────────────────────────────────────

onUnmounted(() => {
  if (receiptPreviewUrl.value) URL.revokeObjectURL(receiptPreviewUrl.value)
})
</script>
