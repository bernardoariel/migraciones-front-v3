<template>
  <div class="flex flex-col">
    <div class="text-2xl font-semibold mb-6 text-center">Agregando un Autorizante</div>

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

      <div class="flex justify-between mt-6">
        <!-- Botones alineados a la izquierda -->
        <div class="flex space-x-2" v-if="buttons.some((button) => button.position === 'left')">
          <button
            v-for="(button, index) in buttons.filter((button) => button.position === 'left')"
            :key="'left-' + index"
            :type="button.type"
            :class="button.class"
            :disabled="button.disabled || false"
            @click="button.action"
          >
            {{ button.label }}
          </button>
        </div>

        <!-- Botones alineados al centro -->
        <div
          class="flex space-x-2 mx-auto"
          v-if="buttons.some((button) => button.position === 'center')"
        >
          <button
            v-for="(button, index) in buttons.filter((button) => button.position === 'center')"
            :key="'center-' + index"
            :type="button.type"
            :class="button.class"
            :disabled="button.disabled || false"
            @click="button.action"
          >
            {{ button.label }}
          </button>
        </div>

        <!-- Botones alineados a la derecha -->
        <div
          class="flex space-x-2 ml-auto"
          v-if="buttons.some((button) => button.position === 'right')"
        >
          <button
            v-for="(button, index) in buttons.filter((button) => button.position === 'right')"
            :key="'right-' + index"
            :type="button.type"
            :class="button.class"
            :disabled="button.disabled || false"
            @click="button.action"
          >
            {{ button.label }}
          </button>
        </div>
      </div>
      <!-- <div class="grid grid-cols-2 p-2">
      <div class="bg-blue-100">{{ values }}</div>
    </div>
    <div class="grid grid-cols-2 p-2">
      <div class="bg-red-100">{{ errors }}</div>
    </div> -->
    </form>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, watch, computed } from 'vue';
import * as yup from 'yup';
import { useForm } from 'vee-validate';

import MyInput from '@/common/components/elementos/MyInput.vue';
import MySelect from '@/common/components/elementos/MySelect.vue';

import type { Acompaneante } from '../interfaces/acompaneante.interface';
import usePerson from '../../../../common/composables/usePerson';
import { usePersonStore } from '@/common/store/personStore';
import { storeToRefs } from 'pinia';
const props = defineProps<Props>();
interface ButtonConfig {
  label: string;
  type?: 'button' | 'submit' | 'reset'; // Restringimos los valores permitidos para evitar errores.
  action: () => void;
  class?: string;
  disabled?: boolean;
  position?: 'left' | 'right' | 'center'; // Agregamos la propiedad position.
}
interface Props {
  buttons: ButtonConfig[];
  acompaneante: number | null;
}

const { createPerson, fetchAllPersonById, updatePerson } = usePerson();

const validationSchema = yup.object({
  documentNumber: yup.string().matches(/^\d+$/).required().min(3),
  documentType: yup.number().required().oneOf([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]),
  lastName: yup.string().required(),
  secondLastName: yup.string(),
  firstName: yup.string().required().min(3),
  otherNames: yup.string(),
});

const { values, defineField, errors, handleSubmit, meta, resetForm, setValues } = useForm({
  validationSchema,
});
const isFormValid = ref(false);
const [documentNumber, documentNumberAttrs] = defineField('documentNumber');
const [documentType, documentTypeAttrs] = defineField('documentType');
const [lastName, lastNameAttrs] = defineField('lastName');
const [secondLastName, secondLastNameAttrs] = defineField('secondLastName');
const [firstName, firstNameAttrs] = defineField('firstName');
const [otherNames, otherNamesAttrs] = defineField('otherNames');

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
// Pinia store
const personStore = usePersonStore();
const { idPersonSelected } = storeToRefs(personStore);

// Computed para determinar el ID efectivo
const effectiveId = computed(() => props.acompaneante ?? idPersonSelected.value);
const onSubmit = handleSubmit(async (value) => {
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
    return;
  }
  await createPerson(payload);
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
</script>

<style scoped>
/* Puedes personalizar más estilos aquí si es necesario */
</style>
