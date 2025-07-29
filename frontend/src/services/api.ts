import axios from 'axios';

// 创建axios实例
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器 - 添加token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器 - 处理错误
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // 清除本地存储的token
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // 重定向到登录页
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

// 认证相关API
export const authAPI = {
  login: (data: { email: string; password: string }) =>
    api.post('/api/auth/login', data),
  
  register: (data: { email: string; password: string; name: string }) =>
    api.post('/api/auth/register', data),
  
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};

// 用户相关API
export const userAPI = {
  getUsers: () => api.get('/api/users'),
  
  getUser: (id: string) => api.get(`/api/users/${id}`),
  
  createUser: (data: { email: string; password: string; name: string }) =>
    api.post('/api/users', data),
  
  updateUser: (id: string, data: any) =>
    api.patch(`/api/users/${id}`, data),
  
  deleteUser: (id: string) => api.delete(`/api/users/${id}`),
};

// 健康检查API
export const healthAPI = {
  check: () => api.get('/api/health'),
};

// 图片鉴赏相关API
export const galleryAPI = {
  getGallery: (params?: { category?: string; search?: string; page?: number; limit?: number }) =>
    api.get('/api/gallery', { params }),
  
  getGalleryItem: (id: string) => api.get(`/api/gallery/${id}`),
  
  uploadImage: (file: File) => {
    const formData = new FormData();
    formData.append('image', file);
    return api.post('/api/gallery/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  
  createGalleryItem: (data: {
    title: string;
    description: string;
    imageUrl: string;
    category: string;
    tags: string[];
  }) => api.post('/api/gallery', data),
  
  likeGalleryItem: (id: string) => api.post(`/api/gallery/${id}/like`),
  
  rateGalleryItem: (id: string, rating: number) => 
    api.post(`/api/gallery/${id}/rating`, { rating }),
  
  deleteGalleryItem: (id: string) => api.delete(`/api/gallery/${id}`),
  
  getCategories: () => api.get('/api/gallery/categories'),
};

export default api;