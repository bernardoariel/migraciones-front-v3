<template>
  <div
    v-if="isLoading"
    class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-10 z-50"
  >
    <span class="loading loading-spinner text-blue-500 w-32 h-32"></span>
  </div>
  <div v-else class="flex flex-col h-full">
    <RouterView />
  </div>
  <VueQueryDevtools />
</template>

<script setup lang="ts">
import { VueQueryDevtools } from '@tanstack/vue-query-devtools';
import { useUserStore } from './common/stores/userStore';
import { apiMigrationsData } from '@/api/apiMigrationsData';
import { onMounted, computed } from 'vue';
import { useAppStore } from './common/stores/appStore';

const userStore = useUserStore();
const appStore = useAppStore();

const isLoading = computed(() => appStore.isLoading);
onMounted(async () => {
  const token = localStorage.getItem('token');
  if (token) {
    try {
      appStore.setLoading(true);
      const response = await apiMigrationsData.get('/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      userStore.setUser(response.data.user);
    } catch (error) {
      console.error('Error al cargar la información del usuario:', error);
      localStorage.removeItem('token');
    } finally {
      appStore.setLoading(false);
    }
  } else {
    appStore.setLoading(false);
  }
});
</script>

<style scoped></style>
