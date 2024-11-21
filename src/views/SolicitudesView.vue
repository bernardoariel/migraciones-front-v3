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
      <PersonTable
        :category="activeItem"
        @edit-person="handleEditPerson"
        titleButton="seleccionar"
      />
    </div>

    <!-- Formulario de Acompañante -->
    <div
      class="flex-[2] bg-white p-4 rounded-lg shadow-md max-h-[85vh] overflow-auto flex justify-center items-center"
    >
      <h1 class="text-4xl">No existe ninguna persona seleccionada</h1>
    </div>

    <!-- Nueva Card -->
    <div class="flex-[1] bg-white p-4 rounded-lg shadow-md max-h-[85vh] overflow-auto">
      <h2 class="text-xl font-semibold mb-4">Información Adicional</h2>

      <div
        class="w-full mb-2 select-none border-l-4 border-red-400 bg-red-100 p-4 font-medium hover:border-red-500"
      >
        <div class="flex justify-between items-center">
          <div class="avatar-group -space-x-6 rtl:space-x-reverse">
            <div class="avatar placeholder">
              <div class="bg-neutral text-neutral-content w-12">
                <span>?</span>
              </div>
            </div>
          </div>
          <div>
            <button class="btn btn-accent btn-sm" @click="setActiveItem('menores')">
              + Menores
            </button>
          </div>
        </div>
      </div>
      <div
        class="w-full mb-2 select-none border-l-4 border-yellow-400 bg-yellow-100 p-4 font-medium hover:border-yellow-500"
      >
        <div class="flex justify-between items-center">
          <div class="avatar-group -space-x-6 rtl:space-x-reverse">
            <div class="avatar">
              <div class="w-12">
                <img
                  src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                />
              </div>
            </div>

            <div class="avatar placeholder">
              <div class="bg-neutral text-neutral-content w-12">
                <span>2</span>
              </div>
            </div>
          </div>
          <div>
            <button class="btn btn-accent btn-sm" @click="setActiveItem('autorizantes')">
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
              <div class="w-12">
                <img
                  src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                />
              </div>
            </div>
            <div class="avatar">
              <div class="w-12">
                <img
                  src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                />
              </div>
            </div>

            <div class="avatar placeholder">
              <div class="bg-neutral text-neutral-content w-12">
                <span>2</span>
              </div>
            </div>
          </div>
          <div>
            <button class="btn btn-accent btn-sm" @click="setActiveItem('acompaneantes')">
              + Acompañanante
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import PersonTable from '@/common/components/PersonTable.vue';

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
/* Ajusta estilos si es necesario */
.min-h-screen {
  height: 100vh;
}
</style>
