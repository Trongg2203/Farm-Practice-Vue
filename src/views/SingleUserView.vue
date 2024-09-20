<template>
  <button class="btn btn-primary" @click.prevent="openEditProfile">Chỉnh sửa thông tin</button>
  <div class="flex">
    <div v-if="currentUser?.avatar">
      <img :src="getImageUrl(currentUser.avatar)" alt="avatar" />
    </div>
    <div>
      <h1>Hello, {{ currentUser?.fullName }} .</h1>
      <p>Phone Number: {{ currentUser?.phoneNumber }}</p>
      <p>jobTitle: {{ currentUser?.jobTitle }}</p>
      <p>Description: {{ currentUser?.description }}</p>
      <p>address: {{ currentUser?.address }}</p>
      <p>home Town: {{ currentUser?.homeTown }}</p>
    </div>
  </div>

  <!-- modal -->
  <ModalComponent :isVisible="isEditProfile" @close="closeEditProfile">
    <template #header>
      <h2>Edit isEditProfile</h2>
    </template>
    <template #body>
      <form @submit.prevent="handleSubmit">
        <input type="text" placeholder="full Name" v-model="editForm.fullName" />
        <input type="text" placeholder="phone Number" v-model="editForm.phoneNumber" />
        <input type="text" placeholder="jobTitle" v-model="editForm.jobTitle" />
        <input type="text" placeholder="description" v-model="editForm.description" />
        <input type="text" placeholder="address" v-model="editForm.address" />
        <input type="text" placeholder="hometown" v-model="editForm.homeTown" />
        <div>
          <input type="file" id="avatar" @change="handleFileChange" />
          <div v-if="previewImage">
            <img
              :src="previewImage"
              alt="PreviewImage"
              style="width: 4rem; height: 4rem; margin-top: 1rem"
            />
          </div>
        </div>
        <button class="btn btn-success">Xác nhận</button>
      </form>
    </template>
    <template #footer>
      <button class="btn btn-warning" @click="closeEditProfile">Hủy</button>
    </template>
  </ModalComponent>
</template>

<script setup lang="ts">
import ModalComponent from '@/components/ModalComponent.vue'
import { getImageUrl } from '../helpers/getImage'
import { useUserStore } from '@/stores/userStore'
import { storeToRefs } from 'pinia'
import { onMounted, reactive, ref } from 'vue'
import type { IEditProfile, IIsUserLogged } from '@/typings/users/user'

const userStore = useUserStore()
const { currentUser } = storeToRefs(userStore)
const isEditProfile = ref(false)
const previewImage = ref('')

const closeEditProfile = () => {
  isEditProfile.value = false
}
const openEditProfile = () => {
  isEditProfile.value = true

  // gan data cu vao edit Form
  if (currentUser.value) {
    editForm.fullName = currentUser.value.fullName || ''
    editForm.phoneNumber = currentUser.value.phoneNumber || ''
    editForm.jobTitle = currentUser.value.jobTitle || ''
    editForm.description = currentUser.value.description || ''
    editForm.address = currentUser.value.address || ''
    editForm.homeTown = currentUser.value.homeTown || ''
    previewImage.value = getImageUrl(currentUser.value.avatar) || ''
  }
}

const editForm = reactive<IEditProfile>({
  fullName: '',
  phoneNumber: '',
  jobTitle: '',
  description: '',
  address: '',
  homeTown: '',
  avatar: ''
})

const handleFileChange = (e: Event) => {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  if (file) {
    editForm.avatar = file

    // Hiển thị ảnh preview khi người dùng chọn file mới
    const reader = new FileReader()
    reader.onload = () => {
      previewImage.value = reader.result as string
    }
    reader.readAsDataURL(file)
  }
}

const handleSubmit = async () => {
  const formEditToSend = new FormData()
  formEditToSend.append('fullName', editForm.fullName)
  formEditToSend.append('phoneNumber', editForm.phoneNumber)
  formEditToSend.append('jobTitle', editForm.jobTitle)
  formEditToSend.append('description', editForm.description)
  formEditToSend.append('address', editForm.address)
  formEditToSend.append('homeTown', editForm.homeTown)

  if (editForm.avatar instanceof File) {
    formEditToSend.append('avatar', editForm.avatar)
  }
  await userStore.editProfile(formEditToSend)
  alert('câp nhật thành công')
  isEditProfile.value = false
}
onMounted(() => {
  userStore.getUserLogged()
})
</script>

<style scoped>
img {
  border-radius: 50%;
  height: 300px;
  width: 300px;
}
.btn {
  margin: 0 5px;
}
</style>
