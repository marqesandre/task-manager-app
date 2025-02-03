<template>
  <q-page class="flex flex-center">
    <div class="text-center">
      <div class="text-h2 text-weight-bold text-primary q-mb-md">404</div>
      <div class="text-h5 q-mb-xl">Página não encontrada</div>
      <q-btn
        color="primary"
        label="Voltar para Home"
        :to="{ name: 'home' }"
        unelevated
      />
    </div>
  </q-page>
</template>

<script setup>
// Componente simples, não requer lógica adicional
</script>

<style lang="scss" scoped>
@use "sass:color";

.q-page {
  min-height: 100vh;
  background: linear-gradient(135deg, $grey-2 0%, $grey-4 100%);

  .q-dark & {
    background: linear-gradient(135deg, $dark 0%, color.adjust($dark, $lightness: -20%) 100%);
  }
}
</style> 