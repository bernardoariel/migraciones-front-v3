import { useAuth } from '../../auth/composables/useAuth';
export const NotAuthenticated = (to, from, next) => {
  const { isTokenValid } = useAuth();
  const token = localStorage.getItem('token');
  const isValid = isTokenValid();

  if (!token || !isValid) {
    next();
  } else {
    next({ name: 'Home' });
  }
};
