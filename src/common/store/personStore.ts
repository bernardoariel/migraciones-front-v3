import { ref, computed } from 'vue';
import { defineStore } from 'pinia';

type CategoryPerson = 'menores' | 'acompaneantes' | 'autorizantes' | null;

export const usePersonStore = defineStore('personStore', () => {
  const activeCategory = ref<CategoryPerson>('acompaneantes');
  const idPersonSelected = ref<number | null>(null);

  const getActiveCategory = computed(() => activeCategory.value);
  const getIdPersonSelected = computed(() => idPersonSelected.value);
  const setPersonId = (id: number | null) => {
    idPersonSelected.value = id;
  };
  const setCategory = (newCategory: CategoryPerson) => {
    console.log('newCategory::: ', newCategory);
    activeCategory.value = newCategory;
  };
  const resetState = (category: null | string = null) => {
    console.log('resetState::: ', resetState);
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
