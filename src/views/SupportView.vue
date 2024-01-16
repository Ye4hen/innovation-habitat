<script setup>
import MainMasterPage from '@/masterpages/MainMasterPage.vue'
</script>

<template>
  <main-master-page>
    <section class="support section">
      <div class="support__container">
        <h1 class="support__title title">{{ $t('titles.supportTitle') }}</h1>
        <ul class="support__list">
          <li class="support__item small-title">{{ $t('SupportPage.item1') }}</li>
          <li class="support__item small-title">
            {{ $t('SupportPage.itemTelegram') }}
            <a target="blank" href="https://t.me/B_O_B_jr">Telegram</a>
          </li>
        </ul>
      </div>
    </section>
  </main-master-page>
</template>


<style lang="scss" scoped>
</style>