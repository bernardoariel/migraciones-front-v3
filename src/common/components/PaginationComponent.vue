<template>
  <div class="pagination-container flex justify-center mt-4">
    <div v-if="totalPages > 0" class="join">
      <input
        v-for="page in totalPages"
        :key="page"
        class="join-item btn btn-square"
        type="radio"
        name="pagination"
        :aria-label="`${page}`"
        :checked="page === currentPage"
        @change="() => goToPage(page)"
      />
    </div>
    <p v-else class="text-gray-500">No hay más páginas</p>
  </div>
</template>

<script setup lang="ts">
interface Props {
  totalPages: number;
  currentPage: number;
  goToPage: (page: number) => void;
}

const props = defineProps<Props>();
console.log('PAGINACION props::: ', props);
</script>
