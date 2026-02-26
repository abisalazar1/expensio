<template>
  <div class="w-full max-w-md">
    <!-- Card -->
    <UCard class="shadow-xl border border-slate-200/80">
      <!-- Header -->
      <template #header>
        <div class="text-center py-2">
          <div class="inline-flex items-center justify-center w-12 h-12 bg-emerald-500 rounded-xl mb-4 shadow-md shadow-emerald-500/30">
            <UIcon name="i-heroicons-banknotes" class="text-white text-2xl" />
          </div>
          <h1 class="text-2xl font-bold text-slate-900">Welcome back</h1>
          <p class="text-slate-500 text-sm mt-1">Sign in to your Expensio account</p>
        </div>
      </template>

      <!-- Form body -->
      <UForm :state="form" :validate="validate" @submit="onSubmit" class="space-y-5">
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
            placeholder="Enter your password"
            autocomplete="current-password"
            leading-icon="i-heroicons-lock-closed"
            size="lg"
            class="w-full"
            :trailing-icon="showPassword ? 'i-heroicons-eye-slash' : 'i-heroicons-eye'"
            @click-trailing="showPassword = !showPassword"
          />
        </UFormField>

        <!-- Forgot password -->
        <div class="flex justify-end -mt-2">
          <a href="#" class="text-sm text-emerald-600 hover:text-emerald-700 font-medium transition-colors">
            Forgot password?
          </a>
        </div>

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
          {{ isLoading ? 'Signing in...' : 'Sign In' }}
        </UButton>
      </UForm>

      <!-- Footer -->
      <template #footer>
        <p class="text-center text-sm text-slate-500">
          Don't have an account?
          <NuxtLink to="/auth/register" class="text-emerald-600 hover:text-emerald-700 font-semibold transition-colors ml-1">
            Create one free
          </NuxtLink>
        </p>
      </template>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import type { FormError, FormSubmitEvent } from '@nuxt/ui'

definePageMeta({ layout: 'auth' })

useSeoMeta({
  title: 'Sign In — Expensio',
  description: 'Sign in to your Expensio account to manage your finances.',
})

interface LoginForm {
  email: string
  password: string
}

const form = reactive<LoginForm>({
  email: '',
  password: '',
})

const showPassword = ref(false)
const isLoading = ref(false)
const errorMessage = ref<string | null>(null)

const validate = (state: LoginForm): FormError[] => {
  const errors: FormError[] = []

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

  return errors
}

const onSubmit = async (event: FormSubmitEvent<LoginForm>) => {
  errorMessage.value = null
  isLoading.value = true

  try {
    // TODO: replace with real API call via $api
    console.log('[login] form submitted:', event.data)

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800))

    // TODO: navigate to dashboard after successful auth
    // await navigateTo('/dashboard')
  } catch {
    errorMessage.value = 'Invalid email or password. Please try again.'
  } finally {
    isLoading.value = false
  }
}
</script>
