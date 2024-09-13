<template>
  <div class="flex">
    <form class="form" @submit.prevent="handleLogin">
      <h3>Đăng nhập</h3>
      <div class="mb-3">
        <label for="exampleInputEmail1" class="form-label">Email address</label>
        <input
          type="text"
          class="form-control"
          id="exampleInputEmail1"
          aria-describedby="emailHelp"
          v-model="username"
        />
        <div id="emailHelp" class="form-text">We'll never share your email with anyone else.</div>
      </div>
      <div class="mb-3">
        <label for="exampleInputPassword1" class="form-label">Password</label>
        <input type="password" class="form-control" id="exampleInputPassword1" v-model="password" />
      </div>

      <div class="col">
        <button type="submit" class="btn btn-primary col-6">Đăng nhập</button>
        <button @click.prevent="register" class="btn btn-register col-6">Đăng ký</button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { useAuthStore } from '../stores/authStore'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const username = ref('')
const password = ref('')

const authStore = useAuthStore()
const router = useRouter()

// const error = ref('')
const register = () =>{
  router.push('/register')
}

const handleLogin = async () => {
  try {
    await authStore.login(username.value, password.value)

    if (authStore.isAdmin) {
      router.push('/dashboard')
    } else if (authStore.isUser) {
      router.push('/home')
    }
  } catch (error) {
    console.log('Login Error: ', error.message)
  }
}
</script>

<style>

.btn-register{
  border: 1px solid #ccc;
}
.flex {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}
.form {
  border: 1px solid rgb(209, 204, 204);
  padding: 30px 40px;
  border-radius: 20px;
  box-shadow:
    0 4px 6px -1px rgb(0 0 0 / 0.1),
    0 2px 4px -2px rgb(0 0 0 / 0.1);
}
</style>
