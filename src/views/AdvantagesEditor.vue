<script setup>
import MainMasterPage from '@/masterpages/MainMasterPage.vue'
import { useLocales } from '@/modulesHelpers/i18n.js'
const { locale, t } = useLocales()
import { useRoute, useRouter } from 'vue-router'
import { useAdvantagesStore } from '@/stores/advantages'
const advantagesStore = useAdvantagesStore()
import { computed, ref, onMounted } from 'vue'

const route = useRoute()
const router = useRouter()

const advantageId = computed(() => route.params.advantageId)

let advantage = ref({
  id: advantageId.value,
  data: {
    title: {
      ua: '',
      en: ''
    },
    desc: {
      ua: '',
      en: ''
    }
  }
})

let errorMessage = ref(null)

function onCancel() {
  router.push({ name: 'home' })
}

const pageBtn = computed(() => {
  if (advantageId.value) return t('buttons.edit')
  else return t('buttons.add')
})

const titleLang = computed(() => {
  const chosenAdvantage = advantage.value.data

  if (!chosenAdvantage || !chosenAdvantage.title) {
    return null
  }

  if (locale.value === 'ua' && chosenAdvantage.title.ua) {
    return chosenAdvantage.title.ua
  } else if (locale.value === 'en' && chosenAdvantage.title.en) {
    return chosenAdvantage.title.en
  }
})

function onFileChange(event) {
  const file = event.target.files[0]
  if (file) {
    let reader = new FileReader()
    reader.onload = (e) => {
      advantage.value.data.icon = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

async function onAction() {
  if (
    advantage.value.data.title.ua &&
    advantage.value.data.title.en &&
    advantage.value.data.desc.ua &&
    advantage.value.data.desc.en &&
    advantage.value.data.icon
  ) {
    errorMessage.value = null
    if (!advantageId.value) await advantagesStore.addItem(advantage.value.data)
    else await advantagesStore.updateItem(advantageId.value, advantage.value.data)
    router.push({ name: 'home' })
  } else {
    errorMessage.value = t('errors.allFields')
  }
}

onMounted(async () => {
  if (advantageId.value) {
    advantage.value.data = await advantagesStore.loadItemById(advantageId.value)
  }
})
</script>

<template>
  <main-master-page>
    <div class="editor section">
      <div class="editor__container">
        <div class="editor__image">
          <div class="editor__image-body">
            <div class="editor__image-action">
              <label>
                {{ $t('EditorPage.img') }}
                <input
                  type="file"
                  name="advantageImage"
                  accept="image/png, image/gif, image/jpeg, image/jpg, image/svg"
                  @change="onFileChange"
                />
              </label>
            </div>
            <div v-if="advantage.data.icon" class="editor__img">
              <img :src="advantage.data.icon" :alt="titleLang" />
            </div>
          </div>
        </div>
        <div class="editor__titles">
          <div class="editor__title item-form">
            <label>
              {{ $t('EditorPage.titleUA') }}
              <input v-model="advantage.data.title.ua" type="text" />
            </label>
          </div>
          <div class="editor__title item-form">
            <label>
              {{ $t('EditorPage.titleEN') }}
              <input v-model="advantage.data.title.en" type="text" />
            </label>
          </div>
        </div>
        <div class="editor__descriptions">
          <div class="editor__desc item-form">
            <label>
              {{ $t('EditorPage.descUA') }}
              <textarea v-model="advantage.data.desc.ua" cols="30" rows="10"></textarea>
            </label>
          </div>
          <div class="editor__desc item-form">
            <label>
              {{ $t('EditorPage.descEN') }}
              <textarea v-model="advantage.data.desc.en" cols="30" rows="10"></textarea>
            </label>
          </div>
        </div>
        <strong v-if="errorMessage" class="err-msg">{{ errorMessage }}</strong>
        <div class="editor__actions">
          <v-btn class="item-advantages__action" @click="onAction">
            {{ pageBtn }}
          </v-btn>
          <v-btn class="item-advantages__action" @click="onCancel">
            {{ $t('buttons.cancel') }}
          </v-btn>
        </div>
      </div>
    </div>
  </main-master-page>
</template>

<style lang="scss" scoped>
</style>