<template>
  <div class="flex flex-col">
    <form @submit="onSubmit" class="space-y-4">
      <!-- Primera Fila -->
      <div class="grid grid-cols-3 gap-4">
        <label class="flex flex-col gap-1 w-full">
          <span class="text-sm font-medium text-gray-700">Fecha de Instrumento</span>
          <input
            type="date"
            v-model="dateOfInstrumento"
            :class="[
              'input input-bordered w-full',
              errors.dateOfInstrumento
                ? 'border-red-500 focus:ring-red-500'
                : 'focus:ring-blue-500',
            ]"
            placeholder="Fecha de Instrumento"
            v-bind="dateOfInstrumentoAttrs"
          />
          <span class="text-red-400 text-sm" v-if="errors.dateOfInstrumento">{{
            errors.dateOfInstrumento
          }}</span>
        </label>

        <MyInput
          v-model="numeroActuacion"
          v-bind="numeroActuacionAttrs"
          :error="meta.touched ? errors.numeroActuacion : undefined"
          label="Nro. Actuacion Certificación de Firma"
          placeholder="Nro. Actuación Certificación de Firma"
          type="number"
        />

        <label class="flex flex-col gap-1 w-full">
          <span class="text-sm font-medium text-gray-700">Tipo de Instrumento</span>
          <select
            v-model="instrumentoType"
            :class="[
              'select select-bordered w-full',
              errors.instrumentoType ? 'border-red-500 focus:ring-red-500' : 'focus:ring-blue-500',
            ]"
          >
            <option disabled value="">Seleccione</option>
            <option
              v-for="option in instrumentoTypeOptions"
              :key="option.value"
              :value="option.value"
            >
              {{ option.label }}
            </option>
          </select>
          <span class="text-red-400 text-sm" v-if="errors.instrumentoType">{{
            errors.instrumentoType
          }}</span>
        </label>
      </div>

      <!-- Segunda Fila -->
      <div class="grid grid-cols-3 gap-4">
        <label class="flex flex-col gap-1 w-full">
          <span class="text-sm font-medium text-gray-700">Cualquier Pais</span>
          <select
            v-model="paisType"
            :class="[
              'select select-bordered w-full',
              errors.paisType ? 'border-red-500 focus:ring-red-500' : 'focus:ring-blue-500',
            ]"
          >
            <option disabled value="">Seleccione</option>
            <option v-for="option in paisOptions" :key="option.value" :value="option.value">
              {{ option.label }}
            </option>
          </select>
          <span class="text-red-400 text-sm" v-if="errors.paisType">{{ errors.paisType }}</span>
        </label>

        <MyInput
          v-model="paisDescripcion"
          v-bind="paisDescripcionAttrs"
          :error="errors.paisDescripcion"
          label="Paises descripcion"
          placeholder="Paises descripcion"
          :disabled="isPaisDescripcionDisabled"
        />
      </div>

      <!-- Tercera Fila -->
      <div class="grid grid-cols-3 gap-4">
        <label class="flex flex-col gap-1 w-full">
          <span class="text-sm font-medium text-gray-700">¿Hasta mayoría de edad?</span>
          <select
            v-model="mayoriaEdad"
            :class="[
              'select select-bordered w-full',
              errors.mayoriaEdad ? 'border-red-500 focus:ring-red-500' : 'focus:ring-blue-500',
            ]"
          >
            <option disabled value="">Seleccione</option>
            <option v-for="option in mayoriaEdadOptions" :key="option.value" :value="option.value">
              {{ option.label }}
            </option>
          </select>
          <span class="text-red-400 text-sm" v-if="errors.mayoriaEdad">{{
            errors.mayoriaEdad
          }}</span>
        </label>

        <label class="flex flex-col gap-1">
          <span class="text-sm font-medium text-gray-700">Fecha desde</span>
          <input
            type="date"
            v-model="dateOfInit"
            :class="[
              'input input-bordered w-full',
              errors.dateOfInit ? 'border-red-500 focus:ring-red-500' : 'focus:ring-blue-500',
            ]"
            placeholder="Fecha desde"
            v-bind="dateOfInitAttrs"
          />
          <span class="text-red-400 text-sm" v-if="errors.dateOfInit">{{ errors.dateOfInit }}</span>
        </label>

        <label class="flex flex-col gap-1">
          <span class="text-sm font-medium text-gray-700">Fecha hasta</span>
          <input
            type="date"
            v-model="dateOfEnd"
            :class="[
              'input input-bordered w-full',
              errors.dateOfEnd ? 'border-red-500 focus:ring-red-500' : 'focus:ring-blue-500',
            ]"
            placeholder="Fecha hasta"
            v-bind="dateOfEndAttrs"
            :disabled="isDateDisabled"
          />
          <span class="text-red-400 text-sm" v-if="errors.dateOfEnd">{{ errors.dateOfEnd }}</span>
        </label>
      </div>

      <!-- Botón -->
      <div class="flex justify-end">
        <button type="submit" class="btn btn-primary" :disabled="!isFormValid">
          Generar solicitud
        </button>
      </div>
    </form>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, watch, computed } from 'vue';
import * as yup from 'yup';
import { useForm } from 'vee-validate';

import MyInput from '@/common/components/elementos/MyInput.vue';
import MySelect from '@/common/components/elementos/MySelect.vue';

import { usePersonStore } from '@/migraciones/persons/store/personStore';
import { storeToRefs } from 'pinia';
import { useToast } from 'vue-toastification';

import { useRouter } from 'vue-router';

import useOrden from '@/migraciones/ordenes/composables/useOrden';
import { useOrdenStore } from '../store/ordenStore';

const toast = useToast();

const ordenStore = useOrdenStore();
const { menor, autorizantes, acompaneantes } = storeToRefs(ordenStore);

interface Props {
  nroSolicitud?: number | null;
}

const props = defineProps<Props>();

const mayoriaEdadAnos = 21;
const isDateDisabled = computed(() => mayoriaEdad.value === 'y');
const isPaisDescripcionDisabled = computed(() => paisType.value === 'y');
const router = useRouter();
const isFormValid = ref(false);
const validationSchema = computed(() => {
  return yup.object({
    numeroActuacion: yup
      .string()
      .matches(/^\d+$/, 'El número de actuación debe contener solo números')
      .required('El número de actuación es requerido')
      .min(3, 'El número de actuación debe tener al menos 3 caracteres'),
    instrumentoType: yup.string().required().oneOf(['P', 'D']),
    paisType: yup.string().required().oneOf(['y', 'n']),
    mayoriaEdad: yup.string().required().oneOf(['y', 'n']),
    dateOfInit: yup.string().required('La fecha desde es requerida.'),
    dateOfEnd: yup.string().required('La fecha hasta es requerida.'),
  });
});

const { defineField, errors, handleSubmit, meta, resetForm, setValues } = useForm({
  validationSchema,
});
const [dateOfInstrumento, dateOfInstrumentoAttrs] = defineField('dateOfInstrumento');
const [numeroActuacion, numeroActuacionAttrs] = defineField('numeroActuacion');
const [instrumentoType, instrumentoTypeAttrs] = defineField('instrumentoType');
const [paisType, paisTypeAttrs] = defineField('paisType');
const [paisDescripcion, paisDescripcionAttrs] = defineField('paisDescripcion');
const [mayoriaEdad, mayoriaEdadAttrs] = defineField('mayoriaEdad');
const [dateOfEnd, dateOfEndAttrs] = defineField('dateOfEnd');
const [dateOfInit, dateOfInitAttrs] = defineField('dateOfInit');

const instrumentoTypeOptions = ref([
  { label: 'PAPEL', value: 'P' },
  { label: 'DIGITAL', value: 'D' },
]);
const paisOptions = ref([
  { label: 'SI', value: 'y' },
  { label: 'NO', value: 'n' },
]);
const mayoriaEdadOptions = ref([
  { label: 'SI', value: 'y' },
  { label: 'NO', value: 'n' },
]);

const personStore = usePersonStore();
const { getIdPersonSelected } = storeToRefs(personStore);
const idPersonSelected = getIdPersonSelected;
const effectiveId = computed(() => props.nroSolicitud ?? idPersonSelected.value);

const isSubmitting = ref(false);

const { orden, createOrden } = useOrden(effectiveId);

watch(orden, (newOrden) => {
  if (newOrden) {
    setValues({
      numeroActuacion: newOrden.numero_actuacion_notarial_cert_firma,
      instrumentoType: newOrden.instrumento,
      paisType: newOrden.cualquier_pais,
      mayoriaEdad: newOrden.vigencia_hasta_mayoria_edad,
      dateOfInstrumento: newOrden.fecha_del_instrumento || new Date().toISOString().split('T')[0],
      paisDescripcion: newOrden.paises_desc,
      dateOfInit: newOrden.fecha_vigencia_desde,
      dateOfEnd: newOrden.fecha_vigencia_hasta,
    });
  }
});

const onSubmit = handleSubmit(async (values) => {
  if (isSubmitting.value) return;
  isSubmitting.value = true;
  const menorSelected = menor.value?.id || null;
  const autorizante1 = autorizantes.value?.[0] || null;
  const autorizante2 = autorizantes.value?.[1] || null;

  const acompaneantesList = acompaneantes.value?.map((item: any) => ({ id: item.id })) || [];
  const payload = {
    numero_actuacion_notarial_cert_firma: values.numeroActuacion,
    instrumento: values.instrumentoType,
    cualquier_pais: values.paisType,
    paises_desc: 'argenytfgt',
    vigencia_hasta_mayoria_edad: values.mayoriaEdad,
    fecha_del_instrumento: values.dateOfInstrumento,
    fecha_vigencia_desde: values.dateOfInit,
    fecha_vigencia_hasta: values.dateOfEnd,
    notary_id: 2,
    minor_id: menorSelected,
    autorizante1_id: autorizante1,
    autorizante2_id: autorizante2,
    acompaneantes: acompaneantesList,
    serie_foja: 'A',
    tipo_foja: '0',
    nro_foja: '0',
  };
  try {
    await createOrden(payload);

    toast.success('Solicitud enviada con éxito');
    ordenStore.resetOrden();
    router.push('/solicitudes');
  } catch (error) {
    console.error('Error al guardar en el store:', error);
    toast.error('Error al guardar la solicitud');
  } finally {
    isSubmitting.value = false;
  }
});
const handleMayoriaEdadChange = (value: string) => {
  if (value === 'y' && menor.value?.fecha_de_nacimiento) {
    const fechaNacimiento = new Date(menor.value.fecha_de_nacimiento);
    const fechaMayoriaEdad = new Date(
      fechaNacimiento.getFullYear() + mayoriaEdadAnos,
      fechaNacimiento.getMonth(),
      fechaNacimiento.getDate(),
    );

    // Asignar directamente al v-model del campo 'Fecha hasta'
    setValues({ dateOfEnd: fechaMayoriaEdad.toISOString().split('T')[0] });
  } else {
    // Si selecciona 'No', limpiar el campo de fecha hasta
    setValues({ dateOfEnd: '' });
  }
};

onMounted(async () => {
  if (effectiveId.value === 'new') {
    resetForm();
  }
  const today = new Date().toISOString().split('T')[0];
  resetForm({
    values: {
      dateOfInstrumento: today, // Inicializa vacío
      instrumentoType: 'P',
      numeroActuacion: '',
      paisType: 'n',
      paisDescripcion: '',
      mayoriaEdad: 'n',
      dateOfInit: today,
      dateOfEnd: '',
    },
  });

  dateOfInit.value = dateOfInstrumento.value;
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
watch(paisType, (newValue) => {
  if (newValue === 'y') {
    paisDescripcion.value = '';
  }
});

defineExpose({ resetForm, onSubmit });
</script>

<style scoped></style>
