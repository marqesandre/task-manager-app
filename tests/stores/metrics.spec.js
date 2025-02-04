import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useMetricsStore } from './src/stores/metrics'
import axios from 'axios'

vi.mock('axios')

describe('Metrics Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('should initialize with default state', () => {
    const store = useMetricsStore()
    expect(store.metrics).toBe(null)
    expect(store.loading).toBe(false)
    expect(store.error).toBe(null)
  })

  it('should fetch metrics successfully', async () => {
    const store = useMetricsStore()
    const mockMetrics = {
      active_sessions: 10,
      total_users: 100,
      total_tasks: 500,
      tasks_by_status: {
        pending: 200,
        completed: 300
      }
    }

    axios.get.mockResolvedValueOnce({ data: mockMetrics })

    await store.fetchMetrics()

    expect(store.metrics).toEqual(mockMetrics)
    expect(store.loading).toBe(false)
    expect(store.error).toBe(null)
  })

  it('should handle metrics fetch error', async () => {
    const store = useMetricsStore()
    const errorMessage = 'Failed to fetch metrics'

    axios.get.mockRejectedValueOnce({
      response: { data: { message: errorMessage } }
    })

    await expect(store.fetchMetrics()).rejects.toThrow()
    expect(store.metrics).toBe(null)
    expect(store.loading).toBe(false)
    expect(store.error).toBe(errorMessage)
  })
})