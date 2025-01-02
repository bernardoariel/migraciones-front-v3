<template>
  <div class="flex justify-between items-center w-full">
    <div class="flex items-center space-x-4">
      <!-- iCONO -->
      <div class="flex mr-4">
        <slot name="icon"></slot>
      </div>
      <!-- DATOS -->
      <div>
        <p class="text-base font-medium text-navy-700 dark:text-white">
          {{ apellido?.toUpperCase() || '' }}
          {{ segundo_apellido?.toUpperCase() || '' }},
          <span>{{ nombre || '' }} {{ otros_nombres || '' }}</span>
          <span class="ml-3 font-medium dark:text-white"
            >DNI: {{ documento || 'Sin documento' }}</span
          >
        </p>
        <p class="mt-2 text-sm text-gray-600">
          {{ tipo }} .
          <span v-if="edad">{{ edad }} {{ edad === 1 ? 'año .' : 'años .' }}</span>
        </p>
      </div>
      <!-- FIN -->
    </div>

    <!-- Dropdown de Relación -->
    <div class="flex items-center space-x-4">
      <div
        v-if="tipo === 'AUTORIZANTE'"
        class="justify-between items-center dropdown"
        ref="dropdownAutoritation"
      >
        <div
          tabindex="0"
          role="button"
          class="dropdown dropdown-top dropdown-end"
          @click="toggleDropdown('autoritation')"
        >
          <div
            tabindex="0"
            role="button"
            class="btn m-1"
            :class="autorizanteSelected !== 'Relación con el menor' ? 'btn-neutral' : ''"
          >
            {{ autorizanteSelected }}
          </div>
        </div>
        <ul
          v-show="isDropdownOpen === 'autoritation'"
          tabindex="0"
          class="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
        >
          <li v-for="autoritation in autoritations" :key="autoritation.id">
            <a @click="selectAutoritation(autoritation)">{{ autoritation.descripcion }}</a>
          </li>
        </ul>
      </div>

      <!-- Dropdown de Acreditación -->
      <div v-if="tipo === 'AUTORIZANTE'" class="flex dropdown" ref="dropdownAcreditation">
        <div
          tabindex="0"
          role="button"
          class="dropdown dropdown-top dropdown-end"
          @click="toggleDropdown('acreditation')"
        >
          <div
            tabindex="0"
            role="button"
            class="btn m-1"
            :class="acreditacionSelected !== 'Acreditación del parentezco' ? 'btn-neutral' : ''"
          >
            {{ acreditacionSelected }}
          </div>
        </div>
        <ul
          v-show="isDropdownOpen === 'acreditation'"
          tabindex="0"
          class="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
        >
          <li v-for="acreditation in acreditations" :key="acreditation.id">
            <a @click="selectAcreditation(acreditation)">{{ acreditation.descripcion }}</a>
          </li>
        </ul>
      </div>

      <!-- Botones de Editar y Eliminar -->
      <div>
        <button class="btn btn-circle btn-ghost" @click="seleccionarPerson(id, category)">
          <EditarIcon />
        </button>
        <button class="btn btn-circle btn-ghost" @click="eliminarPerson(id, category)">
          <EliminarIcon />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed } from 'vue';

import EditarIcon from '../../../common/components/iconos/EditarIcon.vue';
import EliminarIcon from '../../../common/components/iconos/EliminarIcon.vue';

import { useOrdenStore } from '@/migraciones/ordenes/store/ordenStore';

import useAutoritations from '../composables/useAutoritations';
import useAcreditations from '../composables/useAcreditations';
import { usePersonStore } from '@/migraciones/persons/store/personStore';
import { useUIStore } from '@/common/stores/uiStore';
import type { Autoritation } from '../interfaces/autoritation.interface';
import type { Autorizante } from '../../autorizantes/interfaces/autorizante.interface';

interface Props {
  id: number;
  apellido: string;
  nombre: string;
  segundo_apellido?: string;
  otros_nombres?: string;
  edad?: number | null;
  tipo: string;
  category: string;
  documento: string;
}
const props = defineProps<Props>();
const ordenStore = useOrdenStore();
const uiStore = useUIStore();
const { autoritations } = useAutoritations();
const { acreditations } = useAcreditations();
const autorizanteSelected = ref('Relación con el menor');
const acreditacionSelected = ref('Acreditación del parentezco');
const isDropdownOpen = ref<string | null>(null);
const personStore = usePersonStore();

const dropdownAutoritation = ref<HTMLElement | null>(null);
const dropdownAcreditation = ref<HTMLElement | null>(null);

const selectAutoritation = (autoritation: Autoritation) => {
  autorizanteSelected.value = autoritation.descripcion;
  ordenStore.updateAutorizante(props.id, { authorizing_relatives_id: autoritation.id });
  isDropdownOpen.value = null;
};

const selectAcreditation = (acreditation: any) => {
  acreditacionSelected.value = acreditation.descripcion;
  ordenStore.updateAutorizante(props.id, { accreditation_links_id: acreditation.id });
  isDropdownOpen.value = null;
};

const toggleDropdown = (dropdown: string) => {
  isDropdownOpen.value = isDropdownOpen.value === dropdown ? null : dropdown;
};

const eliminarPerson = (idPerson: number, category: string) => {
  ordenStore.removePerson(category, idPerson);
};
// SelectedPersonOrden.vue
const seleccionarPerson = async (idPerson: number, category: any) => {
  console.log('seleccionarPerson', idPerson, category);
  personStore.setCategory(category);
  personStore.setPersonId(idPerson);
  uiStore.setShowPersonForm(true);
};

const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as Node;
  if (
    dropdownAutoritation.value &&
    !dropdownAutoritation.value.contains(target) &&
    dropdownAcreditation.value &&
    !dropdownAcreditation.value.contains(target)
  ) {
    isDropdownOpen.value = null;
  }
};
const storedAutorizanteData = computed(() => {
  const autorizante = ordenStore.autorizantes.find((a: Autorizante) => a.id === props.id);
  return {
    authorizing_relatives_id: autorizante?.authorizing_relatives_id,
    accreditation_links_id: autorizante?.accreditation_links_id,
  };
});

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});
onMounted(async () => {
  // Get stored autoritation
  if (storedAutorizanteData.value.authorizing_relatives_id) {
    const autoritation = autoritations.value.find(
      (a) => a.id === storedAutorizanteData.value.authorizing_relatives_id,
    );
    if (autoritation) {
      autorizanteSelected.value = autoritation.descripcion;
    }
  }

  // Get stored acreditation
  if (storedAutorizanteData.value.accreditation_links_id) {
    const acreditation = acreditations.value.find(
      (a) => a.id === storedAutorizanteData.value.accreditation_links_id,
    );
    if (acreditation) {
      acreditacionSelected.value = acreditation.descripcion;
    }
  }
});
onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<style scoped></style>
