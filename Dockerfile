FROM node:20-alpine AS builder
RUN echo "nameserver 8.8.8.8" > /etc/resolv.conf
RUN npm config set registry https://registry.npmmirror.com
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install --legacy-peer-deps --no-audit --silent
RUN npm install -g typescript

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]