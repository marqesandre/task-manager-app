import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const routes = [
  {
    path: '/',
    component: () => import('../layouts/MainLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'home',
        component: () => import('../pages/TaskList.vue')
      },
      {
        path: 'profile',
        name: 'profile',
        component: () => import('../pages/UserProfile.vue')
      },
      {
        path: 'metrics',
        name: 'metrics',
        component: () => import('../pages/Metrics.vue'),
        meta: { requiresWhitelist: true }
      },
      {
        path: 'users',
        name: 'users',
        component: () => import('../pages/UserManagement.vue'),
        meta: { requiresAdmin: true }
      }
    ]
  },
  {
    path: '/auth',
    component: () => import('../layouts/AuthLayout.vue'),
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import('../pages/Login.vue')
      },
      {
        path: 'register',
        name: 'register',
        component: () => import('../pages/Register.vue')
      },
      {
        path: 'forgot-password',
        name: 'forgot-password',
        component: () => import('../pages/ForgotPassword.vue')
      },
      {
        path: 'reset-password',
        name: 'reset-password',
        component: () => import('../pages/ResetPassword.vue')
      }
    ]
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('../pages/Error404.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next({ name: 'login' })
  } else if (to.meta.requiresWhitelist && !authStore.isInWhitelist) {
    next({ name: 'home' })
  } else if (to.meta.requiresAdmin && !authStore.isAdmin) {
    next({ name: 'home' })
  } else if (authStore.isAuthenticated && to.path.startsWith('/auth')) {
    next({ name: 'home' })
  } else {
    next()
  }
})

export default router