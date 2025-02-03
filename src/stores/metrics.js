import { defineStore } from 'pinia'
import axios from 'axios'

export const useMetricsStore = defineStore('metrics', {
  state: () => ({
    metrics: null,
    loading: false,
    error: null
  }),

  getters: {
    getMetrics: (state) => state.metrics
  },

  actions: {
    async fetchMetrics() {
      try {
        this.loading = true
        this.error = null
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/metrics`)
        this.metrics = response.data
      } catch (error) {
        this.error = error.response?.data?.message || 'Erro ao carregar métricas'
        throw error
      } finally {
        this.loading = false
      }
    }
  }
}) 