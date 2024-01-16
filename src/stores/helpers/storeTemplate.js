import DbOperations from './DbOperations'
import { getFiltersList } from './helpers'

import { ref, computed } from 'vue'

export default function getStoreTemplate(collectionTitle, generalApiOperation) {
	const collectionDB = new DbOperations(collectionTitle)

	const itemsList = ref(null)
	const currentItem = ref(null)
	let filter = ref({
		title: '',
		category: [],
		priceFrom: null,
		priceTo: null
	})

	function setFilter(filterData) {
		filter.value = filterData
	}

	async function loadItemsList() {
		itemsList.value = await generalApiOperation({
			operation: () => collectionDB.loadItemsList()
		})
	}

	async function loadItemById(itemId) {
		currentItem.value = await generalApiOperation({
			operation: () => collectionDB.getItemById(itemId)
		})
		return currentItem.value
	}

	async function loadFilteredData(fieldTitle, compareOperator, valueToCompare) {
		itemsList.value = await generalApiOperation({
			operation: () => collectionDB.loadFilteredData(fieldTitle, compareOperator, valueToCompare)
		})
		return itemsList.value
	}

	async function loadDocumentsFromIdsList(idsList) {
		itemsList.value = await generalApiOperation({
			operation: () => collectionDB.loadDocumentsFromIdsList(idsList)
		})
		return itemsList.value
	}

	async function addItem(itemData) {
		currentItem.value = await generalApiOperation({
			operation: () => collectionDB.addItem(itemData)
		})
	}

	async function addItemToArray(id, arrayProperty, itemData) {
		currentItem.value = await generalApiOperation({
			operation: () => collectionDB.addItemToArray(id, arrayProperty, itemData)
		})
	}

	async function removeItemFromArray(id, arrayProperty, itemData) {
		currentItem.value = await generalApiOperation({
			operation: () => collectionDB.removeItemFromArray(id, arrayProperty, itemData)
		})
	}

	async function addItemWithCustomId({ id, data }) {
		currentItem.value = await generalApiOperation({
			operation: () => collectionDB.addItemWithCustomId(id, data)
		})
	}

	async function updateItem(id, data) {
		currentItem.value = await generalApiOperation({
			operation: () => collectionDB.updateItem(id, data)
		})
		if (collectionTitle === 'users') {
			currentItem.value = data
		}
	}

	async function deleteItem(itemId) {
		await generalApiOperation({
			operation: () => collectionDB.deleteItem(itemId)
		})
		itemsList.value = itemsList.value.filter((item) => item.id !== itemId)
	}

	const getItemsList = computed(() => itemsList.value ?? [])
	const getCurrentItem = computed(() => currentItem.value)
	const getCategoriesList = computed(() => getFiltersList(itemsList.value, "category"))

	const getFilteredList = computed(() => {
		return itemsList.value && itemsList.value.filter(item => {
			const matchTitle =
				!filter.value.title ||
				(item.title.ua.toLowerCase().includes(filter.value.title.toLowerCase()) ||
					item.title.en.toLowerCase().includes(filter.value.title.toLowerCase()));

			const matchCategory =
				!filter.value.category.length ||
				filter.value.category.includes(item.category);

			const matchPrice =
				(!filter.value.priceFrom || parseFloat(item.price) >= parseFloat(filter.value.priceFrom)) &&
				(!filter.value.priceTo || parseFloat(item.price) <= parseFloat(filter.value.priceTo));

			return matchCategory && matchPrice && matchTitle;
		});
	});

	return {
		loadItemsList,
		addItem,
		addItemWithCustomId,
		addItemToArray,
		removeItemFromArray,
		updateItem,
		deleteItem,
		currentItem,
		getItemsList,
		getCategoriesList,
		getFilteredList,
		setFilter,
		loadItemById,
		loadFilteredData,
		getCurrentItem,
		loadDocumentsFromIdsList
	}
}
