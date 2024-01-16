<script setup>
import MainMasterPage from '@/masterpages/MainMasterPage.vue'
import { useLocales } from '@/modulesHelpers/i18n.js'
const { locale, t } = useLocales()
import { useRoute, useRouter } from 'vue-router'
import { useUsersStore } from '@/stores/users'
import { computed, ref, watch, onMounted } from 'vue'
const usersStore = useUsersStore()

const route = useRoute()
const router = useRouter()

const userId = computed(() => route.params.userId)

let user = ref({
  id: userId.value,
  data: {}
})

let showPassword = ref(false)

let errorMessage = ref(null)

function onCancel() {
  router.push({ name: 'users' })
}

function togglePasswordVisibility() {
  showPassword.value = !showPassword.value
}

const passwordFieldType = computed(() => {
  return showPassword.value ? 'text' : 'password'
})

const pageBtn = computed(() => {
  if (userId.value) return t('buttons.edit')
  else return t('buttons.add')
})

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

function isValidPassword(password) {
  if (password && password.length > 6) return true
  else return false
}

async function onAction() {
  const { email, password, balance, withEmailAndPass } = user.value.data
  const isWithEmailAndPass = withEmailAndPass || !userId.value
  const isEmailValid = isValidEmail(email)
  const isPasswordValid = isValidPassword(password)

  const foundUser = usersStore.getItemsList.find(
    (oldUser) => oldUser.email === email || oldUser.password === password
  )

  if (
    (isWithEmailAndPass && email && password && isEmailValid && isPasswordValid) ||
    (!isWithEmailAndPass && email && isEmailValid)
  ) {
    user.value.data.balance = balance || 0
    errorMessage.value = null

    if (!userId.value) {
      if (!foundUser) {
        user.value.data.withEmailAndPass = true
        await usersStore.addItem(user.value.data)
      } else errorMessage.value = t('errors.userAlreadyExists')
    } else {
      await usersStore.updateItem(userId.value, user.value.data)
    }
    router.push({ name: 'users' })
  } else if (
    (isWithEmailAndPass && (!isEmailValid || !isPasswordValid)) ||
    (!isWithEmailAndPass && !isEmailValid)
  ) {
    errorMessage.value = t('errors.emailOrPass')
  } else {
    errorMessage.value = t('errors.allFields')
  }
}

onMounted(async () => {
  if (userId.value) {
    user.value.data = await usersStore.loadItemById(userId.value)
  }
})

watch(user.value, (newValue, oldVal) => {
  const regex = /^[0-9]+$/
  if (newValue.data.balance < 1 || !regex.test(newValue.data.balance)) {
    user.value.data.balance = oldVal.data.balance
  }
})
</script>

<template>
  <main-master-page>
    <div class="editor section">
      <div class="editor__container">
        <div class="editor__email">
          <div class="item-form">
            <label>
              {{ $t('EditorPage.email') }}
              <input v-model.trim="user.data.email" type="email" />
            </label>
          </div>
        </div>
        <div v-if="user.data.withEmailAndPass || !userId" class="editor__password">
          <div class="editor__title item-form">
            <label>
              {{ $t('EditorPage.password') }}
              <input v-model.trim="user.data.password" :type="passwordFieldType" />
              <button type="button" class="see-pass-btn" @click="togglePasswordVisibility">
                <font-awesome-icon :icon="['fas', 'eye']" />
              </button>
            </label>
          </div>
        </div>
        <div class="editor__balance">
          <div class="item-form">
            <label>
              {{ $t('EditorPage.balance') }}
              <input v-model.trim="user.data.balance" type="number" />
            </label>
          </div>
        </div>
        <div class="editor__admin item-form">
          <label>
            {{ $t('EditorPage.isAdmin') }}
            <input v-model.trim="user.data.isAdmin" type="checkbox" />
          </label>
        </div>
        <strong v-if="errorMessage" class="err-msg">{{ errorMessage }}</strong>
        <div class="editor__actions">
          <v-btn class="item-users__action" @click="onAction">
            {{ pageBtn }}
          </v-btn>
          <v-btn class="item-users__action" @click="onCancel">
            {{ $t('buttons.cancel') }}
          </v-btn>
        </div>
      </div>
    </div>
  </main-master-page>
</template>


<style lang="scss" scoped>
</style>