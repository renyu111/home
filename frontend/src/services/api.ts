import axios from 'axios';

// 创建axios实例
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3344',
  timeout: 10000,
});

// 移除登录注册相关逻辑：不再注入 token，不再处理 401 重定向
// 保留基础实例供其余模块使用

// 用户API
export const usersAPI = {
  getUsers: () => api.get('/api/users'),
  getUser: (id: string) => api.get(`/api/users/${id}`),
  createUser: (data: any) => api.post('/api/users', data),
  updateUser: (id: string, data: any) => api.put(`/api/users/${id}`, data),
  deleteUser: (id: string) => api.delete(`/api/users/${id}`),
};

// 收藏夹API
export const bookmarkAPI = {
  getBookmarks: () => api.get('/api/gallery/bookmarks'),
  addBookmark: (data: any) => api.post('/api/gallery/bookmarks', data),
  updateBookmark: (id: string, data: any) => api.put(`/api/gallery/bookmarks/${id}`, data),
  deleteBookmark: (id: string) => api.delete(`/api/gallery/bookmarks/${id}`),
};

// 画廊API
export const galleryAPI = {
  getGallery: (params?: any) => api.get('/api/gallery', { params }),
  getGalleryItem: (id: string) => api.get(`/api/gallery/${id}`),
  createGalleryItem: (data: any) => api.post('/api/gallery', data),
  likeGalleryItem: (id: string) => api.post(`/api/gallery/${id}/like`),
  rateGalleryItem: (id: string, rating: number) =>
    api.post(`/api/gallery/${id}/rating`, { rating }),
  deleteGalleryItem: (id: string) => api.delete(`/api/gallery/${id}`),
  getCategories: () => api.get('/api/gallery/categories'),
  uploadImage: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/api/gallery/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  getLocalFiles: () => api.get('/api/gallery/files'),
};

export default api;