import { apiMigrationsData } from '@/api/apiMigrationsData';
import { ref, onMounted } from 'vue';

export interface OrdenItem {
  tipo: 'menor' | 'autorizante' | 'acompaneante' | 'escribano';
  id_detalle: number;
  nombre_tabla: string;
  // Otros campos de la orden
}

const useOrdenItem = () => {
  const ordenItems = ref<OrdenItem[]>([]);

  const cargarOrdenItem = async (id: number): Promise<any[]> => {
    try {
      const response = await apiMigrationsData.get(`/ordenesitems/${id}`);

      if (response.data && Array.isArray(response.data)) {
        ordenItems.value = response.data; // Asigna los datos a ordenItems

        return ordenItems.value; // Asegúrate de retornar el valor aquí
      } else {
        console.error(
          "La respuesta no tiene la propiedad 'data' o no es un array válido:",
          response,
        );
        return []; // Retorna un arreglo vacío en caso de error
      }
    } catch (error) {
      console.error('Error al cargar ordenes:', error);
      return []; // Retorna un arreglo vacío en caso de error
    }
  };

  onMounted(() => {
    cargarOrdenItem(1); // Usamos el ID correcto aquí para la consulta
  });

  return { cargarOrdenItem, ordenItems };
};

export default useOrdenItem;
