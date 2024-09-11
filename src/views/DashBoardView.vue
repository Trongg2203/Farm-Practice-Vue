<template>
  <!-- Tạo mới farm -->
  <button class="btn btn-success mt-3" @click.prevent="openCreateModal">Tạo mới</button>
  <div class="flex">
    <table class="table">
      <thead>
        <tr>
          <th scope="col">Name</th>
          <th scope="col">Business_mode</th>
          <th scope="col">Business_type</th>
          <th scope="col">Province</th>
          <th scope="col">District</th>
          <th scope="col">Wards</th>
          <th scope="col">Address</th>
          <th scope="col">Region</th>
          <th scope="col">Location</th>
          <th scope="col">Phone Number</th>
          <th scope="col">User_representative</th>
          <th scope="col">Email</th>
          <th scope="col">Img</th>
          <th scope="col">Sửa</th>
          <th scope="col">Xóa</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="farm in farms" :key="farm.id">
          <td>{{ farm.name }}</td>
          <td>{{ farm.business_model }}</td>
          <td>{{ farm.business_type }}</td>
          <td>{{ farm.province }}</td>
          <td>{{ farm.district }}</td>
          <td>{{ farm.wards }}</td>
          <td>{{ farm.address }}</td>
          <td>{{ farm.location.latitude }}, {{ farm.location.longitude }}</td>
          <td>{{ farm.region }}</td>
          <td>{{ farm.phoneNumber }}</td>
          <td>{{ farm.user_representative }}</td>
          <td>{{ farm.email }}</td>
          <td>
            <img
              :src="getImageUrl(farm.image)"
              :alt="farm.image"
              style="width: 4rem; height: 4rem"
            />
          </td>
          <td><button class="btn btn-light" @click.prevent="openEditModal(farm)">...</button></td>
          <td><button class="btn btn-danger" @click.prevent="openDeleteModal(farm)">X</button></td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- Modal Create/Edit -->

  <Modal :isVisible="isEditModalVisible" @close="closeModal">
    <template #header>
      <h2>{{ isEditMode ? 'Edit Farm' : 'Create Farm' }}</h2>
    </template>
    <template #body>
      <form @submit.prevent="handleSubmit">
        <input v-model="formData.name" placeholder="Name" class="form-control my-2" required />
        <input
          v-model="formData.business_model"
          placeholder="Business Model"
          class="form-control my-2"
          required
        />
        <input
          v-model="formData.business_type"
          placeholder="Business Type"
          class="form-control my-2"
          required
        />
        <input
          v-model="formData.province"
          placeholder="Province"
          class="form-control my-2"
          required
        />
        <input
          v-model="formData.district"
          placeholder="District"
          class="form-control my-2"
          required
        />
        <input v-model="formData.wards" placeholder="Wards" class="form-control my-2" required />
        <input
          v-model="formData.address"
          placeholder="Address"
          class="form-control my-2"
          required
        />
        <input v-model="formData.region" placeholder="Region" class="form-control my-2" required />
        <input
          v-model="formData.location.latitude"
          placeholder="Latitude"
          class="form-control my-2"
          required
        />
        <input
          v-model="formData.location.longitude"
          placeholder="Longitude"
          class="form-control my-2"
          required
        />
        <input
          v-model="formData.phoneNumber"
          placeholder="Phone Number"
          class="form-control my-2"
          required
        />
        <input
          v-model="formData.user_representative"
          placeholder="User Representative"
          class="form-control my-2"
          required
        />
        <input
          v-model="formData.email"
          placeholder="Email"
          type="text"
          class="form-control my-2"
          required
        />

        <!-- Input cho hình ảnh -->
        <input type="file" @change="handleFileChange" class="form-control my-2" />
        <div v-if="previewImage">
          <img
            :src="previewImage"
            alt="Preview"
            style="width: 4rem; height: 4rem; margin-top: 1rem"
          />
        </div>

        <button type="submit">{{ isEditMode ? 'Update' : 'Create' }}</button>
      </form>
    </template>
    <template #footer>
      <button @click.prevent="closeModal" class="btn btn-secondary">Hủy</button>
    </template>
  </Modal>

  <!-- Modal Xóa -->
  <Modal :is-visible="isDeleteModalVisible" @click="closeModal">
    <template #header>
      <h2>Xác nhận xóa</h2>
    </template>
    <template #body>
      <p>Bạn có chắc sẽ xóa hay không ?</p>
    </template>
    <template #footer>
      <button @click="confirmDelete" class="btn btn-danger">Xóa</button>
      <button @click="closeModal" class="btn btn-secondary">Hủy</button>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { onMounted, onUnmounted, reactive, ref } from 'vue'
// import { useAuthStore } from '../stores/authStore'
import { useFarmsStore } from '../stores/farmStore'
import { getImageUrl } from '../helpers/getImage'
import Modal from '../components/ModalComponent.vue'
import { CreateFarmRequest, Farm } from '@/typings/farms'
import axios from 'axios'
// const authStore = useAuthStore()

const farmsStore = useFarmsStore()
const { farms, meta, currentPage, hasPreviousPage, hasNextPage } = storeToRefs(farmsStore)
const isEditMode = ref(false)  // Xác định chế độ chỉnh sửa hay tạo mới
const isEditModalVisible = ref(false) // Hiển thị/Ẩn modal chỉnh sửa
const isDeleteModalVisible = ref(false) // Hiển thị/Ẩn modal xóa
const formData = reactive<CreateFarmRequest>({
  name: '',
  business_model: '',
  business_type: '',
  province: '',
  district: '',
  wards: '',
  address: '',
  region: '',
  location: { latitude: 0, longitude: 0 },
  phoneNumber: '',
  user_representative: '',
  email: '',
  image: ''
})

const previewImage = ref('') // Lưu trữ đường dẫn hình ảnh xem trước

const selectedFarm = ref<Farm | null>(null)

const closeModal = () => {
  isEditModalVisible.value = false
}
const openCreateModal = () => {
  isEditMode.value = false
  isEditModalVisible.value = true

  // reset formData
  // Target Đối tượng đích mà các thuộc tính sẽ được sao chép vào.
  // { ...Course } Một hoặc nhiều đối tượng nguồn từ đó các thuộc tính sẽ được sao chép.
  Object.assign(formData, {
    name: '',
    business_model: '',
    business_type: '',
    province: '',
    district: '',
    wards: '',
    address: '',
    region: '',
    location: { latitude: 0, longitude: 0 },
    phoneNumber: '',
    user_representative: '',
    email: '',
    image: ''
  })
  previewImage.value = ''
}

const handleSubmit = async () => {
  // Tạo một đối tượng FormData để gửi dữ liệu
  const formDataToSend = new FormData()
    // Thêm các trường bắt buộc vào FormData
  formDataToSend.append('name', formData.name)
  formDataToSend.append('business_model', formData.business_model)
  formDataToSend.append('business_type', formData.business_type)
  formDataToSend.append('province', formData.province)
  formDataToSend.append('district', formData.district)
  formDataToSend.append('wards', formData.wards)
  formDataToSend.append('address', formData.address)
  formDataToSend.append('location', JSON.stringify(formData.location))

  // Thêm các trường tùy chọn, nếu không có thì gửi chuỗi rỗng
  formDataToSend.append('region', formData.region || '')
  formDataToSend.append('phoneNumber', formData.phoneNumber || '')
  formDataToSend.append('user_representative', formData.user_representative || '')
  formDataToSend.append('email', formData.email || '')

   // Thêm hình ảnh nếu có, nếu không thì sử dụng hình ảnh mặc định
  if (formData.image instanceof File) {
    // Nếu formData.image là đối tượng File, thêm vào FormData với tên file
    formDataToSend.append('image', formData.image , formData.image.name)
  } else if(typeof formData.image ==='string' && formData.image.startsWith('/uploads/farms/')){
    // Nếu formData.image là chuỗi và bắt đầu bằng '/uploads/farms/', thêm vào FormData
    formDataToSend.append('image', formData.image);
  }else{
     // Nếu không có hình ảnh hợp lệ, sử dụng hình ảnh mặc định
    formDataToSend.append('image', '/uploads/farms/default-image.png');
  }
  
  try {
     // Nếu đang ở chế độ chỉnh sửa, gọi API để cập nhật farm, ngược lại gọi API để tạo mới farm
    if (isEditMode.value) {
      await farmsStore.updateFarm(formData.id!, formDataToSend)
    } else {
      await farmsStore.createFarm(formDataToSend)
    }
    isEditModalVisible.value = false
    console.log('Farm operation successful')
  } catch (error) {
    console.error('Error saving farm:', error)
    if (axios.isAxiosError(error) && error.response?.status === 500) {
      console.error('Server error', error.response.data)
    }
  }
}

const handleFileChange = (event: Event) => {
  // Chuyển đổi sự kiện thành HTMLInputElement để truy cập các thuộc tính của input
  const input = event.target as HTMLInputElement
  // Lấy file đầu tiên từ các file được chọn trong input
  const file = input.files?.[0]
  if (file) {
    // Gán file vào formData.image để lưu trữ thông tin về hình ảnh
    formData.image = file 
    // Tạo một đối tượng FileReader để đọc nội dung file
    const reader = new FileReader()
     // Khi đọc file hoàn tất, cập nhật previewImage với dữ liệu hình ảnh
    reader.onload = () => {
      previewImage.value = reader.result as string
    }
    // Đọc nội dung file dưới dạng URL Data để sử dụng cho việc hiển thị trước
    reader.readAsDataURL(file)
  }
}

const openEditModal = (farm: Farm) => {
  isEditMode.value = true
  isEditModalVisible.value = true
  // Sao chép thông tin farm vào formData, đặt hình ảnh thành null
  Object.assign(formData, { ...farm, image: null })
  // Cập nhật previewImage với hình ảnh của farm (hoặc chuỗi rỗng nếu không có hình ảnh)
  previewImage.value = farm.image || ''
}

const openDeleteModal = (farm: Farm) => {
  // Gán farm được chọn vào selectedFarm
  selectedFarm.value = farm
  isDeleteModalVisible.value = true
}

const confirmDelete = async () => {
  if (selectedFarm.value?.id) {
    try {
      await farmsStore.deleteFarm(selectedFarm.value.id)
      isDeleteModalVisible.value = false
      farmsStore.fetchFarms()
    } catch (error) {
      console.log('Error', error)
    }
  }
}

// không có onMounted
// API sẽ không được gọi và component có thể không hiển thị thông tin
// Hàm này không tự động chạy khi component được mount.
// Nó chỉ là một hàm được định nghĩa để chứa logic gọi API.
const fetchFarms = () => {
  farmsStore.fetchFarms() // Gọi API để tải dữ liệu từ máy chủ
}

// onMounted để đảm bảo rằng khi component này được tạo và hiển thị lần đầu tiên
// Nếu không có onMounted, hàm fetchFarms sẽ không bao giờ được gọi khi component được mount, vì không có gì kích hoạt nó.
onMounted(() => {
  fetchFarms()
})

// onMounted(() => {
//   authStore.initializeAuthState
// })
</script>

<style>
.flex {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.table {
  max-width: 90%;
}
</style>
