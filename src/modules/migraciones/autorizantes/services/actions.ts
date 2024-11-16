import { apiMigrationsData } from '@/api/apiMigrationsData';
import type { Autorizante } from '../interfaces/autorizante.interface';

export const create = async (value: Autorizante) => {
  try {
    const response = await apiMigrationsData.post('/api/v2/persona/new', value);
    return response.data;
  } catch (error) {
    console.error('Error al enviar los datos:', error);
    throw error;
  }
};
