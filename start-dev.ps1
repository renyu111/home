Write-Host "启动全栈开发环境..." -ForegroundColor Green

Write-Host "`n1. 安装后端依赖..." -ForegroundColor Yellow
Set-Location backend
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "后端依赖安装失败！" -ForegroundColor Red
    Read-Host "按任意键退出"
    exit 1
}

Write-Host "`n2. 安装前端依赖..." -ForegroundColor Yellow
Set-Location ../frontend
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "前端依赖安装失败！" -ForegroundColor Red
    Read-Host "按任意键退出"
    exit 1
}

Write-Host "`n3. 启动后端服务器 (端口 3001)..." -ForegroundColor Yellow
Set-Location ../backend
Start-Process powershell -ArgumentList "-NoExit", "-Command", "npm run start:dev" -WindowStyle Normal

Write-Host "`n4. 启动前端服务器 (端口 3000)..." -ForegroundColor Yellow
Set-Location ../frontend
Start-Process powershell -ArgumentList "-NoExit", "-Command", "npm run dev" -WindowStyle Normal

Write-Host "`n开发环境启动完成！" -ForegroundColor Green
Write-Host "前端: http://localhost:3000" -ForegroundColor Cyan
Write-Host "后端: http://localhost:3001" -ForegroundColor Cyan
Write-Host "`n请确保MongoDB服务已启动" -ForegroundColor Yellow
Read-Host "按任意键退出"