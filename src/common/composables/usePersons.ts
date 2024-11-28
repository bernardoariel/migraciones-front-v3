import { watch, computed } from 'vue';
import { useQuery } from '@tanstack/vue-query';
import { usePersonsStore } from '../store/personsStore';
import { storeToRefs } from 'pinia';
import { getAll } from '../services/persons';
import type { Person } from '../interfaces/person.interface';
import { calculateAge } from '../helpers/calculateAge';

const usePersons = () => {
  const store = usePersonsStore();
  const { currentPage, persons } = storeToRefs(store);

  const itemsPerPage = 10; // Número de elementos por página

  const { isLoading, data } = useQuery({
    queryKey: ['persons'],
    queryFn: () => getAll(),
    staleTime: 1000 * 30,
  });

  watch(data, (newPersons: Person[]) => {
    if (newPersons) {
      console.log('Actualizando personas en el store...');
      store.setPersons(newPersons.filter((p) => p && p.id));
    }
  });

  // Filtered groups
  const acompaneantes = computed(() =>
    persons.value.filter((person) => person && (!person.sex_id || !person.fecha_de_nacimiento)),
  );

  const menores = computed(() =>
    persons.value.filter((person) => {
      if (!person || !person.fecha_de_nacimiento) return false;
      const age = calculateAge(person.fecha_de_nacimiento);
      return age < 21;
    }),
  );

  const autorizantes = computed(() =>
    persons.value.filter((person) => {
      if (!person || !person.fecha_de_nacimiento) return false;
      const age = calculateAge(person.fecha_de_nacimiento);
      return age >= 21;
    }),
  );

  const totalPagesByCategory = computed(() => ({
    acompaneantes: Math.ceil(acompaneantes.value.length / itemsPerPage),
    menores: Math.ceil(menores.value.length / itemsPerPage),
    autorizantes: Math.ceil(autorizantes.value.length / itemsPerPage),
  }));

  const paginatedPersonsByCategory = computed(() => ({
    acompaneantes: acompaneantes.value.slice(
      (currentPage.value - 1) * itemsPerPage,
      currentPage.value * itemsPerPage,
    ),
    menores: menores.value.slice(
      (currentPage.value - 1) * itemsPerPage,
      currentPage.value * itemsPerPage,
    ),
    autorizantes: autorizantes.value.slice(
      (currentPage.value - 1) * itemsPerPage,
      currentPage.value * itemsPerPage,
    ),
  }));

  return {
    isLoading,
    persons,
    currentPage,
    itemsPerPage,
    totalPagesByCategory,
    paginatedPersonsByCategory,
    acompaneantes,
    menores,
    autorizantes,
  };
};

export default usePersons;
