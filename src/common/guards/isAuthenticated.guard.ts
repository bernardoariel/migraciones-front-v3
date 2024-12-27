import { useAuth } from '../../auth/composables/useAuth';
import { apiMigrationsData } from '@/api/apiMigrationsData';

export const isAuthenticated = async (to, from, next) => {
  const { isTokenValid } = useAuth();
  const token = localStorage.getItem('token');

  if (token && isTokenValid()) {
    try {
      // Validar el token con el backend
      const response = await apiMigrationsData.get('/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Si la respuesta es exitosa, permite la navegación
      if (response.status === 200) {
        next();
      }
    } catch (error) {
      console.error('Error al validar el token:', error);

      // Si hay un error (por ejemplo, 401), redirige al login
      localStorage.removeItem('token');
      localStorage.removeItem('expiry_date');
      next({ name: 'Login' });
    }
  } else {
    // Si no hay token o es inválido, redirige al login
    localStorage.removeItem('token');
    localStorage.removeItem('expiry_date');
    next({ name: 'Login' });
  }
};
