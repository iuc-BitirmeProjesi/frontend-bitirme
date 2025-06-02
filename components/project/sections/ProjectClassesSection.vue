<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-2xl font-semibold text-gray-900 dark:text-white">Project Classes</h2>
      <UButton color="primary">
        <UIcon name="i-heroicons-plus" class="w-4 h-4 mr-2" />
        Add Class
      </UButton>
    </div>

    <!-- Classes Overview -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div class="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
        <div class="flex items-center">
          <UIcon name="i-heroicons-academic-cap" class="w-8 h-8 text-blue-600 mr-3" />
          <div>
            <p class="text-sm text-blue-600 dark:text-blue-400">Total Classes</p>
            <p class="text-2xl font-bold text-blue-900 dark:text-blue-200">8</p>
          </div>
        </div>
      </div>
      
      <div class="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
        <div class="flex items-center">
          <UIcon name="i-heroicons-check-circle" class="w-8 h-8 text-green-600 mr-3" />
          <div>
            <p class="text-sm text-green-600 dark:text-green-400">Active Classes</p>
            <p class="text-2xl font-bold text-green-900 dark:text-green-200">6</p>
          </div>
        </div>
      </div>
      
      <div class="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
        <div class="flex items-center">
          <UIcon name="i-heroicons-chart-bar" class="w-8 h-8 text-purple-600 mr-3" />
          <div>
            <p class="text-sm text-purple-600 dark:text-purple-400">Avg. Samples</p>
            <p class="text-2xl font-bold text-purple-900 dark:text-purple-200">1.2K</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Classes List -->
    <div class="space-y-4">
      <div class="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
        <div class="flex items-center justify-between mb-3">          <div class="flex items-center space-x-3">
            <div class="w-4 h-4 bg-red-500 rounded-full"></div>
            <h3 class="font-medium text-gray-900 dark:text-white">Cat</h3>
            <UBadge color="success" variant="soft">Active</UBadge>
          </div>
          <div class="flex items-center space-x-2">
            <span class="text-sm text-gray-500">1,450 samples</span>
            <UButton color="neutral" variant="ghost" size="sm">
              <UIcon name="i-heroicons-pencil" class="w-4 h-4" />
            </UButton>
            <UButton color="neutral" variant="ghost" size="sm">
              <UIcon name="i-heroicons-ellipsis-horizontal" class="w-4 h-4" />
            </UButton>
          </div>
        </div>
        <p class="text-sm text-gray-600 dark:text-gray-400">
          Images containing cats in various poses and environments
        </p>
      </div>

      <div class="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center space-x-3">
            <div class="w-4 h-4 bg-blue-500 rounded-full"></div>
            <h3 class="font-medium text-gray-900 dark:text-white">Dog</h3>
            <UBadge color="success" variant="soft">Active</UBadge>
          </div>
          <div class="flex items-center space-x-2">
            <span class="text-sm text-gray-500">1,320 samples</span>
            <UButton color="neutral" variant="ghost" size="sm">
              <UIcon name="i-heroicons-pencil" class="w-4 h-4" />
            </UButton>
            <UButton color="neutral" variant="ghost" size="sm">
              <UIcon name="i-heroicons-ellipsis-horizontal" class="w-4 h-4" />
            </UButton>
          </div>
        </div>
        <p class="text-sm text-gray-600 dark:text-gray-400">
          Images of dogs of different breeds and sizes
        </p>
      </div>

      <div class="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center space-x-3">
            <div class="w-4 h-4 bg-yellow-500 rounded-full"></div>
            <h3 class="font-medium text-gray-900 dark:text-white">Bird</h3>
            <UBadge color="success" variant="soft">Active</UBadge>
          </div>
          <div class="flex items-center space-x-2">
            <span class="text-sm text-gray-500">890 samples</span>
            <UButton color="neutral" variant="ghost" size="sm">
              <UIcon name="i-heroicons-pencil" class="w-4 h-4" />
            </UButton>
            <UButton color="neutral" variant="ghost" size="sm">
              <UIcon name="i-heroicons-ellipsis-horizontal" class="w-4 h-4" />
            </UButton>
          </div>
        </div>
        <p class="text-sm text-gray-600 dark:text-gray-400">
          Various bird species in natural and urban environments
        </p>
      </div>

      <div class="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center space-x-3">
            <div class="w-4 h-4 bg-green-500 rounded-full"></div>
            <h3 class="font-medium text-gray-900 dark:text-white">Car</h3>
            <UBadge color="success" variant="soft">Active</UBadge>
          </div>
          <div class="flex items-center space-x-2">
            <span class="text-sm text-gray-500">1,120 samples</span>
            <UButton color="neutral" variant="ghost" size="sm">
              <UIcon name="i-heroicons-pencil" class="w-4 h-4" />
            </UButton>
            <UButton color="neutral" variant="ghost" size="sm">
              <UIcon name="i-heroicons-ellipsis-horizontal" class="w-4 h-4" />
            </UButton>
          </div>
        </div>
        <p class="text-sm text-gray-600 dark:text-gray-400">
          Different types of vehicles including cars, trucks, and motorcycles
        </p>
      </div>

      <div class="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center space-x-3">
            <div class="w-4 h-4 bg-purple-500 rounded-full"></div>
            <h3 class="font-medium text-gray-900 dark:text-white">Person</h3>
            <UBadge color="warning" variant="soft">Inactive</UBadge>
          </div>
          <div class="flex items-center space-x-2">
            <span class="text-sm text-gray-500">750 samples</span>
            <UButton color="neutral" variant="ghost" size="sm">
              <UIcon name="i-heroicons-pencil" class="w-4 h-4" />
            </UButton>
            <UButton color="neutral" variant="ghost" size="sm">
              <UIcon name="i-heroicons-ellipsis-horizontal" class="w-4 h-4" />
            </UButton>
          </div>
        </div>
        <p class="text-sm text-gray-600 dark:text-gray-400">
          Images of people in various activities and settings
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  projectId: string
}

const props = defineProps<Props>()
</script>
