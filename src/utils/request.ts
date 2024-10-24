import axios from 'axios';
import type { AxiosRequestConfig } from 'axios';

const request = axios.create({
  baseURL: '/api',
  timeout: 10000,
});

// 请求拦截器
request.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    const encryptedApiKey = localStorage.getItem('apiKey');
    if (encryptedApiKey) {
      const apiKey = atob(encryptedApiKey); // 解密
      config.headers = {
        ...config.headers,
        'X-API-Key': apiKey
      };
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
request.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('apiKey');
      window.location.href = '/login';
    }
    return Promise.reject(error.response?.data || error);
  }
);

export default request;
