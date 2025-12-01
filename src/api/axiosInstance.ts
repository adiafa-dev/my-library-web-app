import { APIConfiguration } from '@/config/api.config';
import axios from 'axios';

const apiInstance = axios.create({
  baseURL: APIConfiguration.baseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// ==========================
// RESPONSE INTERCEPTOR
// ==========================
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

// ==========================
// REQUEST INTERCEPTOR
// ==========================
apiInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');

  if (token) {
    // FIX: pakai setHeader via AxiosHeaders
    config.headers = config.headers || {};

    // TS FIX → force menjadi Record<string, string>
    (
      config.headers as Record<string, string>
    ).Authorization = `Bearer ${token}`;
  }

  return config;
});

export default apiInstance;
