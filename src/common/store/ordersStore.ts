import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import type { OrdenSolicitud } from '../interfaces/orders.interface';

export const useOrdersStore = defineStore('ordersStore', () => {
  const orders = ref<OrdenSolicitud[]>([]); 
  const currentPage = ref<number>(1);
  const itemsPerPage = 10;

  const totalPages = computed(() => Math.ceil(orders.value.length / itemsPerPage));
  const setOrders = (newOrders) => {
    orders.value = newOrders;
  };

  return {
    orders,
    currentPage,
    totalPages,
    setOrders,
   
    setPage(page: number) {
      if (currentPage.value === page) return;
      if (page <= 0) return;

      currentPage.value = page;
    },
  };
});
