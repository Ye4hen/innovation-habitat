<script setup>
import { onMounted, computed, ref } from 'vue'
import { useLocales } from '@/modulesHelpers/i18n.js'
const { t } = useLocales()
import ProductItem from '@/components/ProductItem/index.vue'
import { useProductsStore } from '@/stores/products'
const productsStore = useProductsStore()
import { useUsersStore } from '@/stores/users'
const usersStore = useUsersStore()

const getUserFromStorage = JSON.parse(localStorage.getItem('InHabUser'))

let productsList = computed(() => productsStore.getItemsList ?? [])
let getFilteredList = computed(() => productsStore.getFilteredList ?? productsStore.getItemsList)

let user = ref({
  id: getUserFromStorage?.id,
  data: {}
})

onMounted(async () => {
  if (getUserFromStorage) {
    user.value.data = await usersStore.loadItemById(getUserFromStorage.id)
  }
  await productsStore.loadItemsList()
})
</script>

<template>
  <ul class="shop__list list-shop">
    <ProductItem
      v-if="getFilteredList.length"
      :productsList="getFilteredList"
      :needActions="true"
      :needAnimation="false"
      :user="user"
    />

    <div v-else class="err-msg">{{ $t('filters.filterError') }}</div>
  </ul>
</template>


<style lang="scss" scoped>
</style>