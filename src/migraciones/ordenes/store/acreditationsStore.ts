import { ref, computed } from 'vue';
import { defineStore } from 'pinia';

import type { Acreditation } from '../../persons/interfaces/acreditations.interface';

export const useAcreditationsStore = defineStore('acreditationsStore', () => {
  const acreditations = ref<Acreditation[]>([]);
  const currentPage = ref<number>(1);
  const itemsPerPage = 10;

  const totalPages = computed(() => Math.ceil(acreditations.value.length / itemsPerPage));
  const setAcreditations = (newAcreditations) => {
    acreditations.value = newAcreditations;
  };

  return {
    acreditations,
    currentPage,
    totalPages,
    setAcreditations,

    setPage(page: number) {
      if (currentPage.value === page) return;
      if (page <= 0) return;

      currentPage.value = page;
    },
  };
});
