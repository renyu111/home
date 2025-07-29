#!/bin/bash

echo ""
echo "========================================"
echo "          全栈项目一键启动"
echo "========================================"
echo ""

# 检查Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js 未安装，请先安装 Node.js"
    echo "下载地址: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js 版本: $(node --version)"

# 检查MongoDB
echo ""
echo "⚠️  请确保 MongoDB 服务已启动"
echo "macOS: brew services start mongodb/brew/mongodb-community"
echo "Linux: sudo systemctl start mongodb"
echo ""

# 创建环境变量文件
echo "📝 配置环境变量..."

if [ ! -f "backend/.env" ]; then
    cp backend/env.example backend/.env
    echo "✅ 已创建 backend/.env"
else
    echo "✅ backend/.env 已存在"
fi

if [ ! -f "frontend/.env.local" ]; then
    cp frontend/env.example frontend/.env.local
    echo "✅ 已创建 frontend/.env.local"
else
    echo "✅ frontend/.env.local 已存在"
fi

# 安装依赖
echo ""
echo "📦 正在安装依赖..."
echo ""

echo "安装后端依赖..."
cd backend
npm install --silent
if [ $? -ne 0 ]; then
    echo "❌ 后端依赖安装失败"
    exit 1
fi

echo "安装前端依赖..."
cd ../frontend
npm install --silent
if [ $? -ne 0 ]; then
    echo "❌ 前端依赖安装失败"
    exit 1
fi

echo ""
echo "🎉 依赖安装完成！"
echo ""

# 启动服务
echo "🚀 正在启动服务..."
echo ""

echo "启动后端服务器 (端口 3001)..."
cd ../backend

# 尝试不同的终端模拟器
if command -v gnome-terminal &> /dev/null; then
    gnome-terminal -- bash -c "npm run start:dev; exec bash" &
elif command -v xterm &> /dev/null; then
    xterm -e "npm run start:dev; exec bash" &
elif command -v konsole &> /dev/null; then
    konsole -e "npm run start:dev; exec bash" &
else
    echo "请手动运行: cd backend && npm run start:dev"
fi

echo "启动前端服务器 (端口 3000)..."
cd ../frontend

if command -v gnome-terminal &> /dev/null; then
    gnome-terminal -- bash -c "npm run dev; exec bash" &
elif command -v xterm &> /dev/null; then
    xterm -e "npm run dev; exec bash" &
elif command -v konsole &> /dev/null; then
    konsole -e "npm run dev; exec bash" &
else
    echo "请手动运行: cd frontend && npm run dev"
fi

echo ""
echo "========================================"
echo "✅ 启动完成！"
echo ""
echo "🌐 前端: http://localhost:3000"
echo "🔧 后端: http://localhost:3001"
echo ""
echo "按任意键退出..."
echo "========================================"
read -p ""