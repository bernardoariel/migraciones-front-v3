import axios from 'axios';

const apiSalesData = axios.create({
  baseURL: 'http://localhost:8000',
});

export { apiSalesData };
