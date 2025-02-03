import axios from 'axios'

export const usersApi = {
  async getUsers() {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/users`)
    return response.data
  },

  async createUser(userData) {
    const response = await axios.post(`${import.meta.env.VITE_API_URL}/users`, userData)
    return response.data
  },

  async updateUser(userId, userData) {
    const response = await axios.put(`${import.meta.env.VITE_API_URL}/users/${userId}`, userData)
    return response.data
  },

  async deleteUser(userId) {
    const response = await axios.delete(`${import.meta.env.VITE_API_URL}/users/${userId}`)
    return response.data
  }
} 