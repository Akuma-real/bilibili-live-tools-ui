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
  monitor_mids: string;
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
}

export interface MonitorConfig {
  monitor_mids: string[];  // 监控的主播 UID 列表
  check_interval: number;  // 监控间隔（秒）
  bilibili_cookies?: string;  // B站 Cookies
  server_chan_key?: string;  // Server酱推送 Key
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
