<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Header -->
      <div class="mb-8">
        <div class="flex items-center space-x-4 mb-4">
          <UButton
            icon="i-heroicons-arrow-left"
            variant="ghost"
            @click="goBack"
            class="flex-shrink-0"
          >
            Back
          </UButton>
          <div>
            <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Create New Project</h1>
            <p class="text-gray-600 dark:text-gray-400 mt-1">
              Create a new project for {{ organizationName || 'your organization' }}
            </p>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex flex-col justify-center items-center py-12 space-y-3">
        <USpinner size="lg" />
        <p class="text-gray-600 dark:text-gray-300 font-medium">Loading...</p>
      </div>

      <!-- Error State -->
      <UAlert
        v-else-if="error"
        color="error"
        variant="subtle"
        :title="error"
        icon="i-heroicons-exclamation-triangle"
        class="mb-6"
      />

      <!-- Main Content -->
      <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Form Section -->
      <div class="lg:col-span-2">
        <UCard>
          <template #header>
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white">Project Details</h2>
          </template>          <UForm 
            :state="projectForm" 
            @submit="createProject"
            class="space-y-8"
          >
            <!-- Project Name -->
            <div class="space-y-2">
              <UFormGroup label="Project Name" name="name" required>
                <UInput
                  v-model="projectForm.name"
                  placeholder="Enter a descriptive name for your project"
                  size="lg"
                  icon="i-heroicons-folder"
                  :disabled="creating"
                  class="w-full"
                />
              </UFormGroup>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                Choose a clear, descriptive name that helps identify your project
              </p>
            </div>

            <!-- Project Description -->
            <div class="space-y-2">
              <UFormGroup label="Description" name="description">
                <UTextarea
                  v-model="projectForm.description"
                  placeholder="Provide a detailed description of your project goals, scope, and objectives..."
                  :rows="5"
                  size="lg"
                  :disabled="creating"
                  class="w-full"
                />
              </UFormGroup>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                Describe what this project aims to achieve and its main objectives
              </p>
            </div>

            <!-- Project Type -->
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Project Type <span class="text-red-500">*</span>
                </label>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <!-- Classification Widget -->
                  <div 
                    @click="selectProjectType(1)"
                    :class="[
                      'relative p-6 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:shadow-md',
                      projectForm.projectType === 1 
                        ? 'border-primary bg-primary/5 ring-2 ring-primary/20' 
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    ]"
                  >
                    <div class="flex items-start space-x-3">
                      <div :class="[
                        'w-12 h-12 rounded-lg flex items-center justify-center',
                        projectForm.projectType === 1 
                          ? 'bg-primary text-white' 
                          : 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                      ]">
                        <UIcon name="i-heroicons-squares-2x2" class="w-6 h-6" />
                      </div>
                      <div class="flex-1">
                        <h3 class="font-semibold text-gray-900 dark:text-white mb-1">
                          Classification
                        </h3>
                        <p class="text-sm text-gray-600 dark:text-gray-400">
                          Categorize and classify data into predefined categories or labels
                        </p>
                      </div>
                    </div>
                    <!-- Selection indicator -->
                    <div v-if="projectForm.projectType === 1" 
                         class="absolute top-3 right-3">
                      <div class="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                        <UIcon name="i-heroicons-check" class="w-4 h-4 text-white" />
                      </div>
                    </div>
                  </div>

                  <!-- Object Detection Widget -->
                  <div 
                    @click="selectProjectType(2)"
                    :class="[
                      'relative p-6 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:shadow-md',
                      projectForm.projectType === 2 
                        ? 'border-primary bg-primary/5 ring-2 ring-primary/20' 
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    ]"
                  >
                    <div class="flex items-start space-x-3">
                      <div :class="[
                        'w-12 h-12 rounded-lg flex items-center justify-center',
                        projectForm.projectType === 2 
                          ? 'bg-primary text-white' 
                          : 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                      ]">
                        <UIcon name="i-heroicons-viewfinder-circle" class="w-6 h-6" />
                      </div>
                      <div class="flex-1">
                        <h3 class="font-semibold text-gray-900 dark:text-white mb-1">
                          Object Detection
                        </h3>
                        <p class="text-sm text-gray-600 dark:text-gray-400">
                          Identify and locate objects within images or video content
                        </p>
                      </div>
                    </div>
                    <!-- Selection indicator -->
                    <div v-if="projectForm.projectType === 2" 
                         class="absolute top-3 right-3">
                      <div class="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                        <UIcon name="i-heroicons-check" class="w-4 h-4 text-white" />
                      </div>
                    </div>
                  </div>

                  <!-- Data Analysis Widget -->
                  <div 
                    @click="selectProjectType(3)"
                    :class="[
                      'relative p-6 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:shadow-md md:col-span-2',
                      projectForm.projectType === 3 
                        ? 'border-primary bg-primary/5 ring-2 ring-primary/20' 
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    ]"
                  >
                    <div class="flex items-start space-x-3">
                      <div :class="[
                        'w-12 h-12 rounded-lg flex items-center justify-center',
                        projectForm.projectType === 3 
                          ? 'bg-primary text-white' 
                          : 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'
                      ]">
                        <UIcon name="i-heroicons-chart-bar" class="w-6 h-6" />
                      </div>
                      <div class="flex-1">
                        <h3 class="font-semibold text-gray-900 dark:text-white mb-1">
                          Data Analysis
                        </h3>
                        <p class="text-sm text-gray-600 dark:text-gray-400">
                          Analyze and extract insights from structured or unstructured data sets
                        </p>
                      </div>
                    </div>
                    <!-- Selection indicator -->
                    <div v-if="projectForm.projectType === 3" 
                         class="absolute top-3 right-3">
                      <div class="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                        <UIcon name="i-heroicons-check" class="w-4 h-4 text-white" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                Select the type that best matches your project's main objective
              </p>
            </div>

            <!-- Form Actions -->
            <div class="flex justify-end space-x-3 pt-6">
              <UButton
                type="button"
                color="secondary"
                variant="ghost"
                @click="goBack"
                :disabled="creating"
              >
                Cancel
              </UButton>
              <UButton
                type="submit"
                color="primary"
                :loading="creating"
                icon="i-heroicons-plus"
              >
                Create Project
              </UButton>
            </div>
          </UForm>
        </UCard>
      </div>

      <!-- Preview/Info Section -->
      <div class="lg:col-span-1">
        <UCard>
          <template #header>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Project Preview</h3>
          </template>

          <div class="space-y-4">
            <!-- Organization Info -->
            <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div class="flex items-center space-x-3">
                <div class="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <UIcon name="i-heroicons-building-office" class="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p class="font-medium text-gray-900 dark:text-white">{{ organizationName || 'Organization' }}</p>
                  <p class="text-sm text-gray-500 dark:text-gray-400">ID: {{ organizationId }}</p>
                </div>
              </div>
            </div>

            <!-- Project Preview -->
            <div class="space-y-3">
              <div>
                <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
                <p class="text-gray-900 dark:text-white">{{ projectForm.name || 'Project name will appear here' }}</p>
              </div>
              
              <div>
                <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                <p class="text-gray-900 dark:text-white text-sm">
                  {{ projectForm.description || 'Project description will appear here' }}
                </p>
              </div>
                <div>
                <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Type</label>
                <div class="flex items-center space-x-2 mt-1">
                  <div v-if="selectedProjectType" :class="[
                    'w-8 h-8 rounded-lg flex items-center justify-center',
                    projectForm.projectType === 1 ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' :
                    projectForm.projectType === 2 ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' :
                    'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'
                  ]">
                    <UIcon :name="getProjectTypeIcon(projectForm.projectType)" class="w-4 h-4" />
                  </div>
                  <div>
                    <p class="text-gray-900 dark:text-white font-medium">
                      {{ selectedProjectType?.label || 'Select a project type' }}
                    </p>
                    <p v-if="selectedProjectType" class="text-xs text-gray-500 dark:text-gray-400">
                      {{ selectedProjectType.description }}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Tips -->
            <div class="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div class="flex items-start space-x-2">
                <UIcon name="i-heroicons-light-bulb" class="w-5 h-5 text-blue-500 mt-0.5" />
                <div>
                  <h4 class="text-sm font-medium text-blue-900 dark:text-blue-200 mb-1">Tips</h4>
                  <ul class="text-xs text-blue-700 dark:text-blue-300 space-y-1">
                    <li>• Choose a descriptive name for your project</li>
                    <li>• Add a clear description to help team members understand the project goals</li>
                    <li>• Select the appropriate project type for better organization</li>
                  </ul>
                </div>
              </div>            </div>
          </div>
        </UCard>
      </div>
    </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Define page meta
definePageMeta({
  layout: 'homepage'
})

// Route and query parameters
const route = useRoute()
const router = useRouter()
const organizationId = computed(() => route.query.organizationId as string)

// Auth
const { isAuthenticated } = useAuth()
const token = useCookie('auth_token')
const toast = useToast()

// Reactive state
const loading = ref(true)
const creating = ref(false)
const error = ref<string | null>(null)
const organizationName = ref<string>('')

// Form state
const projectForm = reactive({
  name: '',
  description: '',
  projectType: 1
})

// Project type options
const projectTypes = [
  { label: 'Classification', value: 1, description: 'Categorize and classify data into predefined categories or labels' },
  { label: 'Object Detection', value: 2, description: 'Identify and locate objects within images or video content' },
  { label: 'Data Analysis', value: 3, description: 'Analyze and extract insights from structured or unstructured data sets' }
]

// Computed
const selectedProjectType = computed(() => {
  return projectTypes.find(type => type.value === projectForm.projectType)
})

// Methods
const selectProjectType = (type: number) => {
  if (!creating.value) {
    projectForm.projectType = type
  }
}

const getProjectTypeIcon = (type: number) => {
  switch (type) {
    case 1: return 'i-heroicons-squares-2x2'
    case 2: return 'i-heroicons-viewfinder-circle'
    case 3: return 'i-heroicons-chart-bar'
    default: return 'i-heroicons-folder'
  }
}

const fetchOrganizationInfo = async () => {
  if (!organizationId.value) {
    error.value = 'Organization ID is required'
    return
  }

  try {
    const response = await fetch(`http://localhost:8787/api/organizations/${organizationId.value}`, {
      headers: {
        'Authorization': `Bearer ${token.value}`,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch organization: ${response.statusText}`)
    }

    const data = await response.json()
    
    if (data.data && data.data.length > 0) {
      organizationName.value = data.data[0].organizations.name
    } else {
      throw new Error('Organization not found')
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to load organization'
    console.error('Error fetching organization:', err)
  }
}

const createProject = async () => {
  if (!organizationId.value) {
    error.value = 'Organization ID is required'
    return
  }

  // Simple validation
  if (!projectForm.name.trim()) {
    error.value = 'Project name is required'
    return
  }

  if (projectForm.name.length > 100) {
    error.value = 'Project name must be less than 100 characters'
    return
  }

  if (projectForm.description && projectForm.description.length > 500) {
    error.value = 'Description must be less than 500 characters'
    return
  }

  creating.value = true
  error.value = null

  try {
    const projectData = {
      organizationId: Number.parseInt(organizationId.value),
      name: projectForm.name,
      description: projectForm.description,
      projectType: projectForm.projectType
    }

    const response = await fetch('http://localhost:8787/api/projects', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token.value}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(projectData)
    })

    if (!response.ok) {
      const errorData = await response.text()
      throw new Error(`Failed to create project: ${response.statusText} - ${errorData}`)
    }

    const result = await response.json()
    
    // Success! Navigate back to organization projects
    toast.add({
      title: 'Project Created',
      description: `Project "${projectForm.name}" has been created successfully`,
      color: 'success'
    })

    // Navigate back to organization page
    await navigateTo(`/organizations/${organizationId.value}?section=projects`)
    
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to create project'
    console.error('Error creating project:', err)
  } finally {
    creating.value = false
  }
}

const goBack = () => {
  if (organizationId.value) {
    navigateTo(`/organizations/${organizationId.value}?section=projects`)
  } else {
    navigateTo('/homepage')
  }
}

// Lifecycle
onMounted(async () => {
  // Check authentication
  if (!isAuthenticated.value) {
    await navigateTo('/login')
    return
  }

  // Check if organization ID is provided
  if (!organizationId.value) {
    error.value = 'Organization ID is required. Please access this page from an organization.'
    loading.value = false
    return
  }

  try {
    await fetchOrganizationInfo()
  } finally {
    loading.value = false
  }
})

// SEO
useSeoMeta({
  title: 'Create New Project',
  description: 'Create a new project for your organization'
})
</script>
