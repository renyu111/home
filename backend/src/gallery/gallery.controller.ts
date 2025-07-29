import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Param, 
  Delete, 
  Query, 
  UseGuards,
  Request,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { existsSync, mkdirSync, readdirSync } from 'fs';
import { join } from 'path';
import { GalleryService, CreateGalleryDto, QueryGalleryDto } from './gallery.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('gallery')
export class GalleryController {
  constructor(private readonly galleryService: GalleryService) {}

  @Post('upload')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const uploadPath = './assets/uploads';
          // 检查并创建uploads文件夹
          if (!existsSync(uploadPath)) {
            mkdirSync(uploadPath, { recursive: true });
          }
          cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          return cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  async uploadImage(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 50 * 1024 * 1024 }), // 50MB
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    const fileUrl = `http://localhost:3344/uploads/${file.filename}`;
    
    return { 
      success: true, 
      fileUrl,
      filename: file.filename,
      originalName: file.originalname,
      mimeType: file.mimetype,
      size: file.size
    };
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() createGalleryDto: CreateGalleryDto, @Request() req) {
    // 从JWT中获取用户信息
    const user = req.user;
    createGalleryDto.uploaderId = user.id;
    createGalleryDto.uploaderName = user.name;
    
    return this.galleryService.create(createGalleryDto);
  }

  @Get()
  async findAll(@Query() query: QueryGalleryDto) {
    const uploadsPath = './assets/uploads';
    
    // 检查uploads目录是否存在
    if (!existsSync(uploadsPath)) {
      console.log('Uploads directory not found:', uploadsPath);
      return { data: [], total: 0 };
    }
    
    // 读取uploads目录中的所有文件
    const files = readdirSync(uploadsPath);
    console.log('Found files:', files);
    
    // 转换为文件信息数组
    const fileList = files.map(filename => ({
      _id: filename,
      title: filename,
      description: `上传的文件: ${filename}`,
      imageUrl: `http://localhost:3344/uploads/${filename}`,
      category: 'uploaded',
      tags: [filename.split('.').pop() || 'unknown'],
      likes: 0,
      views: 0,
      rating: 0,
      uploaderName: 'System',
      createdAt: new Date().toISOString()
    }));
    
    console.log('Returning file list:', fileList.length);
    return { 
      data: fileList, 
      total: fileList.length 
    };
  }

  @Get('categories')
  async getCategories() {
    return this.galleryService.getCategories();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    // 增加浏览量
    await this.galleryService.incrementViews(id);
    return this.galleryService.findOne(id);
  }

  @Post(':id/like')
  @UseGuards(JwtAuthGuard)
  async like(@Param('id') id: string) {
    await this.galleryService.incrementLikes(id);
    return { message: '点赞成功' };
  }

  @Post(':id/rating')
  @UseGuards(JwtAuthGuard)
  async rate(@Param('id') id: string, @Body() body: { rating: number }) {
    await this.galleryService.updateRating(id, body.rating);
    return { message: '评分成功' };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id') id: string, @Request() req) {
    // 这里可以添加权限检查，只有上传者或管理员可以删除
    return this.galleryService.remove(id);
  }
}