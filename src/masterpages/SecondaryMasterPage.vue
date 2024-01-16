<template>
  <div v-if="!hasError" class="wrapper">
    <SecondaryHeader />
    <main class="main"><slot></slot></main>
  </div>
</template>

<script setup>
import SecondaryHeader from '@/components/HeaderComp/SecondaryHeader.vue'
import { useGeneralStore } from '@/stores/general'
import { storeToRefs } from 'pinia'
import { onMounted } from 'vue'
const generalStore = useGeneralStore()
const { isLoading, hasError } = storeToRefs(generalStore)
import { useProductsStore } from '@/stores/products'
import { useUsersStore } from '@/stores/users'
const productsStore = useProductsStore()
const usersStore = useUsersStore()

onMounted(async () => {
  productsStore.loadItemsList()
  usersStore.loadItemsList()
})
</script>

<style lang="scss" scoped>
</style>