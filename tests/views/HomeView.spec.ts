import { mount } from '@vue/test-utils';
import HomeView from '@/views/HomeView.vue';

describe('HomeView.vue', () => {
  test('debe renderizar correctamente el título', () => {
    const wrapper = mount(HomeView, {
      global: {
        stubs: {
          'router-link': true,
        },
      },
    });
    expect(wrapper.find('h1').text()).toBe('¿Qué deseas hacer hoy?');
  });

  test('debe habilitar el primer botón y deshabilitar los demás en la sección de opciones', () => {
    const wrapper = mount(HomeView, {
      global: {
        stubs: {
          'router-link': true,
        },
      },
    });
    const buttons = wrapper.findAll('.join-item');

    expect(buttons[0].attributes('checked')).toBeDefined();
    expect(buttons[1].attributes('disabled')).toBeDefined();
    expect(buttons[2].attributes('disabled')).toBeDefined();
  });

  test('debe tener los enlaces de navegación configurados correctamente', () => {
    const wrapper = mount(HomeView, {
      global: {
        stubs: {
          'router-link': {
            props: ['to'],
            template: '<a :href="to"><slot /></a>',
          },
        },
      },
    });

    const routerLinks = wrapper.findAllComponents({ name: 'RouterLink' });

    const expectedRoutes = [
      { name: 'NuevaSolicitud' },
      { name: 'Solicitudes' },
      { name: 'Menores' },
      { name: 'Autorizantes' },
      { name: 'Acompaneantes' },
    ];

    routerLinks.forEach((link, index) => {
      expect(link.props().to).toEqual(expectedRoutes[index]);
    });
  });

  test('los enlaces de router-link deben contener las clases esperadas', () => {
    const wrapper = mount(HomeView, {
      global: {
        stubs: {
          'router-link': true,
        },
      },
    });

    const routerLinks = wrapper.findAllComponents({ name: 'RouterLink' });

    routerLinks.forEach((link) => {
      expect(link.classes()).toContain('btn');
      expect(link.classes()).toContain('bg-gray-200');
      expect(link.classes()).toContain('rounded-md');
      expect(link.classes()).toContain('text-center');
    });
  });
});
