<template>
  <div class="flex flex-col h-full">
    <NavBar class="bg-gray-100 flex-none" />
    <MainLayout class="bg-gray-100 flex-auto" />
  </div>
  <VueQueryDevtools />
</template>

<script setup lang="ts">
import { VueQueryDevtools } from '@tanstack/vue-query-devtools';
import NavBar from './common/components/NavBar.vue';
import MainLayout from './common/layouts/MainLayout.vue';
</script>

<style scoped></style>
