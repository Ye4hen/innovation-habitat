import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: '/',
			name: 'home',
			component: HomeView
		},
		{
			path: '/about',
			name: 'about',
			component: () => import('../views/AboutView.vue')
		},
		{
			path: '/shop',
			name: 'shop',
			component: () => import('../views/ShopView.vue')
		},
		{
			path: '/register',
			name: 'register',
			component: () => import('../views/RegisterView.vue')
		},
		{
			path: '/support',
			name: 'support',
			component: () => import('../views/SupportView.vue')
		},
		{
			path: '/product/:productId',
			name: 'product',
			component: () => import('../views/ProductPage.vue')
		},
		{
			path: '/profile/:profileId',
			name: 'profile',
			component: () => import('../views/ProfilePage.vue'),
			meta: { requiresAuth: true },
		},
		{
			path: '/cart/:profileId?',
			name: 'cart',
			component: () => import('../views/CartView.vue'),
			meta: { requiresAuth: true },
		},
		{
			path: '/advantage/:advantageId?',
			name: 'advantage',
			component: () => import('../views/AdvantagesEditor.vue'),
			meta: { requiresAuth: true, requiresAdmin: true },
		},
		{
			path: '/product_editor/:productId?',
			name: 'product_editor',
			component: () => import('../views/ProductEditor.vue'),
			meta: { requiresAuth: true, requiresAdmin: true },
		},
		{
			path: '/users',
			name: 'users',
			component: () => import('../views/UsersPage.vue'),
			meta: { requiresAuth: true, requiresAdmin: true },
		},
		{
			path: '/user_editor/:userId?',
			name: 'user_editor',
			component: () => import('../views/UsersEditor.vue'),
			meta: { requiresAuth: true, requiresAdmin: true },
		},
		,
		{
			path: '/:pathMatch(.*)*',
			name: 'NotFound',
			component: () => import('../views/NotFound.vue'),
			meta: { requiresAuth: false }
		},
	],
	scrollBehavior() {
		return { top: 0 };
	},

})


router.beforeEach((to) => {
	const userStorage =
		JSON.parse(localStorage.getItem('InHabUser'))
	if ((to.meta.requiresAuth && !userStorage) || (to.meta.requiresAdmin && !userStorage.data.isAdmin)) {
		return {
			name: 'register',
			query: { redirect: to.fullPath },
		}
	}
})

export default router
