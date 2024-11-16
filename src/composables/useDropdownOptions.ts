import { ref } from 'vue';
import { fetchDropdownOptions } from '../services/actionsDropdown';
export default function useDropdownOptions() {
  const options = ref<{ label: string; value: number }[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const loadOptions = async (endpoint: string) => {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await fetchDropdownOptions(endpoint);
      options.value = response.map((item) => ({
        label: item.descripcion, // Mapea la descripción como label
        value: item.id, // Usa el id como value
      }));
      console.log('options.value::: ', options.value);
    } catch (err) {
      error.value = 'Error al cargar las opciones';
      console.error(err);
    } finally {
      isLoading.value = false;
    }
  };

  return {
    options,
    isLoading,
    error,
    loadOptions,
  };
}
