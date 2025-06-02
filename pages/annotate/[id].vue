<template>
  <div class="flex h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Side Menu -->
    <div class="w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 overflow-y-auto">
      <div class="p-6 border-b border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-between">
          <h1 class="text-xl font-semibold text-gray-900 dark:text-white">
            Task Annotation
          </h1>
          <UButton
            @click="navigateBack"
            variant="ghost"
            size="sm"
            icon="i-heroicons-arrow-left"
          >
            Back
          </UButton>
        </div>
        <p class="text-sm text-gray-600 dark:text-gray-400 mt-2">
          Task ID: {{ taskId }}
        </p>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="p-6">
        <div class="animate-pulse space-y-4">
          <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
          <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
          <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="p-6">
        <div class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <div class="flex items-center">
            <UIcon name="i-heroicons-exclamation-circle" class="w-5 h-5 text-red-600 dark:text-red-400 mr-2" />
            <p class="text-red-800 dark:text-red-300 text-sm">{{ error }}</p>
          </div>
        </div>
      </div>

      <!-- Content -->
      <div v-else class="space-y-6 p-6">
        <!-- Attributes Section -->
        <div v-if="taskData">
          <h2 class="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
            <UIcon name="i-heroicons-document-text" class="w-5 h-5 mr-2" />
            Attributes
          </h2>
          
          <div class="space-y-3">
            <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <div class="space-y-3">
                <div>
                  <label class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Task ID</label>
                  <p class="mt-1 text-sm text-gray-900 dark:text-white">{{ taskData.id }}</p>
                </div>
                
                <div>
                  <label class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Project ID</label>
                  <p class="mt-1 text-sm text-gray-900 dark:text-white">{{ taskData.projectId }}</p>
                </div>
                
                <div>
                  <label class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Status</label>
                  <p class="mt-1">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                          :class="getStatusColor(taskData.status)">
                      {{ taskData.status }}
                    </span>
                  </p>
                </div>
                
                <div>
                  <label class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Data Type</label>
                  <p class="mt-1 text-sm text-gray-900 dark:text-white">{{ parseDataType(taskData.dataType) }}</p>
                </div>
                
                <div>
                  <label class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Priority</label>
                  <p class="mt-1 text-sm text-gray-900 dark:text-white">{{ taskData.priority }}</p>
                </div>
                
                <div>
                  <label class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Created At</label>
                  <p class="mt-1 text-sm text-gray-900 dark:text-white">{{ formatDate(taskData.createdAt) }}</p>
                </div>
                
                <div>
                  <label class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Updated At</label>
                  <p class="mt-1 text-sm text-gray-900 dark:text-white">{{ formatDate(taskData.updatedAt) }}</p>
                </div>
              </div>
            </div>

            <!-- Metadata Section -->
            <div v-if="parsedMetadata" class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <h3 class="text-sm font-medium text-gray-900 dark:text-white mb-2">Metadata</h3>
              <div class="space-y-2">
                <div v-if="parsedMetadata.originalFileName">
                  <label class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Original File</label>
                  <p class="mt-1 text-sm text-gray-900 dark:text-white">{{ parsedMetadata.originalFileName }}</p>
                </div>
                <div v-if="parsedMetadata.mimeType">
                  <label class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">MIME Type</label>
                  <p class="mt-1 text-sm text-gray-900 dark:text-white">{{ parsedMetadata.mimeType }}</p>
                </div>
                <div v-if="parsedMetadata.uuid">
                  <label class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">UUID</label>
                  <p class="mt-1 text-xs text-gray-600 dark:text-gray-300 font-mono">{{ parsedMetadata.uuid }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Annotations Section -->
        <div>
          <h2 class="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
            <UIcon name="i-heroicons-annotation" class="w-5 h-5 mr-2" />
            Annotations
            <span class="ml-2 px-2 py-1 text-xs rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300">
              {{ annotations.length }}
            </span>
          </h2>
          
          <!-- No annotations state -->
          <div v-if="annotations.length === 0" class="text-center py-8">
            <UIcon name="i-heroicons-document-plus" class="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 class="text-sm font-medium text-gray-900 dark:text-white mb-2">No Annotations</h3>
            <p class="text-xs text-gray-500 dark:text-gray-400">Start annotating to see your work here.</p>
          </div>

          <!-- Annotations list -->
          <div v-else class="space-y-4">
            <div v-for="annotation in annotations" :key="annotation.id" 
                 class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
              <div class="flex items-start justify-between mb-2">
                <div class="flex items-center space-x-2">
                  <span class="text-sm font-medium text-gray-900 dark:text-white">
                    Annotation #{{ annotation.id }}
                  </span>
                  <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
                        :class="getReviewStatusColor(annotation.reviewStatus)">
                    {{ annotation.reviewStatus }}
                  </span>
                </div>
              </div>
              
              <div class="space-y-2 text-xs">
                <div>
                  <span class="font-medium text-gray-500 dark:text-gray-400">User:</span>
                  <span class="ml-1 text-gray-900 dark:text-white">{{ annotation.userEmail }}</span>
                </div>
                
                <div>
                  <span class="font-medium text-gray-500 dark:text-gray-400">Created:</span>
                  <span class="ml-1 text-gray-900 dark:text-white">{{ formatDate(annotation.createdAt) }}</span>
                </div>
                
                <div v-if="annotation.isGroundTruth" class="flex items-center">
                  <UIcon name="i-heroicons-star" class="w-4 h-4 text-yellow-500 mr-1" />
                  <span class="text-yellow-700 dark:text-yellow-300 font-medium">Ground Truth</span>
                </div>
                
                <div class="mt-3">
                  <span class="font-medium text-gray-500 dark:text-gray-400">Data:</span>
                  <pre class="mt-1 text-xs bg-gray-800 text-green-400 p-2 rounded overflow-x-auto">{{ JSON.stringify(annotation.annotationData, null, 2) }}</pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content Area -->
    <div class="flex-1 flex flex-col">
      <!-- Header -->
      <div class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
        <div class="flex items-center justify-between">
          <h2 class="text-lg font-medium text-gray-900 dark:text-white">
            Annotation Workspace
          </h2>
          <div class="flex items-center space-x-4">
            <UButton variant="outline" size="sm">
              <UIcon name="i-heroicons-arrow-path" class="w-4 h-4 mr-2" />
              Refresh
            </UButton>
            <UButton color="primary" size="sm">
              <UIcon name="i-heroicons-check" class="w-4 h-4 mr-2" />
              Save Annotation
            </UButton>
          </div>
        </div>
      </div>

      <!-- Content Area -->
      <div class="flex-1 p-6 overflow-auto">
        <div v-if="taskData" class="h-full flex items-center justify-center">
          <!-- Image Display -->
          <div v-if="isImageTask" class="max-w-full max-h-full">
            <img 
              :src="taskData.dataUrl" 
              :alt="`Task ${taskData.id}`"
              class="max-w-full max-h-full object-contain border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg"
            />
          </div>
          
          <!-- Placeholder for other data types -->
          <div v-else class="text-center">
            <UIcon name="i-heroicons-document" class="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p class="text-gray-600 dark:text-gray-400">
              Data type: {{ parseDataType(taskData.dataType) }}
            </p>
            <p class="text-sm text-gray-500 dark:text-gray-500 mt-2">
              Annotation interface for this data type will be implemented here.
            </p>
          </div>
        </div>
        
        <!-- Loading state for main content -->
        <div v-else class="h-full flex items-center justify-center">
          <div class="text-center">
            <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
            <p class="text-gray-600 dark:text-gray-400">Loading task data...</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface TaskData {
  id: number
  projectId: number
  dataUrl: string
  dataType: string
  status: string
  assignedTo: number | null
  metadata: string
  priority: number
  createdAt: number
  updatedAt: number
}

interface Annotation {
  id: number
  taskId: number
  userId: number
  projectId: number
  annotationData: any
  isGroundTruth: boolean
  reviewStatus: string
  reviewerId: number | null
  createdAt: number
  updatedAt: number
  userEmail: string
}

interface TaskResponse {
  data: TaskData
}

interface AnnotationsResponse {
  data: Annotation[]
}

// Get route params
const route = useRoute()
const taskId = route.params.id as string

// Reactive state
const loading = ref(true)
const error = ref<string | null>(null)
const taskData = ref<TaskData | null>(null)
const annotations = ref<Annotation[]>([])

// Auth
const token = useCookie('auth_token')

// Computed properties
const isImageTask = computed(() => {
  if (!taskData.value) return false
  return parseDataType(taskData.value.dataType).toLowerCase().includes('image')
})

const parsedMetadata = computed(() => {
  if (!taskData.value?.metadata) return null
  try {
    return JSON.parse(taskData.value.metadata)
  } catch {
    return null
  }
})

// Methods
const fetchTaskData = async () => {
  try {
    if (!token.value) {
      throw new Error('Authentication required')
    }

    const response = await $fetch<TaskResponse>(`http://localhost:8787/api/tasks/${taskId}`, {
      headers: {
        'Authorization': `Bearer ${token.value}`
      }
    })

    taskData.value = response.data
  } catch (err) {
    console.error('Error fetching task data:', err)
    throw err
  }
}

const fetchAnnotations = async () => {
  try {
    if (!token.value) {
      throw new Error('Authentication required')
    }

    const response = await $fetch<AnnotationsResponse>(`http://localhost:8787/api/annotations/task/${taskId}`, {
      headers: {
        'Authorization': `Bearer ${token.value}`
      }
    })

    annotations.value = response.data
  } catch (err) {
    console.error('Error fetching annotations:', err)
    // Don't throw error for annotations, just log it
    annotations.value = []
  }
}

const loadData = async () => {
  try {
    loading.value = true
    error.value = null
    
    // Fetch both task data and annotations
    await Promise.all([
      fetchTaskData(),
      fetchAnnotations()
    ])
    
  } catch (err) {
    console.error('Error loading data:', err)
    error.value = err instanceof Error ? err.message : 'Failed to load data'
  } finally {
    loading.value = false
  }
}

const navigateBack = () => {
  const router = useRouter()
  // Navigate back to the project page
  if (taskData.value) {
    router.push(`/projects/${taskData.value.projectId}`)
  } else {
    router.back()
  }
}

const parseDataType = (dataType: string) => {
  // Remove quotes if present
  return dataType.replace(/"/g, '')
}

const formatDate = (timestamp: number) => {
  return new Date(timestamp * 1000).toLocaleString()
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'unassigned':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300'
    case 'annotating':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300'
    case 'completed':
      return 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900/40 dark:text-gray-300'
  }
}

const getReviewStatusColor = (status: string) => {
  switch (status) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300'
    case 'approved':
      return 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300'
    case 'rejected':
      return 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900/40 dark:text-gray-300'
  }
}

// Set page meta
definePageMeta({
  layout: false
})

// Lifecycle
onMounted(() => {
  loadData()
})
</script>
