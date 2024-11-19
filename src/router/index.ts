import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import NuevaSolicitud from '../views/NuevaSolicitud.vue';
import MenoresView from '../views/MenoresView.vue';
import AcompaneantesView from '../views/AcompaneantesView.vue';
import AcompaneanteView from '../views/AcompaneanteView.vue';
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
      path: '/menores/new',
      name: 'MenoresNew',
      component: MenoresView,  
    },
    {
      path: '/menores/:id',
      name: 'MenoresId',
      component: MenoresView,  
    },
    {
      path: '/acompaneantes',
      name: 'Acompaneantes',
      component: AcompaneantesView,
    },
    {
      path: '/acompaneante/new',
      name: 'AcompaneanteNew',
      component: AcompaneanteView,
    },
    {
      path: '/acompaneante/:id',
      name: 'AcompaneanteId',
      component: AcompaneanteView,
    },
    {
      path: '/autorizantes',
      name: 'Autorizantes',
      component: AutorizantesView,     
    },
    {
      path: '/autorizantes/new',
      name: 'AutorizantesNew',
      component: AutorizantesView,     
    },
    {
      path: '/autorizantes/:id',
      name: 'AutorizantesId',
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
