import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import type { Person } from '../interfaces/person.interface';

export const usePersonsStore = defineStore('personsStore', () => {
  const persons = ref<Person[]>([]);
  const currentPage = ref<number>(1);
  const itemsPerPage = 10;

  const totalPages = computed(() => Math.ceil(persons.value.length / itemsPerPage));
  const setPersons = (newPersons) => {
    persons.value = newPersons;
  };
  return {
    persons,
    currentPage,
    totalPages,
    setPersons,

    setPage(page: number) {
      if (currentPage.value === page) return;
      if (page <= 0) return;

      currentPage.value = page;
    },
  };
});
