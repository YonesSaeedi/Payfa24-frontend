# مرحله اول: بیلد پروژه
FROM node:20-alpine AS builder
WORKDIR /app

# کپی فایل‌های پکیج
COPY package.json package-lock.json ./

# نصب پکیج‌ها (بدون نصب مجدد و جداگانه تایپ‌اسکریپت)
RUN npm install --legacy-peer-deps --no-audit

# کپی کل پروژه
COPY . .

# اجرای بیلد (تایپ‌اسکریپت اینجا توسط خودِ ری‌اکت استفاده می‌شود)
RUN npm run build

# مرحله دوم: سرو کردن با Nginx
FROM nginx:alpine

# کپی فایل‌های بیلد شده از مرحله قبل
# اگر در لاگ خطا داد که پوشه dist وجود ندارد، آن را به build تغییر دهید
COPY --from=builder /app/dist /usr/share/nginx/html

# کپی تنظیمات Nginx شما
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
