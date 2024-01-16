<script setup>
import { onMounted, ref } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const myElement = ref(null)
const myElement2 = ref(null)
const myElement3 = ref(null)
const myElement4 = ref(null)
const myElement5 = ref(null)
const myElement6 = ref(null)
gsap.registerPlugin(ScrollTrigger)

onMounted(() => {
  const elements = [
    myElement.value,
    myElement2.value,
    myElement3.value,
    myElement4.value,
    myElement5.value,
    myElement6.value
  ]

  elements.forEach((item, index) => {
    gsap.fromTo(
      item,
      {
        opacity: 0,
        y: index < 4 ? 150 : 0,
        x: index === 4 ? -150 : 0
      },
      {
        duration: 1.5 + index * 0.2,
        y: 0,
        x: 0,
        opacity: 1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: item,
          toggleActions: 'play none none reverse'
        },
        delay: index * 0.2
      }
    )
  })
})
</script>

<template>
  <section class="innovation section">
    <div class="innovation__container">
      <div class="innovation__content block-header">
        <h1 ref="myElement" class="innovation__title block-header__title title">
          {{ $t('aboutPage.innovationTechnology.title') }}
        </h1>
        <div class="innovation__text block-header__text text">
          <p ref="myElement2">{{ $t('aboutPage.innovationTechnology.text1') }}</p>
          <p ref="myElement3">{{ $t('aboutPage.innovationTechnology.text2') }}</p>
          <p ref="myElement4">{{ $t('aboutPage.innovationTechnology.text3') }}</p>
        </div>
        <div ref="myElement6" class="about__button block-header__button">
          <RouterLink :to="{ name: 'shop' }">
            <v-btn>
              <span>{{ $t('buttons.explore') }}</span>
            </v-btn>
          </RouterLink>
        </div>
      </div>
      <div class="innovation__image">
        <img
          ref="myElement5"
          src="@/assets/about/innovation/innovation.jpg"
          alt="Innovation in Technology Image"
        />
      </div>
    </div>
  </section>
</template>


<style lang="scss" scoped>
</style>