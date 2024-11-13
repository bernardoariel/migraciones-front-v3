<template>
  <div>
    <label class="input input-bordered flex items-center gap-2">
      <span>{{ label }}</span>
      <textarea
        :type="type"
        :value="modelValue"
        @input="$emit('update:modelValue', ($event.target as HTMLTextAreaElement)?.value ?? '')"
        @blur="$emit('blur')"
        :class="[
          'textarea',
          'textarea-bordered',
          {
            'border-red-500': error,
          },
        ]"
        :placeholder="placeholder"
      ></textarea>
    </label>
  </div>

  <span class="text-red-400" v-if="error">{{ error }}</span>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

interface Props {
  label?: string;
  placeholder?: string;
  modelValue?: string | number;
  type?: 'text' | 'number';
  error?: string;
}
const props = withDefaults(defineProps<Props>(), {
  label: '',
  placeholder: '',
  modelValue: '',
  type: 'text',
  error: '',
});

defineEmits(['update:modelValue', 'blur']);

const inputValue = ref(props.modelValue);
</script>

<style scoped></style>
