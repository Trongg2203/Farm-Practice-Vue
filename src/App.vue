<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { RouterLink, RouterView } from 'vue-router'
import { useAuthStore } from './stores/authStore'
import LogOutComponent from './components/LogOutComponent.vue'

const authStore = useAuthStore()

onMounted(() => {
  authStore.initializeAuthState()
})
</script>

<template>
  <LogOutComponent v-if="authStore.isLoggedIn" />
  <RouterView />
</template>

<style scoped></style>
