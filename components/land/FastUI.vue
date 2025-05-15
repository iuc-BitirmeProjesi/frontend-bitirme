<template>
  <div class="p-8 ml-16 my-12">
    <Transition name="fade-up">
      <div v-if="showContent">
        <div class="flex">
          <div class="w-1 bg-gray-300 rounded-full mr-6"></div>
          <div>
            <h2 class="text-4xl font-extrabold mb-4">Fast & Intuitive UI</h2>
            <p class="text-lg text-gray-300">Enjoy a sleek, modern UI designed for speed and simplicity to boost your productivity.</p>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const showContent = ref(false)

onMounted(() => {
  setTimeout(() => {
    showContent.value = true
  }, 3000)
})
</script>