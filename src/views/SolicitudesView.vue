<template>
  <div class="flex flex-col lg:flex-row gap-6 bg-gray-100 min-h-screen p-4">
    <div class="flex-[2] bg-white p-4 rounded-lg shadow-md max-h-[85vh] overflow-y-hidden">
      <div class="flex justify-between items-center">
        <h2 class="text-xl font-semibold mb-4">Lista de Solicitudes</h2>
        <SolicitudNavBarCard typeCategory="menores" />
        <button class="btn btn-circle" @click="handleClick()">
          <PlusIcon color="#1C274C" height="30" width="30px" />
        </button>
      </div>
      <SolicitudesList />
    </div>
    <div
      class="flex-[2] bg-white p-4 rounded-lg shadow-md max-h-[85vh] overflow-auto flex justify-center items-center"
    >
      <SolicitudCard v-if="idOrdenSelected" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useRoute, useRouter } from 'vue-router';

import SolicitudesList from '@/migraciones/ordenes/components/SolicitudesList.vue';
import SolicitudCard from '@/migraciones/ordenes/components/SolicitudCard.vue';
import SolicitudNavBarCard from '@/migraciones/ordenes/components/SolicitudNavBarCard.vue';

import PlusIcon from '@/common/components/iconos/PlusIcon.vue';
import { useOrdenStore } from '@/migraciones/ordenes/store/ordenStore';

type ActiveCategory = 'menores' | 'autorizantes' | 'acompaneantes';

const route = useRoute();
const router = useRouter();
const ordenStore = useOrdenStore();
const { getIdOrdenSelected } = storeToRefs(ordenStore);
const idOrdenSelected = getIdOrdenSelected;

const setActiveCategoryFromPath = () => {
  const category = route.path.slice(1) as ActiveCategory;
  ordenStore.setCategory(category);
};
const handleClick = () => {
  router.push('nuevasolicitud');
};
watch(
  () => route.path,
  () => {
    setActiveCategoryFromPath();
  },
  { immediate: true },
);
</script>
