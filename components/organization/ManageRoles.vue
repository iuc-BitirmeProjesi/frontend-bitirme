<script setup lang="ts">
import { reactive, watch } from 'vue'
import { Switch } from '@headlessui/vue'

interface RoleState {
  admin: boolean
  editOrganization: boolean
  deleteOrganization: boolean
}

const state = reactive<RoleState>({
  admin: false,
  editOrganization: false,
  deleteOrganization: false
})

// Watch for any changes in the state object
watch(state, (newState) => {
  console.log('State changed:', newState)
}, { deep: true })

const updateRole = (role: keyof RoleState, value: boolean) => {
  state[role] = value
  alert(`Role ${role} changed to: ${value}`) // Adding an alert to make it more visible
}
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
        class="group relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
        :class="[state.editOrganization ? 'bg-green-500' : 'bg-gray-300']"
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
        class="group relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
        :class="[state.deleteOrganization ? 'bg-green-500' : 'bg-gray-300']"
      >
        <span class="sr-only">Enable delete organization role</span>
        <span
          class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ease-in-out"
          :class="[state.deleteOrganization ? 'translate-x-6' : 'translate-x-1']"
        />
      </Switch>
    </UFormField>
  </UForm>
</template>
