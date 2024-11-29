import { ref, watch, unref, computed } from 'vue';
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query';
import type { Person } from '../interfaces/person.interface';
import { apiMigrationsData } from '@/api/apiMigrationsData';

export const getById = async (id: number) => {
  try {
    const response = await apiMigrationsData.get(`/v2/personaById/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener el acompañante con ID ${id}:`, error);
    throw error;
  }
};
const usePerson = (idPerson: Ref<number | null> | ComputedRef<number | null>) => {
  const person = ref<Person | null>(null);

  const queryClient = useQueryClient();

  const { data, refetch } = useQuery({
    queryKey: computed(() => ['person', unref(idPerson)]),
    queryFn: async () => {
      const id = unref(idPerson);
      if (!id || isNaN(id)) {
        throw new Error('ID no válido o no numérico');
      }
      return getById(id);
    },
    enabled: computed(() => {
      const id = unref(idPerson);
      return !!id && !isNaN(id);
    }),
    staleTime: 1000 * 30,
  });

  watch(
    data,
    (newData) => {
      person.value = newData || null;
    },
    { immediate: true },
  );
  const createPerson = async (payload) => {
    const response = await apiMigrationsData.post(`/v2/persona/new`, payload);
    queryClient.invalidateQueries({ queryKey: ['persons'] });
    return response.data;
  };

  const updatePerson = async (payload) => {
    const id = unref(idPerson);
    if (!id) throw new Error('ID inválido para actualización');
    return apiMigrationsData.put(`/v2/persona/update/${id}`, payload);
  };
  const mutation = useMutation({
    mutationFn: async (payload) => {
      const id = unref(idPerson);
      if (id === null || id === 'new') {
        return createPerson(payload);
      } else {
        return updatePerson(payload);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['persons'] });
      refetch();
    },
  });
  return {
    person,
    refetch,
    mutatePerson: mutation.mutateAsync,
    isLoading: mutation.isLoading,
    createPerson,
    updatePerson,
  };
};

export default usePerson;
