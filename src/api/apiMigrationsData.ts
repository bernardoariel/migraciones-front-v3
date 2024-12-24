import axios from 'axios';

const apiMigrationsData = axios.create({
  baseURL: 'http://localhost:8000/api',
});
apiMigrationsData.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
export { apiMigrationsData };
