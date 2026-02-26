<template>
  <div class="expense-chart relative select-none" :style="{ height: `${height}px` }">

    <!-- Legend -->
    <div class="flex items-center gap-5 mb-4">
      <div class="flex items-center gap-2">
        <span class="inline-block w-3 h-3 rounded-sm bg-emerald-500" />
        <span class="text-xs font-medium text-slate-500">Income</span>
      </div>
      <div class="flex items-center gap-2">
        <span class="inline-block w-3 h-3 rounded-sm bg-rose-400" />
        <span class="text-xs font-medium text-slate-500">Expenses</span>
      </div>
    </div>

    <!-- SVG chart area -->
    <svg
      ref="svgEl"
      class="w-full overflow-visible"
      :height="svgHeight"
      :viewBox="`0 0 ${svgWidth} ${svgHeight}`"
      preserveAspectRatio="none"
    >
      <!-- Y-axis grid lines + labels -->
      <g>
        <line
          v-for="tick in yTicks"
          :key="tick.value"
          :x1="yAxisWidth"
          :y1="tick.y"
          :x2="svgWidth"
          :y2="tick.y"
          stroke="#e2e8f0"
          stroke-width="1"
          stroke-dasharray="4 3"
        />
        <text
          v-for="tick in yTicks"
          :key="`label-${tick.value}`"
          :x="yAxisWidth - 6"
          :y="tick.y + 4"
          text-anchor="end"
          class="chart-label"
          fill="#94a3b8"
          font-size="11"
        >
          {{ tick.label }}
        </text>
      </g>

      <!-- Bars for each data point -->
      <g v-for="(item, index) in data" :key="item.label">
        <!-- Income bar -->
        <rect
          :x="barGroupX(index)"
          :y="barY(item.income)"
          :width="barWidth"
          :height="barH(item.income)"
          rx="4"
          ry="4"
          class="income-bar"
          fill="#10b981"
        >
          <title>{{ item.label }} — Income: {{ formatCurrency(item.income) }}</title>
        </rect>

        <!-- Expenses bar -->
        <rect
          :x="barGroupX(index) + barWidth + barGap"
          :y="barY(item.expenses)"
          :width="barWidth"
          :height="barH(item.expenses)"
          rx="4"
          ry="4"
          class="expense-bar"
          fill="#fb7185"
        >
          <title>{{ item.label }} — Expenses: {{ formatCurrency(item.expenses) }}</title>
        </rect>

        <!-- X-axis label -->
        <text
          :x="barGroupX(index) + barWidth + barGap / 2"
          :y="svgHeight - 2"
          text-anchor="middle"
          fill="#94a3b8"
          font-size="11"
        >
          {{ item.label }}
        </text>
      </g>

      <!-- X-axis baseline -->
      <line
        :x1="yAxisWidth"
        :y1="chartTop + chartAreaHeight"
        :x2="svgWidth"
        :y2="chartTop + chartAreaHeight"
        stroke="#e2e8f0"
        stroke-width="1"
      />
    </svg>

    <!-- Hover tooltip (absolute positioned) -->
    <div
      v-if="tooltip.visible"
      class="pointer-events-none absolute z-20 bg-slate-900 text-white text-xs rounded-xl px-3 py-2.5 shadow-xl border border-slate-700 min-w-[130px]"
      :style="{ left: `${tooltip.x}px`, top: `${tooltip.y}px`, transform: 'translate(-50%, -110%)' }"
    >
      <p class="font-semibold text-slate-200 mb-1.5">{{ tooltip.label }}</p>
      <div class="flex items-center gap-1.5 mb-1">
        <span class="w-2 h-2 rounded-sm bg-emerald-400 flex-shrink-0" />
        <span class="text-slate-400">Income</span>
        <span class="ml-auto font-semibold text-emerald-400">{{ formatCurrency(tooltip.income) }}</span>
      </div>
      <div class="flex items-center gap-1.5">
        <span class="w-2 h-2 rounded-sm bg-rose-400 flex-shrink-0" />
        <span class="text-slate-400">Expenses</span>
        <span class="ml-auto font-semibold text-rose-400">{{ formatCurrency(tooltip.expenses) }}</span>
      </div>
      <!-- Tooltip arrow -->
      <div class="absolute left-1/2 -translate-x-1/2 -bottom-1.5 w-3 h-3 bg-slate-900 border-r border-b border-slate-700 rotate-45" />
    </div>

    <!-- Invisible hit areas for hover -->
    <div class="absolute inset-0 pointer-events-none" style="top: 28px">
      <svg
        class="absolute inset-0 w-full pointer-events-auto"
        :height="svgHeight"
        :viewBox="`0 0 ${svgWidth} ${svgHeight}`"
        preserveAspectRatio="none"
        @mouseleave="tooltip.visible = false"
      >
        <rect
          v-for="(item, index) in data"
          :key="`hit-${item.label}`"
          :x="barGroupX(index) - groupPadding / 2"
          :y="chartTop"
          :width="groupWidth + groupPadding"
          :height="chartAreaHeight"
          fill="transparent"
          class="cursor-pointer"
          @mousemove="showTooltip($event, item, index)"
        />
      </svg>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

// ── Types ─────────────────────────────────────────────────────────────────────

interface ChartDataPoint {
  label: string
  income: number
  expenses: number
}

interface Tooltip {
  visible: boolean
  x: number
  y: number
  label: string
  income: number
  expenses: number
}

// ── Props ─────────────────────────────────────────────────────────────────────

interface Props {
  data: ChartDataPoint[]
  height?: number
}

const props = withDefaults(defineProps<Props>(), {
  height: 300,
})

// ── SVG layout constants ──────────────────────────────────────────────────────

const svgWidth = 600        // viewBox width — scales with CSS
const yAxisWidth = 46       // space reserved for Y-axis labels on the left
const chartTop = 8          // top padding inside chart area
const xAxisHeight = 20      // space reserved for X-axis labels at the bottom
const svgHeight = computed(() => props.height - 28) // subtract legend height (~28px)
const chartAreaHeight = computed(() => svgHeight.value - chartTop - xAxisHeight)

const groupPadding = 12     // horizontal padding between bar groups
const barGap = 3            // gap between income and expense bars within a group

// ── Bar geometry ──────────────────────────────────────────────────────────────

const groupWidth = computed(() => {
  const availableWidth = svgWidth - yAxisWidth
  return (availableWidth / props.data.length) - groupPadding
})

// Each bar takes roughly half the group width (minus the inner gap)
const barWidth = computed(() => (groupWidth.value - barGap) / 2)

// X position for the start of a bar group
function barGroupX(index: number): number {
  const slotWidth = (svgWidth - yAxisWidth) / props.data.length
  return yAxisWidth + index * slotWidth + groupPadding / 2
}

// ── Y scale ───────────────────────────────────────────────────────────────────

const maxValue = computed(() => {
  const allValues = props.data.flatMap(d => [d.income, d.expenses])
  return Math.max(...allValues, 0)
})

// Round max up to a clean number for y-axis ticks
const yMax = computed(() => {
  const raw = maxValue.value
  if (raw === 0) return 1000
  const magnitude = Math.pow(10, Math.floor(Math.log10(raw)))
  return Math.ceil(raw / magnitude) * magnitude
})

// Convert a data value → SVG y coordinate (0 is top)
function barY(value: number): number {
  const ratio = value / yMax.value
  return chartTop + chartAreaHeight.value * (1 - ratio)
}

// Bar height in SVG units
function barH(value: number): number {
  return chartAreaHeight.value * (value / yMax.value)
}

// ── Y-axis ticks ──────────────────────────────────────────────────────────────

const yTicks = computed(() => {
  const tickCount = 4
  return Array.from({ length: tickCount + 1 }, (_, i) => {
    const value = (yMax.value / tickCount) * i
    const y = barY(value)
    return {
      value,
      y,
      label: value >= 1000 ? `$${(value / 1000).toFixed(value % 1000 === 0 ? 0 : 1)}k` : `$${value}`,
    }
  })
})

// ── Tooltip ───────────────────────────────────────────────────────────────────

const svgEl = ref<SVGSVGElement | null>(null)

const tooltip = ref<Tooltip>({
  visible: false,
  x: 0,
  y: 0,
  label: '',
  income: 0,
  expenses: 0,
})

function showTooltip(event: MouseEvent, item: ChartDataPoint, index: number): void {
  const target = event.currentTarget as SVGElement
  const rect = target.closest('svg')?.getBoundingClientRect()
  const container = target.closest('.expense-chart')?.getBoundingClientRect()
  if (!rect || !container) return

  // Centre tooltip over the bar group
  const slotWidth = (svgWidth - yAxisWidth) / props.data.length
  const groupCentreRatio = (yAxisWidth + index * slotWidth + slotWidth / 2) / svgWidth
  const svgRenderedWidth = rect.width
  const tooltipX = rect.left - container.left + groupCentreRatio * svgRenderedWidth

  // Position tooltip near top of the chart
  const tooltipY = rect.top - container.top + chartTop + 12

  tooltip.value = {
    visible: true,
    x: tooltipX,
    y: tooltipY,
    label: item.label,
    income: item.income,
    expenses: item.expenses,
  }
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value)
}
</script>

<style scoped>
.income-bar {
  transition: opacity 0.15s;
}

.income-bar:hover {
  opacity: 0.8;
}

.expense-bar {
  transition: opacity 0.15s;
}

.expense-bar:hover {
  opacity: 0.8;
}
</style>
