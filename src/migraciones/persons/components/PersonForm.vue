<template>
  <div class="flex flex-col">
    <div v-if="isLoadingOptions" class="flex items-center justify-center h-screen">
      <p class="text-3xl font-semibold mb-4 text-primary">Cargando</p>
      <span class="loading loading-dots loading-lg text-primary ml-2"></span>
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
        <template v-if="!isAcompaneante">
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
        </template>
        <!-- Buttons -->
        <p>¿Formulario válido?: {{ meta.valid }}</p>
        <ButtonGroup :buttons="buttons!" />
      </form>
      <div v-if="Object.keys(errors).length">
        <p class="text-red-500 font-bold">Errores de validación:</p>
        <pre>{{ errors }}</pre>
      </div>
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

import usePerson from '@/migraciones/persons/composables/usePerson';
import { getPersonByDoc } from '@/migraciones/persons/composables/usePerson';
import { usePersonStore } from '@/migraciones/persons/store/personStore';

import type { Autorizante } from '../../autorizantes/interfaces/autorizante.interface';
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
  autorizante?: number | 'new' | null;
  buttons?: ButtonConfig[];
}

const props = defineProps<Props>();

const errorDoc = ref('');
const route = useRoute();
const isFormValid = ref(false);
const validationSchema = computed(() => {
  return yup.object({
    documentNumber: yup
      .string()
      .matches(/^\d+$/)
      .required('El número de documento es requerido')
      .min(3, 'El documento debe tener al menos 3 caracteres'),
    documentType: yup
      .number()
      .required('El tipo de documento es requerido')
      .oneOf(documentTypeOptions.value.map((opt) => opt.value)),
    documentIssuer: yup
      .number()
      .required('El emisor del documento es requerido')
      .oneOf(issuerDocsOptions.value.map((opt) => opt.value)),
    lastName: yup.string().required('El apellido es requerido'),
    secondLastName: yup.string(),
    firstName: yup
      .string()
      .required('El nombre es requerido')
      .min(3, 'El nombre debe tener al menos 3 caracteres'),
    otherNames: yup.string(),

    // Validación condicional para nationality
    nationality: yup
      .number()
      .when([], {
        is: () => getActiveCategory.value !== 'acompaneantes',
        then: (schema) => schema.required('La nacionalidad es requerida'),
        otherwise: (schema) => schema.optional(),
      })
      .oneOf(
        nationalityOptions.value.map((opt) => opt.value),
        'Valor no válido',
      ),

    // Validación condicional para sex
    sex: yup
      .string()
      .when([], {
        is: () => getActiveCategory.value !== 'acompaneantes',
        then: (schema) => schema.required('El sexo es requerido'),
        otherwise: (schema) => schema.optional(),
      })
      .oneOf(['1', '2'], 'Valor no válido'),

    address: yup.string(),

    dateOfBirht: yup.string().when([], {
      is: () => getActiveCategory.value !== 'acompaneantes',
      then: (schema) => schema.required('La fecha de nacimiento es requerida'),
      otherwise: (schema) => schema.optional(),
    }),
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
const { getIdPersonSelected, getActiveCategory } = storeToRefs(personStore);

const categoryNameMap: Record<string, string> = {
  menores: 'Menor',
  autorizantes: 'Autorizante',
  acompaneantes: 'Acompañante',
};
const nombreForm = ref('');

const idPersonSelected = getIdPersonSelected;
const effectiveId = computed(() => props.autorizante ?? idPersonSelected.value);

const isSubmitting = ref(false);
const isAcompaneante = computed(() => {
  return getActiveCategory.value === 'acompaneantes';
});
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
watch(person,async (newPerson) => {
  if (newPerson) {
    // await loadAllOptions();
    
    console.log('Person data:', {
      nationality: newPerson.nationality_id,
      sex: newPerson.sex_id
    })
    const formData = {
      documentNumber: String(newPerson.numero_de_documento),
      documentType: Number(newPerson.type_document_id),
      lastName: String(newPerson.apellido),
      secondLastName: String(newPerson.segundo_apellido || ''),
      firstName: String(newPerson.nombre),
      otherNames: String(newPerson.otros_nombres || ''),
      nationality: Number(newPerson.nationality_id),
      sex: String(newPerson.sex_id),
      address: String(newPerson.domicilio),
      dateOfBirht: String(newPerson.fecha_de_nacimiento),
      documentIssuer: Number(newPerson.issuer_document_id)
    };

    console.log('Setting values:', formData);
    setValues(formData);
    
    console.log('After setValues - new form values:', meta.value);
  }
}, { immediate: true });

const onSubmit = handleSubmit(async (values) => {
  if (isSubmitting.value) return;
  
  try {
    isSubmitting.value = true;
    const category = getActiveCategory.value;
    
    const payload = {
      numero_de_documento: values.documentNumber,
      type_document_id: values.documentType,
      apellido: values.lastName,
      segundo_apellido: values.secondLastName,
      nombre: values.firstName,
      otros_nombres: values.otherNames,
      nationality_id: values.nationality,
      sex_id: values.sex,
      domicilio: values.address,
      fecha_de_nacimiento: values.dateOfBirht,
      issuer_document_id: values.documentIssuer
    };

    if (effectiveId.value === 'new') {
      await createPerson(payload);
      toast.success('Persona creada exitosamente');
      resetForm();
    } else {
      await updatePerson(payload);
      toast.success('Persona actualizada exitosamente');
    }

    queryClient.invalidateQueries({ queryKey: [category] });
  } catch (error) {
    console.error('Error:', error);
    toast.error('Error al procesar el formulario');
  } finally {
    isSubmitting.value = false;
  }
});

const isLoadingOptions = ref(true);
onMounted(() => {
  loadAllOptions();
  setValues({
    documentType: documentTypeOptions.value[0]?.value || 4,
    documentIssuer: issuerDocsOptions.value[0]?.value || 13,
    nationality: nationalityOptions.value[0]?.value || 11,
    sex: sexType.value[0]?.value || null,
  });
  if (effectiveId.value === 'new' || effectiveId.value === null) {
    resetForm({
      values: {
        documentType: documentTypeOptions.value[0]?.value || 4,
        documentIssuer: issuerDocsOptions.value[0]?.value || 13,
        nationality: nationalityOptions.value[0]?.value || 11,
        sex: sexType.value[0]?.value || null,
        documentNumber: '',
        lastName: '',
        secondLastName: '',
        firstName: '',
        otherNames: '',
        address: '',
        dateOfBirht: '',
      },
    });
  }
});

watch(getActiveCategory, async (newCategory) => {
  if (newCategory) {
    await loadAllOptions();
  }
});
const loadAllOptions = async () => {
  isLoadingOptions.value = true;
  try {
    await Promise.all([
      loadOptions('tiposdocumentos', 'descripcion'),
      loadOptions('nacionalidades', 'nombre'),
      loadOptions('sexos', 'descripcion'),
      loadOptions('emisordocumentos', 'descripcion'),
    ]);
  } catch (error) {
    console.error('Error loading options:', error);
  } finally {
    isLoadingOptions.value = false;
  }
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
    resetForm();
  }
});
watch(
  getActiveCategory,
  (newCategory) => {
    nombreForm.value = categoryNameMap[newCategory!] || ''; // Usa el mapa para obtener el nombre
  },
  { immediate: true }, // Ejecuta inmediatamente con el valor inicial
);
defineExpose({ resetForm, onSubmit });

</script>

<style scoped></style>
