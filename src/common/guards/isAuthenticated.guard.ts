import { useAuth } from '../../auth/composables/useAuth';
import { apiMigrationsData } from '@/api/apiMigrationsData';
import { useAppStore } from '../stores/appStore';

export const isAuthenticated = async (to, from, next) => {
  const appStore = useAppStore();
  const { isTokenValid } = useAuth();
  const token = localStorage.getItem('token');

  if (token && isTokenValid()) {
    try {
      appStore.setLoading(true); // Activa el spinner
      const response = await apiMigrationsData.get('/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        next(); // Permite la navegación
      }
    } catch (error) {
      console.error('Error al validar el token:', error);
      localStorage.removeItem('token');
      next({ name: 'Login' });
    } finally {
      appStore.setLoading(false); // Desactiva el spinner
    }
  } else {
    localStorage.removeItem('token');
    next({ name: 'Login' });
  }
};
