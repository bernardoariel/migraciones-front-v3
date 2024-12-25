<template>
  <div class="flex items-center">
    <slot name="icon"></slot>
    <div class="ml-4">
      <p class="text-base font-medium text-navy-700 dark:text-white">
        {{ apellido?.toUpperCase() || '' }}
        {{ segundo_apellido?.toUpperCase() || '' }},
        <span>{{ nombre || '' }} {{ otros_nombres || '' }}</span>
      </p>
      <p class="mt-2 text-sm text-gray-600">
        {{ tipo }} .
        <span v-if="edad">{{ edad }} {{ edad && edad == 1 ? ' año .' : ' años .' }}</span>
      </p>
    </div>
  </div>
  <div class="mr-4 flex items-center justify-center text-gray-600 dark:text-white">
    <div v-if="tipo === 'AUTORIZANTE'" class="dropdown">
      <div
        tabindex="0"
        role="button"
        class="btn btn-xs m-1 btn-success"
        @click="toggleDropdown('autoritation')"
      >
        {{ autorizanteSelected }}
      </div>
      <ul tabindex="0" class="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
        <li v-for="autoritation of autoritations" :key="autoritation.id">
          <a @click="selectAutoritation(autoritation)">{{ autoritation.descripcion }}</a>
        </li>
      </ul>
    </div>
    <div v-if="tipo === 'AUTORIZANTE'" class="dropdown">
      <div tabindex="0" role="button" class="btn btn-xs m-1 btn-warning">
        {{ acreditacionSelected }}
      </div>
      <ul tabindex="0" class="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
        <li v-for="acreditation of acreditations" :key="acreditation.id">
          <a @click="selectAcreditation(acreditation)">{{ acreditation.descripcion }}</a>
        </li>
      </ul>
    </div>
    <button class="btn btn-circle btn-ghost" @click="seleccionarPerson(id, category)">
      <EditarIcon />
    </button>
    <button class="btn btn-circle btn-ghost" @click="eliminarPerson(id, category)">
      <EliminarIcon />
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import EditarIcon from '../../../common/components/iconos/EditarIcon.vue';
import EliminarIcon from '../../../common/components/iconos/EliminarIcon.vue';

import { useOrdenStore } from '@/migraciones/ordenes/store/ordenStore';
import type { Autoritation } from '../interfaces/autoritation.interface';
import type { Acreditation } from '../interfaces/acreditations.interface';
import useAutoritations from '../composables/useAutoritations';
import useAcreditations from '../composables/useAcreditations';
import { usePersonStore } from '@/migraciones/persons/store/personStore';

interface Props {
  id: number;
  apellido: string;
  nombre: string;
  segundo_apellido?: string;
  otros_nombres?: string;
  edad?: null | number;
  tipo: string;
  category: string;
}
const props = defineProps<Props>();
const ordenStore = useOrdenStore();
const { autoritations } = useAutoritations();
const { acreditations } = useAcreditations();
const autorizanteSelected = ref('Relación con el menor');
const acreditacionSelected = ref('Acreditación del parentezco');
const isDropdownOpen = ref<string | null>(null);
const personStore = usePersonStore();

const selectAutoritation = (autoritation: Autoritation) => {
  autorizanteSelected.value = autoritation.descripcion;

  // Busca al autorizante por ID en el store y actualiza el valor de authorizing_relatives_id
  const autorizante = ordenStore.autorizantes.find((aut: any) => aut.id === props.id);
  if (autorizante) {
    ordenStore.updateAutorizante(props.id, {
      authorizing_relatives_id: autoritation.id,
    });
  }
  isDropdownOpen.value = null;
};

const selectAcreditation = (acreditation: Acreditation) => {
  acreditacionSelected.value = acreditation.descripcion;

  // Busca al autorizante por ID en el store y actualiza el valor de accreditation_links_id
  const autorizante = ordenStore.autorizantes.find((aut: any) => aut.id === props.id);
  if (autorizante) {
    ordenStore.updateAutorizante(props.id, {
      accreditation_links_id: acreditation.id,
    });
  }
  isDropdownOpen.value = null;
};
const toggleDropdown = (dropdown: string) => {
  isDropdownOpen.value = isDropdownOpen.value === dropdown ? null : dropdown;
};
const eliminarPerson = (idPerson: number, category: string) => {
  ordenStore.removePerson(category, idPerson);
};
const seleccionarPerson = (idPerson: number, category: string) => { 
  personStore.setPersonId(idPerson);
 
};
</script>

<style scoped></style>
