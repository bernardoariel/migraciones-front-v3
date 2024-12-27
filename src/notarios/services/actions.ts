import { apiMigrationsData } from '@/api/apiMigrationsData';

import type { NotarioResponse } from '../interfaces/NotarioResponse.interface';
import type { Notario } from '../interfaces/Notario.interface';

export const getAll = async (): Promise<NotarioResponse[]> => {
  try {
    const response = await apiMigrationsData.get('/escribanos');
    return response.data;
  } catch (error) {
    console.error('Error al obtener los datos:', error);
    throw error;
  }
};

export const getById = async (id: number): Promise<NotarioResponse> => {
  try {
    const response = await apiMigrationsData.get(`/escribano/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener el acompañante con ID ${id}:`, error);
    throw error;
  }
};

export const update = async (id: number, value: Notario) => {
  try {
    const response = await apiMigrationsData.put(`/actualizarEscribano/${id}`, value);
    return response.data;
  } catch (error) {
    console.error(`Error al actualizar el acompañante con ID ${id}:`, error);
    throw error;
  }
};
