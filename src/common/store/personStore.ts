import { ref, computed } from 'vue';
import { defineStore } from 'pinia';

type CategoryPerson = 'menores' | 'acompaneantes' | 'autorizantes' | null;

export const usePersonStore = defineStore('personStore', () => {
  const activeCategory = ref<CategoryPerson>('acompaneantes');
  const idPersonSelected = ref<number | null>(null);

  const getActiveCategory = computed(() => activeCategory.value);
  const getIdPersonSelected = computed(() => idPersonSelected.value);
  const setPersonId = (id: number | number) => {
    idPersonSelected.value = id;
  };
  const setCategory = (newCategory: CategoryPerson) => {
    activeCategory.value = newCategory;
  };
  const resetState = () => {
    setPersonId(null);
    setCategory(null);
  };
  return {
    getActiveCategory,
    getIdPersonSelected,
    setCategory,
    setPersonId,
    resetState,
  };
});
