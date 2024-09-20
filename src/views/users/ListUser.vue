<template>
  <div>
    <button class="btn btn-primary" @click.prevent="openCreateModal">Tạo user</button>
    <div>
      List User
      <div class="table-responsive flex">
        <table class="table table-striped table-hover table-borderless table-primary align-middle">
          <thead class="table-light">
            <tr>
              <th>Email</th>
              <th>User Name</th>
              <th>Role</th>
              <th>isLocked</th>
              <th>Sửa</th>
              <th>Xóa</th>
            </tr>
          </thead>
          <tbody class="table-group-divider">
            <tr class="table-primary" v-for="user in users" :key="user.id">
              <td scope="row">{{ user.address }}</td>
              <td>{{ user.username }}</td>
              <td>{{ user.role }}</td>
              <td>{{ user.isLocked }}</td>
              <td><button class="btn btn-primary">&#9998;</button></td>
              <td>
                <button class="btn btn-danger" @click.prevent="openDeleteModal(user)">X</button>
              </td>
            </tr>
          </tbody>
          <tfoot></tfoot>
        </table>
      </div>
    </div>
  </div>

  <Modal :is-visible="isEditModalVisible" @close="closeModal">
    <template #header>
      <h2>{{ isEditMode ? 'Edit User' : 'Create User' }}</h2>
    </template>
    <template #body>
      <form @submit.prevent="handleSubmit">
        <input type="text" placeholder="username" v-model="userForm.username" />
        <input type="password" placeholder="password" v-model="userForm.password" />
        <input type="text" placeholder="full Name" v-model="userForm.fullName" />
        <input type="email" placeholder="Email" v-model="userForm.email" />
        <input type="text" placeholder="job Title" v-model="userForm.jobTitle" />
        <input type="text" placeholder="phone Number" v-model="userForm.phoneNumber" />
        <input type="text" placeholder="Description" v-model="userForm.description" />
        <input type="text" placeholder="Address" v-model="userForm.address" />
        <input type="text" placeholder="homeTown" v-model="userForm.homeTown" />

        <!-- Trường Avatar (tải ảnh lên) -->
        <div>
          <input type="file" id="avatar" @change="handleFileChange" />
          <div v-if="previewImage">
            <img
              :src="previewImage"
              alt="Preview"
              style="width: 4rem; height: 4rem; margin-top: 1rem"
            />
          </div>
        </div>

        <!-- Trường Role (Chọn vai trò) -->
        <div>
          <label for="role">Role:</label>
          <select v-model="userForm.role" id="role">
            <option value="USER">User</option>
            <option value="ADMIN">Admin</option>
          </select>
        </div>

        <!-- Trường isLocked (Khóa tài khoản) -->
        <div>
          <label for="isLocked">Is Locked:</label>
          <input type="checkbox" v-model="userForm.isLocked" id="isLocked" />
        </div>

        <button type="submit" class="btn btn-primary">Submit</button>
      </form>
    </template>
    <template #footer>
      <button @click.prevent="closeModal" class="btn btn-secondary">Hủy</button>
    </template>
  </Modal>

  <!-- Modal Xóa -->
  <Modal :is-visible="isDeleteModalVisible">
    <template #header>
      <h2>Xóa</h2>
    </template>
    <template #body>
      <p>Xac nhận xóa</p>
    </template>
    <template #footer>
      <button @click="confirmDelete">Xóa</button>
      <button @click="closeModal">hủy</button>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import Modal from '@/components/ModalComponent.vue'
import { useUserStore } from '@/stores/userStore'
import { IUser } from '@/typings/users/user'
import axios from 'axios'
import { storeToRefs } from 'pinia'
import { onMounted, reactive, ref } from 'vue'

const userStore = useUserStore()
const { users, roles } = storeToRefs(userStore)

const isEditMode = ref(false) // xac dinh che do chinh sua hay tao
const isEditModalVisible = ref(false)
const isDeleteModalVisible = ref(false)
const previewImage = ref('') // anh xem trc
const selectedUser = ref<IUser | null>(null) // chon user để xóa

// khoi tao form
const userForm = reactive<IUser>({
  username: '',
  password: '',
  fullName: '',
  email: '',
  jobTitle: '',
  phoneNumber: '',
  description: '',
  address: '',
  homeTown: '',
  avatar: '',
  role: 'USER',
  isLocked: false
})

const closeModal = () => {
  isEditModalVisible.value = false
  isDeleteModalVisible.value = false
}

const openCreateModal = () => {
  isEditMode.value = false
  isEditModalVisible.value = true
  resetForm()
}

const openDeleteModal = (user: IUser) => {
  // farm dc chọn
  selectedUser.value = user
  isDeleteModalVisible.value = true
}
const confirmDelete = async () => {
  if (selectedUser.value?.id) {
    try {
      await userStore.deleteUser(selectedUser.value.id)
      isDeleteModalVisible.value = false
      userStore.getAllUser()
    } catch (error) {
      console.log('Error', error)
    }
  } else if (selectedUser.value?.id === 'ADMIN') {
    alert('Không thể xóa quản trị viên!')
    isDeleteModalVisible.value = false
  }
}

const resetForm = () => {
  Object.assign(userForm, {
    username: '',
    password: '',
    fullName: '',
    email: '',
    jobTitle: '',
    phoneNumber: '',
    description: '',
    address: '',
    homeTown: '',
    avatar: '',
    role: 'USER',
    isLocked: false
  })
  previewImage.value = ''
}

const handleFileChange = (event: Event) => {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (file) {
    userForm.avatar = file
    const reader = new FileReader()
    reader.onload = () => {
      previewImage.value = reader.result as string
    }
    reader.readAsDataURL(file)
  }
}

const handleSubmit = async () => {
  isEditModalVisible.value = false

  const formDataToSend = new FormData()
  formDataToSend.append('username', userForm.username)
  formDataToSend.append('password', userForm.password)
  formDataToSend.append('fullName', userForm.fullName)
  formDataToSend.append('email', userForm.email)
  formDataToSend.append('jobTitle', userForm.jobTitle)
  formDataToSend.append('phoneNumber', userForm.phoneNumber)
  formDataToSend.append('description', userForm.description)
  formDataToSend.append('address', userForm.address)
  formDataToSend.append('homeTown', userForm.homeTown)
  formDataToSend.append('role', userForm.role)
  formDataToSend.append('isLocked', userForm.isLocked.toString())

  // kt hinh ảnh
  if (userForm.avatar instanceof File) {
    formDataToSend.append('avatar', userForm.avatar)
  } else if (typeof userForm.avatar === 'string' && userForm.avatar.startsWith('/uploads/users/')) {
    formDataToSend.append('avatar', userForm.avatar.split('/').pop() as string)
  } else {
    formDataToSend.append('avatar', '/uploads/users/default-imag.png')
  }

  // chuyen doi mode MODAL
  try {
    if (isEditMode.value) {
      //aw
    } else {
      await userStore.createUser(formDataToSend)
    }
    isEditModalVisible.value = false
    alert('Admin tạo tài khoản thành công')
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 500) {
      console.error('Server error', error.response.data)
    }
  }
}

// show items khi lấy trong store
onMounted(() => {
  userStore.getAllUser()
})
</script>

<style scoped></style>
