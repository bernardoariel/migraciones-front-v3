<template>
  <FormAcompaneante :acompaneante="acompaneante" :buttons="buttons" />
</template>

<script setup lang="ts">
import FormAcompaneante from '@/modules/migraciones/acompaneantes/components/FormAcompaneante.vue';
import { useRoute } from 'vue-router';

const { params } = useRoute();
const acompaneante = +params.id ? +params.id : null;
interface ButtonConfig {
  label: string;
  type?: 'button' | 'submit' | 'reset';
  class?: string;
  disabled?: boolean;
  position?: 'left' | 'right' | 'center';
  action: () => void;
}
const buttons: ButtonConfig[] = [
  {
    label: 'Guardar Autorizante',
    type: 'submit',
    class: 'btn btn-primary',
    action: () => console.log('Guardar Autorizante'),
    position: 'left',
  },
  {
    label: 'Limpiar',
    type: 'button',
    class: 'btn btn-secondary',
    action: () => console.log('Limpiar Autorizante'),
    position: 'right',
  },
];
</script>
