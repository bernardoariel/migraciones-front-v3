import { apiMigrationsData } from '@/api/apiMigrationsData';
import type { Menor } from '../interfaces/menor.interface';

export const create = async (value: Menor) => {
  try {
    const response = await apiMigrationsData.post('/api/v2/persona/new', value);
    return response.data;
  } catch (error) {
    console.error('Error al enviar los datos:', error);
    throw error;
  }
};