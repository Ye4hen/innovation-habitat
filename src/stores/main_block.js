import { defineStore } from 'pinia'
import getStoreTemplate from './helpers/storeTemplate'
import { useGeneralStore } from './general'

export const useMainBlockStore = defineStore('main_block', () => {
	const generalStore = useGeneralStore()
	const { generalApiOperation } = generalStore

	return getStoreTemplate('main_block', generalApiOperation)
})
