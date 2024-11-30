<template>
  <div class="flex flex-col lg:flex-row gap-6 bg-gray-100 min-h-screen p-4">
    <div class="flex-[2] bg-white p-4 rounded-lg shadow-md max-h-[85vh] overflow-y-hidden">
      <div v-if="activeCategory">
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold mb-4">Lista de Personas</h2>
          <NavBarCard typeCategory="menores" />
          <button class="btn btn-circle" @click="personStore.setPersonId('new')">
            <PlusIcon color="#1C274C" width="50" height="50" />
          </button>
        </div>
        <PersonList />
      </div>
      <div v-else><NavBarCard typeCategory="menores" /></div>
    </div>

    <div
      class="flex-[2] bg-white p-4 rounded-lg shadow-md max-h-[85vh] overflow-auto flex justify-center"
    >
      <div v-if="!idPersonSelected && hasItems">
        <div
          class="!z-5 relative flex h-full w-full flex-col rounded-[20px] bg-white bg-clip-border p-4 shadow-3xl shadow-shadow-500 dark:!bg-navy-800 dark:text-white dark:shadow-none"
        >
          <div class="mb-8 w-full">
            <h4 class="text-xl font-bold text-navy-700 dark:text-white">
              Generación de Autorización
            </h4>
            <p class="mt-2 text-base text-gray-600">
              En esta tarjeta se mostrarán las personas seleccionadas que formarán la solicitud de
              autorización en Migraciones.
            </p>
          </div>
          <div
            class="flex w-full items-center justify-between rounded-2xl bg-white p-3 shadow-3xl shadow-shadow-500 dark:!bg-navy-700 dark:shadow-none"
          >
            <div class="flex items-center">
              <BabyIcon />

              <div class="ml-4">
                <p class="text-base font-medium text-navy-700 dark:text-white">
                  Perez Gonzalez, Juan Carlos
                </p>
                <p class="mt-2 text-sm text-gray-600">MENOR. <span>Edad 4</span> años</p>
              </div>
            </div>
            <div class="mr-4 flex items-center justify-center text-gray-600 dark:text-white">
              <button class="btn btn-circle btn-ghost">
                <EditarIcon />
              </button>
            </div>
          </div>
          <div
            class="flex w-full items-center justify-between rounded-2xl bg-white p-3 shadow-3xl shadow-shadow-500 dark:!bg-navy-700 dark:shadow-none"
          >
            <div class="flex items-center">
              <AutorizanteIcon />

              <div class="ml-4">
                <p class="text-base font-medium text-navy-700 dark:text-white">
                  Perez Gonzalez, Juan Carlos
                </p>
                <p class="mt-2 text-sm text-gray-600">AUTORIZANTE. <span>Edad 4</span> años</p>
              </div>
            </div>
            <div class="mr-4 flex items-center justify-center text-gray-600 dark:text-white">
              <button class="btn btn-circle btn-ghost">
                <EditarIcon />
              </button>
            </div>
          </div>
          <div
            class="flex w-full items-center justify-between rounded-2xl bg-white p-3 shadow-3xl shadow-shadow-500 dark:!bg-navy-700 dark:shadow-none"
          >
            <div class="flex items-center">
              <AcompaneanteIcon />

              <div class="ml-4">
                <p class="text-base font-medium text-navy-700 dark:text-white">
                  Perez Gonzalez, Juan Carlos
                </p>
                <p class="mt-2 text-sm text-gray-600">ACOMPAÑANTE. <span>Edad 4</span> años</p>
              </div>
            </div>
            <div class="mr-4 flex items-center justify-center text-gray-600 dark:text-white">
              <button class="btn btn-circle btn-ghost">
                <EditarIcon />
              </button>
            </div>
          </div>
          <div v-if="!idPersonSelected && !hasItems">
            <h1>No existen personas ingresadas en esta orden</h1>
          </div>
        </div>
      </div>

      <component
        v-else
        :is="dynamicComponent"
        :personId="idPersonSelected"
        :buttons="buttonConfig"
        :ref="childRef"
      ></component>
    </div>

    <div class="flex-[1] max-h-[85vh] overflow-auto">
      <CardValidation />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useOrdenStore } from '@/common/store/ordenStore';
import { usePersonStore } from '@/common/store/personStore';

import PersonList from '@/common/components/PersonList.vue';
import FormMenor from '@/modules/migraciones/menores/components/FormMenor.vue';
import FormAutorizante from '@/modules/migraciones/autorizantes/components/FormAutorizante.vue';
import FormAcompaneante from '@/modules/migraciones/acompaneantes/components/FormAcompaneante.vue';

import CardValidation from '@/common/components/CardValidation.vue';
import NavBarCard from '@/common/components/NavBarCard.vue';
import BabyIcon from '@/common/components/iconos/BabyIcon.vue';
import AutorizanteIcon from '@/common/components/iconos/AutorizanteIcon.vue';
import EditarIcon from '@/common/components/iconos/EditarIcon.vue';
import PlusIcon from '@/common/components/iconos/PlusIcon.vue';
import AcompaneanteIcon from '@/common/components/iconos/AcompaneanteIcon.vue';

type ActiveCategory = 'menores' | 'autorizantes' | 'acompaneantes';
const childRef = ref();

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
const hasItems = computed(() => ordenStore.hasItems);
const buttonConfig = ref<ButtonConfig[]>([]);
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

// Computed para el componente dinámico
const componentMap: Record<ActiveCategory, any> = {
  menores: FormMenor,
  autorizantes: FormAutorizante,
  acompaneantes: FormAcompaneante,
};
const dynamicComponent = computed(() => {
  const category = activeCategory.value as ActiveCategory;
  return componentMap[category] || null;
});
watch(
  hasItems,
  (newVal) => {
    console.log('Valor de hasItems:', newVal);
  },
  { immediate: true },
);
watch(
  [activeCategory, idPersonSelected],
  () => {
    console.log('Watch activeCategory::: ', activeCategory.value);
    const configs = updateButtonConfigurations();
    buttonConfig.value = configs[activeCategory.value || ''] || [];
  },
  { immediate: true },
);
onMounted(() => {
  personStore.resetState();
});
</script>

<style scoped>
.min-h-screen {
  height: 100vh;
}
</style>
