<template>
  <div class="space-y-6">
    <!-- Header -->
    <div>
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Organization Settings</h2>
      <p class="text-gray-600 dark:text-gray-300 mt-1">Manage your organization preferences and configuration</p>
    </div>

    <!-- Settings Sections -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Settings Navigation -->
      <div class="lg:col-span-1">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div class="p-4">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Settings</h3>            <nav class="space-y-1">
              <button
                v-for="section in settingSections"
                :key="section.key"
                @click="section.disabled ? null : activeSection = section.key"
                :class="[
                  'w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
                  section.disabled 
                    ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed bg-gray-50 dark:bg-gray-700/50' 
                    : activeSection === section.key
                      ? 'bg-primary/10 text-primary border-primary'
                      : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                ]"
                :disabled="section.disabled"
              >
                <UIcon :name="section.icon" class="w-4 h-4 mr-3" />
                {{ section.label }}
                <UIcon 
                  v-if="section.disabled" 
                  name="i-heroicons-lock-closed" 
                  class="w-3 h-3 ml-auto text-gray-400" 
                />
              </button>
            </nav>
          </div>
        </div>
      </div>

      <!-- Settings Content -->
      <div class="lg:col-span-2">
        <!-- General Settings -->
        <div v-if="activeSection === 'general'" class="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div class="p-6">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-6">General Information</h3>
            
            <form @submit.prevent="saveGeneralSettings" class="space-y-6">
              <!-- Organization Logo -->
              <UFormGroup label="Organization Logo">
                <div class="flex items-center space-x-4">
                  <div class="flex-shrink-0">
                    <img 
                      v-if="settings.logo" 
                      :src="settings.logo" 
                      alt="Organization logo"
                      class="w-16 h-16 rounded-lg object-cover border border-gray-200 dark:border-gray-600"
                    />
                    <div v-else class="w-16 h-16 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center border border-gray-200 dark:border-gray-600">
                      <UIcon name="i-heroicons-building-office" class="w-8 h-8 text-gray-400" />
                    </div>
                  </div>
                  <div>
                    <UButton color="secondary" variant="outline" size="sm">
                      Change Logo
                    </UButton>
                    <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">JPG, PNG up to 2MB</p>
                  </div>
                </div>
              </UFormGroup>

              <!-- Organization Name -->
              <UFormGroup label="Organization Name" required>
                <UInput v-model="settings.name" placeholder="Enter organization name" />
              </UFormGroup>

              <!-- Description -->
              <UFormGroup label="Description">
                <UTextarea 
                  v-model="settings.description" 
                  placeholder="Enter organization description"
                  :rows="3"
                />
              </UFormGroup>

              <!-- Website -->
              <UFormGroup label="Website">
                <UInput v-model="settings.website" placeholder="https://example.com" />
              </UFormGroup>

              <!-- Industry -->
              <UFormGroup label="Industry">
                <USelect 
                  v-model="settings.industry" 
                  :options="industryOptions"
                  placeholder="Select industry"
                />
              </UFormGroup>

              <!-- Company Size -->
              <UFormGroup label="Company Size">
                <USelect 
                  v-model="settings.companySize" 
                  :options="companySizeOptions"
                  placeholder="Select company size"
                />
              </UFormGroup>

              <div class="flex justify-end">
                <UButton type="submit" color="primary" :loading="saving">
                  Save Changes
                </UButton>
              </div>
            </form>
          </div>
        </div>        <!-- Security Settings -->
        <div v-else-if="activeSection === 'security'" class="bg-white dark:bg-gray-800 rounded-lg shadow relative">
          <!-- Disabled Overlay -->
          <div class="absolute inset-0 bg-gray-50/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-lg z-10 flex items-center justify-center">
            <div class="text-center">
              <UIcon name="i-heroicons-lock-closed" class="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <h4 class="text-lg font-medium text-gray-600 dark:text-gray-400 mb-2">Coming Soon</h4>
              <p class="text-sm text-gray-500 dark:text-gray-500">Security features will be available in a future update</p>
            </div>
          </div>
          
          <div class="p-6 pointer-events-none">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-6">Security & Access</h3>
            
            <div class="space-y-6">
              <!-- Two-Factor Authentication -->
              <div class="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                <div>
                  <h4 class="text-sm font-medium text-gray-900 dark:text-white">Two-Factor Authentication</h4>
                  <p class="text-sm text-gray-500 dark:text-gray-400">Require 2FA for all organization members</p>
                </div>
                <UToggle v-model="settings.require2FA" />
              </div>

              <!-- SSO -->
              <div class="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                <div>
                  <h4 class="text-sm font-medium text-gray-900 dark:text-white">Single Sign-On (SSO)</h4>
                  <p class="text-sm text-gray-500 dark:text-gray-400">Enable SSO for organization login</p>
                </div>
                <UToggle v-model="settings.enableSSO" />
              </div>

              <!-- Session Timeout -->
              <UFormGroup label="Session Timeout">
                <USelect 
                  v-model="settings.sessionTimeout" 
                  :options="sessionTimeoutOptions"
                />
              </UFormGroup>

              <!-- IP Whitelist -->
              <UFormGroup label="IP Whitelist">
                <UTextarea 
                  v-model="settings.ipWhitelist" 
                  placeholder="Enter IP addresses (one per line)"
                  :rows="3"
                />
                <template #help>
                  <span class="text-xs">Leave empty to allow access from any IP address</span>
                </template>
              </UFormGroup>

              <div class="flex justify-end">
                <UButton color="primary" @click="saveSecuritySettings" :loading="saving">
                  Save Security Settings
                </UButton>
              </div>
            </div>
          </div>
        </div>        <!-- Notifications Settings -->
        <div v-else-if="activeSection === 'notifications'" class="bg-white dark:bg-gray-800 rounded-lg shadow relative">
          <!-- Disabled Overlay -->
          <div class="absolute inset-0 bg-gray-50/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-lg z-10 flex items-center justify-center">
            <div class="text-center">
              <UIcon name="i-heroicons-bell-slash" class="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <h4 class="text-lg font-medium text-gray-600 dark:text-gray-400 mb-2">Coming Soon</h4>
              <p class="text-sm text-gray-500 dark:text-gray-500">Notification features will be available in a future update</p>
            </div>
          </div>
          
          <div class="p-6 pointer-events-none">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-6">Notification Preferences</h3>
            
            <div class="space-y-6">
              <!-- Email Notifications -->
              <div>
                <h4 class="text-sm font-medium text-gray-900 dark:text-white mb-4">Email Notifications</h4>
                <div class="space-y-3">
                  <div class="flex items-center justify-between">
                    <div>
                      <p class="text-sm text-gray-900 dark:text-white">New member joins</p>
                      <p class="text-xs text-gray-500 dark:text-gray-400">Get notified when someone joins the organization</p>
                    </div>
                    <UToggle v-model="settings.notifications.newMember" />
                  </div>
                  
                  <div class="flex items-center justify-between">
                    <div>
                      <p class="text-sm text-gray-900 dark:text-white">Project updates</p>
                      <p class="text-xs text-gray-500 dark:text-gray-400">Get notified about project changes</p>
                    </div>
                    <UToggle v-model="settings.notifications.projectUpdates" />
                  </div>
                  
                  <div class="flex items-center justify-between">
                    <div>
                      <p class="text-sm text-gray-900 dark:text-white">Security alerts</p>
                      <p class="text-xs text-gray-500 dark:text-gray-400">Get notified about security events</p>
                    </div>
                    <UToggle v-model="settings.notifications.securityAlerts" />
                  </div>
                </div>
              </div>

              <!-- Slack Integration -->
              <div class="border-t border-gray-200 dark:border-gray-600 pt-6">
                <h4 class="text-sm font-medium text-gray-900 dark:text-white mb-4">Slack Integration</h4>
                <div class="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                  <div>
                    <p class="text-sm text-gray-900 dark:text-white">Connect Slack workspace</p>
                    <p class="text-xs text-gray-500 dark:text-gray-400">Send notifications to your Slack channels</p>
                  </div>
                  <UButton color="secondary" variant="outline" size="sm">
                    <UIcon name="i-simple-icons-slack" class="w-4 h-4 mr-2" />
                    Connect
                  </UButton>
                </div>
              </div>

              <div class="flex justify-end">
                <UButton color="primary" @click="saveNotificationSettings" :loading="saving">
                  Save Notification Settings
                </UButton>
              </div>
            </div>
          </div>        </div>

        <!-- Danger Zone -->
        <div v-else-if="activeSection === 'danger'" class="bg-white dark:bg-gray-800 rounded-lg shadow border border-red-200 dark:border-red-800">
          <div class="p-6">
            <h3 class="text-lg font-medium text-red-600 dark:text-red-400 mb-6">Danger Zone</h3>
            
            <div class="space-y-6">
              <!-- Transfer Ownership -->
              <div class="p-4 border border-red-200 dark:border-red-800 rounded-lg">
                <h4 class="text-sm font-medium text-gray-900 dark:text-white mb-2">Transfer Ownership</h4>
                <p class="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  Transfer this organization to another user. You will lose admin access.
                </p>                <UButton color="error" variant="outline" size="sm">
                  Transfer Organization
                </UButton>
              </div>

              <!-- Delete Organization -->
              <div class="p-4 border border-red-200 dark:border-red-800 rounded-lg">
                <h4 class="text-sm font-medium text-gray-900 dark:text-white mb-2">Delete Organization</h4>
                <p class="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  Permanently delete this organization and all of its data. This action cannot be undone.
                </p>                <UButton color="error" size="sm" @click="showDeleteConfirm = true">
                  Delete Organization
                </UButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <UModal v-model="showDeleteConfirm">
      <UCard>
        <template #header>
          <h3 class="text-lg font-semibold text-red-600">Delete Organization</h3>
        </template>
        
        <div class="space-y-4">
          <p class="text-gray-600 dark:text-gray-300">
            This action cannot be undone. This will permanently delete the organization and all of its data.
          </p>
          
          <UFormGroup label="Type the organization name to confirm">
            <UInput v-model="deleteConfirmation" placeholder="Enter organization name" />
          </UFormGroup>
        </div>

        <template #footer>
          <div class="flex justify-end gap-3">
            <UButton color="secondary" variant="ghost" @click="showDeleteConfirm = false">
              Cancel
            </UButton>            <UButton 
              color="error" 
              :disabled="deleteConfirmation !== settings.name"
              @click="deleteOrganization"
              :loading="deleting"
            >
              Delete Organization
            </UButton>
          </div>
        </template>
      </UCard>
    </UModal>
  </div>
</template>

<script setup lang="ts">
// Reactive state
const activeSection = ref('general')
const saving = ref(false)
const deleting = ref(false)
const showDeleteConfirm = ref(false)
const deleteConfirmation = ref('')

const settings = ref({
  name: 'Acme Corporation',
  description: 'A leading technology company focused on innovation and excellence.',
  website: 'https://acme.com',
  industry: 'technology',
  companySize: '51-200',
  logo: '',
  require2FA: false,
  enableSSO: false,
  sessionTimeout: '8h',
  ipWhitelist: '',
  notifications: {
    newMember: true,
    projectUpdates: true,
    securityAlerts: true
  }
})

// Setting sections
const settingSections = [
  { key: 'general', label: 'General', icon: 'i-heroicons-building-office', disabled: false },
  { key: 'security', label: 'Security', icon: 'i-heroicons-shield-check', disabled: true },
  { key: 'notifications', label: 'Notifications', icon: 'i-heroicons-bell', disabled: true },
  { key: 'danger', label: 'Danger Zone', icon: 'i-heroicons-exclamation-triangle', disabled: false }
]

// Watch for disabled section access and redirect to general
watch(activeSection, (newSection) => {
  const section = settingSections.find(s => s.key === newSection)
  if (section?.disabled) {
    activeSection.value = 'general'
  }
})

// Options
const industryOptions = [
  { label: 'Technology', value: 'technology' },
  { label: 'Healthcare', value: 'healthcare' },
  { label: 'Finance', value: 'finance' },
  { label: 'Education', value: 'education' },
  { label: 'Manufacturing', value: 'manufacturing' },
  { label: 'Retail', value: 'retail' },
  { label: 'Other', value: 'other' }
]

const companySizeOptions = [
  { label: '1-10 employees', value: '1-10' },
  { label: '11-50 employees', value: '11-50' },
  { label: '51-200 employees', value: '51-200' },
  { label: '201-500 employees', value: '201-500' },
  { label: '500+ employees', value: '500+' }
]

const sessionTimeoutOptions = [
  { label: '1 hour', value: '1h' },
  { label: '4 hours', value: '4h' },
  { label: '8 hours', value: '8h' },
  { label: '24 hours', value: '24h' },  { label: 'Never', value: 'never' }
]

// Methods
const saveGeneralSettings = async () => {
  saving.value = true
  try {
    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    console.log('General settings saved:', settings.value)
  } catch (error) {
    console.error('Error saving settings:', error)
  } finally {
    saving.value = false
  }
}

const saveSecuritySettings = async () => {
  saving.value = true
  try {
    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    console.log('Security settings saved')
  } catch (error) {
    console.error('Error saving security settings:', error)
  } finally {
    saving.value = false
  }
}

const saveNotificationSettings = async () => {
  saving.value = true
  try {
    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    console.log('Notification settings saved')
  } catch (error) {
    console.error('Error saving notification settings:', error)
  } finally {
    saving.value = false
  }
}

const deleteOrganization = async () => {
  deleting.value = true
  try {    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    console.log('Organization deleted')
    // Redirect to homepage
    await navigateTo('/homepage')
  } catch (error) {
    console.error('Error deleting organization:', error)
  } finally {
    deleting.value = false
  }
}

const formatDate = (timestamp: number) => {
  return new Date(timestamp * 1000).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}
</script>
