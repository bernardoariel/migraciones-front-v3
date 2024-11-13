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
      <option disabled value="">Seleccione una Opción</option>
      <option :value="4">DOCUMENTO NACIONAL DE IDENTIDAD</option>
      <option :value="5">PASAPORTE</option>
    </select>
    <span class="text-red-400" v-if="error">{{ error }}</span>
  </div>
</template>

<script setup lang="ts">
interface Props {
  label?: string;
  modelValue?: number | null; // Cambiado a `number`
  error?: string;
}

const props = defineProps<Props>();
const emit = defineEmits(['update:modelValue', 'blur', 'input', 'change']);

function onInput(event: Event) {
  const value = Number((event.target as HTMLSelectElement).value);
  emit('update:modelValue', value); // Envía el valor como número
}
</script>
