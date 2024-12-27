<template>
  <div
    v-if="isLoading"
    class="fixed inset-0 flex flex-col items-center justify-center bg-cover bg-center z-50"
    :style="{
      backgroundImage: `linear-gradient(${overlayColor}, ${overlayColor}), url(${backgroundImage})`,
    }"
  >
    <span class="loading loading-spinner text-white w-32 h-32 mb-4"></span>

    <p class="text-white text-5xl font-bold animate-blink">CARGANDO...</p>
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
import { ref, onMounted, computed, watch } from 'vue';
import { useAppStore } from './common/stores/appStore';
import backgroundImage from '@/assets/images/portada.jpg';

const userStore = useUserStore();
const appStore = useAppStore();

const isLoading = computed(() => appStore.isLoading);

const overlayColor = ref('rgba(59, 130, 246, 0.75)');

let intervalId: ReturnType<typeof setInterval> | null = null;

const getRandomColor = () => {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  return `rgba(${r}, ${g}, ${b}, 0.5)`;
};

watch(isLoading, (newVal) => {
  if (newVal) {
    intervalId = setInterval(() => {
      overlayColor.value = getRandomColor();
    }, 100);
  } else if (intervalId) {
    // Detener el intervalo y restaurar el color
    clearInterval(intervalId);
    intervalId = null;
    overlayColor.value = 'rgba(59, 130, 246, 0.75)';
  }
});

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

<style scoped>
@keyframes blink {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
}

.animate-blink {
  animation: blink 1s infinite;
}
</style>
