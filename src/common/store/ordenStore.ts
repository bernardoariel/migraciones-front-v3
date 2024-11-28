import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import type { Autorizante } from '../../modules/migraciones/autorizantes/interfaces/autorizante.interface';
import type { Acompaneante } from '../../modules/migraciones/acompaneantes/interfaces/acompaneante.interface';
import type { Menor } from '../../modules/migraciones/menores/interfaces/menor.interface';
import { OrdenBuilder } from '../class/OrdenBuilder';
import { getById } from '../services/persons';
import { usePersonStore } from './personStore';

export const useOrdenStore = defineStore('ordenStore', () => {
  const menor = ref<Menor | null>(null);
  const autorizantes = ref<Autorizante[]>([]);
  const acompaneantes = ref<Acompaneante[]>([]);
  const store = usePersonStore();
  const builder = new OrdenBuilder();

  const setMenor = (newMenor: Menor) => {
    menor.value = newMenor;
    builder.setMenor(newMenor);
  };

  const addAutorizante = (newAutorizante: Autorizante) => {
    autorizantes.value.push(newAutorizante);
    builder.addAutorizante(newAutorizante);
  };

  const addAcompaneante = (newAcompaneante: Acompaneante) => {
    console.log('newAcompaneante::: ', newAcompaneante);
    acompaneantes.value.push(newAcompaneante);
    console.log('acompaneantes.value::: ', acompaneantes.value);
    builder.addAcompaneante(newAcompaneante);
  };

  const resetOrden = () => {
    menor.value = null;
    autorizantes.value = [];
    acompaneantes.value = [];
    builder.setMenor(null);
  };

  const buildOrden = () => {
    try {
      return builder.build();
    } catch (error) {
      console.error(error.message);
      return null;
    }
  };

  const isValidOrden = computed(() => {
    return menor.value !== null && autorizantes.value.length > 0;
  });
  // Nueva función getPerson
  const getPerson = async (category: string, id: number | null) => {
    console.log('i!d::: ', id);
    if (!id) {
      console.error('ID de la persona no seleccionado.');
      return;
    }

    try {
      const person = await getById(id); // Verifica si `getById` lanza errores
      if (!person) {
        throw new Error(`No se encontró la persona con ID ${id}`);
      }

      switch (category) {
        case 'menores': {
          setMenor(person as Menor);
          break;
        }
        case 'autorizantes': {
          addAutorizante(person as Autorizante);
          break;
        }
        case 'acompaneantes': {
          addAcompaneante(person as Acompaneante);
          break;
        }
        default: {
          throw new Error('Categoría no válida.');
        }
      }

      // Resetear estado del otro store
      store.resetState();
    } catch (error) {
      console.error('Error al obtener la persona:', error);
    }
  };

  return {
    menor,
    autorizantes,
    acompaneantes,
    setMenor,
    addAutorizante,
    addAcompaneante,
    resetOrden,
    buildOrden,
    isValidOrden,
    getPerson,
    hasItems: computed(
      () => !!menor.value || autorizantes.value.length > 0 || acompaneantes.value.length > 0,
    ),
  };
});
