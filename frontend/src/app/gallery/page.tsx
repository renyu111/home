"use client";

import { useState, useEffect } from "react";
import {
  Image,
  Typography,
  message,
  Modal,
  Upload,
  Spin,
  Empty,
  Button,
} from "antd";
import {
  PlusOutlined,
  UploadOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { useGallery, useUploadImage } from "../../hooks/useGallery";
import AuthGuard from "../../components/AuthGuard";
import AppLayout from "../../components/AppLayout";
import Masonry from 'react-masonry-css';

const { Text } = Typography;

interface GalleryItem {
  _id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
  tags: string[];
  likes: number;
  views: number;
  rating: number;
  uploaderName: string;
  createdAt: string;
}

// 检查文件类型
const isVideoFile = (imageUrl: string): boolean => {
  return imageUrl.toLowerCase().endsWith('.mp4');
};

function GalleryContent() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchText, setSearchText] = useState<string>("");

  const {
    data: galleryResponse,
    isLoading,
    error,
  } = useGallery({
    category: selectedCategory === "all" ? undefined : selectedCategory,
    search: searchText || undefined,
  });

  // 从响应中提取数据
  const galleryData = galleryResponse?.data;

  const uploadImageMutation = useUploadImage();

  const handleUpload = () => {
    setIsModalVisible(true);
  };

  const handleImageUpload = (file: File) => {
    uploadImageMutation.mutate(file, {
      onSuccess: (data: any) => {
        message.success("文件上传成功！");
        setIsModalVisible(false);
      },
    });
    return false; // 阻止自动上传
  };

  // 瀑布流断点配置
  const breakpointColumns = {
    default: 4,
    1100: 3,
    700: 2,
    500: 1
  };

  if (error) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-screen">
          <Text type="danger">加载失败: {error.message}</Text>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      {/* 搜索和筛选 */}
      <div className="bg-white rounded-xl p-6 mb-6 shadow-sm border border-gray-100">
        <Button
          type="primary"
          size="large"
          icon={<PlusOutlined />}
          onClick={handleUpload}
          className="w-full rounded-lg h-10"
        >
          上传文件
        </Button>
      </div>

      {/* 瀑布流文件网格 */}
      <Spin spinning={isLoading} size="large">
        {Array.isArray(galleryData) && galleryData.length > 0 ? (
          <Masonry
            breakpointCols={breakpointColumns}
            className="my-masonry-grid"
            columnClassName="my-masonry-grid_column"
          >
            {galleryData.map((item: GalleryItem) => {
              const isVideo = isVideoFile(item.imageUrl);
              
              return (
                <div key={item._id} className="mb-4">
                  <div className="relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                    {isVideo ? (
                      <div className="relative">
                        <video
                          src={item.imageUrl}
                          width="200px"
                          height="auto"
                          controls={false}
                          autoPlay={true}
                          muted={true}
                          loop={true}
                          playsInline={true}
                        />
                      </div>
                    ) : (
                      <Image
                        alt={item.title}
                        src={item.imageUrl}
                        className="w-full object-cover"
                        style={{ height: 'auto' }}
                        preview={{
                          mask: (
                            <div className="flex flex-col items-center text-white text-sm">
                              <EyeOutlined className="text-2xl mb-2" />
                              点击预览
                            </div>
                          ),
                        }}
                      />
                    )}
                  </div>
                </div>
              );
            })}
          </Masonry>
        ) : (
          <Empty description="暂无文件" className="mt-16 py-10" />
        )}
      </Spin>

      {/* 上传模态框 */}
      <Modal
        title="上传文件"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={400}
        centered
      >
        <div className="p-6">
          <Upload
            listType="picture"
            maxCount={1}
            beforeUpload={handleImageUpload}
            showUploadList={false}
            disabled={uploadImageMutation.isPending}
          >
            <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
              <UploadOutlined className="text-4xl text-gray-400 mb-4" />
              <div className="text-gray-600 mb-2">
                {uploadImageMutation.isPending ? "上传中..." : "点击或拖拽上传"}
              </div>
              <div className="text-sm text-gray-400">
                支持图片和视频格式，最大 50MB
              </div>
            </div>
          </Upload>

          {uploadImageMutation.isPending && (
            <div className="mt-4 text-center">
              <div className="inline-block w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <span className="ml-2 text-blue-500">上传中...</span>
            </div>
          )}
        </div>
      </Modal>
    </AppLayout>
  );
}

export default function Gallery() {
  return (
    <AuthGuard>
      <GalleryContent />
    </AuthGuard>
  );
}
