import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from './src/stores/auth'
import axios from 'axios'

vi.mock('axios')
vi.mock('jwt-decode', () => ({
  jwtDecode: vi.fn(() => ({
    id: '1',
    email: 'test@example.com',
    roles: ['user']
  }))
}))

describe('Auth Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('should initialize with default state', () => {
    const store = useAuthStore()
    expect(store.token).toBe(null)
    expect(store.user).toBe(null)
    expect(store.loading).toBe(false)
    expect(store.error).toBe(null)
  })

  it('should login successfully', async () => {
    const store = useAuthStore()
    const mockToken = 'mock-token'
    
    axios.post.mockResolvedValueOnce({ data: { token: mockToken } })

    const result = await store.login('test@example.com', 'password')

    expect(result).toBe(true)
    expect(store.token).toBe(mockToken)
    expect(store.error).toBe(null)
    expect(axios.defaults.headers.common['Authorization']).toBe(`Bearer ${mockToken}`)
  })

  it('should handle login failure', async () => {
    const store = useAuthStore()
    const errorMessage = 'Invalid credentials'
    
    axios.post.mockRejectedValueOnce({ 
      response: { data: { message: errorMessage } }
    })

    const result = await store.login('test@example.com', 'wrong-password')

    expect(result).toBe(false)
    expect(store.token).toBe(null)
    expect(store.error).toBe(errorMessage)
  })

  it('should logout correctly', () => {
    const store = useAuthStore()
    store.token = 'mock-token'
    store.user = { id: '1' }

    store.logout()

    expect(store.token).toBe(null)
    expect(store.user).toBe(null)
    expect(store.error).toBe(null)
    expect(axios.defaults.headers.common['Authorization']).toBeUndefined()
  })
})