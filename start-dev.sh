#!/bin/bash

echo "🚀 启动全栈开发环境..."

echo ""
echo "1. 安装后端依赖..."
cd backend
npm install
if [ $? -ne 0 ]; then
    echo "❌ 后端依赖安装失败！"
    read -p "按任意键退出..."
    exit 1
fi

echo ""
echo "2. 安装前端依赖..."
cd ../frontend
npm install
if [ $? -ne 0 ]; then
    echo "❌ 前端依赖安装失败！"
    read -p "按任意键退出..."
    exit 1
fi

echo ""
echo "3. 启动后端服务器 (端口 3001)..."
cd ../backend
gnome-terminal -- bash -c "npm run start:dev; exec bash" 2>/dev/null || \
xterm -e "npm run start:dev; exec bash" 2>/dev/null || \
konsole -e "npm run start:dev; exec bash" 2>/dev/null || \
echo "请手动运行: cd backend && npm run start:dev"

echo ""
echo "4. 启动前端服务器 (端口 3000)..."
cd ../frontend
gnome-terminal -- bash -c "npm run dev; exec bash" 2>/dev/null || \
xterm -e "npm run dev; exec bash" 2>/dev/null || \
konsole -e "npm run dev; exec bash" 2>/dev/null || \
echo "请手动运行: cd frontend && npm run dev"

echo ""
echo "✅ 开发环境启动完成！"
echo "🌐 前端: http://localhost:3000"
echo "🔧 后端: http://localhost:3001"
echo ""
echo "⚠️  请确保MongoDB服务已启动"
read -p "按任意键退出..."