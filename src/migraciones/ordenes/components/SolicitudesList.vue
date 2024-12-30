<template>
  <div v-if="isReady">
    <div class="entry-list-container">
      <div class="px-2 py-2 flex items-center justify-between">
        <label class="input input-bordered flex items-center gap-2 input-primary w-full">
          <input type="text" class="grow" placeholder="Buscar" v-model="searchQuery" />
          <SearchIcon />
        </label>
      </div>
      <div class="entry-scrollarea">
        <div v-if="isLoading" class="flex items-center justify-center h-full">
          <span class="loading loading-dots loading-lg text-primary"></span>
        </div>
        <div v-else class="flex flex-col w-full">
          <ItemsOrden
            v-for="orden in paginatedOrdens"
            :key="orden.id"
            :orden="orden"
            class="w-full"
            nameButton="Seleccionar"
          />
        </div>
      </div>
      <!-- <PaginationComponent
          v-if="paginatedOrdens.length >= 10"
          :totalPages="totalPagesByCategory[getActiveCategory!]"
          :currentPage="currentPage"
          :goToPage="(page: number) => (currentPage = page)"
        /> -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { storeToRefs } from 'pinia';

import useOrdenes from '../composables/useOrdenes';
import ItemsOrden from './ItemsOrden.vue';
import { useOrdenStore } from '../store/ordenStore';
import SearchIcon from '@/common/components/iconos/SearchIcon.vue';
import { useUserStore } from '../../../common/stores/userStore';

defineEmits(['showSolicitudCard']);
const ordenStore = useOrdenStore();
const userStore = useUserStore();

const isReady = computed(() => !!userStore.user);
const { getActiveCategory } = storeToRefs(ordenStore);

const { isLoading, currentPage, allOrders, authorizedOrders, pendingOrders } = useOrdenes();

const filteredOrdensByCategory = computed(() => {
  const categoryOrdens = (() => {
    switch (getActiveCategory.value) {
      case 'todos':
        return allOrders.value;
      case 'autorizados':
        return authorizedOrders.value;
      case 'pendientes':
        return pendingOrders.value;
      default:
        return [];
    }
  })();

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    return categoryOrdens.filter((orden) => {
      const fullName = `${orden.nombre || ''} ${orden.apellido || ''}`.toLowerCase();
      const documento = String(orden.documento || '').toLowerCase();
      const numeroActuacion = String(
        orden.numero_actuacion_notarial_cert_firma || '',
      ).toLowerCase();
      return (
        fullName.includes(query) || documento.includes(query) || numeroActuacion.includes(query)
      );
    });
  }

  return categoryOrdens;
});
const searchQuery = ref('');

const paginatedOrdens = computed(() => {
  const start = (currentPage.value - 1) * 5;
  const end = start + 5;
  return filteredOrdensByCategory.value.slice(start, end);
});

onMounted(() => {
  ordenStore.setCategory('todos');
});
</script>

<style scoped>
.entry-list-container {
  height: calc(100vh - 64px); /* Altura dinámica según el navbar */
  overflow-x: hidden; /* Elimina scroll horizontal */
}

.entry-scrollarea {
  overflow-y: auto; /* Permite solo scroll vertical */
  display: flex;
  flex-direction: column;
}

.pagination-container {
  height: 50px; /* Ajusta el espacio para la paginación */
}

.btn-active {
  background-color: #4f46e5;
  color: white;
}
</style>
