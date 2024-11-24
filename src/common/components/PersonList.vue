<template>
  <div class="entry-list-container">
    <div class="px-2 py-2 flex items-center justify-between">
      <!-- Barra de búsqueda -->
      <label class="input input-bordered flex items-center gap-2 input-primary w-full">
        <input type="text" class="grow" placeholder="Buscar" v-model="searchQuery" />
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
        <ItemsPerson
          v-for="person in paginatedPersons"
          :key="person.id"
          :person="person"
          class="w-full"
          nameButton="Seleccionar"
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
import { ref, computed, onMounted, watch } from 'vue';
import { storeToRefs } from 'pinia';
import ItemsPerson from './ItemsPerson.vue';

import { usePersonStore } from '../store/personStore';
import usePerson from '../composables/usePerson';
import { calculateAge } from '../helpers/calculateAge';

interface Person {
  id: number;
  name: string;
  category: 'menores' | 'acompaneantes' | 'autorizantes';
}

const personStore = usePersonStore();
const { activeCategory } = storeToRefs(personStore);

const { fetchAllPerson } = usePerson();

const persons = ref<Person[]>([]);
const searchQuery = ref('');
const loading = ref(true);

const currentPage = ref(1);
const itemsPerPage = 10;

const filteredPersons = ref<Person[]>([]);

const totalPages = computed(() => Math.ceil(filteredPersons.value.length / itemsPerPage));

const paginatedPersons = computed<Person[]>(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;

  console.log('Paginación actual:', {
    start,
    end,
    currentPage: currentPage.value,
    totalItems: filteredPersons.value.length,
  });

  return filteredPersons.value.slice(start, end);
});

onMounted(async () => {
  loading.value = true;
  try {
    const fetchedPersons = await fetchAllPerson();

    const classifiedPersons = fetchedPersons.map((person) => {
      const age = person.fecha_de_nacimiento ? calculateAge(person.fecha_de_nacimiento) : null; // Verifica si tiene fecha de nacimiento
      let category = 'acompaneantes';

      if (age !== null) {
        if (age < 21) {
          category = 'menores';
        } else if (age >= 21) {
          category = 'autorizantes';
        }
      }

      // Construir un nombre más completo
      const fullName = [person.nombre, person.apellido, person.otros_nombres]
        .filter(Boolean) // Filtrar valores no válidos (null, undefined, '')
        .join(' '); // Unir los valores con un espacio

      return {
        ...person,
        category,
        name: fullName || 'Sin nombre', // Usar "Sin nombre" solo si `fullName` está vacío
      };
    });

    console.log('Personas clasificadas:', classifiedPersons);

    persons.value = classifiedPersons; // Asignar las personas con la categoría calculada
  } catch (error) {
    console.error('Error cargando personas:', error);
  } finally {
    loading.value = false;
  }
});

// Funciones de paginación
const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) currentPage.value = page;
};
const prevPage = () => currentPage.value > 1 && currentPage.value--;
const nextPage = () => currentPage.value < totalPages.value && currentPage.value++;

// Watch para filtrar las personas
watch([persons, activeCategory, searchQuery], ([newPersons, newCategory, newSearchQuery]) => {
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
