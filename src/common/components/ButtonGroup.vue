<template>
  <div v-if="buttons && buttons.length" class="flex justify-between mt-6">
    <!-- Botones alineados a la izquierda -->
    <div class="flex space-x-2" v-if="buttons.some((button) => button.position === 'left')">
      <button
        v-for="(button, index) in buttons.filter((button) => button.position === 'left')"
        :key="'left-' + index"
        :type="button.type || 'button'"
        :class="button.class"
        :disabled="button.disabled || false"
        @click="button.action"
      >
        {{ button.label }}
      </button>
    </div>

    <!-- Botones alineados al centro -->
    <div
      class="flex space-x-2 mx-auto"
      v-if="buttons.some((button) => button.position === 'center')"
    >
      <button
        v-for="(button, index) in buttons.filter((button) => button.position === 'center')"
        :key="'center-' + index"
        :type="button.type || 'button'"
        :class="button.class"
        :disabled="button.disabled || false"
        @click="button.action"
      >
        {{ button.label }}
      </button>
    </div>

    <!-- Botones alineados a la derecha -->
    <div
      class="flex space-x-2 ml-auto"
      v-if="buttons.some((button) => button.position === 'right')"
    >
      <button
        v-for="(button, index) in buttons.filter((button) => button.position === 'right')"
        :key="'right-' + index"
        :type="button.type || 'button'"
        :class="button.class"
        :disabled="button.disabled || false"
        @click="button.action"
      >
        {{ button.label }}
      </button>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { type PropType } from 'vue';

interface ButtonConfig {
  label: string;
  type?: 'button' | 'submit' | 'reset';
  class?: string;
  disabled?: boolean;
  position?: 'left' | 'right' | 'center';
  action: () => void;
}

defineProps({
  buttons: {
    type: Array as PropType<ButtonConfig[]>,
    required: true,
  },
});
</script>
