import axios, { InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { message } from 'antd';

const request = axios.create({
  baseURL: 'https://bili-monitor.june.ink',
  timeout: 10000,
});

request.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const apiKey = localStorage.getItem('apiKey');
  if (apiKey && config.headers) {
    config.headers['X-API-Key'] = apiKey;
  }
  return config;
});

request.interceptors.response.use(
  (response: AxiosResponse) => response.data,
  (error: any) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('apiKey');
      window.location.href = '/login';
      message.error('API Key 无效，请重新输入');
    } else {
      message.error('请求失败，请检查网络连接');
    }
    return Promise.reject(error);
  }
);

// 添加类型声明
declare module 'axios' {
  export interface AxiosInstance {
    get<T = any>(url: string, config?: InternalAxiosRequestConfig): Promise<T>;
    post<T = any>(url: string, data?: any, config?: InternalAxiosRequestConfig): Promise<T>;
  }
}

export default request;
