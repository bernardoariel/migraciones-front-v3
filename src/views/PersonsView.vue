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
              @click="personStore.setCategory('acompaneantes')"
            >
              Acompañantes
            </a>
          </li>
          <li>
            <a
              class="ml-1"
              :class="{ active: activeCategory === 'menores' }"
              @click="personStore.setCategory('menores')"
            >
              Menores
            </a>
          </li>
          <li>
            <a
              class="ml-1"
              :class="{ active: activeCategory === 'autorizantes' }"
              @click="personStore.setCategory('autorizantes')"
            >
              Autorizantes
            </a>
          </li>
        </ul>
        <button class="btn btn-circle">
          <svg
            width="30"
            height="30"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
            <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
            <g id="SVGRepo_iconCarrier">
              <path
                d="M15 12L12 12M12 12L9 12M12 12L12 9M12 12L12 15"
                stroke="#1C274C"
                stroke-width="1.5"
                stroke-linecap="round"
              ></path>
              <path
                d="M7 3.33782C8.47087 2.48697 10.1786 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 10.1786 2.48697 8.47087 3.33782 7"
                stroke="#1C274C"
                stroke-width="1.5"
                stroke-linecap="round"
              ></path>
            </g>
          </svg>
        </button>
      </div>

      <!-- Tabla de Personas -->
      <PersonList />
    </div>

    <!-- Formulario dinámico -->
    <div
      class="flex-[2] bg-white p-4 rounded-lg shadow-md max-h-[85vh] overflow-auto flex justify-center items-center"
    >
      <h1 v-if="!idPersonSelected" class="text-4xl">No existe ninguna persona seleccionada</h1>
      <component
        v-else
        :is="dynamicComponent"
        :personId="idPersonSelected"
        :buttons="buttonConfig"
      ></component>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue';
import { storeToRefs } from 'pinia';

import { usePersonStore } from '@/common/store/personStore';
import PersonList from '@/common/components/PersonList.vue';
import FormMenor from '@/modules/migraciones/menores/components/FormMenor.vue';
import FormAutorizante from '@/modules/migraciones/autorizantes/components/FormAutorizante.vue';
import FormAcompaneante from '@/modules/migraciones/acompaneantes/components/FormAcompaneante.vue';
import { useRoute } from 'vue-router';

type ActiveCategory = 'menores' | 'autorizantes' | 'acompaneantes';

interface ButtonConfig {
  label: string;
  type?: 'button' | 'submit' | 'reset';
  class?: string;
  disabled?: boolean;
  position?: 'left' | 'right' | 'center';
  action: () => void;
}

const route = useRoute();
const personStore = usePersonStore();
const { activeCategory, idPersonSelected } = storeToRefs(personStore);

// Configuración de botones por categoría
const buttonConfigurations: Record<string, ButtonConfig[]> = {
  menores: [
    {
      label: 'Cancelar',
      type: 'button',
      class: 'btn btn-ghost',
      action: () => personStore.resetState(),
      position: 'left',
    },
    {
      label: 'Agregar Menor',
      type: 'submit',
      class: 'btn btn-primary',
      action: () => console.log('Guardar Menor'),
      position: 'right',
    },
  ],
  autorizantes: [
    {
      label: 'Cancelar',
      type: 'button',
      class: 'btn btn-ghost',
      action: () => personStore.resetState(),
      position: 'left',
    },
    {
      label: 'Agregar Autorizante',
      type: 'submit',
      class: 'btn btn-primary',
      action: () => console.log('Guardar Autorizante'),
      position: 'right',
    },
  ],
  acompaneantes: [
    {
      label: 'Cancelar',
      type: 'button',
      class: 'btn btn-ghost',
      action: () => personStore.resetState(),
      position: 'left',
    },
    {
      label: 'Agregar Acompañante',
      type: 'submit',
      class: 'btn btn-primary',
      action: () => console.log('Guardar Acompañante'),
      position: 'right',
    },
  ],
};

const componentMap: Record<ActiveCategory, any> = {
  menores: FormMenor,
  autorizantes: FormAutorizante,
  acompaneantes: FormAcompaneante,
};

const dynamicComponent = computed(() => {
  const category = activeCategory.value as ActiveCategory;
  return componentMap[category] || null;
});

const buttonConfig = computed(() => {
  return buttonConfigurations[activeCategory.value || ''] || [];
});

// Actualiza la categoría activa según la ruta
const setActiveCategoryFromPath = () => {
  const category = route.path.slice(1) as ActiveCategory;
  personStore.setCategory(category);
};

// Sincroniza la ruta con la categoría activa
watch(
  () => route.path,
  () => {
    setActiveCategoryFromPath();
  },
  { immediate: true },
);
</script>
