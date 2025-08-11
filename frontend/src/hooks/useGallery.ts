import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { galleryAPI } from '../services/api';
import { message } from 'antd';

export const useGallery = (params?: { category?: string; search?: string; page?: number; limit?: number }) => {
  return useQuery({
    queryKey: ['gallery', params],
    queryFn: async () => {
      const response = await galleryAPI.getGallery(params);
      return response.data;
    },
  });
};

export const useGalleryItem = (id: string) => {
  return useQuery({
    queryKey: ['gallery', id],
    queryFn: async () => (await galleryAPI.getGalleryItem(id)).data,
    enabled: !!id,
  });
};

export const useUploadImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: galleryAPI.uploadImage,
    onSuccess: (data) => {
      message.success('文件上传成功！');
      // 刷新gallery列表
      queryClient.invalidateQueries({ queryKey: ['gallery'] });
      return data;
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || '上传失败');
    },
  });
};

export const useCreateGalleryItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: galleryAPI.createGalleryItem,
    onSuccess: () => {
      message.success('作品上传成功！');
      queryClient.invalidateQueries({ queryKey: ['gallery'] });
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || '上传失败');
    },
  });
};

export const useLikeGalleryItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: galleryAPI.likeGalleryItem,
    onSuccess: () => {
      message.success('点赞成功！');
      queryClient.invalidateQueries({ queryKey: ['gallery'] });
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || '点赞失败');
    },
  });
};

export const useRateGalleryItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, rating }: { id: string; rating: number }) =>
      galleryAPI.rateGalleryItem(id, rating),
    onSuccess: () => {
      message.success('评分成功！');
      queryClient.invalidateQueries({ queryKey: ['gallery'] });
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || '评分失败');
    },
  });
};

export const useDeleteGalleryItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: galleryAPI.deleteGalleryItem,
    onSuccess: () => {
      message.success('删除成功！');
      queryClient.invalidateQueries({ queryKey: ['gallery'] });
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || '删除失败');
    },
  });
};

export const useGalleryCategories = () => {
  return useQuery({
    queryKey: ['gallery-categories'],
    queryFn: () => galleryAPI.getCategories(),
    select: (data) => data.data, // 提取data字段
  });
};