<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex justify-between items-center">
      <div>
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Users</h2>
        <p class="text-gray-600 dark:text-gray-400 mt-1">Manage organization members and their access</p>
      </div>
      <UButton color="primary" icon="i-heroicons-plus" @click="inviteUser">
        Invite User
      </UButton>
    </div>

    <!-- Search and Filters -->
    <div class="flex flex-col sm:flex-row gap-4">
      <div class="flex-1">
        <UInput
          v-model="searchQuery"
          icon="i-heroicons-magnifying-glass"
          placeholder="Search users..."
          @input="handleSearch"
        />
      </div>
      <USelect
        v-model="selectedRole"
        :options="roleOptions"
        placeholder="Filter by role"
        @change="handleRoleFilter"
      />
    </div>    <!-- Users Loading -->
    <div v-if="loading" class="flex flex-col justify-center items-center py-12 space-y-3">
      <USpinner size="lg" />
      <p class="text-gray-600 dark:text-gray-300 font-medium">Loading users...</p>
    </div>

    <!-- Error State -->
    <UAlert
      v-else-if="error"
      color="red"
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
        </p>
        <UButton 
          color="primary" 
          size="lg"
          icon="i-heroicons-plus"
          @click="inviteUser"
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
    </div>

    <!-- Users Table -->
    <div v-else class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      <UTable 
        :rows="filteredUsers" 
        :columns="columns"
        :loading="loading"
        class="w-full"
      >
        <template #avatar-data="{ row }">
          <div class="flex items-center space-x-3">
            <UAvatar
              :src="row.avatar"
              :alt="row.name"
              size="sm"
            />
            <div>
              <div class="font-medium text-gray-900 dark:text-white">{{ row.name }}</div>
              <div class="text-sm text-gray-500 dark:text-gray-400">{{ row.email }}</div>
            </div>
          </div>
        </template>

        <template #role-data="{ row }">
          <UBadge 
            :color="getRoleColor(row.role)" 
            variant="subtle"
          >
            {{ row.role }}
          </UBadge>
        </template>

        <template #status-data="{ row }">
          <UBadge 
            :color="row.status === 'active' ? 'success' : 'warning'" 
            variant="subtle"
          >
            {{ row.status }}
          </UBadge>
        </template>

        <template #lastActive-data="{ row }">
          <span class="text-sm text-gray-600 dark:text-gray-400">
            {{ formatLastActive(row.lastActive) }}
          </span>
        </template>

        <template #actions-data="{ row }">
          <UDropdown :items="getUserActions(row)">
            <UButton 
              color="gray" 
              variant="ghost" 
              icon="i-heroicons-ellipsis-horizontal"
            />
          </UDropdown>
        </template>
      </UTable>
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

// Token for API requests
const token = useCookie('auth_token')

// Table columns
const columns = [
  { key: 'avatar', label: 'User' },
  { key: 'role', label: 'Role' },
  { key: 'status', label: 'Status' },
  { key: 'lastActive', label: 'Last Active' },
  { key: 'actions', label: 'Actions' }
]

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
    
    // Mock data for now - replace with actual API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    users.value = [
      {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        avatar: 'https://avatars.githubusercontent.com/u/1?v=4',
        role: 'admin',
        status: 'active',
        lastActive: Date.now() / 1000 - 3600,
        joinedAt: Date.now() / 1000 - 86400 * 30
      },
      {
        id: 2,
        name: 'Jane Smith',
        email: 'jane@example.com',
        role: 'manager',
        status: 'active',
        lastActive: Date.now() / 1000 - 7200,
        joinedAt: Date.now() / 1000 - 86400 * 15
      },
      {
        id: 3,
        name: 'Bob Wilson',
        email: 'bob@example.com',
        role: 'member',
        status: 'pending',
        lastActive: 0,
        joinedAt: Date.now() / 1000 - 86400 * 2
      }
    ]
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to load users'
    console.error('Error fetching users:', err)
  } finally {
    loading.value = false
  }
}

const inviteUser = () => {
  console.log('Invite user to organization:', props.organizationId)
  // Open invite modal or navigate to invite page
}

const handleSearch = () => {
  // Search is reactive through computed property
}

const handleRoleFilter = () => {
  // Filter is reactive through computed property
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

const getRoleColor = (role: string) => {
  const colors: Record<string, string> = {
    admin: 'error',
    manager: 'warning',
    member: 'primary',
    viewer: 'secondary'
  }
  return colors[role] || 'secondary'
}

const formatLastActive = (timestamp: number) => {
  if (timestamp === 0) return 'Never'
  
  const now = Date.now() / 1000
  const diff = now - timestamp
  
  if (diff < 3600) {
    const minutes = Math.floor(diff / 60)
    return `${minutes}m ago`
  } else if (diff < 86400) {
    const hours = Math.floor(diff / 3600)
    return `${hours}h ago`
  } else {
    const days = Math.floor(diff / 86400)
    return `${days}d ago`
  }
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
