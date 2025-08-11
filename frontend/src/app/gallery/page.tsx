"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  Image,
  Typography,
  message,
  Modal,
  Upload,
  Spin,
  Empty,
  Button,
  Tabs,
  Input,
  Select,
  Form,
  Card,
  Space,
  Progress,
  Tree,
  Breadcrumb,
  Tooltip,
  Drawer,
} from "antd";
import {
  PlusOutlined,
  UploadOutlined,
  EyeOutlined,
  RobotOutlined,
  HistoryOutlined,
  FolderOpenOutlined,
} from "@ant-design/icons";
import { useGallery, useUploadImage } from "../../hooks/useGallery";
import { useGenerateImage, useGenerationHistory } from "../../hooks/useAI";
import AppLayout from "../../components/AppLayout";
import Masonry from "react-masonry-css";

const { Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

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
  path?: string;
}

interface RandomImage {
  id: string;
  url: string;
  width: number;
  height: number;
}

interface GeneratedImage {
  id: string;
  prompt: string;
  imageUrl: string;
  width: number;
  height: number;
  createdAt: string;
  status: "pending" | "completed" | "failed";
  isMock?: boolean;
}

interface GalleryTreeNode {
  type: "directory" | "file";
  name: string;
  path: string; // e.g. /nested/dir/file.jpg
  url?: string; // only for file
  children?: GalleryTreeNode[];
}

// 检查文件类型
const isVideoFile = (imageUrl: string): boolean => {
  return imageUrl.toLowerCase().endsWith(".mp4");
};

// 随机图片组件
function RandomImagesTab() {
  const [randomImages, setRandomImages] = useState<RandomImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadingRef = useRef<HTMLDivElement>(null);

  // 生成随机图片URL - 使用固定的随机种子确保一致性
  const generateRandomImageUrl = (
    index: number,
    source: "picsum" | "unsplash" = "picsum"
  ): string => {
    const width = Math.floor(Math.random() * 300) + 200; // 200-500px
    const height = Math.floor(Math.random() * 300) + 200; // 200-500px
    const seed = Math.floor(Math.random() * 1000000); // 固定种子

    if (source === "picsum") {
      return `https://picsum.photos/seed/${seed}/${width}/${height}`;
    } else {
      return `https://source.unsplash.com/random/${width}x${height}?sig=${seed}`;
    }
  };

  // 获取随机图片
  const fetchRandomImages = useCallback(async (count: number = 10) => {
    setLoading(true);
    try {
      const newImages: RandomImage[] = [];
      for (let i = 0; i < count; i++) {
        const width = Math.floor(Math.random() * 300) + 200; // 200-500px
        const height = Math.floor(Math.random() * 300) + 200; // 200-500px
        const imageId = `random-${Date.now()}-${i}`;
        const imageUrl = generateRandomImageUrl(i);
        newImages.push({
          id: imageId,
          url: imageUrl,
          width,
          height,
        });
      }
      setRandomImages((prev) => [...prev, ...newImages]);
    } catch (error) {
      message.error("获取随机图片失败");
    } finally {
      setLoading(false);
    }
  }, []);

  // 处理图片加载错误
  const handleImageError = (imageId: string, currentUrl: string) => {
    setFailedImages((prev) => new Set([...Array.from(prev), imageId]));

    // 尝试使用备用图片源
    let backupUrl = currentUrl;
    if (currentUrl.includes("picsum.photos")) {
      // 从URL中提取种子和尺寸
      const match = currentUrl.match(/seed\/(\d+)\/(\d+)\/(\d+)/);
      if (match) {
        const [, seed, width, height] = match;
        backupUrl = `https://source.unsplash.com/random/${width}x${height}?sig=${seed}`;
      } else {
        backupUrl = currentUrl.replace(
          "picsum.photos",
          "source.unsplash.com/random"
        );
      }
    } else if (currentUrl.includes("source.unsplash.com")) {
      // 如果Unsplash也失败，使用占位图片
      backupUrl = `https://via.placeholder.com/300x200/cccccc/666666?text=图片加载失败`;
    }

    setRandomImages((prev) =>
      prev.map((img) => (img.id === imageId ? { ...img, url: backupUrl } : img))
    );
  };

  // 无限滚动
  const lastElementRef = useCallback(
    (node: HTMLDivElement) => {
      if (loading) return;
      if (observerRef.current) observerRef.current.disconnect();
      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          fetchRandomImages();
        }
      });
      if (node) observerRef.current.observe(node);
    },
    [loading, hasMore, fetchRandomImages]
  );

  // 初始化加载
  useEffect(() => {
    fetchRandomImages();
  }, [fetchRandomImages]);

  // 瀑布流断点配置
  const breakpointColumns = {
    default: 4,
    1100: 3,
    700: 2,
    500: 1,
  };

  return (
    <div>
      <Spin spinning={loading && randomImages.length === 0} size="large">
        {randomImages.length > 0 ? (
          <Masonry
            breakpointCols={breakpointColumns}
            className="my-masonry-grid"
            columnClassName="my-masonry-grid_column"
          >
            {randomImages.map((image, index) => (
              <div
                key={image.id}
                className="mb-4"
                ref={
                  index === randomImages.length - 1 ? lastElementRef : undefined
                }
              >
                <div className="relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                  <Image
                    alt={`随机图片 ${index + 1}`}
                    src={image.url}
                    className="w-full object-cover"
                    style={{ height: "auto" }}
                    preview={{
                      mask: (
                        <div className="flex flex-col items-center text-white text-sm">
                          <EyeOutlined className="text-2xl mb-2" />
                          点击预览
                        </div>
                      ),
                    }}
                    onError={() => handleImageError(image.id, image.url)}
                    fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=="
                  />
                </div>
              </div>
            ))}
          </Masonry>
        ) : (
          <Empty description="暂无图片" className="mt-16 py-10" />
        )}
      </Spin>

      {loading && randomImages.length > 0 && (
        <div className="text-center py-4">
          <Spin size="large" />
          <div className="mt-2 text-gray-500">加载更多图片...</div>
        </div>
      )}
    </div>
  );
}

// 上传文件组件
function UploadTab() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchText, setSearchText] = useState<string>("");
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewVideo, setPreviewVideo] = useState<string>("");
  const [selectedPath, setSelectedPath] = useState<string>("/");
  const [treeFilter, setTreeFilter] = useState<string>("");
  const [dirDrawerOpen, setDirDrawerOpen] = useState<boolean>(false);

  const {
    data: galleryResponse,
    isLoading,
    error,
    refetch,
  } = useGallery({
    category: selectedCategory === "all" ? undefined : selectedCategory,
    search: searchText || undefined,
  });

  // 从响应中提取数据
  const galleryData: GalleryItem[] | undefined = galleryResponse?.data;
  const galleryTree: GalleryTreeNode | undefined = galleryResponse?.tree;

  // 将后端树结构转换为 antd TreeData，并支持名称过滤
  const treeData = (function buildTree() {
    if (!galleryTree) return [];

    const nameIncludes = (name: string) =>
      !treeFilter || name.toLowerCase().includes(treeFilter.toLowerCase());

    const walk = (node: GalleryTreeNode): any | null => {
      const isDir = node.type === "directory";
      // 仅目录节点
      const filteredChildren = (node.children || [])
        .filter((child) => child.type === "directory")
        .map(walk)
        .filter(Boolean) as any[];

      // 自身匹配或子孙匹配时保留
      if (!(nameIncludes(node.name) || filteredChildren.length > 0)) return null;

      return {
        key: node.path || "/",
        title: (
          <Tooltip title={node.name || (isDir ? "uploads" : node.path)} placement="right">
            <span className="tree-title-ellipsis">
              {node.name || (isDir ? "uploads" : node.path)}
            </span>
          </Tooltip>
        ),
        selectable: true,
        isLeaf: false,
        // 仅显示目录，不显示文件
        children: filteredChildren,
      };
    };

    const root = walk(galleryTree);
    return root ? [root] : [];
  })();

  const uploadImageMutation = useUploadImage();

  const handleUpload = () => {
    setIsModalVisible(true);
  };

  const handleImageUpload = (file: File) => {
    uploadImageMutation.mutate(file, {
      onSuccess: (data: any) => {
        setIsModalVisible(false);
      },
    });
    return false; // 阻止自动上传
  };

  const handleVideoPreview = (videoUrl: string) => {
    setPreviewVideo(videoUrl);
    setPreviewVisible(true);
  };

  // 过滤展示的文件列表（根据选中的目录与搜索/分类）
  const getParentDir = (p?: string): string => {
    if (!p) return "/";
    const idx = p.lastIndexOf("/");
    if (idx <= 0) return "/";
    return p.substring(0, idx);
  };

  const filteredList: GalleryItem[] = Array.isArray(galleryData)
    ? galleryData.filter((item) => {
        const parentDir = getParentDir(item.path || "");
        const inSelectedFolder = parentDir === selectedPath;
        const matchCategory = selectedCategory === "all" ? true : item.category === selectedCategory;
        const matchSearch = searchText ? (item.title || "").toLowerCase().includes(searchText.toLowerCase()) : true;
        return inSelectedFolder && matchCategory && matchSearch;
      })
    : [];

  // 瀑布流断点配置
  const breakpointColumns = {
    default: 4,
    1100: 3,
    700: 2,
    500: 1,
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Text type="danger">加载失败: {error.message}</Text>
      </div>
    );
  }

  return (
    <div>
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

      {/* 目录树 + 文件网格 */}
      <Spin spinning={isLoading} size="large">
        <div className="grid-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Button
              type="primary"
              shape="circle"
              size="large"
              className="floating-dir-button"
              aria-label="打开目录"
              icon={<FolderOpenOutlined />}
              onClick={() => setDirDrawerOpen(true)}
            />
            <Breadcrumb
              items={(() => {
                const parts = (selectedPath || '/').split('/').filter(Boolean);
                const items = [{ title: 'uploads', path: '/' } as any].concat(
                  parts.map((p, idx) => ({
                    title: p,
                    path: '/' + parts.slice(0, idx + 1).join('/'),
                  }))
                );
                return items.map((it) => ({
                  title: (
                    <a onClick={() => setSelectedPath(it.path)} className="breadcrumb-link" title={it.title as string}>
                      {it.title}
                    </a>
                  ),
                }));
              })()}
            />
          </div>
          <span className="grid-count">{filteredList.length} 个文件</span>
        </div>
        {/* 侧边抽屉 */}
        <Drawer
          title="文件夹"
          placement="left"
          width={360}
          open={dirDrawerOpen}
          onClose={() => setDirDrawerOpen(false)}
          destroyOnClose
        >
          <Input
            allowClear
            placeholder="搜索文件夹..."
            size="middle"
            className="mb-3"
            value={treeFilter}
            onChange={(e) => setTreeFilter(e.target.value)}
          />
          {treeData.length > 0 ? (
            <Tree
              treeData={treeData}
              defaultExpandAll
              selectedKeys={[selectedPath]}
              className="no-indent-tree"
              style={{ maxWidth: '100%', overflowX: 'hidden' }}
              onSelect={(keys) => {
                const key = Array.isArray(keys) ? (keys[0] as string) : (keys as any);
                setSelectedPath(key || "/");
                setDirDrawerOpen(false);
              }}
            />
          ) : (
            <Empty description="暂无文件夹" />
          )}
        </Drawer>
        {filteredList.length > 0 ? (
          <Masonry
            breakpointCols={breakpointColumns}
            className="my-masonry-grid"
            columnClassName="my-masonry-grid_column"
          >
            {filteredList.map((item: GalleryItem) => {
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
                          className="w-full object-cover cursor-pointer"
                          onClick={() => handleVideoPreview(item.imageUrl)}
                        />
                        <div
                          className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 hover:bg-opacity-30 transition-all duration-300 cursor-pointer"
                          onClick={() => handleVideoPreview(item.imageUrl)}
                        >
                          <div className="text-white opacity-0 hover:opacity-100 transition-opacity duration-300">
                            <EyeOutlined className="text-2xl" />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <Image
                        alt={item.title}
                        src={item.imageUrl}
                        className="w-full object-cover"
                        style={{ height: "auto" }}
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

      {/* 视频预览模态框 */}
      <Modal
        title="视频预览"
        open={previewVisible}
        onCancel={() => setPreviewVisible(false)}
        footer={null}
        width={800}
        centered
        destroyOnClose
      >
        <div className="text-center">
          <video
            src={previewVideo}
            controls={true}
            autoPlay={false}
            muted={false}
            style={{ width: "100%", maxHeight: "70vh" }}
          />
        </div>
      </Modal>
    </div>
  );
}

function GalleryContent() {
  const tabItems = [
    {
      key: "upload",
      label: "我的文件",
      children: <UploadTab />,
    },
    {
      key: "random",
      label: "随机图片",
      children: <RandomImagesTab />,
    },
  ];

  return (
    <AppLayout>
      <Tabs
        defaultActiveKey="upload"
        items={tabItems}
        className="gallery-tabs"
        size="large"
      />
    </AppLayout>
  );
}

export default function Gallery() {
  return <GalleryContent />;
}
