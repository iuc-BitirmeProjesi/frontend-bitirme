<template>    <header class="bg-white dark:bg-gray-800 shadow">
        <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <NuxtLink :to="{ name: 'homepage' }">
                <h1 class="text-3xl font-bold text-gray-900 dark:text-white hover:cursor-pointer">Labeloo</h1>
            </NuxtLink>
            
            <!-- Navigation Buttons -->
            <nav class="hidden md:flex items-center space-x-4">
                <UButton 
                    variant="ghost" 
                    color="secondary"
                    icon="i-heroicons-users"
                    class="hover:cursor-pointer"
                    @click="handleUsersClick"
                >
                    Users
                </UButton>
                <UButton 
                    variant="ghost" 
                    color="secondary"
                    icon="i-heroicons-user-group"
                    class="hover:cursor-pointer"
                    @click="handleRolesClick"
                >
                    Roles
                </UButton>
                <UButton 
                    variant="ghost" 
                    color="secondary"
                    icon="i-heroicons-cog-6-tooth"
                    class="hover:cursor-pointer"
                    @click="handleSettingsClick"
                >
                    Settings
                </UButton>
            </nav>

            <!-- Mobile Navigation Menu -->
            <UDropdown 
                :items="mobileMenuItems" 
                :popper="{ placement: 'bottom-end' }"
                class="md:hidden"
            >
                <UButton 
                    icon="i-heroicons-bars-3" 
                    variant="ghost" 
                    color="secondary"
                    class="hover:cursor-pointer"
                />
            </UDropdown>
            
            <div class="flex items-center gap-3">
                <UtilsColorModeButton class="hover:cursor-pointer" />
                <UButton color="secondary" class="hover:cursor-pointer" @click="handleLogout">Logout</UButton>
            </div>
        </div>
    </header>
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

// Navigation handlers (placeholder functions for future implementation)
const handleUsersClick = () => {
    console.log('Users clicked - functionality to be implemented')
}

const handleRolesClick = () => {
    console.log('Roles clicked - functionality to be implemented')
}

const handleSettingsClick = () => {
    console.log('Settings clicked - functionality to be implemented')
}

const handleLogout = () => {
    logout()
}

// Mobile menu items
const mobileMenuItems = [
    [{
        label: 'Users',
        icon: 'i-heroicons-users',
        click: handleUsersClick
    }],
    [{
        label: 'Roles',
        icon: 'i-heroicons-user-group',
        click: handleRolesClick
    }],
    [{
        label: 'Settings',
        icon: 'i-heroicons-cog-6-tooth',
        click: handleSettingsClick
    }]
]

</script>