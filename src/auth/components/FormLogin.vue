<template>
  <div
    class="bg-no-repeat bg-cover bg-center relative"
    :style="{ backgroundImage: `url(${backgroundImage})` }"
  >
    <div class="absolute bg-gradient-to-b from-blue-500 to-blue-400 opacity-75 inset-0 z-0"></div>
    <div class="min-h-screen sm:flex sm:flex-row mx-0 justify-center">
      <div class="flex-col flex self-center p-10 sm:max-w-5xl xl:max-w-2xl z-10">
        <div class="self-start hidden lg:flex flex-col text-white">
          <img :src="logo" alt="Logo" class="mb-3 w-24 h-24 rounded-full" />
          <h1 class="mb-3 font-bold text-5xl">Bienvenido Escribano!</h1>
          <p class="pr-3">
            Ingrese con los datos de su cuenta para poder realizar en su cuenta personal de
            ESCRIBANIA
          </p>
        </div>
      </div>
      <div class="flex justify-center self-center z-10">
        <div class="p-12 bg-white mx-auto rounded-2xl w-100">
          <div class="mb-4">
            <h3 class="font-semibold text-2xl text-gray-800">LOGIN</h3>
            <p class="text-gray-500">Inicie sesión en su cuenta.</p>
          </div>
          <form @submit.prevent="handleLogin">
            <div class="space-y-5">
              <div class="space-y-2">
                <label class="text-sm font-medium text-gray-700 tracking-wide">Email</label>
                <input
                  v-model="email"
                  class="w-full text-base px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400"
                  type="email"
                  placeholder="mail@gmail.com"
                  required
                />
              </div>
              <div class="space-y-2">
                <label class="mb-5 text-sm font-medium text-gray-700 tracking-wide">
                  Password
                </label>
                <input
                  v-model="password"
                  class="w-full content-center text-base px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400"
                  type="password"
                  placeholder="Enter your password"
                  required
                />
              </div>
              <div class="flex items-center justify-between">
                <div class="flex items-center">
                  <input
                    v-model="rememberMe"
                    id="remember_me"
                    name="remember_me"
                    type="checkbox"
                    class="h-4 w-4 bg-blue-500 focus:ring-blue-400 border-gray-300 rounded"
                  />
                  <label for="remember_me" class="ml-2 block text-sm text-gray-800">
                    Recordar mi cuenta.
                  </label>
                </div>
                <div class="text-sm text-center mt-4">
                  <router-link to="/forgot-password" class="text-blue-500 hover:underline">
                    ¿Olvidaste tu contraseña?
                  </router-link>
                </div>
              </div>
              <div>
                <button
                  type="submit"
                  class="w-full flex justify-center bg-blue-400 hover:bg-blue-500 text-gray-100 p-3 rounded-full tracking-wide font-semibold shadow-lg cursor-pointer transition ease-in duration-500"
                >
                  Loguearse
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuth } from '../composables/useAuth';
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import logo from '@/assets/images/logo.jpg';
import backgroundImage from '@/assets/images/portada.jpg';

const { login } = useAuth();
const router = useRouter();
const toast = useToast();
const email = ref('escribaniacosenza@gmail.com');
const password = ref('123456');
const rememberMe = ref(false);

const handleLogin = async () => {
  const success = await login(email.value, password.value);
  if (success) {
    if (rememberMe.value) {
      // Guardar email y password en localStorage
      localStorage.setItem('remember_email', email.value);
      localStorage.setItem('remember_password', password.value);
    } else {
      // Limpiar datos si "recordar cuenta" no está seleccionado
      localStorage.removeItem('remember_email');
      localStorage.removeItem('remember_password');
    }
    router.replace('/');
  } else {
    toast.error('Login failed!');
  }
};

onMounted(() => {
  const savedEmail = localStorage.getItem('remember_email');
  const savedPassword = localStorage.getItem('remember_password');
  if (savedEmail && savedPassword) {
    email.value = savedEmail;
    password.value = savedPassword;
    rememberMe.value = true;
  }
});
</script>
