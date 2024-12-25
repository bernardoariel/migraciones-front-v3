import { ref } from 'vue';
import { fetchDropdownOptions } from '../services/actionsDropdown';

// useDropdownOptions.ts
export default function useDropdownOptions() {
  const documentTypeOptions = ref<{ label: string; value: number }[]>([]);
  const nationalityOptions = ref<{ label: string; value: number }[]>([]);
  const issuerDocsOptions = ref<{ label: string; value: number }[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const loadOptions = async (endpoint: string, labelField: string = 'nombre') => {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await fetchDropdownOptions(endpoint);
      if (endpoint === 'nacionalidades') {
        nationalityOptions.value = response.map((item: any) => ({
          label: item[labelField],
          value: item.id,
        }));
      } else if (endpoint === 'tiposdocumentos') {
        documentTypeOptions.value = response.map((item: any) => ({
          label: item[labelField],
          value: item.id,
        }));
      } else if (endpoint === 'emisordocumentos') {
        issuerDocsOptions.value = response.map((item: any) => ({
          label: item[labelField],
          value: item.id,
        }));
      }
    } catch (err) {
      error.value = 'Error al cargar las opciones';
      console.error(err);
    } finally {
      isLoading.value = false;
    }
  };

  return {
    documentTypeOptions,
    nationalityOptions,
    issuerDocsOptions,
    isLoading,
    error,
    loadOptions,
  };
}
