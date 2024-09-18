<template>
  <div class="flex">
    <div v-if="isLoading" class="spinner-border" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
    <!-- <div v-if="isLoading">Loading Page ...</div> -->

    <div v-else-if="error">{{ error }}</div>
    <div v-else-if="selectedFarm">
      <img :src="getImageUrl(selectedFarm.image)" style="width: 500px" />
      <h2>Farm {{ selectedFarm.name }}</h2>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getImageUrl } from '@/helpers/getImage'
import { useFarmsStore } from '@/stores/farmStore'
import { storeToRefs } from 'pinia'
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const farmStore = useFarmsStore()
const { selectedFarm, isLoading, error } = storeToRefs(farmStore)
const route = useRoute()

// lay id tu hàm fecth từ store

onMounted(() => {
  const farmId = route.params.id as string

  farmStore.fetchFarmDetail(farmId)
})
</script>

<style scoped>
.flex {
  display: flex;
  align-content: center;
  justify-items: center;
}

</style>
