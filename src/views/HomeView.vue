<script setup>
import MainMasterPage from '@/masterpages/MainMasterPage.vue'
import MainBlock from '@/components/HomePage/MainBlock/index.vue'
import Advantages from '@/components/HomePage/Advantages/index.vue'
import BestProducts from '@/components/HomePage/BestProducts/index.vue'
</script>

<template>
  <main-master-page>
    <MainBlock />
    <Advantages />
    <BestProducts />
  </main-master-page>
</template>
