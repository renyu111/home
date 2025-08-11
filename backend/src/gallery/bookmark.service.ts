import { Injectable } from '@nestjs/common';
import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

export interface CreateBookmarkDto {
  title: string;
  url: string;
  description?: string;
  category?: string;
  tags?: string[];
  createdBy: string;
}

export interface UpdateBookmarkDto {
  title?: string;
  url?: string;
  description?: string;
  category?: string;
  tags?: string[];
  updatedBy: string;
}

type BookmarkRecord = {
  _id: string;
  title: string;
  url: string;
  description?: string;
  category?: string;
  tags?: string[];
  createdBy: string;
  updatedBy?: string;
  createdAt: string;
  updatedAt?: string;
};

@Injectable()
export class BookmarkService {
  private dataFile = join(process.cwd(), 'data', 'bookmarks.json');

  private ensureFile() {
    const dir = join(process.cwd(), 'data');
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
    if (!existsSync(this.dataFile)) writeFileSync(this.dataFile, '[]', 'utf-8');
  }

  private readAll(): BookmarkRecord[] {
    this.ensureFile();
    const raw = readFileSync(this.dataFile, 'utf-8');
    try { return JSON.parse(raw) as BookmarkRecord[]; } catch { return []; }
  }

  private writeAll(list: BookmarkRecord[]): void {
    writeFileSync(this.dataFile, JSON.stringify(list, null, 2), 'utf-8');
  }

  async create(createBookmarkDto: CreateBookmarkDto): Promise<BookmarkRecord> {
    const list = this.readAll();
    const item: BookmarkRecord = {
      _id: `bm_${Date.now()}`,
      title: createBookmarkDto.title,
      url: createBookmarkDto.url,
      description: createBookmarkDto.description || '',
      category: createBookmarkDto.category || '其他',
      tags: createBookmarkDto.tags || [],
      createdBy: createBookmarkDto.createdBy,
      createdAt: new Date().toISOString(),
    };
    list.unshift(item);
    this.writeAll(list);
    return item;
  }

  async findAll(): Promise<BookmarkRecord[]> {
    const list = this.readAll();
    return list.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
  }

  async findOne(id: string): Promise<BookmarkRecord | null> {
    const list = this.readAll();
    return list.find(x => x._id === id) || null;
  }

  async update(id: string, updateBookmarkDto: UpdateBookmarkDto): Promise<BookmarkRecord | null> {
    const list = this.readAll();
    const idx = list.findIndex(x => x._id === id);
    if (idx < 0) return null;
    const updated: BookmarkRecord = {
      ...list[idx],
      ...updateBookmarkDto,
      updatedBy: updateBookmarkDto.updatedBy,
      updatedAt: new Date().toISOString(),
    } as BookmarkRecord;
    list[idx] = updated;
    this.writeAll(list);
    return updated;
  }

  async remove(id: string): Promise<BookmarkRecord | null> {
    const list = this.readAll();
    const idx = list.findIndex(x => x._id === id);
    if (idx < 0) return null;
    const removed = list[idx];
    list.splice(idx, 1);
    this.writeAll(list);
    return removed;
  }

  async findByUser(userId: string): Promise<BookmarkRecord[]> {
    const list = this.readAll();
    return list.filter(x => x.createdBy === userId).sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
  }
}