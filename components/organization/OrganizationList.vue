<template>
  <div class="space-y-6">    <div v-if="loading" class="flex flex-col justify-center items-center py-8 space-y-3">
      <ULoading />
      <p class="text-gray-600 font-medium">Getting your organizations...</p>
    </div>
    
    <div v-else-if="organizations.length === 0" class="text-center py-8">
      <div class="mx-auto max-w-md">        <img
          src="~/assets/images/loading.png"
          alt="No organizations"
          class="mx-auto w-48 h-auto mb-3"
        />
        <h3 class="text-2xl font-semibold text-gray-900 mb-4">No Organizations Found</h3>
        <p class="text-gray-500 mb-6">Get started by creating your first organization</p>
        <UButton
          color="primary"
          size="lg"
          to="/organizations/create"
          icon="i-heroicons-plus"
        >
          Create Organization
        </UButton>
      </div>
    </div>

    <div v-else class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <div
        v-for="org in organizations"
        :key="org.id"
        class="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
      >
        <h3 class="text-xl font-semibold text-gray-900 mb-2">{{ org.name }}</h3>
        <p class="text-gray-500 mb-4">{{ org.description }}</p>
        <UButton
          color="primary"
          variant="soft"
          :to="'/organizations/' + org.id"
        >
          View Details
        </UButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface Organization {
  id: string;
  name: string;
  description: string;
}

const organizations = ref<Organization[]>([]);
const loading = ref(true);

onMounted(async () => {
  try {
    const response = await fetch('http://localhost:8787/api/organizations/all');
    if (!response.ok) {
      throw new Error('Failed to fetch organizations');
    }
    organizations.value = await response.json();
  } catch (error) {
    console.error('Error fetching organizations:', error);
  } finally {
    loading.value = false;
  }
});
</script>
