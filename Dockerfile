# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app

# کپی فایل‌های پکیج
COPY package*.json ./

# نصب پکیج‌ها با محدودیت رم برای جلوگیری از کرش
RUN npm install --legacy-peer-deps --no-audit

# کپی کل پروژه
COPY . .

# اجرای بیلد - استفاده از npx برای اطمینان از پیدا شدن tsc و vite
# استفاده از NODE_OPTIONS برای محدود کردن مصرف رم نود جی‌اس در حین بیلد
RUN export NODE_OPTIONS="--max-old-space-size=1024" && npx tsc -b && npx vite build

# Stage 2: Serve
FROM nginx:alpine
# تایید کنید که پوشه خروجی Vite شما dist است (پیش‌فرض Vite همین است)
COPY --from=builder /app/dist /usr/share/nginx/html
# کپی تنظیمات انجین‌اکس (مطمئن شوید فایل nginx.conf در پروژه موجود است)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
