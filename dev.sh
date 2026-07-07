#!/bin/bash

# Hàm dọn dẹp các tiến trình chạy ngầm khi tắt script (Ctrl+C)
cleanup() {
    echo ""
    echo "⚠️ Đang dừng tất cả các server phát triển..."
    # Gửi tín hiệu Terminate đến tất cả các job chạy ngầm của script này
    kill $(jobs -p) 2>/dev/null
    exit 0
}

# Đăng ký hàm bẫy (trap) khi nhận tín hiệu kết thúc (Ctrl+C)
trap cleanup INT TERM

echo "🚀 Bắt đầu khởi động các server phát triển dự án Ford Đồng Nai..."
echo "--------------------------------------------------------"

# 1. Khởi động Laravel Backend server (php artisan serve)
echo "🖥️  [Backend] Khởi động php artisan serve..."
(cd be && php artisan serve --port=8000) &

# Đợi 1 giây để Laravel server khởi tạo cổng trước
sleep 1

# 2. Khởi động Laravel Inertia Vue Compiler cho trang Admin (Vite)
echo "⚙️  [Inertia Admin] Khởi động Vite Backend (yarn dev)..."
(cd be && yarn dev) &

# 3. Khởi động Next.js Frontend (Next dev)
echo "🌐 [Next.js FE] Khởi động Next.js dev server..."
(cd fe && npm run dev) &

echo "--------------------------------------------------------"
echo "✅ Tất cả các server đang được khởi động!"
echo "👉 Trang chủ Next.js (FE Client): http://localhost:3000"
echo "👉 Trang quản trị (Laravel Admin): http://localhost:8000/admin"
echo "👉 Backend API Server: http://localhost:8000"
echo "💡 Nhấn Ctrl+C để dừng tất cả các server cùng lúc."
echo "--------------------------------------------------------"

# Giữ script chạy và đợi tất cả các tiến trình con kết thúc
wait
