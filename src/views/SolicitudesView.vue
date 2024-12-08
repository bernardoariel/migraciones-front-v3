<template>
  <div class="flex flex-col lg:flex-row gap-6 bg-gray-100 min-h-screen p-4">
    <div class="flex-[2] bg-white p-4 rounded-lg shadow-md max-h-[85vh] overflow-y-hidden">
      <div class="flex justify-between items-center">
        <h2 class="text-xl font-semibold mb-4">Lista de Solicitudes</h2>
        <SolicitudNavBarCard typeCategory="menores" />
        <button class="btn btn-circle" @click="personStore.setPersonId('new')">
          <PlusIcon color="#1C274C" height="30" width="30px" />
        </button>
      </div>
      <SolicitudesList />
    </div>
    <div
      class="flex-[2] bg-white p-4 rounded-lg shadow-md max-h-[85vh] overflow-auto flex justify-center items-center"
    >
      <h1 v-if="!idPersonSelected && !activeCategory" class="text-4xl">
        No existe ninguna persona seleccionada
      </h1>
      <component
        v-else
        :is="dynamicComponent"
        :personId="idPersonSelected"
        :buttons="buttonConfig"
        :ref="childRef"
      ></component>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { storeToRefs } from 'pinia';

import { usePersonStore } from '@/common/store/personStore';
import SolicitudesList from '@/common/components/SolicitudesList.vue';
import FormMenor from '@/modules/migraciones/menores/components/FormMenor.vue';
import FormAutorizante from '@/modules/migraciones/autorizantes/components/FormAutorizante.vue';
import FormAcompaneante from '@/modules/migraciones/acompaneantes/components/FormAcompaneante.vue';
import { useRoute } from 'vue-router';
import SolicitudNavBarCard from '@/common/components/SolicitudNavBarCard.vue';
import PlusIcon from '@/common/components/iconos/PlusIcon.vue';

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
const componentMap: Record<ActiveCategory, any> = {
  menores: FormMenor,
  autorizantes: FormAutorizante,
  acompaneantes: FormAcompaneante,
};

const dynamicComponent = computed(() => {
  const category = activeCategory.value as ActiveCategory;
  return componentMap[category] || null;
});

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
</script>
