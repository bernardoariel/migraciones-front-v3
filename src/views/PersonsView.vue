<template>
  <div class="flex flex-col lg:flex-row gap-6 bg-gray-100 min-h-screen p-4">
    <div class="flex-[2] bg-white p-4 rounded-lg shadow-md max-h-[85vh] overflow-y-hidden">
      <div class="flex justify-between items-center">
        <h2 class="text-xl font-semibold mb-4">Lista de Personas</h2>
        <NavBarCard typeCategory="menores" />
        <button class="btn btn-circle" @click="personStore.setPersonId('new')">
          <PlusIcon color="#1C274C" height="30" width="30px" />
        </button>
      </div>
      <PersonList />
    </div>
    <!-- Formulario Base -->
    <div
      class="flex-[2] bg-white p-4 rounded-lg shadow-md max-h-[85vh] overflow-auto flex justify-center items-center"
    >
      <h1 v-if="!idPersonSelected && !activeCategory" class="text-4xl">
        No existe ninguna persona seleccionada
      </h1>
      <PersonForm v-else :autorizante="idPersonSelected" :buttons="buttonConfig" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import { storeToRefs } from 'pinia';

import NavBarCard from '@/migraciones/persons/components/NavBarCard.vue';
import PersonList from '@/migraciones/persons/components/PersonList.vue';
import PersonForm from '@/migraciones/persons/components/PersonForm.vue';

import PlusIcon from '@/common/components/iconos/PlusIcon.vue';
import { useOrdenStore } from '@/migraciones/ordenes/store/ordenStore';
import { useRoute } from 'vue-router';
import { usePersonStore } from '@/migraciones/persons/store/personStore';

const ordenStore = useOrdenStore();

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
const { getActiveCategory, getIdPersonSelected } = storeToRefs(personStore);
const idPersonSelected = getIdPersonSelected;
const activeCategory = getActiveCategory;

const buttonConfig = ref<ButtonConfig[]>([]);
const updateButtonConfigurations = (): Record<string, ButtonConfig[]> => {
  return {
    menores: [
      {
        label: 'Cancelar',
        type: 'button',
        class: 'btn btn-ghost',
        action: () => personStore.resetState(),
        position: 'left',
      },
      {
        label: idPersonSelected.value ? 'Modificar Menor' : 'Agregar Menor',
        type: 'submit',
        class: 'btn btn-primary',
        action: () => childRef.value?.onSubmit(),
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
        label: idPersonSelected.value ? 'Modificar Autorizante' : 'Agregar Autorizante',
        type: 'submit',
        class: 'btn btn-primary',
        action: () => childRef.value?.onSubmit(),
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
        label: idPersonSelected.value ? 'Modificar Acompañante' : 'Agregar Acompañante',
        type: 'submit',
        class: 'btn btn-primary',
        action: () => childRef.value?.onSubmit(),
        position: 'right',
      },
    ],
  };
};

const childRef = ref();

const setActiveCategoryFromPath = () => {
  const category = route.path.slice(1) as ActiveCategory;
  personStore.setCategory(category);
};

watch(
  () => route.path,
  () => {
    setActiveCategoryFromPath();
  },
  { immediate: true },
);

watch(
  [activeCategory, idPersonSelected],
  () => {
    const configs = updateButtonConfigurations();
    buttonConfig.value = configs[activeCategory.value || ''] || [];
  },
  { immediate: true },
);

onMounted(() => {
  ordenStore.resetOrden();
});
</script>
