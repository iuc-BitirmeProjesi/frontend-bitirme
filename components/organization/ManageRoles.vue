<script setup lang="ts">
import { reactive, watch } from 'vue'
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

    <UFormField label="Edit Members" name="editMembers" size="xl">
      <Switch
        v-model="state.editMembers"
        class="group relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
        :class="[state.editMembers ? 'bg-green-500' : 'bg-gray-300']"
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
        class="group relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
        :class="[state.editRoles ? 'bg-green-500' : 'bg-gray-300']"
      >
        <span class="sr-only">Enable edit members role</span>
        <span
          class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ease-in-out"
          :class="[state.editRoles ? 'translate-x-6' : 'translate-x-1']"
        />
      </Switch>
    </UFormField>

    <UFormField label="Edit Projects" name="editProjects" size="xl">
      <Switch
        v-model="state.editProjects"
        class="group relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
        :class="[state.editProjects ? 'bg-green-500' : 'bg-gray-300']"
      >
        <span class="sr-only">Enable edit members role</span>
        <span
          class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ease-in-out"
          :class="[state.editProjects ? 'translate-x-6' : 'translate-x-1']"
        />
      </Switch>
    </UFormField>

    <UFormField label="Create Projects" name="createProjects" size="xl">
      <Switch
        v-model="state.createProjects"
        class="group relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
        :class="[state.createProjects ? 'bg-green-500' : 'bg-gray-300']"
      >
        <span class="sr-only">Enable edit members role</span>
        <span
          class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ease-in-out"
          :class="[state.createProjects ? 'translate-x-6' : 'translate-x-1']"
        />
      </Switch>
    </UFormField>

    <UFormField label="Delete Projects" name="deleteProjects" size="xl">
      <Switch
        v-model="state.deleteProjects"
        class="group relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
        :class="[state.deleteProjects ? 'bg-green-500' : 'bg-gray-300']"
      >
        <span class="sr-only">Enable edit members role</span>
        <span
          class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ease-in-out"
          :class="[state.deleteProjects ? 'translate-x-6' : 'translate-x-1']"
        />
      </Switch>
    </UFormField>

  </UForm>
</template>
