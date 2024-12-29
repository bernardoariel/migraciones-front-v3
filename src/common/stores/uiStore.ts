// stores/uiStore.ts
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useUIStore = defineStore('ui', () => {
  const showPersonForm = ref(false);

  const setShowPersonForm = (value: boolean) => {
    showPersonForm.value = value;
  };

  return {
    showPersonForm,
    setShowPersonForm
  };
});