import { useAuth } from '../../auth/composables/useAuth';
import { apiMigrationsData } from '@/api/apiMigrationsData';

export const NotAuthenticated = async (to, from, next) => {
  const { isTokenValid } = useAuth();
  const token = localStorage.getItem('token');

  if (!token || !isTokenValid()) {
    next();
  } else {
    try {
      // Validar el token con el backend
      const response = await apiMigrationsData.get('/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Si el token es válido, redirige al Home
      if (response.status === 200) {
        next({ name: 'Home' });
      }
    } catch (error) {
      console.error('Error al validar el token:', error);

      // Si el token no es válido en el backend, permite la navegación
      localStorage.removeItem('token');
      localStorage.removeItem('expiry_date');
      next();
    }
  }
};
