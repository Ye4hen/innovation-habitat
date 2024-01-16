<script setup>
import { computed, onMounted, ref, watch, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useLocales } from '@/modulesHelpers/i18n.js'
const { locale, t } = useLocales()
const route = useRoute()
const router = useRouter()

import MainMasterPage from '@/masterpages/MainMasterPage.vue'
import { useProductsStore } from '@/stores/products'
const productsStore = useProductsStore()
import { useUsersStore } from '@/stores/users'
const usersStore = useUsersStore()
import { useAuthStore } from '@/stores/auth'
const authStore = useAuthStore()
import { useGeneralStore } from '@/stores/general'
import { storeToRefs } from 'pinia'
const generalStore = useGeneralStore()
const { isLoading, hasError } = storeToRefs(generalStore)

import ProductItem from '@/components/ProductItem/index.vue'

import SuccessPopup from '@/components/Popups/SuccessPopup.vue'
const productsList = computed(() => productsStore.getItemsList ?? [])

let product = ref({})
const getUserFromStorage = JSON.parse(localStorage.getItem('InHabUser'))

const user = reactive({
  id: getUserFromStorage?.id,
  data: {}
})

let errorMessage = ref(null)
let productAmount = ref(1)

const productId = computed(() => route.params.productId)

const similarProductsList = computed(() => {
  return productsList.value.filter((productFound) => {
    return productFound.id !== productId.value && productFound.category === product.value.category
  })
})

const checkLang = computed(() => {
  return (item) => {
    if (locale.value == 'ua') return item.ua
    else if (locale.value == 'en') return item.en
  }
})

const titleLang = computed(() => {
  const chosenProduct = product.value

  if (!chosenProduct || !chosenProduct.title) {
    return null
  }

  if (locale.value === 'ua' && chosenProduct.title.ua) {
    return chosenProduct.title.ua
  } else if (locale.value === 'en' && chosenProduct.title.en) {
    return chosenProduct.title.en
  }
})

const descLang = computed(() => {
  const chosenProduct = product.value

  if (!chosenProduct || !chosenProduct.desc) {
    return null
  }

  if (locale.value === 'ua' && chosenProduct.desc.ua) {
    return chosenProduct.desc.ua
  } else if (locale.value === 'en' && chosenProduct.desc.en) {
    return chosenProduct.desc.en
  }
})

const productPrice = computed(() => {
  if (product.value && product.value.price) {
    return (product.value.price * productAmount.value).toFixed(2)
  } else return null
})

const alreadyInArray = computed(() => {
  return (productId, list) => {
    if (user && user.id) {
      const foundItem = list && list.find((item) => item === productId)
      if (list && foundItem) {
        return 'icon-active'
      }
    }
    return null
  }
})

function decreaseAmount() {
  if (productAmount.value > 1) {
    productAmount.value -= 1
  }
}

function increaseAmount() {
  productAmount.value += 1
}

function changeProduct(newProductId) {
  router.push({
    name: 'product',
    params: { productId: newProductId }
  })
  setTimeout(() => {
    router.go()
  }, 100)
}

function onBuyAction() {
  usersStore.onBuy(user.id, productId.value, productPrice.value, user.data).then((error) => {
    errorMessage.value = error
    productAmount.value = 1
  })
  if (parseFloat(productPrice.value) > parseFloat(user.data.balance)) {
    productAmount.value = 1
  }
}

function addToTheList(list) {
  if (user.id) {
    usersStore.addToList(user, list, productId.value)
    setTimeout(() => {
      router.go()
    }, 100)
  } else {
    router.push({
      name: 'register'
    })
  }
}

onMounted(async () => {
  productsStore.loadItemsList()
  if (productId.value) {
    product.value = await productsStore.loadItemById(productId.value)
  }
  if (getUserFromStorage) {
    user.data = await usersStore.loadItemById(getUserFromStorage.id)
  }
})

watch(productAmount, (newValue, oldVal) => {
  if (newValue < 1) {
    productAmount.value = 1
  }
})
</script>

<template>
  <main-master-page>
    <div v-if="product.title" class="product">
      <SuccessPopup :msg="t('errors.successfullyBought')" />
      <div class="product__container">
        <div class="product__main section">
          <div class="product__info info-product">
            <h2 class="info-product__title title">{{ titleLang }}</h2>
            <span class="info-product__price">${{ productPrice }}</span>
            <div class="info-product__actions">
              <div class="info-product__amount item-form">
                <button class="button" @click="decreaseAmount">-</button>
                <input v-model.trim="productAmount" type="number" min="1" />
                <button class="button" @click="increaseAmount">+</button>
              </div>
              <div class="info-product__action-center">
                <button
                  :class="alreadyInArray(productId, user.data.favorite)"
                  class="info-product__action item-product__action"
                  @click="addToTheList(user.data.favorite)"
                >
                  <font-awesome-icon :icon="['far', 'heart']" />
                </button>
                <button
                  :class="alreadyInArray(productId, user.data.cart)"
                  class="info-product__action item-product__action"
                  @click="addToTheList(user.data.cart)"
                >
                  <font-awesome-icon :icon="['fas', 'cart-shopping']" />
                </button>
              </div>
              <v-btn class="info-product__button" @click="onBuyAction">{{
                $t('buttons.buy')
              }}</v-btn>
            </div>
            <span class="err-msg">{{ errorMessage }}</span>
            <div v-if="product.desc" class="info-product__desc text">
              <p>{{ descLang }}</p>
            </div>
          </div>
          <div class="product__image">
            <img :src="product.img" :alt="titleLang" />
          </div>
        </div>
        <div class="similar-products section">
          <h5 class="similar-products__title small-title">{{ $t('titles.similarProducts') }}</h5>
          <ul
            v-if="similarProductsList && similarProductsList.length"
            class="similar-products__list products__list"
          >
            <ProductItem
              :productsList="similarProductsList"
              :needActions="true"
              :user="user"
              :isNewProduct="true"
            />
          </ul>
          <h6 v-else class="similar-products__small-title">
            {{ $t('titles.noSimilarProductsTitle') }}
          </h6>
        </div>
      </div>
    </div>
    <div v-else-if="!isLoading && !product.title" class="loading-container">
      <font-awesome-icon :icon="['fas', 'spinner']" size="6x" spin-pulse class="icon" />
    </div>
  </main-master-page>
</template>


<style lang="scss" scoped>
.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}
</style>