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
      <div class="flex items-center">
        <BabyIcon />
        <div class="ml-4">
          <p class="text-base font-medium text-navy-700 dark:text-white">
            {{ menor.apellido?.toUpperCase() || '' }}
            {{ menor.segundo_apellido?.toUpperCase() || '' }},
            <span>{{ menor.nombre || '' }} {{ menor.otros_nombres || '' }}</span>
          </p>
          <p class="mt-2 text-sm text-gray-600">
            MENOR. <span>{{ calculateAge(menor.fecha_de_nacimiento) }} </span>
            {{ calculateAge(menor.fecha_de_nacimiento) === 1 ? ' año.' : ' años.' }}
          </p>
        </div>
      </div>
      <div class="mr-4 flex items-center justify-center text-gray-600 dark:text-white">
        <button class="btn btn-circle btn-ghost">
          <EditarIcon />
        </button>
        <button class="btn btn-circle btn-ghost">
          <EliminarIcon />
        </button>
      </div>
    </div>
    <div class="divider"></div>
    <h4 class="text-xl font-bold text-navy-700 dark:text-white">¿Quién son los Autorizantes?</h4>

    <div
      v-if="autorizantes.length"
      class="flex w-full items-center justify-between rounded-2xl bg-white p-3 shadow-3xl shadow-shadow-500 dark:!bg-navy-700 dark:shadow-none"
    >
      <div v-for="autorizante of autorizantes" :key="autorizante.numero_de_documento">
        <div class="flex items-center">
          <AutorizanteIcon />
          <div class="ml-4">
            <p class="text-base font-medium text-navy-700 dark:text-white">
              {{ autorizante.apellido?.toUpperCase() || '' }}
              {{ autorizante.segundo_apellido?.toUpperCase() || '' }},
              <span>{{ autorizante.nombre || '' }} {{ autorizante.otros_nombres || '' }}</span>
            </p>
            <p class="mt-2 text-sm text-gray-600">
              AUTORIZANTE. <span>{{ calculateAge(autorizante.fecha_de_nacimiento) }}</span> años
              <span class="ml-5">PADRE</span>
            </p>
          </div>
        </div>
        <div class="mr-4 flex items-center justify-center text-gray-600 dark:text-white">
          <button class="btn btn-circle btn-ghost">
            <EditarIcon />
          </button>
        </div>
      </div>
    </div>

    <div class="divider"></div>
    <h4 class="text-xl font-bold text-navy-700 dark:text-white">¿Quién son los Acompañantes?</h4>
    <div
      v-if="acompaneantes.length"
      class="flex w-full items-center justify-between rounded-2xl bg-white p-3 shadow-3xl shadow-shadow-500 dark:!bg-navy-700 dark:shadow-none"
    >
      <div v-for="acompaneante of acompaneantes" :key="acompaneante.numero_de_documento">
        <div class="flex items-center">
          <acompaneanteIcon />
          <div class="ml-4">
            <p class="text-base font-medium text-navy-700 dark:text-white">
              {{ acompaneante.apellido?.toUpperCase() || '' }}
              {{ acompaneante.segundo_apellido?.toUpperCase() || '' }},
              <span>{{ acompaneante.nombre || '' }} {{ acompaneante.otros_nombres || '' }}</span>
            </p>
            <p class="mt-2 text-sm text-gray-600">ACOMPAÑANTE.</p>
          </div>
        </div>
        <div class="mr-4 flex items-center justify-center text-gray-600 dark:text-white">
          <button class="btn btn-circle btn-ghost">
            <EditarIcon />
          </button>
        </div>
      </div>
    </div>
    <div class="divider"></div>
    <div v-if="false">
      <h1>No existen personas ingresadas en esta orden</h1>
    </div>
  </div>
</template>

<script setup lang="ts">
import AcompaneanteIcon from '@/common/components/iconos/AcompaneanteIcon.vue';
import EditarIcon from '@/common/components/iconos/EditarIcon.vue';
import AutorizanteIcon from '@/common/components/iconos/AutorizanteIcon.vue';
import BabyIcon from './iconos/BabyIcon.vue';
import { useOrdenStore } from '../store/ordenStore';
import { storeToRefs } from 'pinia';
import PlusIcon from '@/common/components/iconos/PlusIcon.vue';
import { calculateAge } from '../helpers/calculateAge';
import EliminarIcon from './iconos/EliminarIcon.vue';
const ordenStore = useOrdenStore();
const { menor, autorizantes, acompaneantes, hasItems } = storeToRefs(ordenStore);
</script>

<style lang="scss" scoped></style>
