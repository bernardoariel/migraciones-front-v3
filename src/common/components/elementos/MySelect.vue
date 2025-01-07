<template>
  <div class="flex flex-col gap-1">
    <label class="text-sm font-medium text-gray-700">{{ label }}</label>
    <select
      :value="modelValue || ''"
      @input="onInput"
      @blur="$emit('blur')"
      :class="[
        'select select-bordered w-full',
        {
          'border-red-500 focus:ring-red-500': error,
          'focus:ring-blue-500': !error,
        },
      ]"
    >
      <option disabled value="">{{ placeholder }}</option>
      <option v-for="option in options" :key="option.value" :value="option.value">
        {{ option.label }}
      </option>
    </select>
    <span class="text-red-400 text-sm" v-if="error">{{ error }}</span>
  </div>
</template>

<script setup lang="ts">
interface Option {
  label: string;
  value: string | number;
}

interface Props {
  label?: string;
  placeholder?: string;
  modelValue?: string | null | number;
  error?: string;
  options?: Option[];
}

defineProps<Props>();

const emit = defineEmits(['update:modelValue', 'blur', 'input', 'change']);

function onInput(event: Event) {
  const value = (event.target as HTMLSelectElement).value;
  emit('update:modelValue', value);
}
</script>
