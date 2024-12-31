<template>
  <dialog ref="modal" class="modal">
    <div class="modal-box">
      <h3 class="text-lg font-bold">{{ title }}</h3>
      <p class="py-4">{{ message }}</p>
      <div class="modal-action">
        <!-- Si no hay slots, mostrar botones predeterminados -->
        <slot name="buttons">
          <button class="btn" @click="onConfirm">Eliminar</button>
          <button class="btn btn-primary" @click="closeModal">Cancelar</button>
        </slot>
      </div>
    </div>
  </dialog>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits } from 'vue';

// Props para configurar el modal
defineProps({
  title: String,
  message: String,
});

// Eventos emitidos por el modal
const emit = defineEmits(['confirm', 'cancel']);

// Referencia al modal
const modal = ref<HTMLDialogElement | null>(null);

const showModal = () => {
  modal.value?.showModal();
};

const closeModal = () => {
  modal.value?.close();
};

// Emitir confirmación
const onConfirm = () => {
  emit('confirm');
  closeModal();
};

const onCancel = () => {
  emit('cancel');
  closeModal();
};

// Exponer funciones
defineExpose({ showModal });
</script>

<style scoped>
/* Estilos opcionales */
</style>
<!-- DOCUMENTACION -->

<!-- Ejemplo 1: Botones Predeterminados -->
<!-- <ModalDialog
  ref="deleteModal"
  title="Confirmar Eliminación"
  message="¿Estás seguro de que deseas eliminar esta solicitud?"
  @confirm="handleConfirm"
  @cancel="handleCancel"
/> -->

<!-- Ejemplo 2: Personalizar Botones -->
<!-- <ModalDialog
  ref="deleteModal"
  title="Confirmar Acción"
  message="¿Qué acción deseas realizar?"
  @confirm="handleConfirm"
  @cancel="handleCancel"
>
  <template #buttons>
    <button class="btn btn-success" @click="onAccept">Aceptar</button>
    <button class="btn btn-error" @click="onDelete">Eliminar</button>
    <button class="btn btn-secondary" @click="closeModal">Cancelar</button>
  </template>
</ModalDialog> -->

<!-- Ejemplo 3: Solo un Botón -->
<!-- <ModalDialog
  ref="deleteModal"
  title="Notificación"
  message="Esta acción no puede deshacerse."
  @confirm="handleConfirm"
/>
<template #buttons>
  <button class="btn btn-primary" @click="closeModal">Aceptar</button>
</template> -->

<!-- Explicación
Uso de Slots:

Se utiliza un slot con el nombre buttons dentro de modal-action.
Si no proporcionas un slot, el modal muestra los botones predeterminados.
Flexibilidad:

Puedes personalizar completamente los botones (texto, estilos y eventos).
Soporta uno, dos o más botones según sea necesario.
Función defineExpose:

Permite llamar a showModal() desde el componente padre para abrir el modal. -->
<!-- <script setup lang="ts">
import { ref } from 'vue';
import ModalDialog from './ModalDialog.vue';

const deleteModal = ref();

const handleConfirm = () => {
  console.log('Confirmación recibida');
};

const handleCancel = () => {
  console.log('Cancelación recibida');
};

const openModal = () => {
  deleteModal.value?.showModal();
};
</script>

<template>
  <button @click="openModal" class="btn btn-primary">Abrir Modal</button>

  <ModalDialog
    ref="deleteModal"
    title="Confirmar Eliminación"
    message="¿Estás seguro de que deseas eliminar esta solicitud?"
    @confirm="handleConfirm"
    @cancel="handleCancel"
  >
    <template #buttons>
      <button class="btn btn-error" @click="handleConfirm">Eliminar</button>
      <button class="btn btn-secondary" @click="handleCancel">Cancelar</button>
    </template>
  </ModalDialog>
</template> -->
