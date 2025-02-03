<template>
  <q-page class="flex flex-center">
    <q-card class="auth-card">
      <q-card-section class="text-center">
        <h4 class="text-h5 q-mt-none q-mb-md">Login</h4>
      </q-card-section>

      <q-card-section>
        <q-form @submit="onSubmit" class="q-gutter-md">
          <q-input
            v-model="email"
            type="email"
            label="E-mail"
            :rules="[val => !!val || 'E-mail é obrigatório',
                    val => /^[^@]+@[^@]+\.[^@]+$/.test(val) || 'E-mail inválido']"
          />

          <q-input
            v-model="password"
            :type="isPwd ? 'password' : 'text'"
            label="Senha"
            :rules="[val => !!val || 'Senha é obrigatória']"
          >
            <template v-slot:append>
              <q-icon
                :name="isPwd ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="isPwd = !isPwd"
              />
            </template>
          </q-input>

          <div class="text-right q-mb-md">
            <q-btn
              flat
              color="primary"
              label="Esqueceu a senha?"
              to="/auth/forgot-password"
              no-caps
            />
          </div>

          <q-btn
            type="submit"
            color="primary"
            class="full-width"
            label="Entrar"
            :loading="loading"
          />
        </q-form>
      </q-card-section>

      <q-card-section class="text-center q-pa-none">
        <q-separator class="q-my-md" />
        <p class="text-grey-7 q-ma-none">
          Não tem uma conta?
          <q-btn
            flat
            color="primary"
            label="Registre-se"
            to="/auth/register"
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

const $q = useQuasar()
const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const isPwd = ref(true)
const loading = ref(false)

const onSubmit = async () => {
  try {
    loading.value = true
    const success = await authStore.login(email.value, password.value)
    if (success) {
      router.push('/')
    }
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: error.message || 'Erro ao fazer login'
    })
  } finally {
    loading.value = false
  }
}
</script> 