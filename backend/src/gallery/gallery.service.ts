import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Gallery, GalleryDocument } from './gallery.schema';

export interface CreateGalleryDto {
  title: string;
  description: string;
  imageUrl: string;
  category: string;
  tags: string[];
  uploaderId: string;
  uploaderName: string;
}

export interface QueryGalleryDto {
  category?: string;
  search?: string;
  page?: number;
  limit?: number;
}

@Injectable()
export class GalleryService {
  constructor(
    @InjectModel(Gallery.name) private galleryModel: Model<GalleryDocument>,
  ) {}

  async create(createGalleryDto: CreateGalleryDto): Promise<GalleryDocument> {
    const createdGallery = new this.galleryModel(createGalleryDto);
    return createdGallery.save();
  }

  async saveUploadedFile(fileInfo: {
    fileUrl: string;
    filename: string;
    originalName: string;
    mimeType: string;
    size: number;
    uploaderId: string;
    uploaderName: string;
  }): Promise<GalleryDocument> {
    const galleryItem = new this.galleryModel({
      title: fileInfo.originalName,
      description: `上传的文件: ${fileInfo.originalName}`,
      imageUrl: fileInfo.fileUrl,
      category: 'uploaded',
      tags: [fileInfo.mimeType.split('/')[0]], // 根据MIME类型设置标签
      uploaderId: fileInfo.uploaderId,
      uploaderName: fileInfo.uploaderName,
      likes: 0,
      views: 0,
      rating: 0
    });
    return galleryItem.save();
  }

  async findAll(query: QueryGalleryDto = {}): Promise<{ data: GalleryDocument[]; total: number }> {
    const { category, search } = query;
    
    // 构建查询条件
    const filter: any = {};
    
    if (category && category !== 'all') {
      filter.category = category;
    }
    
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    const data = await this.galleryModel
      .find(filter)
      .sort({ createdAt: -1 })
      .exec();
    
    const total = data.length;

    return { data, total };
  }

  async findOne(id: string): Promise<GalleryDocument> {
    return this.galleryModel.findById(id).exec();
  }

  async update(id: string, updateGalleryDto: Partial<Gallery>): Promise<GalleryDocument> {
    return this.galleryModel
      .findByIdAndUpdate(id, updateGalleryDto, { new: true })
      .exec();
  }

  async remove(id: string): Promise<GalleryDocument> {
    return this.galleryModel.findByIdAndDelete(id).exec();
  }

  async incrementViews(id: string): Promise<void> {
    await this.galleryModel.findByIdAndUpdate(id, { $inc: { views: 1 } }).exec();
  }

  async incrementLikes(id: string): Promise<void> {
    await this.galleryModel.findByIdAndUpdate(id, { $inc: { likes: 1 } }).exec();
  }

  async updateRating(id: string, rating: number): Promise<void> {
    await this.galleryModel.findByIdAndUpdate(id, { rating }).exec();
  }

  async getCategories(): Promise<string[]> {
    const categories = await this.galleryModel.distinct('category').exec();
    return categories;
  }
}