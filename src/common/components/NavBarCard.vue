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
import { onMounted, ref, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { usePersonStore } from '../store/personStore';
import usePersons from '../composables/usePersons';
const { acompaneantes, menores, autorizantes } = usePersons();
interface Props {
  typeCategory?: string;
}
const props = defineProps<Props>();

const personStore = usePersonStore();
const { getActiveCategory } = storeToRefs(personStore);
const activeCategory = getActiveCategory;

const categoryPersons = ref(0);
const updateCategoryPersons = () => {
  switch (activeCategory.value) {
    case 'acompaneantes':
      categoryPersons.value = acompaneantes.value.length;
      break;
    case 'menores':
      categoryPersons.value = menores.value.length;
      break;
    case 'autorizantes':
      categoryPersons.value = autorizantes.value.length;
      break;
    default:
      categoryPersons.value = 0;
  }
};

watch(activeCategory, updateCategoryPersons);
onMounted(() => {
  updateCategoryPersons();
  if (!props.typeCategory) return;
  personStore.resetState(props.typeCategory);
});
</script>
