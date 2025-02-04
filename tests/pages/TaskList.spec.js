import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import { Quasar } from 'quasar'
import TaskList from './src/pages/TaskList.vue'
import { useTaskStore } from './src/stores/tasks'


const mockNotify = vi.fn()
vi.mock('quasar', () => ({
  useQuasar: () => ({
    notify: mockNotify,
    dialog: vi.fn()
  })
}))

describe('TaskList', () => {
  let wrapper
  let store

  beforeEach(() => {
    wrapper = mount(TaskList, {
      global: {
        plugins: [
          Quasar,
          createTestingPinia({
            createSpy: vi.fn
          })
        ]
      }
    })
    store = useTaskStore()
  })

  it('should render empty state when no tasks', () => {
    store.tasks = []
    expect(wrapper.text()).toContain('Nenhuma tarefa encontrada')
  })

  it('should filter tasks based on search input', async () => {
    store.tasks = [
      { id: 1, title: 'Task 1', description: 'Description 1' },
      { id: 2, title: 'Different task', description: 'Description 2' }
    ]

    const searchInput = wrapper.find('input[placeholder="Buscar tarefas..."]')
    await searchInput.setValue('Task 1')

    const filteredTasks = wrapper.findAll('.task-list .q-item')
    expect(filteredTasks).toHaveLength(1)
  })

  it('should open task dialog with empty form for new task', async () => {
    const newTaskButton = wrapper.find('button[label="Nova Tarefa"]')
    await newTaskButton.trigger('click')

    const dialog = wrapper.find('.q-dialog')
    expect(dialog.exists()).toBe(true)
    expect(dialog.text()).toContain('Nova Tarefa')
  })

  it('should create new task successfully', async () => {
    const newTask = {
      title: 'New Task',
      description: 'Test Description',
      status: 'pending'
    }

    store.createTask.mockResolvedValue(newTask)

    const newTaskButton = wrapper.find('button[label="Nova Tarefa"]')
    await newTaskButton.trigger('click')

    const titleInput = wrapper.find('input[label="Título"]')
    await titleInput.setValue(newTask.title)

    const form = wrapper.find('form')
    await form.trigger('submit')

    expect(store.createTask).toHaveBeenCalledWith(expect.objectContaining({
      title: newTask.title,
      status: 'pending'
    }))
    expect(mockNotify).toHaveBeenCalledWith(expect.objectContaining({
      type: 'positive'
    }))
  })
})