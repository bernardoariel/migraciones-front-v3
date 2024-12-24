<template>
  <div
    class="bg-no-repeat bg-cover bg-center relative"
    :style="{ backgroundImage: `url(${backgroundImage})` }"
  >
    <div
      class="absolute bg-gradient-to-b from-violet-500 to-violet-400 opacity-75 inset-0 z-0"
    ></div>
    <div class="min-h-screen sm:flex sm:flex-row mx-0 justify-center">
      <div class="flex justify-center self-center z-10">
        <div class="p-12 bg-white mx-auto rounded-2xl w-100">
          <!-- <img :src="logo" alt="Logo" class="mb-3 w-24 h-24 rounded-full" /> -->
          <h2 class="text-2xl font-bold text-center text-gray-800 mb-4">Recuperar contraseña</h2>
          <form @submit.prevent="handleForgotPassword">
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700">Email o matrícula</label>
              <input
                v-model="identifier"
                type="text"
                class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:border-violet-400"
                placeholder="Email o número de matrícula"
                required
              />
            </div>
            <div>
              <button
                type="submit"
                class="w-full bg-violet-500 hover:bg-violet-600 text-white py-2 rounded-lg shadow-md font-semibold transition duration-300"
              >
                Enviar nueva contraseña
              </button>
            </div>
          </form>
          <div class="mt-4 text-center">
            <router-link to="/login" class="text-violet-500 hover:underline">
              Volver al inicio de sesión
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { apiMigrationsData } from '@/api/apiMigrationsData';

import backgroundImage from '@/assets/images/portada.jpg';

const router = useRouter();
const identifier = ref('');

const handleForgotPassword = async () => {
  try {
    const response = await apiMigrationsData.post('/forgot-password', {
      identifier: identifier.value,
    });

    alert(response.data.message);
    router.push('/login');
  } catch (err) {
    console.error(err);
  }
};
</script>
