<template>
  <div class="entry-list-container">
    <div class="px-2 pt-2">
      <label class="input input-bordered flex items-center gap-2 input-primary">
        <input type="text" class="grow" placeholder="Buscar" />
        <kbd class="kbd kbd-sm">ctrl</kbd>
        <kbd class="kbd kbd-sm">alt</kbd>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          fill="currentColor"
          class="h-4 w-4 opacity-70"
        >
          <path
            fill-rule="evenodd"
            d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
            clip-rule="evenodd"
          />
        </svg>
      </label>
    </div>
  </div>
  <div class="entry-scrollarea">
    <PersonItems v-for="acompaneante in acompaneantes" :key="acompaneante.id" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import PersonItems from './PersonItems.vue';
import usePerson from '../composables/usePerson';
import type { Acompaneante } from '@/modules/migraciones/acompaneantes/interfaces/acompaneante.interface';
import { onMounted } from 'vue';
const { fetchAllPerson } = usePerson();
const acompaneantes = ref<Acompaneante[]>([]);
onMounted(async () => {
  const data = await fetchAllPerson();
  if (data) {
    //TODO aca habrá que hacer un filtrado en caso de utilizar para los persons

    acompaneantes.value = data;
  }
});
</script>

<style scoped>
.entry-list-container {
  border-right: 1px solid #2c3e50;
  height: 80px;
}
.entry-scrollarea {
  height: calc(100vh - 115px);
  overflow: scroll;
}
</style>
