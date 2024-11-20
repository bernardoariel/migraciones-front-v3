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
      <button class="btn btn-primary btn-sm px-4 py-2">editar</button>
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
import { calculateAge } from '../helpers/calculateAge';
import type { Person } from '../interfaces/person.interface';

interface Props {
  person: Partial<Person>;
}
const props = defineProps<Props>();
const age = props.person.fecha_de_nacimiento
  ? calculateAge(props.person.fecha_de_nacimiento)
  : null;
</script>
