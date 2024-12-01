<template>
  <div class="flex items-center">
    <slot name="icon"></slot>
    <div class="ml-4">
      <p class="text-base font-medium text-navy-700 dark:text-white">
        {{ apellido?.toUpperCase() || '' }}
        {{ segundo_apellido?.toUpperCase() || '' }},
        <span>{{ nombre || '' }} {{ otros_nombres || '' }}</span>
      </p>
      <p class="mt-2 text-sm text-gray-600">
        {{ tipo }} .
        <span v-if="edad">{{ edad }} {{ edad && edad == 1 ? ' año .' : ' años .' }}</span>
      </p>
    </div>
  </div>
  <div class="mr-4 flex items-center justify-center text-gray-600 dark:text-white">
    <button class="btn btn-circle btn-ghost" @click="seleccionarPerson(id, category)">
      <EditarIcon />
    </button>
    <button class="btn btn-circle btn-ghost" @click="eliminarPerson(id, category)">
      <EliminarIcon />
    </button>
  </div>
</template>

<script setup lang="ts">
import EditarIcon from './iconos/EditarIcon.vue';
import EliminarIcon from './iconos/EliminarIcon.vue';
import { useOrdenStore } from '../store/ordenStore';

interface Props {
  id: number;
  apellido: string;
  nombre: string;
  segundo_apellido?: string;
  otros_nombres?: string;
  edad?: null | number;
  tipo: string;
  category: string;
}
defineProps<Props>();
const ordenStore = useOrdenStore();

const eliminarPerson = (idPerson: number, category: string) => {
  ordenStore.removePerson(category, idPerson);
};
const seleccionarPerson = (idPerson: number, category: string) => {
  ordenStore.getPerson(category, idPerson);
};
</script>

<style scoped></style>
