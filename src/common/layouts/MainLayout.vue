<template>
  <NavBar class="bg-gray-100 flex-none" />
  <div>
    <RouterView />
  </div>
</template>

<script setup lang="ts">
import NavBar from '../components/NavBar.vue';
</script>

<style scoped></style>
