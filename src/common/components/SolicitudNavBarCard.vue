<template>
    <div class="indicator">
      <span class="indicator-item badge badge-secondary">{{ categoryOrders }}</span>
      <ul class="menu menu-horizontal menu-xs bg-base-200 rounded-box">
        <li>
          <a
            class="ml-1"
            :class="{ active: activeCategory === 'todos' }"
     
          >
            Todos
          </a>
        </li>
        <li>
          <a
            class="ml-1"
            :class="{ active: activeCategory === 'pendientes' }"
        
          >
            Pendientes
          </a>
        </li>
        <li>
          <a
            class="ml-1"
            :class="{ active: activeCategory === 'autorizados' }"
       
          >
            Autorizados
          </a>
        </li>
      </ul>
    </div>
  </template>
  
  <script lang="ts" setup>
  import { onMounted, ref, watch, computed } from 'vue';
  import { storeToRefs } from 'pinia';
  import { useOrdersStore } from '../store/ordersStore';
  import { useOrdenStore } from '../store/ordenStore';
  import useOrdenes from '../composables/useOrdenes';
  
  const { pendingOrders, authorizedOrders, allOrders } = useOrdenes();
  interface Props {
    typeCategory?: string;
  }
  const props = defineProps<Props>();
  
  const ordersStore = useOrdersStore();
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
  
  // Ensure state is updated properly when typeCategory is passed as a prop
  if (props.typeCategory) {
    //  
  }
  </script>
  