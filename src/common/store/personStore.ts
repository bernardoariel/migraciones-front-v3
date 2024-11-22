// stores/personStore.ts
import { defineStore } from 'pinia';
import { ref } from 'vue';

// Define el tipo de las categorías
type CategoryPerson = 'menores' | 'acompaneantes' | 'autorizantes' | null;

export const usePersonStore = defineStore('personStore', () => {
  // Estado de la categoría activa
  const activeCategory = ref<CategoryPerson>('acompaneantes');

  // Función para actualizar la categoría activa
  const setCategory = (newCategory: CategoryPerson) => {
    activeCategory.value = newCategory;
  };

  return {
    activeCategory,
    setCategory,
  };
});
