import { create } from '../services/actions';
import type { Acompaneante } from '../interfaces/acompaneante.interface';

const useAcompaneante = () => {
  const createAcompaneante = async (value: Acompaneante) => {
    try {
      await create(value);
    } catch (error) {
      console.error('Error al crear el acompañante:', error);
    }
  };

  return {
    createAcompaneante,
  };
};

export default useAcompaneante;
