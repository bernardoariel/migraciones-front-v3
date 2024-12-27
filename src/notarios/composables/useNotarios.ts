import { watch } from 'vue';
import { useQuery } from '@tanstack/vue-query';
import { storeToRefs } from 'pinia';

import { useNotariosStore } from '../store/notariosStore';
import type { NotarioResponse } from '../interfaces/NotarioResponse.interface';
import { getAll } from '../services/actions';

const useNotarios = () => {
  const store = useNotariosStore();
  const { currentPage, notarios } = storeToRefs(store);

  const itemsPerPage = 10;

  const { isLoading, data } = useQuery({
    queryKey: ['notarios'],
    queryFn: () => getAll(),
    staleTime: 1000 * 30,
  });

  watch(data, (newNotarios: NotarioResponse[]) => {
    if (newNotarios) {
      store.setNotarios(newNotarios.filter((p) => p && p.id));
    }
  });

  return {
    isLoading,
    notarios,
    currentPage,
    itemsPerPage,
  };
};

export default useNotarios;
