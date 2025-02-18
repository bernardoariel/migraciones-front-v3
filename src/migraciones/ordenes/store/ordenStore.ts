import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import type { Autorizante } from '../../migraciones/autorizantes/interfaces/autorizante.interface';
import type { Acompaneante } from '../../migraciones/acompaneantes/interfaces/acompaneante.interface';
import type { Menor } from '../../migraciones/menores/interfaces/menor.interface';

import type { Solicitud } from '../../migraciones/ordenes/interface/solicitud.interface';

import { getById } from '../../persons/services/actions';
import { usePersonStore } from '@/migraciones/persons/store/personStore';
import { OrdenBuilder } from '../class/OrdenBuilder';

type CategoryOrden = 'pendientes' | 'autorizados' | 'todos' | null;

export const useOrdenStore = defineStore('ordenStore', () => {
  // State variables
  const activeCategory = ref<CategoryOrden>('pendientes');
  const idOrdenSelected = ref<number | null | 'new'>(null);
  const menor = ref<Menor | null>(null);
  const autorizantes = ref<Autorizante[]>([]);
  const acompaneantes = ref<Acompaneante[]>([]);

  // Computed properties
  const getActiveCategory = computed(() => activeCategory.value);
  const getIdOrdenSelected = computed(() => idOrdenSelected.value);
  const isValidOrden = computed(() => menor.value !== null && autorizantes.value.length > 0);
  const hasItems = computed(
    () => !!menor.value || autorizantes.value.length > 0 || acompaneantes.value.length > 0,
  );

  // Store references
  const store = usePersonStore();
  const builder = new OrdenBuilder();
  console.log('Builder instance:', builder);
  console.log(
    'Methods in OrdenBuilder:',
    Object.getOwnPropertyNames(Object.getPrototypeOf(builder)),
  );

  // Actions for category management
  const setCategory = (newCategory: CategoryOrden = 'pendientes') => {
    activeCategory.value = newCategory;
    console.log('getActiveCategory después de setCategory:', getActiveCategory.value);
  };

  // Actions for orden ID management
  const setOrdenId = (id: number | null | 'new') => {
    idOrdenSelected.value = id;
  };
  const resetState = (category: null | string = null) => {
    console.log('category2::: ', category);
    setOrdenId(null);
    setCategory(category as CategoryOrden);
  };
  // Actions for adding/removing persons
  const setMenor = (newMenor: Menor) => {
    menor.value = newMenor;
    builder.setMenor(newMenor);
  };

  const addAutorizante = (newAutorizante: Autorizante) => {
    if (!autorizantes.value.find((a) => a.id === newAutorizante.id)) {
      autorizantes.value.push(newAutorizante);
      builder.addAutorizante(newAutorizante);
    }
  };

  const addAcompaneante = (newAcompaneante: Acompaneante) => {
    console.log('newAcompaneante::: ', newAcompaneante);
    if (!acompaneantes.value.find((a) => a.id === newAcompaneante.id)) {
      acompaneantes.value.push(newAcompaneante);
      builder.addAcompaneante(newAcompaneante);
    }
  };
  const setSolicitud = (newSolicitud: Solicitud) => {
    solicitud.value = newSolicitud;
    builder.setSolicitud(newMenor);
  };
  const removePerson = (category: string, id: number) => {
    switch (category) {
      case 'menores':
        if (menor.value?.id === id) {
          menor.value = null;
          builder.setMenor(null);
        }
        break;
      case 'autorizantes':
        autorizantes.value = autorizantes.value.filter((person) => person.id !== id);
        console.log('Autorizantes después de eliminar:', autorizantes.value);
        builder.setAutorizantes(autorizantes.value); // Verifica si este método existe
        break;
      case 'acompaneantes':
        acompaneantes.value = acompaneantes.value.filter((person) => person.id !== id);
        console.log('Acompaneantes después de eliminar:', acompaneantes.value);
        builder.setAcompaneantes(acompaneantes.value); // Verifica si este método existe
        break;
      default:
        console.error('Categoría no válida para eliminar.');
        break;
    }
  };

  // Actions for managing orden data
  const resetOrden = () => {
    menor.value = null;
    autorizantes.value = [];
    acompaneantes.value = [];
    builder.setMenor(null);
    builder.setSolicitud(null);
  };

  const buildOrden = () => {
    try {
      return builder.build();
    } catch (error) {
      console.error(error.message);
      return null;
    }
  };

  // Action for fetching persons by category
  const getPerson = async (category: string, id: number | null | 'new') => {
    if (!id || id === 'new') {
      console.error('ID de la persona no seleccionado.');
      return;
    }

    try {
      const person = await getById(id);
      const cleanedPerson = { ...person };
      delete cleanedPerson.authorizing_relatives_id;
      delete cleanedPerson.accreditation_links_id;
      if (!person) {
        throw new Error(`No se encontró la persona con ID ${id}`);
      }

      switch (category) {
        case 'menores':
          setMenor(cleanedPerson as Menor);
          break;
        case 'autorizantes':
          addAutorizante(cleanedPerson as Autorizante);
          break;
        case 'acompaneantes':
          addAcompaneante(cleanedPerson as Acompaneante);
          break;
        default:
          throw new Error('Categoría no válida.');
      }

      store.resetState();
    } catch (error) {
      console.error('Error al obtener la persona:', error);
    }
  };
  const updateAutorizante = (id: number, updates: Partial<Autorizante>) => {
    const autorizanteIndex = autorizantes.value.findIndex((aut) => aut.id === id);
    if (autorizanteIndex !== -1) {
      autorizantes.value[autorizanteIndex] = {
        ...autorizantes.value[autorizanteIndex],
        ...updates,
      };
    } else {
      console.error(`No se encontró el autorizante con ID ${id}`);
    }
  };
  // Return store state and actions
  return {
    activeCategory,
    getActiveCategory,
    setCategory,
    resetState,
    idOrdenSelected,
    getIdOrdenSelected,
    setOrdenId,
    menor,
    autorizantes,
    acompaneantes,
    // solicitud,
    setSolicitud,
    setMenor,
    addAutorizante,
    addAcompaneante,
    resetOrden,
    buildOrden,
    isValidOrden,
    getPerson,
    removePerson,
    hasItems,
    updateAutorizante,
  };
});
