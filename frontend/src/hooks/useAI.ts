import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { aiImageAPI } from '../services/api';

// 生成图片
export const useGenerateImage = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ prompt, width, height }: { prompt: string; width: number; height: number }) =>
      aiImageAPI.generateImage(prompt, width, height),
    onSuccess: () => {
      // 生成成功后刷新历史记录
      queryClient.invalidateQueries({ queryKey: ['ai-generation-history'] });
    },
  });
};

// 获取生成历史
export const useGenerationHistory = () => {
  return useQuery({
    queryKey: ['ai-generation-history'],
    queryFn: aiImageAPI.getGenerationHistory,
    staleTime: 5 * 60 * 1000, // 5分钟
  });
}; 