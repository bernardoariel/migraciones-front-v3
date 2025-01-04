import { apiMigrationsData } from '@/api/apiMigrationsData';
import { ref, onMounted } from 'vue';

export interface OrdenItem {
  tipo: 'menor' | 'autorizante' | 'acompaneante' | 'escribano';
  id_detalle: number;
  nombre_tabla: string;
}

// Add new interface for relations
export interface AutorizanteRelations {
  authorizing_relatives_id?: number;
  accreditation_links_id?: number;
}

interface OrderItemAutorizante {
  id_detalle: number;
  authorizing_relatives_id: number | null;
  accreditation_links_id: number | null;
}

const useOrdenItem = () => {
  const ordenItems = ref<OrdenItem[]>([]);

  const cargarOrdenItem = async (id: number): Promise<any[]> => {
    try {
      const response = await apiMigrationsData.get(`/ordenesitems/${id}`);

      if (response.data && Array.isArray(response.data)) {
        ordenItems.value = response.data;
        return ordenItems.value;
      } else {
        console.error(
          "La respuesta no tiene la propiedad 'data' o no es un array válido:",
          response,
        );
        return [];
      }
    } catch (error) {
      console.error('Error al cargar ordenes:', error);
      return [];
    }
  };

  // Add new function to get autorizante relations
  const getAutorizanteRelations = async (autorizanteId: number, orderId: number) => {
    try {
      const response = await apiMigrationsData.post('/ordenesitems/bsq', {
        order_id: orderId,
        tipo: 'autorizante'
      });

      // Find matching order_item for this autorizante
      const autorizanteItem = response.data.find(
        (item: OrderItemAutorizante) => item.id_detalle === autorizanteId
      );

      console.log('Found order item:', autorizanteItem);

      if (autorizanteItem) {
        return {
          authorizing_relatives_id: autorizanteItem.authorizing_relatives_id,
          accreditation_links_id: autorizanteItem.accreditation_links_id
        };
      }

      return null;
    } catch (error) {
      console.error('Error getting autorizante relations:', error);
      return null;
    }
  };

  onMounted(() => {
    cargarOrdenItem(1);
  });

  return { 
    cargarOrdenItem, 
    ordenItems,
    getAutorizanteRelations // Add to returned object
  };
};

export default useOrdenItem;
