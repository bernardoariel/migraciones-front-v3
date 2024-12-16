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
import type { Person } from '../interfaces/person.interface';
import { calculateAge } from '../helpers/calculateAge';
import { usePersonStore } from '@/common/store/personStore';
import { useOrdenStore } from '../store/ordenStore';
import { storeToRefs } from 'pinia';
import { computed } from 'vue';
import { useToast } from 'vue-toastification';
import usePersons from '../composables/usePersons'; // Importamos el hook usePersons

interface Props {
  person: Partial<Person>;
  nameButton: string;
}

const toast = useToast();
const props = defineProps<Props>();
const personStore = usePersonStore();
const ordenStore = useOrdenStore();
const { menor, autorizantes, acompaneantes } = storeToRefs(ordenStore);

// Renombramos las variables importadas desde usePersons para evitar conflicto de nombres
const { menores: menoresTabla, autorizantes: autorizantesTabla, acompaneantes: acompaneantesTabla } = usePersons();

// Computed to check if the maximum number of autorizantes is reached
const isMaxAutorizantesReached = computed(() => autorizantes.value.length >= 2);

// Disable the button if the person is already in any of the groups (menor, autorizante, acompaneante)
const isDisabled = computed(() => {
  const id = props.person.id;

  if (!id) return false;

  // Disable button if the person is already in any group
  return (
    menor.value?.id === id ||
    autorizantes.value.some((autorizante) => autorizante.id === id) ||
    acompaneantes.value.some((acompaneante) => acompaneante.id === id)
  );
});

const seleccionarPersonId = (id: number) => {
  if (isMaxAutorizantesReached.value) {
    // If the person is an autorizante and the max is reached, show the toast
    if (!isPersonMenorOrAcompañante(id)) {
      toast.error('Ya se han seleccionado 2 autorizantes');
      console.log("Ya se han seleccionado 2 autorizantes");
      return;
    }
  }

  // Set the person ID to the store
  personStore.setPersonId(id);
};

// Helper function to check if the person is a menor or acompaneante (this check is only for autorizantes)
const isPersonMenorOrAcompañante = (id: number) => {
  return (
    // menores.value.some((menorItem) => menorItem.id === id) ||  // Verificar con los menores
    // acompaneantes.value.some((acompaneanteItem) => acompaneanteItem.id === id) ||  // Verificar con los acompañantes
    acompaneantesTabla.value.some((acompaneanteItem) => acompaneanteItem.id === id) ||  // Verificar con los acompañantes de la tabla
    menoresTabla.value.some((menorItem) => menorItem.id === id)  // Verificar con los menores de la tabla
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
