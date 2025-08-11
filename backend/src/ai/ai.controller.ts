import { Controller, Post, Get, Body, HttpException, HttpStatus } from '@nestjs/common';
import { AiService } from './ai.service';

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('generate-image')
  async generateImage(@Body() body: { prompt: string; width: number; height: number }) {
    try {
      const { prompt, width, height } = body;
      
      if (!prompt || !width || !height) {
        throw new HttpException('缺少必要参数', HttpStatus.BAD_REQUEST);
      }

      // 验证尺寸
      if (width < 512 || height < 512 || width > 2048 || height > 2048) {
        throw new HttpException('图片尺寸必须在512x512到2048x2048之间', HttpStatus.BAD_REQUEST);
      }

      // 验证尺寸是否为64的倍数
      if (width % 64 !== 0 || height % 64 !== 0) {
        throw new HttpException('图片尺寸必须是64的倍数', HttpStatus.BAD_REQUEST);
      }

      const result = await this.aiService.generateImage(prompt, width, height);
      return result;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('图片生成失败', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('generation-history')
  async getGenerationHistory() {
    try {
      const history = await this.aiService.getGenerationHistory();
      return history;
    } catch (error) {
      throw new HttpException('获取历史记录失败', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
} 