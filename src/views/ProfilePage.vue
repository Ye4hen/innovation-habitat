<script setup>
import MainMasterPage from '@/masterpages/MainMasterPage.vue'
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useLocales } from '@/modulesHelpers/i18n.js'
const { locale, t } = useLocales()
const route = useRoute()
const router = useRouter()
import { useAuthStore } from '@/stores/auth'
const authStore = useAuthStore()
const { logOut, loginWithGoogleAccount } = authStore
import { useUsersStore } from '@/stores/users'
const usersStore = useUsersStore()
import { useProductsStore } from '@/stores/products'
const productsStore = useProductsStore()
import ProductItem from '@/components/ProductItem/index.vue'
import ShippPopup from '@/components/Popups/ShippPopup.vue'
const profileId = computed(() => route.params.profileId)
let user = ref({
  id: profileId.value,
  data: {}
})
let showPassword = ref(false)
let userBalanceInput = ref(null)
let balanceError = ref(null)

function togglePasswordVisibility() {
  showPassword.value = !showPassword.value
}

const passwordFieldType = computed(() => {
  return showPassword.value ? 'text' : 'password'
})

function replenishBalance() {
  if (user.value.data.isCard) {
    const inputBalance = parseFloat(userBalanceInput.value)

    user.value.data.balance = parseFloat(user.value.data.balance) + inputBalance
    user.value.data.balance = user.value.data.balance.toFixed(2)
    usersStore.updateItem(profileId.value, user.value.data)
    userBalanceInput.value = null
  } else {
    document.body.classList.add('shipping-popup-active')
  }
}

function loginWithGoogle() {
  loginWithGoogleAccount().then(() => {
    router.push({
      name: 'home'
    })
  })
}

function onLogout() {
  logOut()
  router.push({
    name: 'home'
  })
}

function onCancel() {
  router.push({ name: 'home' })
}

let userBoughtProducts = ref([])

const loadBoughtProducts = async () => {
  if (user.value.data.boughtProducts) {
    const productsPromises = user.value.data.boughtProducts.map(async (productId) => {
      const productInfo = await productsStore.loadItemById(productId)
      return { id: productId, ...productInfo }
    })

    userBoughtProducts.value = await Promise.all(productsPromises)
  }
}

const checkLang = computed(() => {
  return (item) => {
    if (locale.value == 'ua') return item.ua
    else if (locale.value == 'en') return item.en
  }
})

onMounted(async () => {
  if (profileId.value) {
    user.value.data = await usersStore.loadItemById(profileId.value)
    await loadBoughtProducts()
  }
})

watch(userBalanceInput, (newValue, oldVal) => {
  const regex = /^[0-9]+$/
  if (newValue < 1 || !regex.test(newValue)) {
    userBalanceInput.value = null
  }
})
</script>

<template>
  <main-master-page>
    <div class="profile section">
      <ShippPopup :userBalanceInput="userBalanceInput" :profileId="profileId" :user="user" />
      <div class="profile__container">
        <div class="profile__top">
          <h4 class="profile__sub-title small-title">
            {{ $t('ProfilePage.greeting') }}, {{ user.data.email }}
          </h4>
          <h1 class="profile__title title">{{ $t('ProfilePage.title') }}</h1>
        </div>
        <div class="profile__edit edit-profile">
          <div class="edit-profile__main">
            <template v-if="user.data.withEmailAndPass">
              <div class="edit-profile item-form">
                <label>
                  {{ $t('LoginPage.Email') }}
                  <input v-model.trim="user.data.email" type="email" />
                </label>
              </div>
              <div class="edit-profile item-form">
                <label>
                  {{ $t('LoginPage.Password') }}
                  <input v-model.trim="user.data.password" :type="passwordFieldType" />
                  <button type="button" class="see-pass-btn" @click="togglePasswordVisibility">
                    <font-awesome-icon :icon="['fas', 'eye']" />
                  </button>
                </label>
              </div>
              <div class="edit-profile__actions">
                <v-btn
                  :disabled="!user.data.email || !user.data.password"
                  @click="usersStore.updateItem(profileId, user.data)"
                  >{{ $t('buttons.save') }}</v-btn
                >
                <v-btn @click="onCancel">{{ $t('buttons.cancel') }}</v-btn>
              </div>
            </template>
            <div v-else class="edit-profile__email">
              <span
                >{{ $t('otherText.yourEmail') }} - <span>{{ user.data.email }}</span></span
              >
              <button type="button" @click="loginWithGoogle">
                {{ $t('otherText.changeGAcc') }}
                <font-awesome-icon :icon="['fab', 'google']" color="red" />
              </button>
            </div>
          </div>
          <div class="edit-profile__balance balance-profile">
            <div class="balance-profile__top">
              <h4 class="balance-profile__title small-title">
                {{ $t('otherText.replenishBalance') }}
              </h4>
              <div>
                <span class="balance-profile__balance small-title"
                  ><span class="dollar">$</span><span>{{ user.data.balance }}</span></span
                >
              </div>
            </div>
            <div class="balance-profile__main item-form">
              <label>
                <input type="number" v-model.trim="userBalanceInput" />
                <div v-if="balanceError" class="err-msg">{{ balanceError }}</div>
              </label>
              <button
                :disabled="!userBalanceInput"
                type="button"
                class="balance-profile__button button"
                @click="replenishBalance"
              >
                {{ $t('buttons.replenish') }}
              </button>
            </div>
          </div>
        </div>
        <div class="profile__logout logout-profile">
          <h5 class="logout-profile__title small-title">{{ $t('otherText.wantLogout') }}</h5>
          <v-btn class="logout-profile__button" @click="onLogout">{{ $t('buttons.logout') }}</v-btn>
        </div>
        <div class="profile__products products-profile">
          <template v-if="user.data.boughtProducts && user.data.boughtProducts.length">
            <h4 class="products-profile__title small-title">
              {{ $t('ProfilePage.boughtProductsTitle') }}
            </h4>
            <ul class="products-profile__list products__list">
              <ProductItem :productsList="userBoughtProducts" :needActions="false" :user="user" />
            </ul>
          </template>
        </div>
      </div>
    </div>
  </main-master-page>
</template>


<style lang="scss" scoped>
</style>