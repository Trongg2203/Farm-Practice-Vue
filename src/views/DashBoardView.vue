<template>
  <div>Dashboard</div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useAuthStore } from '../stores/authStore'

const authStore = useAuthStore()

// onMounted(() => {
//   authStore.initializeAuthState
// })
</script>

<style lang="scss" scoped></style>
