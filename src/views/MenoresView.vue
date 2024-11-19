<template>
  <FormMenor :menor="menor"/>
</template>

<script setup lang="ts">
import FormMenor from '@/modules/migraciones/menores/components/FormMenor.vue';
import { useRoute } from 'vue-router';

const { params } = useRoute();
const menor = +params.id ? +params.id : null;
</script>
