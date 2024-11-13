<template>
  <div>
    <label class="input input-bordered flex items-center gap-2">
      <span>{{ label }}</span>
      <input
        :type="type"
        :value="modelValue"
        @input="$emit('update:modelValue', ($event.target as HTMLInputElement)?.value ?? '')"
        @blur="$emit('blur')"
        @change="$emit('change', ($event.target as HTMLInputElement)?.value)"
        :class="[
          'grow',
          {
            'border-red-500': error,
          },
        ]"
        :placeholder="placeholder"
      />
    </label>
  </div>

  <span class="text-red-400" v-if="error">{{ error }}</span>
</template>

<script setup lang="ts">
interface Props {
  label?: string;
  placeholder?: string;
  modelValue?: string | number;
  type?: 'text' | 'number';
  error?: string;
  modelModifiers?: Record<string, boolean>;
}
withDefaults(defineProps<Props>(), {
  type: 'text',
});

defineEmits(['update:modelValue', 'blur', 'input', 'change']);
</script>

<style scoped></style>
