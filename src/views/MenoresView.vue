<template>
  <div class="flex gap-4">
    <!-- Card para la tabla -->
    <div class="w-1/2">
      <div class="card shadow-lg p-6">
        <h2 class="card-title">Tabla de Menores</h2>
        <TableComponent />
      </div>
    </div>

    <!-- Card para el formulario -->
    <div class="w-1/2">
      <div class="card shadow-lg p-6">
        <h2 class="card-title">Formulario de Menores</h2>
        <FormComponent />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import FormComponent from '@/common/components/FormComponent.vue';
import TableComponent from '@/common/components/TableComponent.vue';
</script>

<style scoped></style>
