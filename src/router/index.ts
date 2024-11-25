import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';

import SolicitudesView from '../views/SolicitudesView.vue';
import NuevaSolicitud from '../views/NuevaSolicitud.vue';
import PersonsView from '../views/PersonsView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: HomeView,
    },
    {
      path: '/menores',
      name: 'Menores',
      component: PersonsView,
    },
    {
      path: '/acompaneantes',
      name: 'Acompaneantes',
      component: PersonsView,
    },
    {
      path: '/autorizantes',
      name: 'Autorizantes',
      component: PersonsView,
    },
    {
      path: '/nuevasolicitud',
      name: 'NuevaSolicitud',
      component: NuevaSolicitud,
    },

    {
      path: '/solicitudes',
      name: 'Solicitudes',
      component: SolicitudesView,
    },
  ],
});

export default router;
