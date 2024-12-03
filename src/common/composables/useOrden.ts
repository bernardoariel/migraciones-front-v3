import { ref, watch, unref, computed } from 'vue';
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query';

import { apiMigrationsData } from '@/api/apiMigrationsData';
import type { OrdenSolicitud } from '../interfaces/orders.interface';

export const getOrdenById = async (id: number) => {
  try {
    const response = await apiMigrationsData.get(`/v2/personaById/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener el acompañante con ID ${id}:`, error);
    throw error;
  }
};
const useOrden = (idOrden: Ref<number | null> | ComputedRef<number | null>) => {
  const orden = ref<OrdenSolicitud | null>(null);

  const queryClient = useQueryClient();

  const { data, refetch } = useQuery({
    queryKey: computed(() => ['orden', unref(idOrden)]),
    queryFn: async () => {
      const id = unref(idOrden);
      if (!id || isNaN(id)) {
        throw new Error('ID no válido o no numérico');
      }
      return getOrdenById(id);
    },
    enabled: computed(() => {
      const id = unref(idOrden);
      return !!id && !isNaN(id);
    }),
    staleTime: 1000 * 30,
  });

  watch(
    data,
    (newData) => {
      orden.value = newData || null;
    },
    { immediate: true },
  );
  const createOrden = async (payload) => {
    const response = await apiMigrationsData.post(`/v2/persona/new`, payload);
    queryClient.invalidateQueries({ queryKey: ['ordenes'] });
    return response.data;
  };

  const updateOrden = async (payload) => {
    const id = unref(idOrden);
    if (!id) throw new Error('ID inválido para actualización');
    return apiMigrationsData.put(`/v2/agregarorden/${id}`, payload);
  };
  const mutation = useMutation({
    mutationFn: async (payload) => {
      const id = unref(idOrden);
      if (id === null || id === 'new') {
        return createPerson(payload);
      } else {
        return updatePerson(payload);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ordenes'] });
      refetch();
    },
  });
  return {
    orden,
    refetch,
    mutatePerson: mutation.mutateAsync,
    isLoading: mutation.isLoading,
    createOrden,
    updateOrden,
  };
};

export default useOrden;
