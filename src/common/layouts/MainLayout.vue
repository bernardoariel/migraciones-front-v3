<template>
  <NavBar class="bg-gray-100 flex-none" />
  <div>
    <RouterView :key="route.fullPath" />
  </div>
</template>

<script setup lang="ts">
import NavBar from '../components/NavBar.vue';
import { useRoute } from 'vue-router';
const route = useRoute();
</script>

<style scoped></style>
