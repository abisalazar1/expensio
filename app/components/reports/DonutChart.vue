<template>
  <div class="flex flex-col sm:flex-row items-center gap-8 sm:gap-12 select-none">

    <!-- Canvas + center text overlay -->
    <div class="relative shrink-0" :style="{ width: `${size}px`, height: `${size}px` }">
      <Doughnut ref="chartRef" :data="chartData" :options="chartOptions" />

      <!-- Center label (reacts to hover) -->
      <div class="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center px-4">
        <p class="text-[10px] font-semibold text-slate-400 uppercase tracking-wide leading-none mb-1.5 truncate max-w-full">
          {{ activeIdx !== null ? props.data[activeIdx].label : 'Total' }}
        </p>
        <p class="text-xl font-extrabold text-slate-800 tabular-nums leading-none">
          {{ fmt(activeIdx !== null ? props.data[activeIdx].value : total) }}
        </p>
        <p v-if="activeIdx !== null" class="text-xs text-slate-400 mt-1.5">
          {{ pcts[activeIdx] }}% of total
        </p>
      </div>
    </div>

    <!-- Custom HTML legend -->
    <div class="flex-1 w-full min-w-0 space-y-2.5">
      <div
        v-for="(item, i) in props.data"
        :key="item.label"
        class="flex items-center gap-3 cursor-default transition-opacity duration-150"
        :class="{ 'opacity-30': activeIdx !== null && activeIdx !== i }"
        @mouseenter="setActive(i)"
        @mouseleave="setActive(null)"
      >
        <span class="w-3 h-3 rounded-sm shrink-0" :style="{ background: item.color }" />
        <span class="text-sm text-slate-600 flex-1 truncate">{{ item.label }}</span>
        <span class="text-sm font-bold text-slate-800 tabular-nums">{{ fmt(item.value) }}</span>
        <span class="text-xs text-slate-400 w-9 text-right tabular-nums shrink-0">{{ pcts[i] }}%</span>
      </div>

      <p v-if="!props.data.length" class="text-sm text-slate-400 italic">
        No expense data for this selection.
      </p>
    </div>

  </div>
</template>

<script setup>
import { Doughnut } from 'vue-chartjs'
import { ref, computed } from 'vue'

const props = defineProps({
  data: { type: Array, required: true }, // { label, value, color }[]
  size: { type: Number, default: 220 },
})

// ── Hover state ───────────────────────────────────────────────────────────────

const chartRef = ref(null)
const activeIdx = ref(null)

function setActive(i) {
  activeIdx.value = i
}

// ── Derived ───────────────────────────────────────────────────────────────────

const total = computed(() => props.data.reduce((s, d) => s + d.value, 0))

const pcts = computed(() =>
  props.data.map(d => total.value > 0 ? Math.round((d.value / total.value) * 100) : 0)
)

// ── Chart data + options ──────────────────────────────────────────────────────

const chartData = computed(() => ({
  labels: props.data.map(d => d.label),
  datasets: [
    {
      data: props.data.map(d => d.value),
      backgroundColor: props.data.map(d => d.color),
      hoverBackgroundColor: props.data.map(d => d.color),
      borderWidth: 2,
      borderColor: '#ffffff',
      hoverBorderColor: '#ffffff',
      hoverOffset: 6,
    },
  ],
}))

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  cutout: '65%',
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: '#0f172a',
      titleColor: '#e2e8f0',
      bodyColor: '#94a3b8',
      padding: 12,
      borderColor: '#1e293b',
      borderWidth: 1,
      cornerRadius: 10,
      callbacks: {
        label: ctx => ` ${fmt(ctx.parsed)} — ${pcts.value[ctx.dataIndex]}%`,
      },
    },
  },
  onHover: (_, activeElements) => {
    activeIdx.value = activeElements.length > 0 ? activeElements[0].index : null
  },
}))

// ── Formatter ─────────────────────────────────────────────────────────────────

function fmt(v) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency', currency: 'USD', maximumFractionDigits: 0,
  }).format(v)
}
</script>
