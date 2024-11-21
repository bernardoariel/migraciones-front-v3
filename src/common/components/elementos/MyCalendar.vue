<template>
  <div class="relative">
    <!-- Input del calendario -->
    <input
      type="text"
      id="calendar"
      class="input input-bordered w-full max-w-xs mt-2"
      :placeholder="props.placeholder"
      v-model="modelValueDisplay" 
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import Litepicker from 'litepicker';
import type { ILPConfiguration } from 'litepicker/dist/types/interfaces';

interface Props {
  modelValue?: string | null;  // La fecha o null
  placeholder?: string;        // El placeholder opcional
}

const props = defineProps<Props>();
interface CustomLitepickerConfig extends ILPConfiguration {
  onSelect?: (date: Date | null) => void;
}

const emit = defineEmits(['update:modelValue']);
const modelValue = ref<string | null>(props.modelValue || null);
const modelValueDisplay = ref<string | null>(null);

// Convertir la fecha a formato 'DD-MM-YYYY' para mostrarla en el input
const formatDateToDisplay = (date: string) => {
  const dateObj = new Date(date);
  const day = String(dateObj.getDate()).padStart(2, '0');
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const year = dateObj.getFullYear();
  return `${day}-${month}-${year}`;
};

// Si la fecha existe, mostrarla en formato 'DD-MM-YYYY'
watch(() => props.modelValue, (newValue) => {
  if (newValue) {
    modelValueDisplay.value = formatDateToDisplay(newValue);  // Formateamos para mostrar
  } else {
    modelValueDisplay.value = null;  // Si no hay valor, mostramos vacío
  }
});

// Inicializamos el calendario cuando se monta el componente
onMounted(() => {
  const config: CustomLitepickerConfig = {
    element: document.getElementById('calendar') as HTMLElement,
    singleMode: true,
    format: 'DD-MM-YYYY',  // Mostramos la fecha en 'DD-MM-YYYY'
    dropdowns: {
      minYear: 1900,
      maxYear: new Date().getFullYear(),
      months: true,
      years: true,
    },
    onSelect: (date: Date | null) => {
      if (date) {
        // Convertimos la fecha al formato 'YYYY-MM-DD' para guardarlo
        const formattedDate = date.toISOString().split('T')[0];  // 'YYYY-MM-DD'
        modelValue.value = formattedDate;
        modelValueDisplay.value = formatDateToDisplay(formattedDate);  // Mostramos en 'DD-MM-YYYY'
        emit('update:modelValue', modelValue.value);  // Emitimos la fecha formateada
      } else {
        modelValue.value = null;  // Si no se selecciona una fecha
        modelValueDisplay.value = null;
        emit('update:modelValue', modelValue.value);  // Emitimos null
      }
    },
  };

  new Litepicker(config);
});
</script>

<style scoped>
/* Personalización adicional si es necesario */
</style>
