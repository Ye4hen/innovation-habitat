<script setup>
</script>

<template>
  <footer class="footer">
    <div class="footer__container">
      <div class="footer__main main-footer">
        <RouterLink :to="{ name: 'home' }" class="main-footer__logo">
          <img src="@/assets/logo.jpg" alt="Logo" />
        </RouterLink>
        <div class="main-footer__quote text">
          <blockquote>"{{ $t('otherText.footerQuote') }}"</blockquote>
        </div>
        <ul class="main-footer__socials">
          <li class="main-footer__social">
            <a href="#"><font-awesome-icon :icon="['fab', 'instagram']" /></a>
          </li>
          <li class="main-footer__social">
            <a href="#"><font-awesome-icon :icon="['fab', 'twitter']" /></a>
          </li>
          <li class="main-footer__social">
            <a href="#"><font-awesome-icon :icon="['fab', 'facebook']" /></a>
          </li>
          <li class="main-footer__social">
            <a href="#"><font-awesome-icon :icon="['fab', 'viber']" /></a>
          </li>
        </ul>
      </div>
      <nav class="footer__nav nav-footer">
        <div class="nav-footer__item">
          <h4 class="nav-footer__title small-title">{{ $t('titles.footerNavTitle') }}</h4>
          <ul class="nav-footer__list">
            <li class="nav-footer__list-item">
              <RouterLink :to="{ name: 'home' }" class="nav-footer__link">
                {{ $t('menu.home') }}
              </RouterLink>
            </li>
            <li class="nav-footer__list-item">
              <RouterLink :to="{ name: 'about' }" class="nav-footer__link">
                {{ $t('menu.about') }}
              </RouterLink>
            </li>
            <li class="nav-footer__list-item">
              <RouterLink :to="{ name: 'shop' }" class="nav-footer__link">
                {{ $t('menu.shop') }}
              </RouterLink>
            </li>
            <li class="nav-footer__list-item">
              <RouterLink :to="{ name: 'register' }" class="nav-footer__link">
                {{ $t('menu.registration') }}
              </RouterLink>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  </footer>
</template>


<style lang="scss" scoped>
</style>