<template>
  <div id="popupShipping" class="header-search-popup header-popup popup popup-shipping">
    <div class="header-popup__wrapper">
      <div class="header-popup__content shipping-popup">
        <div class="shipping-popup__top">
          <h2 class="shipping-popup__title small-title">{{ $t('balancePopup.shippingTitle') }}</h2>
        </div>
        <form action="#" class="header-popup__body shipping-popup__form">
          <div class="shipping-popup__name">
            <div class="item-form">
              <label>
                {{ $t('balancePopup.fullNameEnter') }}
                <input v-model="userName" type="text" />
              </label>
            </div>
          </div>
          <div class="shipping-popup__card card-shipping-popup">
            <div class="card-shipping-popup__item item-form">
              <label>
                {{ $t('balancePopup.cardNumberEnter') }}
                <input v-model="userCardNumber" type="text" maxlength="19" @keydown="onKeyDown" />
              </label>
            </div>
            <div class="card-shipping-popup__item item-form">
              <label>
                {{ $t('balancePopup.citySelectChoose') }}
                <select v-model="userCity">
                  <option v-for="city in citiesToShipp" :key="city" :value="city">
                    {{ city }}
                  </option>
                </select>
              </label>
            </div>
          </div>
          <div class="shipping-popup__bottom bottom-shipping-popup">
            <div class="bottom-shipping-popup__expiry-date item-form">
              <label>
                {{ $t('balancePopup.cardExpDateEnter') }}
                <input
                  v-model="userCardExpiryDate"
                  type="text"
                  maxlength="5"
                  @keydown="onKeyDown"
                />
              </label>
            </div>
            <div class="bottom-shipping-popup__cvv item-form">
              <label>
                CVV
                <input v-model="userCardCVV" type="text" maxlength="3" @keydown="onKeyDown" />
              </label>
            </div>
          </div>
          <div class="err-msg">{{ errorMessage }}</div>
          <div class="shipping-popup__actions">
            <v-btn type="button" class="shipping-popup__button" @click="repBalance">
              {{ $t('buttons.replenish') }}
            </v-btn>
            <v-btn type="button" class="shipping-popup__button" @click="closeBalancePopup">
              {{ $t('buttons.cancel') }}
            </v-btn>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useLocales } from '@/modulesHelpers/i18n.js'
const { t } = useLocales()
import { useUsersStore } from '@/stores/users'
const usersStore = useUsersStore()

let userCardExpiryDate = ref('')
let userCardCVV = ref(null)
let userCardNumber = ref(null)
let userName = ref(null)
let userCity = ref(null)
let errorMessage = ref(null)

const citiesToShipp = ref([
  'Kyiv',
  'Kharkiv',
  'Lviv',
  'Odessa',
  'Dnipro',
  'Warsaw',
  'Krakow',
  'Berlin',
  'Paris',
  'Tokyo'
])

const props = defineProps({
  user: {
    type: Object,
    required: true
  },
  userBalanceInput: {
    type: Number,
    required: true
  },
  profileId: {
    type: String,
    required: true
  }
})

function repBalance() {
  if (
    userName.value &&
    userName.value.length > 3 &&
    userCardExpiryDate.value &&
    userCardExpiryDate.value.length === 5 &&
    userCardCVV.value &&
    userCardCVV.value.length === 3 &&
    userCardNumber.value &&
    userCardNumber.value.length === 19 &&
    userCity.value
  ) {
    const inputBalance = parseFloat(props.userBalanceInput)

    props.user.data.balance = parseFloat(props.user.data.balance) + inputBalance
    props.user.data.balance = props.user.data.balance.toFixed(2)
    props.user.data.isCard = true
    usersStore.updateItem(props.profileId, props.user.data)
    document.body.classList.remove('shipping-popup-active')
    errorMessage.value = null
    props.userBalanceInput = 0
  } else {
    errorMessage.value = t('errors.allFields')
  }
}

function closeBalancePopup() {
  document.body.classList.remove('shipping-popup-active')
  errorMessage.value = null
}

function onKeyDown(event) {
  const key = event.key
  const isDigit = key >= '0' && key <= '9'
  const isBackspace = key === 'Backspace'
  if (!isDigit && !isBackspace) event.preventDefault()
}

watch(userCardExpiryDate, (newValue, oldValue) => {
  if (newValue.length === 2 && oldValue.length === 1) userCardExpiryDate.value = newValue + '/'
  else if (newValue.length === 2 && oldValue.length === 3) userCardExpiryDate.value = newValue[0]
  else if (
    userCardExpiryDate.value[0] > 1 ||
    (userCardExpiryDate.value[0] === '1' && parseInt(userCardExpiryDate.value[1]) > 2) ||
    (userCardExpiryDate.value[0] === '0' && userCardExpiryDate.value[1] === '0')
  ) {
    userCardExpiryDate.value = ''
  }
})

watch(userCardNumber, (newValue, oldValue) => {
  if (
    (newValue.length === 4 || newValue.length === 9 || newValue.length === 14) &&
    newValue.length - oldValue.length === 1
  )
    userCardNumber.value = newValue + ' '
})
</script>

<style lang="scss" scoped>
</style>