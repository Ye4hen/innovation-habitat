<template>
  <Loading v-if="isLoading" />
  <error-page v-else-if="hasError" />
  <div v-if="!hasError" class="wrapper">
    <MainHeader />
    <main class="main"><slot></slot></main>
    <MainFooter />
  </div>
</template>

<script setup>
import Loading from '@/components/Loading/index.vue'
import ErrorPage from '@/views/ErrorPage.vue'
import MainHeader from '@/components/HeaderComp/MainHeader.vue'
import MainFooter from '@/components/FooterComp/MainFooter.vue'
import { useGeneralStore } from '@/stores/general'
import { storeToRefs } from 'pinia'
import { computed, onMounted } from 'vue'
const generalStore = useGeneralStore()
const { isLoading, hasError } = storeToRefs(generalStore)
import { useProductsStore } from '@/stores/products'
import { useUsersStore } from '@/stores/users'
import { useAuthStore } from '@/stores/auth'
import { useMainBlockStore } from '@/stores/main_block'
const productsStore = useProductsStore()
const usersStore = useUsersStore()
const authStore = useAuthStore()
const mainBlockStore = useMainBlockStore()

onMounted(async () => {
  productsStore.loadItemsList()
  usersStore.loadItemsList()
  mainBlockStore.loadItemsList()
})
</script>

<style lang="scss" scoped>
</style>