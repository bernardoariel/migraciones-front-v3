import { create } from '../services/actions';
import type { Autorizante } from '../interfaces/autorizante.interface';

const useAutorizante = () => {
  const createAutorizante = async (value: Autorizante) => {
    try {
      await create(value);
    } catch (error) {
      console.error('Error al crear el autorizante:', error);
    }
  };

  return {
    createAutorizante,
  };
};

export default useAutorizante;
