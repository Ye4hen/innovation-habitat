<script setup>
import { onMounted, computed, ref, reactive } from 'vue'
import { useLocales } from '@/modulesHelpers/i18n.js'
const { locale } = useLocales()
import { RouterLink } from 'vue-router'
import { useProductsStore } from '@/stores/products'
const productsStore = useProductsStore()
import { useUsersStore } from '@/stores/users'
const usersStore = useUsersStore()
import { useAuthStore } from '@/stores/auth'
import ProductItem from '@/components/ProductItem/index.vue'
const authStore = useAuthStore()
const getUserFromStorage = JSON.parse(localStorage.getItem('InHabUser'))
const productsList = computed(() => productsStore.getItemsList ?? [])
import { useGeneralStore } from '@/stores/general'
import { storeToRefs } from 'pinia'
const generalStore = useGeneralStore()
const { isLoading, hasError } = storeToRefs(generalStore)

let user = reactive({
  id: getUserFromStorage?.id,
  data: {}
})
const bestProductsList = computed(() => {
  return productsList.value.filter((product) => {
    return product.isBest
  })
})

const checkLang = computed(() => {
  return (item) => {
    if (locale.value == 'ua') return item?.ua
    else if (locale.value == 'en') return item?.en
  }
})

const alreadyInArray = computed(() => {
  return (productId, list) => {
    const foundItem = list.find((item) => item === productId)
    if (list && foundItem) {
      return 'icon-active'
    }
    return null
  }
})

onMounted(async () => {
  productsStore.loadItemsList()
  if (getUserFromStorage) {
    user.data = await usersStore.loadItemById(getUserFromStorage.id)
  }
})
</script>

<template>
  <ul v-if="bestProductsList.length" class="best-products__list products__list">
    <ProductItem :productsList="bestProductsList" :needActions="true" :user="user" />
  </ul>
  <div v-else class="loading-container">
    <font-awesome-icon :icon="['fas', 'spinner']" size="6x" spin-pulse class="icon" />
  </div>
</template>


<style lang="scss" scoped>
.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>