import { defineStore } from 'pinia'
import getStoreTemplate from './helpers/storeTemplate'
import { useGeneralStore } from './general'

export const useAdvantagesStore = defineStore('advantages', () => {
	const generalStore = useGeneralStore()
	const { generalApiOperation } = generalStore

	return getStoreTemplate('advantages', generalApiOperation)
})
