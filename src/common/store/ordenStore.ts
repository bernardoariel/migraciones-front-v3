import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import type { Autorizante } from '../../modules/migraciones/autorizantes/interfaces/autorizante.interface';
import type { Acompaneante } from '../../modules/migraciones/acompaneantes/interfaces/acompaneante.interface';
import type { Menor } from '../../modules/migraciones/menores/interfaces/menor.interface';
import { OrdenBuilder } from '../class/OrdenBuilder';
import { getById } from '../services/persons';
import { usePersonStore } from './personStore';

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
  const hasItems = computed(() => !!menor.value || autorizantes.value.length > 0 || acompaneantes.value.length > 0);

  // Store references
  const store = usePersonStore();
  const builder = new OrdenBuilder();

  // Actions for category management
  const setCategory = (newCategory: CategoryOrden = 'pendientes') => {
    activeCategory.value = newCategory;
  };

  // Actions for orden ID management
  const setOrdenId = (id: number | null | 'new') => {
    idOrdenSelected.value = id;
  };
  const resetState = (category: null | string = null) => {
    setOrdenId(null);
    setCategory(category as CategoryOrden);
  };
  // Actions for adding/removing persons
  const setMenor = (newMenor: Menor) => {
    menor.value = newMenor;
    builder.setMenor(newMenor);
  };

  const addAutorizante = (newAutorizante: Autorizante) => {
    autorizantes.value.push(newAutorizante);
    builder.addAutorizante(newAutorizante);
  };

  const addAcompaneante = (newAcompaneante: Acompaneante) => {
    acompaneantes.value.push(newAcompaneante);
    builder.addAcompaneante(newAcompaneante);
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
        builder.setAutorizantes(autorizantes.value);
        break;
      case 'acompaneantes':
        acompaneantes.value = acompaneantes.value.filter((person) => person.id !== id);
        builder.setAcompaneantes(acompaneantes.value);
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
      if (!person) {
        throw new Error(`No se encontró la persona con ID ${id}`);
      }

      switch (category) {
        case 'menores':
          setMenor(person as Menor);
          break;
        case 'autorizantes':
          addAutorizante(person as Autorizante);
          break;
        case 'acompaneantes':
          addAcompaneante(person as Acompaneante);
          break;
        default:
          throw new Error('Categoría no válida.');
      }

      store.resetState();
    } catch (error) {
      console.error('Error al obtener la persona:', error);
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
    setMenor,
    addAutorizante,
    addAcompaneante,
    resetOrden,
    buildOrden,
    isValidOrden,
    getPerson,
    removePerson,
    hasItems,
  };
});
