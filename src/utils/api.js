import axios from 'axios';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';

// 1. Setup Notifications
export const notyf = new Notyf({
  duration: 3000,
  position: { x: 'right', y: 'top' },
  types: [
    { type: 'success', background: '#ffbf00', icon: false },
    { type: 'error', background: '#ff0000', icon: false }
  ]
});

// 2. Create Axios Instance using the .env variable
const api = axios.create({
  // This automatically pulls the URL from your .env file
  baseURL: import.meta.env.VITE_API_BASE_URL 
});

// 3. Request Interceptor (Adds Token automatically)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;