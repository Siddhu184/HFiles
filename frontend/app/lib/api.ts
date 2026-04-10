import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:7001/api',
});

api.interceptors.request.use((config) => {
  if (!config.headers) config.headers = {};
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (typeof window !== 'undefined') {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:7001/api';
      console.error(`API Error (${apiUrl}):`, error.message, error.config?.url);
    }
    return Promise.reject(error);
  }
);

export default api;