<template>
  <div
    class="!z-5 relative flex h-full w-full flex-col rounded-[20px] bg-white bg-clip-border p-4 shadow-3xl shadow-shadow-500 dark:!bg-navy-800 dark:text-white dark:shadow-none"
  >
    <div class="mb-2 w-full">
      <div class="flex justify-between items-center">
        <h3 class="text-2xl font-bold text-navy-700 dark:text-white">Generación de Autorización</h3>
        <div class="flex space-x-2 mr-12">
          <div
            class="tooltip tooltip-left cursor-pointer"
            :data-tip="tips.menor"
            @click="showModal('menor')"
          >
            <div class="avatar placeholder">
              <div class="text-neutral-content w-8 rounded-full" :class="` bg-${menorClass}`">
                <BabyIcon color="white" height="25" width="25" />
              </div>
            </div>
          </div>
          <div
            class="tooltip tooltip-bottom cursor-pointer"
            :data-tip="tips.autorizantes"
            @click="showModal('autorizantes')"
          >
            <div class="avatar placeholder">
              <div
                class="text-neutral-content w-8 rounded-full"
                :class="` bg-${autorizantesClass}`"
              >
                <AutorizanteIcon color="white" height="25" width="25" />
              </div>
            </div>
          </div>
          <div
            class="tooltip tooltip-bottom cursor-pointer"
            :data-tip="tips.acompaneantes"
            @click="showModal('acompaneantes')"
          >
            <div class="avatar placeholder">
              <div class="w-8 rounded-full" :class="` bg-${acompaneantesClass}`">
                <AcompaneanteIcon color="white" height="25" width="25" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <p class="mt-2 text-base text-gray-600">
        En esta tarjeta se mostrarán las personas seleccionadas que formarán la solicitud de
        autorización en Migraciones.
      </p>
    </div>
    <div role="tablist" class="tabs tabs-lifted">
      <input type="radio" name="my_tabs_2" role="tab" class="tab" aria-label="Personas" checked />
      <div role="tabpanel" class="tab-content bg-base-100 border-base-300 rounded-box p-6">
        <h4 class="text-xl mb-3 font-bold text-navy-700 dark:text-white">
          ¿Quién es el menor a autorizar?
        </h4>
        <div v-if="menor">
          <SelectedPersonOrden
            :id="menor.id"
            :apellido="menor.apellido"
            :edad="calculateAge(menor.fecha_de_nacimiento)"
            :nombre="menor.nombre"
            :documento="menor.numero_de_documento || 'Sin documento'"
            tipo="MENOR"
            category="menores"
          >
            <template #icon>
              <BabyIcon />
            </template>
          </SelectedPersonOrden>
        </div>
        <div class="divider"></div>
        <h4 class="text-xl font-bold text-navy-700 dark:text-white mb-4">
          ¿Quién son los Autorizantes?
        </h4>
        <div v-if="autorizantes.length" class="space-y-4">
          <div
            v-for="autorizante of autorizantes"
            :key="autorizante.numero_de_documento"
            class="flex items-center justify-between"
          >
            <SelectedPersonOrden
              :id="autorizante.id"
              :apellido="autorizante.apellido"
              :nombre="autorizante.nombre"
              :documento="autorizante.numero_de_documento || 'Sin documento'"
              tipo="AUTORIZANTE"
              category="autorizantes"
            >
              <template #icon>
                <AutorizanteIcon />
              </template>
            </SelectedPersonOrden>
          </div>
        </div>

        <div class="divider"></div>
        <h4 class="text-xl font-bold text-navy-700 dark:text-white mb-4">
          ¿Quién son los Acompañantes?
        </h4>
        <div v-if="acompaneantes.length" class="space-y-4">
          <div
            v-for="acompaneante of acompaneantes"
            :key="acompaneante.numero_de_documento"
            class="flex items-center justify-between"
          >
            <SelectedPersonOrden
              :id="acompaneante.id || 0"
              :apellido="acompaneante.apellido || 'Sin apellido'"
              :nombre="acompaneante.nombre || 'Sin nombre'"
              :documento="acompaneante.numero_de_documento || 'Sin documento'"
              tipo="ACOMPAÑANTE"
              category="acompaneantes"
            >
              <template #icon>
                <AcompaneanteIcon />
              </template>
            </SelectedPersonOrden>
          </div>
        </div>
        <div v-if="false">
          <h1>No existen personas ingresadas en esta orden</h1>
        </div>
      </div>

      <input type="radio" name="my_tabs_2" role="tab" class="tab" aria-label="Solicitud" />
      <div role="tabpanel" class="tab-content bg-base-100 border-base-300 rounded-box p-6">
        <FormSolicitud />
      </div>
    </div>
    <ModalDialog ref="modalRef" :title="title" :message="message" @confirm="handleConfirm">
      <template #buttons>
        <button class="btn btn-primary" @click="closeModal">Aceptar</button>
      </template>
    </ModalDialog>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import AutorizanteIcon from '@/migraciones/persons/assets/AutorizanteIcon.vue';
import { storeToRefs } from 'pinia';
import { calculateAge } from '../../../common/helpers/calculateAge';

import { useOrdenStore } from '../store/ordenStore';
import BabyIcon from '../../persons/assets/BabyIcon.vue';
import SelectedPersonOrden from '../../persons/components/SelectedPersonOrden.vue';
import AcompaneanteIcon from '../../persons/assets/AcompaneanteIcon.vue';
import FormSolicitud from '@/migraciones/ordenes/components/FormSolicitud.vue';
import ModalDialog from '@/common/components/ModalDialog.vue';
const title = ref('');
const message = ref('');
const modalRef = ref();
const ordenStore = useOrdenStore();

const { menor, autorizantes, acompaneantes } = storeToRefs(ordenStore);

const menorClass = computed(() => {
  if (!ordenStore.menor) {
    return 'error'; // Clase inicial
  }
  return 'success'; // Cambia a success si hay datos
});

const autorizantesClass = computed(() => {
  if (!ordenStore.autorizantes || ordenStore.autorizantes.length === 0) {
    return 'error'; // Clase inicial
  }
  const count = ordenStore.autorizantes.length;
  return count === 1 ? 'warning' : 'success';
});

const acompaneantesClass = computed(() => {
  if (!ordenStore.acompaneantes || ordenStore.acompaneantes.length === 0) {
    return 'error'; // Clase inicial
  }
  return 'success';
});

const handleConfirm = () => {
  console.log('Confirmación recibida');
  modalRef.value?.closeModal(); // Cerrar el modal después de confirmar, si es necesario
};

const closeModal = () => {
  modalRef.value?.closeModal(); // Método expuesto por el modal
};
// Tips predefinidos
const tips = computed(() => ({
  menor: ordenStore.menor ? 'Menor seleccionado correctamente' : 'Debe seleccionar un menor',
  autorizantes:
    ordenStore.autorizantes.length === 0
      ? 'No hay autorizantes seleccionados.'
      : `Hay ${ordenStore.autorizantes.length} autorizante(s) seleccionado(s)`,
  acompaneantes:
    ordenStore.acompaneantes.length >= 1
      ? 'Acompañante(s) seleccionado(s)'
      : 'No hay acompañantes seleccionados',
}));
const showModal = (type: string) => {
  switch (type) {
    case 'menor':
      title.value = 'Información de Menor';
      message.value = 'Para completar la solicitud se necesita un menor.';
      break;
    case 'autorizantes':
      title.value = 'Información de Autorizantes';
      message.value = 'Para completar la solicitud se necesita como mínimo un menor.';
      break;
    case 'acompaneantes':
      title.value = 'Información de Acompañante';
      message.value =
        'Para completar la solicitud no es necesario tener un acompañante.\n' +
        'Si se autoriza al menor a viajar solo, no necesita un acompañante, pero si se autoriza a viajar con acompañante necesita cargar los acompañantes.';
      break;
    default:
      title.value = 'Información';
      message.value = 'Por favor, verifica los datos.';
      break;
  }
  modalRef.value?.showModal();
};
</script>

<style lang="scss" scoped></style>
