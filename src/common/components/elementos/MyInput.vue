<template>
  <div class="flex flex-col gap-1 w-full">
    <label class="text-sm font-medium text-gray-700">{{ label }}</label>
    <input
      :type="type"
      :value="modelValue"
      :disabled="disabled"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement)?.value ?? '')"
      @blur="$emit('blur')"
      @change="$emit('change', ($event.target as HTMLInputElement)?.value)"
      :class="[
        'input input-bordered w-full',
        {
          'border-red-500 focus:ring-red-500': error,
          'focus:ring-blue-500': !error,
        },
      ]"
      :placeholder="placeholder"
    />
    <span class="text-red-400 text-sm" v-if="error">{{ error }}</span>
  </div>
</template>

<script setup lang="ts">
interface Props {
  label?: string;
  placeholder?: string;
  modelValue?: string | number;
  type?: 'text' | 'number' | 'email' | 'password';
  error?: string;
  disabled?: boolean;
}
withDefaults(defineProps<Props>(), {
  type: 'text',
  disabled: false,
});

defineEmits(['update:modelValue', 'blur', 'input', 'change']);
</script>

<style scoped></style>
