import { ref, computed } from 'vue';

export const usePagination = (items: any[], itemsPerPage = 10) => {
  const currentPage = ref(1);
  const totalPages = computed(() => Math.ceil(items.length / itemsPerPage));

  const paginatedItems = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return items.slice(start, end);
  });

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages.value) {
      currentPage.value = page;
    }
  };

  return {
    currentPage,
    totalPages,
    paginatedItems,
    goToPage,
  };
};
