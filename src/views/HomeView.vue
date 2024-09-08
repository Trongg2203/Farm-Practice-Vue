<template>
  <div>
    Xem farm
    <div v-if="farmsStore.farms.length > 0">
      <ul>
        <li v-for="farm in farms" :key="farm.id">
          <h2>{{ farm.name }}</h2>
          <p>{{ farm.address }}</p>
          <img :src="farm.image" alt="Farm Image" />
        </li>
      </ul>

      <div class="pagination">
        <button @click="prevPage" :disabled="!farmsStore.hasPreviousPage">Previous</button>
        <span>Page {{ farmsStore.currentPage }} of {{ farmsStore.meta.pageCount }}</span>
        <button @click="nextPage" :disabled="!farmsStore.hasNextPage">Next</button>
      </div>
    </div>
    <p v-else>No farms available</p>
  </div>
</template>

<script setup lang="ts">
import { useFarmsStore } from '@/stores/farmStore'
import { storeToRefs } from 'pinia'
import { onMounted, watch } from 'vue'

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

watch(() => farmsStore.currentPage, () => {
  fetchFarms()
})
</script>

<style scoped></style>
