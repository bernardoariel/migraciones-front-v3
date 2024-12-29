<template>
  <div class="entry-container mb-3 pointer p-1 border-b border-gray-400 transition-all">
    <!-- Título con el botón -->
    <div class="entry-title flex items-center justify-between gap-2">
      <!-- Información del usuario -->
      <div class="flex items-center gap-2">
        <!-- <span v-if="orden.notary_id! <= 2" class="text-primary font-semibold text-lg">{{
          orden.notary_id
        }}</span> -->
        <span class="text-primary font-semibold text-lg">MENOR:</span>
        <span class="text-lg uppercase text-gray-800 font-semibold">
          {{ orden.apellido }} {{ orden.segundo_apellido }},
          <span>{{ orden.nombre }} {{ orden.otros_nombres }}</span>
        </span>
        <span class="text-primary font-semibold text-lg">DNI:</span>
        <span class="text-lg uppercase text-gray-800 font-semibold">
          {{ orden.documento }}
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
      <!-- <div class="ml-10">
        <span v-if="orden.fecha_del_instrumento">
          Escribano {{ orden.apellidoescribano }} {{ orden.nombreescribano }}
        </span>
      </div> -->
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

import useOrdenItem from '@/migraciones/ordenes/composables/useOrdenItem';
import { getById } from '@/migraciones/persons/composables/usePerson';

import { ref } from 'vue';
import { useOrdenStore } from '@/migraciones/ordenes/store/ordenStore';

interface Props {
  orden: Partial<OrdenSolicitud>;
  nameButton: string;
}

const props = defineProps<Props>();
console.log('props::: ', props);
const ordenStore = useOrdenStore();

const { cargarOrdenItem } = useOrdenItem();

const items = ref<any[]>([]);

const seleccionarordenId = async (id: number) => {
  ordenStore.resetOrden();
  items.value = await cargarOrdenItem(id);
  ordenStore.setOrdenId(id);

  if (Array.isArray(items.value)) {
    items.value.forEach(async (item) => {
      const { tipo, id_detalle } = item;

      switch (tipo) {
        case 'menor':
          ordenStore.setMenor(await getById(id_detalle));
          break;
        case 'autorizante':
          ordenStore.addAutorizante(await getById(id_detalle));
          break;
        case 'acompaneante':
          ordenStore.addAcompaneante(await getById(id_detalle));
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
