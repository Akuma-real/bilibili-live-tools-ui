export interface Subscriber {
  mid: string;
  name: string;
  status: string;
  face?: string;
  title?: string;
  room_id?: number;
  is_live?: boolean;
}

export interface MonitorConfig {
  cloudflare_domain: string;
  cloudflare_auth_code: string;
  server_chan_key: string;
  bilibili_cookies: string;
  check_interval: string;
}

export interface MonitorStatus {
  monitor_mids: string[];
  check_interval: number;
  status_cache: Record<string, {
    status: number;
    room_id: number;
    title: string;
    name: string;
  }>;
}
