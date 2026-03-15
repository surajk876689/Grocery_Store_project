import axios from 'axios';
import { useLoadingStore } from '../store/loadingStore';
import { useNotificationStore } from '../store/notificationStore';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? '/api',
  headers: { 'Content-Type': 'application/json' },
});

apiClient.interceptors.request.use((config) => {
  useLoadingStore.getState().setLoading(true);
  return config;
});

apiClient.interceptors.response.use(
  (res) => { useLoadingStore.getState().setLoading(false); return res; },
  (err) => {
    const message = err.response?.data?.detail ?? err.response?.data?.message ?? 'Network error. Please check your connection.';
    useNotificationStore.getState().setError(message);
    useLoadingStore.getState().setLoading(false);
    return Promise.reject(err);
  }
);

export default apiClient;
