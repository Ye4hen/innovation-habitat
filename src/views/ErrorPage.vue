<script setup>
</script>

<template>
  <div class="has-error">
    <h1 class="has-error__title title">{{ $t('titles.errorTitle') }}</h1>
    <h3 class="has-error__small-title small-title">{{ $t('titles.errorSubTitle') }}</h3>
    <font-awesome-icon :icon="['fas', 'circle-exclamation']" />
  </div>
</template>


<style lang="scss" scoped>
</style>