<template>
  <label class="input input-bordered flex items-center gap-2">
    <span>{{ label }}</span>
    <input
      :type="type"
      class="grow"
      :placeholder="placeholder"
      v-model="inputValue"
      @input="emitValue"
    />
  </label>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, ref, watch } from 'vue';

const props = defineProps({
  label: {
    type: String,
    default: '',
  },
  placeholder: {
    type: String,
    default: '',
  },
  modelValue: {
    type: [String, Number],
    default: '',
  },
  type: {
    type: String,
    default: 'text',
  },
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number): void;
}>();

const inputValue = ref(props.modelValue);

const emitValue = () => {
  let emittedValue = inputValue.value;
  if (props.type === 'number') {
    emittedValue = Number(inputValue.value);
  }
  emit('update:modelValue', emittedValue);
};

watch(
  () => props.modelValue,
  (newValue) => {
    inputValue.value = newValue;
  },
);
</script>

<style scoped></style>
