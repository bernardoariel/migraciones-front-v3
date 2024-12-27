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
import { watch, ref } from 'vue';
import { useAuth } from '../../auth/composables/useAuth';
import { useUserStore } from '../stores/userStore';
import BackIcon from './iconos/BackIcon.vue';
import ElipsisIcon from './iconos/ElipsisIcon.vue';

const route = useRoute();
const router = useRouter();
const { logout } = useAuth();
const userStore = useUserStore();

const title = ref('');
const isButtonVisible = ref<boolean>(false);
const handleLogout = () => {
  logout();
  router.replace('/login');
};

watch(
  () => route.meta.title,
  (newValue) => {
    newValue === 'Home' ? (isButtonVisible.value = false) : (isButtonVisible.value = true);
    title.value = (newValue as string) || '';
  },
);
</script>

<style scoped></style>
