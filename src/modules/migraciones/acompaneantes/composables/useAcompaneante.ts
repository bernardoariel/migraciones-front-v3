import { create, getAll, getById, update } from '../services/actions';
import type { Acompaneante } from '../interfaces/acompaneante.interface';

const useAcompaneante = () => {
  const createAcompaneante = async (value: Acompaneante) => {
    try {
      await create(value);
    } catch (error) {
      console.error('Error al crear el acompañante:', error);
    }
  };
  const fetchAllAcompaneante = async () => {
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

  const updateAcompaneante = async (id: number, value: Partial<Acompaneante>) => {
    console.log('value::: ', value);
    console.log('id::: ', id);
    try {
      await update(id, value);
    } catch (error) {
      console.error(`Error al actualizar el acompañante con ID ${id}:`, error);
    }
  };
  return {
    createAcompaneante,
    fetchAllAcompaneante,
    fetchAcompaneanteById,
    updateAcompaneante,
  };
};

export default useAcompaneante;
