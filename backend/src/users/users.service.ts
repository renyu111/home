import { Injectable } from '@nestjs/common';
import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

type UserRecord = {
  _id: string;
  email: string;
  password?: string;
  name: string;
  isAdmin: boolean;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
};

@Injectable()
export class UsersService {
  private dataFile = join(process.cwd(), 'data', 'users.json');

  private ensureFile() {
    const dir = join(process.cwd(), 'data');
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
    if (!existsSync(this.dataFile)) writeFileSync(this.dataFile, '[]', 'utf-8');
  }

  private readAll(): UserRecord[] {
    this.ensureFile();
    const raw = readFileSync(this.dataFile, 'utf-8');
    try { return JSON.parse(raw) as UserRecord[]; } catch { return []; }
  }

  private writeAll(list: UserRecord[]): void {
    writeFileSync(this.dataFile, JSON.stringify(list, null, 2), 'utf-8');
  }

  async create(createUserDto: any): Promise<UserRecord> {
    const list = this.readAll();
    const item: UserRecord = {
      _id: `usr_${Date.now()}`,
      email: createUserDto.email,
      password: createUserDto.password,
      name: createUserDto.name,
      isAdmin: false,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    list.push(item);
    this.writeAll(list);
    return item;
  }

  async findAll(): Promise<UserRecord[]> {
    return this.readAll();
  }

  async findOne(id: string): Promise<UserRecord | null> {
    const list = this.readAll();
    return list.find(u => u._id === id) || null;
  }

  async findByEmail(email: string): Promise<UserRecord | null> {
    const list = this.readAll();
    return list.find(u => u.email === email) || null;
  }

  async update(id: string, updateUserDto: any): Promise<UserRecord | null> {
    const list = this.readAll();
    const idx = list.findIndex(u => u._id === id);
    if (idx < 0) return null;
    const updated: UserRecord = { ...list[idx], ...updateUserDto, updatedAt: new Date().toISOString() };
    list[idx] = updated;
    this.writeAll(list);
    return updated;
  }

  async remove(id: string): Promise<UserRecord | null> {
    const list = this.readAll();
    const idx = list.findIndex(u => u._id === id);
    if (idx < 0) return null;
    const removed = list[idx];
    list.splice(idx, 1);
    this.writeAll(list);
    return removed;
  }

  async validatePassword(email: string, password: string): Promise<boolean> {
    const user = await this.findByEmail(email);
    if (!user) return false;
    return user.password === password;
  }
}