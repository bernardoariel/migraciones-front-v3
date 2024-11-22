<template>
  <div class="person-item">
    <h3>{{ person.name }}</h3>
    <button class="btn btn-primary" @click="$emit('edit-person', person.id)">
      {{ nameButton || 'Editar' }}
    </button>
  </div>
</template>

<script setup lang="ts">
// Define la interfaz de persona
interface Person {
  id: number;
  name: string;
  category: 'menores' | 'acompaneantes' | 'autorizantes';
}

// Props que recibe el componente
defineProps<{
  person: Person; // Objeto de tipo Person
  nameButton?: string; // Texto opcional para el botón
}>();

// Eventos que emite el componente
defineEmits(['edit-person']);
</script>

<style scoped>
.person-item {
  padding: 10px;
  border-bottom: 1px solid #ddd;
}
</style>
