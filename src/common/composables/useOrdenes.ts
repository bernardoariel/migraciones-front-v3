import { computed, ref , watch} from 'vue';
import { useQuery } from '@tanstack/vue-query';
import { storeToRefs } from 'pinia';
import { useOrdersStore } from '../store/ordersStore';
import { apiMigrationsData } from '@/api/apiMigrationsData';
import type { OrdenSolicitud } from '../interfaces/orders.interface';

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

  watch(data, (newOrdens: OrdenSolicitud[]) => {
    if (newOrdens) {
      store.setOrders(newOrdens.filter((p) => p && p.id));
    }
  });
  // Filtrado por estados de 'aprobacion'
  const pendingOrders = computed(() => orders.value.filter((order) => order.aprobacion === null)); // Pendientes
  const authorizedOrders = computed(() => orders.value.filter((order) => order.aprobacion !== null && !isNaN(Number(order.aprobacion)))); // Autorizadas
  const allOrders = computed(() => orders.value); // Todas las órdenes

  const totalPagesByCategory = computed(() => ({
    pendingOrders: Math.ceil(pendingOrders.value.length / itemsPerPage),
    authorizedOrders: Math.ceil(authorizedOrders.value.length / itemsPerPage),
    allOrders: Math.ceil(allOrders.value.length / itemsPerPage),
  }));

  const paginatedOrdersByCategory = computed(() => ({
    pendingOrders: pendingOrders.value.slice(
      (currentPage.value - 1) * itemsPerPage,
      currentPage.value * itemsPerPage,
    ),
    authorizedOrders: authorizedOrders.value.slice(
      (currentPage.value - 1) * itemsPerPage,
      currentPage.value * itemsPerPage,
    ),
    allOrders: allOrders.value.slice(
      (currentPage.value - 1) * itemsPerPage,
      currentPage.value * itemsPerPage,
    ),
  }));

  return {
    isLoading,
    orders,
    currentPage,
    itemsPerPage,
    totalPagesByCategory,
    paginatedOrdersByCategory,
    pendingOrders,
    authorizedOrders,
    allOrders,
  };
};

export default useOrdenes;
