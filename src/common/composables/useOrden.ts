import { ref, watch, unref, computed } from 'vue';
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query';

import { apiMigrationsData } from '@/api/apiMigrationsData';
import { OrdenSolicitud } from '../interfaces/orders.interface';

// Función para obtener una orden por ID (similar a `getById` en el archivo de personas)
export const getOrdenById = async (id: number) => {
  try {
    const response = await apiMigrationsData.get(`/v2/ordenes/${id}`); // Endpoint corregido para obtener una orden
    return response.data;
  } catch (error) {
    console.error(`Error al obtener la orden con ID ${id}:`, error);
    throw error;
  }
};

const useOrden = (idOrden: Ref<number | null> | ComputedRef<number | null>) => {
  const orden = ref<OrdenSolicitud | null>(null);
  const queryClient = useQueryClient();

  // Query para obtener la orden por ID
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
      return !!id && !isNaN(id); // La query se ejecuta solo si idOrden es válido
    }),
    staleTime: 1000 * 30, // tiempo de expiración de los datos en cache
  });

  // Almacena los datos de la orden obtenida
  watch(
    data,
    (newData) => {
      orden.value = newData || null; // Guarda los datos de la orden o null si no se obtiene nada
    },
    { immediate: true },
  );

  // Función para crear una nueva orden
  const createOrden = async (payload: OrdenSolicitud) => {
    const response = await apiMigrationsData.post(`/v2/ordenes`, payload); // Endpoint para crear una nueva orden
    queryClient.invalidateQueries({ queryKey: ['ordenes'] }); // Invalida los queries relacionados con las órdenes
    return response.data;
  };

  // Función para actualizar una orden existente
  const updateOrden = async (payload: OrdenSolicitud) => {
    const id = unref(idOrden);
    if (!id) throw new Error('ID inválido para actualización');
    return apiMigrationsData.put(`/v2/ordenes/${id}`, payload); // Endpoint para actualizar una orden
  };

  // Configuración de la mutación para crear o actualizar una orden
  const mutation = useMutation({
    mutationFn: async (payload: OrdenSolicitud) => {
      const id = unref(idOrden);
      if (id === null || id === 'new') {
        return createOrden(payload); // Si el ID es null o 'new', crea una nueva orden
      } else {
        return updateOrden(payload); // Si el ID es válido, actualiza la orden existente
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ordenes'] }); // Invalida las queries para obtener órdenes actualizadas
      refetch(); // Refresca los datos de la orden
    },
  });

  return {
    orden, // La orden obtenida
    refetch, // Función para refetch de la orden
    mutateOrden: mutation.mutateAsync, // Función para ejecutar la mutación
    isLoading: mutation.isLoading, // Estado de carga de la mutación
    createOrden, // Función para crear una orden
    updateOrden, // Función para actualizar una orden
  };
};

export default useOrden;
