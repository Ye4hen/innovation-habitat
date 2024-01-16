<script setup>
import MainMasterPage from '@/masterpages/MainMasterPage.vue'
import { onMounted, computed, ref, watch } from 'vue'
import { useLocales } from '@/modulesHelpers/i18n.js'
const { locale, t } = useLocales()
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { useProductsStore } from '@/stores/products'
const productsStore = useProductsStore()
import { useUsersStore } from '@/stores/users'
const usersStore = useUsersStore()
import { useAuthStore } from '@/stores/auth'
const authStore = useAuthStore()
import { storeToRefs } from 'pinia'
import { useGeneralStore } from '@/stores/general'
const generalStore = useGeneralStore()
const { isLoading, hasError } = storeToRefs(generalStore)
const getUserFromStorage = JSON.parse(localStorage.getItem('InHabUser'))
const router = useRouter()

import SuccessPopup from '@/components/Popups/SuccessPopup.vue'
import ShippPopup from '@/components/Popups/ShippPopup.vue'

const route = useRoute()

const profileId = computed(() => route.params.profileId)
let user = ref({
  id: profileId.value,
  data: {}
})

let errorMessage = ref(null)

function calculateProductPrice(product) {
  return (product.price * product.amount).toFixed(2)
}

function decreaseAmount(product) {
  if (product.amount > 1) {
    product.amount -= 1
  }
}

function increaseAmount(product) {
  product.amount += 1
}

const checkLang = computed(() => {
  return (item) => {
    if (locale.value == 'ua') return item.ua
    else if (locale.value == 'en') return item.en
  }
})

let userCartProducts = ref([])

const loadCartProducts = async () => {
  if (user.value.data.cart) {
    const productsPromises = user.value.data.cart.map(async (productId) => {
      const productInfo = await productsStore.loadItemById(productId)
      return { id: productId, amount: 1, ...productInfo }
    })

    userCartProducts.value = await Promise.all(productsPromises)
  }
}

function buyProductFromCart(productId, product) {
  if (parseFloat(calculateProductPrice(product)) > parseFloat(user.value.data.balance)) {
    product.amount = 1
  } else {
    setTimeout(() => {
      router.go()
    }, 100)
  }
  usersStore
    .onBuy(user.value.id, productId, calculateProductPrice(product), user.value.data)
    .then((error) => {
      errorMessage.value = error
    })
}

function onDelete(productId) {
  user.value.data.cart = user.value.data.cart.filter((item) => item !== productId)
  usersStore.updateItem(profileId.value, user.value.data)
  setTimeout(() => {
    router.go()
  }, 100)
}

const watchProductAmount = (product) => {
  watch(
    () => product.amount,
    (newValue, oldValue) => {
      if (newValue < 1) {
        product.amount = 1
      }
    }
  )
}

onMounted(async () => {
  if (profileId.value) {
    user.value.data = await usersStore.loadItemById(profileId.value)
    await loadCartProducts()

    userCartProducts.value.forEach((product) => {
      watchProductAmount(product)
    })
  }
})
</script>

<template>
  <main-master-page>
    <section class="cart section">
      <SuccessPopup :msg="t('errors.successfullyBought')" />
      <div class="cart__container">
        <h1 class="cart__title title">{{ $t('CartPage.title') }}</h1>
        <div class="cart__content">
          <ul v-if="userCartProducts.length" class="cart__list list-cart">
            <li
              v-for="product in userCartProducts"
              :key="product.id"
              class="list-cart__item item-cart-list"
            >
              <ShippPopup
                :productPrice="calculateProductPrice(product)"
                :productId="product.id"
                :productAmount="product.amount"
                :user="user"
              />
              <div class="item-cart-list__image">
                <img :src="product.img" :alt="checkLang(product.title)" />
              </div>
              <div class="item-cart-list__info">
                <h4 class="item-cart-list__title">
                  <RouterLink
                    :to="{ name: 'product', params: { productId: product.id } }"
                    target="_blank"
                  >
                    {{ checkLang(product.title) }}
                  </RouterLink>
                </h4>
                <h6 class="item-cart-list__category">{{ product.category }}</h6>
              </div>
              <span class="item-cart-list__price">
                <span class="dollar">$</span>{{ calculateProductPrice(product) }}</span
              >
              <div class="item-cart-list__amount info-product__amount item-form">
                <button class="button" @click="decreaseAmount(product)">-</button>
                <input v-model.trim="product.amount" type="number" min="1" />
                <button class="button" @click="increaseAmount(product)">+</button>
              </div>
              <div class="item-cart-list__actions">
                <v-btn
                  class="item-cart-list__button"
                  @click="buyProductFromCart(product.id, product)"
                  >{{ $t('buttons.buy') }}</v-btn
                >
                <v-btn class="item-cart-list__button" @click="onDelete(product.id)">{{
                  $t('buttons.delete')
                }}</v-btn>
              </div>
              <strong v-if="errorMessage" class="err-msg">{{ errorMessage }}</strong>
            </li>
          </ul>
          <template v-else-if="!userCartProducts.length && !isLoading">
            <h3 class="cart__no-product small-title">{{ $t('CartPage.noProductTitle') }}</h3>
          </template>
        </div>
      </div>
    </section>
  </main-master-page>
</template>

<style lang="scss" scoped>
</style>
