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

// Obtener todos los acompañantes
export const getAll = async () => {
  try {
    const response = await apiMigrationsData.get('/api/personas');
    return response.data;
  } catch (error) {
    console.error('Error al obtener los datos:', error);
    throw error;
  }
};

// Obtener un acompañante por ID
export const getById = async (id: number) => {
  try {
    const response = await apiMigrationsData.get(`/api/v2/personaById/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener el acompañante con ID ${id}:`, error);
    throw error;
  }
};
