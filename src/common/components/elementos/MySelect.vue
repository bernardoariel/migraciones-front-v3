<template>
  <div>
    <select
      :value="modelValue || ''"
      @input="onInput"
      @blur="$emit('blur')"
      :class="[
        'select',
        'select-bordered',
        'w-full',
        {
          'border-red-500': error,
        },
      ]"
    >
      <option disabled value="">{{label}}</option>
      <!-- Renderizamos dinámicamente las opciones -->
      <option v-for="option in options" :key="option.value" :value="option.value">
        {{ option.label }}
      </option>
    </select>
    <span class="text-red-400" v-if="error">{{ error }}</span>
  </div>
</template>

<script setup lang="ts">
interface Props {
  label?: string;
  modelValue?: string | null; // Cambiado a `string` para que coincida con el tipo de las opciones
  error?: string;
  options: { label: string; value: string }[]; // Cambiado el tipo de `value` a `string`
}

const props = defineProps<Props>();
const emit = defineEmits(['update:modelValue', 'blur', 'input', 'change']);

function onInput(event: Event) {
  const value = (event.target as HTMLSelectElement).value; // Usar el valor como string
  emit('update:modelValue', value); // No convertimos a número
}
</script>
