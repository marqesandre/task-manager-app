<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-toolbar-title class="text-center">
          {{ appTitle }}
        </q-toolbar-title>

        <q-btn
          flat
          dense
          round
          icon="dark_mode"
          aria-label="Modo Escuro"
          @click="toggleDarkMode"
        />
      </q-toolbar>
    </q-header>

    <q-page-container class="auth-container">
      <router-view v-slot="{ Component }">
        <transition
          appear
          enter-active-class="animated fadeIn"
          leave-active-class="animated fadeOut"
        >
          <component :is="Component" />
        </transition>
      </router-view>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { computed } from 'vue'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const appTitle = computed(() => import.meta.env.VITE_APP_TITLE)

const toggleDarkMode = () => {
  $q.dark.toggle()
}
</script>

<style lang="scss">
@use "sass:color";

.auth-container {
  background: linear-gradient(135deg, $primary 0%, color.adjust($primary, $lightness: -20%) 100%);
  min-height: calc(100vh - 50px);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;

  .q-dark & {
    background: linear-gradient(135deg, $dark 0%, color.adjust($dark, $lightness: -20%) 100%);
  }
}

.auth-card {
  width: 100%;
  max-width: 400px;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  .q-dark & {
    background: $dark;
  }
}

.page-enter-active,
.page-leave-active {
  transition: opacity 0.2s ease-in-out;
}

.page-enter-from,
.page-leave-to {
  opacity: 0;
}
</style> 