<script setup lang="ts">
const token = useCookie('auth_token')
if (!token.value) {
    console.warn('No auth token found')
}

const props = defineProps<{
    orgId : string;
}>();

const rolesData = ref([]);

const result = await useFetch('http://localhost:8787/api/organizationRoles/all', {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token.value}`,
        "orgId":`${props.orgId}`  
    }
});

// @ts-ignore
rolesData.value = result.data.value.data;

</script>

<template>
    <UTable :data="rolesData" class="w-full"></UTable>
</template>