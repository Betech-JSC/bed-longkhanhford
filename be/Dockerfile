FROM php:8.3-fpm-bookworm

# Cài đặt các thư viện hệ thống cần thiết
RUN apt-get update && apt-get install -y \
    git \
    curl \
    zip \
    unzip

# Xóa cache apt
RUN apt-get clean && rm -rf /var/lib/apt/lists/*

# Cài đặt script helper để cài đặt extension PHP (sử dụng pre-compiled binaries giúp tránh OOM và tăng tốc độ build)
ADD https://github.com/mlocati/docker-php-extension-installer/releases/latest/download/install-php-extensions /usr/local/bin/

# Cài đặt các extension PHP cần thiết cho Laravel
RUN chmod +x /usr/local/bin/install-php-extensions && \
    MAKEFLAGS="-j1" install-php-extensions pdo_mysql mbstring exif pcntl bcmath gd zip opcache

# Cài đặt Composer
COPY --from=composer:2.5 /usr/bin/composer /usr/bin/composer

# Cài đặt Node.js và Yarn (để build assets của Admin panel)
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && npm install --global yarn \
    && yarn config set ignore-engines true

WORKDIR /var/www

# 1. Sao chép và cài đặt PHP dependencies (cache layer)
COPY composer.json composer.lock ./
COPY packages ./packages
COPY app/Helpers/Helper.php ./app/Helpers/Helper.php
RUN --mount=type=cache,target=/root/.composer/cache composer install --no-interaction --no-plugins --no-scripts --no-autoloader --no-dev --ignore-platform-reqs

# 2. Sao chép và cài đặt JS dependencies cho Admin panel (cache layer)
COPY package.json yarn.lock ./
COPY resources/Backend/js/ckeditor5 ./resources/Backend/js/ckeditor5
RUN --mount=type=cache,target=/root/.cache/yarn yarn install --frozen-lockfile --ignore-engines

# 3. Sao chép toàn bộ source code còn lại
COPY . .

# 4. Dump autoloader, tạo .env và build static assets
RUN composer dump-autoload --optimize --no-dev \
    && cp .env.example .env \
    && mkdir -p public/build/locales \
    && yarn build

# Sao lưu thư mục public để entrypoint copy vào volume khi container chạy
RUN cp -R /var/www/public /var/www/public_bootstrap

# Copy và cấp quyền cho script entrypoint
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Cấp quyền cho thư mục cache và storage
RUN chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache

EXPOSE 9000
ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["php-fpm"]
