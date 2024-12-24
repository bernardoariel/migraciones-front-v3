<template>
  <div class="flex flex-col h-full">
    <RouterView />
  </div>
  <VueQueryDevtools />
</template>

<script setup lang="ts">
import { VueQueryDevtools } from '@tanstack/vue-query-devtools';
</script>

<style scoped></style>
