const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// 连接MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/fullstack-app');
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// 用户Schema
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

// 创建默认管理员用户
const createAdminUser = async () => {
  try {
    // 检查是否已存在
    const existingUser = await User.findOne({ email: 'admin@qq.com' });
    
    if (existingUser) {
      console.log('Admin user already exists');
      return;
    }

    // 创建新用户
    const hashedPassword = await bcrypt.hash('admin', 10);
    const adminUser = new User({
      email: 'admin@qq.com',
      password: hashedPassword,
      name: 'Admin',
      isAdmin: true,
      isActive: true
    });

    await adminUser.save();
    console.log('Admin user created successfully');
    console.log('Email: admin@qq.com');
    console.log('Password: admin');
  } catch (error) {
    console.error('Error creating admin user:', error);
  }
};

// 主函数
const main = async () => {
  await connectDB();
  await createAdminUser();
  await mongoose.disconnect();
  console.log('Script completed');
};

main();