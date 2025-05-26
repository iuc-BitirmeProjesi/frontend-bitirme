<script setup lang="ts">
import { reactive, watch, onMounted, toRefs, computed, ref } from 'vue'
import { Switch } from '@headlessui/vue'

interface RoleState {
  admin: boolean
  editOrganization: boolean
  deleteOrganization: boolean
  editMembers: boolean
  editRoles: boolean
  editProjects: boolean
  createProjects: boolean
  deleteProjects: boolean
}

// Add props to receive initial state from parent
const props = defineProps<{
  initialState?: RoleState
}>()

const state = reactive<RoleState>({
  admin: false,
  editOrganization: false,
  deleteOrganization: false,
  editMembers: false,
  editRoles: false,
  editProjects: false,
  createProjects: false,
  deleteProjects: false,
})

// Initialize state from props when component mounts and when props change
watch(() => props.initialState, (newInitialState) => {
  if (newInitialState) {
    // Use for..of loop instead of forEach
    for (const key of Object.keys(state)) {
      const typedKey = key as keyof RoleState
      if (newInitialState && typedKey in newInitialState) {
        state[typedKey] = newInitialState[typedKey]
      }
    }
  }
}, { immediate: true, deep: true })

// Watch for changes to the admin flag specifically
watch(() => state.admin, (isAdmin) => {
  if (isAdmin) {
    // Set all other flags to true when admin is true
    // Use for..of loop instead of forEach
    for (const key of Object.keys(state)) {
      const typedKey = key as keyof RoleState
      if (typedKey !== 'admin') {
        state[typedKey] = true
      }
    }
  }
})

// Watch for any changes in the state object
watch(state, (newState) => {
  console.log('State changed:', newState)
  emit('update:state', { ...newState }) // Clone to avoid reference issues
}, { deep: true })

// Computed property to check if other flags should be disabled
const otherFlagsDisabled = computed(() => {
  return state.admin
})

// State for success alert visibility
const showSuccessAlert = ref(false)

// Function to save flags and show alert
const saveFlags = () => {
  emit('update:state', state)
  showSuccessAlert.value = true
  
  // Auto-hide alert after 3 seconds
  setTimeout(() => {
    showSuccessAlert.value = false
  }, 3000)
}

// Define the emit
const emit = defineEmits(['update:state'])
</script>

<template>
  <UForm :state="state">
    <UFormField label="Admin" name="admin" size="xl">
      <Switch
        v-model="state.admin"
        class="group relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
        :class="[state.admin ? 'bg-green-500' : 'bg-gray-300']"
      >
        <span class="sr-only">Enable admin role</span>
        <span
          class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ease-in-out"
          :class="[state.admin ? 'translate-x-6' : 'translate-x-1']"
        />
      </Switch>
    </UFormField>

    <UFormField label="Edit Organization" name="editOrganization" size="xl">
      <Switch
        v-model="state.editOrganization"
        :disabled="otherFlagsDisabled"
        class="group relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
        :class=" [
          state.editOrganization ? 'bg-green-500' : 'bg-gray-300',
          otherFlagsDisabled ? 'opacity-70 cursor-not-allowed' : ''
        ]"
      >
        <span class="sr-only">Enable edit organization role</span>
        <span
          class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ease-in-out"
          :class="[state.editOrganization ? 'translate-x-6' : 'translate-x-1']"
        />
      </Switch>
    </UFormField>

    <UFormField label="Delete Organization" name="deleteOrganization" size="xl">
      <Switch
        v-model="state.deleteOrganization"
        :disabled="otherFlagsDisabled"
        class="group relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
        :class=" [
          state.deleteOrganization ? 'bg-green-500' : 'bg-gray-300',
          otherFlagsDisabled ? 'opacity-70 cursor-not-allowed' : ''
        ]"
      >
        <span class="sr-only">Enable delete organization role</span>
        <span
          class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ease-in-out"
          :class="[state.deleteOrganization ? 'translate-x-6' : 'translate-x-1']"
        />
      </Switch>
    </UFormField>

    <UFormField label="Edit Members" name="editMembers" size="xl">
      <Switch
        v-model="state.editMembers"
        :disabled="otherFlagsDisabled"
        class="group relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
        :class=" [
          state.editMembers ? 'bg-green-500' : 'bg-gray-300',
          otherFlagsDisabled ? 'opacity-70 cursor-not-allowed' : ''
        ]"
      >
        <span class="sr-only">Enable edit members role</span>
        <span
          class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ease-in-out"
          :class="[state.editMembers ? 'translate-x-6' : 'translate-x-1']"
        />
      </Switch>
    </UFormField>

    <UFormField label="Edit Roles" name="editRoles" size="xl">
      <Switch
        v-model="state.editRoles"
        :disabled="otherFlagsDisabled"
        class="group relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
        :class=" [
          state.editRoles ? 'bg-green-500' : 'bg-gray-300',
          otherFlagsDisabled ? 'opacity-70 cursor-not-allowed' : ''
        ]"
      >
        <span class="sr-only">Enable edit roles role</span>
        <span
          class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ease-in-out"
          :class="[state.editRoles ? 'translate-x-6' : 'translate-x-1']"
        />
      </Switch>
    </UFormField>

    <UFormField label="Edit Projects" name="editProjects" size="xl">
      <Switch
        v-model="state.editProjects"
        :disabled="otherFlagsDisabled"
        class="group relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
        :class=" [
          state.editProjects ? 'bg-green-500' : 'bg-gray-300',
          otherFlagsDisabled ? 'opacity-70 cursor-not-allowed' : ''
        ]"
      >
        <span class="sr-only">Enable edit projects role</span>
        <span
          class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ease-in-out"
          :class="[state.editProjects ? 'translate-x-6' : 'translate-x-1']"
        />
      </Switch>
    </UFormField>

    <UFormField label="Create Projects" name="createProjects" size="xl">
      <Switch
        v-model="state.createProjects"
        :disabled="otherFlagsDisabled"
        class="group relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
        :class=" [
          state.createProjects ? 'bg-green-500' : 'bg-gray-300',
          otherFlagsDisabled ? 'opacity-70 cursor-not-allowed' : ''
        ]"
      >
        <span class="sr-only">Enable create projects role</span>
        <span
          class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ease-in-out"
          :class="[state.createProjects ? 'translate-x-6' : 'translate-x-1']"
        />
      </Switch>
    </UFormField>

    <UFormField label="Delete Projects" name="deleteProjects" size="xl">
      <Switch
        v-model="state.deleteProjects"
        :disabled="otherFlagsDisabled"
        class="group relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
        :class=" [
          state.deleteProjects ? 'bg-green-500' : 'bg-gray-300',
          otherFlagsDisabled ? 'opacity-70 cursor-not-allowed' : ''
        ]"
      >
        <span class="sr-only">Enable delete projects role</span>
        <span
          class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ease-in-out"
          :class="[state.deleteProjects ? 'translate-x-6' : 'translate-x-1']"
        />
      </Switch>
    </UFormField>    <div v-if="state.admin" class="p-2 mb-4 text-sm text-blue-700 bg-blue-100 rounded-lg">
      Admin permission grants all other permissions automatically
    </div>

    <!-- Success Alert -->
    <UAlert
      v-if="showSuccessAlert"
      color="success"
      variant="solid"
      icon="i-heroicons-check-circle"
      title="Success!"
      description="Flags saved successfully, click anywhere to close"
      class="mb-4"
    />

    <UButton label="Save Flags" class="self-end" color="secondary" @click="saveFlags" />

  </UForm>
</template>
