<script setup lang="ts">
import type { TabsItem } from '@nuxt/ui'

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

const organizationState = reactive({
  name: ' ',
  description: '',
  logo: '',
})

const roleState = reactive({ //organizationId bir önceki oluşturulan orgId'den gelecek
    name: '',
    description:'',
    permissionFlags: [],
})

const userState = reactive({
    finds:''
})
</script>

<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg p-4">
    <UTabs 
      :items="items" 
      variant="link" 
      class="gap-5 w-full" 
      :ui="{ 
        list: 'bg-gray-100 dark:bg-gray-900 p-2 rounded-lg',
        trigger: 'grow cursor-pointer dark:text-gray-400 hover:text-secondary dark:hover:text-secondary [&[aria-selected=true]]:text-secondary [&[aria-selected=true]]:dark:text-secondary'
      }"
    >
      <template #organization="{ item }">
        <p class="text-gray-600 dark:text-gray-400 mb-4">
          {{ item.description }}
        </p>

        <!--create organization-->
        <UForm :state="organizationState" class="flex flex-col gap-5">
          <UFormField label="Name" name="name" size="xl" required>
            <UInput v-model="organizationState.name" class="w-full" />
          </UFormField>
          <UFormField label="Description" name="description"  size="xl" hint="Optional">
            <UInput v-model="organizationState.description" class="w-full"/>
          </UFormField>
          <UFormField label="Logo" name="logo"  size="xl" hint="Paste your logo URL here">
            <UInput v-model="organizationState.logo" class="w-full"/>
          </UFormField>
          
          <UButton label="Continue" type="submit" color="secondary" class="self-end cursor-pointer" />
        </UForm>
      </template>

      <template #roles="{ item }">
        <p class="text-gray-600 dark:text-gray-400 mb-4">
          {{ item.description }}
        </p>

        <!--create roles-->
        <UForm :state="roleState" class="flex flex-col gap-4">
          <UFormField label="Role Name" name="name" required>
            <UInput v-model="roleState.name"  required class="w-full" />
          </UFormField>
          <UFormField label="Role Description" name="description" hint="Optional">
            <UInput v-model="roleState.description"  required class="w-full" />
          </UFormField>
          <UFormField label="Manage Roles" name="roles" required>
            <UModal>
              <UButton label="Edit Roles" color="secondary" class="cursor-pointer"></UButton>
              <template #content>
                  <div class="p-4">
                      <OrganizationManageRoles/>
                  </div>
              </template>
            </UModal>
          </UFormField>

          <UButton label="Continue" type="submit" color="secondary" class="self-end cursor-pointer" />
        </UForm>
      </template>

      <!--add users-->
      <template #users="{ item }"> 
          <p class="text-gray-600 dark:text-gray-400 mb-4">
          {{ item.description }}
        </p>
        <UForm :state="userState" class="flex flex-col gap-4">
          <UFormField label="Add Users to Your Organization" name="current" required>
            <UInput v-model="userState.finds" placeholder="Search User" required class="w-full" />
          </UFormField>

          <UButton label="Save Changes" type="submit" color="secondary" class="self-end cursor-pointer" />
        </UForm>
      </template>
        
    </UTabs>
  </div>
</template>

<style scoped>
    UForm{
        padding: 20px;
    }
</style>
