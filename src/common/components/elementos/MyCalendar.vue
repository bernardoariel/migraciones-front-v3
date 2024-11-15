<template>
    <div class="relative">
      <!-- Label para el input -->
      <!-- <label for="calendar" class="input input-bordered flex items-center gap-2">
        <span>{{ label }}</span>
      -->
  
      <!-- Input del calendario -->
      <input
        type="text"
        id="calendar"
        class="input input-bordered w-full max-w-xs mt-2"
        :placeholder="placeholder"
        v-model="selectedDate"
      />
    <!-- </label> -->
    </div>
  </template>
  
  <script setup lang="ts">
  import Litepicker from 'litepicker';
  import { ref, defineProps, defineEmits, onMounted } from 'vue';
  
  
  interface Props {
    label: string;
    placeholder: string;
  }

  const props = defineProps<Props>();
  
  const emit = defineEmits(['update:modelValue']);
  const selectedDate = ref('');
  
  onMounted(() => {
    new Litepicker({
      element: document.getElementById('calendar'),
      singleMode: true,
      format: 'DD-MM-YY',
      dropdowns: {
        minYear: 1900,
        maxYear: new Date().getFullYear(),
        months: true,
        years: true,
      },
      onSelect: (date) => {
        selectedDate.value = date.format('DD-MM-YY'); 
        emit('update:modelValue', selectedDate.value); 
      }
    });
  });
  </script>
  
  <style scoped>
  /* Personalización adicional si es necesario */
  </style>
  