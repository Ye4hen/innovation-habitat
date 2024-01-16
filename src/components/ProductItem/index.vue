<script setup>
import { onMounted, computed, ref, watchEffect } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useLocales } from '@/modulesHelpers/i18n.js'
const { locale } = useLocales()
import { RouterLink } from 'vue-router'
import { useUsersStore } from '@/stores/users'
const usersStore = useUsersStore()
import { useProductsStore } from '@/stores/products'
const productsStore = useProductsStore()
const router = useRouter()
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const listItems = ref([])

const props = defineProps({
  productsList: {
    type: Array,
    required: true
  },
  needActions: {
    type: Boolean,
    default: true
  },
  user: {
    type: Object,
    required: true
  },
  isNewProduct: {
    type: Boolean,
    default: false
  },
  needAnimation: {
    type: Boolean,
    default: true
  }
})

const checkLang = computed(() => {
  return (item) => {
    if (locale.value == 'ua') return item?.ua
    else if (locale.value == 'en') return item?.en
  }
})

const alreadyInArray = computed(() => {
  return (productId, list) => {
    const foundItem = list && list.find((item) => item === productId)
    if (list && foundItem) {
      return 'icon-active'
    }
    return null
  }
})

function pushToTheList(el) {
  const foundEl = listItems.value.find((item) => item == el)

  if (!foundEl) {
    listItems.value.push(el)
  }
}

function deleteProduct(productId) {
  productsStore.deleteItem(productId)
  usersStore.deleteRemovedProduct(props.user, productId)
}

function changeProduct(newProductId) {
  if (props.isNewProduct) {
    router.push({
      name: 'product',
      params: { productId: newProductId }
    })
    setTimeout(() => {
      router.go()
    }, 10)
  }
}

onMounted(() => {
  listItems.value = []
  if (props.needAnimation) {
    gsap.registerPlugin(ScrollTrigger)

    watchEffect(() => {
      listItems.value.forEach((item) => {
        gsap.from(item, {
          scrollTrigger: {
            trigger: item
          },
          duration: 1,
          opacity: 0,
          y: 150,
          stagger: 0.2,
          ease: 'power2.out'
        })
      })
    })
  }
})
</script>

<template>
  <li
    v-for="product in productsList"
    :key="product.id"
    :ref="(el) => pushToTheList(el)"
    class="best-products__item item-best-product item-product"
  >
    <div v-if="user.data.isAdmin" class="item-product__edit-items">
      <RouterLink :to="{ name: 'product_editor', params: { productId: product.id } }">
        <v-btn class="item-product__edit-item">
          {{ $t('buttons.edit') }}
        </v-btn>
      </RouterLink>
      <v-btn class="item-product__edit-item" @click="deleteProduct(product.id)">
        {{ $t('buttons.delete') }}
      </v-btn>
    </div>
    <div class="item-best-product__info item-product__info">
      <h4 class="item-best-product__title item-product__title">
        <RouterLink
          :to="{ name: 'product', params: { productId: product.id } }"
          @click="changeProduct(product.id)"
        >
          {{ checkLang(product.title) }}
        </RouterLink>
      </h4>
      <span class="item-best-product__price item-product__price">${{ product.price }}</span>
    </div>
    <div :class="{ 'item-best-product__image': needActions }" class="item-product__image">
      <div v-if="needActions" class="item-best-product__actions item-product__actions">
        <button
          :class="alreadyInArray(product.id, user.data.favorite)"
          class="item-best-product__action item-product__action"
        >
          <font-awesome-icon
            :icon="['far', 'heart']"
            @click="usersStore.addToList(user, user.data.favorite, product.id)"
          />
        </button>
        <button
          :class="alreadyInArray(product.id, user.data.cart)"
          class="item-best-product__action item-product__action"
        >
          <font-awesome-icon
            :icon="['fas', 'cart-shopping']"
            @click="usersStore.addToList(user, user.data.cart, product.id)"
          />
        </button>
      </div>
      <img :src="product.img" :alt="checkLang(product.title)" />
    </div>
  </li>
</template>


<style lang="scss" scoped>
</style>