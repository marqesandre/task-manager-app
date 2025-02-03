<template>
  <q-page class="flex flex-center">
    <q-card class="auth-card">
      <q-card-section class="text-center">
        <h4 class="text-h5 q-mt-none q-mb-md">Recuperar Senha</h4>
        <p class="text-grey-7">
          Digite seu e-mail para receber as instruções de recuperação de senha.
        </p>
      </q-card-section>

      <q-card-section>
        <q-form @submit="onSubmit" class="q-gutter-md">
          <q-input
            v-model="email"
            type="email"
            label="E-mail"
            :rules="[
              val => !!val || 'E-mail é obrigatório',
              val => /^[^@]+@[^@]+\.[^@]+$/.test(val) || 'E-mail inválido'
            ]"
          />

          <q-btn
            type="submit"
            color="primary"
            class="full-width"
            label="Enviar Instruções"
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

      <q-dialog v-model="successDialog">
        <q-card>
          <q-card-section class="row items-center">
            <q-avatar icon="check_circle" color="positive" text-color="white" />
            <span class="q-ml-sm">E-mail enviado com sucesso!</span>
          </q-card-section>

          <q-card-section>
            Por favor, verifique sua caixa de entrada e siga as instruções enviadas para recuperar sua senha.
          </q-card-section>

          <q-card-actions align="right">
            <q-btn flat label="OK" color="primary" v-close-popup />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useQuasar } from 'quasar'
import { useAuthStore } from '../stores/auth'

const $q = useQuasar()
const authStore = useAuthStore()

const email = ref('')
const loading = ref(false)
const successDialog = ref(false)

const onSubmit = async () => {
  try {
    loading.value = true
    const success = await authStore.forgotPassword(email.value)
    
    if (success) {
      successDialog.value = true
      email.value = '' // Limpa o campo após sucesso
    }
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: error.message || 'Erro ao processar solicitação'
    })
  } finally {
    loading.value = false
  }
}
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