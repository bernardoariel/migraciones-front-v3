import { ref, watch, unref, computed } from 'vue';
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query';

import { apiMigrationsData } from '@/api/apiMigrationsData';
import type { NotarioResponse } from '../interfaces/NotarioResponse.interface';
import { getById } from '../services/actions';

const useNotario = (idNotario: Ref<number | null> | ComputedRef<number | null>) => {
  const notario = ref<NotarioResponse | null>(null);

  const queryClient = useQueryClient();

  const { data, refetch } = useQuery({
    queryKey: computed(() => ['notario', unref(idNotario)]),
    queryFn: async () => {
      const id = unref(idNotario);
      if (!id || isNaN(id)) {
        throw new Error('ID no válido o no numérico');
      }
      return getById(id);
    },
    enabled: computed(() => {
      const id = unref(idNotario);
      return !!id && !isNaN(id);
    }),
    staleTime: 1000 * 30,
  });

  watch(
    data,
    (newData) => {
      notario.value = newData || null;
    },
    { immediate: true },
  );
  const createNotario = async (payload) => {
    const response = await apiMigrationsData.post(`/agregarEscribano`, payload);
    queryClient.invalidateQueries({ queryKey: ['notarios'] });
    return response.data;
  };

  const updateNotario = async (payload) => {
    const id = unref(idNotario);
    if (!id) throw new Error('ID inválido para actualización');
    return apiMigrationsData.put(`/actualizarEscribano/${id}`, payload);
  };
  const mutation = useMutation({
    mutationFn: async (payload) => {
      const id = unref(idNotario);
      if (id === null || id === 'new') {
        return createNotario(payload);
      } else {
        return updateNotario(payload);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notarios'] });
      refetch();
    },
  });
  return {
    notario,
    refetch,
    mutatePerson: mutation.mutateAsync,
    isLoading: mutation.isLoading,
    createNotario,
    updateNotario,
  };
};

export default useNotario;
