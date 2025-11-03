FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install --legacy-peer-deps --no-audit --silent
RUN npm install typescript -D

COPY . .
RUN npm run build

FROM nginx:alpine
# کپی فایل‌های build شده
COPY --from=builder /app/dist /usr/share/nginx/html
# کپی nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
