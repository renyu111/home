import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Bookmark, BookmarkDocument } from './bookmark.schema';

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

@Injectable()
export class BookmarkService {
  constructor(
    @InjectModel(Bookmark.name) private bookmarkModel: Model<BookmarkDocument>,
  ) {}

  async create(createBookmarkDto: CreateBookmarkDto): Promise<BookmarkDocument> {
    const createdBookmark = new this.bookmarkModel(createBookmarkDto);
    return createdBookmark.save();
  }

  async findAll(): Promise<BookmarkDocument[]> {
    return this.bookmarkModel.find().sort({ createdAt: -1 }).exec();
  }

  async findOne(id: string): Promise<BookmarkDocument> {
    return this.bookmarkModel.findById(id).exec();
  }

  async update(id: string, updateBookmarkDto: UpdateBookmarkDto): Promise<BookmarkDocument> {
    return this.bookmarkModel
      .findByIdAndUpdate(id, updateBookmarkDto, { new: true })
      .exec();
  }

  async remove(id: string): Promise<BookmarkDocument> {
    return this.bookmarkModel.findByIdAndDelete(id).exec();
  }

  async findByUser(userId: string): Promise<BookmarkDocument[]> {
    return this.bookmarkModel.find({ createdBy: userId }).sort({ createdAt: -1 }).exec();
  }
}