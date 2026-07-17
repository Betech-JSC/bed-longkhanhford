# Hướng dẫn Triển khai (Deploy) Laravel Backend lên VPS Ubuntu

Tài liệu này hướng dẫn chi tiết từng bước thiết lập môi trường VPS Ubuntu sạch, cài đặt các dịch vụ cần thiết (Nginx, PHP 8.4, MySQL, SSL Certbot) và deploy source code backend của dự án **Long Khanh Ford**.

---

## 📌 Tổng quan các bước thực hiện
1. [Chuẩn bị VPS & Cập nhật hệ thống](#1-chuẩn-bị-vps--cập-nhật-hệ-thống)
2. [Cài đặt PHP 8.4 & Nginx](#2-cài-đặt-php-84--nginx)
3. [Cài đặt & Cấu hình MySQL](#3-cài-đặt--cấu-hình-mysql)
4. [Tải mã nguồn dự án & Phân quyền](#4-tải-mã-nguồn-dự-án--phân-quyền)
5. [Cấu hình Nginx Virtual Host & Trỏ Domain](#5-cấu-hình-nginx-virtual-host--trỏ-domain)
6. [Cấu hình SSL Let's Encrypt với Certbot](#6-cấu-hình-ssl-lets-encrypt-với-certbot)
7. [Thiết lập Laravel (.env, Composer, Key, Database)](#7-thiết-lập-laravel-env-composer-key-database)
8. [Cấu hình Cronjob & Supervisor (Hàng đợi Queue)](#8-cấu-hình-cronjob--supervisor-hàng-đợi-queue)

---

## ⚠️ Lưu ý quan trọng khi VPS đang chạy nhiều dự án khác (Shared VPS)

Nếu VPS của bạn đang vận hành nhiều website/dự án khác nhau, hãy tuyệt đối tuân thủ các quy tắc sau để tránh gây ảnh hưởng đến các dự án hiện tại:

1. **Không làm ảnh hưởng đến các phiên bản PHP khác:**
   - Việc cài thêm PHP 8.4 là hoàn toàn song song (co-exist) với các phiên bản cũ (PHP 7.x, 8.1, 8.2...).
   - **Tránh thay đổi PHP mặc định của CLI** (trừ khi cần thiết). Trong các lệnh cài đặt Laravel và chạy Artisan/Composer, hãy dùng rõ đường dẫn phiên bản PHP 8.4:
     - Dùng `php8.4 /usr/local/bin/composer install ...` thay vì `composer install`
     - Dùng `php8.4 artisan ...` thay vì `php artisan ...`
2. **Không ghi đè hoặc xóa cấu hình Default của Nginx:**
   - Tuyệt đối **không chạy lệnh** `sudo rm -f /etc/nginx/sites-enabled/default` nếu file này đang chứa cấu hình chạy dự án khác.
   - Chỉ tạo thêm cấu hình mới cho domain của dự án này (`/etc/nginx/sites-available/longkhanhford`) và kích hoạt nó.
3. **Không cài đè MySQL nếu máy chủ đã có:**
   - Nếu VPS đã cài đặt MySQL/MariaDB từ trước, **bỏ qua bước 3.1 & 3.2** (không chạy lại `apt install mysql-server` hay `mysql_secure_installation`).
   - Chỉ đăng nhập vào MySQL hiện có (`sudo mysql -u root`) để tạo cơ sở dữ liệu `lkf_db` và phân quyền cho user riêng.
4. **Tránh trùng lặp tên tiến trình Supervisor & Cronjob:**
   - Đổi tên cấu hình Supervisor từ `laravel-worker` thành `lkf-worker` để không ghi đè cấu hình worker của dự án Laravel khác.
   - Khi sửa `crontab -u www-data -e`, chỉ thêm (append) dòng schedule của dự án này vào cuối file, giữ nguyên các dòng cấu hình của dự án khác.

---

## 1. Chuẩn bị VPS & Cập nhật hệ thống

SSH vào VPS của bạn với quyền `root` hoặc tài khoản có quyền `sudo`:
```bash
ssh root@your_vps_ip
```

Cập nhật danh sách gói và nâng cấp các gói hiện tại lên phiên bản mới nhất:
```bash
sudo apt update && sudo apt upgrade -y
```

---

## 2. Cài đặt PHP 8.4 & Nginx

Vì Laravel 9.x/10.x/11.x trong dự án này yêu cầu PHP >= 8.3/8.4, ta sẽ cài đặt PHP 8.4 thông qua kho lưu trữ PPA của Ondřej Surý.

### 2.1 Thêm kho PPA PHP
```bash
sudo apt install -y software-properties-common ca-certificates lsb-release apt-transport-https
sudo add-apt-repository ppa:ondrej/php -y
sudo apt update
```

### 2.2 Cài đặt PHP 8.4 và các extension cần thiết
```bash
sudo apt install -y php8.4-cli php8.4-fpm php8.4-mysql php8.4-xml php8.4-curl php8.4-mbstring php8.4-zip php8.4-gd php8.4-intl php8.4-bcmath php8.4-sqlite3 php8.4-opcache
```

Kiểm tra phiên bản PHP cài đặt thành công:
```bash
php -v
```

### 2.3 Cài đặt Nginx & Git
```bash
sudo apt install -y nginx git unzip
```

Khởi động và cho phép Nginx chạy cùng hệ thống:
```bash
sudo systemctl start nginx
sudo systemctl enable nginx
```

### 2.4 Cài đặt Composer
Tải và cài đặt Composer toàn cục:
```bash
curl -sS https://getcomposer.org/installer | php
sudo mv composer.phar /usr/local/bin/composer
sudo chmod +x /usr/local/bin/composer
```
Kiểm tra: `composer -v`

---

## 3. Cài đặt & Cấu hình MySQL

### 3.1 Cài đặt MySQL Server
```bash
sudo apt install -y mysql-server
```

Khởi động và kích hoạt MySQL:
```bash
sudo systemctl start mysql
sudo systemctl enable mysql
```

### 3.2 Cấu hình bảo mật ban đầu
Chạy script bảo mật để thiết lập mật khẩu root và loại bỏ các cài đặt thử nghiệm mặc định:
```bash
sudo mysql_secure_installation
```
*(Làm theo hướng dẫn trên màn hình: thiết lập độ bảo mật mật khẩu, xóa anonymous user, tắt root login từ xa, xóa test database).*

### 3.3 Tạo Database & User cho dự án
Truy cập vào MySQL CLI bằng tài khoản root:
```bash
sudo mysql -u root
```

Chạy các lệnh SQL sau để tạo database `lkf_db`, tạo user `lkf_user` với mật khẩu an toàn:
```sql
-- Tạo Database
CREATE DATABASE lkf_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Tạo User (Hãy đổi 'your_strong_password_here' bằng mật khẩu của bạn)
CREATE USER 'lkf_user'@'localhost' IDENTIFIED BY 'your_strong_password_here';

-- Cấp quyền truy cập cho user vào Database
GRANT ALL PRIVILEGES ON lkf_db.* TO 'lkf_user'@'localhost';

-- Áp dụng thay đổi
FLUSH PRIVILEGES;

-- Thoát MySQL CLI
EXIT;
```

---

## 4. Tải mã nguồn dự án & Phân quyền

### 4.1 Clone Source Code
Ta sẽ tạo thư mục dự án tại `/var/www/longkhanhford`:
```bash
sudo mkdir -p /var/www/longkhanhford
sudo chown -R $USER:$USER /var/www/longkhanhford
cd /var/www/longkhanhford
```

Clone repo Git về (hoặc kéo code thông qua SSH/FTP):
```bash
git clone <URL_REPOSITORY_CUA_BAN> .
```

### 4.2 Phân quyền thư mục cho Nginx (www-data)
Nginx chạy dưới user `www-data`, do đó cần cấp quyền ghi cho thư mục `storage` và `bootstrap/cache` của Laravel backend:

```bash
# Trỏ vào thư mục chứa backend (be)
cd /var/www/longkhanhford/be

# Phân quyền sở hữu cho www-data
sudo chown -R www-data:www-data /var/www/longkhanhford/be/storage
sudo chown -R www-data:www-data /var/www/longkhanhford/be/bootstrap/cache

# Cấp quyền đọc/ghi phù hợp
sudo chmod -R 775 /var/www/longkhanhford/be/storage
sudo chmod -R 775 /var/www/longkhanhford/be/bootstrap/cache
```

---

## 5. Cấu hình Nginx Virtual Host & Trỏ Domain

### 5.1 Tạo file cấu hình Nginx
Tạo file cấu hình mới cho domain của bạn (ví dụ: `api.longkhanhford.com.vn` hoặc domain chính):
```bash
sudo nano /etc/nginx/sites-available/longkhanhford
```

Dán nội dung cấu hình sau (thay thế `api.longkhanhford.com.vn` bằng domain thực tế của bạn):
```nginx
server {
    listen 80;
    server_name api.longkhanhford.com.vn;
    root /var/www/longkhanhford/be/public;

    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";

    index index.php;

    charset utf-8;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location = /favicon.ico { access_log off; log_not_found off; }
    location = /robots.txt  { access_log off; log_not_found off; }

    error_page 404 /index.php;

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.4-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }

    location ~ /\.(?!well-known).* {
        deny all;
    }
}
```
*Lưu ý:* `fastcgi_pass` cần khớp với phiên bản PHP FPM đang chạy (ở đây là `php8.4-fpm.sock`).

### 5.2 Kích hoạt cấu hình & Restart Nginx
Tạo liên kết để kích hoạt site mới:
```bash
sudo ln -s /etc/nginx/sites-available/longkhanhford /etc/nginx/sites-enabled/
```

Xóa cấu hình mặc định (nếu không dùng):
```bash
sudo rm -f /etc/nginx/sites-enabled/default
```

Kiểm tra cú pháp cấu hình Nginx có lỗi không:
```bash
sudo nginx -t
```
Nếu hiện `syntax is ok` và `test is successful`, reload lại Nginx:
```bash
sudo systemctl reload nginx
```

---

## 6. Cấu hình SSL Let's Encrypt với Certbot

Để bảo mật kết nối và sử dụng giao thức HTTPS, ta sẽ dùng Certbot để lấy chứng chỉ SSL miễn phí từ Let's Encrypt.

### 6.1 Cài đặt Certbot
```bash
sudo apt install -y certbot python3-certbot-nginx
```

### 6.2 Lấy và cài đặt chứng chỉ SSL tự động cho Nginx
> ⚠️ **Quan trọng:** Bạn cần trỏ tên miền (`A Record` trỏ về IP của VPS) thành công trên trình quản lý DNS trước khi chạy lệnh này.

Chạy lệnh sau để đăng ký chứng chỉ SSL:
```bash
sudo certbot --nginx -d api.longkhanhford.com.vn
```
*(Certbot sẽ hỏi email của bạn và tự động sửa cấu hình Nginx để kích hoạt SSL + cấu hình tự động redirect từ HTTP sang HTTPS).*

### 6.3 Kiểm tra tự động gia hạn chứng chỉ
Chứng chỉ của Let's Encrypt có thời hạn 90 ngày. Hệ thống sẽ tự động gia hạn, bạn có thể kiểm tra xem dịch vụ gia hạn tự động có hoạt động tốt không bằng lệnh:
```bash
sudo certbot renew --dry-run
```

---

## 7. Thiết lập Laravel (.env, Composer, Key, Database)

Bây giờ ta sẽ tiến hành cấu hình dự án chạy thực tế.

### 7.1 Tạo file cấu hình `.env`
Di chuyển vào thư mục backend và copy file cấu hình mẫu:
```bash
cd /var/www/longkhanhford/be
cp .env.example .env
```

Mở file `.env` lên để cấu hình:
```bash
nano .env
```

Chỉnh sửa các tham số quan trọng:
```env
APP_NAME="Long Khanh Ford"
APP_ENV=production
APP_DEBUG=false
APP_URL=https://api.longkhanhford.com.vn # Domain của bạn sau khi cài SSL

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=lkf_db
DB_USERNAME=lkf_user
DB_PASSWORD=your_strong_password_here # Mật khẩu đã tạo ở Bước 3
```

### 7.2 Cài đặt các gói PHP của dự án
Cài đặt dependencies tối ưu cho production (không tải các gói dev như test/mocking):
```bash
composer install --no-dev --optimize-autoloader
```

### 7.3 Tạo Key & Chạy Migration
Tạo App Key:
```bash
php artisan key:generate
```

Chạy migration để khởi tạo các bảng cơ sở dữ liệu:
```bash
php artisan migrate --force
```
*(Tham số `--force` là bắt buộc khi chạy môi trường `production` để tránh Laravel hỏi xác nhận).*

### 7.4 Tạo Symlink cho Storage
```bash
php artisan storage:link
```

### 7.5 Tối ưu hóa hiệu năng (Cache config/routes)
Khi chạy thực tế, hãy cache lại config, route và view của Laravel để tăng tốc độ phản hồi:
```bash
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

> 💡 **Mẹo:** Khi pull code mới về sau này, bạn nên xóa cache cũ và chạy lại:
> `php artisan optimize`

---

## 8. Cấu hình Cronjob & Supervisor (Hàng đợi Queue)

Để các tính năng gửi email ngầm, xử lý tác vụ nền hoạt động chính xác, ta cần cấu hình Task Scheduling và Queue Worker.

### 8.1 Cấu hình Laravel Task Scheduler (Cronjob)
Mở trình chỉnh sửa cronjob của hệ thống dưới quyền `www-data` (user chạy web):
```bash
sudo crontab -u www-data -e
```

Dán dòng lệnh sau vào cuối file để chạy scheduler mỗi phút (chú ý sử dụng `php8.4` nếu hệ thống chạy nhiều phiên bản PHP):
```cron
* * * * * cd /var/www/longkhanhford/be && php8.4 artisan schedule:run >> /dev/null 2>&1
```

### 8.2 Cấu hình Queue Worker với Supervisor (Nếu dự án sử dụng hàng đợi)
Supervisor giúp giữ lệnh `php artisan queue:work` luôn chạy ngầm và tự động khởi động lại nếu bị crash.

1. Cài đặt Supervisor:
```bash
sudo apt install -y supervisor
```

2. Tạo file cấu hình cho Laravel queue (đặt tên file độc nhất để tránh trùng lặp):
```bash
sudo nano /etc/supervisor/conf.d/lkf-worker.conf
```

3. Dán nội dung cấu hình sau (chú ý dùng đường dẫn `php8.4` nếu hệ thống chạy nhiều phiên bản PHP):
```ini
[program:lkf-worker]
process_name=%(program_name)s_%(process_num)02d
command=php8.4 /var/www/longkhanhford/be/artisan queue:work --sleep=3 --tries=3 --max-time=3600
autostart=true
autorestart=true
stopasgroup=true
killasgroup=true
user=www-data
numprocs=2
redirect_stderr=true
stdout_logfile=/var/www/longkhanhford/be/storage/logs/worker.log
stopwaitsecs=3600
```

4. Khởi động và áp dụng cấu hình Supervisor:
```bash
sudo supervisorctl reread
sudo supervisorctl update
sudo supervisorctl start lkf-worker:*
```

---

## 🛠️ Một số lệnh hữu ích khi vận hành

- **Xem log lỗi của Laravel:**
  ```bash
  tail -f /var/www/longkhanhford/be/storage/logs/laravel.log
  ```
- **Xem log lỗi của Nginx:**
  ```bash
  sudo tail -f /var/log/nginx/error.log
  ```
- **Khởi động lại PHP-FPM:**
  ```bash
  sudo systemctl restart php8.4-fpm
  ```
- **Xóa toàn bộ Cache Laravel:**
  ```bash
  php artisan cache:clear && php artisan config:clear && php artisan route:clear
  ```
