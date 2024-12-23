import { watch } from 'vue';
import { useQuery } from '@tanstack/vue-query';
import { storeToRefs } from 'pinia';

import type { Acreditation } from '../interfaces/acreditations.interface';
import { useAcreditationsStore } from '../../ordenes/store/acreditationsStore';
import { apiMigrationsData } from '@/api/apiMigrationsData';

export const getAllAcreditations = async () => {
  try {
    const response = await apiMigrationsData.get('/acreditaciones');
    return response.data;
  } catch (error) {
    console.error('Error al obtener los datos:', error);
    throw error;
  }
};

const useAcreditations = () => {
  const store = useAcreditationsStore();
  const { currentPage, acreditations } = storeToRefs(store);

  const itemsPerPage = 10;

  const { isLoading, data } = useQuery({
    queryKey: ['acreditations'],
    queryFn: () => getAllAcreditations(),
    staleTime: 1000 * 60 * 60 * 24,
    cacheTime: 1000 * 60 * 60 * 24 * 7,
  });

  watch(data, (newAcreditations: Acreditation[]) => {
    if (newAcreditations) {
      store.setAcreditations(newAcreditations.filter((p) => p && p.id));
    }
  });

  return {
    isLoading,
    acreditations,
    currentPage,
    itemsPerPage,
  };
};

export default useAcreditations;
