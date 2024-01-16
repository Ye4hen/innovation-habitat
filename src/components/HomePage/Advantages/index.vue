<script setup>
import { onMounted, computed, ref, reactive, watchEffect } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useLocales } from '@/modulesHelpers/i18n.js'
const { locale } = useLocales()
const getUserFromStorage = JSON.parse(localStorage.getItem('InHabUser'))
import { useAdvantagesStore } from '@/stores/advantages'
const advantagesStore = useAdvantagesStore()
import { useUsersStore } from '@/stores/users'
const usersStore = useUsersStore()
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const user = ref({
  id: getUserFromStorage?.id,
  data: {}
})

const listItems = ref([])

const advantagesList = computed(() => advantagesStore.getItemsList ?? [])

const chooseLang = computed(() => {
  return (item) => {
    if (locale.value == 'ua') return item.ua
    else if (locale.value == 'en') return item.en
  }
})

function pushToTheList(el) {
  const foundEl = listItems.value.find((item) => item == el)

  if (!foundEl) {
    listItems.value.push(el)
  }
}

onMounted(async () => {
  listItems.value = []
  advantagesStore.loadItemsList()
  if (getUserFromStorage) {
    user.value.data = await usersStore.loadItemById(getUserFromStorage.id)
  }
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
})
</script>

<template>
  <div class="advantages">
    <div class="advantages__container">
      <h3 class="advantages__title title">{{ $t('titles.advantagesTitle') }}</h3>
      <ul class="advantages__list">
        <li
          v-for="advantage in advantagesList"
          :key="advantage.id"
          :ref="(el) => pushToTheList(el)"
          class="advantages__item"
        >
          <div class="item-advantages">
            <div class="item-advantages__info">
              <h4 class="item-advantages__title small-title">{{ chooseLang(advantage.title) }}</h4>
              <div class="item-advantages__text text">
                <p>{{ chooseLang(advantage.desc) }}</p>
              </div>
            </div>
            <div class="item-advantages__image">
              <img :src="advantage.icon" :alt="chooseLang(advantage.title)" />
            </div>
          </div>
          <div v-if="user.data.isAdmin" class="item-advantages__actions">
            <RouterLink :to="{ name: 'advantage', params: { advantageId: advantage.id } }">
              <v-btn class="item-advantages__action">
                {{ $t('buttons.edit') }}
              </v-btn>
            </RouterLink>
            <v-btn
              class="item-advantages__action"
              @click="advantagesStore.deleteItem(advantage.id)"
            >
              {{ $t('buttons.delete') }}
            </v-btn>
          </div>
        </li>
      </ul>
      <RouterLink :to="{ name: 'advantage' }" class="advantages__add-btn">
        <v-btn v-if="user.data.isAdmin">
          {{ $t('buttons.add') }}
        </v-btn>
      </RouterLink>
    </div>
  </div>
</template>


<style lang="scss" scoped>
</style>