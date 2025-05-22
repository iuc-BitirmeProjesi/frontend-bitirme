<script setup lang="ts">
const token = useCookie('auth_token')
if (!token.value) {
    console.warn('No auth token found')
}

import { h, resolveComponent } from 'vue'
import type { TableColumn, TableRow } from '@nuxt/ui'



const UBadge = resolveComponent('UBadge')
const UCheckbox = resolveComponent('UCheckbox')



const props = defineProps<{
    orgId: string;
}>();

// Loading state for roles
const rolesLoading = ref(false)

// Function to fetch roles when needed
const fetchRoles = async () => {
    if (roles.value.length > 0 || rolesLoading.value) return
    
    rolesLoading.value = true
    try {
        const res = await useFetch('http://localhost:8787/api/organizationRoles/all', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token.value}`,
                "orgId": `${props.orgId}`
            }
        })
        //@ts-ignore
        roles.value = res.data.value.data.map((r) => ({
            id: r.id,
            name: r.name
        }))
    } catch (error) {
        console.error('Error fetching roles:', error)
    } finally {
        rolesLoading.value = false
    }
}

const selectOptions = computed(() =>
    roles.value.map(role => ({
        //@ts-ignore
        label: role.name,
        //@ts-ignore
        value: role.id
    }))
)

const columns = ref<TableColumn<User>[]>([])
const items = ref(['Backlog', 'Todo', 'In Progress', 'Done'])
function generateColumns(): TableColumn<User>[] {
    return [
        {
            id: 'select',
            //@ts-ignore
            header: ({ table }) =>
                h(UCheckbox, {
                    modelValue: table.getIsSomePageRowsSelected()
                        ? 'indeterminate'
                        : table.getIsAllPageRowsSelected(),
                    'onUpdate:modelValue': (value: boolean | 'indeterminate') =>
                        table.toggleAllPageRowsSelected(!!value),
                    'aria-label': 'Select all'
                }),
            //@ts-ignore
            cell: ({ row }) =>
                h(UCheckbox, {
                    modelValue: row.getIsSelected(),
                    'onUpdate:modelValue': (value: boolean | 'indeterminate') =>
                        row.toggleSelected(!!value),
                    'aria-label': 'Select row'
                })
        },
        {
            accessorKey: 'id',
            header: 'ID'
        },
        {
            accessorKey: 'email',
            header: 'Email'
        },
        {
            id: 'role',
            header: 'Role'
        }
    ]
}

//Initialize columns
onMounted(() => {
    columns.value = generateColumns()
})

//get the roles
const roles = ref([]) //its an array of role objects right now

//rol atama
const selectedRoles = reactive<Record<number, number | null>>({}) // sadece ID





type User = {
    id: number,
    email: string
}


const userState = reactive({
    finds: ''
})

const table = useTemplateRef('table')

const rowSelection = ref<Record<string, boolean>>({})

function onSelect(row: TableRow<User>, e?: Event) {
    /* If you decide to also select the column you can do this  */
    row.toggleSelected(!row.getIsSelected())

    console.log(e)
}






let debounceTimeout: ReturnType<typeof setTimeout>
const foundUsers = ref([]);
function debouncedSearch(query: string) {
    clearTimeout(debounceTimeout)

    const token = useCookie('auth_token')
    if (!token.value) {
        console.warn('No auth token found')
    }


    debounceTimeout = setTimeout(() => {
        if (!query) return

        $fetch('http://localhost:8787/api/users/search', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token.value}`,
                word: query
            }
        })
            .then((res) => {
                console.log('Fetched users:', res)
                //@ts-ignore
                console.log(res.data)
                //@ts-ignore
                foundUsers.value = res.data
            })

            .catch((err) => {
                console.error('Search error:', err)
            })
    }, 300) // 300ms debounce
}

// Watch the input field
watch(() => userState.finds, (newValue) => {
    debouncedSearch(newValue)
})


</script>


<template>
    <UForm :state="userState" class="flex flex-col gap-4">
        <UFormField label="Add Users to Your Organization" name="current" required>
            <UInput v-model="userState.finds" placeholder="Search User" required class="w-full" />
        </UFormField>

        <UTable v-if="foundUsers.length > 0" :data="foundUsers" :columns="columns" ref="table"
            v-model:row-selection="rowSelection" @select="onSelect" :key="`table-key-${columns.length}-${selectOptions.length}`">
            <!-- Role select slot -->
            <template #role-cell="{ row }">
                <USelect 
                    :model-value="selectedRoles[row.original.id] ?? null"
                    @update:model-value="(value) => selectedRoles[row.original.id] = value"
                    :items="selectOptions"
                    placeholder="Select Role"
                    class="min-w-[150px]"
                    :loading="rolesLoading"
                    @focus="fetchRoles"
                />
            </template>
        </UTable>
        <UButton label="Save Changes" type="submit" color="secondary" class="self-end cursor-pointer" />
    </UForm>

</template>
