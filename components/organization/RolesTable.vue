<script setup lang="ts">
const token = useCookie('auth_token')
if (!token.value) {
    console.warn('No auth token found')
}

const result = await useFetch('http://localhost:8787/api/organizationRoles/all', {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token.value}`,
        "orgId":'null'  
    }
});
const final = result.data.value;
console.log(final);
    
// const data = ref({

// })
</script>