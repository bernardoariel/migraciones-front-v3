<template>
  <div class="flex flex-col">
    <div class="text-2xl font-semibold mb-6 text-center">
      {{ isNew ? 'Agregando' : 'Editando' }} {{ nombreForm }}
    </div>

    <form @submit.prevent="onSubmit" class="space-y-4">
      <!-- Campos básicos -->
      <MyInput
        v-model="formData.documentNumber"
        :label="'Documento'"
        :error="errors.documentNumber"
        placeholder="Ingrese el Documento"
        type="number"
        @blur="checkDniExistence"
      />
      <MySelect
        v-model="formData.documentType"
        :options="documentTypeOptions"
        :label="'Tipo de Documento'"
        :error="errors.documentType"
      />
      <MyInput
        v-model="formData.lastName"
        :label="'Apellido'"
        :error="errors.lastName"
        placeholder="Ingrese el Apellido"
      />
      <MyInput
        v-model="formData.firstName"
        :label="'Nombre'"
        :error="errors.firstName"
        placeholder="Ingrese el Nombre"
      />

      <!-- Slot para campos adicionales -->
      <slot />

      <!-- Botones -->
      <ButtonGroup :buttons="buttons" />
    </form>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, computed } from 'vue';
import { useForm } from 'vee-validate';
import * as yup from 'yup';
import MyInput from '@/common/components/elementos/MyInput.vue';
import MySelect from '@/common/components/elementos/MySelect.vue';
import ButtonGroup from '@/common/components/ButtonGroup.vue';

const props = defineProps({
  nombreForm: { type: String, required: true },
  buttons: { type: Array, required: true },
  initialData: { type: Object, required: true },
  documentTypeOptions: { type: Array, required: true },
});

const emit = defineEmits(['submit']);

const isNew = computed(() => !props.initialData.id);

const validationSchema = yup.object({
  documentNumber: yup.string().required(),
  documentType: yup.string().required(),
  lastName: yup.string().required(),
  firstName: yup.string().required(),
});

const { defineField, errors, handleSubmit } = useForm({
  validationSchema,
  initialValues: props.initialData,
});

const [formData, fieldAttrs] = defineField();

const onSubmit = handleSubmit((values) => {
  emit('submit', values);
});
</script>
