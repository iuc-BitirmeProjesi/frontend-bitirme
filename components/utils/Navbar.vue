<template>
  <nav class="fixed top-0 right-0 p-4 z-50">
    <NuxtLink v-if="showLoginButton" to="/login">
      <UButton
        class="px-6 py-2 transition-all duration-300 ease-in-out hover:scale-105 cursor-pointer"
        style="background-color: #0F172B; color: #fff; border:1px solid #ffffff14; border-radius: 8px;"
        :class="{'hover-glow': true}"
      >
        Login
      </UButton>
    </NuxtLink>
  </nav>
</template>

<script setup>
const route = useRoute()
const showLoginButton = computed(() => route.path === '/')
</script>

<style scoped>
.hover-glow:hover {
  box-shadow: 0 0 15px rgba(255, 255, 255, 0.2);
}
</style>