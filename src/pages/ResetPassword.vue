<template>
  <q-page class="flex flex-center">
    <q-card class="auth-card">
      <q-card-section class="text-center">
        <h4 class="text-h5 q-mt-none q-mb-md">Redefinir Senha</h4>
        <p class="text-grey-7">
          Digite sua nova senha para continuar.
        </p>
      </q-card-section>

      <q-card-section>
        <q-form @submit="onSubmit" class="q-gutter-md">
          <q-input
            v-model="form.password"
            :type="isPwd ? 'password' : 'text'"
            label="Nova Senha"
            :rules="[
              val => !!val || 'Senha é obrigatória',
              val => val.length >= 6 || 'A senha deve ter no mínimo 6 caracteres'
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
              val => !!val || 'Confirmação de senha é obrigatória',
              val => val === form.password || 'As senhas não conferem'
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

          <q-btn
            type="submit"
            color="primary"
            class="full-width"
            label="Redefinir Senha"
            :loading="loading"
          />
        </q-form>
      </q-card-section>

      <q-card-section class="text-center q-pa-none">
        <q-separator class="q-my-md" />
        <p class="text-grey-7 q-ma-none">
          Lembrou sua senha?
          <q-btn
            flat
            color="primary"
            label="Fazer Login"
            to="/auth/login"
            no-caps
          />
        </p>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useAuthStore } from '../stores/auth'

const route = useRoute()
const router = useRouter()
const $q = useQuasar()
const authStore = useAuthStore()

const loading = ref(false)
const isPwd = ref(true)
const form = ref({
  password: '',
  confirmPassword: ''
})

const onSubmit = async () => {
  try {
    loading.value = true
    const token = route.query.token

    if (!token) {
      throw new Error('Token de redefinição não encontrado')
    }

    const success = await authStore.resetPassword(token, form.value.password)
    
    if (success) {
      $q.notify({
        type: 'positive',
        message: 'Senha redefinida com sucesso!'
      })
      router.push('/auth/login')
    }
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: error.message || 'Erro ao redefinir senha'
    })
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  // Verifica se existe um token na URL
  if (!route.query.token) {
    $q.notify({
      type: 'negative',
      message: 'Link de redefinição de senha inválido'
    })
    router.push('/auth/login')
  }
})
</script>

<style lang="scss" scoped>
.auth-card {
  width: 100%;
  max-width: 400px;
  padding: 20px;
}

@media (max-width: 599px) {
  .auth-card {
    margin: 20px;
  }
}
</style> 