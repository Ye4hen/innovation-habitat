import { defineStore } from 'pinia'
import getStoreTemplate from './helpers/storeTemplate'
import { useGeneralStore } from './general'
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

export const useProductsStore = defineStore('products', () => {
	const generalStore = useGeneralStore()
	const { generalApiOperation } = generalStore

	function openPopup() {
		document.body.classList.toggle('popup-active')
	}

	function closePopup() {
		document.body.classList.remove('popup-active')
	}

	return {
		openPopup,
		closePopup,
		...getStoreTemplate('products', generalApiOperation)
	}
})
