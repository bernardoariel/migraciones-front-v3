import { create, getAll, update, getById , getPersonaByDocumento} from '../services/persons';

const usePerson = () => {
  const createPerson = async (value: Acompaneante) => {
    try {
      await create(value);
    } catch (error) {
      console.error('Error al crear la persona:', error);
    }
  };
  const fetchAllPerson = async (): Promise<Person[]> => {
    try {
      const data = await getAll();
      return data;
    } catch (error) {
      console.error('Error al obtener las personas:', error);
    }
  };

  const fetchAllPersonById = async (id: number) => {
    try {
      const data = await getById(id);
      return data;
    } catch (error) {
      console.error(`Error al obtener la Persona con ID ${id}:`, error);
    }
  };

  const updatePerson = async (id: number, value: Partial<Acompaneante>) => {
    console.log('value::: ', value);
    console.log('id::: ', id);
    try {
      await update(id, value);
    } catch (error) {
      console.error(`Error al actualizar el acompañante con ID ${id}:`, error);
    }
  };

  const getPersonByDoc= async (dni: number) => {
    try {
      await getPersonaByDocumento(dni);
    } catch (error) {
      console.error(`Error al obtener la persona con el DNI ${dni}:`, error);
    }
  };
  return {
    createPerson,
    fetchAllPerson,
    fetchAllPersonById,
    updatePerson,
    getPersonByDoc
  };
};

export default usePerson;
