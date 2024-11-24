// stores/personStore.ts
import { defineStore } from 'pinia';
import { ref } from 'vue';

// Define el tipo de las categorías
type CategoryPerson = 'menores' | 'acompaneantes' | 'autorizantes' | null;

export const usePersonStore = defineStore('personStore', () => {
  // Estado de la categoría activa
  const activeCategory = ref<CategoryPerson>('acompaneantes');
  const idPersonSelected = ref<number | null>(null);

  const setPersonId = (id: number) => {
    idPersonSelected.value = id;
  };
  const setCategory = (newCategory: CategoryPerson) => {
    activeCategory.value = newCategory;
  };

  return {
    activeCategory,
    setCategory,
    setPersonId,
    idPersonSelected,
  };
});
