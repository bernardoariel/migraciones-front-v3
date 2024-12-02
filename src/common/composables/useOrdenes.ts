import { watch } from 'vue';
import { useQuery } from '@tanstack/vue-query';
import { storeToRefs } from 'pinia';

import { useOrdersStore } from '../store/ordersStore';
import type { OrdenSolicitud } from '../interfaces/orders.interface';
import { apiMigrationsData } from '@/api/apiMigrationsData';

const fetchOrders = async (): Promise<OrdenSolicitud[]> => {
  const { data } = await apiMigrationsData.get<OrdenSolicitud[]>('/v2/ordenestodos');
  return data;
};

const useOrdenes = () => {
  const store = useOrdersStore();
  const { currentPage, orders } = storeToRefs(store);

  const itemsPerPage = 10; // Número de elementos por página

  const { isLoading, data } = useQuery({
    queryKey: ['orders'],
    queryFn: () => fetchOrders(),
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
