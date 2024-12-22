import { ref, computed } from 'vue';
import { defineStore } from 'pinia';

import type { Autoritation } from '../../migraciones/persons/interfaces/autoritation.interface';

export const useAutoritationsStore = defineStore('autoritationsStore', () => {
  const autoritations = ref<Autoritation[]>([]);
  const currentPage = ref<number>(1);
  const itemsPerPage = 10;

  const totalPages = computed(() => Math.ceil(autoritations.value.length / itemsPerPage));
  const setAutoritations = (newAutoritations) => {
    autoritations.value = newAutoritations;
  };

  return {
    autoritations,
    currentPage,
    totalPages,
    setAutoritations,

    setPage(page: number) {
      if (currentPage.value === page) return;
      if (page <= 0) return;

      currentPage.value = page;
    },
  };
});
