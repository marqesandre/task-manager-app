<template>
  <q-page padding class="scrollable-content">
    <div class="row q-col-gutter-md">
      <div class="col-12 col-md-6 offset-md-3">
        <q-card>
          <q-card-section>
            <div class="text-h6">Perfil do Usuário</div>
          </q-card-section>

          <q-card-section>
            <q-form @submit="onSubmit" class="q-gutter-md">
              <q-input
                v-model="form.name"
                label="Nome"
                :rules="[val => !!val || 'Nome é obrigatório']"
              />

              <q-input
                v-model="form.email"
                type="email"
                label="E-mail"
                readonly
                disable
              />

              <q-input
                v-model="form.currentPassword"
                :type="isPwd ? 'password' : 'text'"
                label="Senha Atual"
                :rules="[val => !form.newPassword || !!val || 'Senha atual é obrigatória']"
              >
                <template v-slot:append>
                  <q-icon
                    :name="isPwd ? 'visibility_off' : 'visibility'"
                    class="cursor-pointer"
                    @click="isPwd = !isPwd"
                  />
                </template>
              </q-input>

              <q-input
                v-model="form.newPassword"
                :type="isPwd ? 'password' : 'text'"
                label="Nova Senha"
                :rules="[
                  val => !val || val.length >= 6 || 'A senha deve ter no mínimo 6 caracteres'
                ]"
              >
                <template v-slot:append>
                  <q-icon
                    :name="isPwd ? 'visibility_off' : 'visibility'"
                    class="cursor-pointer"
                    @click="isPwd = !isPwd"
                  />
                </template>
              </q-input>

              <q-input
                v-model="form.confirmPassword"
                :type="isPwd ? 'password' : 'text'"
                label="Confirmar Nova Senha"
                :rules="[
                  val => !form.newPassword || val === form.newPassword || 'As senhas não conferem'
                ]"
              >
                <template v-slot:append>
                  <q-icon
                    :name="isPwd ? 'visibility_off' : 'visibility'"
                    class="cursor-pointer"
                    @click="isPwd = !isPwd"
                  />
                </template>
              </q-input>

              <div class="row justify-end q-mt-md">
                <q-btn
                  type="submit"
                  color="primary"
                  label="Salvar Alterações"
                  :loading="loading"
                />
              </div>
            </q-form>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { useAuthStore } from '../stores/auth'

const $q = useQuasar()
const authStore = useAuthStore()

const loading = ref(false)
const isPwd = ref(true)

const form = ref({
  name: '',
  email: '',
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

onMounted(() => {
  const user = authStore.getUser
  if (user) {
    form.value.name = user.name || ''
    form.value.email = user.email || ''
  }
})

const onSubmit = async () => {
  try {
    loading.value = true
    // Aqui você implementará a lógica para atualizar o perfil do usuário
    // usando a sua API
    
    $q.notify({
      type: 'positive',
      message: 'Perfil atualizado com sucesso!'
    })
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: error.message || 'Erro ao atualizar perfil'
    })
  } finally {
    loading.value = false
  }
}
</script>

<style lang="scss" scoped>
.q-card {
  max-width: 800px;
  margin: 0 auto;
}
</style>