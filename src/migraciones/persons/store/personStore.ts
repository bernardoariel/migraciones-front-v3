import { ref, computed } from 'vue';
import { defineStore } from 'pinia';

type CategoryPerson = 'menores' | 'acompaneantes' | 'autorizantes' | null;

export const usePersonStore = defineStore('personStore', () => {
  const activeCategory = ref<CategoryPerson>('menores');
  const idPersonSelected = ref<number | null | 'new'>(null);

  const getActiveCategory = computed(() => activeCategory.value);
  const getIdPersonSelected = computed(() => idPersonSelected.value);
  const setPersonId = (id: number | null | 'new') => {
    idPersonSelected.value = id;
  };
  const setCategory = (newCategory: CategoryPerson = 'menores') => {
    activeCategory.value = newCategory;
  };
  const resetState = (category: null | string = null) => {
    setPersonId(null);
    setCategory(category as CategoryPerson);
  };

  return {
    getActiveCategory,
    getIdPersonSelected,
    setCategory,
    setPersonId,
    resetState,
  };
});
