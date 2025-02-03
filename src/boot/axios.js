import { boot } from 'quasar/wrappers'
import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL
})

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Redirecionar para login se o token expirou
      window.location.href = '/auth/login'
    }
    return Promise.reject(error)
  }
)

export default boot(({ app }) => {
  app.config.globalProperties.$axios = axios
  app.config.globalProperties.$api = api
})

export { api } 