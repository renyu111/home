"use client";

import { useState, useEffect } from "react";
import {
  Typography,
  Card,
  Tag,
  Spin,
  Empty,
  Row,
  Col,
  Button,
  Modal,
  Form,
  Input,
  Select,
  message,
  Popconfirm,
} from "antd";
import { BookOutlined, PlusOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";
import AppLayout from "../../components/AppLayout";
import { bookmarkAPI } from "../../services/api";

const { Title, Paragraph } = Typography;
const { Option } = Select;

interface Bookmark {
  id: string;
  title: string;
  url: string;
  description: string;
  category: string;
  tags: string[];
  createdAt: string;
  createdBy: string;
}

function BookmarksContent() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingBookmark, setEditingBookmark] = useState<Bookmark | null>(null);
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();

  useEffect(() => {
    loadBookmarks();
  }, []);

  const loadBookmarks = async () => {
    try {
      setLoading(true);
      const response = await bookmarkAPI.getBookmarks();
      setBookmarks(response.data.data || []);
    } catch (error) {
      console.error("Failed to load bookmarks:", error);
      message.error("加载收藏夹失败");
    } finally {
      setLoading(false);
    }
  };

  const handleAddBookmark = async (values: any) => {
    try {
      await bookmarkAPI.addBookmark(values);
      message.success("添加收藏成功");
      setModalVisible(false);
      form.resetFields();
      loadBookmarks();
    } catch (error) {
      console.error("Failed to add bookmark:", error);
      message.error("添加收藏失败");
    }
  };

  const handleEditBookmark = async (values: any) => {
    if (!editingBookmark) return;
    
    try {
      await bookmarkAPI.updateBookmark(editingBookmark.id, values);
      message.success('编辑收藏成功');
      setEditModalVisible(false);
      setEditingBookmark(null);
      editForm.resetFields();
      loadBookmarks();
    } catch (error) {
      console.error('Failed to edit bookmark:', error);
      message.error('编辑收藏失败');
    }
  };

  const handleDeleteBookmark = async (id: string) => {
    try {
      await bookmarkAPI.deleteBookmark(id);
      message.success("删除收藏成功");
      loadBookmarks();
    } catch (error) {
      console.error("Failed to delete bookmark:", error);
      message.error("删除收藏失败");
    }
  };

  const handleEdit = (bookmark: Bookmark) => {
    setEditingBookmark(bookmark);
    editForm.setFieldsValue({
      title: bookmark.title,
      url: bookmark.url,
      description: bookmark.description,
      category: bookmark.category,
      tags: bookmark.tags
    });
    setEditModalVisible(true);
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      "技术": "blue",
      "新闻": "green",
      "娱乐": "purple",
      "学习": "orange",
      "工具": "cyan",
      "其他": "default",
    };
    return colors[category] || "default";
  };

  const categories = [
    { value: "技术", label: "技术" },
    { value: "新闻", label: "新闻" },
    { value: "娱乐", label: "娱乐" },
    { value: "学习", label: "学习" },
    { value: "工具", label: "工具" },
    { value: "其他", label: "其他" },
  ];

  return (
    <AppLayout>
      <div className="mx-auto">
        <div className="mb-8 flex justify-between items-center">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setModalVisible(true)}
            size="large"
          >
            添加收藏
          </Button>
        </div>

        <Spin spinning={loading} size="large">
          {bookmarks.length > 0 ? (
            <Row gutter={[16, 16]}>
              {bookmarks.map((bookmark) => (
                <Col xs={24} sm={12} md={8} lg={6} key={bookmark.id}>
                  <Card
                    hoverable
                    className="h-full cursor-pointer"
                    onClick={() => window.open(bookmark.url, "_blank")}
                    title="点击在新标签页打开"
                    actions={[
                      <Button 
                        type="text" 
                        icon={<EditOutlined />}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(bookmark);
                        }}
                      >
                        编辑
                      </Button>,
                      <Popconfirm
                        title="确定要删除这个收藏吗？"
                        onConfirm={(e) => {
                          e?.stopPropagation();
                          handleDeleteBookmark(bookmark.id);
                        }}
                        okText="确定"
                        cancelText="取消"
                      >
                        <Button 
                          type="text" 
                          danger 
                          icon={<DeleteOutlined />}
                          onClick={(e) => e.stopPropagation()}
                        >
                          删除
                        </Button>
                      </Popconfirm>,
                    ]}
                  >
                    <Card.Meta
                      title={
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-bold text-lg truncate">
                            {bookmark.title}
                          </span>
                          <Tag color={getCategoryColor(bookmark.category)}>
                            {bookmark.category}
                          </Tag>
                        </div>
                      }
                      description={
                        <div className="space-y-2">
                          <Paragraph
                            ellipsis={{ rows: 2 }}
                            className="text-gray-600 text-sm"
                          >
                            {bookmark.description}
                          </Paragraph>
                          <div className="flex flex-wrap gap-1">
                            {bookmark.tags.slice(0, 3).map((tag) => (
                              <Tag key={tag} color="default">
                                {tag}
                              </Tag>
                            ))}
                          </div>
                        </div>
                      }
                    />

                    {/* 网页预览区域 */}
                    <div className="mt-4">
                      <div className="h-48 border border-gray-200 rounded-lg overflow-hidden">
                        <iframe
                          src={bookmark.url}
                          width="100%"
                          height="100%"
                          style={{ border: "none" }}
                          title={bookmark.title}
                          sandbox="allow-scripts allow-same-origin allow-forms"
                        />
                      </div>
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          ) : (
            <Empty
              description="暂无收藏"
              className="mt-16 py-10"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          )}
        </Spin>

        {/* 添加收藏模态框 */}
        <Modal
          title="添加收藏"
          open={modalVisible}
          onCancel={() => setModalVisible(false)}
          footer={null}
          width={500}
          centered
        >
          <Form form={form} layout="vertical" onFinish={handleAddBookmark}>
            <Form.Item
              name="title"
              label="标题"
              rules={[{ required: true, message: "请输入标题" }]}
            >
              <Input placeholder="请输入网页标题" />
            </Form.Item>

            <Form.Item
              name="url"
              label="网址"
              rules={[
                { required: true, message: "请输入网址" },
                { type: "url", message: "请输入有效的网址" },
              ]}
            >
              <Input placeholder="请输入网址，如：https://www.example.com" />
            </Form.Item>

            <Form.Item name="description" label="描述">
              <Input.TextArea placeholder="请输入网页描述（可选）" rows={3} />
            </Form.Item>

            <Form.Item name="category" label="分类" initialValue="其他">
              <Select placeholder="请选择分类">
                {categories.map((cat) => (
                  <Option key={cat.value} value={cat.value}>
                    {cat.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item name="tags" label="标签">
              <Select
                mode="tags"
                placeholder="请输入标签，按回车添加"
                style={{ width: "100%" }}
              />
            </Form.Item>

            <Form.Item className="mb-0">
              <div className="flex justify-end space-x-2">
                <Button onClick={() => setModalVisible(false)}>取消</Button>
                <Button type="primary" htmlType="submit">
                  添加收藏
                </Button>
              </div>
            </Form.Item>
          </Form>
        </Modal>

        {/* 编辑收藏模态框 */}
        <Modal
          title="编辑收藏"
          open={editModalVisible}
          onCancel={() => {
            setEditModalVisible(false);
            setEditingBookmark(null);
            editForm.resetFields();
          }}
          footer={null}
          width={500}
          centered
        >
          <Form form={editForm} layout="vertical" onFinish={handleEditBookmark}>
            <Form.Item
              name="title"
              label="标题"
              rules={[{ required: true, message: "请输入标题" }]}
            >
              <Input placeholder="请输入网页标题" />
            </Form.Item>

            <Form.Item
              name="url"
              label="网址"
              rules={[
                { required: true, message: "请输入网址" },
                { type: "url", message: "请输入有效的网址" },
              ]}
            >
              <Input placeholder="请输入网址，如：https://www.example.com" />
            </Form.Item>

            <Form.Item name="description" label="描述">
              <Input.TextArea placeholder="请输入网页描述（可选）" rows={3} />
            </Form.Item>

            <Form.Item name="category" label="分类">
              <Select placeholder="请选择分类">
                {categories.map((cat) => (
                  <Option key={cat.value} value={cat.value}>
                    {cat.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item name="tags" label="标签">
              <Select
                mode="tags"
                placeholder="请输入标签，按回车添加"
                style={{ width: "100%" }}
              />
            </Form.Item>

            <Form.Item className="mb-0">
              <div className="flex justify-end space-x-2">
                <Button 
                  onClick={() => {
                    setEditModalVisible(false);
                    setEditingBookmark(null);
                    editForm.resetFields();
                  }}
                >
                  取消
                </Button>
                <Button type="primary" htmlType="submit">
                  保存修改
                </Button>
              </div>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </AppLayout>
  );
}

export default function Bookmarks() {
  return <BookmarksContent />;
}
