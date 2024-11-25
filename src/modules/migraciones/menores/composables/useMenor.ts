import { create } from '../services/actions';
import type { Menor } from '../interfaces/menor.interface';

const useMenor = () => {
  const createMenor = async (value: Menor) => {
    try {
      await create(value);
    } catch (error) {
      console.error('Error al crear el menor:', error);
    }
  };

  return {
    createMenor,
  };
};

export default useMenor;
