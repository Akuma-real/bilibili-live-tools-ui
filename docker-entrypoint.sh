#!/bin/sh

# 替换 index.html 中的环境变量
envsubst < /usr/share/caddy/index.html > /usr/share/caddy/index.html.tmp
mv /usr/share/caddy/index.html.tmp /usr/share/caddy/index.html

# 执行 CMD
exec "$@"
