<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex justify-between items-center">
      <div>
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Users</h2>
        <p class="text-gray-600 dark:text-gray-400 mt-1">Manage organization members and their access</p>
      </div>
      <UButton color="primary" icon="i-heroicons-plus" @click="toggleInviteModal">
        Invite User
      </UButton>
    </div>    <!-- Invite User Modal -->
    <UModal v-model="showInviteModal">
      <UCard>
        <div class="p-6">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              Invite Users to Organization
            </h3>
            <UButton 
              color="secondary" 
              variant="ghost" 
              icon="i-heroicons-x-mark-20-solid" 
              class="-my-1" 
              @click="showInviteModal = false" 
            />
          </div>
          
          <OrganizationSearchUsers 
            :org-id="String(organizationId)" 
            @users-added="handleUsersAdded"
            ref="searchUsersRef"
          />
        </div>
      </UCard>
    </UModal>

    <!-- Search and Filters -->
    <div class="flex flex-col sm:flex-row gap-4">
      <div class="flex-1">
        <UInput
          v-model="searchQuery"
          icon="i-heroicons-magnifying-glass"
          placeholder="Search users..."
        />
      </div>
      <USelect
        v-model="selectedRole"
        :options="roleOptions"
        placeholder="Filter by role"
      />
    </div><!-- Users Loading -->
    <div v-if="loading" class="flex flex-col justify-center items-center py-12 space-y-3">
      <USpinner size="lg" />
      <p class="text-gray-600 dark:text-gray-300 font-medium">Loading users...</p>
    </div>    <!-- Error State -->
    <UAlert
      v-else-if="error"
      color="error"
      variant="subtle"
      :title="error"
      icon="i-heroicons-exclamation-triangle"
    />

    <!-- No Users State -->
    <div v-else-if="filteredUsers.length === 0 && !searchQuery" class="text-center py-12">
      <div class="mx-auto max-w-md">
        <div class="w-24 h-24 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mx-auto mb-6">
          <UIcon name="i-heroicons-users" class="w-12 h-12 text-gray-400" />
        </div>
        <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-3">No Users Yet</h3>
        <p class="text-gray-600 dark:text-gray-300 mb-6">
          Start building your team by inviting members to this organization.
        </p>        <UButton 
          color="primary" 
          size="lg"
          icon="i-heroicons-plus"
          @click="toggleInviteModal"
        >
          Invite Your First User
        </UButton>
      </div>
    </div>

    <!-- No Search Results -->
    <div v-else-if="filteredUsers.length === 0 && searchQuery" class="text-center py-12">
      <div class="mx-auto max-w-md">
        <UIcon name="i-heroicons-magnifying-glass" class="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">No users found</h3>
        <p class="text-gray-600 dark:text-gray-300">
          Try adjusting your search terms or filters.
        </p>
      </div>
    </div>    <!-- Users List -->
    <div v-else class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white">Organization Members</h3>
      </div>
      
      <div class="divide-y divide-gray-200 dark:divide-gray-700">
        <div 
          v-for="user in filteredUsers" 
          :key="user.id"
          class="px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-4">
              <UAvatar
                :src="user.avatar"
                :alt="user.name"
                size="md"
              />
              <div>
                <div class="font-medium text-gray-900 dark:text-white">{{ user.name }}</div>
                <div class="text-sm text-gray-500 dark:text-gray-400">{{ user.email }}</div>
              </div>
            </div>
            
            <div class="flex items-center space-x-4">
              <UBadge 
                :color="getRoleColor(user.role)" 
                variant="subtle"
              >
                {{ user.role }}
              </UBadge>
              
              <UBadge 
                :color="getStatusColor(user.status)" 
                variant="subtle"
              >
                {{ user.status }}
              </UBadge>
              
              <span class="text-sm text-gray-600 dark:text-gray-400">
                {{ formatLastActive(user.lastActive) }}
              </span>
              
              <UDropdown :items="getUserActions(user)">
                <UButton 
                  color="secondary" 
                  variant="ghost" 
                  icon="i-heroicons-ellipsis-horizontal"
                />
              </UDropdown>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Users Stats -->
    <div v-if="users.length > 0" class="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
      <UCard>
        <div class="text-center">
          <div class="text-2xl font-bold text-primary">{{ users.length }}</div>
          <div class="text-sm text-gray-600 dark:text-gray-400">Total Users</div>
        </div>
      </UCard>
      
      <UCard>
        <div class="text-center">
          <div class="text-2xl font-bold text-success">{{ activeUsers }}</div>
          <div class="text-sm text-gray-600 dark:text-gray-400">Active Users</div>
        </div>
      </UCard>
      
      <UCard>
        <div class="text-center">
          <div class="text-2xl font-bold text-warning">{{ pendingUsers }}</div>
          <div class="text-sm text-gray-600 dark:text-gray-400">Pending Invites</div>
        </div>
      </UCard>
      
      <UCard>
        <div class="text-center">
          <div class="text-2xl font-bold text-info">{{ adminUsers }}</div>
          <div class="text-sm text-gray-600 dark:text-gray-400">Admins</div>
        </div>
      </UCard>
    </div>
  </div>
</template>

<script setup lang="ts">
interface User {
  id: number
  name: string
  email: string
  avatar?: string
  role: string
  status: 'active' | 'pending' | 'inactive'
  lastActive: number
  joinedAt: number
}

interface Props {
  organizationId: string | number
}

const props = defineProps<Props>()

// Reactive state
const users = ref<User[]>([])
const loading = ref(true)
const error = ref<string | null>(null)
const searchQuery = ref('')
const selectedRole = ref<string | null>(null)
const showInviteModal = ref(false)

// Refs
const searchUsersRef = ref()

// Token for API requests
const token = useCookie('auth_token')

// Role options for filter
const roleOptions = [
  { label: 'All Roles', value: null },
  { label: 'Admin', value: 'admin' },
  { label: 'Manager', value: 'manager' },
  { label: 'Member', value: 'member' },
  { label: 'Viewer', value: 'viewer' }
]

// Computed properties
const filteredUsers = computed(() => {
  let filtered = users.value

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(user => 
      user.name.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query)
    )
  }

  if (selectedRole.value) {
    filtered = filtered.filter(user => user.role === selectedRole.value)
  }

  return filtered
})

const activeUsers = computed(() => 
  users.value.filter(user => user.status === 'active').length
)

const pendingUsers = computed(() => 
  users.value.filter(user => user.status === 'pending').length
)

const adminUsers = computed(() => 
  users.value.filter(user => user.role === 'admin').length
)

// Methods
const fetchUsers = async () => {
  try {
    loading.value = true
    error.value = null
    
    const response = await $fetch('http://localhost:8787/api/organizationRelations/users', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token.value}`,
        'orgId': String(props.organizationId)
      }
    })
    
    // @ts-ignore - API response typing
    users.value = response.data || []
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to load users'
    console.error('Error fetching users:', err)
  } finally {
    loading.value = false
  }
}

const toggleInviteModal = () => {
  showInviteModal.value = !showInviteModal.value
}

const handleUsersAdded = async (userDetails: { id: number; email: string; roleId: number }[]) => {
  console.log('Users added:', userDetails)
  showInviteModal.value = false
  
  // Refresh the users list
  await fetchUsers()
  
  // Refresh roles in SearchUsers component if needed
  if (searchUsersRef.value?.refreshRoles) {
    searchUsersRef.value.refreshRoles()
  }
}

const getUserActions = (user: User) => [
  [{
    label: 'View Profile',
    icon: 'i-heroicons-user',
    click: () => viewUser(user.id)
  }, {
    label: 'Edit Role',
    icon: 'i-heroicons-pencil',
    click: () => editUserRole(user.id)
  }],
  [{
    label: 'Remove User',
    icon: 'i-heroicons-trash',
    click: () => removeUser(user.id)
  }]
]

const viewUser = (userId: number) => {
  console.log('View user:', userId)
}

const editUserRole = (userId: number) => {
  console.log('Edit user role:', userId)
}

const removeUser = (userId: number) => {
  console.log('Remove user:', userId)
}

const getRoleColor = (role: string): 'error' | 'primary' | 'secondary' | 'warning' | 'info' => {
  const colors: Record<string, 'error' | 'primary' | 'secondary' | 'warning' | 'info'> = {
    admin: 'error',
    manager: 'warning',
    member: 'primary',
    viewer: 'secondary'
  }
  return colors[role] || 'secondary'
}

const getStatusColor = (status: string): 'success' | 'warning' | 'error' => {
  const colors: Record<string, 'success' | 'warning' | 'error'> = {
    active: 'success',
    pending: 'warning',
    inactive: 'error'
  }
  return colors[status] || 'warning'
}

const formatLastActive = (timestamp: number) => {
  if (timestamp === 0) return 'Never'
  
  const now = Date.now() / 1000
  const diff = now - timestamp
  
  if (diff < 3600) {
    const minutes = Math.floor(diff / 60)
    return `${minutes}m ago`
  }
  
  if (diff < 86400) {
    const hours = Math.floor(diff / 3600)
    return `${hours}h ago`
  }
  
  const days = Math.floor(diff / 86400)
  return `${days}d ago`
}

// Lifecycle
onMounted(() => {
  fetchUsers()
})

// Watch for organization changes
watch(() => props.organizationId, () => {
  fetchUsers()
})
</script>
