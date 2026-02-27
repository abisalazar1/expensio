<template>
  <div :style="{ height: `${height}px` }">
    <Line :data="chartData" :options="chartOptions" />
  </div>
</template>

<script setup>
import { Line } from 'vue-chartjs'
import { computed } from 'vue'

const props = defineProps({
  data: { type: Array, required: true }, // { label, value }[]
  height: { type: Number, default: 360 },
})

const chartData = computed(() => ({
  labels: props.data.map(d => d.label),
  datasets: [
    {
      label: 'Expenses',
      data: props.data.map(d => d.value),
      borderColor: '#fb7185',
      backgroundColor: 'rgba(251, 113, 133, 0.08)',
      fill: true,
      tension: 0.4,
      pointBackgroundColor: '#fb7185',
      pointBorderColor: '#ffffff',
      pointBorderWidth: 2,
      pointRadius: 5,
      pointHoverRadius: 7,
      pointHoverBackgroundColor: '#fb7185',
      pointHoverBorderColor: '#ffffff',
      pointHoverBorderWidth: 2,
    },
  ],
}))

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top',
      align: 'start',
      labels: {
        usePointStyle: true,
        pointStyle: 'circle',
        padding: 20,
        font: { size: 12 },
        color: '#64748b',
      },
    },
    tooltip: {
      backgroundColor: '#0f172a',
      titleColor: '#e2e8f0',
      bodyColor: '#94a3b8',
      padding: 12,
      borderColor: '#1e293b',
      borderWidth: 1,
      cornerRadius: 10,
      callbacks: {
        label: ctx => ` ${fmtCurrency(ctx.parsed.y)}`,
      },
    },
  },
  scales: {
    x: {
      grid: { display: false },
      border: { display: false },
      ticks: { color: '#94a3b8', font: { size: 11 } },
    },
    y: {
      grid: { color: '#f1f5f9' },
      border: { display: false, dash: [4, 4] },
      ticks: {
        color: '#94a3b8',
        font: { size: 11 },
        callback: val => val >= 1000 ? `$${(val / 1000).toFixed(0)}k` : `$${val}`,
      },
    },
  },
}

function fmtCurrency(v) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(v)
}
</script>
