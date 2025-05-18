<template>
  <div class="space-y-6">
    <div v-if="loading" class="flex flex-col justify-center items-center min-h-[400px] py-8 space-y-3">
      <ULoading />
      <p class="text-gray-600 dark:text-gray-300 font-medium">Getting your organizations...</p>
    </div>


    <!-- If there are no organizations and not loading-->
    <div v-else-if="organizations.length === 0" class="text-center py-8 min-h-[400px] flex items-center justify-center">
      <div class="mx-auto max-w-md"> <img src="~/assets/images/loading.png" alt="No organizations"
          class="mx-auto w-48 h-auto mb-3" />
        <h3 class="text-2xl font-semibold text-secondary mb-4">No Organizations Found</h3>
        <p class="text-gray-500 mb-6">Get started by creating your first organization</p>
        <UModal>
          <UButton label="Create Organization" color="secondary" class="cursor-pointer" size="xl" />

          <template #content>
            <div class="p-6">
              <OrganizationCreateOrg />
            </div>
          </template>
        </UModal>
      </div>
    </div>


    <!-- If there are organizations-->
    <div v-else class="min-h-[400px] grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <div v-for="org in organizations" :key="org.id"
        class="bg-white dark:bg-gray-700 rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
        <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">{{ org.name }}</h3>
        <p class="text-gray-500 dark:text-gray-300 mb-4">{{ org.description }}</p>
        <UButton color="primary" variant="soft" :to="'/organizations/' + org.id">
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

<style scoped></style>
