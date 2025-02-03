import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { Quasar, Notify, Dialog, Loading } from 'quasar'
import router from './router'
import App from './App.vue'

// Import Quasar css
import '@quasar/extras/roboto-font/roboto-font.css'
import '@quasar/extras/material-icons/material-icons.css'
import 'quasar/src/css/index.sass'

// Cria a instância do app
const app = createApp(App)

// Cria e usa o Pinia ANTES de usar o router
const pinia = createPinia()
app.use(pinia)

// Usa o Quasar
app.use(Quasar, {
  plugins: {
    Notify,
    Dialog,
    Loading
  },
  config: {
    notify: {
      position: 'top-right',
      timeout: 2500,
      textColor: 'white'
    },
    loading: {},
    dark: 'auto'
  }
})

// Usa o router DEPOIS do Pinia
app.use(router)

// Monta a aplicação
app.mount('#app') 