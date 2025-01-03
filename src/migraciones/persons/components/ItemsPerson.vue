<template>
  <div class="entry-container mb-3 pointer p-1 border-b border-gray-400 transition-all">
    <!-- Título con el botón -->
    <div class="entry-title flex items-center justify-between gap-2">
      <!-- Información del usuario -->
      <div class="flex items-center gap-2">
        <span class="text-primary font-semibold text-lg">{{ person.numero_de_documento }}</span>
        <span class="ml-3 text-lg uppercase text-gray-800 font-semibold">
          {{ person.apellido }} {{ person.segundo_apellido }}
        </span>
        <span class="font-light capitalize text-gray-600">
          ,{{ person.nombre }} {{ person.otros_nombres }}
        </span>
      </div>
      <span 
        v-if="showWarningMessage"
        class="ml-2 text-red-600 font-medium text-xs"
      >
        Se requieren más datos para ser autorizante
      </span>

      <!-- Botón -->
      <button
        class="btn btn-primary btn-sm px-4 py-2"
        @click="seleccionarPersonId(person.id!)"
        :disabled="isDisabled"
      >
        {{ nameButton }}
      </button>
    </div>
    <!-- Contenido centrado -->
    <div class="entry-content flex items-center text-gray-500 text-sm">
      <div v-if="person.domicilio">
        {{ person.domicilio }}
      </div>
      <div class="ml-10">
        <span v-if="person.fecha_de_nacimiento">
          Fecha de Nacimiento: {{ person.fecha_de_nacimiento }}
        </span>
        <span v-if="person.fecha_de_nacimiento" class="ml-10">Edad: {{ age }}</span>
      </div>
      <div class="end"></div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { computed } from 'vue';
import { useToast } from 'vue-toastification';

import type { Person } from '../interfaces/person.interface';
import { calculateAge } from '../../../common/helpers/calculateAge';
import { usePersonStore } from '@/migraciones/persons/store/personStore';

import usePersons from '@/migraciones/persons/composables/usePersons';
import { useOrdenStore } from '@/migraciones/ordenes/store/ordenStore';

interface Props {
  person: Partial<Person>;
  nameButton: string;
  currentCategory: 'menores' | 'autorizantes' | 'acompaneantes';
}

const toast = useToast();
const props = defineProps<Props>();
const personStore = usePersonStore();
const ordenStore = useOrdenStore();
const { menor, autorizantes, acompaneantes } = storeToRefs(ordenStore);

const {
  menores: menoresTabla,
  autorizantes: autorizantesTabla,
  acompaneantes: acompaneantesTabla,
} = usePersons();

const isMaxAutorizantesReached = computed(() => autorizantes.value.length >= 2);
const isAutorizanteAndAcompanante = computed(() => {
  const documento = props.person.numero_de_documento; 

  const isInAutorizantes = autorizantesTabla.value.some(
    aut => aut.numero_de_documento === documento
  );
  
  const isInAcompanantes = acompaneantesTabla.value.some(
    acomp => acomp.numero_de_documento === documento
  );

  const result = isInAutorizantes && isInAcompanantes; 
  
  return result;
});
const showWarningMessage = computed(() => {
  return props.currentCategory === 'autorizantes' && isAutorizanteAndAcompanante.value;
});

const isDisabled = computed(() => {
  const id = props.person.id;

  if (!id) return false;

  return (
    menor.value?.id === id ||
    autorizantes.value.some((autorizante: any) => autorizante.id === id) ||
    acompaneantes.value.some((acompaneante: any) => acompaneante.id === id)
  );
});

const seleccionarPersonId = (id: number) => {
  if (isMaxAutorizantesReached.value) {
    if (!isPersonMenorOrAcompañante(id)) {
      toast.error('Ya se han seleccionado 2 autorizantes');
      return;
    }
  }

  personStore.setPersonId(id);
};

const isPersonMenorOrAcompañante = (id: number) => {
  return (
    acompaneantesTabla.value.some((acompaneanteItem: any) => acompaneanteItem.id === id) ||
    menoresTabla.value.some((menorItem: any) => menorItem.id === id)
  );
};

const age = props.person.fecha_de_nacimiento
  ? calculateAge(props.person.fecha_de_nacimiento)
  : null;
</script>

<style scoped>
.person-item {
  padding: 10px;
  border-bottom: 1px solid #ddd;
}
</style>
