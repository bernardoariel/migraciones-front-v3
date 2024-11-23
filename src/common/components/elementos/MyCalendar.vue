<template>
  <VueDatePicker v-model="date" :format="format" />
</template>

<script setup lang="ts">
import { ref, watch  } from 'vue';
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'

const date = ref(null);  // Este es el valor que se enviará al padre y a la base de datos
const emit = defineEmits(['update:modelValue']);
// Función para convertir la fecha en formato de visualización: día/mes/año
const format = (date: Date | string) => {
  if (!date) return '';
  const dateObj = new Date(date);
  const day = String(dateObj.getDate()).padStart(2, '0');
  const month = String(dateObj.getMonth() + 1).padStart(2, '0'); // Mes empieza en 0
  const year = dateObj.getFullYear();
  return `${day}/${month}/${year}`;
};

// Verificar y emitir el valor correcto
watch(date, (newDate) => {
  if (newDate) {
    const formattedDate = new Date(newDate).toISOString().split('T')[0];  // Guardar la fecha como YYYY-MM-DD
    emit('update:modelValue', formattedDate);  // Emitir el valor formateado para la base de datos
  }
});
</script>
