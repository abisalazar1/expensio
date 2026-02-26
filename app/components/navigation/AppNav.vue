<template>
  <header class="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
    <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center gap-4">

      <!-- Logo -->
      <NuxtLink to="/dashboard" class="flex items-center gap-2 group flex-shrink-0">
        <div class="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center shadow-sm group-hover:bg-emerald-600 transition-colors">
          <UIcon name="i-heroicons-banknotes" class="text-white text-lg" />
        </div>
        <span class="text-xl font-bold text-slate-900 tracking-tight">Expensio</span>
      </NuxtLink>

      <!-- Desktop app links -->
      <div class="hidden md:flex items-center gap-1 flex-1">
        <NuxtLink
          v-for="link in appLinks"
          :key="link.to"
          :to="link.to"
          class="flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 transition-all"
          active-class="text-emerald-600 bg-emerald-50 font-semibold"
        >
          <UIcon :name="link.icon" class="text-base" />
          {{ link.label }}
        </NuxtLink>
      </div>

      <!-- Right side actions -->
      <div class="flex items-center gap-1 ml-auto">

        <!-- Notifications bell -->
        <button
          class="relative p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          aria-label="Notifications"
        >
          <UIcon name="i-heroicons-bell" class="text-xl" />
          <!-- Unread indicator -->
          <span class="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white" />
        </button>

        <!-- User menu -->
        <div class="relative" ref="userMenuRef">
          <button
            class="flex items-center gap-2 px-1.5 py-1 rounded-xl hover:bg-slate-100 transition-colors"
            aria-label="User menu"
            @click="userMenuOpen = !userMenuOpen"
          >
            <!-- Avatar -->
            <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center flex-shrink-0 shadow-sm">
              <!-- TODO: replace initials with real user avatar -->
              <span class="text-white text-sm font-bold leading-none">A</span>
            </div>
            <!-- Name — hidden on very small screens -->
            <span class="hidden sm:block text-sm font-medium text-slate-700 max-w-[100px] truncate">
              <!-- TODO: pull from auth store -->
              Alex
            </span>
            <UIcon
              name="i-heroicons-chevron-down"
              class="text-slate-400 text-xs transition-transform duration-200"
              :class="{ 'rotate-180': userMenuOpen }"
            />
          </button>

          <!-- Dropdown -->
          <Transition
            enter-active-class="transition duration-150 ease-out"
            enter-from-class="opacity-0 scale-95 -translate-y-1"
            enter-to-class="opacity-100 scale-100 translate-y-0"
            leave-active-class="transition duration-100 ease-in"
            leave-from-class="opacity-100 scale-100 translate-y-0"
            leave-to-class="opacity-0 scale-95 -translate-y-1"
          >
            <div
              v-if="userMenuOpen"
              class="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl border border-slate-200 shadow-xl overflow-hidden"
            >
              <!-- User info -->
              <div class="px-4 py-3 bg-slate-50 border-b border-slate-100">
                <div class="flex items-center gap-3">
                  <div class="w-9 h-9 rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center flex-shrink-0">
                    <span class="text-white text-sm font-bold">A</span>
                  </div>
                  <div class="min-w-0">
                    <!-- TODO: pull from auth store -->
                    <p class="text-sm font-semibold text-slate-900 truncate">Alex</p>
                    <p class="text-xs text-slate-400 truncate">alex@example.com</p>
                  </div>
                </div>
              </div>

              <!-- Menu items -->
              <div class="py-1">
                <NuxtLink
                  v-for="item in userMenuItems"
                  :key="item.to"
                  :to="item.to"
                  class="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                  @click="userMenuOpen = false"
                >
                  <UIcon :name="item.icon" class="text-slate-400 text-base flex-shrink-0" />
                  {{ item.label }}
                </NuxtLink>
              </div>

              <!-- Sign out -->
              <div class="border-t border-slate-100 py-1">
                <button
                  class="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-rose-600 hover:bg-rose-50 transition-colors"
                  @click="handleSignOut"
                >
                  <UIcon name="i-heroicons-arrow-right-on-rectangle" class="text-rose-400 text-base flex-shrink-0" />
                  Sign out
                </button>
              </div>
            </div>
          </Transition>
        </div>

        <!-- Mobile hamburger -->
        <button
          class="md:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          aria-label="Toggle menu"
          @click="mobileOpen = !mobileOpen"
        >
          <UIcon :name="mobileOpen ? 'i-heroicons-x-mark' : 'i-heroicons-bars-3'" class="text-xl" />
        </button>
      </div>
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
        class="md:hidden border-t border-slate-200 bg-white px-4 py-3"
      >
        <!-- App links -->
        <div class="space-y-1">
          <NuxtLink
            v-for="link in appLinks"
            :key="link.to"
            :to="link.to"
            class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:text-emerald-600 hover:bg-emerald-50 transition-all"
            active-class="text-emerald-600 bg-emerald-50 font-semibold"
            @click="mobileOpen = false"
          >
            <UIcon :name="link.icon" class="text-base" />
            {{ link.label }}
          </NuxtLink>
        </div>

        <!-- User section -->
        <div class="border-t border-slate-200 mt-3 pt-3">
          <!-- User info row -->
          <div class="flex items-center gap-3 px-3 py-2 mb-2">
            <div class="w-9 h-9 rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center flex-shrink-0">
              <span class="text-white text-sm font-bold">A</span>
            </div>
            <div>
              <p class="text-sm font-semibold text-slate-800">Alex</p>
              <p class="text-xs text-slate-400">alex@example.com</p>
            </div>
          </div>

          <!-- User menu items -->
          <NuxtLink
            v-for="item in userMenuItems"
            :key="item.to"
            :to="item.to"
            class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-700 hover:bg-slate-50 transition-colors"
            @click="mobileOpen = false"
          >
            <UIcon :name="item.icon" class="text-slate-400 text-base" />
            {{ item.label }}
          </NuxtLink>

          <!-- Sign out -->
          <button
            class="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-rose-600 hover:bg-rose-50 transition-colors mt-1"
            @click="handleSignOut"
          >
            <UIcon name="i-heroicons-arrow-right-on-rectangle" class="text-rose-400 text-base" />
            Sign out
          </button>
        </div>
      </div>
    </Transition>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

// ── State ─────────────────────────────────────────────────────────────────────

const mobileOpen = ref(false)
const userMenuOpen = ref(false)
const userMenuRef = ref<HTMLElement | null>(null)

// ── Nav config ────────────────────────────────────────────────────────────────

const appLinks = [
  { label: 'Dashboard',     to: '/dashboard',               icon: 'i-heroicons-squares-2x2' },
  { label: 'Transactions',  to: '/transactions',            icon: 'i-heroicons-banknotes' },
  { label: 'Subscriptions', to: '/dashboard/subscriptions', icon: 'i-heroicons-arrow-path' },
  { label: 'Budgets',       to: '/budgets',                 icon: 'i-heroicons-chart-pie' },
  { label: 'Reports',       to: '/reports',                 icon: 'i-heroicons-chart-bar' },
]

const userMenuItems = [
  { label: 'Profile',  to: '/profile',  icon: 'i-heroicons-user-circle' },
  { label: 'Settings', to: '/settings', icon: 'i-heroicons-cog-6-tooth' },
]

// ── Actions ───────────────────────────────────────────────────────────────────

function handleSignOut() {
  userMenuOpen.value = false
  mobileOpen.value = false
  // TODO: clear auth_token cookie and redirect to login
  // const token = useCookie('auth_token')
  // token.value = null
  // navigateTo('/auth/login')
}

// ── Click-outside to close dropdown ──────────────────────────────────────────

function handleClickOutside(event: MouseEvent) {
  if (userMenuRef.value && !userMenuRef.value.contains(event.target as Node)) {
    userMenuOpen.value = false
  }
}

onMounted(() => document.addEventListener('mousedown', handleClickOutside))
onUnmounted(() => document.removeEventListener('mousedown', handleClickOutside))
</script>
