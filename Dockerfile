# Stage 1: Build React app
FROM node:22.18.0-bullseye AS builder
WORKDIR /app

COPY package.json ./ 
RUN rm -rf node_modules || true
RUN npm install --legacy-peer-deps

COPY . .
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine

# پاک کردن html قدیمی
RUN rm -rf /usr/share/nginx/html/*

# کپی build React
COPY --from=builder /app/dist /usr/share/nginx/html

# کپی فایل کانفیگ Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
