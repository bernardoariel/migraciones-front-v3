<template>
  <div class="flex flex-col lg:flex-row gap-6 bg-gray-100 min-h-screen p-4">
    <div class="flex-[2] bg-white p-4 rounded-lg shadow-md max-h-[85vh] overflow-y-hidden">
      <div v-if="activeCategory">
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold mb-4">Lista de Personas</h2>
          <NavBarCard typeCategory="menores" />
          <button class="btn btn-circle" @click="personStore.setPersonId('new')">
            <PlusIcon color="#000" width="40" height="40" />
          </button>
        </div>
        <PersonList />
      </div>
      <div v-else><NavBarCard typeCategory="menores" /></div>
    </div>

    <div
      class="flex-[3] bg-white p-4 rounded-lg shadow-md max-h-[85vh] overflow-auto flex justify-center"
    >
      <SolicitudCard v-if="!idPersonSelected" />

      <PersonForm v-else :buttons="buttonConfig" />
    </div>

    <!--  <div class="flex-[1] max-h-[85vh] overflow-auto">
      <CardValidation />
    </div> -->
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, onMounted } from 'vue';
import { storeToRefs } from 'pinia';

import { usePersonStore } from '@/migraciones/persons/store/personStore';

import PersonList from '@/migraciones/persons/components/PersonList.vue';
import NavBarCard from '@/migraciones/persons/components/NavBarCard.vue';
import SolicitudCard from '@/migraciones/ordenes/components/SolicitudCard.vue';
import PlusIcon from '@/common/components/iconos/PlusIcon.vue';

import { useOrdenStore } from '@/migraciones/ordenes/store/ordenStore';
import PersonForm from '@/migraciones/persons/components/PersonForm.vue';

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

watch(hasItems, (newVal) => {}, { immediate: true });
watch(
  [activeCategory, idPersonSelected],
  () => {
    const configs = updateButtonConfigurations();
    buttonConfig.value = configs[activeCategory.value || ''] || [];
  },
  { immediate: true },
);
onMounted(() => {
  personStore.resetState('menores');
  ordenStore.resetOrden();
});
</script>

<style scoped>
.min-h-screen {
  height: 100vh;
}
</style>
