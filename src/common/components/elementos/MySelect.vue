<template>
  <div>
    <select
      :value="modelValue || 'Seleccione una Opción'"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement)?.value ?? '')"
      @blur="$emit('blur')"
      @change="$emit('change', ($event.target as HTMLInputElement)?.value)"
      :class="[
        'select',
        'select-bordered',
        'w-full',
        {
          'border-red-500': error,
        },
      ]"
      :placeholder="placeholder"
    >
      <option selected>Seleccione una Opción</option>
      <option>DOCUMENTO NACIONAL DE IDENTIDAD</option>
      <option>PASAPORTE</option>
    </select>
    <span class="text-red-400" v-if="error">{{ error }}</span>
  </div>
</template>

<script setup lang="ts">
interface Props {
  label?: string;
  placeholder?: string;
  modelValue?: string | number;
  error?: string;
  modelModifiers?: Record<string, boolean>;
}
defineProps<Props>();

defineEmits(['update:modelValue', 'blur', 'input', 'change']);
</script>

<style scoped></style>
