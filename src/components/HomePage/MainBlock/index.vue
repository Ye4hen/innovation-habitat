<script setup>
import { RouterLink } from 'vue-router'
import { onMounted, computed, ref, reactive, nextTick } from 'vue'
import { useLocales } from '@/modulesHelpers/i18n.js'
const { locale } = useLocales()
import { gsap } from 'gsap'
import initializeParallax from '@/modulesHelpers/parallax.js'

import { useMainBlockStore } from '@/stores/main_block'
const mainBlockStore = useMainBlockStore()
import { useUsersStore } from '@/stores/users'
const usersStore = useUsersStore()
const getUserFromStorage = JSON.parse(localStorage.getItem('InHabUser'))
const mainBlockList = computed(() => mainBlockStore.getItemsList ?? [])

let user = ref({
  id: getUserFromStorage?.id,
  data: {}
})

const myElements = reactive({})

const checkLang = computed(() => {
  return (item) => {
    if (locale.value == 'ua') return item?.ua
    else if (locale.value == 'en') return item?.en
  }
})

onMounted(async () => {
  initializeParallax()
  if (getUserFromStorage) {
    user.value.data = await usersStore.loadItemById(getUserFromStorage.id)
  }
  mainBlockList.value.forEach((block) => {
    const elementRef = `myElement_${block.id}`
    myElements[elementRef] = document.querySelectorAll(`[data-ref="${elementRef}"]`)

    gsap.fromTo(
      myElements[elementRef],
      { y: 150, opacity: 0 },
      { duration: 1.5, y: 0, opacity: 1, ease: 'back.out(1.7)' }
    )
  })
})
</script>

<template>
  <section class="main-block section">
    <div class="main-block__container">
      <div
        v-for="block in mainBlockList"
        :key="block.id"
        class="main-block__block-header block-header"
      >
        <h1 :data-ref="`myElement_${block.id}`" class="main-block__title block-header__title title">
          {{ checkLang(block.title) }}
        </h1>
        <div class="main-block__text block-header__text text">
          <p :data-ref="`myElement_${block.id}`">
            {{ checkLang(block.text) }}
          </p>
        </div>
        <RouterLink
          :to="{ name: block.button.linkName }"
          :data-ref="`myElement_${block.id}`"
          class="block-header__button main-block__button button"
        >
          {{ checkLang(block.button) }}
        </RouterLink>
      </div>
    </div>
    <!-- <div class="main-block__bg">
      <img src="@/assets/home/main-block/bg_img-2.jpg" alt="background image" />
    </div> -->
    <div class="main-block__parallax"></div>
  </section>
</template>


<style lang="scss" scoped>
</style>