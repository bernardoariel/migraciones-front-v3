import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import type { NotarioResponse } from '../interfaces/NotarioResponse.interface';

export const useNotariosStore = defineStore('notariosStore', () => {
  const notarios = ref<NotarioResponse[]>([]);
  const currentPage = ref<number>(1);
  const itemsPerPage = 10;

  const totalPages = computed(() => Math.ceil(notarios.value.length / itemsPerPage));
  const setNotarios = (newNotarios) => {
    notarios.value = newNotarios;
  };
  return {
    notarios,
    currentPage,
    totalPages,
    setNotarios,

    setPage(page: number) {
      if (currentPage.value === page) return;
      if (page <= 0) return;

      currentPage.value = page;
    },
  };
});
