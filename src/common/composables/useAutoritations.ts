import { watch } from 'vue';
import { useQuery } from '@tanstack/vue-query';
import { storeToRefs } from 'pinia';
import { useAutoritationsStore } from '../store/autoritationsStore';
import { apiMigrationsData } from '@/api/apiMigrationsData';

import type { Autoritation } from '../interfaces/autoritation.interface';

export const getAllAutoritations = async () => {
  try {
    const response = await apiMigrationsData.get('/autorizaciones');
    return response.data;
  } catch (error) {
    console.error('Error al obtener los datos:', error);
    throw error;
  }
};

const useAutoritations = () => {
  const store = useAutoritationsStore();
  const { currentPage, autoritations } = storeToRefs(store);

  const itemsPerPage = 10;

  const { isLoading, data } = useQuery({
    queryKey: ['autoritations'],
    queryFn: () => getAllAutoritations(),
    staleTime: 1000 * 60 * 60 * 24,
    cacheTime: 1000 * 60 * 60 * 24 * 7,
  });

  watch(data, (newAutoritations: Autoritation[]) => {
    if (newAutoritations) {
      store.setAutoritations(newAutoritations.filter((p) => p && p.id));
    }
  });

  return {
    isLoading,
    autoritations,
    currentPage,
    itemsPerPage,
  };
};

export default useAutoritations;
