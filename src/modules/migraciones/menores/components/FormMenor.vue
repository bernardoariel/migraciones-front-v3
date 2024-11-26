<template>
  <div class="flex flex-col">
    <div class="text-2xl font-semibold mb-6 text-center">Agregando un Menor</div>

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

      <!--  <MyCalendar
          v-model="dateOfBirht"
          placeholder="Fecha de Nacimiento"
          :error="errors.dateOfBirht"
          v-bind="dateOfBirhtAttrs"
        /> -->
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
      <ButtonGroup :buttons="buttons!" />
    </form>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref, watch } from 'vue';
import * as yup from 'yup';
import { useForm } from 'vee-validate';

import MyInput from '@/common/components/elementos/MyInput.vue';
import MySelect from '@/common/components/elementos/MySelect.vue';
import ButtonGroup from '@/common/components/ButtonGroup.vue';
import useDropdownOptions from '@/common/composables/useDropdownOptions';

import type { Menor } from '../interfaces/menor.interface';
import usePerson from '../../../../common/composables/usePerson';
import { usePersonStore } from '../../../../common/store/personStore';
import { storeToRefs } from 'pinia';
const { documentTypeOptions, nationalityOptions, loadOptions } = useDropdownOptions()


interface ButtonConfig {
  label: string;
  type?: 'button' | 'submit' | 'reset';
  class?: string;
  disabled?: boolean;
  position?: 'left' | 'right' | 'center';
  action: () => void;
}

interface Props {
  menor?: number | null;
  buttons?: ButtonConfig[];
}
const props = defineProps<Props>();

const { createPerson, fetchAllPersonById, updatePerson } = usePerson();
const isFormValid = ref(false);
const validationSchema = yup.object({
  documentNumber: yup.string().matches(/^\d+$/).required().min(3),
  documentType: yup.number().required().oneOf([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]),
  lastName: yup.string().required(),
  secondLastName: yup.string(),
  firstName: yup.string().required().min(3),
  otherNames: yup.string(),
  nationality: yup.string().required(),
  address: yup.string(),
});

const { defineField, errors, handleSubmit, meta, resetForm, setValues } = useForm({
  validationSchema,
});

const [documentNumber, documentNumberAttrs] = defineField('documentNumber');
const [documentType, documentTypeAttrs] = defineField('documentType');
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
const { idPersonSelected } = storeToRefs(personStore);
const effectiveId = computed(() => props.menor ?? idPersonSelected.value);

const onSubmit = handleSubmit(async (value) => {
  try {
    const payload: Menor = {
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
    };
    if (effectiveId.value) {
      await updatePerson(effectiveId.value, payload);
      return;
    }
    await createPerson(payload);
  } catch (error) {
    console.error('Error al enviar los datos:', error);
  }
});
onMounted(async () => {
  if (effectiveId.value) {
    const data = await fetchAllPersonById(effectiveId.value);

    setValues({
      documentNumber: data.numero_de_documento,
      documentType: String(data.type_document_id),
      lastName: data.apellido,
      secondLastName: data.segundo_apellido || '',
      firstName: data.nombre,
      otherNames: data.otros_nombres || '',
      nationality: data.nationality_id,
      sex: data.sex_id,
      address: data.domicilio,
      fecha_de_nacimiento: data.dateOfBirht,
    });
  }
  loadOptions('nacionalidades', 'nombre');  
  loadOptions('tiposdocumentos', 'descripcion');  
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
  if (newId) {
    const data = await fetchAllPersonById(newId);

    setValues({
      documentNumber: data.numero_de_documento,
      documentType: String(data.type_document_id),
      lastName: data.apellido,
      secondLastName: data.segundo_apellido || '',
      firstName: data.nombre,
      otherNames: data.otros_nombres || '',
      nationality: data.nationality_id,
      sex: data.sex_id,
      address: data.domicilio,
      fecha_de_nacimiento: data.dateOfBirht,
      documentIssuer: data.issuer_document_id,
    });
  } else {
    resetForm();
  }
});
</script>

<style scoped>
/* Puedes personalizar más estilos aquí si es necesario */
</style>
