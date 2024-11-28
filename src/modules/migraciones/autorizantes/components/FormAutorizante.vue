<template>
  <div class="flex flex-col">
    <div class="text-2xl font-semibold mb-6 text-center">
      {{ idPersonSelected == 'new' ? 'Agregando ' : 'Editando' }} un {{ nombreForm }}
    </div>

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
        :options="documentTypeOptions"
      />

      <MySelect
        v-model="documentIssuer"
        v-bind="documentIssuerAttrs"
        :error="errors.documentType"
        label="Emisor del Documento"
        :options="issuerDocsOptions"
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
        :options="nationalityOptions"
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
      <label class="input input-bordered flex items-center gap-2">
        <span>Fecha de Nacimiento </span>
        <input
          type="date"
          v-model="dateOfBirht"
          :class="['form-control', errors.dateOfBirht ? 'border-red-500' : '']"
          placeholder="Fecha de Nacimiento"
          v-bind="dateOfBirhtAttrs"
        />
      </label>

      <!-- Domicilio -->
      <MyInput
        v-model="address"
        v-bind="addressAttrs"
        :error="errors.address"
        label="Domicilio"
        placeholder="Ingrese el Domicilio"
      />
      <!-- Buttons -->
      <ButtonGroup :buttons="buttons!" />
    </form>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, watch, computed } from 'vue';
import * as yup from 'yup';
import { useForm } from 'vee-validate';

import MyInput from '@/common/components/elementos/MyInput.vue';
import MySelect from '@/common/components/elementos/MySelect.vue';
import ButtonGroup from '@/common/components/ButtonGroup.vue';
import useDropdownOptions from '@/common/composables/useDropdownOptions';

import type { Autorizante } from '../interfaces/autorizante.interface';
import usePerson from '@/common/composables/usePerson';
import { usePersonStore } from '@/common/store/personStore';
import { storeToRefs } from 'pinia';
const { documentTypeOptions, nationalityOptions, issuerDocsOptions, loadOptions } =
  useDropdownOptions();

interface ButtonConfig {
  label: string;
  type?: 'button' | 'submit' | 'reset';
  class?: string;
  disabled?: boolean;
  position?: 'left' | 'right' | 'center';
  action: () => void;
}

interface Props {
  autorizante?: number | null;
  buttons?: ButtonConfig[];
}
const props = defineProps<Props>();
const nombreForm = ref('Autorizante');
const { createPerson, fetchAllPersonById, updatePerson } = usePerson();
const isFormValid = ref(false);
const validationSchema = yup.object({
  documentNumber: yup.string().matches(/^\d+$/).required().min(3),
  documentType: yup.number().required().oneOf([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]),
  documentIssuer: yup.string().required().oneOf(['1', '2', '3', '4', '5', '6', '7']),
  lastName: yup.string().required(),
  secondLastName: yup.string(),
  firstName: yup.string().required().min(3),
  otherNames: yup.string(),
  nationality: yup.string().required().oneOf(['1', '2', '3', '4', '5', '6', '7']),
  sex: yup.string().required().oneOf(['1', '2']),
  address: yup.string(),
});

const { defineField, errors, handleSubmit, meta, resetForm, setValues } = useForm({
  validationSchema,
});

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
const [dateOfBirht, dateOfBirhtAttrs] = defineField('dateOfBirht');

const sexType = ref([
  { label: 'Femenino', value: '1' },
  { label: 'Masculino', value: '2' },
]);

const personStore = usePersonStore();
const { getIdPersonSelected } = storeToRefs(personStore);
const idPersonSelected = getIdPersonSelected;
const effectiveId = computed(() => props.autorizante ?? idPersonSelected.value);

const onSubmit = handleSubmit(async (value) => {
  try {
    const payload: Autorizante = {
      numero_de_documento: value.documentNumber,
      type_document_id: value.documentType,
      apellido: value.lastName,
      segundo_apellido: value.secondLastName,
      nombre: value.firstName,
      otros_nombres: value.otherNames,
      nationality_id: value.nationality,
      sex_id: value.sex,
      domicilio: value.address,
      fecha_de_nacimiento: value.dateOfBirht,
      issuer_document_id: value.documentIssuer,
    };
    if (effectiveId.value) {
      await updatePerson(effectiveId.value as number, payload);
      return;
    }
    await createPerson(payload);
  } catch (error) {
    console.error('Error al enviar los datos:', error);
  }
});
onMounted(async () => {
  loadOptions('nacionalidades', 'nombre');
  loadOptions('emisordocumentos', 'descripcion');
  loadOptions('tiposdocumentos', 'descripcion');
  if (effectiveId.value) {
    const data = await fetchAllPersonById(effectiveId.value as number);

    setValues({
      documentNumber: data.numero_de_documento,
      documentType: String(data.type_document_id),
      lastName: data.apellido,
      secondLastName: data.segundo_apellido || '',
      firstName: data.nombre,
      otherNames: data.otros_nombres || '',
      nationality: String(data.nationality_id),
      sex: String(data.sex_id),
      address: data.domicilio,
      dateOfBirht: data.dateOfBirht,
      documentIssuer: String(data.issuer_document_id),
    });
  }
});

watch(
  () => meta.value,
  (newMeta) => {
    // Usar meta.valid para habilitar el botón solo si el formulario es válido
    isFormValid.value = newMeta.valid;
  },
  { deep: true },
);
watch(effectiveId, async (newId) => {
  console.log('effectiveId::: ', effectiveId.value);
  if (newId) {
    const data = await fetchAllPersonById(newId as number);

    setValues({
      documentNumber: data.numero_de_documento,
      documentType: String(data.type_document_id),
      lastName: data.apellido,
      secondLastName: data.segundo_apellido || '',
      firstName: data.nombre,
      otherNames: data.otros_nombres || '',
      nationality: String(data.nationality_id),
      sex: String(data.sex_id),
      address: data.domicilio,
      dateOfBirht: data.fecha_de_nacimiento,
      documentIssuer: String(data.issuer_document_id),
    });
  } else {
    resetForm();
  }
});
defineExpose({ resetForm, onSubmit });
</script>

<style scoped></style>
