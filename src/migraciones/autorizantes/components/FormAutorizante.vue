<template>
  <div class="flex flex-col">
    <div
      v-if="(!person || !person.apellido || isLoadingOptions) && idPersonSelected !== 'new' && idPersonSelected"
      class="flex items-center justify-center h-20"
    >
      <span class="loading loading-dots loading-lg text-primary"></span>
    </div>
    <div v-else>
      <div class="text-2xl font-semibold mb-6 text-center">
        {{ idPersonSelected == 'new' || idPersonSelected === null ? 'Agregando ' : 'Editando' }} un
        {{ nombreForm }}
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
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, watch, computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useToast } from 'vue-toastification';
import { useQueryClient } from '@tanstack/vue-query';
import { useRoute } from 'vue-router';
import * as yup from 'yup';
import { useForm } from 'vee-validate';

import MyInput from '@/common/components/elementos/MyInput.vue';
import MySelect from '@/common/components/elementos/MySelect.vue';
import ButtonGroup from '@/common/components/ButtonGroup.vue';
import useDropdownOptions from '@/migraciones/persons/composables/useDropdownOptions';

import type { Autorizante } from '../interfaces/autorizante.interface';
import usePerson from '@/migraciones/persons/composables/usePerson';
import { getPersonByDoc } from '@/migraciones/persons/composables/usePerson';
import { usePersonStore } from '@/migraciones/persons/store/personStore';
import { useOrdenStore } from '@/migraciones/ordenes/store/ordenStore';

const toast = useToast();
const { documentTypeOptions, nationalityOptions, issuerDocsOptions, loadOptions } =
  useDropdownOptions();
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
  autorizante?: number | null;
  buttons?: ButtonConfig[];
}

const props = defineProps<Props>();
const nombreForm = ref('Autorizante');

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
const isLoadingOptions = ref(true);

// Function to load all select options
const loadAllOptions = async () => {
  isLoadingOptions.value = true;
  try {
    await Promise.all([
      loadOptions('tiposdocumentos', 'descripcion'),
      loadOptions('nacionalidades', 'nombre'),
      loadOptions('sexo', 'descripcion'),
      loadOptions('emisordocs', 'descripcion')
    ]);
  } catch (error) {
    console.error('Error loading options:', error);
  } finally {
    isLoadingOptions.value = false;
  }
};

// Update the watch for autorizante
watch(() => props.autorizante, async (newVal) => {
  if (newVal) {
    person.value = null;
    isLoadingOptions.value = true;
    try {
      const [personData] = await Promise.all([
        ordenStore.getAutorizanteById(newVal),
        loadAllOptions()
      ]);
      if (personData) {
        person.value = personData;
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }
});

// Load options when component mounts
onMounted(() => {
  loadAllOptions();
});
defineExpose({ resetForm, onSubmit });
</script>

<style scoped></style>
