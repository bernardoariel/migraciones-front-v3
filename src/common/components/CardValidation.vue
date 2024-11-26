<template>
  <div
    class="w-full mb-2 select-none border-l-4 border-red-400 bg-red-100 p-4 font-medium hover:border-red-500"
  >
    <div class="flex justify-between items-center">
      <div class="avatar-group -space-x-6 rtl:space-x-reverse">
        <div class="avatar placeholder">
          <div class="bg-neutral text-neutral-content w-8">
            <span>?</span>
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
  <div
    class="w-full mb-2 select-none border-l-4 border-yellow-400 bg-yellow-100 p-4 font-medium hover:border-yellow-500"
  >
    <div class="flex justify-between items-center">
      <div class="avatar-group -space-x-6 rtl:space-x-reverse">
        <div class="avatar">
          <div class="w-8">
            <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
          </div>
        </div>

        <div class="avatar placeholder">
          <div class="bg-neutral text-neutral-content w-8">
            <span>2</span>
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
  <div
    class="w-full mb-2 select-none border-l-4 border-blue-400 bg-blue-100 p-4 font-medium hover:border-blue-500"
  >
    <div class="flex justify-between items-center">
      <div class="avatar-group -space-x-6 rtl:space-x-reverse">
        <div class="avatar">
          <div class="w-8">
            <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
          </div>
        </div>
        <div class="avatar">
          <div class="w-8">
            <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
          </div>
        </div>

        <div class="avatar placeholder">
          <div class="bg-neutral text-neutral-content w-8">
            <span>2</span>
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
</template>

<script setup lang="ts">
import { usePersonStore } from '../store/personStore';

const personStore = usePersonStore();
</script>

<style scoped></style>
