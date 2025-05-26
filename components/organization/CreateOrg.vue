<script setup lang="ts">
import type { TabsItem } from '@nuxt/ui'

// Tab configuration
const items = [
  {
    label: 'Create Organization',
    description: 'Create your organization here.',
    icon: 'i-lucide-building',
    slot: 'organization' as const
  },
  {
    label: 'Create Roles',
    description: 'Create a new role or use the default ones.',
    icon: 'i-lucide-lock',
    slot: 'roles' as const
  },
  {
    label: 'Add Users',
    description: '',
    icon: 'i-lucide-user-search',
    slot: 'users' as const
  },
] satisfies TabsItem[]

// ===== STATE MANAGEMENT =====
// Reactive state for tab control and validation
const activeTab = ref(0)
const completedTabs = reactive({
  organization: false,
  roles: false,
  users: false
})
const validationError = ref('')
const showRolesModal = ref(false)
const modalClosing = ref(false)
const tabsRef = ref(null)
const forceTabUpdate = ref(0) // Used to force tab updates

// Organization data
const organizationState = reactive({
  name: '',
  description: '',
  logo: '',
})
const orgId = ref('')

// ===== API OPERATIONS =====
// Create a new organization and proceed to the next tab if successful
const createOrganization = async () => {
  // Validate organization name
  if (!organizationState.name.trim()) {
    validationError.value = 'Organization name cannot be empty'
    return
  }

  validationError.value = ''
  
  const token = useCookie('auth_token')
  if (!token.value) {
    console.warn('No auth token found')
    return
  }

  try {
    const result = await useFetch('http://localhost:8787/api/organizations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token.value}`
      },
      body: organizationState
    })

    //@ts-ignore
    orgId.value = result.data.value.data.id
    
    // Mark this tab as completed and go to next tab
    completedTabs.organization = true
    goToNextTab()
  } catch (error) {
    console.error('Error creating organization:', error)
    validationError.value = error?.toString() || 'Failed to create organization. Please try again.'
  }
}

// ===== TAB NAVIGATION FUNCTIONS =====
// Navigate to the next tab in sequence
function goToNextTab() {
  if (activeTab.value < items.length - 1) {
    // Force close any open modals first
    modalClosing.value = true
    showRolesModal.value = false
    
    // Wait for next tick and then change tabs
    nextTick(() => {
      setTimeout(() => {
        // Increment forced update counter to ensure tab DOM refreshes
        forceTabUpdate.value++
        // Update active tab value
        activeTab.value++
        console.log('Tab changed to:', activeTab.value)
        modalClosing.value = false
      }, 100)
    })
  }
}

// Move to a specific tab (with prerequisite checking)
function goToTab(index: number) {
  if (index === 0 || (index === 1 && completedTabs.organization) || 
      (index === 2 && completedTabs.organization && completedTabs.roles)) {
    
    // Force close any open modals first
    modalClosing.value = true
    showRolesModal.value = false
    
    // Wait for next tick and then change tabs
    nextTick(() => {
      setTimeout(() => {
        // Increment forced update counter to ensure tab DOM refreshes
        forceTabUpdate.value++
        // Update active tab value
        activeTab.value = index
        console.log('Tab changed to:', activeTab.value)
        modalClosing.value = false
      }, 100)
    })
  } else {
    console.log('Tab change prevented - prerequisites not met')
  }
}

// Handle modal closure and refresh tabs if needed
function refreshTabsAfterModalClose() {
  // Wait for any animations to complete
  setTimeout(() => {
    // Force tab component to re-render
    forceTabUpdate.value++
    nextTick(() => {
      // This will force the tabs to re-evaluate their state
      console.log('Modal closed, refreshing tabs')
    })
  }, 50)
}

// Complete the roles tab and move to the next tab
function completeRolesTab() {
  completedTabs.roles = true
  
  // Force close any open modals first
  modalClosing.value = true
  showRolesModal.value = false
  
  // Navigate to next tab with a slight delay to ensure modal is closed
  setTimeout(() => {
    forceTabUpdate.value++ // Force tab re-render
    if (!modalClosing.value) {
      goToNextTab()
    } else {
      // If modal is still closing, wait a bit longer
      setTimeout(() => {
        goToNextTab()
      }, 200)
    }
  }, 100)
}
</script>

<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg p-4">
    <!-- Custom navigation tabs with visual indicators -->
    <div class="mb-6 bg-gray-100 dark:bg-gray-900 p-2 rounded-lg">
      <div class="flex gap-2">        <button 
          v-for="(item, i) in items" 
          :key="i"
          class="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md transition-all duration-200"
          :class="[
            activeTab === i ? 'bg-white dark:bg-gray-800 text-secondary dark:text-secondary shadow-sm font-medium' : 'hover:bg-gray-200 dark:hover:bg-gray-700',
            (i === 1 && !completedTabs.organization) || (i === 2 && (!completedTabs.organization || !completedTabs.roles)) 
              ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
          ]"
          @click="() => {
            if (i === 0 || (i === 1 && completedTabs.organization) || (i === 2 && completedTabs.organization && completedTabs.roles)) {
              goToTab(i);
            }
          }"
        >
          <!-- Tab icon using UIcon -->
          <UIcon v-if="i === 0" name="lucide:building" class="text-lg flex-shrink-0" />
          <UIcon v-else-if="i === 1" name="lucide:lock" class="text-lg flex-shrink-0" />
          <UIcon v-else-if="i === 2" name="lucide:user-search" class="text-lg flex-shrink-0" />
          
          <!-- Tab label -->
          <span>{{ item.label }}</span>
          
          <!-- Status indicator -->
          <UIcon 
            v-if="i === 0 && completedTabs.organization" 
            name="lucide:check-circle" 
            class="ml-1 text-success text-sm flex-shrink-0" 
          />
          <UIcon 
            v-else-if="i === 1 && completedTabs.roles" 
            name="lucide:check-circle" 
            class="ml-1 text-success text-sm flex-shrink-0" 
          />
          <UIcon 
            v-else-if="i === 2 && completedTabs.users" 
            name="lucide:check-circle" 
            class="ml-1 text-success text-sm flex-shrink-0" 
          />
        </button>
      </div>
    </div>
    
    <!-- Tab content managed manually -->
    <div class="w-full mt-4">
      <!-- ORGANIZATION TAB -->
      <div v-if="activeTab === 0">
        <p class="text-gray-600 dark:text-gray-400 mb-4">
          {{ items[0].description }}
        </p>
          <!-- Validation error alert -->
        <UAlert v-if="validationError" color="error" class="mb-4">
          <template #title>Organization Creation Error</template>
          <template #description>{{ validationError }}</template>
          <template #icon>
            <UIcon name="lucide:alert-circle" class="text-lg" />
          </template>
        </UAlert>

        <!-- Organization form -->
        <UForm :state="organizationState" class="flex flex-col gap-5" @submit.prevent="createOrganization">
          <UFormField label="Name" name="name" size="xl" required>
            <UInput v-model="organizationState.name" class="w-full" />
          </UFormField>
          <UFormField label="Description" name="description" size="xl" hint="Optional">
            <UInput v-model="organizationState.description" class="w-full" />
          </UFormField>
          <UFormField label="Logo" name="logo" size="xl" hint="Paste your logo URL here">
            <UInput v-model="organizationState.logo" class="w-full" />
          </UFormField>
            <UButton 
            label="Create and Continue" 
            type="submit" 
            color="secondary"
            class="self-end cursor-pointer" 
            trailing
          >
            <template #trailing>
              <UIcon name="lucide:arrow-right" />
            </template>
          </UButton>
        </UForm>
      </div>
      
      <!-- ROLES TAB -->
      <div v-if="activeTab === 1">
        <p class="text-gray-600 dark:text-gray-400 mb-4">
          {{ items[1].description }}
        </p>
          <!-- Missing prerequisites alert -->
        <UAlert v-if="!completedTabs.organization" color="info" class="mb-4">
          <template #title>Organization Required</template>
          <template #description>Please complete the organization creation step first before managing roles.</template>
          <template #icon>
            <UIcon name="lucide:info" class="text-lg" />
          </template>
        </UAlert>

        <!-- Roles management section -->
        <template v-if="completedTabs.organization">
          <!-- Roles table -->
          <OrganizationRolesTable :orgId="orgId" />
          
          <div class="flex flex-col gap-4 mt-4">
            <!-- Create role modal -->
            <UModal v-model="showRolesModal" @after:leave="refreshTabsAfterModalClose">
              <UButton label="Create a New Role" color="secondary" class="cursor-pointer"></UButton>
              <template #content>
                <div class="p-4">
                  <OrganizationCreateRoles :orgId="orgId" />
                </div>
              </template>
            </UModal>
            
            <!-- Navigation button -->            <UButton 
              label="Continue to Next Step" 
              @click="completeRolesTab" 
              type="button" 
              color="secondary" 
              class="self-end cursor-pointer"
              trailing
            >
              <template #trailing>
                <UIcon name="lucide:arrow-right" />
              </template>
            </UButton>
          </div>
        </template>
      </div>
      
      <!-- USERS TAB -->
      <div v-if="activeTab === 2">
        <p class="text-gray-600 dark:text-gray-400 mb-4">
          {{ items[2].description }}
        </p>
          <!-- Missing prerequisites alert -->
        <UAlert v-if="!completedTabs.roles" color="info" class="mb-4">
          <template #title>Roles Required</template>
          <template #description>Please complete the roles creation step first before adding users.</template>
          <template #icon>
            <UIcon name="lucide:info" class="text-lg" />
          </template>
        </UAlert>
        
        <!-- User management section -->
        <template v-if="completedTabs.roles">
          <OrganizationSearchUsers :orgId="orgId"/>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
UForm {
  padding: 20px;
}
</style>
