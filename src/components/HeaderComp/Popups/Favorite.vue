<script setup>
import { RouterLink, useRouter } from 'vue-router'
import { onMounted, ref, computed, reactive } from 'vue'
import { useLocales } from '@/modulesHelpers/i18n.js'
const { locale, t } = useLocales()
import { useAuthStore } from '@/stores/auth'
const authStore = useAuthStore()
import { useUsersStore } from '@/stores/users'
const usersStore = useUsersStore()
import { useProductsStore } from '@/stores/products'
const productsStore = useProductsStore()
const router = useRouter()

const getUserFromStorage = JSON.parse(localStorage.getItem('InHabUser'))

let user = reactive({
  id: getUserFromStorage?.id,
  data: {}
})

let userFavoriteProducts = ref([])

const loadFavoriteProducts = async () => {
  if (user.data.favorite) {
    const productsPromises = user.data.favorite.map(async (productId) => {
      const productInfo = await productsStore.loadItemById(productId)
      return { id: productId, ...productInfo }
    })

    userFavoriteProducts.value = await Promise.all(productsPromises)
  }
}

const checkLang = computed(() => {
  return (item) => {
    if (locale.value == 'ua') return item?.ua
    else if (locale.value == 'en') return item?.en
  }
})

function closePopup() {
  productsStore.closePopup()
}

function closePopupAndGoToProduct(newProductId) {
  productsStore.closePopup()
  router.push({
    name: 'product',
    params: { productId: newProductId }
  })
  setTimeout(() => {
    router.go()
  }, 100)
}

function deleteProduct(productId) {
  user.data.favorite = user.data.favorite.filter((product) => product !== productId)
  usersStore.updateItem(getUserFromStorage.id, user.data)
  setTimeout(() => {
    router.go()
  }, 100)
}

onMounted(async () => {
  if (getUserFromStorage && getUserFromStorage.id) {
    user.data = await usersStore.loadItemById(getUserFromStorage.id)
  }
  await loadFavoriteProducts()
})
</script>

<template>
  <div class="header-popup__body header-popup-body">
    <button type="button" class="header-popup__close" @click="productsStore.closePopup"></button>
    <ul v-if="userFavoriteProducts.length" class="header-popup-body__list">
      <li
        v-for="product in userFavoriteProducts"
        :key="product.id"
        class="header-popup-body__item header-popup-item"
      >
        <RouterLink
          :to="{ name: 'product', params: { productId: product.id } }"
          class="header-popup-item__image"
          @click="closePopupAndGoToProduct(product.id)"
        >
          <img :src="product.img" :alt="product.name" />
        </RouterLink>
        <div class="header-popup-item__info">
          <h4 class="header-popup-item__name">
            <RouterLink
              :to="{ name: 'product', params: { productId: product.id } }"
              class="header-popup-item__name-link"
              @click="closePopupAndGoToProduct(product.id)"
            >
              {{ checkLang(product.title) }}
            </RouterLink>
          </h4>
          <div class="header-popup-item__category">
            {{ product.category }}
          </div>
        </div>
        <div class="header-popup-item__delete">
          <button class="header-popup-item__delete-btn" @click="deleteProduct(product.id)">
            <font-awesome-icon :icon="['fas', 'trash-can']" size="2x" />
          </button>
        </div>
      </li>
    </ul>
    <div v-else class="header-popup-body__no-product">{{ $t('errors.emptyFavoriteList') }}</div>
  </div>
</template>


<style lang="scss" scoped>
</style>