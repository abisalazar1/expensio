import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

// ── Types ──────────────────────────────────────────────────────────────────────

export interface Subscription {
  id: number
  name: string
  amount: number
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly'
  nextBillingDate: string // YYYY-MM-DD
  category: string
  icon: string
  color: 'emerald' | 'rose' | 'sky' | 'violet' | 'amber'
  isActive: boolean
}

// ── Mock data — TODO: GET /api/subscriptions ───────────────────────────────────

const MOCK_SUBSCRIPTIONS: Subscription[] = [
  { id: 1, name: 'Netflix',              amount: 15.99, frequency: 'monthly', nextBillingDate: '2026-03-01', category: 'Entertainment',    icon: 'i-heroicons-tv',             color: 'rose',    isActive: true  },
  { id: 2, name: 'Spotify',              amount: 9.99,  frequency: 'monthly', nextBillingDate: '2026-02-27', category: 'Entertainment',    icon: 'i-heroicons-musical-note',   color: 'emerald', isActive: true  },
  { id: 3, name: 'iCloud+',              amount: 2.99,  frequency: 'monthly', nextBillingDate: '2026-03-10', category: 'Cloud & Storage',  icon: 'i-heroicons-cloud',          color: 'sky',     isActive: true  },
  { id: 4, name: 'Adobe Creative Cloud', amount: 54.99, frequency: 'monthly', nextBillingDate: '2026-03-15', category: 'Work & Tools',     icon: 'i-heroicons-paint-brush',    color: 'violet',  isActive: true  },
  { id: 5, name: 'Gym Membership',       amount: 45.00, frequency: 'monthly', nextBillingDate: '2026-03-05', category: 'Health & Fitness', icon: 'i-heroicons-heart',          color: 'rose',    isActive: true  },
  { id: 6, name: 'Amazon Prime',         amount: 14.99, frequency: 'monthly', nextBillingDate: '2026-03-22', category: 'Shopping',         icon: 'i-heroicons-shopping-cart',  color: 'amber',   isActive: true  },
  { id: 7, name: 'YouTube Premium',      amount: 13.99, frequency: 'monthly', nextBillingDate: '2026-02-28', category: 'Entertainment',    icon: 'i-heroicons-play',           color: 'rose',    isActive: true  },
  { id: 8, name: 'Headspace',            amount: 12.99, frequency: 'monthly', nextBillingDate: '2026-03-08', category: 'Health & Fitness', icon: 'i-heroicons-face-smile',     color: 'sky',     isActive: false },
]

// ── Store ──────────────────────────────────────────────────────────────────────

export const useSubscriptionsStore = defineStore('subscriptions', () => {
  const subscriptions = ref<Subscription[]>(MOCK_SUBSCRIPTIONS)

  const activeSubscriptions = computed(() =>
    subscriptions.value.filter(s => s.isActive)
  )

  function monthlyEquivalent(s: Subscription): number {
    if (s.frequency === 'yearly') return s.amount / 12
    if (s.frequency === 'weekly') return s.amount * 4.33
    if (s.frequency === 'daily')  return s.amount * 30
    return s.amount
  }

  const totalMonthlyCost = computed(() =>
    activeSubscriptions.value.reduce((sum, s) => sum + monthlyEquivalent(s), 0)
  )

  const upcomingBills = computed(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const cutoff = new Date(today)
    cutoff.setDate(today.getDate() + 7)
    return subscriptions.value
      .filter(s => s.isActive)
      .filter(s => {
        const d = new Date(s.nextBillingDate)
        return d >= today && d <= cutoff
      })
      .sort((a, b) => new Date(a.nextBillingDate).getTime() - new Date(b.nextBillingDate).getTime())
  })

  function addSubscription(sub: Omit<Subscription, 'id'>) {
    const id = Math.max(0, ...subscriptions.value.map(s => s.id)) + 1
    subscriptions.value.push({ ...sub, id })
  }

  function updateSubscription(id: number, data: Partial<Omit<Subscription, 'id'>>) {
    const sub = subscriptions.value.find(s => s.id === id)
    if (sub) Object.assign(sub, data)
  }

  function removeSubscription(id: number) {
    const idx = subscriptions.value.findIndex(s => s.id === id)
    if (idx !== -1) subscriptions.value.splice(idx, 1)
  }

  function toggleActive(id: number) {
    const sub = subscriptions.value.find(s => s.id === id)
    if (sub) sub.isActive = !sub.isActive
  }

  return {
    subscriptions,
    activeSubscriptions,
    totalMonthlyCost,
    upcomingBills,
    monthlyEquivalent,
    addSubscription,
    updateSubscription,
    removeSubscription,
    toggleActive,
  }
})
