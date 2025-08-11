import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class AiService {
  private readonly stabilityApiKey = process.env.STABILITY_API_KEY || 'your-stability-api-key';
  private readonly stabilityApiUrl = 'https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image';

  async generateImage(prompt: string, width: number, height: number) {
    try {
      console.log('开始生成图片:', { prompt, width, height });
      console.log('使用API密钥:', this.stabilityApiKey.substring(0, 10) + '...');
      
      // 首先尝试调用真实的Stability AI API
      try {
        const result = await this.callStabilityAI(prompt, width, height);
        return result;
      } catch (apiError) {
        console.log('Stability AI API调用失败，使用模拟服务:', apiError.message);
        return await this.generateMockImage(prompt, width, height);
      }
    } catch (error) {
      console.error('AI图片生成详细错误:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        statusText: error.response?.statusText,
        code: error.code,
      });
      
      throw new HttpException(`图片生成失败: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  private async callStabilityAI(prompt: string, width: number, height: number) {
    // 简单的中文到英文翻译映射
    const translations: { [key: string]: string } = {
      '猫': 'cat',
      '小猫': 'kitten',
      '狗': 'dog',
      '小狗': 'puppy',
      '风景': 'landscape',
      '海滩': 'beach',
      '山': 'mountain',
      '花': 'flower',
      '树': 'tree',
      '天空': 'sky',
      '云': 'cloud',
      '太阳': 'sun',
      '月亮': 'moon',
      '星星': 'star',
      '水': 'water',
      '海': 'sea',
      '湖': 'lake',
      '河': 'river',
      '森林': 'forest',
      '花园': 'garden',
      '公园': 'park',
      '城市': 'city',
      '建筑': 'building',
      '房子': 'house',
      '城堡': 'castle',
      '桥': 'bridge',
      '路': 'road',
      '车': 'car',
      '船': 'ship',
      '飞机': 'airplane',
      '鸟': 'bird',
      '鱼': 'fish',
      '蝴蝶': 'butterfly',
      '蜜蜂': 'bee',
      '阳光': 'sunlight',
      '明媚': 'bright',
      '美丽': 'beautiful',
      '可爱': 'cute',
      '可爱的小猫': 'cute kitten',
      '可爱的小狗': 'cute puppy',
      '美丽的海滩': 'beautiful beach',
      '美丽的海滩风景': 'beautiful beach landscape',
      '阳光明媚': 'bright sunlight',
      '油画风格': 'oil painting style',
      '水彩画': 'watercolor',
      '素描': 'sketch',
      '卡通': 'cartoon',
      '动漫': 'anime',
      '写实': 'realistic',
      '抽象': 'abstract',
      '现代': 'modern',
      '古典': 'classical',
      '浪漫': 'romantic',
      '梦幻': 'dreamy',
      '神秘': 'mysterious',
      '温馨': 'warm',
      '宁静': 'peaceful',
      '活力': 'energetic',
      '优雅': 'elegant',
      '简单': 'simple',
      '复杂': 'complex',
      '色彩丰富': 'colorful',
      '黑白': 'black and white',
      '金色': 'golden',
      '银色': 'silver',
      '蓝色': 'blue',
      '红色': 'red',
      '绿色': 'green',
      '黄色': 'yellow',
      '紫色': 'purple',
      '橙色': 'orange',
      '粉色': 'pink',
      '棕色': 'brown',
      '灰色': 'gray',
      '白色': 'white',
      '黑色': 'black',
    };

    // 简单的翻译函数
    let englishPrompt = prompt;
    for (const [chinese, english] of Object.entries(translations)) {
      englishPrompt = englishPrompt.replace(new RegExp(chinese, 'g'), english);
    }

    // 如果翻译后还是中文，添加一些通用的英文描述
    if (/[\u4e00-\u9fff]/.test(englishPrompt)) {
      englishPrompt = `beautiful ${englishPrompt}, high quality, detailed`;
    }

    console.log('原文:', prompt);
    console.log('翻译后:', englishPrompt);

    const requestBody = {
      text_prompts: [
        {
          text: englishPrompt,
          weight: 1,
        },
      ],
      cfg_scale: 7,
      height,
      width,
      samples: 1,
      steps: 30,
    };

    console.log('调用Stability AI API...');

    const response = await axios.post(
      this.stabilityApiUrl,
      requestBody,
      {
        headers: {
          'Authorization': `Bearer ${this.stabilityApiKey}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        timeout: 60000,
        maxRedirects: 5,
        validateStatus: (status) => status < 500,
      }
    );

    console.log('API响应状态:', response.status);

    if (response.data.artifacts && response.data.artifacts.length > 0) {
      const imageData = response.data.artifacts[0];
      return await this.saveImage(imageData.base64, prompt, width, height);
    } else {
      throw new Error('API响应中没有artifacts');
    }
  }

  private async generateMockImage(prompt: string, width: number, height: number) {
    console.log('生成模拟图片...');
    
    // 创建一个简单的占位图片URL
    const fileName = `mock-generated-${Date.now()}.png`;
    const filePath = path.join(process.cwd(), 'assets', 'ai-generated', fileName);
    
    // 确保目录存在
    const uploadDir = path.dirname(filePath);
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // 直接创建本地渐变PNG图片
    console.log('创建本地渐变PNG图片...');
    const simplePng = this.createSimplePNG(width, height, prompt);
    fs.writeFileSync(filePath, simplePng);
    console.log('本地PNG图片创建成功:', filePath);

    const imageUrl = `http://localhost:3344/ai-generated/${fileName}`;
    
    // 保存生成记录
    await this.saveGenerationRecord(prompt, imageUrl, width, height);

    return {
      success: true,
      imageUrl,
      prompt,
      width,
      height,
      generatedAt: new Date().toISOString(),
      isMock: true, // 标记这是模拟图片
    };
  }

  private createSimplePNG(width: number, height: number, text: string): Buffer {
    // 创建一个简单的PNG图片数据
    // 这是一个最小的PNG文件结构
    const pngHeader = Buffer.from([
      0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A  // PNG signature
    ]);
    
    // IHDR chunk (图片头部信息)
    const ihdrData = Buffer.alloc(13);
    ihdrData.writeUInt32BE(width, 0);      // width
    ihdrData.writeUInt32BE(height, 4);     // height
    ihdrData.writeUInt8(8, 8);             // bit depth
    ihdrData.writeUInt8(2, 9);             // color type (RGB)
    ihdrData.writeUInt8(0, 10);            // compression
    ihdrData.writeUInt8(0, 11);            // filter
    ihdrData.writeUInt8(0, 12);            // interlace
    
    const ihdrChunk = this.createPNGChunk('IHDR', ihdrData);
    
    // 创建一个渐变背景的RGB数据
    const pixelData = Buffer.alloc(width * height * 3);
    let pixelIndex = 0;
    
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        // 创建渐变效果
        const r = Math.floor(255 * (x / width));  // 从左到右红色渐变
        const g = Math.floor(255 * (y / height)); // 从上到下绿色渐变
        const b = Math.floor(128 + 127 * Math.sin(x / 50) * Math.cos(y / 50)); // 波浪蓝色
        
        pixelData[pixelIndex++] = r;
        pixelData[pixelIndex++] = g;
        pixelData[pixelIndex++] = b;
      }
    }
    
    // 压缩数据（简单的无压缩）
    const idatChunk = this.createPNGChunk('IDAT', pixelData);
    
    // IEND chunk (结束标记)
    const iendChunk = this.createPNGChunk('IEND', Buffer.alloc(0));
    
    return Buffer.concat([pngHeader, ihdrChunk, idatChunk, iendChunk]);
  }

  private createPNGChunk(type: string, data: Buffer): Buffer {
    const length = Buffer.alloc(4);
    length.writeUInt32BE(data.length, 0);
    
    const typeBuffer = Buffer.from(type, 'ascii');
    const crc = this.calculateCRC(Buffer.concat([typeBuffer, data]));
    const crcBuffer = Buffer.alloc(4);
    crcBuffer.writeUInt32BE(crc, 0);
    
    return Buffer.concat([length, typeBuffer, data, crcBuffer]);
  }

  private calculateCRC(buffer: Buffer): number {
    // 简单的CRC32计算（这里使用简化版本）
    let crc = 0xFFFFFFFF;
    for (let i = 0; i < buffer.length; i++) {
      crc ^= buffer[i];
      for (let j = 0; j < 8; j++) {
        crc = (crc & 1) ? (0xEDB88320 ^ (crc >>> 1)) : (crc >>> 1);
      }
    }
    return (crc ^ 0xFFFFFFFF) >>> 0;
  }

  private async saveImage(base64Data: string, prompt: string, width: number, height: number) {
    const fileName = `ai-generated-${Date.now()}.png`;
    const filePath = path.join(process.cwd(), 'assets', 'ai-generated', fileName);
    
    // 确保目录存在
    const uploadDir = path.dirname(filePath);
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // 保存图片文件
    const buffer = Buffer.from(base64Data, 'base64');
    fs.writeFileSync(filePath, buffer);

    console.log('图片已保存到:', filePath);

    // 返回可访问的URL
    const imageUrl = `http://localhost:3344/ai-generated/${fileName}`;

    // 保存生成记录
    await this.saveGenerationRecord(prompt, imageUrl, width, height);

    return {
      success: true,
      imageUrl,
      prompt,
      width,
      height,
      generatedAt: new Date().toISOString(),
    };
  }

  async getGenerationHistory() {
    try {
      const historyFile = path.join(process.cwd(), 'data', 'ai-generation-history.json');
      
      if (!fs.existsSync(historyFile)) {
        return [];
      }

      const historyData = fs.readFileSync(historyFile, 'utf8');
      return JSON.parse(historyData);
    } catch (error) {
      console.error('获取历史记录错误:', error);
      return [];
    }
  }

  private async saveGenerationRecord(prompt: string, imageUrl: string, width: number, height: number) {
    try {
      const historyFile = path.join(process.cwd(), 'data', 'ai-generation-history.json');
      const dataDir = path.dirname(historyFile);
      
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }

      const record = {
        id: `ai-${Date.now()}`,
        prompt,
        imageUrl,
        width,
        height,
        createdAt: new Date().toISOString(),
      };

      let history = [];
      if (fs.existsSync(historyFile)) {
        const historyData = fs.readFileSync(historyFile, 'utf8');
        history = JSON.parse(historyData);
      }

      history.unshift(record);
      
      // 只保留最近100条记录
      if (history.length > 100) {
        history = history.slice(0, 100);
      }

      fs.writeFileSync(historyFile, JSON.stringify(history, null, 2));
    } catch (error) {
      console.error('保存生成记录错误:', error);
    }
  }
} 