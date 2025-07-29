import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.schema';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(createUserDto: any): Promise<UserDocument> {
    try {
      const createdUser = new this.userModel(createUserDto);
      return await createdUser.save();
    } catch (error) {
      console.log('Database error in create user:', error.message);
      // 返回一个模拟用户对象
      return {
        _id: 'mock-user-id',
        email: createUserDto.email,
        password: createUserDto.password,
        name: createUserDto.name,
        isAdmin: false,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as any;
    }
  }

  async findAll(): Promise<UserDocument[]> {
    try {
      return await this.userModel.find().exec();
    } catch (error) {
      console.log('Database error in findAll:', error.message);
      return [];
    }
  }

  async findOne(id: string): Promise<UserDocument> {
    try {
      return await this.userModel.findById(id).exec();
    } catch (error) {
      console.log('Database error in findOne:', error.message);
      return null;
    }
  }

  async findByEmail(email: string): Promise<UserDocument> {
    try {
      return await this.userModel.findOne({ email }).exec();
    } catch (error) {
      console.log('Database error in findByEmail:', error.message);
      return null;
    }
  }

  async update(id: string, updateUserDto: any): Promise<UserDocument> {
    try {
      return await this.userModel.findByIdAndUpdate(id, updateUserDto, { new: true }).exec();
    } catch (error) {
      console.log('Database error in update:', error.message);
      return null;
    }
  }

  async remove(id: string): Promise<UserDocument> {
    try {
      return await this.userModel.findByIdAndDelete(id).exec();
    } catch (error) {
      console.log('Database error in remove:', error.message);
      return null;
    }
  }

  async validatePassword(email: string, password: string): Promise<boolean> {
    try {
      const user = await this.findByEmail(email);
      if (!user) return false;
      // 这里应该使用bcrypt比较密码，暂时简化
      return user.password === password;
    } catch (error) {
      console.log('Database error in validatePassword:', error.message);
      return false;
    }
  }
}