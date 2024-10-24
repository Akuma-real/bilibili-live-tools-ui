// API 相关类型定义
export interface User {
  id: number;
  username: string;
  token?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface ConfigResponse {
  cloudflare_domain: string;
  cloudflare_auth_code: string;
  server_chan_key: string;
  bilibili_cookies: string;
  check_interval: string;
}

export interface LiverInfo {
  uid: number;
  name: string;
  room_id: number;
  is_live: boolean;
  live_status: number;
  live_time?: string;
  title?: string;
  area_name?: string;
  online?: number;
  face?: string;  // 添加头像属性
}

export interface MonitorConfig {
  cloudflare_domain?: string;
  cloudflare_auth_code?: string;
  server_chan_key?: string;
  bilibili_cookies?: string;
  check_interval?: number;
}

export interface HTTPValidationError {
  detail: {
    loc: string[];
    msg: string;
    type: string;
  }[];
}

// 添加新的类型定义
export interface LiverStatus {
  status: number;
  room_id: number;
  title: string;
  name: string;
  timestamp: number;
}

export interface MonitorStatus {
  monitor_mids: string[];
  check_interval: number;
  status_cache: {
    [key: string]: LiverStatus;
  };
}
