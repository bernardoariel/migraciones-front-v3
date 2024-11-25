<template>
  <div class="relative">
    <!-- Input del calendario -->
    <input
      type="text"
      id="calendar"
      class="input input-bordered w-full max-w-xs mt-2"
      :placeholder="props.placeholder"
      v-model="selectedDate"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import Litepicker from 'litepicker';
import type { ILPConfiguration } from 'litepicker/dist/types/interfaces';

interface Props {
  dateValue?: string | null;
  placeholder?: string;
}

const props = defineProps<Props>();
interface CustomLitepickerConfig extends ILPConfiguration {
  onSelect?: (date: Date | null) => void;
}

const emit = defineEmits(['update:modelValue']);
const selectedDate = ref<string | null>(props.dateValue || null);

onMounted(() => {
  const config: CustomLitepickerConfig = {
    element: document.getElementById('calendar') as HTMLElement,
    singleMode: true,
    format: 'DD-MM-YYYY',
    dropdowns: {
      minYear: 1900,
      maxYear: new Date().getFullYear(),
      months: true,
      years: true,
    },
    onSelect: (date: Date | null) => {
      if (date) {
        selectedDate.value = date.toLocaleDateString('es-ES', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        });
        emit('update:modelValue', selectedDate.value); // Emitimos el valor al padre
      } else {
        selectedDate.value = null; // En caso de que no se haya seleccionado fecha
        emit('update:modelValue', selectedDate.value); // Emitimos null al padre
      }
    },
  };

  new Litepicker(config);
});
</script>

<style scoped>
/* Personalización adicional si es necesario */
</style>
