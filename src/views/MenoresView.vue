<template>
  <div class="flex justify-center bg-gray-100 min-h-screen">
    <div class="bg-white p-8 rounded-lg shadow-lg max-w-md w-full my-auto">
      <h2 class="text-2xl font-semibold mb-6 text-center">Agregando un Menor</h2>

      <form @submit="onSubmit" class="space-y-4">
        <!-- Número de Documento -->
        <MyInput
          v-model.number="documentNumber"
          v-bind="documentNumberAttrs"
          :error="errors.documentNumber"
          label="Documento"
          placeholder="Ingrese el Documento"
          type="number"
        />

        <MySelect
          v-model="documentType"
          v-bind="documentTypeAttrs"
          :error="errors.documentType"
          label="Tipo de Documento"
          :options="documentTypes"
        />
        <!-- Apellido -->
        <MyInput
          v-model="lastName"
          v-bind="lastNameAttrs"
          :error="errors.lastName"
          label="Apellido"
          placeholder="Ingrese el Apellido"
        />

        <!-- Segundo Apellido -->
        <MyInput
          v-model="secondLastName"
          v-bind="secondLastNameAttrs"
          :error="errors.secondLastName"
          label="Segundo Apellido"
          placeholder="Ingrese el Segundo Apellido"
        />

        <!-- Nombre -->
        <MyInput
          v-model="firstName"
          v-bind="firstNameAttrs"
          :error="errors.firstName"
          label="Nombre"
          placeholder="Ingrese el Nombre"
        />

        <!-- Otros Nombres -->
        <MyInput
          v-model="otherNames"
          v-bind="otherNamesAttrs"
          :error="errors.otherNames"
          label="Otros Nombres"
          placeholder="Ingrese Otros Nombres"
        />

         <!-- Nacionalidad -->
         <MySelect
          v-model="nationality"
          :options="countries"  
          :error="errors.nationality"
          v-bind="nationalityAttrs"
          label="Nacionalidad"
        />

          <!-- Sexo -->
          <MySelect
          v-model="sex"
          :options="sexType"  
          :error="errors.sex"
          v-bind="sexAttrs"
          label="Sexo"
        />

        <!-- Domicilio -->
        <MyInput
          v-model="address"
          v-bind="addressAttrs"
          :error="errors.address"
          label="Domicilio"
          placeholder="Ingrese el Domicilio"
        />
        <!-- Buttons -->
        <div class="flex justify-between mt-6">
          <router-link class="btn btn-ghost" :to="{ name: 'Home' }">Cancelar</router-link>
          <button type="submit" class="btn btn-primary px-4 py-2" :disabled="!isFormValid">
            Guardar
          </button>
          <button type="button" @click="handleReset" class="btn btn-secondary px-4 py-2">
            Limpiar
          </button>
        </div>
        <div class="grid grid-cols-2 p-2">
          <div class="bg-blue-100">{{ values }}</div>
        </div>
        <div class="grid grid-cols-2 p-2">
          <div class="bg-red-100">{{ errors }}</div>
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';
import { useForm } from 'vee-validate';
import MyInput from '@/common/components/elementos/MyInput.vue';
import MySelect from '@/common/components/elementos/MySelect.vue';
import * as yup from 'yup';
import { apiMigrationsData } from '@/api/apiMigrationsData';

const validationSchema = yup.object({
  documentNumber: yup.string().matches(/^\d+$/).required().min(3),
  documentType: yup.number().required().oneOf([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]),
  lastName: yup.string().required(),
  secondLastName: yup.string(),
  firstName: yup.string().required().min(3),
  otherNames: yup.string(),
  nationality: yup.string().required(),
  address:yup.string(),
});

const { values, defineField, errors, handleSubmit, meta, resetForm } = useForm({
  validationSchema,
});
const isFormValid = ref(false);
const [documentNumber, documentNumberAttrs] = defineField('documentNumber');
const [documentType, documentTypeAttrs] = defineField('documentType');
const [lastName, lastNameAttrs] = defineField('lastName');
const [secondLastName, secondLastNameAttrs] = defineField('secondLastName');
const [firstName, firstNameAttrs] = defineField('firstName');
const [otherNames, otherNamesAttrs] = defineField('otherNames');
const [nationality, nationalityAttrs] = defineField('nationality');
const [sex, sexAttrs] = defineField('sex');
const [address, addressAttrs] = defineField('address');

const countries = ref([
  { label: 'Argentina', value: 'AR' },
  { label: 'Brasil', value: 'BR' },
  { label: 'Chile', value: 'CL' },
  { label: 'Colombia', value: 'CO' },
  { label: 'México', value: 'MX' },
  { label: 'Perú', value: 'PE' },
  { label: 'Uruguay', value: 'UY' },
]);

const documentTypes = ref([
  { label: 'CEDULA DE IDENTIDAD', value: 1 },
  { label: 'CERTIFICADO DE VIAJE', value: 2 },
  { label: 'DOCUMENTO DE VIAJE', value: 3 },
  { label: 'DOCUMENTO NACIONAL DE IDENTIDAD', value: 4 },
  { label: 'LAISSER PASSER', value: 5 },
  { label: 'LIBRETA CIVICA', value: 6 },
  { label: 'LIBRETA DE EMBARQUE (SEAMAN BOOK)', value: 7 },
  { label: 'LIBRETA DE ENROLAMIENTO', value: 8 },
  { label: 'PASAPORTE', value: 9 },
  { label: 'PASAPORTE DE SERVICIO', value: 10 },
  { label: 'PASAPORTE DIPLOMATICO', value: 11 },
  { label: 'PASAPORTE OFICIAL', value: 12 },
  { label: 'PASAPORTE PROVISORIO', value: 13 },
  { label: 'SALVOCONDUCTO', value: 14 },
]);

const sexType = ref([
  { label: 'Femenino', value: 'F' },
  { label: 'Masculino', value: 'M' }  
]);

const onSubmit = handleSubmit(async (value) => {
  try {
    const payload = {
      numero_de_documento: value.documentNumber,
      type_document_id: value.documentType,
      apellido: value.lastName,
      segundo_apellido: value.secondLastName,
      nombre: value.firstName,
      otros_nombres: value.otherNames,
      // nacionalidad: value.nationality,
      // sexo: value.sex,
      // domicilio: value.address
    };
    const response = await apiMigrationsData.post('/api/v2/persona/new', payload);

    console.log('Respuesta del servidor:', response.data);
  } catch (error) {
    console.error('Error al enviar los datos:', error);
  }
});
const handleReset = () => {
  resetForm(); // Llama a resetForm aquí sin pasarle argumentos
};
watch(
  () => meta.value,
  (newMeta) => {
    // Usar meta.valid para habilitar el botón solo si el formulario es válido
    isFormValid.value = newMeta.valid;
  },
  { deep: true },
);
</script>

<style scoped>
/* Puedes personalizar más estilos aquí si es necesario */
</style>
