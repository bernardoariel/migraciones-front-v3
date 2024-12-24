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

      user.value = response.data.user;
      localStorage.setItem('token', response.data.access_token);

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

  return {
    user,
    error,
    login,
    logout,
    isAuthenticated,
  };
};
