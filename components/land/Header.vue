<template>
  <div class="relative w-full h-[50vh]">
    <!-- Arka Plan SVG -->
    <img src="@/assets/images/animated-bg.svg" alt="Animated background" class="absolute w-full h-full object-cover z-0" />

    <!-- İçerik -->
    <div class="relative z-10 flex flex-col items-center justify-center h-full text-center">
      <!-- Başlık -->
      <Transition name="fade-up">
        <h1 v-if="showText" class="text-white text-7xl font-bold special-font">
          Labeloo
        </h1>
      </Transition>

      <!-- Alt başlık -->
      <Transition name="fade-up">
        <p v-if="showSubtitle" class="italic text-white mt-4 text-xl opacity-80">
          Label faster. Smarter.
        </p>
      </Transition>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const showText = ref(false)
const showSubtitle = ref(false)

onMounted(() => {
  setTimeout(() => {
    showText.value = true
  }, 1000)

  setTimeout(() => {
    showSubtitle.value = true
  }, 1600)
})
</script>

<style scoped>  
  .special-font {
    font-family: 'Roboto Mono', sans-serif;
  }
</style>