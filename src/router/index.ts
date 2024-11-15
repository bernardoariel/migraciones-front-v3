import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import NuevaSolicitud from '../views/NuevaSolicitud.vue';
import MenoresView from '../views/MenoresView.vue';
import AcompañantesView from '../views/AcompañantesView.vue';
import AutorizantesView from '../views/AutorizantesView.vue';
import SolicitudesView from '../views/SolicitudesView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: HomeView,
    },
    {
      path: '/nuevasolicitud',
      name: 'NuevaSolicitud',
      component: NuevaSolicitud,
    },
    {
      path: '/menores',
      name: 'Menores',
      component: MenoresView,
    },
    {
      path: '/acompaneantes',
      name: 'Acompaneantes',
      component: AcompañantesView,
    },
    {
      path: '/autorizantes',
      name: 'Autorizantes',
      component: AutorizantesView,
    },
    {
      path: '/solicitudes',
      name: 'Solicitudes',
      component: SolicitudesView,
    },
  ],
});

export default router;
