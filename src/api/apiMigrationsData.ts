import axios from 'axios';
import { useAuth } from '../auth/composables/useAuth';

const apiMigrationsData = axios.create({
  baseURL: 'http://localhost:8000/api',
});

const { renewToken } = useAuth();

axios.interceptors.request.use(
  async (config) => {
    const expiryDate = localStorage.getItem('expiry_date');
    if (expiryDate) {
      const now = new Date();
      const expirationTime = new Date(expiryDate).getTime();
      const timeLeft = expirationTime - now.getTime();

      if (timeLeft <= 5 * 60 * 1000) {
        // Si queda menos de 5 minutos
        await renewToken();
      }
    }

    // Añade el token a todas las solicitudes
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);
export { apiMigrationsData };
