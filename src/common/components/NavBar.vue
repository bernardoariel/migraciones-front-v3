<template>
  <div class="navbar border-b border-gray-200 shadow-sm bg-white">
    <div class="flex-1 align-center">
      <router-link
        v-if="isButtonVisible"
        :to="{ name: 'Home' }"
        class="inline-flex items-center justify-center p-1 rounded-box hover:bg-gray-200 transition duration-200 ease-in-out"
      >
        <svg
          width="30"
          height="30"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
          <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
          <g id="SVGRepo_iconCarrier">
            <path
              d="M16 12H8M8 12L11 9M8 12L11 15"
              stroke="#1C274C"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            ></path>
            <path
              d="M7 3.33782C8.47087 2.48697 10.1786 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 10.1786 2.48697 8.47087 3.33782 7"
              stroke="#1C274C"
              stroke-width="1.5"
              stroke-linecap="round"
            ></path>
          </g>
        </svg>
      </router-link>
      <div class="text-3xl ml-5 font-semibold">
        MIGRACIONES - <span class="font-medium">{{ title }}</span>
      </div>
    </div>

    <div class="flex-none">
      <div class="text-xl mr-5 uppercase text-gray-500">{{ userStore.fullName }}</div>
      <div class="dropdown dropdown-bottom dropdown-end">
        <div tabindex="0" role="button" class="btn btn-sm rounded-box m-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            class="inline-block h-5 w-5 stroke-current"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
            ></path>
          </svg>
        </div>
        <ul
          tabindex="0"
          class="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
        >
          <li><a>Item 1</a></li>
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
