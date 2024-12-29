<template>
  <div class="flex flex-col lg:flex-row gap-6 bg-gray-100 min-h-screen p-4">
    <div class="flex-[2] bg-white p-4 rounded-lg shadow-md max-h-[85vh] overflow-y-hidden">
      <div class="flex justify-between items-center">
        <h2 class="text-xl font-semibold mb-4">Lista de Solicitudes</h2>
        <SolicitudNavBarCard typeCategory="menores" />
        <button class="btn btn-circle" @click="showPersonForm">
          <PlusIcon color="#1C274C" height="30" width="30px" />
        </button>
      </div>
      <SolicitudesList />
    </div>
    <div
      class="flex-[2] bg-white p-4 rounded-lg shadow-md max-h-[85vh] overflow-auto flex justify-center items-center"
    >
    <template v-if="idOrdenSelected">
        <SolicitudCard v-if="!uiStore.showPersonForm" />
        <PersonForm 
          v-else
          ref="childRef"
          :buttons="buttonConfig"
        />
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { watch , ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useRoute } from 'vue-router';

import SolicitudesList from '@/migraciones/ordenes/components/SolicitudesList.vue';
import SolicitudCard from '@/migraciones/ordenes/components/SolicitudCard.vue';
import SolicitudNavBarCard from '@/migraciones/ordenes/components/SolicitudNavBarCard.vue';
import { usePersonStore } from '@/migraciones/persons/store/personStore';
import PlusIcon from '@/common/components/iconos/PlusIcon.vue';
import { useOrdenStore } from '@/migraciones/ordenes/store/ordenStore';
import { useUIStore } from '@/common/stores/uiStore';
import PersonForm from '@/migraciones/persons/components/PersonForm.vue';

type ActiveCategory = 'menores' | 'autorizantes' | 'acompaneantes';

const route = useRoute();
const ordenStore = useOrdenStore();
const uiStore = useUIStore();
const { getIdOrdenSelected } = storeToRefs(ordenStore);
const idOrdenSelected = getIdOrdenSelected;

const setActiveCategoryFromPath = () => {
  const category = route.path.slice(1) as ActiveCategory;
  ordenStore.setCategory(category);
};
const childRef = ref();
interface ButtonConfig {
  label: string;
  type?: 'button' | 'submit' | 'reset';
  class?: string;
  disabled?: boolean;
  position?: 'left' | 'right' | 'center';
  action: () => void;
}
const showForm = ref(false);

const showPersonForm = () => {
  showForm.value = true;
  ordenStore.setPersonId('new');
};

// Update button click handler
const handlePersonClick = (id: number) => {
  showForm.value = true;
  personStore.setPersonId(id);
};
const buttonConfig = ref<ButtonConfig[]>([]);
const personStore = usePersonStore();
const { getActiveCategory, getIdPersonSelected } = storeToRefs(personStore);
const activeCategory = getActiveCategory;
const idPersonSelected = getIdPersonSelected;
watch(
  () => route.path,
  () => {
    setActiveCategoryFromPath();
  },
  { immediate: true },
);
const updateButtonConfigurations = (): Record<string, ButtonConfig[]> => {
  return {
    menores: [
      {
        label: 'Cancelar',
        type: 'button',
        class: 'btn btn-ghost',
        action: () => personStore.resetState('menores'),
        position: 'left',
      },
      {
        label:
          idPersonSelected.value === 'new' || idPersonSelected.value === null
            ? 'Agregando Menor'
            : 'Seleccionar Menor',
        type: 'submit',
        class:
          idPersonSelected.value === 'new' || idPersonSelected.value === null
            ? 'btn btn-primary'
            : 'btn btn-secondary',
        action: () => {
          if (typeof idPersonSelected.value === 'number') {
            ordenStore.getPerson(activeCategory.value!, idPersonSelected.value);
          } else {
            childRef.value?.onSubmit();
          }
        },
        position: 'right',
      },
    ],
    autorizantes: [
      {
        label: 'Cancelar',
        type: 'button',
        class: 'btn btn-ghost',
        action: () => personStore.resetState('autorizantes'),
        position: 'left',
      },
      {
        label:
          idPersonSelected.value === 'new' || idPersonSelected.value === null
            ? 'Agregando Autorizante'
            : 'Seleccionar Autorizante',
        type: 'submit',
        class:
          idPersonSelected.value === 'new' || idPersonSelected.value === null
            ? 'btn btn-primary'
            : 'btn btn-secondary',
        action: () => {
          if (typeof idPersonSelected.value === 'number') {
            ordenStore.getPerson(activeCategory.value!, idPersonSelected.value);
          } else {
            childRef.value?.onSubmit();
          }
        },
        position: 'right',
      },
    ],
    acompaneantes: [
      {
        label: 'Cancelar',
        type: 'button',
        class: 'btn btn-ghost',
        action: () => personStore.resetState('acompaneantes'),
        position: 'left',
      },
      {
        label:
          idPersonSelected.value === 'new' || idPersonSelected.value === null
            ? 'Agregando Acompañante'
            : 'Seleccionar Acompañante',
        type: 'submit',
        class:
          idPersonSelected.value === 'new' || idPersonSelected.value === null
            ? 'btn btn-primary'
            : 'btn btn-secondary',
        action: () => {
          if (typeof idPersonSelected.value === 'number') {
            ordenStore.getPerson(activeCategory.value!, idPersonSelected.value);
          } else {
            childRef.value?.onSubmit();
          }
        },
        position: 'right',
      },
    ],
  };
};

// watch(hasItems, (newVal) => {}, { immediate: true });
watch(
  [activeCategory, idPersonSelected],
  () => {
    const configs = updateButtonConfigurations();
    buttonConfig.value = configs[activeCategory.value || ''] || [];
  },
  { immediate: true },
);
</script>
