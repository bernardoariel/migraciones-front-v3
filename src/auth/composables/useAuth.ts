import { apiMigrationsData } from '@/api/apiMigrationsData';
import { ref } from 'vue';

export const useAuth = () => {
  const user = ref(null);
  const error = ref(null);

  const login = async (email, password) => {
    try {
      const response = await apiMigrationsData.post('/login', {
        email,
        password,
      });

      const { access_token, expiry_date, user } = response.data;

      localStorage.setItem('token', access_token);
      localStorage.setItem('expiry_date', expiry_date);

      user.value = user;
      error.value = null;
      return true;
    } catch (err) {
      error.value = err.response?.data?.error || 'Login failed';
    }
  };

  const logout = () => {
    user.value = null;
    localStorage.removeItem('token');
  };

  const isAuthenticated = () => {
    return !!localStorage.getItem('token');
  };

  const isTokenValid = () => {
    const expiryDate = localStorage.getItem('expiry_date');
    if (!expiryDate) return false;

    const now = new Date();
    return now < new Date(expiryDate);
  };
  const renewToken = async () => {
    try {
      const response = await apiMigrationsData.post(
        '/renew-token',
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        },
      );

      const { access_token, expiry_date } = response.data;

      // Actualiza el token y su fecha de expiración
      localStorage.setItem('token', access_token);
      localStorage.setItem('expiry_date', expiry_date);

      console.log('Token renovado exitosamente');
    } catch (error) {
      console.error('Error al renovar el token:', error);
      // Opcional: Redirigir al login si la renovación falla
      localStorage.removeItem('token');
      localStorage.removeItem('expiry_date');
      window.location.href = '/login';
    }
  };
  return {
    user,
    error,
    login,
    logout,
    isAuthenticated,
    isTokenValid,
    renewToken,
  };
};
