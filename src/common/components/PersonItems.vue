<template>
  <div class="entry-container mb-3 pointer p-2">
    <!-- titulo -->
    <div class="entry-title d-flex">
      <span class="text-success fs-5 fw-bold">22</span>
      <span class="mx-1 fs-5">est</span>
      <span class="mx-2 fw-light">dni</span>
    </div>

    <div class="entry-description">Esto es un texto que podemos poner</div>
  </div>
</template>

<script setup lang="ts"></script>
<style scoped>
.entry-container {
  border-bottom: 1px solid #2c3e50;
  transition: 0.2s all ease-in;

  .entry-description {
    font-size: 12px;
  }
}
</style>
