import { apiMigrationsData } from '@/api/apiMigrationsData';
import type { Acompaneante } from '../interfaces/acompaneante.interface';

export const create = async (value: Acompaneante) => {
  try {
    const response = await apiMigrationsData.post('/v2/persona/new', value);
    return response.data;
  } catch (error) {
    console.error('Error al enviar los datos:', error);
    throw error;
  }
};

// Obtener todos los acompañantes
export const getAll = async () => {
  try {
    const response = await apiMigrationsData.get('/personas');
    return response.data;
  } catch (error) {
    console.error('Error al obtener los datos:', error);
    throw error;
  }
};

export const getById = async (id: number) => {
  try {
    const response = await apiMigrationsData.get(`/v2/personaById/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener el acompañante con ID ${id}:`, error);
    throw error;
  }
};

export const update = async (id: number, value: Acompaneante) => {
  try {
    const response = await apiMigrationsData.put(`/v2/persona/update/${id}`, value);
    return response.data;
  } catch (error) {
    console.error(`Error al actualizar el acompañante con ID ${id}:`, error);
    throw error;
  }
};
