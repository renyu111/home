Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "          全栈项目一键启动" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 检查Node.js
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js 版本: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js 未安装，请先安装 Node.js" -ForegroundColor Red
    Write-Host "下载地址: https://nodejs.org/" -ForegroundColor Yellow
    Read-Host "按任意键退出"
    exit 1
}

# 检查MongoDB
Write-Host ""
Write-Host "⚠️  请确保 MongoDB 服务已启动" -ForegroundColor Yellow
Write-Host "Windows: net start MongoDB" -ForegroundColor Gray
Write-Host ""

# 创建环境变量文件
Write-Host "📝 配置环境变量..." -ForegroundColor Blue

if (!(Test-Path "backend\.env")) {
    Copy-Item "backend\env.example" "backend\.env"
    Write-Host "✅ 已创建 backend\.env" -ForegroundColor Green
} else {
    Write-Host "✅ backend\.env 已存在" -ForegroundColor Green
}

if (!(Test-Path "frontend\.env.local")) {
    Copy-Item "frontend\env.example" "frontend\.env.local"
    Write-Host "✅ 已创建 frontend\.env.local" -ForegroundColor Green
} else {
    Write-Host "✅ frontend\.env.local 已存在" -ForegroundColor Green
}

# 安装依赖
Write-Host ""
Write-Host "📦 正在安装依赖..." -ForegroundColor Blue
Write-Host ""

Write-Host "安装后端依赖..." -ForegroundColor Yellow
Set-Location backend
npm install --silent
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ 后端依赖安装失败" -ForegroundColor Red
    Read-Host "按任意键退出"
    exit 1
}

Write-Host "安装前端依赖..." -ForegroundColor Yellow
Set-Location ../frontend
npm install --silent
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ 前端依赖安装失败" -ForegroundColor Red
    Read-Host "按任意键退出"
    exit 1
}

Write-Host ""
Write-Host "🎉 依赖安装完成！" -ForegroundColor Green
Write-Host ""

# 启动服务
Write-Host "🚀 正在启动服务..." -ForegroundColor Blue
Write-Host ""

Write-Host "启动后端服务器 (端口 3001)..." -ForegroundColor Yellow
Set-Location ../backend
Start-Process powershell -ArgumentList "-NoExit", "-Command", "npm run start:dev" -WindowStyle Normal

Write-Host "启动前端服务器 (端口 3000)..." -ForegroundColor Yellow
Set-Location ../frontend
Start-Process powershell -ArgumentList "-NoExit", "-Command", "npm run dev" -WindowStyle Normal

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "✅ 启动完成！" -ForegroundColor Green
Write-Host ""
Write-Host "🌐 前端: http://localhost:3000" -ForegroundColor Cyan
Write-Host "🔧 后端: http://localhost:3001" -ForegroundColor Cyan
Write-Host ""
Write-Host "按任意键退出..." -ForegroundColor Gray
Write-Host "========================================" -ForegroundColor Cyan
Read-Host ""