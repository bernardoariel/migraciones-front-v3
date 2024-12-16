<template>
  <div
    class="!z-5 relative flex h-full w-full flex-col rounded-[20px] bg-white bg-clip-border p-4 shadow-3xl shadow-shadow-500 dark:!bg-navy-800 dark:text-white dark:shadow-none"
  >
    <div class="mb-8 w-full">
      <h3 class="text-2xl font-bold text-navy-700 dark:text-white">Generación de Autorización</h3>
      <p class="mt-2 text-base text-gray-600">
        En esta tarjeta se mostrarán las personas seleccionadas que formarán la solicitud de
        autorización en Migraciones.
      </p>
    </div>
    <h4 class="text-xl font-bold text-navy-700 dark:text-white">¿Quién es el menor a autorizar?</h4>

    <div
      v-if="menor"
      class="flex w-full items-center justify-between rounded-2xl bg-white p-3 shadow-3xl shadow-shadow-500 dark:!bg-navy-700 dark:shadow-none"
    >
      <SelectedPersonOrden
        :id="menor.id!"
        :apellido="menor.apellido"
        :edad="calculateAge(menor.fecha_de_nacimiento)"
        :nombre="menor.nombre"
        :otros_nombres="menor.otros_nombres"
        :segundo_apellido="menor.segundo_apellido"
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
          :id="autorizante.id!"
          :apellido="autorizante.apellido"
          :edad="calculateAge(autorizante.fecha_de_nacimiento)"
          :nombre="autorizante.nombre"
          :otros_nombres="autorizante.otros_nombres"
          :segundo_apellido="autorizante.segundo_apellido"
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
          :id="acompaneante.id!"
          :apellido="acompaneante.apellido"
          :edad="null"
          :nombre="acompaneante.nombre"
          :otros_nombres="acompaneante.otros_nombres"
          :segundo_apellido="acompaneante.segundo_apellido"
          tipo="ACOMPAÑANTE"
          category="acompaneantes"
        >
          <template #icon>
            <AcompaneanteIcon />
          </template>
        </SelectedPersonOrden>
      </div>
    </div>
    <div class="divider"></div>
    <FormSolicitud />
    <div class="divider"></div>
    <div v-if="false">
      <h1>No existen personas ingresadas en esta orden</h1>
    </div>
  </div>
</template>

<script setup lang="ts">
import AutorizanteIcon from '@/common/components/iconos/AutorizanteIcon.vue';
import { useOrdenStore } from '../store/ordenStore';
import { storeToRefs } from 'pinia';

import { calculateAge } from '../helpers/calculateAge';

import SelectedPersonOrden from './SelectedPersonOrden.vue';
import BabyIcon from './iconos/BabyIcon.vue';
import AcompaneanteIcon from './iconos/AcompaneanteIcon.vue';
import FormSolicitud from '@/migraciones/ordenes/components/FormSolicitud.vue';

const ordenStore = useOrdenStore();
const { menor, autorizantes, acompaneantes } = storeToRefs(ordenStore);
</script>

<style lang="scss" scoped></style>
