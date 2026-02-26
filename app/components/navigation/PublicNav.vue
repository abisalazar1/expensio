<template>
  <header class="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
    <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">

      <!-- Logo -->
      <NuxtLink to="/" class="flex items-center gap-2 group flex-shrink-0">
        <div class="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center shadow-sm group-hover:bg-emerald-600 transition-colors">
          <UIcon name="i-heroicons-banknotes" class="text-white text-lg" />
        </div>
        <span class="text-xl font-bold text-slate-900 tracking-tight">Expensio</span>
      </NuxtLink>

      <!-- Desktop nav links -->
      <div class="hidden md:flex items-center gap-1">
        <NuxtLink
          v-for="link in navLinks"
          :key="link.to"
          :to="link.to"
          class="px-3 py-2 rounded-md text-sm font-medium text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 transition-all"
          active-class="text-emerald-600 bg-emerald-50"
        >
          {{ link.label }}
        </NuxtLink>
      </div>

      <!-- Desktop auth actions -->
      <div class="hidden md:flex items-center gap-3">
        <UButton to="/auth/login" variant="ghost" color="neutral" size="sm">
          Sign In
        </UButton>
        <UButton to="/auth/register" color="primary" size="sm">
          Get Started
        </UButton>
      </div>

      <!-- Mobile hamburger -->
      <button
        class="md:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
        aria-label="Toggle menu"
        @click="mobileOpen = !mobileOpen"
      >
        <UIcon :name="mobileOpen ? 'i-heroicons-x-mark' : 'i-heroicons-bars-3'" class="text-xl" />
      </button>
    </nav>

    <!-- Mobile menu -->
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 -translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <div
        v-if="mobileOpen"
        class="md:hidden border-t border-slate-200 bg-white/95 backdrop-blur-md px-4 py-4 space-y-1"
      >
        <NuxtLink
          v-for="link in navLinks"
          :key="link.to"
          :to="link.to"
          class="flex items-center px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:text-emerald-600 hover:bg-emerald-50 transition-all"
          active-class="text-emerald-600 bg-emerald-50"
          @click="mobileOpen = false"
        >
          {{ link.label }}
        </NuxtLink>
        <div class="border-t border-slate-200 pt-4 mt-2 flex flex-col gap-2">
          <UButton
            to="/auth/login"
            variant="ghost"
            color="neutral"
            size="sm"
            block
            @click="mobileOpen = false"
          >
            Sign In
          </UButton>
          <UButton
            to="/auth/register"
            color="primary"
            size="sm"
            block
            @click="mobileOpen = false"
          >
            Get Started
          </UButton>
        </div>
      </div>
    </Transition>
  </header>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const mobileOpen = ref(false)

const navLinks = [
  { label: 'Features', to: '/#features' },
  { label: 'How it Works', to: '/#how-it-works' },
  { label: 'Testimonials', to: '/#testimonials' },
]
</script>
