import { defineStore } from 'pinia'
import axios from 'axios'
import { jwtDecode } from 'jwt-decode'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || null,
    user: null,
    loading: false,
    error: null
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    getUser: (state) => state.user,
    isAdmin: (state) => state.user?.roles?.includes('admin') === true,
    isInWhitelist: (state) => state.user?.whitelisted === true
  },

  actions: {
    async login(email, password) {
      try {
        this.loading = true
        this.error = null
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, {
          email,
          password
        })
        this.token = response.data.token
        localStorage.setItem('token', this.token)
        this.user = jwtDecode(this.token)
        axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`
        return true
      } catch (error) {
        this.error = error.response?.data?.message || 'Erro ao fazer login'
        return false
      } finally {
        this.loading = false
      }
    },

    async register(userData) {
      try {
        this.loading = true
        this.error = null
        await axios.post(`${import.meta.env.VITE_API_URL}/auth/register`, userData)
        return true
      } catch (error) {
        this.error = error.response?.data?.message || 'Erro ao registrar usuário'
        return false
      } finally {
        this.loading = false
      }
    },

    async forgotPassword(email) {
      try {
        this.loading = true
        this.error = null
        await axios.post(`${import.meta.env.VITE_API_URL}/auth/forgot-password`, { email })
        return true
      } catch (error) {
        this.error = error.response?.data?.message || 'Erro ao solicitar redefinição de senha'
        return false
      } finally {
        this.loading = false
      }
    },

    async resetPassword(token, password) {
      try {
        this.loading = true
        this.error = null
        await axios.post(`${import.meta.env.VITE_API_URL}/auth/reset-password`, {
          token,
          password
        })
        return true
      } catch (error) {
        this.error = error.response?.data?.message || 'Erro ao redefinir senha'
        return false
      } finally {
        this.loading = false
      }
    },

    logout() {
      this.token = null
      this.user = null
      this.error = null
      
      localStorage.clear()
      
      delete axios.defaults.headers.common['Authorization']
      
      window.location.reload()
    },

    initializeAuth() {
      const token = localStorage.getItem('token')
      if (token) {
        this.token = token
        this.user = jwtDecode(token)
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      }
    }
  }
}) 