import { computed, watch } from 'vue';
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query';
import { storeToRefs } from 'pinia';
import { useOrdersStore } from '../store/ordersStore';
import { apiMigrationsData } from '@/api/apiMigrationsData';
import type { OrdenSolicitud } from '../interface/orders.interface';
import { useUserStore } from '../../../common/stores/userStore';

// Función para obtener las órdenes desde la API
const fetchOrders = async (): Promise<OrdenSolicitud[]> => {
  const { data } = await apiMigrationsData.get<OrdenSolicitud[]>('/v2/ordenestodos');
  return data;
};
const getOrdersByNotary = async (notaryId: number): Promise<OrdenSolicitud[]> => {
  const { data } = await apiMigrationsData.get<OrdenSolicitud[]>(`/v2/ordenes/notary/${notaryId}`);
  return data;
};
const deleteOrder = async (id: number): Promise<void> => {
  await apiMigrationsData.delete(`/eliminarorden/${id}`);
};

const useOrdenes = () => {
  const store = useOrdersStore();
  const userStore = useUserStore();
  const { currentPage, orders } = storeToRefs(store);

  const itemsPerPage = 5;
  const queryClient = useQueryClient();
  const notaryId = computed(() => userStore.user?.id);

  // Reactive para habilitar la consulta solo cuando el notaryId esté disponible
  const isReadyToQuery = computed(() => notaryId.value !== null);

  const { isLoading, data } = useQuery({
    queryKey: ['orders', notaryId],
    queryFn: async () => {
      if (notaryId.value > 2) {
        return getOrdersByNotary(notaryId.value);
      } else {
        return fetchOrders();
      }
    },
    enabled: isReadyToQuery.value, // Solo ejecutar la consulta cuando isReadyToQuery sea true
    staleTime: 1000 * 30,
  });

  // Observador para actualizar el estado local cuando se reciben nuevas órdenes
  watch(data, (newOrdens: OrdenSolicitud[]) => {
    if (newOrdens) {
      store.setOrders(newOrdens.filter((p) => p && p.id));
    }
  });

  const mutation = useMutation({
    mutationFn: deleteOrder, // Asegúrate de que esto esté correctamente definido
    onSuccess: (_, id) => {
      // Actualiza la lista local eliminando la orden con el ID especificado
      store.setOrders(orders.value.filter((order) => order.id !== id));
      // Invalida las consultas relacionadas
      queryClient.invalidateQueries(['orders']);
    },
    onError: (error) => {
      console.error('Error al eliminar la orden:', error);
    },
  });

  const removeOrder = (id: number) => {
    mutation.mutate(id);
  };

  // Cálculos derivados
  const pendingOrders = computed(() => orders.value.filter((order) => order.aprobacion === null));
  const authorizedOrders = computed(() =>
    orders.value.filter((order) => order.aprobacion !== null && !isNaN(Number(order.aprobacion))),
  );
  const allOrders = computed(() => orders.value);

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
    deleteOrder: removeOrder, // Exponer la función para eliminar órdenes
  };
};

export default useOrdenes;
