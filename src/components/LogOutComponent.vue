<template>
  <nav class="navbar bg-body-tertiary">
    <div class="container-fluid">
      <a class="navbar-brand" href="/home">Navbar</a>
      <!-- quyền admin -->
      <a href="/dashboard" v-if="authStore.isAdmin">Dashboard</a>
      <router-link :to="{name:'UserMy'}">Tài khoản</router-link>
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

// onBeforeMount(() => {
//   if (authStore.initializeAuthState()) {
//     return true
//   }
// })
</script>

<style scoped></style>
