<template>
  <FormAutorizante :autorizante="autorizante"/>
</template>

<script setup lang="ts">
import FormAutorizante from '@/modules/migraciones/autorizantes/components/FormAutorizante.vue';
import { useRoute } from 'vue-router';

const { params } = useRoute();
const autorizante = +params.id ? +params.id : null;
</script>
