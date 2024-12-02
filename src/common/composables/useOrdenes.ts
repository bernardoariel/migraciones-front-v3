import { watch } from 'vue';
import { useQuery } from '@tanstack/vue-query';
import { storeToRefs } from 'pinia';

import { useOrdersStore } from '../store/ordersStore';
import type { OrdenSolicitud } from '../interfaces/orders.interface';
import { apiMigrationsData } from '@/api/apiMigrationsData';
import type { OrdenSolicitud } from '../interfaces/orders.interface';
export const getAllOrdenes = async () => {
  try {
    const response = await apiMigrationsData.get('v2/ordenestodos');
    return response.data;
  } catch (error) {
    console.error('Error al obtener los datos:', error);
    throw error;
  }
};
const useOrdenes = () => {
  const store = useOrdersStore();
  const { currentPage, orders } = storeToRefs(store);

  const itemsPerPage = 10; // Número de elementos por página

  const { isLoading, data } = useQuery({
    queryKey: ['orders'],
    queryFn: () => getAllOrdenes(),
    staleTime: 1000 * 30,
  });
  watch(data, (newOrders: OrdenSolicitud) => {
    if (newOrders) {
      store.setOrders(newOrders);
    }
  });
  return {
    isLoading,
    orders,
    currentPage,
    itemsPerPage,
  };
};

export default useOrdenes;
