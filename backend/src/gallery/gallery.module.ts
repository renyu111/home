import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GalleryController } from './gallery.controller';
import { GalleryService } from './gallery.service';
import { BookmarkService } from './bookmark.service';
import { Bookmark, BookmarkSchema } from './bookmark.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Bookmark.name, schema: BookmarkSchema }
    ])
  ],
  controllers: [GalleryController],
  providers: [GalleryService, BookmarkService],
  exports: [GalleryService, BookmarkService],
})
export class GalleryModule {}