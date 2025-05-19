<script setup lang="ts">
interface RoleState {
    name: string;
    description: string;
    permissionFlags: string[]; // Using string[] as it's more specific than any[]
}

const props = defineProps<{
    roleState: RoleState;
}>();

const roleState = reactive({ //organizationId bir önceki oluşturulan orgId'den gelecek
  name: '',
  description: '',
  permissionFlags: [],
})

const createRole = async () => {
  const token = useCookie('auth_token')
  if (!token.value) {
    console.warn('No auth token found')
  }

  const result = await useFetch('http://localhost:8787/api/organizationRoles/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token.value}`
    },
    body: roleState
  })
}
</script>

<template>
    <UFormField label="Role Name" name="name" required>
        <UInput v-model="roleState.name" required class="w-full" />
    </UFormField>
    <UFormField label="Role Description" name="description" hint="Optional">
        <UInput v-model="roleState.description" required class="w-full" />
    </UFormField>
    <UFormField label="Manage Roles" name="roles" required>
        <div class="flex flex-col gap-4 justify-between">
            <UModal>
                <UButton label="Edit Flags" color="success" class="cursor-pointer"></UButton>
                <template #content>
                    <div class="p-4">
                        <OrganizationManageRoles />
                    </div>
                </template>
            </UModal>
            <UButton label="Create Role" color="secondary" class="cursor-pointer self-end" @click="createRole"></UButton>
        </div>
    </UFormField>

</template>