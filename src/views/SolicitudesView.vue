<template>
  <div>ORDENES</div>
</template>

<script setup lang="ts">
import useOrdenes from '@/common/composables/useOrdenes';

const { orders } = useOrdenes();
console.log('orders::: ', orders.value);
</script>

<style scoped></style>
