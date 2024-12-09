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
      <MyInput
        v-model="paisDescripcion"
        v-bind="paisDescripcionAttrs"
        :error="errors.paisDescripcion"
        label="Paises descripcion"
        placeholder="Paises descripcion"
      />

      <MySelect
        v-model="mayoriaEdad"
        v-bind="mayoriaEdadAttrs"
        :error="errors.mayoriaEdad"
        label="¿ Hasta mayoria de edad ?"
        :options="mayoriaEdadOptions"
      />

      <label class="input input-bordered flex items-center gap-2">
        <span>Fecha desde </span>
        <input
          type="date"
          v-model="dateOfInit"
          :class="['form-control', errors.dateOfInit ? 'border-red-500' : '']"
          placeholder="Fecha desde"
          v-bind="dateOfInitAttrs"
        />
      </label>
      <label class="input input-bordered flex items-center gap-2">
        <span>Fecha hasta </span>
        <input
          type="date"
          v-model="dateOfEnd"
          :class="['form-control', errors.dateOfBirht ? 'border-red-500' : '']"
          placeholder="Fecha hasta"
          v-bind="dateOfEndAttrs"
        />
      </label>
      <button type="submit" class="btn btn-primary">Generar solicitud</button>
    </form>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, watch, computed } from 'vue';
import * as yup from 'yup';
import { useForm } from 'vee-validate';

import MyInput from '@/common/components/elementos/MyInput.vue';
import MySelect from '@/common/components/elementos/MySelect.vue';

import { usePersonStore } from '@/common/store/personStore';
import { storeToRefs } from 'pinia';
import { useToast } from 'vue-toastification';
import { useQueryClient } from '@tanstack/vue-query';
import { useRoute } from 'vue-router';
import { useOrdenStore } from '../../../../common/store/ordenStore';
import useOrden from '../../../../common/composables/useOrden';
import type { OrdenSolicitud } from '@/common/interfaces/orders.interface';
import type { Solicitud } from '../interface/solicitud.interface';
import { apiMigrationsData } from '@/api/apiMigrationsData';

const toast = useToast();

const ordenStore = useOrdenStore();

interface Props {
  nroSolicitud?: number | null;
}

const props = defineProps<Props>();
const nombreForm = ref('SolicitudForm');

const route = useRoute();
const isFormValid = ref(false);
const validationSchema = computed(() => {
  return yup.object({
    numeroActuacion: yup.number().required().min(3),
    instrumentoType: yup.string().required().oneOf(['P', 'D']),
    paisType: yup.string().required().oneOf(['y', 'n']),
    mayoriaEdad: yup.string().required().oneOf(['y', 'n']),
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

const queryClient = useQueryClient();
const { orden, createOrden, updateOrden } = useOrden(effectiveId);
console.log('orden::: ', orden.value);

watch(orden, (newOrden) => {
  if (newOrden) {
    setValues({
      numeroActuacion: newOrden.numero_actuacion_notarial_cert_firma,
      instrumentoType: newOrden.instrumento,
      paisType: newOrden.cualquier_pais,
      mayoriaEdad: newOrden.vigencia_hasta_mayoria_edad,
      dateOfInstrumento: newOrden.fecha_del_instrumento,
      paisDescripcion: newOrden.paises_desc,
      dateOfEnd: newOrden.fecha_vigencia_hasta,
      dateOfInit: newOrden.fecha_vigencia_desde,
    });
  }
});

const onSubmit = handleSubmit(async (values) => {
  if (isSubmitting.value) return;
  isSubmitting.value = true;
  const payload = {
    numero_actuacion_notarial_cert_firma: values.numeroActuacion,
    instrumento: values.instrumentoType,
    cualquier_pais: values.paisType,
    paises_desc: 'argenytfgt', // Ajusta según el formulario
    vigencia_hasta_mayoria_edad: values.mayoriaEdad,
    fecha_del_instrumento: values.dateOfInstrumento,
    fecha_vigencia_desde: values.dateOfInit,
    fecha_vigencia_hasta: values.dateOfEnd,
    notary_id: 2, // Debe ajustarse a los valores dinámicos
    minor_id: 14, // Debe ajustarse a los valores dinámicos
    autorizante1_id: 28, // Debe ajustarse a los valores dinámicos
    acompaneantes: [{ id: 1 }], // Ajusta según los datos reales
    serie_foja: 'A',
    tipo_foja: '0',
    nro_foja: '0',
    authorizing_relatives_id: 3, // Ajusta según los datos reales
  };
  try {
    const response = await createOrden(payload);

    console.log('response::: ', response);
    toast.success('Solicitud enviada con éxito');
  } catch (error) {
    console.error('Error al guardar en el store:', error);
    toast.error('Error al guardar la solicitud');
  } finally {
    isSubmitting.value = false; // Marca el envío como finalizado
  }
});

onMounted(async () => {
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
