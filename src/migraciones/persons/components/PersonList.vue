<template>
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
        <ItemsPerson
          v-for="person in paginatedPersons"
          :key="person.id"
          :person="person"
          class="w-full"
          nameButton="Seleccionar"
        />
      </div>
    </div>
    <PaginationComponent
      v-if="paginatedPersons.length >= 10"
      :totalPages="totalPagesByCategory[getActiveCategory!]"
      :currentPage="currentPage"
      :goToPage="(page: number) => (currentPage = page)"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { usePersonStore } from '../store/personStore';

import ItemsPerson from './ItemsPerson.vue';
import PaginationComponent from '../../../common/components/PaginationComponent.vue';
import SearchIcon from '../../../common/components/iconos/SearchIcon.vue';
import usePersons from '@/migraciones/persons/composables/usePersons';

const personStore = usePersonStore();
const { getActiveCategory } = storeToRefs(personStore);

onMounted(() => {
  personStore.setCategory('menores');
});

const { isLoading, currentPage, totalPagesByCategory, acompaneantes, menores, autorizantes } =
  usePersons();

const filteredPersonsByCategory = computed(() => {
  const categoryPersons = (() => {
    switch (getActiveCategory.value) {
      case 'acompaneantes':
        return acompaneantes.value;
      case 'menores':
        return menores.value;
      case 'autorizantes':
        return autorizantes.value;
      default:
        return [];
    }
  })();

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    return categoryPersons.filter((person: any) => {
      const fullName = `${person.nombre || ''} ${person.apellido || ''}`.toLowerCase();
      const documento = String(person.numero_de_documento || '').toLowerCase();
      return fullName.includes(query) || documento.includes(query);
    });
  }

  return categoryPersons;
});
const searchQuery = ref('');

const paginatedPersons = computed(() => {
  const start = (currentPage.value - 1) * 10;
  const end = start + 10;
  return filteredPersonsByCategory.value.slice(start, end);
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
