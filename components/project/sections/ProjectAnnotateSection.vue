<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
          Annotation Center
        </h2>
        <p class="text-gray-600 dark:text-gray-400 mt-1">
          Manage task assignments and track annotation progress
        </p>
      </div>      <div class="flex items-center gap-4">
        <UButton 
          v-if="selectedTasks.length > 0" 
          @click="assignSelectedTasks" 
          :loading="assignLoading"
          color="primary"
        >
          <UIcon name="i-heroicons-user-plus" class="w-4 h-4 mr-2" />
          Assign ({{ selectedTasks.length }})
        </UButton>
        <UButton @click="refreshTasks" :loading="loading" variant="outline">
          <UIcon name="i-heroicons-arrow-path" class="w-4 h-4 mr-2" />
          Refresh
        </UButton>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading && !tasks" class="flex items-center justify-center py-12">
      <div class="text-center">
        <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
        <p class="text-gray-600 dark:text-gray-400">Loading tasks...</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
      <div class="flex items-center">
        <UIcon name="i-heroicons-exclamation-circle" class="w-6 h-6 text-red-600 dark:text-red-400 mr-3" />
        <div>
          <h3 class="text-red-800 dark:text-red-300 font-medium">Error Loading Tasks</h3>
          <p class="text-red-600 dark:text-red-400 text-sm mt-1">{{ error }}</p>
        </div>
      </div>      <UButton @click="refreshTasks" variant="outline" color="error" class="mt-4" size="sm">
        Try Again
      </UButton>
    </div>    <!-- Main Content -->
    <div v-else-if="tasks" class="space-y-6">
      <!-- Stats Overview -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6">
          <div class="flex items-center">
            <div class="p-2 bg-yellow-100 dark:bg-yellow-900/40 rounded-lg">
              <UIcon name="i-heroicons-clock" class="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-yellow-800 dark:text-yellow-300">Unassigned</p>
              <p class="text-2xl font-bold text-yellow-900 dark:text-yellow-200">{{ tasks.unassigned.length }}</p>
            </div>
          </div>
        </div>

        <div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
          <div class="flex items-center">
            <div class="p-2 bg-blue-100 dark:bg-blue-900/40 rounded-lg">
              <UIcon name="i-heroicons-pencil" class="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-blue-800 dark:text-blue-300">Annotating</p>
              <p class="text-2xl font-bold text-blue-900 dark:text-blue-200">{{ tasks.annotating.length }}</p>
            </div>
          </div>
        </div>

        <div class="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
          <div class="flex items-center">
            <div class="p-2 bg-green-100 dark:bg-green-900/40 rounded-lg">
              <UIcon name="i-heroicons-check-circle" class="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-green-800 dark:text-green-300">Completed</p>
              <p class="text-2xl font-bold text-green-900 dark:text-green-200">{{ tasks.completed.length }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Tabs -->
      <div class="border-b border-gray-200 dark:border-gray-700">
        <nav class="-mb-px flex space-x-8">
          <button
            v-for="tab in tabs"
            :key="tab.key"
            @click="activeTab = tab.key"
            :class="[
              'py-2 px-1 border-b-2 font-medium text-sm transition-colors',
              activeTab === tab.key
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
            ]"
          >
            <div class="flex items-center">
              <UIcon :name="tab.icon" class="w-4 h-4 mr-2" />
              {{ tab.label }}
              <span class="ml-2 px-2 py-1 text-xs rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                {{ getTaskCount(tab.key) }}
              </span>
            </div>
          </button>
        </nav>
      </div>

      <!-- Tab Content -->
      <div class="space-y-4">        <!-- Unassigned Tab -->
        <div v-if="activeTab === 'unassigned'">
          <div v-if="tasks.unassigned.length === 0" class="text-center py-12">
            <UIcon name="i-heroicons-inbox" class="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">No Unassigned Tasks</h3>
            <p class="text-gray-500 dark:text-gray-400">All tasks have been assigned to team members.</p>
          </div>          <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div 
              v-for="task in tasks.unassigned" 
              :key="task.id" 
              :class="[
                'border p-4 rounded cursor-pointer transition-all',
                selectedTasks.includes(task.id) 
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                  : 'border-gray-300 hover:border-blue-300'
              ]"
              @click="toggleTaskSelection(task.id)"
            >
              <div class="flex items-start justify-between mb-2">
                <h4 class="font-medium">Task {{ task.id }}</h4>
                <UCheckbox 
                  :model-value="selectedTasks.includes(task.id)"
                  @change="toggleTaskSelection(task.id)"
                  @click.stop
                />
              </div>
              <p class="text-sm text-gray-600 dark:text-gray-400">Status: {{ task.status }}</p>
              <p class="text-sm text-gray-600 dark:text-gray-400">Type: {{ task.dataType }}</p>
              <img v-if="task.dataType.includes('image')" :src="task.dataUrl" class="w-full h-32 object-cover mt-2 rounded" />
            </div>
          </div>
        </div>        <!-- Annotating Tab -->
        <div v-if="activeTab === 'annotating'">
          <div v-if="tasks.annotating.length === 0" class="text-center py-12">
            <UIcon name="i-heroicons-pencil" class="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">No Tasks in Progress</h3>
            <p class="text-gray-500 dark:text-gray-400">No tasks are currently being annotated.</p>
          </div>          <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div 
              v-for="task in tasks.annotating" 
              :key="task.id" 
              class="border border-blue-500 p-4 rounded cursor-pointer transition-all hover:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20"
              @click="navigateToAnnotate(task.id)"
            >
              <div class="flex items-start justify-between mb-2">
                <h4 class="font-medium">Task {{ task.id }}</h4>
                <UIcon name="i-heroicons-arrow-top-right-on-square" class="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </div>
              <p class="text-sm text-gray-600 dark:text-gray-400 mb-1">Status: {{ task.status }}</p>
              <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">Type: {{ task.dataType }}</p>
              <img v-if="task.dataType.includes('image')" :src="task.dataUrl" class="w-full h-32 object-cover mt-2 rounded" />
              <div class="mt-3 flex items-center text-sm text-blue-600 dark:text-blue-400">
                <UIcon name="i-heroicons-pencil" class="w-4 h-4 mr-1" />
                Click to continue annotation
              </div>
            </div>
          </div>
        </div>

        <!-- Completed Tab -->
        <div v-if="activeTab === 'completed'">
          <div v-if="tasks.completed.length === 0" class="text-center py-12">
            <UIcon name="i-heroicons-check-circle" class="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">No Completed Tasks</h3>
            <p class="text-gray-500 dark:text-gray-400">Completed tasks will appear here.</p>
          </div>          <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div v-for="task in tasks.completed" :key="task.id" class="border border-purple-500 p-4 rounded">
              <h4>Task {{ task.id }}</h4>
              <p>Status: {{ task.status }}</p>
              <p>Type: {{ task.dataType }}</p>
              <img v-if="task.dataType.includes('image')" :src="task.dataUrl" class="w-full h-32 object-cover mt-2" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuth } from '~/composables/useAuth'

interface Task {
  id: number
  projectId: number
  dataUrl: string
  dataType: string
  status: 'unassigned' | 'annotating' | 'completed'
  assignedTo: number | null
  metadata: string
  priority: number
  createdAt: number
  updatedAt: number
}

interface TasksResponse {
  data: {
    unassigned: Task[]
    annotating: Task[]
    completed: Task[]
  }
}

// Props
const props = defineProps<{
  projectId: string
}>()

// Reactive state
const loading = ref(false)
const error = ref<string | null>(null)
const tasks = ref<TasksResponse['data'] | null>(null)
const activeTab = ref<'unassigned' | 'annotating' | 'completed'>('unassigned')
const selectedTasks = ref<number[]>([])
const assignLoading = ref(false)

// Tab configuration
const tabs = [
  {
    key: 'unassigned' as const,
    label: 'Unassigned',
    icon: 'i-heroicons-clock'
  },
  {
    key: 'annotating' as const,
    label: 'Annotating',
    icon: 'i-heroicons-pencil'
  },
  {
    key: 'completed' as const,
    label: 'Completed',
    icon: 'i-heroicons-check-circle'
  }
]

// Computed
const getTaskCount = (tabKey: string) => {
  if (!tasks.value) return 0
  return tasks.value[tabKey as keyof typeof tasks.value]?.length || 0
}

// Auth
const { isAuthenticated } = useAuth()
const token = useCookie('auth_token')

// Methods
const fetchTasks = async () => {
  try {
    loading.value = true
    error.value = null
    
    if (!token.value) {
      throw new Error('Authentication required')
    }
    
    console.log('Fetching tasks for project:', props.projectId)
    console.log('Using token:', token.value ? 'Token exists' : 'No token')
    
    const response = await $fetch<TasksResponse>(`http://localhost:8787/api/tasks/project/${props.projectId}`, {
      headers: {
        'Authorization': `Bearer ${token.value}`
      }
    })
    
    console.log('API Response:', response)
    tasks.value = response.data
    console.log('Tasks set to:', tasks.value)
    
  } catch (err) {
    console.error('Error fetching tasks:', err)
    error.value = err instanceof Error ? err.message : 'Failed to fetch tasks'
  } finally {
    loading.value = false
  }
}

const refreshTasks = () => {
  fetchTasks()
}

// Task selection methods
const toggleTaskSelection = (taskId: number) => {
  const index = selectedTasks.value.indexOf(taskId)
  if (index > -1) {
    selectedTasks.value.splice(index, 1)
  } else {
    selectedTasks.value.push(taskId)
  }
}

const assignSelectedTasks = async () => {
  if (selectedTasks.value.length === 0) return
  
  try {
    assignLoading.value = true
    
    if (!token.value) {
      throw new Error('Authentication required')
    }
    
    const response = await $fetch('http://localhost:8787/api/tasks/update', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token.value}`,
        'Content-Type': 'application/json'
      },
      body: {
        taskId: selectedTasks.value,
        status: 'annotating'
      }
    })
    
    console.log('Tasks assigned successfully:', response)
    
    // Clear selection and refresh tasks
    selectedTasks.value = []
    await fetchTasks()
    
  } catch (err) {
    console.error('Error assigning tasks:', err)
    error.value = err instanceof Error ? err.message : 'Failed to assign tasks'
  } finally {
    assignLoading.value = false
  }
}

// Task actions
const handleAssignTask = (task: Task) => {
  // TODO: Implement task assignment logic
  console.log('Assign task:', task.id)
}

const handleViewTask = (task: Task) => {
  // TODO: Implement task viewing logic
  console.log('View task:', task.id)
}

const handleContinueTask = (task: Task) => {
  // TODO: Implement continue annotation logic
  console.log('Continue task:', task.id)
}

const handleReviewTask = (task: Task) => {
  // TODO: Implement task review logic
  console.log('Review task:', task.id)
}

const navigateToAnnotate = (taskId: number) => {
  const router = useRouter()
  router.push(`/annotate/${taskId}`)
}

// Lifecycle
onMounted(() => {
  fetchTasks()
})

// Watch for project ID changes
watch(() => props.projectId, () => {
  if (props.projectId) {
    fetchTasks()
  }
}, { immediate: true })
</script>