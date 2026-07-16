# Windows development startup script for Ford Long Khanh monorepo (without Docker)
# Run in PowerShell: .\dev.ps1

$phpPath = "php"

# Ensure locales directory exists and generate i18n locales for Vue/Vite
New-Item -ItemType Directory -Force -Path "be/public/build/locales" | Out-Null
cd be
& $phpPath artisan vue-i18n:generate
cd ..

Write-Host "Starting development servers..." -ForegroundColor Green
Write-Host "----------------------------------" -ForegroundColor Cyan

# 1. Start Laravel Backend serve
Write-Host "[1/3] Starting Laravel Backend API on Port 8000..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd be; & '$phpPath' artisan serve --port=8000"

Start-Sleep -Seconds 1

# 2. Start Vite Admin Compiler
Write-Host "[2/3] Starting Admin panel asset compiler (Vite)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd be; npm run dev"

Start-Sleep -Seconds 1

# 3. Start Next.js Frontend
Write-Host "[3/3] Starting Next.js Frontend on Port 3000..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd fe; npm run dev"

Write-Host "----------------------------------" -ForegroundColor Green
Write-Host "All servers are starting in separate windows!" -ForegroundColor Green
Write-Host "- Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host "- Laravel Admin Panel: http://localhost:8000/admin" -ForegroundColor Cyan
Write-Host "- Backend API: http://localhost:8000" -ForegroundColor Cyan
Write-Host "To stop them, simply close the opened terminal windows." -ForegroundColor Yellow
Write-Host "----------------------------------" -ForegroundColor Cyan
