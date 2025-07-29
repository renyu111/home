import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type GalleryDocument = Gallery & Document;

@Schema({ timestamps: true })
export class Gallery {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  imageUrl: string;

  @Prop({ required: true })
  category: string;

  @Prop({ type: [String], default: [] })
  tags: string[];

  @Prop({ default: 0 })
  likes: number;

  @Prop({ default: 0 })
  views: number;

  @Prop({ default: 0 })
  rating: number;

  @Prop({ required: true })
  uploaderId: string;

  @Prop({ required: true })
  uploaderName: string;
}

export const GallerySchema = SchemaFactory.createForClass(Gallery);