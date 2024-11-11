<template>
  <div class="flex items-center justify-center min-h-screen">
    <div class="text-center">
      <h1 class="text-3xl font-semibold mb-4">¿Qué deseas hacer hoy?</h1>

      <div class="join flex justify-center mb-6">
        <input
          class="join-item btn px-4 py-2"
          type="radio"
          name="options"
          aria-label="Migraciones"
          checked
        />
        <input
          class="join-item btn px-4 py-2 bg-gray-200"
          type="radio"
          name="options"
          aria-label="Firma Digital"
          disabled
        />
        <input
          class="join-item btn px-4 py-2 bg-gray-200"
          type="radio"
          name="options"
          aria-label="Mis Facturas"
          disabled
        />
      </div>

      <div class="grid gap-4">
        <router-link
          :to="{ name: 'NuevaSolicitud' }"
          class="btn bg-gray-200 px-6 py-2 rounded-md text-center"
        >
          Nueva Solicitud
        </router-link>
        <router-link
          :to="{ name: 'Solicitudes' }"
          class="btn bg-gray-200 px-6 py-2 rounded-md text-center"
        >
          Solicitudes
        </router-link>
        <router-link
          :to="{ name: 'Menores' }"
          class="btn bg-gray-200 px-6 py-2 rounded-md text-center"
        >
          Menores
        </router-link>
        <router-link
          :to="{ name: 'Autorizantes' }"
          class="btn bg-gray-200 px-6 py-2 rounded-md text-center"
        >
          Autorizantes
        </router-link>
        <router-link
          :to="{ name: 'Acompaneantes' }"
          class="btn bg-gray-200 px-6 py-2 rounded-md text-center"
        >
          Acompañantes
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped></style>
