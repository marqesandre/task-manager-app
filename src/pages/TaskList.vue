<template>
  <q-page padding class="task-list-page">
    <div class="row q-mb-md items-center">
      <div class="col-12 col-sm-8">
        <h4 class="text-h5 q-my-none">Minhas Tarefas</h4>
      </div>
      <div class="col-12 col-sm-4 text-right">
        <q-btn
          color="primary"
          icon="add"
          label="Nova Tarefa"
          @click="openTaskDialog()"
        />
      </div>
    </div>

    <div class="row q-col-gutter-md scrollable-content">
      <div class="col-12">
        <q-card flat bordered>
          <q-card-section>
            <q-input
              v-model="search"
              dense
              outlined
              placeholder="Buscar tarefas..."
              class="q-mb-md"
            >
              <template v-slot:append>
                <q-icon name="search" />
              </template>
            </q-input>

            <q-list separator class="task-list">
              <q-item
                v-for="task in filteredTasks"
                :key="task.id"
                clickable
                v-ripple
                @click="openTaskDialog(task)"
              >
                <q-item-section avatar>
                  <q-checkbox
                    v-model="task.completed"
                    @click.stop="toggleTaskStatus(task)"
                  />
                </q-item-section>

                <q-item-section>
                  <q-item-label
                    :class="{ 'text-strike': task.completed }"
                  >
                    {{ task.title }}
                  </q-item-label>
                  <q-item-label caption>
                    {{ task.description }}
                  </q-item-label>
                  <q-item-label caption class="row items-center">
                    <q-icon name="event" size="16px" class="q-mr-xs" />
                    {{ formatDate(task.due_date) }}
                    <q-chip
                      :color="getStatusColor(task.status)"
                      text-color="white"
                      size="sm"
                      class="q-ml-sm"
                    >
                      {{ task.status }}
                    </q-chip>
                  </q-item-label>
                </q-item-section>

                <q-item-section side>
                  <q-btn
                    flat
                    round
                    color="negative"
                    icon="delete"
                    @click.stop="confirmDelete(task)"
                  />
                </q-item-section>
              </q-item>

              <q-item v-if="!filteredTasks.length">
                <q-item-section class="text-center text-grey">
                  Nenhuma tarefa encontrada
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Dialog para criar/editar tarefa -->
    <q-dialog v-model="taskDialog" persistent>
      <q-card style="min-width: 350px">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">{{ editingTask ? 'Editar' : 'Nova' }} Tarefa</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section>
          <q-form @submit="saveTask" class="q-gutter-md">
            <q-input
              v-model="taskForm.title"
              label="Título"
              :rules="[val => !!val || 'Título é obrigatório']"
            />

            <q-input
              v-model="taskForm.description"
              type="textarea"
              label="Descrição"
            />

            <q-input
              v-model="taskForm.due_date"
              label="Data de Vencimento"
              :rules="[val => !!val || 'Data de vencimento é obrigatória']"
            >
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                    <q-date
                      v-model="taskForm.due_date"
                      mask="YYYY-MM-DDTHH:mm:ssZ"
                      today-btn
                    >
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="Fechar" color="primary" flat />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
                <q-icon name="access_time" class="cursor-pointer">
                  <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                    <q-time
                      v-model="taskForm.due_date"
                      mask="YYYY-MM-DDTHH:mm:ssZ"
                      format24h
                    >
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="Fechar" color="primary" flat />
                      </div>
                    </q-time>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>

            <q-select
              v-model="taskForm.status"
              :options="statusOptions"
              label="Status"
              :rules="[val => !!val || 'Status é obrigatório']"
            />

            <div class="row justify-end q-gutter-sm">
              <q-btn
                label="Cancelar"
                color="grey"
                v-close-popup
                flat
              />
              <q-btn
                type="submit"
                :label="editingTask ? 'Salvar' : 'Criar'"
                color="primary"
                :loading="loading"
              />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useQuasar, date } from 'quasar'
import { useTaskStore } from '../stores/tasks'

const $q = useQuasar()
const taskStore = useTaskStore()

const search = ref('')
const taskDialog = ref(false)
const loading = ref(false)
const editingTask = ref(null)

const statusOptions = [
  'pending',
  'in_progress',
  'completed',
  'cancelled'
]

const taskForm = ref({
  title: '',
  description: '',
  due_date: date.formatDate(new Date(), 'YYYY-MM-DDTHH:mm:ssZ'),
  status: 'pending'
})

const filteredTasks = computed(() => {
  const searchLower = search.value.toLowerCase()
  return taskStore.getTasks.filter(task =>
    task.title.toLowerCase().includes(searchLower) ||
    task.description.toLowerCase().includes(searchLower)
  )
})

const formatDate = (dateStr) => {
  if (!dateStr) return ''
  return date.formatDate(dateStr, 'DD/MM/YYYY HH:mm')
}

const getStatusColor = (status) => {
  const colors = {
    pending: 'warning',
    in_progress: 'info',
    completed: 'positive',
    cancelled: 'negative'
  }
  return colors[status] || 'grey'
}

const openTaskDialog = (task = null) => {
  editingTask.value = task
  if (task) {
    taskForm.value = { ...task }
  } else {
    taskForm.value = {
      title: '',
      description: '',
      due_date: date.formatDate(new Date(), 'YYYY-MM-DDTHH:mm:ssZ'),
      status: 'pending'
    }
  }
  taskDialog.value = true
}

const saveTask = async () => {
  try {
    loading.value = true
    if (editingTask.value) {
      await taskStore.updateTask(editingTask.value.id, taskForm.value)
      $q.notify({
        type: 'positive',
        message: 'Tarefa atualizada com sucesso!'
      })
    } else {
      await taskStore.createTask(taskForm.value)
      $q.notify({
        type: 'positive',
        message: 'Tarefa criada com sucesso!'
      })
    }
    taskDialog.value = false
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: error.message || 'Erro ao salvar tarefa'
    })
  } finally {
    loading.value = false
  }
}

const toggleTaskStatus = async (task) => {
  try {
    await taskStore.updateTask(task.id, {
      ...task,
      status: task.completed ? 'completed' : 'pending'
    })
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: error.message || 'Erro ao atualizar status da tarefa'
    })
  }
}

const confirmDelete = (task) => {
  $q.dialog({
    title: 'Confirmar exclusão',
    message: 'Tem certeza que deseja excluir esta tarefa?',
    cancel: true,
    persistent: true
  }).onOk(async () => {
    try {
      await taskStore.deleteTask(task.id)
      $q.notify({
        type: 'positive',
        message: 'Tarefa excluída com sucesso!'
      })
    } catch (error) {
      $q.notify({
        type: 'negative',
        message: error.message || 'Erro ao excluir tarefa'
      })
    }
  })
}

onMounted(async () => {
  try {
    loading.value = true
    await taskStore.fetchTasks()
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: error.message || 'Erro ao carregar tarefas'
    })
  } finally {
    loading.value = false
  }
})
</script>

<style lang="scss" scoped>
.text-strike {
  text-decoration: line-through;
  color: $grey-7;
}

.scrollable-content {
  max-height: 500px;
  overflow-y: auto;
}

.task-list {
  padding: 0;
  margin: 0;
  list-style: none;
  border: 1px solid $grey-4;
  border-radius: 4px;
}
</style>