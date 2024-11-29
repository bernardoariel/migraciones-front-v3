<template>
  <div class="flex flex-col">
    <div class="text-2xl font-semibold mb-6 text-center">
      {{ !idPersonSelected ? 'Agregando ' : 'Editando' }} un {{ nombreForm }}
    </div>

    <form @submit.prevent="onSubmit" class="space-y-4">
      <MyInput
        v-model.number="documentNumber"
        v-bind="documentNumberAttrs"
        :error="errors.documentNumber"
        label="Documento"
        placeholder="Ingrese el Documento"
        type="number"
        @blur="checkDniExistence" 
      />
      <span class="text-red-400" v-if="errorDoc">{{ errorDoc }}</span>
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

      <ButtonGroup :buttons="buttons!" />
    </form>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, watch, computed } from 'vue';
import * as yup from 'yup';
import { useForm } from 'vee-validate';
import { storeToRefs } from 'pinia';

import ButtonGroup from '@/common/components/ButtonGroup.vue';
import MyInput from '@/common/components/elementos/MyInput.vue';
import MySelect from '@/common/components/elementos/MySelect.vue';
import useDropdownOptions from '@/common/composables/useDropdownOptions';

import type { Acompaneante } from '../interfaces/acompaneante.interface';
import usePerson from '../../../../common/composables/usePerson';
import { usePersonStore } from '@/common/store/personStore';
const { documentTypeOptions, loadOptions } = useDropdownOptions();

interface ButtonConfig {
  label: string;
  type?: 'button' | 'submit' | 'reset';
  class?: string;
  disabled?: boolean;
  position?: 'left' | 'right' | 'center';
  action: () => void;
}

interface Props {
  acompaneante?: number | null;
  buttons?: ButtonConfig[];
}

const errorDoc = ref('')
const props = defineProps<Props>();
const nombreForm = ref('Acompañante');
const { createPerson, fetchAllPersonById, updatePerson ,  getPersonByDoc  } = usePerson();
const isFormValid = ref(false);
const validationSchema = yup.object({
  documentNumber: yup.string().matches(/^\d+$/).required().min(3),
  documentType: yup.number().required().oneOf([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]),
  lastName: yup.string().required(),
  secondLastName: yup.string(),
  firstName: yup.string().required().min(3),
  otherNames: yup.string(),
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

const personStore = usePersonStore();
const { getIdPersonSelected } = storeToRefs(personStore);
const idPersonSelected = getIdPersonSelected;
const effectiveId = computed(() => props.acompaneante ?? idPersonSelected.value);
const isSubmitting = ref(false);

const onSubmit = handleSubmit(async (value) => {
  if (isSubmitting.value) return;
  isSubmitting.value = true;
  try {
    const payload: Acompaneante = {
      numero_de_documento: value.documentNumber,
      type_document_id: value.documentType,
      apellido: value.lastName,
      segundo_apellido: value.secondLastName,
      nombre: value.firstName,
      otros_nombres: value.otherNames,
    };

    if (effectiveId.value) {
      await updatePerson(effectiveId.value, payload);
    } else {
      await createPerson(payload);
    }
  } finally {
    isSubmitting.value = false;
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
    });
  }
  loadOptions('tiposdocumentos', 'descripcion');
});

const checkDniExistence = async () => {
  if (documentNumber.value) {
    try {
      const response = await getPersonByDoc(documentNumber.value);  // Ahora obtenemos la respuesta completa
      console.log('Response:', response);  // Log para depuración

      if (response && response.id) {  // Verifica si la respuesta tiene el campo id
        errorDoc.value = 'Ya existe una persona con este número de documento';
      } else {
        errorDoc.value = '';  // Si no está registrado, limpia el mensaje
      }
    } catch (error) {
      console.error(error);
      errorDoc.value = 'Error al verificar el DNI';  // Si ocurre un error, muestra este mensaje
    }
  }
};

watch(
  () => meta.value,
  (newMeta) => {
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
    });
  } else {
    resetForm();
  }
});
defineExpose({ resetForm, onSubmit });
</script>
