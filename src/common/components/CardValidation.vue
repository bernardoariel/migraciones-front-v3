<template>
  <div>
    <!-- Tarjeta de Menor -->
    <div :class="`w-full mb-2 select-none p-4 font-medium ${menorClass}`">
      <div class="flex justify-between items-center">
        <div class="avatar-group -space-x-6 rtl:space-x-reverse">
          <div v-if="ordenStore.menor" class="avatar">
            <div class="w-8">
              <img
                src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
              />
            </div>
          </div>

          <div class="avatar placeholder">
            <div class="bg-neutral text-neutral-content w-8">
              <span>{{ ordenStore.menor ? '1' : '0' }}</span>
            </div>
          </div>
        </div>
        <div>
          <button class="btn glass btn-xs" @click="personStore.resetState('menores')">
            + Menores
          </button>
        </div>
      </div>
    </div>

    <!-- Tarjeta de Autorizantes -->
    <div :class="`w-full mb-2 select-none p-4 font-medium ${autorizantesClass}`">
      <div class="flex justify-between items-center">
        <div class="avatar-group -space-x-6 rtl:space-x-reverse">
          <div v-for="index in ordenStore.autorizantes.length" :key="index" class="avatar">
            <div class="w-8">
              <img
                src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
              />
            </div>
          </div>

          <div class="avatar placeholder">
            <div class="bg-neutral text-neutral-content w-8">
              <span>{{ ordenStore.autorizantes.length }}</span>
            </div>
          </div>
        </div>
        <div>
          <button class="btn glass btn-xs" @click="personStore.resetState('autorizantes')">
            + Autorizante
          </button>
        </div>
      </div>
    </div>

    <!-- Tarjeta de Acompañantes -->
    <div :class="`w-full mb-2 select-none p-4 font-medium ${acompaneantesClass}`">
      <div class="flex justify-between items-center">
        <div class="avatar-group -space-x-6 rtl:space-x-reverse">
          <div v-for="index in ordenStore.acompaneantes.length" :key="index" class="avatar">
            <div class="w-8">
              <img
                src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
              />
            </div>
          </div>

          <div class="avatar placeholder">
            <div class="bg-neutral text-neutral-content w-8">
              <span>{{ ordenStore.acompaneantes.length }}</span>
            </div>
          </div>
        </div>
        <div>
          <button class="btn glass btn-xs" @click="personStore.resetState('acompaneantes')">
            + Acompañante
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useOrdenStore } from '../store/ordenStore';
import { usePersonStore } from '../store/personStore';

const ordenStore = useOrdenStore();
const personStore = usePersonStore();

// Computed para determinar las clases
const menorClass = computed(() => {
  if (!ordenStore.menor) {
    return 'border-red-400 bg-red-100 hover:border-red-500';
  } else {
    return 'border-blue-400 bg-blue-100 hover:border-blue-500';
  }
});

const autorizantesClass = computed(() => {
  const count = ordenStore.autorizantes.length;
  if (count === 0) {
    return 'border-red-400 bg-red-100 hover:border-red-500';
  } else if (count === 1) {
    return 'border-yellow-400 bg-yellow-100 hover:border-yellow-500';
  } else {
    return 'border-blue-400 bg-blue-100 hover:border-blue-500';
  }
});

const acompaneantesClass = computed(() => {
  const count = ordenStore.acompaneantes.length;
  if (count >= 1) {
    return 'border-blue-400 bg-blue-100 hover:border-blue-500';
  } else {
    return 'border-red-400 bg-red-100 hover:border-red-500';
  }
});
</script>
