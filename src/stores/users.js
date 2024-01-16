import { defineStore } from 'pinia'
import getStoreTemplate from './helpers/storeTemplate'
import { useGeneralStore } from './general'
import { useRouter } from 'vue-router'
import { ref } from 'vue'

export const useUsersStore = defineStore('users', () => {
	const generalStore = useGeneralStore()
	const { generalApiOperation } = generalStore
	const router = useRouter()
	const { updateItem, currentItem, getCurrentItem /* other functions */ } = getStoreTemplate('users', generalApiOperation)


	async function addToList(user, list, objId) {
		if (user && user.id) {
			const foundObjIndex = list.findIndex(obj => obj === objId);
			if (foundObjIndex !== -1) {
				list.splice(foundObjIndex, 1);
			} else {
				list.push(objId);
			}

			await updateItem(user.id, user.data);
		} else {
			router.push({
				name: 'register'
			});
		}
	}

	async function onBuy(userId, productId, productPrice, userData) {
		let productAmount = 1;
		let errorMessage = null;
		if (userId) {
			if (parseFloat(userData.balance) > parseFloat(productPrice)) {
				const parsedProductPrice = parseFloat(productPrice)
				userData.balance -= parsedProductPrice;
				userData.balance = parseFloat(userData.balance.toFixed(2));
				const foundProduct = userData.boughtProducts && userData.boughtProducts.find(product => product == productId)
				if (!foundProduct) {
					userData.boughtProducts.push(productId)
				}
				userData.cart = userData.cart.filter((item) => item !== productId)
				userData.favorite = userData.favorite.filter((item) => item !== productId)
				updateItem(userId, userData)
				productAmount = 1
				document.body.classList.add('success-popup-active')
				setTimeout(() => {
					document.body.classList.remove('success-popup-active')
				}, 3000)
			} else {
				errorMessage = "You don't have enough money on the balance. Go to your profile and replenish the balance"
				productAmount = 1
			}
		} else {
			errorMessage = null
			router.push({
				name: 'register'
			})
		}
		return errorMessage;
	}

	async function deleteRemovedProduct(user, productId) {
		user.data.cart = user.data.cart.filter((product) => product !== productId)
		user.data.favorite = user.data.favorite.filter((product) => product !== productId)
		user.data.boughtProducts = user.data.boughtProducts.filter(
			(product) => product !== productId
		)
		await updateItem(user.id, user.data)
	}

	return {
		addToList,
		deleteRemovedProduct,
		onBuy,
		...getStoreTemplate('users', generalApiOperation)
	}
})
