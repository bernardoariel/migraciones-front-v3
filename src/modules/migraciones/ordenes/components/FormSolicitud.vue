<template>
  <div class="flex flex-col">
    <div class="text-2xl font-semibold mb-6 text-center">
      {{ idPersonSelected == 'new' || idPersonSelected === null ? 'Agregando ' : 'Editando' }} un
      {{ nombreForm }}
    </div>

    <form @submit="onSubmit" class="space-y-4">
      <label class="input input-bordered flex items-center gap-2">
        <span>Fecha de Instrumento </span>
        <input
          type="date"
          v-model="dateOfInstrumento"
          :class="['form-control', errors.dateOfInstrumento ? 'border-red-500' : '']"
          placeholder="Fecha de Instrumento"
          v-bind="dateOfInstrumentoAttrs"
        />
      </label>
      <MyInput
        v-model="numeroActuacion"
        v-bind="numeroActuacionAttrs"
        :error="errors.numeroActuacion"
        label="Nro. Actuacion Certificación de Firma"
        placeholder="Nro. Actuación Certificación de Firma"
      />

      <MySelect
        v-model="instrumentoType"
        v-bind="instrumentoTypeAttrs"
        :error="errors.instrumentoType"
        label="Tipo de Instrumento"
        :options="instrumentoTypeOptions"
      />
      <MySelect
        v-model="paisType"
        v-bind="paisTypeAttrs"
        :error="errors.paisType"
        label="Cualquier Pais"
        :options="paisOptions"
      />

      <MySelect
        v-model="documentIssuer"
        v-bind="documentIssuerAttrs"
        :error="errors.documentType"
        label="¿ Hasta mayoria de edad ?"
        :options="issuerDocsOptions"
      />

      <label class="input input-bordered flex items-center gap-2">
        <span>Fecha desde </span>
        <input
          type="date"
          v-model="dateOfBirht"
          :class="['form-control', errors.dateOfBirht ? 'border-red-500' : '']"
          placeholder="Fecha desde"
          v-bind="dateOfBirhtAttrs"
        />
      </label>
      <label class="input input-bordered flex items-center gap-2">
        <span>Fecha hasta </span>
        <input
          type="date"
          v-model="dateOfBirht"
          :class="['form-control', errors.dateOfBirht ? 'border-red-500' : '']"
          placeholder="Fecha hasta"
          v-bind="dateOfBirhtAttrs"
        />
      </label>

      <!-- Domicilio -->
      <MyInput
        v-model="address"
        v-bind="addressAttrs"
        :error="errors.address"
        label="Domicilio"
        placeholder="Paises descripcion"
      />
    </form>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, watch, computed } from 'vue';
import * as yup from 'yup';
import { useForm } from 'vee-validate';

import MyInput from '@/common/components/elementos/MyInput.vue';
import MySelect from '@/common/components/elementos/MySelect.vue';

import usePerson from '@/common/composables/usePerson';
import { getPersonByDoc } from '@/common/composables/usePerson';
import { usePersonStore } from '@/common/store/personStore';
import { storeToRefs } from 'pinia';
import { useToast } from 'vue-toastification';
import { useQueryClient } from '@tanstack/vue-query';
import { useRoute } from 'vue-router';
import { useOrdenStore } from '../../../../common/store/ordenStore';

const toast = useToast();

const ordenStore = useOrdenStore();

interface Props {
  nroSolicitud?: number | null;
}

const props = defineProps<Props>();
const nombreForm = ref('SolicitudForm');

const errorDoc = ref('');
const route = useRoute();
const isFormValid = ref(false);
const validationSchema = computed(() => {
  return yup.object({
    numeroActuacion: yup.number().required().min(3),
    documentType: yup
      .number()
      .required()
      .oneOf(documentTypeOptions.value.map((opt) => opt.value)),
    documentIssuer: yup
      .number()
      .required()
      .oneOf(issuerDocsOptions.value.map((opt) => opt.value)),
    lastName: yup.string().required(),
    secondLastName: yup.string(),
    firstName: yup.string().required().min(3),
    otherNames: yup.string(),
    nationality: yup
      .number()
      .required()
      .oneOf(nationalityOptions.value.map((opt) => opt.value)),
    sex: yup.string().required().oneOf(['1', '2']),
    address: yup.string(),
  });
});

const { defineField, errors, handleSubmit, meta, resetForm, setValues } = useForm({
  validationSchema,
});
const [dateOfInstrumento, dateOfInstrumentoAttrs] = defineField('dateOfInstrumento');
const [numeroActuacion, numeroActuacionAttrs] = defineField('numeroActuacion');
const [instrumentoType, instrumentoTypeAttrs] = defineField('instrumentoType');
const [paisType, paisTypeAttrs] = defineField('paisType');

const [lastName, lastNameAttrs] = defineField('lastName');
const [secondLastName, secondLastNameAttrs] = defineField('secondLastName');
const [firstName, firstNameAttrs] = defineField('firstName');
const [otherNames, otherNamesAttrs] = defineField('otherNames');
const [nationality, nationalityAttrs] = defineField('nationality');
const [sex, sexAttrs] = defineField('sex');
const [address, addressAttrs] = defineField('address');

const instrumentoTypeOptions = ref([
  { label: 'PAPEL', value: '1' },
  { label: 'DIGITAL', value: '2' },
]);
const paisOptions = ref([
  { label: 'SI', value: '1' },
  { label: 'NO', value: '2' },
]);

const personStore = usePersonStore();
const { getIdPersonSelected } = storeToRefs(personStore);
const idPersonSelected = getIdPersonSelected;
const effectiveId = computed(() => props.autorizante ?? idPersonSelected.value);

const isSubmitting = ref(false);

const queryClient = useQueryClient();
const { person, createPerson, updatePerson } = usePerson(effectiveId);

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
      nationality: newPerson.nationality_id,
      sex: newPerson.sex_id,
      address: newPerson.domicilio,
      dateOfBirht: newPerson.fecha_de_nacimiento,
      documentIssuer: newPerson.issuer_document_id,
    });
  }
});

const onSubmit = handleSubmit(async (value) => {
  if (isSubmitting.value) return;
  isSubmitting.value = true;
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
      issuer_document_id: value.documentIssuer,
    };
    if (effectiveId.value === null || effectiveId.value === 'new') {
      const resp = await createPerson(payload);
      if (route.path.includes('solicitud')) {
        ordenStore.getPerson('autorizantes', resp.id);
        toast.success('Autorizante Agregado a la solicitud');
      }
      toast.success('Autorizante creado exitosamente');
    } else {
      await updatePerson(payload);
      toast.success('Autorizante actualizado exitosamente');
    }

    queryClient.invalidateQueries({ queryKey: ['persons'] });
  } catch (error) {
    isSubmitting.value = false;
  }
});
onMounted(async () => {
  await Promise.all([
    loadOptions('nacionalidades', 'nombre'),
    loadOptions('emisordocumentos', 'descripcion'),
    loadOptions('tiposdocumentos', 'descripcion'),
  ]);

  if (effectiveId.value === 'new') {
    resetForm();
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
  if (newId) {
    resetForm();
  }
});

defineExpose({ resetForm, onSubmit });
</script>

<style scoped></style>
