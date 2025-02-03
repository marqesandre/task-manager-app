<template>
  <q-layout view="lHh Lpr lFf" class="main-layout">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title>
          {{ appTitle }}
        </q-toolbar-title>

        <q-space />

        <q-btn-dropdown flat icon="person" aria-label="Perfil">
          <q-list>
            <q-item clickable v-close-popup @click="navigateToProfile">
              <q-item-section>
                <q-item-label>Perfil</q-item-label>
              </q-item-section>
            </q-item>

            <q-item clickable v-close-popup @click="logout">
              <q-item-section>
                <q-item-label>Sair</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>

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

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      :width="200"
      :breakpoint="500"
      :style="{ backgroundColor: $q.dark.isActive ? '#1D1D1D' : '#f5f5f5' }"
    >
      <q-list>
        <q-item-label header>Menu</q-item-label>

        <q-item clickable v-ripple to="/" exact>
          <q-item-section avatar>
            <q-icon name="task" />
          </q-item-section>
          <q-item-section>Tarefas</q-item-section>
        </q-item>

        <q-item clickable v-ripple to="/profile">
          <q-item-section avatar>
            <q-icon name="person" />
          </q-item-section>
          <q-item-section>Perfil</q-item-section>
        </q-item>

        <q-item
          v-if="authStore.isInWhitelist"
          clickable
          v-ripple
          to="/metrics"
        >
          <q-item-section avatar>
            <q-icon name="analytics" />
          </q-item-section>
          <q-item-section>Métricas</q-item-section>
        </q-item>

        <q-item
          v-if="authStore.isAdmin"
          clickable
          v-ripple
          to="/users"
        >
          <q-item-section avatar>
            <q-icon name="manage_accounts" />
          </q-item-section>
          <q-item-section>Gerenciar Usuários</q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view v-slot="{ Component }">
        <suspense>
          <template #default>
            <component :is="Component" />
          </template>
          <template #fallback>
            <div class="row justify-center items-center" style="height: 100vh">
              <q-spinner size="3em" color="primary" />
            </div>
          </template>
        </suspense>
      </router-view>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useAuthStore } from '../stores/auth'

const $q = useQuasar()
const router = useRouter()
const authStore = useAuthStore()

const leftDrawerOpen = ref(false)
const appTitle = computed(() => import.meta.env.VITE_APP_TITLE)

const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

const toggleDarkMode = () => {
  $q.dark.toggle()
}

const navigateToProfile = () => {
  router.push('/profile')
}

async function logout() {
  try {
    authStore.logout()
  } catch (error) {
    console.error('Erro ao fazer logout:', error)
  }
}
</script>

<style lang="scss">
.main-layout {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.q-page-container {
  flex: 1;
  overflow: hidden;
}

.q-page {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.q-drawer {
  background-color: $grey-1;
  .q-dark & {
    background-color: $dark;
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