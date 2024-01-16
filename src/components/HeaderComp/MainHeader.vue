<script setup>
import { computed, onMounted, ref, reactive } from 'vue'
import { RouterLink, RouterView, useRouter } from 'vue-router'
import favorite from '@/components/HeaderComp/Popups/Favorite.vue'
import { useLocales } from '@/modulesHelpers/i18n.js'
const { locale, setLocale } = useLocales()
const router = useRouter()
import { useUsersStore } from '@/stores/users'
const usersStore = useUsersStore()
import { useAuthStore } from '@/stores/auth'
const authStore = useAuthStore()
import { useProductsStore } from '@/stores/products'
const productsStore = useProductsStore()

let menuOpen = ref(null)
let isMenuOpen = ref(false)

const getUserFromStorage = JSON.parse(localStorage.getItem('InHabUser'))

let user = reactive({
  id: getUserFromStorage?.id,
  data: {}
})

const currentLanguage = computed(() => {
  if (locale.value == 'ua') return 'Українська'
  else if (locale.value == 'en') return 'English'
})

const userCartLength = computed(() => usersStore.getCurrentItem.cart.length)
const userFavLength = computed(() => usersStore.getCurrentItem.favorite.length)

function openMobileMenu(event) {
  event.preventDefault()
  isMenuOpen = !isMenuOpen
  if (isMenuOpen) {
    menuOpen.value = 'menu-open'
    document.body.classList.add('lock')
  } else {
    menuOpen.value = null
    document.body.classList.remove('lock')
  }
}
function closingMenuDuringNavigation() {
  menuOpen.value = null
  document.body.classList.remove('lock')
}

function toProfilePage() {
  if (getUserFromStorage && !user.id) user.id = getUserFromStorage.id
  if (user.id) {
    closingMenuDuringNavigation()
    router.push({
      name: 'profile',
      params: {
        profileId: user.id
      }
    })
  } else {
    router.push({
      name: 'register'
    })
  }
}

function onOpenPopup() {
  productsStore.openPopup()
  if (usersStore.getCurrentItem) {
    user.data = usersStore.getCurrentItem
  }
  if (menuOpen.value) {
    closingMenuDuringNavigation()
  }
}

onMounted(async () => {
  if (getUserFromStorage && getUserFromStorage.id)
    user.data = await usersStore.loadItemById(getUserFromStorage.id)
})
</script>

<template>
  <header class="header">
    <favorite v-if="user.id" />
    <div class="header__container">
      <RouterLink :to="{ name: 'home' }" class="header__logo">
        <img src="@/assets/logo.jpg" alt="Logo" />
      </RouterLink>
      <div :class="menuOpen" class="header__menu menu">
        <button type="button" class="menu__icon icon-menu" @click="openMobileMenu">
          <span></span>
        </button>
        <div class="menu__body">
          <nav class="menu__content">
            <ul class="menu__list">
              <li class="menu__item">
                <RouterLink
                  :to="{ name: 'about' }"
                  class="menu__link"
                  @click="closingMenuDuringNavigation"
                >
                  {{ $t('menu.about') }}
                </RouterLink>
              </li>
              <li class="menu__item">
                <RouterLink
                  :to="{ name: 'shop' }"
                  class="menu__link"
                  @click="closingMenuDuringNavigation"
                >
                  {{ $t('menu.shop') }}
                </RouterLink>
              </li>
              <li v-if="!user.id" class="menu__item">
                <RouterLink
                  :to="{ name: 'register' }"
                  class="menu__link"
                  @click="closingMenuDuringNavigation"
                >
                  {{ $t('menu.registration') }}
                </RouterLink>
              </li>
              <li v-if="user && user.data.isAdmin" class="menu__item">
                <RouterLink
                  :to="{ name: 'users' }"
                  class="menu__link"
                  @click="closingMenuDuringNavigation"
                >
                  {{ $t('menu.users') }}
                </RouterLink>
              </li>
              <li class="menu__item">
                <RouterLink
                  :to="{ name: 'support' }"
                  class="menu__link"
                  @click="closingMenuDuringNavigation"
                >
                  {{ $t('menu.support') }}
                </RouterLink>
              </li>
            </ul>
          </nav>
          <div class="menu__locale">
            <span class="locale-lang">{{ currentLanguage }}</span>
            <div>
              <v-btn
                :class="{
                  'selected-lang': locale == 'ua'
                }"
                @click="setLocale('ua')"
              >
                UA
              </v-btn>
              <v-btn
                :class="{
                  'selected-lang': locale == 'en'
                }"
                @click="setLocale('en')"
              >
                EN
              </v-btn>
            </div>
          </div>
          <div class="menu__right">
            <RouterLink to="#" class="menu__right-link" @click="toProfilePage">
              <font-awesome-icon :icon="['far', 'user']" size="2x" />
            </RouterLink>
            <div class="menu__right-link">
              <button @click="onOpenPopup">
                <font-awesome-icon :icon="['far', 'heart']" size="2x" />
              </button>
              <span v-if="user && user.data.favorite" class="menu__right-link-amount">{{
                userFavLength
              }}</span>
            </div>
            <RouterLink
              :to="{ name: 'cart', params: { profileId: user.id } }"
              class="menu__right-link"
              @click="closingMenuDuringNavigation"
            >
              <font-awesome-icon :icon="['fas', 'cart-shopping']" size="2x" />
              <span v-if="user && user.data.cart" class="menu__right-link-amount">{{
                userCartLength
              }}</span>
            </RouterLink>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>


<style lang="scss" scoped>
</style>