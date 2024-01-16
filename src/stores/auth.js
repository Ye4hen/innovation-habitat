import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { useGeneralStore } from './general'
import { useUsersStore } from './users'
import authOperations from './helpers/GoogleAuthOperations.js'
import { useRouter } from 'vue-router'
export const useAuthStore = defineStore('auth', () => {
	const generalStore = useGeneralStore()
	const usersStore = useUsersStore()
	const { generalApiOperation } = generalStore
	const router = useRouter()

	let user = ref({})

	const getUser = computed(() => user.value)

	async function signUpWithWithEmailAndPassword(email, password) {
		try {
			const res = await authOperations.signUpWithWithEmailAndPassword({ email, password });

			const userToAdd = {
				id: res.uid || new Date().getTime(),
				data: {
					email,
					password,
					balance: 0,
					cart: [],
					favorite: [],
					boughtProducts: [],
					isAdmin: false,
					withEmailAndPass: true,
				}
			};

			user.value = userToAdd;

			await usersStore.addItemWithCustomId(userToAdd);

			const userDataToStore = JSON.stringify({ id: userToAdd.id, email });
			localStorage.setItem('InHabUser', userDataToStore);

			return userToAdd;
		} catch (error) {
			console.error('Error during sign-up:', error);
			throw error;
		}
	}

	async function signInWithWithEmailAndPassword(email, password) {
		return new Promise((resolve, reject) => {
			generalApiOperation({
				operation: () => authOperations.signInWithWithEmailAndPassword({ email, password })
			})
				.then(() => {
					const foundUser = usersStore.getItemsList.find(user => user.email === email && user.password === password)
					if (foundUser) {
						usersStore
							.loadItemById(foundUser.id)
							.then((result) => {
								const userToAdd = {
									id: foundUser.id,
									data: {
										...result
									}
								}
								const setUserToLocalStorage = JSON.stringify(userToAdd)
								localStorage.setItem('InHabUser', setUserToLocalStorage)
								user.value = userToAdd
								router.push({
									name: 'home'
								})
							})
							.catch((error) => {
								console.log('error');
								console.log(error)
							})
					}
				})
				.catch((error) => {
					console.log('error');
					console.log(error)
				})
		})
	}

	function loginWithGoogleAccount() {
		return new Promise((resolve, reject) => {
			generalApiOperation({
				operation: () => authOperations.loginWithGoogleAccountPopup()
			})
				.then((res) => {
					const userEmail = res.email;
					const userToAdd = {
						id: res.uid,
						data: {
							email: userEmail,
							balance: 0,
							cart: [],
							favorite: [],
							boughtProducts: [],
							isAdmin: res.isAdmin || false
						}
					};

					const foundUser = usersStore.getItemsList.find(user => user.email === userEmail);
					if (foundUser) {
						usersStore.loadItemById(foundUser.id)
							.then((result) => {
								userToAdd.data = { ...result };
								localStorage.setItem('InHabUser', JSON.stringify(userToAdd));
								user.value = userToAdd;
								router.push({ name: 'home' });
								resolve(res);
							})
							.catch((error) => reject(error));
					} else {
						localStorage.setItem('InHabUser', JSON.stringify(userToAdd));
						user.value = userToAdd;
						usersStore.addItemWithCustomId(userToAdd)
							.then(() => {
								usersStore.loadItemById(res.uid)
									.then(() => {
										resolve(res);
									})
									.catch((error) => reject(error));
							})
							.catch((error) => reject(error));
					}
				})
				.catch((error) => reject(error));
		});
	}

	function logOut() {
		generalApiOperation({
			operation: () => authOperations.logout()
		})
		localStorage.removeItem('InHabUser')
		usersStore.currentItem = null
	}

	async function getAuthData() {
		return user.value
	}

	return {
		signUpWithWithEmailAndPassword,
		signInWithWithEmailAndPassword,
		loginWithGoogleAccount,
		logOut,
		getUser,
		getAuthData,
		user
	}
})
