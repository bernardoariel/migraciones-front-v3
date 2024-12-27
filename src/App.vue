<template>
  <div class="flex flex-col h-full">
    <RouterView />
  </div>
  <VueQueryDevtools />
</template>

<script setup lang="ts">
import { VueQueryDevtools } from '@tanstack/vue-query-devtools';
import { useUserStore } from './common/stores/userStore';
import { apiMigrationsData } from '@/api/apiMigrationsData';
import { onMounted } from 'vue';
const userStore = useUserStore();
onMounted(async () => {
  const token = localStorage.getItem('token'); // Obtén el token del localStorage
  if (token) {
    try {
      const response = await apiMigrationsData.get('/me', {
        headers: {
          Authorization: `Bearer ${token}`, // Envía el token en el encabezado
        },
      });

      // Guarda la información del usuario en el store
      userStore.setUser(response.data.user);
    } catch (error) {
      console.error('Error al cargar la información del usuario:', error);

      // Si hay un error (por ejemplo, token inválido), elimina el token y redirige al login
      localStorage.removeItem('token');
      userStore.clearUser();
      window.location.href = '/login';
    }
  }
});
</script>

<style scoped></style>
