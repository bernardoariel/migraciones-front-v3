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

  const setUser = (userData: {
    id: number | null;
    nombre: string;
    apellido: string;
    matricula: string;
  }) => {
    user.value = userData;
  };

  const clearUser = () => {
    user.value = null;
  };

  const isAuthenticated = computed(() => !!user.value);
  const fullName = computed(() =>
    user.value ? `${user.value.nombre} ${user.value.apellido}` : '',
  );

  return {
    user,
    setUser,
    clearUser,
    isAuthenticated,
    fullName,
  };
});
