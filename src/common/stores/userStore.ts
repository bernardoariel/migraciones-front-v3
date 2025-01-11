import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
interface User {
  id: number;
  nombre: string;
  apellido: string;
  matricula: string;
  email: string;
  tipo: string;
  password: string;
  habilitado: string;
}

export const useUserStore = defineStore('user', () => {
  const user = ref<User | null>(null);
  const representado = ref<User | null>(null);
  const setUser = (userData: {
    id: number | null;
    nombre: string;
    apellido: string;
    matricula: string;
  }) => {
    user.value = userData;
    representado.value = userData;
  };
  const setRepresentado = (representadoData: {
    id: number | null;
    nombre: string;
    apellido: string;
    matricula: string;
  }) => {
    representado.value = representadoData;
  };

  const clearUser = () => {
    user.value = null;
  };
  const clearRepresentado = () => {
    representado.value = null;
  };

  const isAuthenticated = computed(() => !!user.value);
  const fullName = computed(() =>
    user.value ? `${user.value.nombre} ${user.value.apellido}` : '',
  );
  const representadoFullName = computed(() =>
    representado.value ? `${representado.value.nombre} ${representado.value.apellido}` : '',
  );
  return {
    user,
    representado,
    setUser,
    setRepresentado,
    clearUser,
    clearRepresentado,
    isAuthenticated,
    fullName,
    representadoFullName,
  };
});
