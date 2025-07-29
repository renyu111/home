@echo off
title 全栈项目一键启动
color 0A

echo.
echo ========================================
echo           全栈项目一键启动
echo ========================================
echo.

:: 检查Node.js
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js 未安装，请先安装 Node.js
    echo 下载地址: https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js 已安装

:: 检查MongoDB
echo.
echo 请确保 MongoDB 服务已启动
echo Windows: net start MongoDB
echo.

:: 创建环境变量文件
if not exist "backend\.env" (
    copy "backend\env.example" "backend\.env" >nul
    echo ✅ 已创建 backend\.env
) else (
    echo ✅ backend\.env 已存在
)

if not exist "frontend\.env.local" (
    copy "frontend\env.example" "frontend\.env.local" >nul
    echo ✅ 已创建 frontend\.env.local
) else (
    echo ✅ frontend\.env.local 已存在
)

:: 安装依赖
echo.
echo 📦 正在安装依赖...
echo.

echo 安装后端依赖...
cd backend
call npm install >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ 后端依赖安装失败
    pause
    exit /b 1
)

echo 安装前端依赖...
cd ..\frontend
call npm install >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ 前端依赖安装失败
    pause
    exit /b 1
)

echo.
echo 🎉 依赖安装完成！
echo.

:: 启动服务
echo 🚀 正在启动服务...
echo.

echo 启动后端服务器 (端口 3001)...
cd ..\backend
start "Backend Server" cmd /k "npm run start:dev"

echo 启动前端服务器 (端口 3000)...
cd ..\frontend
start "Frontend Server" cmd /k "npm run dev"

echo.
echo ========================================
echo ✅ 启动完成！
echo.
echo 🌐 前端: http://localhost:3000
echo 🔧 后端: http://localhost:3001
echo.
echo 按任意键退出...
echo ========================================
pause