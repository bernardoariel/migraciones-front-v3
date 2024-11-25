<template>
  <div class="flex flex-col lg:flex-row gap-6 bg-gray-100 min-h-screen p-4">
    <!-- Tabla de Personas -->
    <div class="flex-[2] bg-white p-4 rounded-lg shadow-md max-h-[85vh] overflow-y-hidden">
      <div class="flex justify-between items-center">
        <h2 class="text-xl font-semibold mb-4">Lista de Personas</h2>
        <ul class="menu menu-horizontal menu-xs bg-base-200 rounded-box">
          <li>
            <a
              class="ml-1"
              :class="{ active: activeCategory === 'acompaneantes' }"
              @click="setActiveItem('acompaneantes')"
            >
              Acompañantes
            </a>
          </li>
          <li>
            <a
              class="ml-1"
              :class="{ active: activeCategory === 'menores' }"
              @click="setActiveItem('menores')"
            >
              Menores
            </a>
          </li>
          <li>
            <a
              class="ml-1"
              :class="{ active: activeCategory === 'autorizantes' }"
              @click="setActiveItem('autorizantes')"
            >
              Autorizantes
            </a>
          </li>
        </ul>
      </div>

      <!-- Tabla de Personas -->
      <PersonList />
    </div>

    <!-- Formulario de Acompañante -->
    <div
      class="flex-[2] bg-white p-4 rounded-lg shadow-md max-h-[85vh] overflow-auto flex justify-center items-center"
    >
      <h1 v-if="!idPersonSelected" class="text-4xl">No existe ninguna persona seleccionada</h1>
      <component
        v-else
        :is="dynamicComponent"
        :person-id="idPersonSelected"
        :buttons="buttonConfig"
      ></component>
    </div>

    <!-- Nueva Card -->
    <div class="flex-[1] max-h-[85vh] overflow-auto">
      <div
        class="w-full mb-2 select-none border-l-4 border-red-400 bg-red-100 p-4 font-medium hover:border-red-500"
      >
        <div class="flex justify-between items-center">
          <div class="avatar-group -space-x-6 rtl:space-x-reverse">
            <div class="avatar placeholder">
              <div class="bg-neutral text-neutral-content w-8">
                <span>?</span>
              </div>
            </div>
          </div>
          <div>
            <button class="btn glass btn-xs" @click="setActiveItem('menores')">+ Menores</button>
          </div>
        </div>
      </div>
      <div
        class="w-full mb-2 select-none border-l-4 border-yellow-400 bg-yellow-100 p-4 font-medium hover:border-yellow-500"
      >
        <div class="flex justify-between items-center">
          <div class="avatar-group -space-x-6 rtl:space-x-reverse">
            <div class="avatar">
              <div class="w-8">
                <img
                  src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                />
              </div>
            </div>

            <div class="avatar placeholder">
              <div class="bg-neutral text-neutral-content w-8">
                <span>2</span>
              </div>
            </div>
          </div>
          <div>
            <button class="btn glass btn-xs" @click="setActiveItem('autorizantes')">
              + Autorizante
            </button>
          </div>
        </div>
      </div>
      <div
        class="w-full mb-2 select-none border-l-4 border-blue-400 bg-blue-100 p-4 font-medium hover:border-blue-500"
      >
        <div class="flex justify-between items-center">
          <div class="avatar-group -space-x-6 rtl:space-x-reverse">
            <div class="avatar">
              <div class="w-8">
                <img
                  src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                />
              </div>
            </div>
            <div class="avatar">
              <div class="w-8">
                <img
                  src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                />
              </div>
            </div>

            <div class="avatar placeholder">
              <div class="bg-neutral text-neutral-content w-8">
                <span>2</span>
              </div>
            </div>
          </div>
          <div>
            <button class="btn glass btn-xs" @click="setActiveItem('acompaneantes')">
              + Acompañanante
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import PersonList from '@/common/components/PersonList.vue';
import { usePersonStore } from '@/common/store/personStore';
import { computed } from 'vue';
import FormMenor from '@/modules/migraciones/menores/components/FormMenor.vue';
import FormAutorizante from '@/modules/migraciones/autorizantes/components/FormAutorizante.vue';
import FormAcompaneante from '@/modules/migraciones/acompaneantes/components/FormAcompaneante.vue';

// Conectar el store
const personStore = usePersonStore();
const { activeCategory, idPersonSelected } = storeToRefs(personStore); // Obtener la categoría activa del store

// Función para manejar la selección de categoría
const setActiveItem = (item: 'menores' | 'acompaneantes' | 'autorizantes') => {
  personStore.setCategory(item); // Actualizar la categoría activa en el store
};
// Computed para el componente dinámico
const dynamicComponent = computed(() => {
  switch (activeCategory.value) {
    case 'menores':
      return FormMenor;
    case 'autorizantes':
      return FormAutorizante;
    case 'acompaneantes':
      return FormAcompaneante;
    default:
      return null;
  }
});
const buttonConfig = computed(() => {
  switch (activeCategory.value) {
    case 'menores':
      return [
        {
          label: 'Guardar Menor',
          type: 'submit',
          class: 'btn btn-primary',
          action: () => console.log('Guardar Menor'),
          position: 'left',
        },
        {
          label: 'Limpiar',
          type: 'button',
          class: 'btn btn-secondary',
          action: () => console.log('Limpiar Menor'),
          position: 'right',
        },
      ];
    case 'autorizantes':
      return [
        {
          label: 'Guardar Autorizante',
          type: 'submit',
          class: 'btn btn-primary',
          action: () => console.log('Guardar Autorizante'),
          position: 'left',
        },
        {
          label: 'Limpiar',
          type: 'button',
          class: 'btn btn-secondary',
          action: () => console.log('Limpiar Autorizante'),
          position: 'right',
        },
      ];
    case 'acompaneantes':
      return [
        {
          label: 'Cancelar',
          type: 'button',
          class: 'btn btn-ghost',
          action: () => console.log('Cancelar'),
          position: 'left',
        },
        {
          label: 'Agregar Acompañante',
          type: 'submit',
          class: 'btn btn-primary',
          action: () => console.log('Guardar Acompañante'),
          position: 'right',
        },
        /* {
          label: 'Limpiar',
          type: 'button',
          class: 'btn btn-secondary',
          action: () => console.log('Limpiar Acompañante'),
        }, */
      ];
    default:
      return [];
  }
});
</script>

<style scoped>
/* Ajusta estilos si es necesario */
.min-h-screen {
  height: 100vh;
}
</style>
