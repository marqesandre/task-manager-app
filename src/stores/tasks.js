import { defineStore } from 'pinia'
import axios from 'axios'

export const useTaskStore = defineStore('tasks', {
  state: () => ({
    tasks: [],
    loading: false,
    error: null,
    currentTask: null
  }),

  getters: {
    getTasks: (state) => state.tasks,
    getTaskById: (state) => (id) => state.tasks.find(task => task.id === id),
    getLoading: (state) => state.loading,
    getError: (state) => state.error
  },

  actions: {
    async fetchTasks() {
      try {
        this.loading = true
        this.error = null
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/tasks`)
        this.tasks = response.data
      } catch (error) {
        this.error = error.response?.data?.message || 'Erro ao carregar tarefas'
        throw error
      } finally {
        this.loading = false
      }
    },

    async createTask(taskData) {
      try {
        this.loading = true
        this.error = null
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/tasks`, taskData)
        this.tasks.push(response.data)
        return response.data
      } catch (error) {
        this.error = error.response?.data?.message || 'Erro ao criar tarefa'
        throw error
      } finally {
        this.loading = false
      }
    },

    async updateTask(id, taskData) {
      try {
        this.loading = true
        this.error = null
        const response = await axios.put(`${import.meta.env.VITE_API_URL}/tasks/${id}`, taskData)
        const index = this.tasks.findIndex(task => task.id === id)
        if (index !== -1) {
          this.tasks[index] = response.data
        }
        return response.data
      } catch (error) {
        this.error = error.response?.data?.message || 'Erro ao atualizar tarefa'
        throw error
      } finally {
        this.loading = false
      }
    },

    async deleteTask(id) {
      try {
        this.loading = true
        this.error = null
        await axios.delete(`${import.meta.env.VITE_API_URL}/tasks/${id}`)
        this.tasks = this.tasks.filter(task => task.id !== id)
      } catch (error) {
        this.error = error.response?.data?.message || 'Erro ao excluir tarefa'
        throw error
      } finally {
        this.loading = false
      }
    },

    setCurrentTask(task) {
      this.currentTask = task
    },

    clearCurrentTask() {
      this.currentTask = null
    }
  }
}) 