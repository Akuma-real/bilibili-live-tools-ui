import axios from 'axios';
import type { AxiosResponse, InternalAxiosRequestConfig, AxiosError } from 'axios';

interface ApiResponse<T = any> {
  data: T;
  message?: string;
  status?: number;
}

declare global {
  interface Window {
    runtimeConfig?: {
      VITE_API_BASE_URL?: string;
    };
  }
}

const request = axios.create({
  baseURL: 'https://bili-monitor.june.ink',
  timeout: 10000,
});

request.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const apiKey = localStorage.getItem('apiKey');
    if (apiKey) {
      config.headers['X-API-Key'] = apiKey;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

request.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => response.data,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('apiKey');
      window.location.href = '/login';
    }
    return Promise.reject(error.response?.data || error);
  }
);

export default request;
