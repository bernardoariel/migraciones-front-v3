<template>
  <div class="flex flex-col lg:flex-row gap-6 bg-gray-100 min-h-screen p-4">
    <!-- Tabla de Personas -->
    <div class="flex-[2] bg-white p-4 rounded-lg shadow-md max-h-[85vh] overflow-y-hidden">
      <h2 class="text-xl font-semibold mb-4">Lista de Personas</h2>
      <PersonTable />
    </div>

    <!-- Formulario de Acompañante -->
    <div class="flex-[3] bg-white p-4 rounded-lg shadow-md max-h-[85vh] overflow-auto">
      <h2 class="text-xl font-semibold mb-4">Formulario de Acompañante</h2>
      <FormAcompaneante :acompaneante="null" />
    </div>
  </div>
</template>

<script setup lang="ts">
import PersonTable from '@/common/components/PersonTable.vue';
import FormAcompaneante from '@/modules/migraciones/acompaneantes/components/FormAcompaneante.vue';
</script>

<style scoped>
/* Si necesitas ajustar el comportamiento exacto del alto */
.min-h-screen {
  height: 100vh; /* Mantiene el contenedor ocupando toda la pantalla */
}
</style>
