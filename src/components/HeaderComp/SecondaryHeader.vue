<script setup>
import { computed, ref } from 'vue'
import { RouterLink, RouterView } from 'vue-router'

import { useLocales } from '@/modulesHelpers/i18n.js'
const { locale, setLocale } = useLocales()

let menuOpen = ref(null)
let isMenuOpen = ref(false)

const currentLanguage = computed(() => {
  if (locale.value == 'ua') return 'Українська'
  else if (locale.value == 'en') return 'English'
})

function openMobileMenu() {
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
</script>

<template>
  <header class="header secondary-header">
    <div class="header__container secondary-header__container">
      <RouterLink :to="{ name: 'home' }" class="header__logo">
        <img src="@/assets/logo.jpg" alt="Logo" />
      </RouterLink>
      <div :class="menuOpen" class="secondary-header__menu header__menu menu">
        <button type="button" class="menu__icon icon-menu" @click="openMobileMenu">
          <span></span>
        </button>
        <div class="menu__body secondary-header__menu-body">
          <nav class="menu__content">
            <ul class="menu__list">
              <li class="menu__item">
                <RouterLink :to="{ name: 'home' }" class="menu__link">
                  {{ $t('menu.home') }}
                </RouterLink>
              </li>
            </ul>
          </nav>
          <div class="menu__locale secondary-header__locale">
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
        </div>
      </div>
    </div>
  </header>
</template>

<style lang="scss" scoped>
</style>