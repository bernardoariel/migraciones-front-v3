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
      <div v-if="showWarningMessage" class="tooltip tooltip-bottom" data-tip="primary">
        <div class="ml-2 badge badge-accent">+ Faltan datos</div>
      </div>

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

// Definición de props
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

// 🟢 Lógica de validaciones y cómputos
const hasMaxAutorizantes = computed(() => autorizantes.value.length >= 2);

const isNotMenor = computed(() => {
  const documento = props.person.numero_de_documento;
  return (
    autorizantesTabla.value.some((aut: Partial<Person>) => aut.numero_de_documento === documento) &&
    acompaneantesTabla.value.some(
      (acomp: Partial<Person>) => acomp.numero_de_documento === documento,
    )
  );
});

const showWarningMessage = computed(
  () => props.currentCategory === 'autorizantes' && isNotMenor.value,
);

const isDisabled = computed(() => {
  const id = props.person.id;
  if (!id) return false;

  return (
    menor.value?.id === id ||
    autorizantes.value.some((aut: Partial<Person>) => aut.id === id) ||
    acompaneantes.value.some((acomp: Partial<Person>) => acomp.id === id)
  );
});

// 🟢 Función para manejar selección de persona
const seleccionarPersonId = (id: number) => {
  if (hasMaxAutorizantes.value) {
    if (!isPersonInMenoresOrAcompanantes(id)) {
      toast.error('Ya se han seleccionado 2 autorizantes');
      return;
    }
  }
  personStore.setPersonId(id);
};

// 🟢 Función auxiliar para validar si una persona está en menores o acompañantes
const isPersonInMenoresOrAcompanantes = (id: number) => {
  return (
    acompaneantesTabla.value.some((acomp: Partial<Person>) => acomp.id === id) ||
    menoresTabla.value.some((menor: Partial<Person>) => menor.id === id)
  );
};

// 🟢 Cálculo de edad
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
