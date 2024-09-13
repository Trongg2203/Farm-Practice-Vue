<template>
  <div class="flex">
    <form class="form" @submit.prevent="handleRegister">
      <h3>Đăng ký</h3>
      <p id="error" style="display: none;"></p>
      <div class="">
        <label for="exampleInputUsername" class="form-label">User Name</label>
        <input v-model="formData.username" type="text" />
      </div>
      <div class="">
        <label for="exampleInputPassword" class="form-label">Password</label>
        <input v-model="formData.password" type="password" class="" aria-describedby="emailHelp" />
      </div>
      <div class="">
        <label for="exampleInputFullName" class="form-label">Full name</label>
        <input v-model="formData.fullName" type="text" class="" aria-describedby="emailHelp" />
      </div>
      <div class="">
        <label for="exampleInputEmail1" class="form-label">Email address</label>
        <input v-model="formData.email" type="email" class="" aria-describedby="emailHelp" />
      </div>
      <div class="">
        <label for="exampleInputJobTitle" class="form-label">jobTitle</label>
        <input v-model="formData.jobTitle" type="text" class="" aria-describedby="emailHelp" />
      </div>
      <div class="">
        <label for="exampleInputPhoneNumber" class="form-label">Phone Number</label>
        <input v-model="formData.phoneNumber" type="text" class="" aria-describedby="emailHelp" />
      </div>
      <div class="">
        <label for="exampleInputDescription" class="form-label">Description</label>
        <input v-model="formData.description" type="text" class="" aria-describedby="emailHelp" />
      </div>
      <div class="">
        <label for="exampleInputAddress" class="form-label">Address</label>
        <input v-model="formData.address" type="text" class="" aria-describedby="emailHelp" />
      </div>
      <div class="">
        <label for="exampleInputHomeTown" class="form-label">HomeTown</label>
        <input v-model="formData.homeTown" type="text" class="" aria-describedby="emailHelp" />
      </div>
      <div>
        <label for="avatar">Avatar</label>
        <input @change="handleFileAvatar" type="file" id="avatar" />
      </div>
      <div class="form-check">
        <router-link :to="{ name: 'Login' }"> &#10004; Đã có tài khoản</router-link>
      </div>
      <button type="submit" class="btn btn-primary">Đăng ký</button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/authStore'
import { Register } from '@/typings/auth'
import { reactive, ref } from 'vue'

const authStore = useAuthStore()
const errorMessage = ref(false)

// khoi tao form Register
const formData = reactive<Register>({
  username: '',
  password: '1da',
  fullName: 'acc2',
  email: '123a@gmail.com',
  jobTitle: 'ac2',
  phoneNumber: 'ca5',
  description: 'vq7',
  address: 'tw48',
  homeTown: 'sad2',
  avatar: '',
  role: 'USER'
})

// xu lý file ảnh
const handleFileAvatar = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files && input.files.length) {
    formData.avatar = input.files[0]
  }
}
// dang kyy
// const handleRegister = () => {
//   const data = new FormData()
//   if (formData.username === '') {
//     document.getElementById('error')!.innerHTML = 'User name không đươc để trống'
//     document.getElementById('error')!.style.color = 'red'
//     document.getElementById('error')!.style.display ='block'
//   }
//   else {
//     data.append('username', formData.username.toString())
//   }
//   data.append('password', formData.password)
//   data.append('fullName', formData.fullName)
//   data.append('email', formData.email)
//   data.append('jobTitle', formData.jobTitle)
//   data.append('phoneNumber', formData.phoneNumber)
//   data.append('description', formData.description)
//   data.append('address', formData.address)
//   data.append('homeTown', formData.homeTown)
//   data.append('role', formData.role)
//   // kt và thêm ảnh
//   if (formData.avatar) {
//     data.append('avatar', formData.avatar)
//   }

//   // for (let [key, value] of data.entries()) {
//   //     console.log(key, value);
//   // }

//   // goi hàm store de dang ky form
//   authStore.register(data)
// }

const handleRegister = () => {
  const data = new FormData()
  let isValid = true

  // Kiểm tra từng trường và hiển thị lỗi nếu trống
  const fields = [
    { field: 'username', message: 'User name không được để trống' },
    { field: 'password', message: 'Password không được để trống' },
    { field: 'fullName', message: 'Full name không được để trống' },
    { field: 'email', message: 'Email không được để trống' },
    { field: 'jobTitle', message: 'Job title không được để trống' },
    { field: 'phoneNumber', message: 'Phone number không được để trống' },
    { field: 'description', message: 'Description không được để trống' },
    { field: 'address', message: 'Address không được để trống' },
    { field: 'homeTown', message: 'HomeTown không được để trống' }
  ]

  fields.forEach(({ field, message }) => {
    if (formData[field as keyof Register] === '') {
      document.getElementById('error')!.innerHTML = message
      document.getElementById('error')!.style.color = 'red'
      document.getElementById('error')!.style.display = 'block'
      isValid = false
    } else {
      data.append(field, formData[field as keyof Register].toString())
    }
  })

  // Nếu không hợp lệ, dừng việc submit
  if (!isValid) return

  // Kiểm tra và thêm ảnh
  if (formData.avatar instanceof File) {
    data.append('avatar', formData.avatar)  
  }
  else if(typeof formData.avatar =='string' && formData.avatar.startsWith('/uploads/users/')){
    data.append('avatar', formData.avatar)
  }
  else{
  data.append('avatar','/uploads/users/default-image.png')
  }

  // Gọi hàm store để đăng ký form
  authStore.register(data)
}
</script>

<style scoped>
a {
  position: relative;
  transition: 0.2s;
}
a::after {
  content: '';
  background-color: black;
  position: absolute;
  bottom: -2px;
  left: 0;
  height: 2px;
  width: 0;
  transition: 0.3s;
}
a:hover::after {
  background-color: #000000;
  width: 100%;
}
.flex {
  display: flex;
  justify-content: center;
  align-items: center;
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
