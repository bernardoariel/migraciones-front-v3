<template>
  <div class="flex flex-col">
    <div class="text-2xl font-semibold mb-6 text-center mt-2">
      {{ idPersonSelected == 'new' || idPersonSelected === null ? 'Agregando ' : 'Editando' }} un
      {{ nombreForm }}
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

import { usePersonStore } from '@/migraciones/persons/store/personStore';
import { useQueryClient } from '@tanstack/vue-query';

import { useToast } from 'vue-toastification';
import usePerson from '../../persons/composables/usePerson';
import { getPersonByDoc } from '@/migraciones/persons/composables/usePerson';
import { useRoute } from 'vue-router';
import { useOrdenStore } from '@/common/store/ordenStore';

const { documentTypeOptions, loadOptions } = useDropdownOptions();
const ordenStore = useOrdenStore();
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

const errorDoc = ref('');
const route = useRoute();
const isFormValid = ref(false);
const validationSchema = computed(() => {
  return yup.object({
    documentNumber: yup.string().matches(/^\d+$/).required().min(3),
    documentType: yup
      .number()
      .required()
      .oneOf(documentTypeOptions.value.map((opt) => opt.value)),
    lastName: yup.string().required(),
    secondLastName: yup.string(),
    firstName: yup.string().required().min(3),
    otherNames: yup.string(),
  });
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

const queryClient = useQueryClient();
const { person, createPerson, updatePerson } = usePerson(effectiveId);
const toast = useToast();

const checkDniExistence = async () => {
  if (documentNumber.value) {
    try {
      const response = await getPersonByDoc(documentNumber.value);
      if (response && response.id) {
        errorDoc.value = 'Ya existe una persona con este número de documento';
      } else {
        errorDoc.value = '';
      }
    } catch (error) {
      console.error(error);
      errorDoc.value = 'Error al verificar el DNI';
    }
  }
};

watch(person, (newPerson) => {
  if (newPerson) {
    setValues({
      documentNumber: newPerson.numero_de_documento,
      documentType: newPerson.type_document_id,
      lastName: newPerson.apellido,
      secondLastName: newPerson.segundo_apellido || '',
      firstName: newPerson.nombre,
      otherNames: newPerson.otros_nombres || '',
    });
  } else {
    resetForm();
  }
});

const onSubmit = handleSubmit(async (values) => {
  if (isSubmitting.value) return;
  isSubmitting.value = true;
  try {
    const payload: Acompaneante = {
      numero_de_documento: values.documentNumber,
      type_document_id: values.documentType,
      apellido: values.lastName,
      segundo_apellido: values.secondLastName,
      nombre: values.firstName,
      otros_nombres: values.otherNames,
    };

    if (effectiveId.value === null || effectiveId.value === 'new') {
      const resp = await createPerson(payload);
      if (route.path.includes('solicitud')) {
        ordenStore.getPerson('acompaneantes', resp.id);
        toast.success('Acompañante Agregado a la solicitud');
      }
      toast.success('Acompañante creado exitosamente');
    } else {
      await updatePerson(payload);
      toast.success('Acompañante actualizado exitosamente');
    }

    queryClient.invalidateQueries({ queryKey: ['persons'] });
  } catch (error) {
    toast.error('Error al guardar el acompañante');
  } finally {
    isSubmitting.value = false;
  }
});

onMounted(async () => {
  loadOptions('tiposdocumentos', 'descripcion');
  if (effectiveId.value === 'new') {
    resetForm();
  }
});

watch(
  () => meta.value,
  (newMeta) => {
    isFormValid.value = newMeta.valid;
  },
  { deep: true },
);
watch(effectiveId, async (newId) => {
  if (newId) {
    resetForm();
  }
});
defineExpose({ resetForm, onSubmit });
</script>
