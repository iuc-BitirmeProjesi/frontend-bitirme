<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Loading State -->
      <div v-if="loading" class="flex flex-col justify-center items-center min-h-[400px] py-8 space-y-3">
        <ULoading />
        <p class="text-gray-600 dark:text-gray-300 font-medium">Loading organization details...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center py-8">
        <div class="mx-auto max-w-md">
          <h3 class="text-2xl font-semibold text-red-600 mb-4">Error Loading Organization</h3>
          <p class="text-gray-500 mb-6">{{ error }}</p>
          <UButton @click="refreshData" color="primary">Try Again</UButton>
        </div>
      </div>

      <!-- Main Content -->
      <div v-else>
        <!-- Organization Header -->
        <div v-if="organization" class="bg-white dark:bg-gray-800 rounded-lg shadow-md mb-8 overflow-hidden">
          <div class="h-3 bg-secondary"></div>
          <div class="p-8">
            <div class="flex items-start justify-between">
              <div class="flex items-center space-x-6">
                <div v-if="organization.organizations.logo" class="flex-shrink-0">
                  <img 
                    :src="organization.organizations.logo" 
                    :alt="`${organization.organizations.name} logo`"
                    class="w-20 h-20 rounded-full object-cover border-4 border-gray-200 dark:border-gray-600"
                  />
                </div>
                <div v-else class="flex-shrink-0">
                  <div class="w-20 h-20 rounded-full bg-secondary/20 flex items-center justify-center border-4 border-gray-200 dark:border-gray-600">
                    <UIcon name="i-heroicons-building-office" class="w-8 h-8 text-secondary" />
                  </div>
                </div>
                
                <div class="flex-1">
                  <div class="flex items-center space-x-3 mb-2">
                    <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
                      {{ organization.organizations.name }}
                    </h1>
                    <UBadge v-if="organization.organizations.isActiveOrg" color="success" variant="subtle">
                      Active
                    </UBadge>
                  </div>
                  <p v-if="organization.organizations.description" class="text-gray-600 dark:text-gray-300 text-lg mb-4">
                    {{ organization.organizations.description }}
                  </p>
                  <div class="flex items-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
                    <span class="flex items-center space-x-1">
                      <UIcon name="i-heroicons-calendar" class="w-4 h-4" />
                      <span>Created {{ formatDate(organization.organizations.createdAt) }}</span>
                    </span>
                    <span class="flex items-center space-x-1">
                      <UIcon name="i-heroicons-identification" class="w-4 h-4" />
                      <span>Organization ID: {{ organization.organizations.id }}</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Projects Section -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <div class="p-8">
            <div class="flex justify-between items-center mb-6">
              <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Projects</h2>
              <UBadge color="primary" variant="subtle">
                {{ projects.length }} {{ projects.length === 1 ? 'Project' : 'Projects' }}
              </UBadge>
            </div>

            <!-- Projects Loading -->
            <div v-if="projectsLoading" class="flex flex-col justify-center items-center py-12 space-y-3">
              <ULoading />
              <p class="text-gray-600 dark:text-gray-300 font-medium">Loading projects...</p>
            </div>

            <!-- No Projects State -->
            <div v-else-if="projects.length === 0" class="text-center py-12">
              <div class="mx-auto max-w-md">
                <div class="w-24 h-24 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mx-auto mb-6">
                  <UIcon name="i-heroicons-folder-plus" class="w-12 h-12 text-gray-400" />
                </div>
                <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-3">No Projects Yet</h3>
                <p class="text-gray-600 dark:text-gray-300 mb-6">
                  Get started by creating your first project for this organization.
                </p>
                <UButton 
                  color="secondary" 
                  size="lg"
                  icon="i-heroicons-plus"
                  class="cursor-pointer"
                >
                  Create Project
                </UButton>
              </div>
            </div>

            <!-- Projects Grid -->
            <div v-else class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <div 
                v-for="project in projects" 
                :key="project.id"
                class="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 hover:bg-gray-100 dark:hover:bg-gray-600 transition-all duration-200 cursor-pointer border border-gray-200 dark:border-gray-600"
              >
                <div class="flex items-start justify-between mb-4">
                  <div class="flex-1">
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2 truncate">
                      {{ project.name }}
                    </h3>
                    <p v-if="project.description" class="text-gray-600 dark:text-gray-300 text-sm line-clamp-2 mb-3">
                      {{ project.description }}
                    </p>
                  </div>
                  <UBadge 
                  
                    :color="getProjectTypeColor(project.projectType)" 
                    variant="subtle"
                    class="ml-2 flex-shrink-0"
                  >
                    Type {{ project.projectType }}
                  </UBadge>
                </div>
                
                <div class="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                  <span class="flex items-center space-x-1">
                    <UIcon name="i-heroicons-calendar" class="w-3 h-3" />
                    <span>{{ formatDate(project.createdAt) }}</span>
                  </span>
                  <span class="flex items-center space-x-1">
                    <UIcon name="i-heroicons-user" class="w-3 h-3" />
                    <span>Role {{ project.roleId }}</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Organization {
  organizations: {
    id: number
    ownerId: number
    name: string
    logo: string
    description: string
    isActiveOrg: boolean
    createdAt: number
    updatedAt: number
  }
  organization_relations: {
    id: number
    userId: number
    organizationId: number
    roleId: number
    createdAt: number
    updatedAt: number
  }
}

interface Project {
  id: number
  organizationId: number
  organizationName: string
  organizationLogo: string
  name: string
  description: string
  projectType: number
  roleId: number
  createdAt: number
  updatedAt: number
}

// Get route parameters
const route = useRoute()
const organizationId = route.params.id

// Auth composable
const { isAuthenticated } = useAuth()

// Reactive state
const organization = ref<Organization | null>(null)
const projects = ref<Project[]>([])
const loading = ref(true)
const projectsLoading = ref(true)
const error = ref<string | null>(null)

// Token for API requests
const token = useCookie('auth_token')

// Fetch organization details
const fetchOrganization = async () => {
  try {
    const response = await fetch(`http://localhost:8787/api/organizations/${organizationId}`, {
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
      organization.value = data.data[0]
    } else {
      throw new Error('Organization not found')
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to load organization'
    console.error('Error fetching organization:', err)
  } finally {
    loading.value = false
  }
}

// Fetch projects
const fetchProjects = async () => {
  try {
    projectsLoading.value = true
    const response = await fetch('http://localhost:8787/api/projects/all', {
      headers: {
        'Authorization': `Bearer ${token.value}`,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch projects: ${response.statusText}`)
    }

    const data = await response.json()
      // Filter projects for this organization
    if (data.data) {
      projects.value = data.data.filter((project: Project) => 
        project.organizationId === Number.parseInt(organizationId as string)
      )
    }
  } catch (err) {
    console.error('Error fetching projects:', err)
    // Don't set error state for projects, just log it
  } finally {
    projectsLoading.value = false
  }
}

// Refresh all data
const refreshData = async () => {
  loading.value = true
  projectsLoading.value = true
  error.value = null
  
  await Promise.all([
    fetchOrganization(),
    fetchProjects()
  ])
}

// Utility functions
const formatDate = (timestamp: number) => {
  return new Date(timestamp * 1000).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const getProjectTypeColor = (type: number) => {
  const colors = ['primary', 'secondary', 'success', 'warning', 'error']
  return colors[type % colors.length] || 'primary'
}

// Middleware to check authentication
definePageMeta({
  middleware: 'auth',
  layout: 'organization'
})

// Initialize data on mount
onMounted(async () => {
  if (!isAuthenticated.value) {
    await navigateTo('/login')
    return
  }
  
  await refreshData()
})

// SEO
useSeoMeta({
  title: () => organization.value ? `${organization.value.organizations.name} - Organization Details` : 'Organization Details',
  description: () => organization.value?.organizations.description || 'View organization details and projects'
})


</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>