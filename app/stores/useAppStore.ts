import { defineStore } from 'pinia'

interface AppState {
  appName: string
  isLoading: boolean
}

export const useAppStore = defineStore('app', {
  state: (): AppState => ({
    appName: 'Expensio',
    isLoading: false,
  }),

  getters: {
    title: (state): string => state.appName,
  },

  actions: {
    setLoading(value: boolean) {
      this.isLoading = value
    },
  },
})
