import { APIConfiguration } from '@/config/api.config';
import axios from 'axios';

const apiInstance = axios.create({
  baseURL: APIConfiguration.baseUrl,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

// Intercept response buat refresh token nanti (optional dulu)
apiInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

apiInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiInstance;
