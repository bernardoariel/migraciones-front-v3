<template>
  <div class="entry-list-container">
    <div class="px-2 py-2 flex items-center justify-between">
      <label class="input input-bordered flex items-center gap-2 input-primary w-full">
        <input type="text" class="grow" placeholder="Buscar" v-model="searchQuery" />

        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          fill="currentColor"
          class="h-4 w-4 opacity-70"
        >
          <path
            fill-rule="evenodd"
            d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
            clip-rule="evenodd"
          />
        </svg>
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
import usePersons from '../composables/usePersons';
import ItemsPerson from './ItemsPerson.vue';
import PaginationComponent from './PaginationComponent.vue';

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
    return categoryPersons.filter((person) => {
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
