# 全栈项目

这是一个前后端分离的全栈项目，使用以下技术栈：

## 技术栈

### 前端
- **Next.js 14** - React框架
- **TypeScript** - 类型安全
- **Tailwind CSS** - 样式框架
- **Axios** - HTTP客户端
- **React Hook Form** - 表单处理
- **React Hot Toast** - 通知组件

### 后端
- **NestJS** - Node.js框架
- **TypeScript** - 类型安全
- **MongoDB** - 数据库
- **Mongoose** - MongoDB ODM
- **JWT** - 身份验证
- **Passport** - 认证策略
- **bcryptjs** - 密码加密

## 项目结构

```
homeProject/
├── frontend/          # Next.js前端
│   ├── src/
│   │   ├── app/      # App Router
│   │   └── ...
│   ├── package.json
│   └── ...
├── backend/           # NestJS后端
│   ├── src/
│   │   ├── auth/     # 认证模块
│   │   ├── users/    # 用户模块
│   │   └── ...
│   ├── package.json
│   └── ...
├── shared/            # 共享类型定义
│   └── types.ts
├── start-dev.bat      # Windows启动脚本
├── start-dev.ps1      # PowerShell启动脚本
└── README.md
```

## 快速开始

### 前置要求

1. **Node.js** (版本 18+)
2. **npm** 或 **yarn**
3. **MongoDB** (本地安装或云服务)

### 方法一：使用启动脚本（推荐）

#### Windows用户
```bash
# 双击运行
start-dev.bat
```

#### PowerShell用户
```powershell
# 运行PowerShell脚本
.\start-dev.ps1
```

### 方法二：手动启动

#### 1. 安装依赖

```bash
# 安装后端依赖
cd backend
npm install

# 安装前端依赖
cd ../frontend
npm install
```

#### 2. 配置环境变量

**后端环境变量** (复制 `backend/env.example` 为 `backend/.env`)
```env
MONGODB_URI=mongodb://localhost:27017/fullstack-app
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
PORT=3001
FRONTEND_URL=http://localhost:3000
```

**前端环境变量** (复制 `frontend/env.example` 为 `frontend/.env.local`)
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

#### 3. 启动开发服务器

```bash
# 启动后端 (端口 3001)
cd backend
npm run start:dev

# 启动前端 (端口 3000)
cd frontend
npm run dev
```

## 功能特性

### 后端API

- **认证系统**
  - `POST /api/auth/login` - 用户登录
  - `POST /api/auth/register` - 用户注册

- **用户管理**
  - `GET /api/users` - 获取所有用户
  - `GET /api/users/:id` - 获取单个用户
  - `POST /api/users` - 创建用户
  - `PATCH /api/users/:id` - 更新用户
  - `DELETE /api/users/:id` - 删除用户

- **健康检查**
  - `GET /api/health` - 服务健康状态

### 前端功能

- **用户认证**
  - 登录/注册表单
  - JWT token管理
  - 表单验证
  - 响应式设计

- **UI特性**
  - 现代化界面设计
  - 响应式布局
  - 加载状态
  - 错误处理
  - 成功通知

## 开发指南

### 后端开发

```bash
cd backend

# 开发模式
npm run start:dev

# 生产构建
npm run build
npm run start:prod

# 代码检查
npm run lint

# 测试
npm run test
```

### 前端开发

```bash
cd frontend

# 开发模式
npm run dev

# 生产构建
npm run build
npm start

# 代码检查
npm run lint
```

### 数据库

项目使用MongoDB作为数据库：

1. **本地安装**：确保MongoDB服务已启动
2. **云服务**：使用MongoDB Atlas等云服务
3. **连接字符串**：在 `backend/.env` 中配置 `MONGODB_URI`

### API测试

可以使用Postman或curl测试API：

```bash
# 注册用户
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"123456","name":"测试用户"}'

# 用户登录
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"123456"}'
```

## 部署

### 后端部署

```bash
cd backend
npm run build
npm run start:prod
```

### 前端部署

```bash
cd frontend
npm run build
npm start
```

### 环境变量

生产环境中请修改以下环境变量：

- `JWT_SECRET` - 使用强密钥
- `MONGODB_URI` - 生产数据库连接
- `FRONTEND_URL` - 生产前端URL

## 故障排除

### 常见问题

1. **端口被占用**
   - 后端：修改 `backend/.env` 中的 `PORT`
   - 前端：修改 `frontend/package.json` 中的启动脚本

2. **MongoDB连接失败**
   - 检查MongoDB服务是否启动
   - 验证连接字符串格式
   - 检查网络连接

3. **依赖安装失败**
   - 清除node_modules：`rm -rf node_modules package-lock.json`
   - 重新安装：`npm install`

4. **TypeScript编译错误**
   - 检查TypeScript版本兼容性
   - 更新类型定义：`npm install @types/node`

## 贡献

欢迎提交Issue和Pull Request！

## 许可证

MIT License