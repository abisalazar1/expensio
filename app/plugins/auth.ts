import { useAuthStore } from '~/stores/useAuth'
import type { ApiClass } from '~/plugins/axios'

export default defineNuxtPlugin({
  name: 'auth',
  async setup() {
    const { authCookieName } = useRuntimeConfig().public
    const authStore = useAuthStore()
    const { $api } = useNuxtApp() as unknown as { $api: ApiClass }
    const cookie = useCookie(authCookieName)

    if (cookie.value && !authStore.user) {
      try {
        const data = await $api.get<Record<string, any>>('me')
        await authStore.setUser(data)
        useState('loggedIn', () => true)
        return
      } catch {
        // token invalid or expired — fall through
      }
    }

    useState('loggedIn', () => false)
  },
})
