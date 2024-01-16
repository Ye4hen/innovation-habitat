<script setup>
import { useProductsStore } from '@/stores/products'
import { ref, watch, computed, onMounted } from 'vue'
import { useLocales } from '@/modulesHelpers/i18n.js'
import { RouterLink } from 'vue-router'
const { locale } = useLocales()
const productsStore = useProductsStore()
import { useUsersStore } from '@/stores/users'
const usersStore = useUsersStore()
const getUserFromStorage = JSON.parse(localStorage.getItem('InHabUser'))

const user = ref({
  id: getUserFromStorage?.id,
  data: {}
})

const getCategoriesList = computed(() => productsStore.getCategoriesList ?? [])

const highestPrice = computed(() => {
  if (productsStore.getItemsList.length) {
    const productWithMaxPrice = productsStore.getItemsList.reduce((prevProduct, currentProduct) => {
      return prevProduct.price > currentProduct.price ? prevProduct : currentProduct
    })
    return productWithMaxPrice.price
  } else {
    return 99989
  }
})

let filterData = ref({
  title: '',
  category: [],
  priceFrom: 0,
  priceTo: parseFloat(highestPrice.value) + 10
})

const checkLang = computed(() => {
  return (item) => {
    if (locale.value == 'ua') return item.ua
    else if (locale.value == 'en') return item.en
  }
})

function handleRangeInput() {
  const rangeInput = document.querySelectorAll('.filter-shop__range-input input'),
    priceInput = document.querySelectorAll('.filter-shop__price-input input'),
    range = document.querySelector('.filter-shop__slider .filter-shop__progress')
  let priceGap = 50

  priceInput.forEach((input) => {
    input.addEventListener('input', (e) => {
      let minPrice = parseInt(priceInput[0].value),
        maxPrice = parseInt(priceInput[1].value)

      if (maxPrice - minPrice >= priceGap && maxPrice <= rangeInput[1].max) {
        if (e.target.className === 'input-min') {
          rangeInput[0].value = minPrice
          range.style.left = (minPrice / rangeInput[0].max) * 100 + '%'
        } else {
          rangeInput[1].value = maxPrice
          range.style.right = 100 - (maxPrice / rangeInput[1].max) * 100 + '%'
        }
      }
    })
  })

  rangeInput.forEach((input) => {
    input.addEventListener('input', (e) => {
      let minVal = parseInt(rangeInput[0].value),
        maxVal = parseInt(rangeInput[1].value)

      if (maxVal - minVal < priceGap) {
        if (e.target.className === 'range-min') {
          rangeInput[0].value = maxVal - priceGap
        } else {
          rangeInput[1].value = minVal + priceGap
        }
      } else {
        priceInput[0].value = minVal
        priceInput[1].value = maxVal
        range.style.left = (minVal / rangeInput[0].max) * 100 + '%'
        range.style.right = 100 - (maxVal / rangeInput[1].max) * 100 + '%'
      }
    })
  })
}

onMounted(async () => {
  handleRangeInput()
  if (getUserFromStorage) {
    user.value.data = await usersStore.loadItemById(getUserFromStorage.id)
  }
})

watch(
  filterData.value,
  (newValue, oldValue) => {
    productsStore.setFilter(newValue)
    if (newValue.priceTo < parseFloat(newValue.priceFrom) + 40) {
      newValue.priceTo = highestPrice.value
      newValue.priceFrom = 0
    }
  },
  { deep: true }
)
</script>

<template>
  <div class="shop__filter filter-shop">
    <div class="filter-shop__name item-form">
      <label>
        {{ $t('filters.filterName') }}
        <input v-model="filterData.title" type="text" />
      </label>
    </div>
    <div class="filter-shop__categories">
      <span>{{ $t('filters.filterCategories') }}</span>
      <div v-for="category in getCategoriesList" :key="category" class="filter-shop__category">
        <label>
          {{ category }}
          <input v-model="filterData.category" :value="category" type="checkbox" />
        </label>
      </div>
    </div>
    <div class="filter-shop__prices">
      <div class="filter-shop__price-input">
        <div class="filter-shop__field item-form">
          <label>
            Min
            <input type="number" class="filter-shop__input-min" v-model="filterData.priceFrom" />
          </label>
        </div>
        <div class="filter-shop__separator">-</div>
        <div class="filter-shop__field item-form">
          <label>
            Max
            <input type="number" class="filter-shop__input-max" v-model="filterData.priceTo" />
          </label>
        </div>
      </div>
      <div class="filter-shop__slider">
        <div class="filter-shop__progress"></div>
      </div>
      <div class="filter-shop__range-input">
        <input
          type="range"
          class="filter-shop__range-min"
          min="0"
          :max="highestPrice - 50"
          v-model="filterData.priceFrom"
        />
        <input
          type="range"
          class="filter-shop__range-max"
          min="0"
          :max="highestPrice + 10"
          v-model="filterData.priceTo"
        />
      </div>
    </div>
    <RouterLink :to="{ name: 'product_editor' }">
      <v-btn v-if="user.data.isAdmin" class="filter-shop__add-product">
        {{ $t('buttons.add') }}
      </v-btn>
    </RouterLink>
  </div>
</template>


<style lang="scss" scoped>
</style>
