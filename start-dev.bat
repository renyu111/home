@echo off
echo 启动全栈开发环境...

echo.
echo 1. 安装后端依赖...
cd backend
call npm install
if %errorlevel% neq 0 (
    echo 后端依赖安装失败！
    pause
    exit /b 1
)

echo.
echo 2. 安装前端依赖...
cd ../frontend
call npm install
if %errorlevel% neq 0 (
    echo 前端依赖安装失败！
    pause
    exit /b 1
)

echo.
echo 3. 启动后端服务器 (端口 3001)...
cd ../backend
start "Backend Server" cmd /k "npm run start:dev"

echo.
echo 4. 启动前端服务器 (端口 3000)...
cd ../frontend
start "Frontend Server" cmd /k "npm run dev"

echo.
echo 开发环境启动完成！
echo 前端: http://localhost:3000
echo 后端: http://localhost:3001
echo.
echo 请确保MongoDB服务已启动
echo 按任意键退出...
pause