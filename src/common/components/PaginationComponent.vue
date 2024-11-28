<template>
  <div class="pagination-container flex justify-center mt-4">
    <div class="join">
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
  </div>
</template>

<script setup lang="ts">
interface Props {
  totalPages: number;
  currentPage: number;
  goToPage: (page: number) => void;
}

defineProps<Props>();
</script>
