<template>
  <div
    class="stat-card group relative bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 overflow-hidden"
  >
    <!-- Subtle color wash in top-right corner -->
    <div
      class="absolute -top-6 -right-6 w-24 h-24 rounded-full opacity-10 blur-xl transition-opacity duration-300 group-hover:opacity-20"
      :class="colorConfig.wash"
      aria-hidden="true"
    />

    <!-- Top row: icon + change badge -->
    <div class="flex items-start justify-between mb-5 relative z-10">
      <!-- Icon square -->
      <div
        class="flex items-center justify-center w-11 h-11 rounded-xl shadow-sm flex-shrink-0"
        :class="colorConfig.iconBg"
      >
        <UIcon :name="icon" class="text-xl" :class="colorConfig.iconText" />
      </div>

      <!-- Trend badge -->
      <div
        class="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold"
        :class="trendConfig.badgeBg"
      >
        <UIcon :name="trendConfig.icon" class="text-xs" :class="trendConfig.iconColor" />
        <span :class="trendConfig.textColor">
          {{ change > 0 ? '+' : '' }}{{ change }}%
        </span>
      </div>
    </div>

    <!-- Value -->
    <div class="relative z-10 mb-1">
      <p class="text-3xl font-extrabold tracking-tight text-slate-900 leading-none">
        {{ value }}
      </p>
    </div>

    <!-- Title + change label -->
    <div class="relative z-10 flex items-baseline gap-2 mt-2">
      <p class="text-sm font-medium text-slate-500 leading-snug">{{ title }}</p>
    </div>
    <p class="relative z-10 text-xs text-slate-400 mt-1">{{ changeLabel }}</p>

    <!-- Bottom accent line -->
    <div
      class="absolute bottom-0 left-0 right-0 h-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      :class="colorConfig.accentLine"
      aria-hidden="true"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

// ── Props ─────────────────────────────────────────────────────────────────────

interface Props {
  title: string
  value: string
  change: number
  changeLabel: string
  icon: string
  color: 'emerald' | 'rose' | 'sky' | 'violet' | 'amber'
}

const props = defineProps<Props>()

// ── Color config map ──────────────────────────────────────────────────────────

type ColorConfig = {
  iconBg: string
  iconText: string
  wash: string
  accentLine: string
}

const colorMap: Record<Props['color'], ColorConfig> = {
  emerald: {
    iconBg: 'bg-emerald-50 border border-emerald-100',
    iconText: 'text-emerald-600',
    wash: 'bg-emerald-400',
    accentLine: 'bg-gradient-to-r from-emerald-400 to-emerald-300',
  },
  rose: {
    iconBg: 'bg-rose-50 border border-rose-100',
    iconText: 'text-rose-600',
    wash: 'bg-rose-400',
    accentLine: 'bg-gradient-to-r from-rose-400 to-rose-300',
  },
  sky: {
    iconBg: 'bg-sky-50 border border-sky-100',
    iconText: 'text-sky-600',
    wash: 'bg-sky-400',
    accentLine: 'bg-gradient-to-r from-sky-400 to-sky-300',
  },
  violet: {
    iconBg: 'bg-violet-50 border border-violet-100',
    iconText: 'text-violet-600',
    wash: 'bg-violet-400',
    accentLine: 'bg-gradient-to-r from-violet-400 to-violet-300',
  },
  amber: {
    iconBg: 'bg-amber-50 border border-amber-100',
    iconText: 'text-amber-600',
    wash: 'bg-amber-400',
    accentLine: 'bg-gradient-to-r from-amber-400 to-amber-300',
  },
}

const colorConfig = computed(() => colorMap[props.color])

// ── Trend config ──────────────────────────────────────────────────────────────

type TrendConfig = {
  icon: string
  iconColor: string
  textColor: string
  badgeBg: string
}

const trendConfig = computed((): TrendConfig => {
  if (props.change > 0) {
    return {
      icon: 'i-heroicons-arrow-trending-up',
      iconColor: 'text-emerald-600',
      textColor: 'text-emerald-700',
      badgeBg: 'bg-emerald-50 border border-emerald-100',
    }
  }
  if (props.change < 0) {
    return {
      icon: 'i-heroicons-arrow-trending-down',
      iconColor: 'text-rose-600',
      textColor: 'text-rose-700',
      badgeBg: 'bg-rose-50 border border-rose-100',
    }
  }
  return {
    icon: 'i-heroicons-minus',
    iconColor: 'text-slate-500',
    textColor: 'text-slate-600',
    badgeBg: 'bg-slate-50 border border-slate-200',
  }
})
</script>
