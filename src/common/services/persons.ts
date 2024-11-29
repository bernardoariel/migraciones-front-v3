import { apiMigrationsData } from '@/api/apiMigrationsData';
import type { Person } from '../interfaces/person.interface';

export const create = async (value: Partial<Person>) => {
  try {
    const response = await apiMigrationsData.post('/v2/persona/new', value);
    return response.data;
  } catch (error) {
    console.error('Error al enviar los datos:', error);
    throw error;
  }
};

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

export const update = async (id: number, value: Partial<Person>) => {
  try {
    const response = await apiMigrationsData.put(`/v2/persona/update/${id}`, value);
    return response.data;
  } catch (error) {
    console.error(`Error al actualizar el acompañante con ID ${id}:`, error);
    throw error;
  }
};
export const getPersonaByDocumento = (dni: number) => {
  return apiMigrationsData.get(`/v2/getPersonaByDocumento/${dni}`);
};