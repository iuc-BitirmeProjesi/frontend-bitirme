<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex justify-between items-center">
      <div>
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Roles & Permissions</h2>
        <p class="text-gray-600 dark:text-gray-300 mt-1">Manage organization roles and permissions</p>
      </div>
      <UButton 
        icon="i-heroicons-plus"
        color="primary"
        @click="showCreateRole = true"
      >
        Create Role
      </UButton>
    </div>    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
            <UIcon name="i-heroicons-user-group" class="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-300">Total Roles</p>
            <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ roles.length }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
            <UIcon name="i-heroicons-shield-check" class="w-6 h-6 text-green-600 dark:text-green-400" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-300">Active Roles</p>
            <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ activeRoles }}</p>
          </div>
        </div>
      </div>
    </div>    <!-- Filters and Search -->
    <div class="flex flex-col sm:flex-row gap-4">
      <div class="flex-1">
        <UInput
          v-model="searchQuery"
          icon="i-heroicons-magnifying-glass"
          placeholder="Search roles..."
          class="w-full"
        />
      </div>
    </div>

    <!-- Roles Table -->    <div class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      <div v-if="loading" class="flex justify-center items-center py-12">
        <USpinner size="lg" />
      </div>
      
      <div v-else-if="filteredRoles.length === 0" class="text-center py-12">
        <div class="w-24 h-24 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mx-auto mb-4">
          <UIcon name="i-heroicons-user-group" class="w-12 h-12 text-gray-400" />
        </div>
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">No roles found</h3>
        <p class="text-gray-600 dark:text-gray-300">
          {{ searchQuery ? 'Try adjusting your search criteria' : 'Create your first role to get started' }}
        </p>
      </div>

      <div v-else class="overflow-x-auto">        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Role
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Permissions
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Members
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Created
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>          <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-for="role in filteredRoles" :key="role.id" class="hover:bg-gray-50 dark:hover:bg-gray-700">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="p-2 bg-primary/10 rounded-lg mr-3">
                    <UIcon name="i-heroicons-shield-check" class="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <div class="text-sm font-medium text-gray-900 dark:text-white">{{ role.name }}</div>
                    <div class="text-sm text-gray-500 dark:text-gray-400">{{ role.description }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex flex-wrap gap-1">
                  <UBadge 
                    v-for="permission in getPermissionsList(role.permissionFlags)" 
                    :key="permission"
                    color="secondary" 
                    variant="outline" 
                    size="xs"
                  >
                    {{ permission }}
                  </UBadge>                  <UBadge 
                    v-if="Object.keys(role.permissionFlags).filter(key => role.permissionFlags[key]).length > 3"
                    color="secondary" 
                    variant="outline" 
                    size="xs"
                  >
                    +{{ Object.keys(role.permissionFlags).filter(key => role.permissionFlags[key]).length - 3 }} more
                  </UBadge>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                {{ role.memberCount || 0 }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {{ formatDate(role.createdAt) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <UDropdown :items="getRoleActions(role)">
                  <UButton color="secondary" variant="ghost" icon="i-heroicons-ellipsis-horizontal" />
                </UDropdown>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Create Role Modal -->
    <UModal v-model="showCreateRole">
      <UCard>
        <template #header>
          <h3 class="text-lg font-semibold">Create New Role</h3>
        </template>
          <div class="space-y-4">
          <UFormGroup label="Role Name" required>
            <UInput v-model="newRole.name" placeholder="Enter role name" />
          </UFormGroup>
          
          <UFormGroup label="Description">
            <UTextarea v-model="newRole.description" placeholder="Enter role description" />
          </UFormGroup>
          
          <UFormGroup label="Permissions">
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">Permission management would be implemented here</p>
          </UFormGroup>
        </div>

        <template #footer>
          <div class="flex justify-end gap-3">
            <UButton color="secondary" variant="ghost" @click="showCreateRole = false">
              Cancel
            </UButton>
            <UButton color="primary" @click="createRole" :loading="creating">
              Create Role
            </UButton>
          </div>
        </template>
      </UCard>
    </UModal>
  </div>
</template>

<script setup lang="ts">
interface Role {
  id: number
  name: string
  description: string
  permissionFlags: Record<string, boolean>
  memberCount?: number
  createdAt: number
}

interface Props {
  organizationId: string | number
}

const props = defineProps<Props>()

// Reactive state
const roles = ref<Role[]>([])
const loading = ref(true)
const creating = ref(false)
const searchQuery = ref('')
const showCreateRole = ref(false)

const newRole = ref({
  name: '',
  description: '',
  permissionFlags: {} as Record<string, boolean>
})

// Token for API requests
const token = useCookie('auth_token')

// Computed properties
const filteredRoles = computed(() => {
  let filtered = roles.value

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(role => 
      role.name.toLowerCase().includes(query) ||
      role.description.toLowerCase().includes(query)
    )
  }

  return filtered
})

const activeRoles = computed(() => roles.value.length)

// Methods
const fetchRoles = async () => {
  loading.value = true
  try {
    const res = await $fetch('http://localhost:8787/api/organizationRoles/all', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token.value}`,
        'orgId': String(props.organizationId)
      }
    })
    
    //@ts-ignore
    roles.value = res.data.map((role) => ({
      id: role.id,
      name: role.name,
      description: role.description || '',
      permissionFlags: role.permissionFlags || {},
      memberCount: 0, // This would need to come from API if available
      createdAt: role.createdAt || Date.now() / 1000
    }))
  } catch (error) {
    console.error('Error fetching roles:', error)
  } finally {
    loading.value = false
  }
}

const createRole = async () => {
  creating.value = true
  try {
    // This would be implemented when role creation is needed
    console.log('Create role functionality would go here')
    showCreateRole.value = false
    
    // Reset form
    newRole.value = {
      name: '',
      description: '',
      permissionFlags: {}
    }
  } catch (error) {
    console.error('Error creating role:', error)
  } finally {
    creating.value = false
  }
}

const getPermissionsList = (permissionFlags: Record<string, boolean>) => {
  const enabledPermissions = Object.keys(permissionFlags).filter(key => permissionFlags[key])
  return enabledPermissions.slice(0, 3) // Show only first 3 permissions
}

const getRoleActions = (role: Role) => {
  return [
    [{
      label: 'View Details',
      icon: 'i-heroicons-eye',
      click: () => viewRole(role)
    }],
    [{
      label: 'Edit Role',
      icon: 'i-heroicons-pencil',
      click: () => editRole(role)
    }],
    [{
      label: 'Delete Role',
      icon: 'i-heroicons-trash',
      click: () => deleteRole(role)
    }]
  ]
}

const viewRole = (role: Role) => {
  console.log('View role:', role)
}

const editRole = (role: Role) => {
  console.log('Edit role:', role)
}

const deleteRole = (role: Role) => {
  console.log('Delete role:', role)
}

const formatDate = (timestamp: number) => {
  return new Date(timestamp * 1000).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

// Initialize data
onMounted(() => {
  fetchRoles()
})

// Watch for organization changes
watch(() => props.organizationId, () => {
  fetchRoles()
})
</script>
