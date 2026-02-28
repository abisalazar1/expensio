<template>
  <div class="w-full max-w-md">
    <!-- Card -->
    <UCard class="shadow-xl border border-slate-200/80">
      <!-- Header -->
      <template #header>
        <div class="text-center py-2">
          <div class="inline-flex items-center justify-center w-12 h-12 bg-emerald-500 rounded-xl mb-4 shadow-md shadow-emerald-500/30">
            <UIcon name="i-heroicons-user-plus" class="text-white text-2xl" />
          </div>
          <h1 class="text-2xl font-bold text-slate-900">Create your account</h1>
          <p class="text-slate-500 text-sm mt-1">Start tracking your finances for free</p>
        </div>
      </template>

      <!-- Form body -->
      <UForm :state="form" :validate="validate" @submit="onSubmit" class="space-y-5">
        <!-- Full name -->
        <UFormField label="Full name" name="name" required>
          <UInput
            v-model="form.name"
            type="text"
            placeholder="Jane Smith"
            autocomplete="name"
            leading-icon="i-heroicons-user"
            size="lg"
            class="w-full"
          />
        </UFormField>

        <!-- Email -->
        <UFormField label="Email address" name="email" required>
          <UInput
            v-model="form.email"
            type="email"
            placeholder="you@example.com"
            autocomplete="email"
            leading-icon="i-heroicons-envelope"
            size="lg"
            class="w-full"
          />
        </UFormField>

        <!-- Password -->
        <UFormField label="Password" name="password" required>
          <UInput
            v-model="form.password"
            :type="showPassword ? 'text' : 'password'"
            placeholder="Create a strong password"
            autocomplete="new-password"
            leading-icon="i-heroicons-lock-closed"
            size="lg"
            class="w-full"
            :trailing-icon="showPassword ? 'i-heroicons-eye-slash' : 'i-heroicons-eye'"
            @click-trailing="showPassword = !showPassword"
          />
          <!-- Password strength hint -->
          <template v-if="form.password" #hint>
            <span :class="passwordStrength.class">{{ passwordStrength.label }}</span>
          </template>
        </UFormField>

        <!-- Confirm password -->
        <UFormField label="Confirm password" name="confirmPassword" required>
          <UInput
            v-model="form.confirmPassword"
            :type="showConfirmPassword ? 'text' : 'password'"
            placeholder="Repeat your password"
            autocomplete="new-password"
            leading-icon="i-heroicons-lock-closed"
            size="lg"
            class="w-full"
            :trailing-icon="showConfirmPassword ? 'i-heroicons-eye-slash' : 'i-heroicons-eye'"
            @click-trailing="showConfirmPassword = !showConfirmPassword"
          />
        </UFormField>

        <!-- Terms acceptance -->
        <UFormField name="termsAccepted">
          <div class="flex items-start gap-3">
            <UCheckbox v-model="form.termsAccepted" class="mt-0.5" />
            <p class="text-xs text-slate-500 leading-relaxed">
              I agree to the
              <a href="#" class="text-emerald-600 hover:underline">Terms of Service</a>
              and
              <a href="#" class="text-emerald-600 hover:underline">Privacy Policy</a>.
            </p>
          </div>
        </UFormField>

        <!-- Error alert -->
        <UAlert
          v-if="errorMessage"
          color="error"
          variant="subtle"
          icon="i-heroicons-exclamation-circle"
          :description="errorMessage"
        />

        <!-- Submit -->
        <UButton
          type="submit"
          color="primary"
          size="lg"
          block
          :loading="isLoading"
          :disabled="isLoading"
          class="shadow-sm shadow-emerald-500/20 mt-2"
        >
          {{ isLoading ? 'Creating account...' : 'Create Account' }}
        </UButton>
      </UForm>

      <!-- Footer -->
      <template #footer>
        <p class="text-center text-sm text-slate-500">
          Already have an account?
          <NuxtLink to="/auth/login" class="text-emerald-600 hover:text-emerald-700 font-semibold transition-colors ml-1">
            Sign in
          </NuxtLink>
        </p>
      </template>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import type { FormError, FormSubmitEvent } from '@nuxt/ui'
import type { ApiClass } from '~/plugins/axios'

definePageMeta({ layout: 'auth' })

useSeoMeta({
  title: 'Create Account — Expensio',
  description: 'Sign up for Expensio and start managing your personal finances.',
})

interface RegisterForm {
  name: string
  email: string
  password: string
  confirmPassword: string
  termsAccepted: boolean
}

const form = reactive<RegisterForm>({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  termsAccepted: false,
})

const { $api } = useNuxtApp() as unknown as { $api: ApiClass }
const authStore = useAuthStore()

const showPassword = ref(false)
const showConfirmPassword = ref(false)
const isLoading = ref(false)
const errorMessage = ref<string | null>(null)

const passwordStrength = computed(() => {
  const p = form.password
  if (!p) return { label: '', class: '' }

  const hasLower = /[a-z]/.test(p)
  const hasUpper = /[A-Z]/.test(p)
  const hasDigit = /\d/.test(p)
  const hasSpecial = /[^a-zA-Z0-9]/.test(p)
  const score = [p.length >= 8, hasLower, hasUpper, hasDigit, hasSpecial].filter(Boolean).length

  if (score <= 2) return { label: 'Weak password', class: 'text-rose-500 text-xs font-medium' }
  if (score <= 3) return { label: 'Fair password', class: 'text-amber-500 text-xs font-medium' }
  if (score === 4) return { label: 'Good password', class: 'text-sky-500 text-xs font-medium' }
  return { label: 'Strong password', class: 'text-emerald-600 text-xs font-medium' }
})

const validate = (state: RegisterForm): FormError[] => {
  const errors: FormError[] = []

  if (!state.name.trim()) {
    errors.push({ name: 'name', message: 'Full name is required.' })
  } else if (state.name.trim().length < 2) {
    errors.push({ name: 'name', message: 'Name must be at least 2 characters.' })
  }

  if (!state.email) {
    errors.push({ name: 'email', message: 'Email is required.' })
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(state.email)) {
    errors.push({ name: 'email', message: 'Please enter a valid email address.' })
  }

  if (!state.password) {
    errors.push({ name: 'password', message: 'Password is required.' })
  } else if (state.password.length < 8) {
    errors.push({ name: 'password', message: 'Password must be at least 8 characters.' })
  }

  if (!state.confirmPassword) {
    errors.push({ name: 'confirmPassword', message: 'Please confirm your password.' })
  } else if (state.password !== state.confirmPassword) {
    errors.push({ name: 'confirmPassword', message: 'Passwords do not match.' })
  }

  if (!state.termsAccepted) {
    errors.push({ name: 'termsAccepted', message: 'You must accept the terms to continue.' })
  }

  return errors
}

const onSubmit = async (_event: FormSubmitEvent<RegisterForm>) => {
  errorMessage.value = null
  isLoading.value = true
  try {
    const data = await $api.post<Record<string, any>>('register', {
      name: form.name,
      email: form.email,
      password: form.password,
      password_confirmation: form.confirmPassword,
      terms_accepted: form.termsAccepted,
    })

    await authStore.setUser(data)
    await navigateTo('/dashboard')
  } catch (error: any) {
    errorMessage.value = error?.data?.message || 'Registration failed. Please try again.'
  } finally {
    isLoading.value = false
  }
}
</script>
