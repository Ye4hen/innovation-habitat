<script setup>
import MainMasterPage from '@/masterpages/MainMasterPage.vue'
import { useLocales } from '@/modulesHelpers/i18n.js'
const { locale, t } = useLocales()
import { useRoute, useRouter } from 'vue-router'
import { useProductsStore } from '@/stores/products'
import { computed, ref, onMounted } from 'vue'
const productsStore = useProductsStore()

const route = useRoute()
const router = useRouter()

const productId = computed(() => route.params.productId)

const getCategoriesList = computed(() => productsStore.getCategoriesList ?? [])

let product = ref({
  id: productId.value,
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
  if (productId.value) return t('buttons.edit')
  else return t('buttons.add')
})

const titleLang = computed(() => {
  const chosenProduct = product.value.data

  if (!chosenProduct || !chosenProduct.title) {
    return null
  }

  if (locale.value === 'ua' && chosenProduct.title.ua) {
    return chosenProduct.title.ua
  } else if (locale.value === 'en' && chosenProduct.title.en) {
    return chosenProduct.title.en
  }
})

function onFileChange(event) {
  const file = event.target.files[0]
  if (file) {
    let reader = new FileReader()
    reader.onload = (e) => {
      product.value.data.img = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

async function onAction() {
  if (
    product.value.data.title.ua &&
    product.value.data.title.en &&
    product.value.data.img &&
    product.value.data.price &&
    product.value.data.category
  ) {
    errorMessage.value = null
    if (!productId.value) await productsStore.addItem(product.value.data)
    else await productsStore.updateItem(productId.value, product.value.data)
    router.push({ name: 'shop' })
  } else {
    errorMessage.value = t('errors.allFields')
  }
}

onMounted(async () => {
  if (productId.value) {
    product.value.data = await productsStore.loadItemById(productId.value)
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
                  name="productImage"
                  accept="image/png, image/gif, image/jpeg, image/jpg, image/svg"
                  @change="onFileChange"
                />
              </label>
            </div>
            <div v-if="product.data.img" class="editor__img">
              <img :src="product.data.img" :alt="titleLang" />
            </div>
          </div>
        </div>
        <div class="editor__titles">
          <div class="editor__title item-form">
            <label>
              {{ $t('EditorPage.titleUA') }}
              <input v-model="product.data.title.ua" type="text" />
            </label>
          </div>
          <div class="editor__title item-form">
            <label>
              {{ $t('EditorPage.titleEN') }}
              <input v-model="product.data.title.en" type="text" />
            </label>
          </div>
        </div>
        <div class="editor__category item-form">
          <label>
            {{ $t('EditorPage.category') }}
            <select v-model="product.data.category">
              <option v-for="category in getCategoriesList" :key="category" :value="category">
                {{ category }}
              </option>
            </select>
          </label>
        </div>
        <div class="editor__category item-form">
          <label>
            {{ $t('EditorPage.addCategory') }}
            <input v-model="product.data.category" type="text" />
          </label>
        </div>
        <div class="editor__price">
          <div class="editor__title item-form">
            <label>
              {{ $t('EditorPage.price') }}
              <input v-model="product.data.price" type="number" />
            </label>
          </div>
        </div>
        <div class="editor__descriptions">
          <div class="editor__desc item-form">
            <label>
              {{ $t('EditorPage.descUA') }}
              <textarea v-model="product.data.desc.ua" cols="30" rows="10"></textarea>
            </label>
          </div>
          <div class="editor__desc item-form">
            <label>
              {{ $t('EditorPage.descEN') }}
              <textarea v-model="product.data.desc.en" cols="30" rows="10"></textarea>
            </label>
          </div>
        </div>
        <div class="editor__admin item-form">
          <label>
            {{ $t('EditorPage.isBest') }}
            <input v-model="product.data.isBest" type="checkbox" />
          </label>
        </div>
        <strong v-if="errorMessage" class="err-msg">{{ errorMessage }}</strong>
        <div class="editor__actions">
          <v-btn class="item-products__action" @click="onAction">
            {{ pageBtn }}
          </v-btn>
          <v-btn class="item-products__action" @click="onCancel">
            {{ $t('buttons.cancel') }}
          </v-btn>
        </div>
      </div>
    </div>
  </main-master-page>
</template>


<style lang="scss" scoped>
</style>