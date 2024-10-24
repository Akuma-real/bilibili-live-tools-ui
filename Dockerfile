# 构建阶段
FROM node:20-alpine AS builder

# 设置工作目录
WORKDIR /app

# 安装 pnpm
RUN npm install -g pnpm

# 复制 package.json
COPY package.json ./

# 安装依赖
RUN pnpm install

# 复制源代码和配置文件
COPY . .

# 构建应用
RUN pnpm build

# 生产阶段
FROM caddy:2-alpine

# 复制构建产物
COPY --from=builder /app/dist /usr/share/caddy
COPY Caddyfile /etc/caddy/Caddyfile

# 添加环境变量替换脚本
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

# 暴露端口
EXPOSE 80

# 使用启动脚本
ENTRYPOINT ["/docker-entrypoint.sh"]
