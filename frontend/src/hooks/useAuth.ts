import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authAPI } from '../services/api';
import { message } from 'antd';
import { useRouter } from 'next/navigation';

export const useLogin = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: authAPI.login,
    onSuccess: (data) => {
      const { access_token, user } = data.data;
      localStorage.setItem('token', access_token);
      localStorage.setItem('user', JSON.stringify(user));
      message.success('登录成功！');
      router.push('/gallery');
      // 使缓存失效，重新获取用户数据
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || '登录失败');
    },
  });
};

export const useRegister = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: authAPI.register,
    onSuccess: (data) => {
      const { access_token, user } = data.data;
      localStorage.setItem('token', access_token);
      localStorage.setItem('user', JSON.stringify(user));
      message.success('注册成功！');
      router.push('/gallery');
      // 使缓存失效，重新获取用户数据
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || '注册失败');
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: () => {
      authAPI.logout();
      return Promise.resolve();
    },
    onSuccess: () => {
      message.success('已退出登录');
      router.push('/');
      // 清除所有缓存
      queryClient.clear();
    },
  });
};