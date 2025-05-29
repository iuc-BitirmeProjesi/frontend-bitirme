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
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
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

      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
            <UIcon name="i-heroicons-key" class="w-6 h-6 text-purple-600 dark:text-purple-400" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-300">Custom Roles</p>
            <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ customRoles }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters and Search -->
    <div class="flex flex-col sm:flex-row gap-4">
      <div class="flex-1">
        <UInput
          v-model="searchQuery"
          icon="i-heroicons-magnifying-glass"
          placeholder="Search roles..."
          class="w-full"
        />
      </div>
      <USelect
        v-model="filterType"
        :options="roleTypeOptions"
        placeholder="Filter by type"
        class="w-full sm:w-48"
      />
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

      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Role
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Type
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
          </thead>
          <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-for="role in filteredRoles" :key="role.id" class="hover:bg-gray-50 dark:hover:bg-gray-700">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="p-2 bg-primary/10 rounded-lg mr-3">
                    <UIcon :name="getRoleIcon(role.type)" class="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <div class="text-sm font-medium text-gray-900 dark:text-white">{{ role.name }}</div>
                    <div class="text-sm text-gray-500 dark:text-gray-400">{{ role.description }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <UBadge :color="getRoleTypeColor(role.type)" variant="subtle">
                  {{ role.type }}
                </UBadge>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex flex-wrap gap-1">
                  <UBadge 
                    v-for="permission in getPermissionsList(role.permissions)" 
                    :key="permission"
                    color="gray" 
                    variant="outline" 
                    size="xs"
                  >
                    {{ permission }}
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
                  <UButton color="gray" variant="ghost" icon="i-heroicons-ellipsis-horizontal" />
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
          
          <UFormGroup label="Role Type" required>
            <USelect v-model="newRole.type" :options="roleTypeOptions" />
          </UFormGroup>
          
          <UFormGroup label="Permissions">
            <div class="grid grid-cols-2 gap-2">
              <UCheckbox 
                v-for="permission in availablePermissions" 
                :key="permission.value"
                v-model="newRole.permissions"
                :value="permission.value"
                :label="permission.label"
              />
            </div>
          </UFormGroup>
        </div>

        <template #footer>
          <div class="flex justify-end gap-3">
            <UButton color="gray" variant="ghost" @click="showCreateRole = false">
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
  type: 'Admin' | 'Manager' | 'Member' | 'Custom'
  permissions: string[]
  memberCount?: number
  createdAt: number
}

// Reactive state
const roles = ref<Role[]>([])
const loading = ref(true)
const creating = ref(false)
const searchQuery = ref('')
const filterType = ref('')
const showCreateRole = ref(false)

const newRole = ref({
  name: '',
  description: '',
  type: 'Custom',
  permissions: [] as string[]
})

// Options
const roleTypeOptions = [
  { label: 'All Types', value: '' },
  { label: 'Admin', value: 'Admin' },
  { label: 'Manager', value: 'Manager' },
  { label: 'Member', value: 'Member' },
  { label: 'Custom', value: 'Custom' }
]

const availablePermissions = [
  { label: 'Read Projects', value: 'read_projects' },
  { label: 'Create Projects', value: 'create_projects' },
  { label: 'Edit Projects', value: 'edit_projects' },
  { label: 'Delete Projects', value: 'delete_projects' },
  { label: 'Manage Users', value: 'manage_users' },
  { label: 'Manage Roles', value: 'manage_roles' },
  { label: 'Organization Settings', value: 'org_settings' },
  { label: 'View Analytics', value: 'view_analytics' }
]

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

  if (filterType.value) {
    filtered = filtered.filter(role => role.type === filterType.value)
  }

  return filtered
})

const activeRoles = computed(() => roles.value.length)
const customRoles = computed(() => roles.value.filter(role => role.type === 'Custom').length)

// Methods
const fetchRoles = async () => {
  loading.value = true
  try {
    // Mock data for now
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    roles.value = [
      {
        id: 1,
        name: 'Organization Admin',
        description: 'Full access to organization settings and management',
        type: 'Admin',
        permissions: ['read_projects', 'create_projects', 'edit_projects', 'delete_projects', 'manage_users', 'manage_roles', 'org_settings', 'view_analytics'],
        memberCount: 2,
        createdAt: Date.now() / 1000 - 86400 * 30
      },
      {
        id: 2,
        name: 'Project Manager',
        description: 'Can manage projects and team members',
        type: 'Manager',
        permissions: ['read_projects', 'create_projects', 'edit_projects', 'manage_users', 'view_analytics'],
        memberCount: 5,
        createdAt: Date.now() / 1000 - 86400 * 15
      },
      {
        id: 3,
        name: 'Team Member',
        description: 'Standard team member with project access',
        type: 'Member',
        permissions: ['read_projects', 'create_projects'],
        memberCount: 12,
        createdAt: Date.now() / 1000 - 86400 * 7
      }
    ]
  } catch (error) {
    console.error('Error fetching roles:', error)
  } finally {
    loading.value = false
  }
}

const createRole = async () => {
  creating.value = true
  try {
    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const role: Role = {
      id: Date.now(),
      name: newRole.value.name,
      description: newRole.value.description,
      type: newRole.value.type as Role['type'],
      permissions: newRole.value.permissions,
      memberCount: 0,
      createdAt: Date.now() / 1000
    }
    
    roles.value.push(role)
    showCreateRole.value = false
    
    // Reset form
    newRole.value = {
      name: '',
      description: '',
      type: 'Custom',
      permissions: []
    }
  } catch (error) {
    console.error('Error creating role:', error)
  } finally {
    creating.value = false
  }
}

const getRoleIcon = (type: string) => {
  const icons = {
    'Admin': 'i-heroicons-crown',
    'Manager': 'i-heroicons-briefcase',
    'Member': 'i-heroicons-user',
    'Custom': 'i-heroicons-cog-6-tooth'
  }
  return icons[type as keyof typeof icons] || 'i-heroicons-user'
}

const getRoleTypeColor = (type: string): 'primary' | 'secondary' | 'success' | 'warning' | 'error' => {
  const colors = {
    'Admin': 'error' as const,
    'Manager': 'warning' as const,
    'Member': 'success' as const,
    'Custom': 'primary' as const
  }
  return colors[type as keyof typeof colors] || 'primary'
}

const getPermissionsList = (permissions: string[]) => {
  return permissions.slice(0, 3).map(p => {
    const permission = availablePermissions.find(ap => ap.value === p)
    return permission?.label || p
  })
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
</script>
