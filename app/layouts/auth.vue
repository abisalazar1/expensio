<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-slate-100 flex flex-col">
    <!-- Minimal top bar with logo -->
    <header class="px-6 py-5">
      <NuxtLink to="/" class="inline-flex items-center gap-2 group">
        <div class="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center shadow-sm group-hover:bg-emerald-600 transition-colors">
          <UIcon name="i-heroicons-banknotes" class="text-white text-lg" />
        </div>
        <span class="text-lg font-bold text-slate-900 tracking-tight">Expensio</span>
      </NuxtLink>
    </header>

    <!-- Centered content area -->
    <main class="flex-1 flex items-center justify-center px-4 py-12">
      <slot />
    </main>

    <!-- Minimal footer -->
    <footer class="px-6 py-4 text-center">
      <p class="text-xs text-slate-400">
        &copy; {{ currentYear }} Expensio. All rights reserved.
      </p>
    </footer>
  </div>
</template>

<script setup>
const currentYear = useState('currentYear', () => new Date().getFullYear())
</script>
