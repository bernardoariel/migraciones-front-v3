import { create, getAll, getById } from '../services/actions';
import type { Acompaneante } from '../interfaces/acompaneante.interface';

const useAcompaneante = () => {
  const createAcompaneante = async (value: Acompaneante) => {
    try {
      await create(value);
    } catch (error) {
      console.error('Error al crear el acompañante:', error);
    }
  };
  const fetchAllAcompaneantes = async () => {
    try {
      const data = await getAll();
      return data;
    } catch (error) {
      console.error('Error al obtener los acompañantes:', error);
    }
  };

  const fetchAcompaneanteById = async (id: number) => {
    try {
      const data = await getById(id);
      return data;
    } catch (error) {
      console.error(`Error al obtener el acompañante con ID ${id}:`, error);
    }
  };
  return {
    createAcompaneante,
    fetchAllAcompaneantes,
    fetchAcompaneanteById,
  };
};

export default useAcompaneante;
