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
        <button class="btn btn-circle" @click="personStore.setPersonId(null)">
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
              + Acompañante
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
import { useOrdenStore } from '@/common/store/ordenStore';

// Interfaz para los botones
interface ButtonConfig {
  label: string;
  type?: 'button' | 'submit' | 'reset';
  class?: string;
  disabled?: boolean;
  position?: 'left' | 'right' | 'center';
  action: () => void;
}

const personStore = usePersonStore();
const { getActiveCategory, getIdPersonSelected } = storeToRefs(personStore);
const activeCategory = getActiveCategory;
const idPersonSelected = getIdPersonSelected;

const ordenStore = useOrdenStore();
const setActiveItem = (item: 'menores' | 'acompaneantes' | 'autorizantes') => {
  personStore.setCategory(item);
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

// Configuración de botones según la categoría
const buttonConfig = computed<ButtonConfig[]>(() => {
  switch (activeCategory.value) {
    case 'menores':
      return [
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
          action: () => ordenStore.getPerson(activeCategory.value!, idPersonSelected.value),
          position: 'right',
        },
      ];
    case 'autorizantes':
      return [
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
          action: () => ordenStore.getPerson(activeCategory.value!, idPersonSelected.value),
          position: 'right',
        },
      ];
    case 'acompaneantes':
      return [
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
          action: () => ordenStore.getPerson(activeCategory.value!, idPersonSelected.value),
          position: 'right',
        },
      ];
    default:
      return [];
  }
});
</script>

<style scoped>
.min-h-screen {
  height: 100vh;
}
</style>
