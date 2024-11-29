import { ref, watch, unref, computed } from 'vue';
import { useQuery } from '@tanstack/vue-query';
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

  const { data, refetch, isLoading, isError, error } = useQuery({
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
      return !!id && !isNaN(id); // Habilita la consulta solo si el ID es válido y numérico
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

  return {
    person,
    refetch,
    isLoading,
    isError,
    error,
  };
};

export default usePerson;
