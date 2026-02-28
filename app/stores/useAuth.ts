export const useAuthStore = defineStore('authStore', {
  state: () => ({
    user: null as Record<string, any> | null,
  }),
  getters: {
    isAuthenticated: (state) => !!state.user,
  },
  actions: {
    async setUser(user: Record<string, any>) {
      this.user = user;
      if (user.token) {
        await $fetch('/api/auth', {
          method: 'POST',
          body: {
            token: user.token,
          },
        });
      }
    },
    logout() {
      this.user = null;
    },
  },
})
