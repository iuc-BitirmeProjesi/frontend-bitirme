<template>
    <div class="min-h-screen bg-gray-100">
        <header class="bg-white shadow">
            <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                <h1 class="text-3xl font-bold text-gray-900">Labeloo</h1>
                <UButton color="neutral" @click="handleLogout">Logout</UButton>
            </div>
        </header>        <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <div class="bg-white rounded-lg shadow px-6 py-8">
                <div class="mb-6">
                    <h2 class="text-2xl font-bold text-gray-900">Your Organizations</h2>
                    <p class="mt-1 text-gray-500">Manage your organizations and their projects</p>
                </div>
                <OrganizationList />
            </div>
        </main>
    </div>
</template>

<script setup lang="ts">
import { useAuth } from '@/composables/useAuth'

// Define middleware as a navigation guard
definePageMeta({
    middleware: [async () => {
        const { isAuthenticated } = useAuth()
        if (!isAuthenticated.value) {
            return navigateTo('/login')
        }
    }]
})

const { logout } = useAuth()

const handleLogout = () => {
    logout()
}
</script>