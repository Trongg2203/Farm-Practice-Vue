<template>
  <div>
    Xem farm
    <div v-if="farmsStore.farms.length > 0">
      <div class="card" style="width: 18rem" v-for="farm in farms" :key="farm.id">
        <img :src="getImageUrl(farm.image)" class="card-img-top" style=" height: 18rem;" :alt="farm.image" />
        <div class="card-body">
          <h3>{{ farm.name }}</h3>
          <p class="card-text">
            {{ farm.address }}
          </p>
        </div>
      </div>

      <div class="pagination">
        <button @click.prevent="prevPage" :disabled="!farmsStore.hasPreviousPage">Previous</button>
        <span>Page {{ farmsStore.currentPage }} of {{ farmsStore.meta.pageCount }}</span>
        <button @click.prevent="nextPage" :disabled="!farmsStore.hasNextPage">Next</button>
      </div>
    </div>
    <p v-else>No farms available</p>
  </div>
</template>

<script setup lang="ts">
import { useFarmsStore } from '@/stores/farmStore'
import { storeToRefs } from 'pinia'
import { onMounted, watch } from 'vue'
import { getImageUrl } from '../globalFunction/getImage'

const farmsStore = useFarmsStore()
//
const { farms, meta, currentPage, hasPreviousPage, hasNextPage } = storeToRefs(farmsStore)

const fetchFarms = () => {
  farmsStore.fetchFarms()
}

const nextPage = () => {
  farmsStore.nextPage()
}

const prevPage = () => {
  farmsStore.prevPage()
}

onMounted(() => {
  fetchFarms()
})

// theo doi data thay doi va call lai html k nên dung ở đây vì trong store đã dùng this.currentPage
// watch(
//   () => farmsStore.currentPage,
//   () => {
//     fetchFarms()
//   }
// )
</script>

<style scoped></style>
