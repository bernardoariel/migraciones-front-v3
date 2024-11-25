<template>
  <FormAutorizante />
</template>

<<<<<<< HEAD
<script lang="ts" setup>
import { ref, watch } from 'vue';
import { useForm } from 'vee-validate';
import MyInput from '@/common/components/elementos/MyInput.vue';
import MySelect from '@/common/components/elementos/MySelect.vue';
import * as yup from 'yup';
import { apiClient } from '@/api/apiClient';

const validationSchema = yup.object({
  documentNumber: yup.string().matches(/^\d+$/).required().min(3),
  documentType: yup.number().required().oneOf([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]),
  documentIssuer: yup.string().required().oneOf(['AR', 'BR', 'CL', 'CO', 'MX', 'PE', 'UY']),
  lastName: yup.string().required(),
  secondLastName: yup.string(),
  firstName: yup.string().required().min(3),
  otherNames: yup.string(),
  nationality: yup.string().required().oneOf(['AR', 'BR', 'CL', 'CO', 'MX', 'PE', 'UY']),
  sex: yup.string().required().oneOf(['F', 'M']),
  address: yup.string(),
});

const { values, defineField, errors, handleSubmit, meta, resetForm } = useForm({
  validationSchema,
});
const isFormValid = ref(false);
const [documentNumber, documentNumberAttrs] = defineField('documentNumber');
const [documentType, documentTypeAttrs] = defineField('documentType');
const [documentIssuer, documentIssuerAttrs] = defineField('documentIssuer');
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

const documentIssuerCountries = ref([
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
  { label: 'Masculino', value: 'M' },
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
    };
    const response = await apiClient.post('/api/v2/persona/new', payload);

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
=======
<script setup lang="ts">
import FormAutorizante from '@/modules/migraciones/autorizantes/components/FormAutorizante.vue';
>>>>>>> master
</script>
