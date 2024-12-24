import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';

import SolicitudesView from '../views/SolicitudesView.vue';
import NuevaSolicitud from '../views/NuevaSolicitud.vue';
import PersonsView from '../views/PersonsView.vue';
import LoginView from '../views/LoginView.vue';
import MainLayout from '../common/layouts/MainLayout.vue';
import AuthLayout from '../common/layouts/AuthLayout.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // Rutas con MainLayout (que incluye NavBar)
    {
      path: '/',
      component: MainLayout,
      children: [
        {
          path: '',
          name: 'Home',
          meta: { title: 'Home' },
          component: HomeView,
        },
        {
          path: '/menores',
          name: 'Menores',
          meta: { title: 'Personas' },
          component: PersonsView,
        },
        {
          path: '/acompaneantes',
          name: 'Acompaneantes',
          meta: { title: 'Personas' },
          component: PersonsView,
        },
        {
          path: '/autorizantes',
          name: 'Autorizantes',
          meta: { title: 'Personas' },
          component: PersonsView,
        },
        {
          path: '/nuevasolicitud',
          name: 'NuevaSolicitud',
          meta: { title: 'Nueva Solicitud' },
          component: NuevaSolicitud,
        },
        {
          path: '/solicitudes',
          name: 'Solicitudes',
          meta: { title: 'Solicitudes' },
          component: SolicitudesView,
        },
      ],
    },
    {
      path: '/login',
      component: AuthLayout,
      children: [
        {
          path: '',
          name: 'Login',
          meta: { title: 'Login' },
          component: LoginView,
        },
      ],
    },
  ],
});

export default router;
