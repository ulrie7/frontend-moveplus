import { createRouter, createWebHashHistory } from 'vue-router'
import { useLoaderStore } from '@/stores/loader'

import LogIn from '@/views/auth/LogIn.vue'
import Layout from '@/views/admin/Layout.vue'
import Dashboard from '@/views/admin/Dashboard.vue'
import Alert from '@/views/admin/Alert.vue'
import Report from '@/views/admin/Report.vue'
import Vehicles from '@/views/admin/Vehicles.vue'
 



const routes = [
  {
    path: '/',
    name: 'Layout',
    component: Layout,
    meta: { requiresAuth: true },
    children: [
      { path: '/dashboard', name: 'Dashboard', component: Dashboard,},
      { path: '/alert', name: 'Alert', component: Alert, },
      { path: '/report', name: 'Report', component: Report,},
      { path: '/vehicles', name: 'Vehicles', component: Vehicles,},
    ],},
  {
    path: '/login',
    name: 'LogIn',
    component: LogIn,
  },
  
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

let navigationStartedAt = 0
const minimumLoaderDuration = 300

router.beforeEach((to, from, next) => {
  const loader = useLoaderStore()
  navigationStartedAt = Date.now()
  loader.showLoader()

  if (to.meta.requiresAuth && !localStorage.getItem('accessToken')) {
    return next({ name: 'LogIn' })
  }

  next()
})

router.afterEach(() => {
  const loader = useLoaderStore()
  const elapsed = Date.now() - navigationStartedAt
  const remainingTime = Math.max(0, minimumLoaderDuration - elapsed)

  setTimeout(() => loader.hideLoader(), remainingTime)
})

router.onError(() => {
  useLoaderStore().hideLoader()
})

export default router

