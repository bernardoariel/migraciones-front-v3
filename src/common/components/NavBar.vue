<template>
  <div class="navbar border-b border-gray-200 shadow-sm bg-white">
    <div class="flex-1 align-center">
      <router-link
        v-if="isButtonVisible"
        :to="{ name: 'Home' }"
        class="inline-flex items-center justify-center p-1 rounded-box hover:bg-gray-200 transition duration-200 ease-in-out"
      >
        <BackIcon />
      </router-link>
      <div class="text-3xl ml-5 font-semibold">
        MIGRACIONES <span v-if="title" class="font-medium"> - {{ title }}</span>
      </div>
    </div>

    <div class="flex-none">
      <!-- Dropdown de escribanos -->
      <div class="form-control w-full max-w-xs mr-5">
        <label class="label">
          <span class="label-text">Selecciona un escribano</span>
        </label>
        <select class="select select-bordered" v-model="selectedNotario">
          <option disabled value="">Seleccione un escribano</option>
          <option v-for="notario in notarios" :key="notario.id!" :value="notario.id">
            {{ notario.nombre }}
          </option>
        </select>
      </div>
      <div class="text-xl mr-5 uppercase text-gray-500">{{ userStore.fullName }}</div>
      <div class="dropdown dropdown-bottom dropdown-end">
        <div tabindex="0" role="button" class="btn btn-sm rounded-box m-1">
          <ElipsisIcon />
        </div>
        <ul
          tabindex="0"
          class="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
        >
          <li><a>Editar Perfil</a></li>
          <li><a @click="handleLogout()">Logout</a></li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { watch, ref, watchEffect } from 'vue';
import { useAuth } from '../../auth/composables/useAuth';
import { useUserStore } from '../stores/userStore';
import BackIcon from './iconos/BackIcon.vue';
import ElipsisIcon from './iconos/ElipsisIcon.vue';
import useNotarios from '@/notarios/composables/useNotarios';

const route = useRoute();
const router = useRouter();
const { logout } = useAuth();
const userStore = useUserStore();
const { notarios } = useNotarios();
const title = ref('');
const isButtonVisible = ref<boolean>(false);
const selectedNotario = ref<string | null>(null);
const handleLogout = () => {
  logout();
  router.replace('/login');
};

watchEffect(() => {
  const newValue = route.meta.title;
  isButtonVisible.value = newValue !== 'Home';
  title.value = (newValue as string) || '';
});
// Observa los cambios en `selectedNotario` si necesitas realizar alguna acción
watch(selectedNotario, (newValue) => {
  if (newValue) {
    const selectedNotarioData = notarios.value.find((notario) => notario.id === Number(newValue));
    if (selectedNotarioData) {
      const userPayload = {
        id: selectedNotarioData.id,
        nombre: selectedNotarioData.nombre,
        apellido: selectedNotarioData.apellido,
        matricula: selectedNotarioData.matricula,
      };

      userStore.setUser(userPayload);
    }
  }
});
</script>

<style scoped></style>
