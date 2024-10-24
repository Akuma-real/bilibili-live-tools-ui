#!/bin/sh

# 创建运行时配置
cat > /usr/share/caddy/config.js << EOF
window.runtimeConfig = {
  VITE_API_BASE_URL: "${VITE_API_BASE_URL:-https://bili-monitor.june.ink}"
};
EOF

# 注入配置到 index.html
sed -i 's|</head>|<script src="/config.js"></script></head>|' /usr/share/caddy/index.html

# 启动 Caddy
exec caddy run --config /etc/caddy/Caddyfile
