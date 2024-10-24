import axios, { InternalAxiosRequestConfig, AxiosResponse } from 'axios';

const request = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://bili-monitor.june.ink',
  timeout: 10000,
});

// 请求拦截器
request.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const encryptedApiKey = localStorage.getItem('apiKey');
    if (encryptedApiKey) {
      const apiKey = atob(encryptedApiKey); // 解密
      config.headers = config.headers || {};
      config.headers['X-API-Key'] = apiKey;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
request.interceptors.response.use(
  (response: AxiosResponse) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('apiKey');
      window.location.href = '/login';
    }
    return Promise.reject(error.response?.data || error);
  }
);

// 添加类型声明
declare module 'axios' {
  export interface AxiosInstance {
    get<T = any>(url: string, config?: InternalAxiosRequestConfig): Promise<T>;
    post<T = any>(url: string, data?: any, config?: InternalAxiosRequestConfig): Promise<T>;
    delete<T = any>(url: string, config?: InternalAxiosRequestConfig): Promise<T>;
  }
}

export default request;
