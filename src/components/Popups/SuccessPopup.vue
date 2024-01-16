<template>
  <div class="success-popup">
    <div class="success-popup__content">
      <h4 class="success-popup__message">{{ msg }}</h4>
    </div>
  </div>
</template>

<script setup>
defineProps({
  msg: {
    type: String,
    default: 'Done Successfully!'
  }
})
</script>

<style lang="scss" scoped>
</style>