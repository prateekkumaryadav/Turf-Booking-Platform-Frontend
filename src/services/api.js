import axios from 'axios';

// Use relative path for all environments.
// - In dev, Vite proxies /api to http://localhost:5001
// - In prod, Nginx proxies /api to http://backend:5001
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
