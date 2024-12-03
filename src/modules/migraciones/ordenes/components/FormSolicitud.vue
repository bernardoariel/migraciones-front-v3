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
    instrumentoType: yup.string().required().oneOf(['1', '2']),
    paisType: yup.string().required().oneOf(['1', '2']),
    mayoriaEdad: yup.string().required().oneOf(['1', '2']),
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
  { label: 'PAPEL', value: '1' },
  { label: 'DIGITAL', value: '2' },
]);
const paisOptions = ref([
  { label: 'SI', value: '1' },
  { label: 'NO', value: '2' },
]);
const mayoriaEdadOptions = ref([
  { label: 'SI', value: '1' },
  { label: 'NO', value: '2' },
]);

const personStore = usePersonStore();
const { getIdPersonSelected } = storeToRefs(personStore);
const idPersonSelected = getIdPersonSelected;
const effectiveId = computed(() => props.nroSolicitud ?? idPersonSelected.value);

const isSubmitting = ref(false);

const queryClient = useQueryClient();
const { orden, createOrden, updateOrden } = useOrden(effectiveId);

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

const onSubmit = handleSubmit(async (value) => {
  console.log('value::: ', value);
  if (isSubmitting.value) return;
  isSubmitting.value = true;
  try {
    const payload: Partial<OrdenSolicitud> = {
      numero_actuacion_notarial_cert_firma: value.numeroActuacion,
      instrumento: value.instrumentoType,
      cualquier_pais: value.paisType,
      vigencia_hasta_mayoria_edad: value.mayoriaEdad,
      fecha_del_instrumento: value.dateOfInstrumento,
      paises_desc: value.paisDescripcion,
      fecha_vigencia_hasta: value.dateOfEnd,
      fecha_vigencia_desde: value.dateOfInit,
    };
    if (effectiveId.value === null || effectiveId.value === 'new') {
      const resp = await createOrden(payload);
      if (route.path.includes('solicitud')) {
        ordenStore.getPerson('autorizantes', resp.id);
        toast.success('Autorizante Agregado a la solicitud');
      }
      toast.success('Autorizante creado exitosamente');
    } else {
      await updateOrden(payload);
      toast.success('Autorizante actualizado exitosamente');
    }

    queryClient.invalidateQueries({ queryKey: ['orders'] });
  } catch (error) {
    isSubmitting.value = false;
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
