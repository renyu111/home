import { IsString, IsOptional, IsArray } from 'class-validator';

export class CreateGalleryDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsString()
  imageUrl: string;

  @IsString()
  category: string;

  @IsArray()
  tags: string[];

  @IsOptional()
  @IsString()
  uploaderId?: string;

  @IsOptional()
  @IsString()
  uploaderName?: string;
}