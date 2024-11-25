<template>
  <FormAcompaneante :acompaneante="acompaneante" />
</template>

<script setup lang="ts">
import FormAcompaneante from '@/modules/migraciones/acompaneantes/components/FormAcompaneante.vue';
import { useRoute } from 'vue-router';

const { params } = useRoute();
const acompaneante = +params.id ? +params.id : null;
</script>
