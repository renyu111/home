import { Module } from '@nestjs/common';
import { GalleryController } from './gallery.controller';
import { GalleryService } from './gallery.service';
import { BookmarkService } from './bookmark.service';

@Module({
  imports: [],
  controllers: [GalleryController],
  providers: [GalleryService, BookmarkService],
  exports: [GalleryService, BookmarkService],
})
export class GalleryModule {}