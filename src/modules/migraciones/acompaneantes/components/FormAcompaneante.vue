<template>
  <div class="flex flex-col">
    <div class="text-2xl font-semibold mb-6 text-center">
      {{ idPersonSelected == 'new' ? 'Agregando ' : 'Editando' }} un {{ nombreForm }}
    </div>

    <form @submit.prevent="onSubmit" class="space-y-4">
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

import { usePersonStore } from '@/common/store/personStore';
import { useMutation } from '@tanstack/vue-query';
import { apiMigrationsData } from '@/api/apiMigrationsData';
import { useToast } from 'vue-toastification';
import usePerson from '../../../../common/composables/usePerson';

const toast = useToast();
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

const props = defineProps<Props>();
const nombreForm = ref('Acompañante');

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
const effectiveId = computed(() => {
  const id = props.acompaneante ?? idPersonSelected.value;
  return id === 'new' ? null : id;
});
const isSubmitting = ref(false);
const { person, refetch } = usePerson(effectiveId);

const { isSuccess: isSuccessNew, mutate: mutateNew } = useMutation({
  mutationFn: (newTodo: Acompaneante) =>
    effectiveId.value
      ? apiMigrationsData.put(`/v2/persona/update/${effectiveId.value}`, newTodo)
      : apiMigrationsData.post('/v2/persona/new', newTodo),
});
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
    mutateNew(payload);
  } finally {
    isSubmitting.value = false;
  }
});

onMounted(async () => {
  loadOptions('tiposdocumentos', 'descripcion');
  if (effectiveId.value) {
    refetch();
  }
});

watch(
  () => meta.value,
  (newMeta) => {
    isFormValid.value = newMeta.valid;
  },
  { deep: true },
);
watch(isSuccessNew, () => {
  if (!isSuccessNew.value) return;
  console.log('effectiveId.value::: ', effectiveId.value);
  !effectiveId.value
    ? toast.success('Se agregó un Acompañante')
    : toast.success('Se Actualizo un Acompañante');
});

watch(person, (newPerson) => {
  if (newPerson) {
    setValues({
      documentNumber: newPerson.numero_de_documento,
      documentType: String(newPerson.type_document_id),
      lastName: newPerson.apellido,
      secondLastName: newPerson.segundo_apellido || '',
      firstName: newPerson.nombre,
      otherNames: newPerson.otros_nombres || '',
    });
  } else {
    resetForm();
  }
});
watch(effectiveId, (newId) => {
  if (newId === null) {
    resetForm(); // Resetea el formulario si el ID es "new"
  } else {
    refetch(); // Ejecuta la consulta si el ID es válido
  }
});
defineExpose({ resetForm, onSubmit });
</script>
