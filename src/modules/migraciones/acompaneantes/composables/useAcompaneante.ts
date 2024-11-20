import type { Acompaneante } from '../interfaces/acompaneante.interface';
import { getAll } from '../../../../common/services/persons';
import { ref, computed } from 'vue';

const useAcompaneante = () => {
  const acompaneantes = ref<Acompaneante[]>([]); // Almacena los datos originales
  const searchQuery = ref(''); // Consulta de búsqueda
  const categoryFilter = ref(''); // Categoría activa: 'menores', 'autorizantes', 'acompaneantes'

  // Fetch de todos los acompaneantes
  const fetchAllAcompaneante = async (): Promise<void> => {
    const data = await getAll();
    acompaneantes.value = data; // Asigna los datos obtenidos
  };

  // Filtro por categoría
  const filterByCategory = (category: string): Acompaneante[] => {
    switch (category) {
      case 'menores':
        return acompaneantes.value.filter((person) => {
          if (!person.fecha_de_nacimiento) return false; // Si no tiene fecha de nacimiento, ignóralo
          const birthDate = new Date(person.fecha_de_nacimiento);
          const age = new Date().getFullYear() - birthDate.getFullYear();
          return age < 18;
        });
      case 'autorizantes':
        return acompaneantes.value.filter((person) => {
          if (!person.fecha_de_nacimiento) return false;
          const birthDate = new Date(person.fecha_de_nacimiento);
          const age = new Date().getFullYear() - birthDate.getFullYear();
          return age >= 18;
        });
      case 'acompaneantes':
        return acompaneantes.value.filter(
          (person) => person.sex_id === null && person.domicilio === null,
        );
      default:
        return acompaneantes.value;
    }
  };

  // Computación para filtrar los datos según la búsqueda y categoría
  const filteredAcompaneantes = computed(() => {
    const query = searchQuery.value.toLowerCase();
    const categoryFiltered = filterByCategory(categoryFilter.value);

    if (!query) {
      // Si no hay búsqueda, retorna solo los filtrados por categoría
      return categoryFiltered;
    }

    // Si hay búsqueda, filtra también por el término
    return categoryFiltered.filter(
      (person) =>
        person.nombre.toLowerCase().includes(query) ||
        person.apellido.toLowerCase().includes(query) ||
        person.numero_de_documento.toString().includes(query),
    );
  });

  return {
    fetchAllAcompaneante,
    acompaneantes,
    filteredAcompaneantes,
    searchQuery,
    categoryFilter,
  };
};

export default useAcompaneante;
