import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import type { Autorizante } from '../../modules/migraciones/autorizantes/interfaces/autorizante.interface';
import type { Acompaneante } from '../../modules/migraciones/acompaneantes/interfaces/acompaneante.interface';
import type { Menor } from '../../modules/migraciones/menores/interfaces/menor.interface';
import { OrdenBuilder } from '../class/OrdenBuilder';
import { getById } from '../services/persons';
import { usePersonStore } from './personStore';
import type { Solicitud } from '../../modules/migraciones/ordenes/interface/solicitud.interface';

export const useOrdenStore = defineStore('ordenStore', () => {
  const menor = ref<Menor | null>(null);
  const autorizantes = ref<Autorizante[]>([]);
  const acompaneantes = ref<Acompaneante[]>([]);
  const solicitud = ref<Solicitud>();

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
    acompaneantes.value.push(newAcompaneante);
    builder.addAcompaneante(newAcompaneante);
  };
  const setSolicitud = (newSolicitud: Solicitud) => {
    solicitud.value = newSolicitud;
    builder.setSolicitud(newMenor);
  };

  const resetOrden = () => {
    menor.value = null;
    autorizantes.value = [];
    acompaneantes.value = [];
    builder.setMenor(null);
    builder.setSolicitud(null);
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

  const getPerson = async (category: string, id: number | null | 'new') => {
    if (!id || id === 'new') {
      console.error('ID de la persona no seleccionado.');
      return;
    }

    try {
      const person = await getById(id);
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

      store.resetState();
    } catch (error) {
      console.error('Error al obtener la persona:', error);
    }
  };

  const removePerson = (category: string, id: number) => {
    switch (category) {
      case 'menores': {
        if (menor.value?.id === id) {
          menor.value = null;
          builder.setMenor(null);
        }
        break;
      }
      case 'autorizantes': {
        autorizantes.value = autorizantes.value.filter((person) => person.id !== id);
        builder.setAutorizantes(autorizantes.value);
        break;
      }
      case 'acompaneantes': {
        acompaneantes.value = acompaneantes.value.filter((person) => person.id !== id);
        builder.setAcompaneantes(acompaneantes.value);
        break;
      }
      default: {
        console.error('Categoría no válida para eliminar.');
        break;
      }
    }
  };

  return {
    menor,
    autorizantes,
    acompaneantes,
    solicitud,
    setSolicitud,
    setMenor,
    addAutorizante,
    addAcompaneante,
    resetOrden,
    buildOrden,
    isValidOrden,
    getPerson,
    removePerson,
    hasItems: computed(
      () => !!menor.value || autorizantes.value.length > 0 || acompaneantes.value.length > 0,
    ),
  };
});
