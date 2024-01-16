<script setup>
import { onMounted, ref } from 'vue'
import { gsap } from 'gsap'

const myElement = ref(null)
const myElement2 = ref(null)
const myElement3 = ref(null)
const myElement4 = ref(null)
const myElement5 = ref(null)

onMounted(() => {
  gsap.fromTo(
    myElement.value,
    { y: 150, opacity: 0 },
    { duration: 1.5, y: 0, opacity: 1, ease: 'back.out(1.7)', delay: 0.5 }
  )
  gsap.fromTo(
    myElement2.value,
    { y: 150, opacity: 0 },
    { duration: 2, y: 0, opacity: 1, ease: 'expo.out', delay: 0.6 }
  )
  gsap.fromTo(
    myElement3.value,
    { y: 150, opacity: 0 },
    { duration: 2, y: 0, opacity: 1, ease: 'expo.out', delay: 0.7 }
  )
  gsap.fromTo(
    myElement4.value,
    { y: 150, opacity: 0 },
    { duration: 2, y: 0, opacity: 1, ease: 'expo.out', delay: 0.8 }
  )
  gsap.fromTo(
    myElement5.value,
    { x: 150, opacity: 0 },
    { duration: 1.5, x: 0, opacity: 1, ease: 'power2.out' }
  )
})
</script>

<template>
  <section class="our-story section">
    <div class="our-story__container">
      <div class="our-story__content block-header">
        <h1 ref="myElement" class="our-story__title block-header__title title">
          {{ $t('aboutPage.ourStory.title') }}
        </h1>
        <div class="our-story__text block-header__text text">
          <p ref="myElement2">{{ $t('aboutPage.ourStory.text1') }}</p>
          <p ref="myElement3">{{ $t('aboutPage.ourStory.text2') }}</p>
          <p ref="myElement4">{{ $t('aboutPage.ourStory.text3') }}</p>
        </div>
      </div>
      <div class="our-story__image">
        <img ref="myElement5" src="@/assets/about/story/story.jpg" alt="Our Story Image" />
      </div>
    </div>
  </section>
</template>


<style lang="scss" scoped>
</style>