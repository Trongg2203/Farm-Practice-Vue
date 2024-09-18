<template>
  <div>
    WellCome to profile {{ currentUser?.fullName }}
    <div v-if="currentUser?.avatar">
      <img :src="getImageUrl(currentUser.avatar!)" alt="User Avatar" width="300" height="300" />
    </div>
    <div class="info-user">
      <div>
        <p>Full Name: {{ currentUser?.fullName }}</p>
        <p>Address: {{ currentUser?.address }}</p>
        <p>Job: {{ currentUser?.jobTitle }}</p>
        <p>phone Number: {{ currentUser?.phoneNumber }}</p>
        <p>Description: {{ currentUser?.description }}</p>
        <p>Home Town: {{ currentUser?.homeTown }}</p>
        <!-- <p>Email: {{ currentUser?.email }}</p> -->
      </div>
      <div>
        <button class="btn btn-primary" @click.prevent="openEditProfile">Edit Profile</button>
      </div>
    </div>
    <!-- table account admin -->
    <div class="flex" v-if="authStore.isAdmin">
      <table class="table">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">First</th>
            <th scope="col">Last</th>
            <th scope="col">Handle</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">1</th>
            <td>Mark</td>
            <td>Otto</td>
            <td>@mdo</td>
          </tr>
          <tr>
            <th scope="row">2</th>
            <td>Jacob</td>
            <td>Thornton</td>
            <td>@fat</td>
          </tr>
          <tr>
            <th scope="row">3</th>
            <td colspan="2">Larry the Bird</td>
            <td>@twitter</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- account user -->
    <Modal :isVisible="isEditProfile" @close="closeModal">
      <template #header>
        <h2>Edit</h2>
      </template>
      <template #body>
        <form @submit.prevent="handleConfirmEdit">
          <div>
            <label for="fullName">Full Name</label>
            <input type="text" id="fullName" v-model="formProfile.fullName" />
          </div>
          <div>
            <label for="jobTitle">jobTitle</label>
            <input type="text" id="jobTitle" v-model="formProfile.jobTitle" />
          </div>
          <div>
            <label for="Address">Address</label>
            <input type="text" id="Address" v-model="formProfile.address" />
          </div>
          <div>
            <label for="Description">Description</label>
            <input type="text" id="Description" v-model="formProfile.description" />
          </div>
          <div>
            <label for="phoneNumber">phoneNumber</label>
            <input type="text" id="phoneNumber" v-model="formProfile.phoneNumber" />
          </div>
          <div>
            <label for="HomTown">HomTown</label>
            <input type="text" id="HomTown" v-model="formProfile.homeTown" />
          </div>
          <div>
            <label for="avatar">Avatar</label>
            <input type="file" @change="handleFileAvatar" id="avatar" />
          </div>
          <button type="submit" class="btn btn-success mt-3">Xác nhận</button>
        </form>
      </template>
      <template #footer></template>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import Modal from '@/components/ModalComponent.vue'
import { getImageUrl } from '@/helpers/getImage'
import { useAuthStore } from '@/stores/authStore'
import { useUserStore } from '@/stores/userStore'
import type { IEditProfile } from '@/typings/users/uses'
import { storeToRefs } from 'pinia'
import { onMounted, reactive, ref } from 'vue'

const authStore = useAuthStore()
const userStore = useUserStore()
const { currentUser } = storeToRefs(userStore)

onMounted(() => {
  userStore.getUserLogged()
})

const isEditProfile = ref(false)

const handleConfirmEdit = () => {
  const data = new FormData()
  // hop le
  let isValid = true
  data.append('fullName', formProfile.fullName)
  data.append('jobTitle', formProfile.jobTitle)
  data.append('address', formProfile.address)
  data.append('phoneNumber', formProfile.phoneNumber)
  data.append('description', formProfile.description)
  data.append('homeTown', formProfile.homeTown)
  // k hop le
  if (!isValid) return
  // kiem tra anh va them
  if (formProfile.avatar instanceof File) {
    data.append('avatar', formProfile.avatar)
  } else if (
    typeof formProfile.avatar == 'string' &&
    formProfile.avatar.startsWith('/uploads/users/')
  ) {
    data.append('avatar', formProfile.avatar)
  } else {
    data.append('avatar', '/uploads/users/default-image.png')
  }

  userStore.editProfile(data)
  alert('Chỉnh sửa tài khoản thành công')
  isEditProfile.value = false
}

// khoi tao form
const formProfile = reactive<IEditProfile>({
  fullName: '',
  jobTitle: '',
  phoneNumber: '',
  description: '',
  address: '',
  homeTown: '',
  avatar: ''
})

// handle image base64
const handleFileAvatar = (e: Event) => {
  const input = e.target as HTMLInputElement
  if (input.files && input.files.length) {
    const file = input.files[0]
    const reader = new FileReader()
    reader.onload = () => {
      const base64String = reader.result as string
      formProfile.avatar = base64String

      // convert base64 -> File
      // const avatarFile = base64ToFile(base64String, file.name)
      // formProfile.avatar = avatarFile
    }
    reader.readAsDataURL(file)
  }
}

// hàm base64 sang File
function base64ToFile(base64String: string, filename: string): File {
  // Tách phần dữ liệu base64 từ tiền tố "data:image/jpeg;base64," hoặc "data:image/png;base64,"
  const arr = base64String.split(',')
  const mime = arr[0].match(/:(.*?);/)![1] // Lấy định dạng MIME (VD: "image/jpeg" hoặc "image/png")
  const bstr = atob(arr[1]) // Giải mã chuỗi Base64 thành chuỗi nhị phân
  let n = bstr.length
  const u8arr = new Uint8Array(n)

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }

  // Tạo đối tượng File mới từ mảng byte và MIME
  return new File([u8arr], filename, { type: mime })
}

const closeModal = () => {
  isEditProfile.value = false
}

const openEditProfile = async () => {
  try {
    // Gọi hàm getUserLogged để lấy dữ liệu từ API
    await userStore.getUserLogged()

    // Sau khi dữ liệu được lấy về, truy cập currentUser từ store
    const user = userStore.currentUser

    // Gán dữ liệu từ store vào reactive object
    formProfile.fullName = user?.fullName || ''
    formProfile.jobTitle = user?.jobTitle || ''
    formProfile.address = user?.address || ''
    formProfile.phoneNumber = user?.phoneNumber || ''
    formProfile.description = user?.description || ''
    formProfile.homeTown = user?.homeTown || ''
    formProfile.avatar = user?.avatar || '/uploads/users/default-image.png'

    isEditProfile.value = true // Hiển thị form edit
  } catch (error) {
    console.error('Lỗi khi tải dữ liệu user:', error)
    alert('Khong the cap nhat user')
  }
}
</script>

<style scoped>
.info-user {
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin-top: 2rem;
}
</style>
