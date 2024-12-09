<template>
    <div class="entry-container mb-3 pointer p-1 border-b border-gray-400 transition-all">
      <!-- Título con el botón -->
      <div class="entry-title flex items-center justify-between gap-2">
        <!-- Información del usuario -->
        <div class="flex items-center gap-2">
          <span class="text-primary font-semibold text-lg">{{ orden.notary_id }}</span>
          <span class="ml-3 text-lg uppercase text-gray-800 font-semibold">
            {{ orden.apellido }} {{ orden.segundo_apellido }}
          </span>
          <span class="font-light capitalize text-gray-600">    
            ,{{ orden.nombre }} {{ orden.otros_nombres }}
          </span>
        </div>
  
        <!-- Botón -->
        <button
          class="btn btn-primary btn-sm px-4 py-2"
          @click="seleccionarordenId(orden.id)"
         
        >
          {{ nameButton }}
        </button>
      </div>
      <!-- Contenido centrado -->
      <div class="entry-content flex items-center text-gray-500 text-sm">
        <div v-if="orden.fecha_del_instrumento">
          Fecha del Instrumento {{ orden.fecha_del_instrumento }}
        </div>
        <div class="ml-10">
        <span v-if="orden.fecha_del_instrumento">
           Escribano {{ orden.apellidoescribano }} {{ orden.nombreescribano }} 
        </span></div>
        <div class="ml-10">
        <span v-if="orden.fecha_del_instrumento">
           Nro Act Notarial {{ orden.numero_actuacion_notarial_cert_firma}} 
        </span></div>
        <div class="ml-10">
          <span v-if="orden.aprobacion">
            Aprobación: {{ orden.aprobacion }}
          </span>         
        </div>
        <div class="end"></div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import type { OrdenSolicitud } from '../interfaces/orders.interface';
  import { useOrdenStore } from '@/common/store/ordenStore';
  import { storeToRefs } from 'pinia';
  import { computed } from 'vue';
  
  interface Props {
    orden: Partial<OrdenSolicitud >;
    nameButton: string;
  }
  const props = defineProps<Props>();
  const ordenStore = useOrdenStore();

  const { menor, autorizantes, acompaneantes } = storeToRefs(ordenStore);
  
  const isDisabled = computed(() => {
    const id = props.orden.id;
  
    if (!id) return false;
  
    return (
      menor.value?.id === id ||
      autorizantes.value.some((autorizante) => autorizante.id === id) ||
      acompaneantes.value.some((acompaneante) => acompaneante.id === id)
    );
  });
  const seleccionarordenId = (id: number) => {
    ordenStore.setOrdenId(id);
  };
  
 
  </script>
  
  <style scoped>
  .orden-item {
    padding: 10px;
    border-bottom: 1px solid #ddd;
  }
  </style>
  