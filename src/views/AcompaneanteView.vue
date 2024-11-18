<template>
  <FormAcompaneante :acompanenante="params.id" />
</template>

<script setup lang="ts">
import FormAcompaneante from '@/modules/migraciones/acompaneantes/components/FormAcompaneante.vue';
import { useRoute } from 'vue-router';

const { params } = useRoute();
</script>
