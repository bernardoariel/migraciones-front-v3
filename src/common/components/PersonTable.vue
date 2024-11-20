<template>
  <div class="entry-list-container">
    <div class="px-2 py-2 flex items-center justify-between">
      <!-- Barra de búsqueda -->
      <label class="input input-bordered flex items-center gap-2 input-primary">
        <input
          type="text"
          class="grow"
          placeholder="Buscar"
          v-model="searchQuery"
          @input="filterPersons"
        />
        <kbd class="kbd kbd-sm">ctrl</kbd>
        <kbd class="kbd kbd-sm">alt</kbd>
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
    <!-- Scroll Area -->
    <div class="entry-scrollarea">
      <!-- Spinner -->
      <div v-if="loading" class="flex items-center justify-center h-full">
        <span class="loading loading-dots loading-lg text-primary"></span>
      </div>
      <!-- Items -->
      <div v-else class="flex flex-col w-full">
        <PersonItems
          v-for="acompaneante in paginatedPersons"
          :key="acompaneante.id"
          :person="acompaneante"
          class="w-full"
        />
      </div>
    </div>
    <!-- Paginación -->
    <div class="pagination-container">
      <div class="flex justify-center mt-4 gap-2">
        <button
          class="btn btn-sm"
          :class="{ 'btn-disabled': currentPage === 1 }"
          @click="prevPage"
          :disabled="currentPage === 1"
        >
          Prev
        </button>
        <button
          v-for="page in totalPages"
          :key="page"
          class="btn btn-sm"
          :class="{ 'btn-active': page === currentPage }"
          @click="goToPage(page)"
        >
          {{ page }}
        </button>
        <button
          class="btn btn-sm"
          :class="{ 'btn-disabled': currentPage === totalPages }"
          @click="nextPage"
          :disabled="currentPage === totalPages"
        >
          Next
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import PersonItems from './PersonItems.vue';
import usePerson from '../composables/usePerson';
import type { Person } from '../interfaces/person.interface';

const { fetchAllPerson } = usePerson();
const acompaneantes = ref<Person[]>([]);
const searchQuery = ref('');
const filteredPersons = ref<Person[]>([]);
const loading = ref(true);

// Paginación
const currentPage = ref(1);
const itemsPerPage = 10;

const totalPages = computed(() => Math.ceil(filteredPersons.value.length / itemsPerPage));

const paginatedPersons = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredPersons.value.slice(start, end);
});

const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
  }
};

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value -= 1;
  }
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value += 1;
  }
};

// Filtrar por búsqueda
const filterPersons = () => {
  const query = searchQuery.value.toLowerCase();
  filteredPersons.value = acompaneantes.value.filter(
    (person) =>
      person.nombre.toLowerCase().includes(query) ||
      person.apellido.toLowerCase().includes(query) ||
      person.numero_de_documento.toString().includes(query), // Convertimos a string
  );
  currentPage.value = 1; // Reinicia a la primera página después de filtrar
};

onMounted(async () => {
  const data = await fetchAllPerson();
  if (data) {
    acompaneantes.value = data;
    filteredPersons.value = data; // Inicializa el filtrado
  }
  loading.value = false;
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
