import axios from 'axios';

const apiMigrationsData = axios.create({
  baseURL: 'http://localhost:8000/api',
});

axios.interceptors.request.use(
  async (config) => {
    const expiryDate = localStorage.getItem('expiry_date');
    if (expiryDate) {
      const now = new Date();
      const expiry = new Date(expiryDate);
      if (now > expiry) {
        // Si el token ha expirado, redirige al usuario a la página de inicio de sesión
        localStorage.removeItem('token');
        localStorage.removeItem('expiry_date');
        window.location.href = '/login';
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
