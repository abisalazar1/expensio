<template>
  <div class="landing-root">

    <!-- ─────────────────────────────────────────────────────────────────────
         HERO — full-viewport dark section
    ──────────────────────────────────────────────────────────────────────── -->
    <section class="hero-section relative overflow-hidden bg-slate-950 text-white min-h-screen flex flex-col justify-center">

      <!-- Animated background orbs -->
      <div class="orb-container pointer-events-none" aria-hidden="true">
        <div class="orb orb-1" />
        <div class="orb orb-2" />
        <div class="orb orb-3" />
        <div class="orb orb-4" />
        <!-- Fine grid overlay -->
        <div class="grid-overlay" />
      </div>

      <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28 lg:py-36 w-full">
        <div class="grid lg:grid-cols-2 gap-16 items-center">

          <!-- Left: copy -->
          <div class="hero-copy">
            <!-- Eyebrow badge -->
            <div class="hero-badge-wrap mb-7">
              <div class="hero-badge inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-sm font-medium">
                <span class="relative flex h-2 w-2">
                  <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                Now in public beta — free forever for individuals
              </div>
            </div>

            <!-- Headline -->
            <h1 class="hero-headline text-5xl sm:text-6xl lg:text-[4.5rem] font-extrabold tracking-tight leading-[1.08] mb-6">
              Your money,<br />
              <span class="gradient-text">finally clear.</span>
            </h1>

            <!-- Subheadline -->
            <p class="hero-sub text-lg sm:text-xl text-slate-400 leading-relaxed mb-10 max-w-lg">
              Expensio turns the chaos of daily spending into a clear picture of your financial life —
              income, expenses, budgets, and trends in one place.
            </p>

            <!-- CTAs -->
            <div class="hero-ctas flex flex-col sm:flex-row gap-4 mb-10">
              <UButton
                to="/auth/register"
                color="primary"
                size="xl"
                class="cta-primary group relative overflow-hidden px-8 font-semibold shadow-lg shadow-emerald-500/20"
              >
                <UIcon name="i-heroicons-rocket-launch" class="mr-2 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                Start for free
                <span class="cta-shine" />
              </UButton>
              <UButton
                to="/auth/login"
                variant="ghost"
                color="neutral"
                size="xl"
                class="px-8 text-slate-300 hover:text-white hover:bg-white/5 border border-slate-700 hover:border-slate-500 transition-all"
              >
                Sign in
                <UIcon name="i-heroicons-arrow-right" class="ml-2" />
              </UButton>
            </div>

            <!-- Trust line -->
            <p class="text-sm text-slate-500">
              No credit card required &middot; 2-minute setup &middot; Cancel anytime
            </p>
          </div>

          <!-- Right: dashboard mockup widget -->
          <div class="hero-widget-wrap flex justify-center lg:justify-end">
            <div class="dashboard-widget">
              <!-- Widget header -->
              <div class="widget-header flex items-center justify-between mb-5">
                <div class="flex items-center gap-2.5">
                  <div class="w-7 h-7 rounded-md bg-emerald-500/20 flex items-center justify-center">
                    <UIcon name="i-heroicons-chart-bar-square" class="text-emerald-400 text-sm" />
                  </div>
                  <span class="text-slate-200 font-semibold text-sm">Monthly Overview</span>
                </div>
                <span class="text-slate-500 text-xs font-medium">Feb 2026</span>
              </div>

              <!-- Key metrics row -->
              <div class="grid grid-cols-3 gap-3 mb-5">
                <div class="metric-card bg-slate-800/60 rounded-xl p-3.5 border border-slate-700/50">
                  <p class="text-slate-500 text-xs mb-1.5">Income</p>
                  <p class="text-emerald-400 font-bold text-xl leading-none">$4,280</p>
                  <div class="flex items-center gap-1 mt-1.5">
                    <UIcon name="i-heroicons-arrow-trending-up" class="text-emerald-500 text-xs" />
                    <span class="text-emerald-500 text-xs font-medium">+12%</span>
                  </div>
                </div>
                <div class="metric-card bg-slate-800/60 rounded-xl p-3.5 border border-slate-700/50">
                  <p class="text-slate-500 text-xs mb-1.5">Expenses</p>
                  <p class="text-rose-400 font-bold text-xl leading-none">$2,150</p>
                  <div class="flex items-center gap-1 mt-1.5">
                    <UIcon name="i-heroicons-arrow-trending-down" class="text-rose-500 text-xs" />
                    <span class="text-rose-500 text-xs font-medium">-5%</span>
                  </div>
                </div>
                <div class="metric-card bg-slate-800/60 rounded-xl p-3.5 border border-slate-700/50">
                  <p class="text-slate-500 text-xs mb-1.5">Saved</p>
                  <p class="text-sky-400 font-bold text-xl leading-none">$2,130</p>
                  <div class="flex items-center gap-1 mt-1.5">
                    <UIcon name="i-heroicons-arrow-trending-up" class="text-sky-500 text-xs" />
                    <span class="text-sky-500 text-xs font-medium">+8%</span>
                  </div>
                </div>
              </div>

              <!-- Budget progress -->
              <div class="mb-5 bg-slate-800/40 rounded-xl p-4 border border-slate-700/50">
                <div class="flex items-center justify-between mb-2.5">
                  <span class="text-slate-400 text-xs font-medium">Monthly budget</span>
                  <span class="text-slate-300 text-xs font-semibold">68% used</span>
                </div>
                <div class="h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div class="budget-bar h-full rounded-full bg-gradient-to-r from-emerald-500 to-sky-500" style="width: 68%" />
                </div>
                <p class="text-slate-500 text-xs mt-2">$2,150 spent of $3,200 budget</p>
              </div>

              <!-- Top categories -->
              <div class="mb-1">
                <p class="text-slate-500 text-xs font-medium uppercase tracking-wider mb-3">Top categories</p>
                <div class="space-y-2.5">
                  <div
                    v-for="cat in widgetCategories"
                    :key="cat.name"
                    class="flex items-center gap-3"
                  >
                    <div class="w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0" :class="cat.iconBg">
                      <UIcon :name="cat.icon" class="text-xs" :class="cat.iconColor" />
                    </div>
                    <div class="flex-1 min-w-0">
                      <div class="flex items-center justify-between mb-1">
                        <span class="text-slate-300 text-xs font-medium">{{ cat.name }}</span>
                        <span class="text-slate-400 text-xs">{{ cat.amount }}</span>
                      </div>
                      <div class="h-1 bg-slate-700 rounded-full overflow-hidden">
                        <div class="h-full rounded-full transition-all" :class="cat.barColor" :style="{ width: cat.pct }" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Recent transactions snippet -->
              <div class="mt-5 pt-4 border-t border-slate-700/50">
                <p class="text-slate-500 text-xs font-medium uppercase tracking-wider mb-3">Recent</p>
                <div class="space-y-2">
                  <div
                    v-for="tx in widgetTransactions"
                    :key="tx.label"
                    class="flex items-center justify-between"
                  >
                    <div class="flex items-center gap-2.5">
                      <div class="w-6 h-6 rounded-md flex items-center justify-center" :class="tx.iconBg">
                        <UIcon :name="tx.icon" class="text-xs" :class="tx.iconColor" />
                      </div>
                      <span class="text-slate-400 text-xs">{{ tx.label }}</span>
                    </div>
                    <span class="text-xs font-semibold" :class="tx.amountColor">{{ tx.amount }}</span>
                  </div>
                </div>
              </div>

              <!-- Widget footer glow line -->
              <div class="widget-glow-line mt-5 h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />
            </div>
          </div>
        </div>

        <!-- Stats strip -->
        <div class="stats-strip mt-20 grid grid-cols-2 sm:grid-cols-4 gap-px bg-slate-800/50 rounded-2xl overflow-hidden border border-slate-800">
          <div
            v-for="stat in heroStats"
            :key="stat.label"
            class="stat-item bg-slate-900/80 px-6 py-5 flex flex-col items-center text-center"
          >
            <div class="text-2xl font-extrabold text-white mb-0.5">{{ stat.value }}</div>
            <div class="text-xs text-slate-500 font-medium">{{ stat.label }}</div>
          </div>
        </div>
      </div>

      <!-- Bottom fade into next section -->
      <div class="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-b from-transparent to-white pointer-events-none z-10" />
    </section>


    <!-- ─────────────────────────────────────────────────────────────────────
         FEATURES — bento grid layout
    ──────────────────────────────────────────────────────────────────────── -->
    <section id="features" class="features-section py-28 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <!-- Section label -->
        <div class="text-center mb-16">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-semibold uppercase tracking-widest mb-5">
            <UIcon name="i-heroicons-cube-transparent" class="text-xs" />
            Features
          </div>
          <h2 class="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mb-5">
            Built for people who care<br class="hidden sm:block" />
            <span class="gradient-text-light"> about their money</span>
          </h2>
          <p class="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
            Every tool you need to go from "where does it all go?" to "I know exactly where I stand."
          </p>
        </div>

        <!-- Bento grid -->
        <div class="bento-grid" ref="bentoRef">
          <!-- Feature 1 — large, spans 2 cols on desktop -->
          <div
            v-for="(feature, index) in bentoFeatures"
            :key="feature.title"
            class="bento-card"
            :class="[feature.span, { 'visible': featuresVisible }]"
            :style="{ animationDelay: `${index * 100}ms` }"
          >
            <div
              class="bento-inner h-full p-7 rounded-2xl border flex flex-col"
              :class="feature.bg"
            >
              <!-- Icon area -->
              <div class="mb-5">
                <div class="inline-flex w-12 h-12 rounded-xl items-center justify-center mb-1" :class="feature.iconBg">
                  <UIcon :name="feature.icon" class="text-xl" :class="feature.iconColor" />
                </div>
              </div>

              <!-- Badge + title -->
              <div class="mb-3">
                <UBadge :color="feature.badgeColor" variant="subtle" size="xs" class="mb-2">
                  {{ feature.badge }}
                </UBadge>
                <h3 class="font-bold text-slate-900 text-xl leading-snug">{{ feature.title }}</h3>
              </div>

              <p class="text-slate-500 text-sm leading-relaxed flex-1">{{ feature.description }}</p>

              <!-- Bottom decoration for large cards -->
              <div v-if="feature.span.includes('bento-wide')" class="mt-6">
                <div class="h-px bg-gradient-to-r from-slate-100 to-transparent mb-4" />
                <div class="flex items-center gap-2 flex-wrap">
                  <span
                    v-for="tag in feature.tags"
                    :key="tag"
                    class="px-2.5 py-1 rounded-md bg-slate-100 text-slate-500 text-xs font-medium"
                  >
                    {{ tag }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>


    <!-- ─────────────────────────────────────────────────────────────────────
         HOW IT WORKS — numbered steps
    ──────────────────────────────────────────────────────────────────────── -->
    <section class="steps-section py-28 bg-slate-50 overflow-hidden" ref="stepsRef">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div class="text-center mb-16">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-100 text-sky-700 text-xs font-semibold uppercase tracking-widest mb-5">
            <UIcon name="i-heroicons-bolt" class="text-xs" />
            Quick start
          </div>
          <h2 class="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mb-5">
            Up and running<br class="hidden sm:block" /> in 2 minutes
          </h2>
          <p class="text-lg text-slate-500 max-w-xl mx-auto">
            No import required. No bank connection needed. Just start tracking.
          </p>
        </div>

        <div class="steps-grid grid grid-cols-1 md:grid-cols-3 gap-6">
          <div
            v-for="(step, i) in steps"
            :key="step.title"
            class="step-card"
            :class="{ 'visible': stepsVisible }"
            :style="{ animationDelay: `${i * 150}ms` }"
          >
            <div class="bg-white rounded-2xl p-7 border border-slate-200 hover:border-emerald-200 hover:shadow-lg hover:shadow-emerald-50 transition-all duration-300 h-full group">
              <!-- Step number -->
              <div class="step-number-wrap mb-5">
                <div class="inline-flex items-center justify-center w-10 h-10 rounded-full bg-slate-900 text-white font-bold text-sm group-hover:bg-emerald-500 transition-colors duration-300">
                  {{ String(i + 1).padStart(2, '0') }}
                </div>
              </div>
              <!-- Icon -->
              <div class="w-10 h-10 rounded-xl flex items-center justify-center mb-4" :class="step.iconBg">
                <UIcon :name="step.icon" class="text-lg" :class="step.iconColor" />
              </div>
              <h3 class="font-bold text-slate-900 text-lg mb-2">{{ step.title }}</h3>
              <p class="text-slate-500 text-sm leading-relaxed">{{ step.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>


    <!-- ─────────────────────────────────────────────────────────────────────
         TESTIMONIALS — social proof
    ──────────────────────────────────────────────────────────────────────── -->
    <section class="testimonials-section py-28 bg-white overflow-hidden" ref="testimonialsRef">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div class="text-center mb-16">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-50 border border-violet-100 text-violet-700 text-xs font-semibold uppercase tracking-widest mb-5">
            <UIcon name="i-heroicons-star" class="text-xs" />
            Testimonials
          </div>
          <h2 class="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mb-5">
            People love Expensio
          </h2>
          <p class="text-lg text-slate-500 max-w-xl mx-auto">
            Over 10,000 people use it every day to stay on top of their finances.
          </p>
        </div>

        <!-- Stars row -->
        <div class="flex justify-center gap-1 mb-12">
          <UIcon v-for="n in 5" :key="n" name="i-heroicons-star-solid" class="text-amber-400 text-xl" />
          <span class="ml-2 text-slate-500 text-sm self-center">4.9 out of 5 from 2,400+ ratings</span>
        </div>

        <div class="testimonial-grid grid grid-cols-1 md:grid-cols-3 gap-6">
          <div
            v-for="(t, i) in testimonials"
            :key="t.name"
            class="testimonial-card"
            :class="{ 'visible': testimonialsVisible }"
            :style="{ animationDelay: `${i * 120}ms` }"
          >
            <div class="bg-slate-50 rounded-2xl p-7 border border-slate-100 hover:border-slate-200 hover:shadow-md transition-all duration-300 h-full flex flex-col">
              <!-- Stars -->
              <div class="flex gap-0.5 mb-5">
                <UIcon v-for="n in 5" :key="n" name="i-heroicons-star-solid" class="text-amber-400 text-sm" />
              </div>

              <!-- Quote -->
              <blockquote class="text-slate-700 text-sm leading-relaxed flex-1 mb-6">
                "{{ t.quote }}"
              </blockquote>

              <!-- Author -->
              <div class="flex items-center gap-3 pt-4 border-t border-slate-200">
                <div class="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm text-white flex-shrink-0" :class="t.avatarBg">
                  {{ t.initials }}
                </div>
                <div>
                  <p class="font-semibold text-slate-900 text-sm">{{ t.name }}</p>
                  <p class="text-slate-400 text-xs">{{ t.role }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>


    <!-- ─────────────────────────────────────────────────────────────────────
         CTA BANNER — dark with emerald glow
    ──────────────────────────────────────────────────────────────────────── -->
    <section class="cta-section relative py-28 bg-slate-950 overflow-hidden" ref="ctaRef">
      <!-- Glow orbs -->
      <div class="cta-orb cta-orb-left" aria-hidden="true" />
      <div class="cta-orb cta-orb-right" aria-hidden="true" />
      <!-- Grid overlay -->
      <div class="grid-overlay" aria-hidden="true" />

      <div class="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div class="cta-content" :class="{ 'visible': ctaVisible }">
          <!-- Badge -->
          <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-sm font-medium mb-8">
            <UIcon name="i-heroicons-sparkles" class="text-xs" />
            Free for individuals. Always.
          </div>

          <h2 class="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight mb-6 leading-tight">
            Take control of your<br />
            <span class="gradient-text">financial future</span>
          </h2>
          <p class="text-xl text-slate-400 mb-10 max-w-xl mx-auto leading-relaxed">
            Join 10,000+ people who replaced financial anxiety with financial clarity.
            It takes two minutes to start.
          </p>

          <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
            <UButton
              to="/auth/register"
              color="primary"
              size="xl"
              class="group px-10 font-semibold shadow-xl shadow-emerald-500/20 relative overflow-hidden"
            >
              <UIcon name="i-heroicons-rocket-launch" class="mr-2 transition-transform group-hover:-translate-y-0.5" />
              Create free account
              <span class="cta-shine" />
            </UButton>
            <UButton
              to="/auth/login"
              variant="ghost"
              color="neutral"
              size="xl"
              class="px-8 text-slate-300 hover:text-white border border-slate-700 hover:border-slate-500 hover:bg-white/5"
            >
              Sign in instead
            </UButton>
          </div>

          <p class="mt-8 text-slate-600 text-sm">
            No credit card &middot; No data sharing &middot; No nonsense
          </p>
        </div>
      </div>
    </section>


    <!-- ─────────────────────────────────────────────────────────────────────
         FOOTER (page-level — sits above layout footer, acts as the real footer)
         Note: default layout has a minimal footer; we override with a richer one
    ──────────────────────────────────────────────────────────────────────── -->
    <footer class="bg-slate-950 border-t border-slate-800/60 py-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col md:flex-row items-center justify-between gap-6">
          <!-- Brand -->
          <div class="flex items-center gap-2.5">
            <div class="w-7 h-7 bg-emerald-500 rounded-lg flex items-center justify-center">
              <UIcon name="i-heroicons-banknotes" class="text-white text-base" />
            </div>
            <span class="text-white font-bold text-lg tracking-tight">Expensio</span>
          </div>

          <!-- Links -->
          <div class="flex items-center gap-6 text-sm text-slate-500">
            <a href="#features" class="hover:text-slate-300 transition-colors">Features</a>
            <NuxtLink to="/auth/login" class="hover:text-slate-300 transition-colors">Sign In</NuxtLink>
            <NuxtLink to="/auth/register" class="hover:text-slate-300 transition-colors">Sign Up</NuxtLink>
          </div>

          <!-- Copyright -->
          <p class="text-xs text-slate-600">
            &copy; {{ new Date().getFullYear() }} Expensio. All rights reserved.
          </p>
        </div>
      </div>
    </footer>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

definePageMeta({ layout: 'default' })

useSeoMeta({
  title: 'Expensio — Smart Personal Finance Tracker',
  description:
    'Track every dollar. Understand every trend. Expensio is the personal finance tracker that finally makes your money make sense.',
})

// ── Data ─────────────────────────────────────────────────────────────────────

const heroStats = [
  { value: '10K+', label: 'Active users' },
  { value: '$2M+', label: 'Tracked monthly' },
  { value: '99.9%', label: 'Uptime SLA' },
  { value: '4.9 ★', label: 'Average rating' },
]

interface WidgetCategory {
  name: string
  amount: string
  pct: string
  icon: string
  iconBg: string
  iconColor: string
  barColor: string
}

const widgetCategories: WidgetCategory[] = [
  {
    name: 'Food & Dining',
    amount: '$420',
    pct: '62%',
    icon: 'i-heroicons-cake',
    iconBg: 'bg-rose-500/15',
    iconColor: 'text-rose-400',
    barColor: 'bg-rose-500',
  },
  {
    name: 'Transport',
    amount: '$180',
    pct: '27%',
    icon: 'i-heroicons-truck',
    iconBg: 'bg-amber-500/15',
    iconColor: 'text-amber-400',
    barColor: 'bg-amber-500',
  },
  {
    name: 'Salary',
    amount: '$3,200',
    pct: '85%',
    icon: 'i-heroicons-banknotes',
    iconBg: 'bg-emerald-500/15',
    iconColor: 'text-emerald-400',
    barColor: 'bg-emerald-500',
  },
]

interface WidgetTransaction {
  label: string
  amount: string
  icon: string
  iconBg: string
  iconColor: string
  amountColor: string
}

const widgetTransactions: WidgetTransaction[] = [
  {
    label: 'Whole Foods Market',
    amount: '-$64.20',
    icon: 'i-heroicons-shopping-bag',
    iconBg: 'bg-rose-500/15',
    iconColor: 'text-rose-400',
    amountColor: 'text-rose-400',
  },
  {
    label: 'Freelance payment',
    amount: '+$1,080',
    icon: 'i-heroicons-arrow-down-tray',
    iconBg: 'bg-emerald-500/15',
    iconColor: 'text-emerald-400',
    amountColor: 'text-emerald-400',
  },
  {
    label: 'Spotify Premium',
    amount: '-$10.99',
    icon: 'i-heroicons-musical-note',
    iconBg: 'bg-slate-600/40',
    iconColor: 'text-slate-400',
    amountColor: 'text-slate-400',
  },
]

interface BentoFeature {
  title: string
  description: string
  icon: string
  iconBg: string
  iconColor: string
  bg: string
  badge: string
  badgeColor: 'primary' | 'secondary' | 'warning' | 'error' | 'success' | 'neutral'
  span: string
  tags?: string[]
}

const bentoFeatures: BentoFeature[] = [
  {
    title: 'Expense Tracking',
    description:
      'Log transactions in seconds. Categorize automatically, tag with custom labels, and see where every dollar goes — broken down by day, week, or month.',
    icon: 'i-heroicons-credit-card',
    iconBg: 'bg-rose-50',
    iconColor: 'text-rose-500',
    bg: 'bg-gradient-to-br from-rose-50/80 to-white border-rose-100',
    badge: 'Core',
    badgeColor: 'error',
    span: 'bento-wide',
    tags: ['Daily logging', 'Auto-categorize', 'Custom tags', 'Receipt notes'],
  },
  {
    title: 'Income Analytics',
    description:
      'Visualize all income sources side by side. Spot seasonal patterns, track growth, and never lose sight of your earning potential.',
    icon: 'i-heroicons-chart-bar-square',
    iconBg: 'bg-emerald-50',
    iconColor: 'text-emerald-600',
    bg: 'bg-gradient-to-br from-emerald-50/60 to-white border-emerald-100',
    badge: 'Analytics',
    badgeColor: 'primary',
    span: 'bento-normal',
    tags: [],
  },
  {
    title: 'Smart Budgets',
    description:
      'Set monthly caps per category. Get real-time alerts before you overspend and track exactly how much runway you have left.',
    icon: 'i-heroicons-flag',
    iconBg: 'bg-amber-50',
    iconColor: 'text-amber-600',
    bg: 'bg-gradient-to-br from-amber-50/60 to-white border-amber-100',
    badge: 'Planning',
    badgeColor: 'warning',
    span: 'bento-normal',
    tags: [],
  },
  {
    title: 'Trend Reports',
    description:
      'Weekly and monthly summaries with actionable insights. Understand the patterns behind your spending before they become problems.',
    icon: 'i-heroicons-document-chart-bar',
    iconBg: 'bg-sky-50',
    iconColor: 'text-sky-600',
    bg: 'bg-gradient-to-br from-sky-50/60 to-white border-sky-100',
    badge: 'Reports',
    badgeColor: 'secondary',
    span: 'bento-wide',
    tags: ['Weekly digest', 'Monthly rollup', 'Category breakdown', 'Net worth view'],
  },
]

interface Step {
  title: string
  description: string
  icon: string
  iconBg: string
  iconColor: string
}

const steps: Step[] = [
  {
    title: 'Create your account',
    description:
      'Sign up in under 60 seconds. No credit card, no bank connection, no personal data required to get started.',
    icon: 'i-heroicons-user-plus',
    iconBg: 'bg-slate-100',
    iconColor: 'text-slate-600',
  },
  {
    title: 'Log your transactions',
    description:
      'Add income and expenses manually in seconds. Choose from preset categories or create your own. Fully in your control.',
    icon: 'i-heroicons-pencil-square',
    iconBg: 'bg-emerald-50',
    iconColor: 'text-emerald-600',
  },
  {
    title: 'See your full picture',
    description:
      'Explore dashboards, set budget goals, and act on trends. Go from guessing to knowing — in your first week.',
    icon: 'i-heroicons-chart-pie',
    iconBg: 'bg-sky-50',
    iconColor: 'text-sky-600',
  },
]

interface Testimonial {
  name: string
  role: string
  initials: string
  avatarBg: string
  quote: string
}

const testimonials: Testimonial[] = [
  {
    name: 'Mia Fernandez',
    role: 'Freelance Designer, Barcelona',
    initials: 'MF',
    avatarBg: 'bg-violet-500',
    quote:
      "I used to dread checking my bank account. Now I open Expensio every morning with my coffee. The clarity it gives me has genuinely changed how I handle money month to month.",
  },
  {
    name: 'James Okafor',
    role: 'Software Engineer, Lagos',
    initials: 'JO',
    avatarBg: 'bg-sky-500',
    quote:
      "I tried five other finance apps before this one. None of them stuck because they were too complex. Expensio just gets out of the way and lets me track what matters. Brilliant.",
  },
  {
    name: 'Sara Lindqvist',
    role: 'Graduate Student, Stockholm',
    initials: 'SL',
    avatarBg: 'bg-emerald-600',
    quote:
      "On a student budget, knowing where every dollar goes is non-negotiable. Expensio helped me cut $200 in monthly waste I didn't even know I had. Genuinely life-changing.",
  },
]

// ── Scroll-triggered visibility ───────────────────────────────────────────────

const bentoRef = ref<HTMLElement | null>(null)
const stepsRef = ref<HTMLElement | null>(null)
const testimonialsRef = ref<HTMLElement | null>(null)
const ctaRef = ref<HTMLElement | null>(null)

const featuresVisible = ref(false)
const stepsVisible = ref(false)
const testimonialsVisible = ref(false)
const ctaVisible = ref(false)

let observers: IntersectionObserver[] = []

function makeObserver(
  el: HTMLElement | null,
  visibleRef: { value: boolean },
  threshold = 0.15,
): IntersectionObserver | null {
  if (!el) return null
  const obs = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        visibleRef.value = true
        obs.disconnect()
      }
    },
    { threshold },
  )
  obs.observe(el)
  return obs
}

onMounted(() => {
  const o1 = makeObserver(bentoRef.value, featuresVisible)
  const o2 = makeObserver(stepsRef.value, stepsVisible)
  const o3 = makeObserver(testimonialsRef.value, testimonialsVisible)
  const o4 = makeObserver(ctaRef.value, ctaVisible)
  observers = [o1, o2, o3, o4].filter(Boolean) as IntersectionObserver[]
})

onUnmounted(() => {
  observers.forEach(o => o.disconnect())
})
</script>

<style>
/* ── Animations ─────────────────────────────────────────────────────────────── */

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(28px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(40px) scale(0.97);
  }
  to {
    opacity: 1;
    transform: translateX(0) scale(1);
  }
}

@keyframes float {
  0%, 100% { transform: translateY(0px) scale(1); }
  50%       { transform: translateY(-24px) scale(1.04); }
}

@keyframes floatSlow {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50%       { transform: translateY(-16px) rotate(3deg); }
}

@keyframes shimmer {
  from { transform: translateX(-100%) skewX(-20deg); }
  to   { transform: translateX(300%)  skewX(-20deg); }
}

@keyframes pulseSoft {
  0%, 100% { opacity: 0.6; }
  50%       { opacity: 1; }
}

/* ── Landing root ───────────────────────────────────────────────────────────── */

.landing-root {
  /* Override the default layout's bg-slate-50 for the hero */
  background: white;
}

/* ── Gradient text ──────────────────────────────────────────────────────────── */

.gradient-text {
  background: linear-gradient(135deg, #34d399 0%, #38bdf8 60%, #818cf8 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.gradient-text-light {
  background: linear-gradient(135deg, #059669 0%, #0284c7 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* ── Orbs ───────────────────────────────────────────────────────────────────── */

.orb-container {
  position: absolute;
  inset: 0;
  overflow: hidden;
}

.orb {
  position: absolute;
  border-radius: 9999px;
  filter: blur(80px);
}

.orb-1 {
  width: 600px;
  height: 600px;
  top: -180px;
  right: -120px;
  background: radial-gradient(circle, rgba(16, 185, 129, 0.18) 0%, transparent 70%);
  animation: float 9s ease-in-out infinite;
}

.orb-2 {
  width: 500px;
  height: 500px;
  bottom: -100px;
  left: -140px;
  background: radial-gradient(circle, rgba(56, 189, 248, 0.14) 0%, transparent 70%);
  animation: float 12s ease-in-out infinite reverse;
}

.orb-3 {
  width: 400px;
  height: 400px;
  top: 30%;
  left: 30%;
  background: radial-gradient(circle, rgba(129, 140, 248, 0.08) 0%, transparent 70%);
  animation: floatSlow 15s ease-in-out infinite;
}

.orb-4 {
  width: 300px;
  height: 300px;
  bottom: 20%;
  right: 20%;
  background: radial-gradient(circle, rgba(16, 185, 129, 0.1) 0%, transparent 70%);
  animation: float 11s ease-in-out infinite 2s;
}

/* ── Grid overlay ───────────────────────────────────────────────────────────── */

.grid-overlay {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px);
  background-size: 60px 60px;
}

/* ── Hero copy animations ───────────────────────────────────────────────────── */

.hero-badge-wrap {
  animation: fadeInUp 0.7s ease-out both;
  animation-delay: 0.1s;
}

.hero-headline {
  animation: fadeInUp 0.7s ease-out both;
  animation-delay: 0.2s;
}

.hero-sub {
  animation: fadeInUp 0.7s ease-out both;
  animation-delay: 0.35s;
}

.hero-ctas {
  animation: fadeInUp 0.7s ease-out both;
  animation-delay: 0.5s;
}

/* ── Hero widget ────────────────────────────────────────────────────────────── */

.hero-widget-wrap {
  animation: slideInRight 0.9s cubic-bezier(0.22, 1, 0.36, 1) both;
  animation-delay: 0.4s;
}

.dashboard-widget {
  background: linear-gradient(145deg, #1e2535, #141926);
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 20px;
  padding: 24px;
  width: 100%;
  max-width: 420px;
  box-shadow:
    0 0 0 1px rgba(16, 185, 129, 0.08),
    0 25px 60px rgba(0, 0, 0, 0.5),
    0 0 80px rgba(16, 185, 129, 0.06);
}

.metric-card {
  transition: border-color 0.2s, box-shadow 0.2s;
}

.metric-card:hover {
  border-color: rgba(16, 185, 129, 0.3);
  box-shadow: 0 0 0 1px rgba(16, 185, 129, 0.1) inset;
}

.budget-bar {
  animation: pulseSoft 3s ease-in-out infinite;
}

/* ── Stats strip ────────────────────────────────────────────────────────────── */

.stats-strip {
  animation: fadeInUp 0.7s ease-out both;
  animation-delay: 0.75s;
}

.stat-item {
  transition: background 0.2s;
}

.stat-item:hover {
  background: rgba(16, 185, 129, 0.05);
}

/* ── CTA shine effect ───────────────────────────────────────────────────────── */

.cta-primary,
.cta-section .cta-shine {
  position: relative;
}

.cta-shine {
  position: absolute;
  inset: 0;
  background: linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.25) 50%, transparent 60%);
  transform: translateX(-100%) skewX(-20deg);
  pointer-events: none;
}

.cta-primary:hover .cta-shine {
  animation: shimmer 0.6s ease-out;
}

/* ── Bento grid ─────────────────────────────────────────────────────────────── */

.bento-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: auto auto;
  gap: 16px;
}

@media (max-width: 768px) {
  .bento-grid {
    grid-template-columns: 1fr;
  }
  .bento-wide {
    grid-column: span 1 !important;
  }
}

.bento-wide {
  grid-column: span 2;
}

.bento-normal {
  grid-column: span 1;
}

/* Scroll-reveal: bento cards */
.bento-card {
  opacity: 0;
  transform: translateY(24px);
  transition: none;
}

.bento-card.visible {
  animation: fadeInUp 0.6s cubic-bezier(0.22, 1, 0.36, 1) both;
}

.bento-inner {
  transition: box-shadow 0.25s, transform 0.25s;
}

.bento-inner:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 40px rgba(0,0,0,0.08);
}

/* ── Step cards ─────────────────────────────────────────────────────────────── */

.step-card {
  opacity: 0;
  transform: translateY(24px);
}

.step-card.visible {
  animation: fadeInUp 0.6s cubic-bezier(0.22, 1, 0.36, 1) both;
}

/* ── Testimonial cards ──────────────────────────────────────────────────────── */

.testimonial-card {
  opacity: 0;
  transform: translateY(24px);
}

.testimonial-card.visible {
  animation: fadeInUp 0.6s cubic-bezier(0.22, 1, 0.36, 1) both;
}

/* ── CTA section ────────────────────────────────────────────────────────────── */

.cta-orb {
  position: absolute;
  border-radius: 9999px;
  filter: blur(100px);
  pointer-events: none;
}

.cta-orb-left {
  width: 500px;
  height: 500px;
  top: -100px;
  left: -150px;
  background: radial-gradient(circle, rgba(16, 185, 129, 0.2) 0%, transparent 70%);
  animation: float 10s ease-in-out infinite;
}

.cta-orb-right {
  width: 400px;
  height: 400px;
  bottom: -80px;
  right: -100px;
  background: radial-gradient(circle, rgba(56, 189, 248, 0.15) 0%, transparent 70%);
  animation: float 13s ease-in-out infinite reverse;
}

.cta-content {
  opacity: 0;
  transform: translateY(24px);
}

.cta-content.visible {
  animation: fadeInUp 0.8s cubic-bezier(0.22, 1, 0.36, 1) both;
}
</style>
