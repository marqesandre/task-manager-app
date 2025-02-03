<template>
  <router-view v-slot="{ Component }">
    <transition
      appear
      enter-active-class="animated fadeIn"
      leave-active-class="animated fadeOut"
    >
      <component :is="Component" />
    </transition>
  </router-view>
</template>

<script setup>
import { onMounted } from 'vue'
import { useAuthStore } from './stores/auth'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const authStore = useAuthStore()

onMounted(() => {
  // Inicializa o estado de autenticação
  authStore.initializeAuth()
  
  // Configura o tema escuro baseado na preferência do sistema
  $q.dark.set('auto')
})
</script>

<style lang="scss">
@import './css/app.scss';

// Animações globais
.animated {
  animation-duration: 0.3s;
  animation-fill-mode: both;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes fadeOut {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}

.fadeIn {
  animation-name: fadeIn;
}

.fadeOut {
  animation-name: fadeOut;
}
</style> 