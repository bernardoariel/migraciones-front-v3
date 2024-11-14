import { apiMigrationsData } from '@/api/apiMigrationsData';
import type { Acompaneante } from '../interfaces/acompaneante.interface';

export const create = async (value: Acompaneante) => {
  try {
    const response = await apiMigrationsData.post('/api/v2/persona/new', value);
    return response.data;
  } catch (error) {
    console.error('Error al enviar los datos:', error);
    throw error;
  }
};
