import { Controller, Get, Post, Body, Param, Delete, UseGuards, Request, Query, UseInterceptors, UploadedFile, ParseFilePipe, MaxFileSizeValidator, Put } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { GalleryService } from './gallery.service';
import { BookmarkService, CreateBookmarkDto, UpdateBookmarkDto } from './bookmark.service';
import { CreateGalleryDto } from './dto/create-gallery.dto';
import { UpdateGalleryDto } from './dto/update-gallery.dto';
import { QueryGalleryDto } from './dto/query-gallery.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync, statSync } from 'fs';
import { join } from 'path';

@Controller('gallery')
export class GalleryController {
  constructor(
    private readonly galleryService: GalleryService,
    private readonly bookmarkService: BookmarkService,
  ) {}

  @Post('upload')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const uploadPath = join(process.cwd(), 'assets', 'uploads');
          if (!existsSync(uploadPath)) {
            mkdirSync(uploadPath, { recursive: true });
          }
          cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
          cb(null, uniqueSuffix + '-' + file.originalname);
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

  @Get('test')
  async test() {
    return { message: 'Gallery controller is working' };
  }

  @Get('bookmarks')
  async getBookmarks() {
    try {
      const bookmarks = await this.bookmarkService.findAll();
      return { 
        data: bookmarks, 
        total: bookmarks.length 
      };
    } catch (error) {
      console.error('Error in getBookmarks:', error);
      return { 
        data: [], 
        total: 0 
      };
    }
  }

  @Post('bookmarks')
  @UseGuards(JwtAuthGuard)
  async addBookmark(@Body() bookmarkData: any, @Request() req) {
    try {
      const createBookmarkDto: CreateBookmarkDto = {
        title: bookmarkData.title,
        url: bookmarkData.url,
        description: bookmarkData.description || '',
        category: bookmarkData.category || '其他',
        tags: bookmarkData.tags || [],
        createdBy: req.user?.name || 'System'
      };

      const newBookmark = await this.bookmarkService.create(createBookmarkDto);
      return { success: true, bookmark: newBookmark };
    } catch (error) {
      console.error('Error adding bookmark:', error);
      return { error: 'Failed to save bookmark' };
    }
  }

  @Put('bookmarks/:id')
  @UseGuards(JwtAuthGuard)
  async updateBookmark(@Param('id') id: string, @Body() bookmarkData: any, @Request() req) {
    try {
      const updateBookmarkDto: UpdateBookmarkDto = {
        title: bookmarkData.title,
        url: bookmarkData.url,
        description: bookmarkData.description || '',
        category: bookmarkData.category || '其他',
        tags: bookmarkData.tags || [],
        updatedBy: req.user?.name || 'System'
      };

      const updatedBookmark = await this.bookmarkService.update(id, updateBookmarkDto);
      return { success: true, bookmark: updatedBookmark };
    } catch (error) {
      console.error('Error updating bookmark:', error);
      return { error: 'Failed to update bookmark' };
    }
  }

  @Delete('bookmarks/:id')
  @UseGuards(JwtAuthGuard)
  async deleteBookmark(@Param('id') id: string) {
    try {
      await this.bookmarkService.remove(id);
      return { success: true, message: 'Bookmark deleted' };
    } catch (error) {
      console.error('Error deleting bookmark:', error);
      return { error: 'Failed to delete bookmark' };
    }
  }

  @Get('files')
  async getLocalFiles() {
    const docsPath = join(process.cwd(), 'docs');
    const files = [];
    
    try {
      if (existsSync(docsPath)) {
        const fileList = readdirSync(docsPath);
        
        for (const filename of fileList) {
          if (filename.endsWith('.txt') || filename.endsWith('.md')) {
            const filePath = join(docsPath, filename);
            const content = readFileSync(filePath, 'utf-8');
            
            files.push({
              _id: filename,
              title: filename,
              description: `本地文档: ${filename}`,
              content: content,
              type: filename.endsWith('.md') ? 'markdown' : 'text',
              category: 'document',
              tags: [filename.split('.').pop() || 'unknown'],
              likes: 0,
              views: 0,
              rating: 0,
              uploaderName: 'System',
              createdAt: new Date().toISOString()
            });
          }
        }
      }
    } catch (error) {
      console.error('Error reading docs directory:', error);
    }
    
    return { 
      data: files, 
      total: files.length 
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
    const uploadsPath = join(process.cwd(), 'assets', 'uploads');

    if (!existsSync(uploadsPath)) {
      console.log('Uploads directory not found:', uploadsPath);
      return { data: [], total: 0, tree: { type: 'directory', name: 'uploads', path: '/', children: [] } };
    }

    const baseUrl = 'http://localhost:3344/uploads';

    type TreeNode = { type: 'directory' | 'file'; name: string; path: string; children?: TreeNode[]; url?: string };

    const imageLikeExtensions = new Set(['jpg','jpeg','png','gif','webp','bmp','svg']);
    const videoLikeExtensions = new Set(['mp4','mov','webm','m4v']);

    const flatFiles: any[] = [];

    function isMediaFile(fileName: string): boolean {
      const ext = (fileName.split('.').pop() || '').toLowerCase();
      return imageLikeExtensions.has(ext) || videoLikeExtensions.has(ext);
    }

    function scan(dirAbs: string, relPath: string): TreeNode {
      const entries = readdirSync(dirAbs);
      const children: TreeNode[] = [];

      for (const entry of entries) {
        const abs = join(dirAbs, entry);
        const isDir = statSync(abs).isDirectory();
        const childRel = relPath ? `${relPath}/${entry}` : entry;
        if (isDir) {
          const node = scan(abs, childRel);
          children.push(node);
        } else {
          // only include media-like files
          if (!isMediaFile(entry)) continue;
          const url = `${baseUrl}/${childRel.replace(/\\/g, '/')}`;
          children.push({ type: 'file', name: entry, path: `/${childRel}`, url });
          flatFiles.push({
            _id: childRel,
            title: entry,
            description: `上传的文件: ${entry}`,
            imageUrl: url,
            category: 'uploaded',
            tags: [entry.split('.').pop() || 'unknown'],
            likes: 0,
            views: 0,
            rating: 0,
            uploaderName: 'System',
            createdAt: new Date().toISOString(),
            path: `/${childRel}`,
          });
        }
      }

      // sort: directories first then files, by name
      children.sort((a, b) => {
        if (a.type !== b.type) return a.type === 'directory' ? -1 : 1;
        return a.name.localeCompare(b.name);
      });

      return { type: 'directory', name: relPath || 'uploads', path: `/${relPath}`.replace(/\/$/, '/') || '/', children };
    }

    const tree = scan(uploadsPath, '');

    // filtering by category/search can be applied on flatFiles if needed
    let list = flatFiles;
    if (query?.search) {
      const kw = (query.search || '').toLowerCase();
      list = list.filter(x => (x.title || '').toLowerCase().includes(kw));
    }

    return { data: list, total: list.length, tree };
  }

  @Get('categories')
  async getCategories() {
    return ['uploaded', '技术', '新闻', '娱乐', '学习', '工具', '其他'];
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    // 简化实现，直接返回文件信息
    const uploadsPath = './assets/uploads';
    if (!existsSync(uploadsPath)) {
      return { error: 'File not found' };
    }
    
    const files = readdirSync(uploadsPath);
    const file = files.find(f => f === id);
    
    if (!file) {
      return { error: 'File not found' };
    }
    
    return {
      _id: file,
      title: file,
      description: `上传的文件: ${file}`,
      imageUrl: `http://localhost:3344/uploads/${file}`,
      category: 'uploaded',
      tags: [file.split('.').pop() || 'unknown'],
      likes: 0,
      views: 0,
      rating: 0,
      uploaderName: 'System',
      createdAt: new Date().toISOString()
    };
  }

  @Post(':id/like')
  @UseGuards(JwtAuthGuard)
  async like(@Param('id') id: string) {
    return { message: '点赞成功' };
  }

  @Post(':id/rating')
  @UseGuards(JwtAuthGuard)
  async rate(@Param('id') id: string, @Body() body: { rating: number }) {
    return { message: '评分成功' };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id') id: string, @Request() req) {
    return { message: '删除成功' };
  }
}