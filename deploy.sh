#!/bin/bash

echo "🎯 一键部署全栈项目"
echo "=================="

# 检查Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js 未安装，请先安装 Node.js"
    echo "下载地址: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js 版本: $(node --version)"

# 检查npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm 未安装"
    exit 1
fi

echo "✅ npm 版本: $(npm --version)"

# 创建环境变量文件
echo ""
echo "📝 配置环境变量..."

# 后端环境变量
if [ ! -f "backend/.env" ]; then
    cp backend/env.example backend/.env
    echo "✅ 已创建 backend/.env"
else
    echo "✅ backend/.env 已存在"
fi

# 前端环境变量
if [ ! -f "frontend/.env.local" ]; then
    cp frontend/env.example frontend/.env.local
    echo "✅ 已创建 frontend/.env.local"
else
    echo "✅ frontend/.env.local 已存在"
fi

# 安装依赖
echo ""
echo "📦 安装依赖..."

echo "安装后端依赖..."
cd backend
npm install
if [ $? -ne 0 ]; then
    echo "❌ 后端依赖安装失败"
    exit 1
fi

echo "安装前端依赖..."
cd ../frontend
npm install
if [ $? -ne 0 ]; then
    echo "❌ 前端依赖安装失败"
    exit 1
fi

echo ""
echo "🎉 部署完成！"
echo ""
echo "📋 启动命令:"
echo "  后端: cd backend && npm run start:dev"
echo "  前端: cd frontend && npm run dev"
echo ""
echo "🌐 访问地址:"
echo "  前端: http://localhost:3000"
echo "  后端: http://localhost:3001"
echo ""
echo "⚠️  请确保 MongoDB 服务已启动"