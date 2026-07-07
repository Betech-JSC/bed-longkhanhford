#!/bin/sh
set -e

# 1. Sao chép assets từ bản build sạch vào shared public volume để Nginx đọc
if [ -d "/var/www/public_bootstrap" ]; then
    echo "Copying fresh backend build assets to the shared public volume..."
    cp -rp /var/www/public_bootstrap/. /var/www/public/
fi

# 2. Tạo liên kết lưu trữ (storage:link) và kiểm tra APP_KEY
echo "Creating storage symlink..."
php artisan storage:link --force || true

if [ -z "$APP_KEY" ] && ! grep -q "APP_KEY=base64:" /var/www/.env; then
    echo "APP_KEY is not defined. Generating Laravel application key..."
    php artisan key:generate --force
fi

# 3. Tối ưu hóa hiệu năng (Cache config, routes, views) cho môi trường Production
if [ "$APP_ENV" = "production" ]; then
    echo "Caching configuration and routes for production..."
    php artisan config:cache
    php artisan route:cache
    php artisan view:cache
fi

# 4. Đợi database sẵn sàng và chạy migration tự động
echo "Running database migrations..."
for i in $(seq 1 10); do
    if php artisan migrate --force; then
        echo "Database migrations completed successfully."
        break
    else
        echo "Database migration failed, retrying in 5 seconds (attempt $i/10)..."
        sleep 5
    fi
done

# 5. Chạy command mặc định của container (php-fpm)
echo "Starting application command..."
exec "$@"
