import { useAuth } from '../../auth/composables/useAuth';
export const isAuthenticated = (to, from, next) => {
  const { isTokenValid } = useAuth();
  const token = localStorage.getItem('token');
  const isValid = isTokenValid();
  if (token && isValid) {
    next();
  } else {
    localStorage.removeItem('token');
    localStorage.removeItem('expiry_date');
    next({ name: 'Login' });
  }
};
