<template>
  <div class="flex justify-center bg-gray-100 min-h-screen">
    <div class="bg-white p-8 rounded-lg shadow-lg max-w-md w-full my-auto">
      <h2 class="text-2xl font-semibold mb-6 text-center">Agregando un Acompañante</h2>

      <form @submit.prevent="submitForm" class="space-y-4">
        <!-- Número de Documento -->
        <MyInput
          label="Documento"
          placeholder="Ingrese el Documento"
          v-model="form.documentNumber"
          type="number"
        />
        <!-- Tipo de Documento -->

        <MySelect
          label="Tipo de Documento"
          :options="['DOCUMENTO NACIONAL DE IDENTIDAD', 'PASAPORTE']"
          v-model="form.documentType"
          type="text"
        />
        <!-- Apellido -->
        <MyInput label="Apellido" placeholder="Ingrese el Apellido" v-model="form.lastName" />

        <!-- Segundo Apellido -->
        <MyInput
          label="Segundo Apellido"
          placeholder="Ingrese el Segundo Apellido"
          v-model="form.secondLastName"
          type="text"
        />

        <!-- Nombre -->
        <MyInput
          label="Nombre"
          placeholder="Ingrese el Nombre"
          v-model="form.firstName"
          type="text"
        />

        <!-- Otros Nombres -->
        <MyInput
          label="Otros Nombres"
          placeholder="Ingrese Otros Nombres"
          v-model="form.otherNames"
          type="text"
        />

        <!-- Buttons -->
        <div class="flex justify-between mt-6">
          <router-link class="btn btn-ghost" :to="{ name: 'Home' }">Cancelar</router-link>
          <button type="submit" class="btn btn-primary px-4 py-2" :disabled="!isFormValid">
            Guardar
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import MyInput from '@/common/components/elementos/MyInput.vue';
import MySelect from '@/common/components/elementos/MySelect.vue';

interface Acompanante {
  documentNumber?: string;
  documentType?: string;
  lastName?: string;
  secondLastName?: string;
  firstName?: string;
  otherNames?: string;
}
const form = ref<Acompanante>({
  documentNumber: '',
  documentType: '',
  lastName: '',
  secondLastName: '',
  firstName: '',
  otherNames: '',
});
const isFormValid = ref(true); // Cambia la validez del formulario según tu lógica

const submitForm = () => {
  // Aquí maneja la lógica de envío del formulario
};
</script>

<style scoped>
/* Puedes personalizar más estilos aquí si es necesario */
</style>
