<template>
  <div class="indicator">
    <span class="indicator-item badge badge-secondary">{{ categoryOrders }}</span>
    <ul class="menu menu-horizontal menu-xs bg-base-200 rounded-box">
      <li>
        <a
          class="ml-1"
          :class="{ active: activeCategory === 'todos' }"
          @click="ordenStore.resetState('todos')"
        >
          Todos
        </a>
      </li>
      <li>
        <a
          class="ml-1"
          :class="{ active: activeCategory === 'pendientes' }"
          @click="ordenStore.resetState('pendientes')"
        >
          Pendientes
        </a>
      </li>
      <li>
        <a
          class="ml-1"
          :class="{ active: activeCategory === 'autorizados' }"
          @click="ordenStore.resetState('autorizados')"
        >
          Autorizados
        </a>
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { storeToRefs } from 'pinia';

import useOrdenes from '../composables/useOrdenes';
import { useOrdenStore } from '../store/ordenStore';

const { pendingOrders, authorizedOrders, allOrders } = useOrdenes();
interface Props {
  typeCategory?: string;
}
const props = defineProps<Props>();

const ordenStore = useOrdenStore();
const { getActiveCategory } = storeToRefs(ordenStore);
const activeCategory = getActiveCategory;

const categoryOrders = computed(() => {
  switch (activeCategory.value) {
    case 'pendientes':
      return pendingOrders.value.length;
    case 'autorizados':
      return authorizedOrders.value.length;
    case 'todos':
      return allOrders.value.length;
    default:
      return 0;
  }
});

if (props.typeCategory) {
  ordenStore.resetState(props.typeCategory);
}
</script>
