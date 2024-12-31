<template>
  <div class="entry-container mb-3 pointer p-1 border-b border-gray-400 transition-all">
    <!-- Título con el botón -->
    <div class="entry-title flex items-center justify-between gap-2">
      <div class="flex items-center gap-2">
        <span class="text-primary font-semibold text-lg">MENOR:</span>
        <span class="text-lg uppercase text-gray-800 font-semibold">
          {{ orden.apellido }} {{ orden.segundo_apellido }},
          <span>{{ orden.nombre }} {{ orden.otros_nombres }}</span>
        </span>
        <span class="text-primary font-semibold text-lg">DNI:</span>
        <span class="text-lg uppercase text-gray-800 font-semibold">{{ orden.documento }}</span>
      </div>

      <!-- Botones y badge -->
      <div class="flex items-center gap-2">
        <div v-if="!orden.aprobacion" class="flex items-center gap-2">
          <div class="badge badge-warning flex items-center">Falta autorización</div>
          <!-- Mostrar botón de eliminar solo si falta la aprobación -->
          <button
            class="btn btn-circle btn-ghost flex items-center"
            @click="openDeleteModal(orden.id!)"
          >
            <EliminarIcon />
          </button>
        </div>
        <div v-else class="flex items-center gap-2">
          <div class="badge badge-info flex items-center">Autorizado</div>
        </div>
        <button
          class="btn btn-primary btn-sm px-4 py-2 flex items-center"
          @click="seleccionarOrdenId(orden.id!)"
        >
          {{ nameButton }}
        </button>
      </div>
    </div>

    <!-- Contenido centrado -->
    <div class="entry-content flex items-center text-gray-500 text-sm">
      <div v-if="orden.fecha_del_instrumento">
        <span class="text-primary">Fecha del Instrumento:</span>
        <span class="font-semibold ml-2">{{ orden.fecha_del_instrumento }}</span>
      </div>
      <div class="ml-10">
        <span v-if="orden.fecha_del_instrumento">
          Nro Act Notarial {{ orden.numero_actuacion_notarial_cert_firma }}
        </span>
      </div>
      <div class="ml-10">
        <span v-if="orden.aprobacion">Aprobación: {{ orden.aprobacion }}</span>
      </div>
    </div>

    <!-- Modal -->
    <ModalDialog
      ref="deleteModal"
      title="Confirmar Eliminación"
      message="¿Estás seguro de que deseas eliminar esta solicitud?"
      @confirm="confirmDelete"
      @cancel="cancelDelete"
    />
  </div>
</template>

<script setup lang="ts">
import type { OrdenSolicitud } from '../interface/orders.interface';

import useOrdenItem from '@/migraciones/ordenes/composables/useOrdenItem';
import { getById } from '@/migraciones/persons/composables/usePerson';

import { ref } from 'vue';
import { useOrdenStore } from '@/migraciones/ordenes/store/ordenStore';

import EliminarIcon from '@/common/components/iconos/EliminarIcon.vue';
import useOrdenes from '../composables/useOrdenes';
import ModalDialog from '@/common/components/ModalDialog.vue';

interface Props {
  orden: Partial<OrdenSolicitud>;
  nameButton: string;
}

defineProps<Props>();

const ordenStore = useOrdenStore();
const { cargarOrdenItem } = useOrdenItem();
const { deleteOrder } = useOrdenes();
const items = ref<any[]>([]);
const deleteModal = ref();
const currentOrderId = ref<number | null>(null);

const seleccionarOrdenId = async (id: number) => {
  ordenStore.resetOrden();
  items.value = await cargarOrdenItem(id);
  ordenStore.setOrdenId(id);

  if (Array.isArray(items.value)) {
    for (const item of items.value) {
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
    }
  }
};

// Abrir el modal
const openDeleteModal = (id: number) => {
  currentOrderId.value = id;
  deleteModal.value?.showModal();
};

// Confirmar eliminación
const confirmDelete = async () => {
  if (currentOrderId.value) {
    await deleteOrder(currentOrderId.value);
    console.log(`Orden con ID ${currentOrderId.value} eliminada`);
    ordenStore.resetOrden();
  }
};

// Cancelar eliminación
const cancelDelete = () => {
  console.log('Eliminación cancelada');
};
</script>

<style scoped>
.entry-title {
  display: flex;
  justify-content: space-between;
  align-items: center; /* Alinea al centro verticalmente */
}

.entry-content {
  display: flex;
  align-items: center; /* Alinea al centro verticalmente */
}

.badge {
  display: flex;
  align-items: center; /* Asegura que el contenido del badge esté centrado */
  justify-content: center;
}

.btn {
  display: flex;
  align-items: center; /* Centra el contenido del botón */
}
</style>
