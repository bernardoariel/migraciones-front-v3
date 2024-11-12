<template>
  <select
    class="select select-bordered w-full"
    v-model="selectedOption"
    @change="emitSelectedOption"
  >
    <option v-for="option in options" :key="option" :value="option">
      {{ option }}
    </option>
  </select>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, ref, watch, onMounted } from 'vue';

const props = defineProps({
  label: {
    type: String,
    default: '',
  },
  options: {
    type: Array as () => string[],
    required: true,
  },
  modelValue: {
    type: String,
    default: '',
  },
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();

const selectedOption = ref(props.modelValue);

const emitSelectedOption = () => {
  emit('update:modelValue', selectedOption.value);
};

onMounted(() => {
  if (!props.modelValue && props.options.length > 0) {
    selectedOption.value = props.options[0];
    emit('update:modelValue', selectedOption.value);
  }
});

watch(
  () => props.modelValue,
  (newValue) => {
    selectedOption.value = newValue;
  },
);
</script>

<style scoped></style>
