<script setup>
import SecondaryMasterPage from '@/masterpages/SecondaryMasterPage.vue'
import { computed, ref } from 'vue'
import { useLocales } from '@/modulesHelpers/i18n.js'
const { t } = useLocales()

import { useAuthStore } from '@/stores/auth'
const authStore = useAuthStore()

import { useUsersStore } from '@/stores/users'
const usersStore = useUsersStore()

import { useGeneralStore } from '@/stores/general'
import { storeToRefs } from 'pinia'
const generalStore = useGeneralStore()
const { isLoading, hasError } = storeToRefs(generalStore)

import { useRouter } from 'vue-router'
const router = useRouter()

const email = ref(null)
const password = ref(null)

let errorMessage = ref(null)

let registerForm = ref(true)

let showPassword = ref(false)

const {
  signUpWithWithEmailAndPassword,
  signInWithWithEmailAndPassword,
  loginWithGoogleAccount,
  getUser
} = authStore

const pageTitle = computed(() => {
  if (registerForm.value) return t('titles.registerTitle')
  else return t('titles.loginTitle')
})

const pageBtn = computed(() => {
  if (registerForm.value) return t('buttons.register')
  else return t('buttons.login')
})

const pageProposition = computed(() => {
  if (registerForm.value) return t('LoginPage.textPropositionLogin')
  else return t('LoginPage.textPropositionRegister')
})

const pagePropositionBtn = computed(() => {
  if (registerForm.value) return t('buttons.login')
  else return t('buttons.register')
})

function togglePasswordVisibility() {
  showPassword.value = !showPassword.value
}

const passwordFieldType = computed(() => {
  return showPassword.value ? 'text' : 'password'
})

function changeForm() {
  registerForm.value = !registerForm.value
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

function isValidPassword(password) {
  if (password.length > 6) return true
  else return false
}

function onAction(email, password) {
  const foundUserSignUp = usersStore.getItemsList.find(
    (user) => user.email === email || user.password === password
  )
  const foundUserLogin = usersStore.getItemsList.find(
    (user) => user.email === email && user.password === password
  )
  if (registerForm.value) {
    if (email && password && isValidEmail(email) && isValidPassword(password) && !foundUserSignUp) {
      signUpWithWithEmailAndPassword(email, password).then(() => {
        router.push({
          name: 'home'
        })
      })
    } else if (!email || !password) {
      errorMessage.value = t('errors.allFields')
    } else if (!isValidEmail(email)) {
      errorMessage.value = t('errors.email')
    } else if (!isValidPassword(password)) {
      errorMessage.value = t('errors.password')
    } else if (foundUserSignUp) {
      errorMessage.value = t('errors.userAlreadyExists')
    }
  } else {
    if (email && password && isValidEmail(email) && isValidPassword(password) && foundUserLogin) {
      signInWithWithEmailAndPassword(email, password)
    } else if (!email || !password) {
      errorMessage.value = t('errors.allFields')
    } else if (!isValidEmail(email) || !isValidPassword(password)) {
      errorMessage.value = t('errors.emailOrPass')
    } else {
      errorMessage.value = t('errors.noSuchUsers')
    }
  }
}

function loginWithGoogle() {
  loginWithGoogleAccount().then(() => {
    router.push({
      name: 'home'
    })
  })
}
</script>

<template>
  <secondary-master-page>
    <section class="register section">
      <div class="register__container">
        <form action="#" class="register__form">
          <h1 class="register__title title">{{ pageTitle }}</h1>
          <div class="register__item item-form">
            <label>
              {{ $t('LoginPage.Email') }}
              <input v-model.trim="email" type="email" />
            </label>
          </div>
          <div class="register__item item-form">
            <label>
              {{ $t('LoginPage.Password') }}
              <input v-model.trim="password" :type="passwordFieldType" />
              <button type="button" class="see-pass-btn" @click="togglePasswordVisibility">
                <font-awesome-icon :icon="['fas', 'eye']" />
              </button>
            </label>
          </div>
          <button type="button" class="register__button button" @click="onAction(email, password)">
            {{ pageBtn }}
          </button>
          <strong v-if="errorMessage" class="err-msg">{{ errorMessage }}</strong>
          <div class="register__proposition proposition-register">
            <div class="proposition-register__top">
              <span>{{ pageProposition }}</span>
              <button type="button" @click="registerForm = !registerForm">
                {{ pagePropositionBtn }}
              </button>
            </div>
            <div class="proposition-register__middle">
              {{ $t('otherText.or') }}
            </div>
            <div class="proposition-register__bottom">
              <button type="button" @click="loginWithGoogle">
                {{ $t('otherText.googleLogin') }}
                <font-awesome-icon :icon="['fab', 'google']" color="red" />
              </button>
            </div>
          </div>
        </form>
      </div>
    </section>
  </secondary-master-page>
</template>

<style lang="scss" scoped>
</style>