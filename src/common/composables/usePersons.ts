import { watch } from 'vue';
import { useQuery } from '@tanstack/vue-query';
import { usePersonsStore } from '../store/personsStore';
import { storeToRefs } from 'pinia';
import { getAll } from '../services/persons';
const usePersons = () => {
  const store = usePersonsStore();
  const { currentPage, persons, totalPages } = storeToRefs(store);

  const { isLoading, data } = useQuery({
    queryKey: ['persons'],
    queryFn: () => getAll(),
    staleTime: 1000 * 30,
  });

  watch(data, (newPersons) => {
    if (newPersons) {
      console.log('Actualizando personas en el store...');
      store.setPersons(newPersons);
    }
  });
  return {
    isLoading,
    persons,
    currentPage,
    totalPages,
  };
};

export default usePersons;
