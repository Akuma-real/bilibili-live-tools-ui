FROM node:20-alpine AS deps

WORKDIR /app

# 复制 package.json
COPY package.json ./

# 安装 pnpm 并生成 pnpm-lock.yaml
RUN npm install -g pnpm && \
    pnpm install

FROM node:20-alpine AS builder

WORKDIR /app

# 安装必要的工具
RUN npm install -g pnpm typescript

# 从 deps 阶段复制 node_modules 和 package.json
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/package.json ./

# 复制所有源代码和配置文件
COPY . .

# 添加类型声明文件
RUN pnpm install && \
    pnpm build

FROM caddy:2-alpine

# 安装 envsubst 工具
RUN apk add --no-cache gettext

# 复制构建产物
COPY --from=builder /app/dist /usr/share/caddy

# 添加环境变量替换脚本
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

# 设置入口点
ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["caddy", "run", "--config", "/etc/caddy/Caddyfile", "--adapter", "caddyfile"]
