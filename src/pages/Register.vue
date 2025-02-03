<template>
  <q-page class="flex flex-center">
    <q-card class="auth-card">
      <q-card-section class="text-center">
        <h4 class="text-h5 q-mt-none q-mb-md">Criar Conta</h4>
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
            :rules="[
              val => !!val || 'E-mail é obrigatório',
              val => /^[^@]+@[^@]+\.[^@]+$/.test(val) || 'E-mail inválido'
            ]"
          />

          <q-input
            v-model="form.password"
            :type="isPwd ? 'password' : 'text'"
            label="Senha"
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
            label="Confirmar Senha"
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
            label="Registrar"
            :loading="loading"
          />
        </q-form>
      </q-card-section>

      <q-card-section class="text-center q-pa-none">
        <q-separator class="q-my-md" />
        <p class="text-grey-7 q-ma-none">
          Já tem uma conta?
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
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const $q = useQuasar()
const authStore = useAuthStore()

const loading = ref(false)
const isPwd = ref(true)

const form = ref({
  name: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const onSubmit = async () => {
  try {
    loading.value = true
    const success = await authStore.register({
      name: form.value.name,
      email: form.value.email,
      password: form.value.password
    })

    if (success) {
      $q.notify({
        type: 'positive',
        message: 'Conta criada com sucesso! Por favor, faça login.'
      })
      router.push('/auth/login')
    }
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: error.message || 'Erro ao criar conta'
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