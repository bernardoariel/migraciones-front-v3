<template>
  <div class="indicator">
    <span class="indicator-item badge badge-secondary">{{ categoryPersons }}</span>
    <ul class="menu menu-horizontal menu-xs bg-base-200 rounded-box">
      <li>
        <a
          class="ml-1"
          :class="{ active: activeCategory === 'acompaneantes' }"
          @click="personStore.resetState('acompaneantes')"
        >
          Acompañantes
        </a>
      </li>
      <li>
        <a
          class="ml-1"
          :class="{ active: activeCategory === 'menores' }"
          @click="personStore.resetState('menores')"
        >
          Menores
        </a>
      </li>
      <li>
        <a
          class="ml-1"
          :class="{ active: activeCategory === 'autorizantes' }"
          @click="personStore.resetState('autorizantes')"
        >
          Autorizantes
        </a>
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { usePersonStore } from '../store/personStore';
import usePersons from '@/migraciones/persons/composables/usePersons';
import type { CategoryPerson } from '../interfaces/category.interface';

const { acompaneantes, menores, autorizantes } = usePersons();
interface Props {
  typeCategory: CategoryPerson;
}
const props = defineProps<Props>();

const personStore = usePersonStore();
const { getActiveCategory } = storeToRefs(personStore);
const activeCategory = getActiveCategory;

const categoryPersons = computed(() => {
  switch (activeCategory.value) {
    case 'acompaneantes':
      return acompaneantes.value.length;
    case 'menores':
      return menores.value.length;
    case 'autorizantes':
      return autorizantes.value.length;
    default:
      return 0;
  }
});

if (props.typeCategory && props.typeCategory !== personStore.getActiveCategory) {
  personStore.resetState(props.typeCategory);
}
</script>
