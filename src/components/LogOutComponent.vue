<template>
  <nav class="navbar bg-body-tertiary">
    <div class="container-fluid">
      <a class="navbar-brand">Navbar</a>

      <button class="btn btn-outline-success" type="button" @click.prevent="handleLogOut">
        Log Out
      </button>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { onBeforeMount, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/authStore'

const authStore = useAuthStore()
const router = useRouter()

const handleLogOut = () => {
  authStore.logout()
  router.push('/login')
}

onBeforeMount(() => {
  if (authStore.initializeAuthState()) {
    return true
  }
})
</script>

<style scoped></style>
