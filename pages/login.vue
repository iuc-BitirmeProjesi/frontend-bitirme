// pages/login.vue
<template>  <div class="min-h-screen flex items-center justify-center bg-[url('@/assets/images/bg-theme.jpeg')] bg-cover bg-center py-12 px-4 sm:px-6 lg:px-8">    <UCard class="w-full max-w-md" style="background-color: #1C1C1C">
      <!-- Logo/Header Section -->
      <template #header>
        <div class="text-center">
          <img 
            src="@/assets/images/success-redesign-Photoroom.png" 
            alt="Success"
            class="mx-auto w-32 h-auto mb-3"
          />
          <h1 class="text-2xl font-bold text-white">Welcome Back</h1>
          <p class="mt-1 text-sm font-semibold text-white">Sign in to your account</p>
        </div>
      </template>

      <!-- Login Form -->
      <AuthLoginForm />

      <!-- Footer Section -->
      <template #footer>
        <div class="text-center">
          <p class="text-sm text-gray-600">            Don't have an account? 
            <NuxtLink to="/register" style="color: #FAA33D" class="font-medium">
              Create an account
            </NuxtLink>
          </p>
        </div>
      </template>
    </UCard>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'default'
});
</script>