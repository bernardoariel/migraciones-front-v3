import axios from 'axios';

const apiMigrationsData = axios.create({
  baseURL: 'http://localhost:8000',
});

export { apiMigrationsData };