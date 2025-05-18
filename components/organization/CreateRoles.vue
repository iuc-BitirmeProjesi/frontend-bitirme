<script setup lang="ts">
interface RoleState {
    name: string;
    description: string;
    permissionFlags: string[]; // Using string[] as it's more specific than any[]
}

const props = defineProps<{
    roleState: RoleState;
}>();
</script>

<template>
    <UFormField label="Role Name" name="name" required>
        <UInput v-model="props.roleState.name" required class="w-full" />
    </UFormField>
    <UFormField label="Role Description" name="description" hint="Optional">
        <UInput v-model="props.roleState.description" required class="w-full" />
    </UFormField>
    <UFormField label="Manage Roles" name="roles" required>
        <UModal>
            <UButton label="Edit Roles" color="secondary" class="cursor-pointer"></UButton>
            <template #content>
                <div class="p-4">
                    <OrganizationManageRoles />
                </div>
            </template>
        </UModal>
    </UFormField>
</template>