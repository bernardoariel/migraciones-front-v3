<template>
  <VueDatePicker 
    v-model="date" 
    :format="format"
    :enable-time-picker="false" 
    auto-apply
    locale="es"
   />
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';

const date = ref(null);  // Este es el valor que se enviará al padre y a la base de datos
const emit = defineEmits(['update:modelValue']);

// Función para convertir la fecha en formato de visualización: día/mes/año
const format = (date: Date | string) => {
  if (!date) return '';
  const dateObj = new Date(date);
  const day = String(dateObj.getDate() +1).padStart(2, '0');
  const month = String(dateObj.getMonth() + 1).padStart(2, '0'); // Mes empieza en 0
  const year = dateObj.getFullYear();
  return `${day}/${month}/${year}`;
};
// const format = 'dd/MM/yyyy'
// Verificar y emitir el valor correcto usando el valor local de la fecha
watch(date, (newDate) => {
  if (newDate) {
    const dateObj = new Date(newDate);

    // Aseguramos que estamos usando el formato sin zona horaria (YYYY-MM-DD)
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');  // Mes empieza desde 0
    const day = String(dateObj.getDate()).padStart(2, '0');  // Día

    const formattedDate = `${year}-${month}-${day}`;  // Formato YYYY-MM-DD
    emit('update:modelValue', formattedDate);  // Emitir la fecha sin cambio de zona horaria
  }
});
</script>
