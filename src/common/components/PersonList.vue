<template>
  <div class="entry-list-container">
    <div class="px-2 py-2 flex items-center justify-between">
      <!-- Barra de búsqueda -->
      <label class="input input-bordered flex items-center gap-2 input-primary w-full">
        <input type="text" class="grow" placeholder="Buscar" v-model="searchQuery" />
        <!--     <kbd class="kbd kbd-sm">ctrl</kbd>
        <kbd class="kbd kbd-sm">alt</kbd> -->
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
      <div v-if="isLoading" class="flex items-center justify-center h-full">
        <span class="loading loading-dots loading-lg text-primary"></span>
      </div>
      <!-- Items -->
      <div v-else class="flex flex-col w-full">
        <ItemsPerson
          v-for="person in paginatedPersons"
          :key="person.id"
          :person="person"
          class="w-full"
          nameButton="Seleccionar"
        />
        <!-- <ItemsPerson
          v-for="person in paginatedPersons"
          :key="person.id"
          :person="person"
          class="w-full"
          nameButton="Seleccionar"
        /> -->
      </div>
    </div>
    <!-- Paginación -->
    <div class="pagination-container">
      <div class="pagination-container flex justify-center mt-4">
        <div class="join">
          <input
            v-for="page in totalPages"
            :key="page"
            class="join-item btn btn-square"
            type="radio"
            name="pagination"
            :aria-label="String(page)"
            :checked="page === currentPage"
            @change="goToPage(page)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
// import { storeToRefs } from 'pinia';
import ItemsPerson from './ItemsPerson.vue';

// import { usePersonStore } from '../store/personStore';
/* import usePerson from '../composables/usePerson';
import { calculateAge } from '../helpers/calculateAge'; */
import usePersons from '../composables/usePersons';

/* interface Person {
  id: number;
  name: string;
  category: 'menores' | 'acompaneantes' | 'autorizantes';
} */

/* const personStore = usePersonStore();
const { getActiveCategory } = storeToRefs(personStore); */
// const activeCategory = getActiveCategory;

const { isLoading, persons, currentPage, totalPages } = usePersons();
console.log('persons::: ', persons.value);

const searchQuery = ref('');

/* const itemsPerPage = 10;

const filteredPersons = computed(() => {
  return paginatedPersons.value.filter((person) => {
    if (!person.nombre) return false;
    return person.nombre.toLowerCase().includes(searchQuery.value.toLowerCase());
  });
}); */
const paginatedPersons = computed(() => {
  const start = (currentPage.value - 1) * 10;
  const end = start + 10;
  return persons.value.slice(start, end);
});

const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page; // Actualiza la página actual
  }
};
// Watch para filtrar las personas
/* watch([persons, activeCategory, searchQuery], ([newPersons, newCategory, newSearchQuery]) => {
  console.log('Cambio detectado en persons:', newPersons);
  console.log('Cambio detectado en activeCategory:', newCategory);
  console.log('Cambio detectado en searchQuery:', newSearchQuery);

  // Revisa las categorías disponibles en los datos
  console.log(
    'Categorías disponibles en persons:',
    newPersons.map((p) => p.category),
  );

  filteredPersons.value = persons.value
    .filter((person) => {
      const matchesCategory = person.category === activeCategory.value;
      console.log(`Comparando ${person.category} con ${activeCategory.value}: ${matchesCategory}`);
      return matchesCategory;
    })
    .filter((person) => {
      // Validar que `name` exista antes de aplicar `toLowerCase`
      if (!person.name) {
        console.warn('Persona sin nombre detectada:', person);
        return false; // Excluir personas sin nombre
      }
      return person.name.toLowerCase().includes(searchQuery.value.toLowerCase());
    });

  console.log('Personas filtradas por categoría:', filteredPersons.value);
}); */
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
