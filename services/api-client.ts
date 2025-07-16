import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://elite-backend-production.up.railway.app/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

console.log('API Client configured with baseURL:', process.env.NEXT_PUBLIC_API_URL || 'https://elite-backend-production.up.railway.app/api');

// Interceptor para añadir el token de autenticación en cada petición
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('Request with token:', config.url);
    } else {
      console.log('Request without token:', config.url);
    }
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores de autenticación
apiClient.interceptors.response.use(
  (response) => {
    console.log('Response success:', response.config.url, response.status);
    return response;
  },
  (error) => {
    console.error('Response error:', error.config?.url, error.response?.status, error.message);
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;