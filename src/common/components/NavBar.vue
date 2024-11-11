<template>
  <div class="navbar bg-slate-100">
    <div class="flex-none">
      <router-link :to="{ name: 'NuevaSolicitud' }" class="btn btn-ghost text-xl"
        >Nueva Solicitud</router-link
      >
    </div>
    <div class="flex-1">
      <router-link :to="{ name: 'Menores' }" class="btn btn-ghost text-xl">Menores</router-link>
      <router-link :to="{ name: 'Autorizantes' }" class="btn btn-ghost text-xl"
        >Autorizantes</router-link
      >
      <router-link :to="{ name: 'Acompaneantes' }" class="btn btn-ghost text-xl"
        >Acompañantes</router-link
      >
      <router-link :to="{ name: 'Solicitudes' }" class="btn btn-ghost text-xl"
        >Solicitudes</router-link
      >
    </div>
    <div class="flex-none">
      <button class="btn btn-square btn-ghost">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          class="inline-block h-5 w-5 stroke-current"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
          ></path>
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped></style>
