<template>
  <div class="flex flex-col lg:flex-row gap-6 bg-gray-100 min-h-screen p-4">
    <!-- Tabla de Personas -->
    <div class="flex-[2] bg-white p-4 rounded-lg shadow-md max-h-[85vh] overflow-y-hidden">
      <div class="flex justify-between items-center">
        <h2 class="text-xl font-semibold mb-4">Lista de Personas</h2>
        <ul class="menu menu-horizontal bg-base-200 rounded-box">
          <li>
            <a
              class="ml-1"
              :class="{ active: activeItem === 'acompaneantes' }"
              @click="setActiveItem('acompaneantes')"
            >
              Acompañantes
            </a>
          </li>
          <li>
            <a
              class="ml-1"
              :class="{ active: activeItem === 'menores' }"
              @click="setActiveItem('menores')"
            >
              Menores
            </a>
          </li>
          <li>
            <a
              class="ml-1"
              :class="{ active: activeItem === 'autorizantes' }"
              @click="setActiveItem('autorizantes')"
            >
              Autorizantes
            </a>
          </li>
        </ul>
      </div>

      <!-- Tabla de Personas -->
      <PersonTable :category="activeItem" @edit-person="handleEditPerson" />
    </div>

    <!-- Formulario de Acompañante -->
    <div class="flex-[3] bg-white p-4 rounded-lg shadow-md max-h-[85vh] overflow-auto">
      <h2 class="text-xl font-semibold mb-4">Formulario de Acompañante</h2>
      <FormAcompaneante :acompaneante="selectedPersonId" />
    </div>
  </div>
</template>

<script setup lang="ts">
import PersonTable from '@/common/components/PersonTable.vue';
import FormAcompaneante from '@/modules/migraciones/acompaneantes/components/FormAcompaneante.vue';
import { ref } from 'vue';
const activeItem = ref<'menores' | 'acompaneantes' | 'autorizantes'>('acompaneantes');
const selectedPersonId = ref<number | null>(null);
const setActiveItem = (item: 'menores' | 'acompaneantes' | 'autorizantes') => {
  activeItem.value = item;
};
const handleEditPerson = (id: number | string) => {
  selectedPersonId.value = +id;
  console.log('selectedPersonId.value::: ', selectedPersonId.value);
};
</script>

<style scoped>
/* Si necesitas ajustar el comportamiento exacto del alto */
.min-h-screen {
  height: 100vh; /* Mantiene el contenedor ocupando toda la pantalla */
}
</style>
