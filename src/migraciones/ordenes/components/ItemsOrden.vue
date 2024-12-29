<template>
  <div class="entry-container mb-3 pointer p-1 border-b border-gray-400 transition-all">
    <!-- Título con el botón -->
    <div class="entry-title flex items-center justify-between gap-2">
      <!-- Información del usuario -->
      <div class="flex items-center gap-2">
        <span v-if="orden.notary_id! <= 2" class="text-primary font-semibold text-lg">{{
          orden.notary_id
        }}</span>
        <span class="text-primary font-semibold text-lg">MENOR:</span>
        <span class="text-lg uppercase text-gray-800 font-semibold">
          {{ orden.apellido }} {{ orden.segundo_apellido }},
          <span>{{ orden.nombre }} {{ orden.otros_nombres }}</span>
        </span>
      </div>

      <!-- Botón -->
      <button class="btn btn-primary btn-sm px-4 py-2" @click="seleccionarordenId(orden.id!)">
        {{ nameButton }}
      </button>
    </div>
    <!-- Contenido centrado -->
    <div class="entry-content flex items-center text-gray-500 text-sm">
      <div v-if="orden.fecha_del_instrumento">
        <span class="text-primary">Fecha del Instrumento:</span
        ><span class="font-semibold ml-2"> {{ orden.fecha_del_instrumento }}</span>
      </div>
      <div class="ml-10">
        <span v-if="orden.fecha_del_instrumento">
          Escribano {{ orden.apellidoescribano }} {{ orden.nombreescribano }}
        </span>
      </div>
      <div class="ml-10">
        <span v-if="orden.fecha_del_instrumento">
          Nro Act Notarial {{ orden.numero_actuacion_notarial_cert_firma }}
        </span>
      </div>
      <div class="ml-10">
        <span v-if="orden.aprobacion"> Aprobación: {{ orden.aprobacion }} </span>
      </div>
      <div class="end"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { OrdenSolicitud } from '../interface/orders.interface';
import { usePersonStore } from '@/migraciones/persons/store/personStore';
import useOrdenItem from '@/migraciones/ordenes/composables/useOrdenItem';
import { getById } from '@/migraciones/persons/composables/usePerson';
import { storeToRefs } from 'pinia';
import { ref } from 'vue';
import { useOrdenStore } from '@/migraciones/ordenes/store/ordenStore';

interface Props {
  orden: Partial<OrdenSolicitud>;
  nameButton: string;
}

const props = defineProps<Props>();
const ordenStore = useOrdenStore();
const personStore = usePersonStore();

const { menor, autorizantes, acompaneantes } = storeToRefs(ordenStore);
const { cargarOrdenItem } = useOrdenItem();

// Usamos ref para hacer que 'items' sea reactivo
const items = ref<any[]>([]); // Inicialización de items como un arreglo vacío

const seleccionarordenId = async (id: number) => {
  // Cargamos los items de la orden
  ordenStore.resetOrden();
  items.value = await cargarOrdenItem(id); // Asignamos los datos a items
  ordenStore.setOrdenId(id);
  console.log('Items cargados:', items.value); // Verifica lo que retorna cargarOrdenItem

  if (Array.isArray(items.value)) {
    items.value.forEach(async (item) => {
      const { tipo, id_detalle } = item;

      // Llamamos a getById y almacenamos el resultado en el ordenStore
      switch (tipo) {
        case 'menor':
          const menorData = await getById(id_detalle);
          ordenStore.setMenor(menorData); // Suponiendo que tienes un setter en el store
          console.log('Menor id', id_detalle);
          break;
        case 'autorizante':
          const autorizanteData = await getById(id_detalle);
          ordenStore.addAutorizante(autorizanteData); // Suponiendo que tienes un setter en el store
          console.log('Autorizante id', id_detalle);
          break;
        case 'acompaneante':
          const acompaneanteData = await getById(id_detalle);
          ordenStore.addAcompaneante(acompaneanteData); // Suponiendo que tienes un setter en el store
          console.log('Acompañante id', id_detalle);
          break;
      }
    });
  } else {
    console.error('Los datos no son un array válido', items.value);
  }
};
</script>

<style scoped>
.orden-item {
  padding: 10px;
  border-bottom: 1px solid #ddd;
}
</style>
