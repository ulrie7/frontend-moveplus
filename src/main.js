import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import { useLoaderStore } from './stores/loader'

import './style.css'

const app = createApp(App)
const pinia = createPinia()
const loader = useLoaderStore(pinia)
loader.showLoader()

axios.defaults.baseURL = import.meta.env.VITE_API_URL
axios.defaults.headers.common['Content-Type'] = 'application/json'

axios.interceptors.request.use(
  (config) => {
    loader.startRequest()
    const token = localStorage.getItem('accessToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    loader.endRequest()
    return Promise.reject(error)
  },
)

axios.interceptors.response.use(
  (response) => {
    loader.endRequest()
    return response
  },
  (error) => {
    loader.endRequest()
    if (error.response?.status === 401) {
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      router.push({ name: 'LogIn' })
    }
    return Promise.reject(error)
  },
)

app.config.globalProperties.$axios = axios
app.config.globalProperties.$notify = {
  show: (type, title, message, options = {}) => {
    const notification = document.createElement('div')
    notification.className = `notification notification-${type}`

    const icon =
      {
        success: '✓',
        error: '✕',
        warning: '!',
        info: 'i',
      }[type] || ''

    notification.innerHTML = `
			<div class="notification-icon">${icon}</div>
			<div class="notification-content">
				<div class="notification-title">${title}</div>
				<div class="notification-message">${message}</div>
			</div>
			<button class="notification-close">&times;</button>
		`

    const close = () => {
      notification.style.animation = 'fadeOut 0.3s forwards'
      setTimeout(() => notification.remove(), 300)
    }

    notification.querySelector('.notification-close').addEventListener('click', close)

    const duration = options.duration || 5000
    let timeout = setTimeout(close, duration)

    notification.addEventListener('mouseenter', () => clearTimeout(timeout))
    notification.addEventListener('mouseleave', () => {
      timeout = setTimeout(close, 1000)
    })

    document.body.appendChild(notification)
    setTimeout(() => {
      notification.style.opacity = '1'
      notification.style.transform = 'translateX(0)'
    }, 10)

    return { close }
  },
  success: (title, message, options) =>
    app.config.globalProperties.$notify.show('success', title, message, options),
  error: (title, message, options) =>
    app.config.globalProperties.$notify.show('error', title, message, options),
  warning: (title, message, options) =>
    app.config.globalProperties.$notify.show('warning', title, message, options),
  info: (title, message, options) =>
    app.config.globalProperties.$notify.show('info', title, message, options),
}

app.use(pinia).use(router).mount('#app')
