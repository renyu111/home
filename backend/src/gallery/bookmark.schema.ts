import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type BookmarkDocument = Bookmark & Document;

@Schema({ timestamps: true })
export class Bookmark {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  url: string;

  @Prop({ default: '' })
  description: string;

  @Prop({ default: '其他' })
  category: string;

  @Prop({ type: [String], default: [] })
  tags: string[];

  @Prop({ required: true })
  createdBy: string;

  @Prop()
  updatedBy?: string;
}

export const BookmarkSchema = SchemaFactory.createForClass(Bookmark);