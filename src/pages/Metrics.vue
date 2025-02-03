<template>
  <q-page padding class="scrollable-content">
    <div v-if="!authStore.isInWhitelist" class="text-center q-pa-lg">
      <q-icon name="lock" size="48px" color="negative" />
      <h4 class="text-h5 q-mt-md text-negative">Acesso Restrito</h4>
      <p class="text-grey-8">
        Você não tem permissão para acessar esta página.
      </p>
    </div>

    <template v-else>
      <div class="row q-mb-md items-center">
        <div class="col-12">
          <h4 class="text-h5 q-my-none">Métricas do Sistema</h4>
          <p class="text-grey-8 q-mt-sm">
            Última atualização: {{ formatDate(metrics?.timestamp) }}
          </p>
        </div>
      </div>

      <div class="row q-col-gutter-md">
        <!-- Cards de Métricas -->
        <div class="col-12 col-sm-6 col-md-4">
          <q-card class="metric-card">
            <q-card-section>
              <div class="text-h6">Usuários Ativos</div>
              <div class="row items-center">
                <q-icon name="people" size="32px" class="q-mr-sm text-primary" />
                <span class="text-h4">{{ metrics?.active_sessions || 0 }}</span>
              </div>
            </q-card-section>
          </q-card>
        </div>

        <div class="col-12 col-sm-6 col-md-4">
          <q-card class="metric-card">
            <q-card-section>
              <div class="text-h6">Total de Usuários</div>
              <div class="row items-center">
                <q-icon name="group" size="32px" class="q-mr-sm text-secondary" />
                <span class="text-h4">{{ metrics?.total_users || 0 }}</span>
              </div>
            </q-card-section>
          </q-card>
        </div>

        <div class="col-12 col-sm-6 col-md-4">
          <q-card class="metric-card">
            <q-card-section>
              <div class="text-h6">Total de Tarefas</div>
              <div class="row items-center">
                <q-icon name="task" size="32px" class="q-mr-sm text-accent" />
                <span class="text-h4">{{ metrics?.total_tasks || 0 }}</span>
              </div>
            </q-card-section>
          </q-card>
        </div>

        <div class="col-12 col-sm-6 col-md-4">
          <q-card class="metric-card">
            <q-card-section>
              <div class="text-h6">Tarefas para Hoje</div>
              <div class="row items-center">
                <q-icon name="event" size="32px" class="q-mr-sm text-warning" />
                <span class="text-h4">{{ metrics?.tasks_due_today || 0 }}</span>
              </div>
            </q-card-section>
          </q-card>
        </div>

        <!-- Gráfico de Status -->
        <div class="col-12">
          <q-card>
            <q-card-section>
              <div class="text-h6">Tarefas por Status</div>
              <div class="row q-mt-md">
                <template v-if="metrics?.tasks_by_status">
                  <div
                    v-for="(count, status) in metrics.tasks_by_status"
                    :key="status"
                    class="col-6 col-sm-3 q-pa-sm"
                  >
                    <q-card flat bordered>
                      <q-card-section class="text-center">
                        <div class="text-caption text-uppercase">{{ status }}</div>
                        <div class="text-h5 q-mt-sm">
                          <q-chip
                            :color="getStatusColor(status)"
                            text-color="white"
                          >
                            {{ count }}
                          </q-chip>
                        </div>
                      </q-card-section>
                    </q-card>
                  </div>
                </template>
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>

      <!-- Botão de Atualizar -->
      <q-page-sticky position="bottom-right" :offset="[20, 20]">
        <q-btn
          fab
          color="primary"
          icon="refresh"
          :loading="loading"
          @click="refreshMetrics"
        />
      </q-page-sticky>
    </template>
  </q-page>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useQuasar, date } from 'quasar'
import { useMetricsStore } from '../stores/metrics'
import { useAuthStore } from '../stores/auth'

const $q = useQuasar()
const metricsStore = useMetricsStore()
const authStore = useAuthStore()

const loading = ref(false)
const metrics = computed(() => metricsStore.getMetrics)

const formatDate = (dateStr) => {
  if (!dateStr) return ''
  return date.formatDate(dateStr, 'DD/MM/YYYY HH:mm:ss')
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

const refreshMetrics = async () => {
  try {
    loading.value = true
    await metricsStore.fetchMetrics()
    $q.notify({
      type: 'positive',
      message: 'Métricas atualizadas com sucesso!'
    })
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: error.message || 'Erro ao atualizar métricas'
    })
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  if (authStore.isInWhitelist) {
    await refreshMetrics()
  }
})
</script>

<style lang="scss" scoped>
.metric-card {
  height: 100%;
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-2px);
  }
}

.q-card {
  .q-icon {
    opacity: 0.8;
  }
}
</style>