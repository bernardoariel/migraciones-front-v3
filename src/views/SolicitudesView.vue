<template>
  <p v-if="isLoading">Cargando Órdenes...</p>

  <ul v-else-if="orders.length">
    <li v-for="(order, index) in orders" :key="index" class="mb-4">
      <p><strong>Nombre:</strong> {{ order.numero_actuacion_notarial_cert_firma }}</p>
      <p><strong>Estado:</strong> {{ order.fecha_del_instrumento }}</p>
      <hr />
    </li>
  </ul>

  <p v-else>No se encontraron órdenes.</p>
</template>

<script setup lang="ts">
import useOrdenes from '@/common/composables/useOrdenes';

const { isLoading, orders } = useOrdenes();
</script>
