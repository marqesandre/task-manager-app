<template>
  <q-page padding>
    <div class="row q-col-gutter-md">
      <div class="col-12">
        <h5 class="q-mt-none q-mb-md">Gerenciamento de Usuários</h5>
        
        <q-card>
          <q-card-section>
            <div class="row items-center justify-between q-mb-md">
              <div class="text-h6">Lista de Usuários</div>
              <q-btn
                color="primary"
                icon="add"
                label="Novo Usuário"
                @click="openUserDialog()"
              />
            </div>

            <q-table
              :rows="users"
              :columns="columns"
              row-key="id"
              :loading="loading"
              :filter="filter"
            >
              <template v-slot:top-right>
                <q-input
                  v-model="filter"
                  placeholder="Buscar..."
                  dense
                  outlined
                  class="q-ml-md"
                >
                  <template v-slot:append>
                    <q-icon name="search" />
                  </template>
                </q-input>
              </template>

              <template v-slot:body-cell-actions="props">
                <q-td :props="props">
                  <q-btn-group flat>
                    <q-btn
                      flat
                      round
                      color="primary"
                      icon="edit"
                      @click="openUserDialog(props.row)"
                    >
                      <q-tooltip>Editar</q-tooltip>
                    </q-btn>
                    <q-btn
                      flat
                      round
                      color="negative"
                      icon="delete"
                      @click="confirmDelete(props.row)"
                    >
                      <q-tooltip>Excluir</q-tooltip>
                    </q-btn>
                  </q-btn-group>
                </q-td>
              </template>

              <template v-slot:body-cell-roles="props">
                <q-td :props="props">
                  <q-chip
                    v-for="role in props.row.roles"
                    :key="role"
                    :color="getRoleColor(role)"
                    text-color="white"
                    size="sm"
                    class="q-mr-xs"
                  >
                    {{ role }}
                  </q-chip>
                </q-td>
              </template>
            </q-table>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Dialog para criar/editar usuário -->
    <q-dialog v-model="showDialog" persistent>
      <q-card style="min-width: 350px">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">{{ dialogTitle }}</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section>
          <q-form @submit="saveUser" class="q-gutter-md">
            <q-input
              v-model="userForm.name"
              label="Nome"
              :rules="[val => !!val || 'Nome é obrigatório']"
            />
            
            <q-input
              v-model="userForm.email"
              label="Email"
              type="email"
              :rules="[
                val => !!val || 'Email é obrigatório',
                val => /^[^@]+@[^@]+\.[^@]+$/.test(val) || 'Email inválido'
              ]"
            />

            <q-input
              v-if="!userForm.id"
              v-model="userForm.password"
              label="Senha"
              type="password"
              :rules="[val => !!val || 'Senha é obrigatória']"
            />

            <q-select
              v-model="userForm.roles"
              label="Papéis"
              multiple
              :options="availableRoles"
              use-chips
              stack-label
            />

            <div class="row justify-end q-mt-md">
              <q-btn
                label="Cancelar"
                color="negative"
                flat
                v-close-popup
              />
              <q-btn
                label="Salvar"
                type="submit"
                color="primary"
                class="q-ml-sm"
              />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useQuasar } from 'quasar'
import { usersApi } from '../api/users'

const $q = useQuasar()

const loading = ref(false)
const users = ref([])
const filter = ref('')
const showDialog = ref(false)
const userForm = ref({
  name: '',
  email: '',
  password: '',
  roles: []
})

const columns = [
  {
    name: 'name',
    required: true,
    label: 'Nome',
    align: 'left',
    field: row => row.name,
    sortable: true
  },
  {
    name: 'email',
    required: true,
    label: 'Email',
    align: 'left',
    field: row => row.email,
    sortable: true
  },
  {
    name: 'roles',
    required: true,
    label: 'Papéis',
    align: 'left',
    field: row => row.roles
  },
  {
    name: 'actions',
    required: true,
    label: 'Ações',
    align: 'center'
  }
]

const availableRoles = [
  'admin',
  'user',
  'whitelisted'
]

const dialogTitle = computed(() => {
  return userForm.value.id ? 'Editar Usuário' : 'Novo Usuário'
})

function getRoleColor(role) {
  switch (role) {
    case 'admin':
      return 'purple'
    case 'whitelisted':
      return 'green'
    default:
      return 'blue'
  }
}

async function fetchUsers() {
  try {
    loading.value = true
    users.value = await usersApi.getUsers()
  } catch (error) {
    $q.notify({
      color: 'negative',
      message: 'Erro ao carregar usuários',
      icon: 'error'
    })
  } finally {
    loading.value = false
  }
}

function openUserDialog(user = null) {
  if (user) {
    userForm.value = { ...user }
  } else {
    userForm.value = {
      name: '',
      email: '',
      password: '',
      roles: ['user']
    }
  }
  showDialog.value = true
}

async function saveUser() {
  try {
    const isEdit = !!userForm.value.id
    
    if (isEdit) {
      await usersApi.updateUser(userForm.value.id, userForm.value)
    } else {
      await usersApi.createUser(userForm.value)
    }
    
    $q.notify({
      color: 'positive',
      message: `Usuário ${isEdit ? 'atualizado' : 'criado'} com sucesso`,
      icon: 'check'
    })
    
    showDialog.value = false
    fetchUsers()
  } catch (error) {
    $q.notify({
      color: 'negative',
      message: 'Erro ao salvar usuário',
      icon: 'error'
    })
  }
}

function confirmDelete(user) {
  $q.dialog({
    title: 'Confirmar exclusão',
    message: `Tem certeza que deseja excluir o usuário ${user.name}?`,
    cancel: true,
    persistent: true
  }).onOk(async () => {
    try {
      await usersApi.deleteUser(user.id)
      
      $q.notify({
        color: 'positive',
        message: 'Usuário excluído com sucesso',
        icon: 'check'
      })
      
      fetchUsers()
    } catch (error) {
      $q.notify({
        color: 'negative',
        message: 'Erro ao excluir usuário',
        icon: 'error'
      })
    }
  })
}

onMounted(() => {
  fetchUsers()
})
</script> 