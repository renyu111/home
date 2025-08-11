"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { Breadcrumb, Button, Card, Drawer, Empty, Input, Modal, Spin, Tooltip, Tree } from "antd";
import { FolderOpenOutlined, EyeOutlined, UploadOutlined } from "@ant-design/icons";

type TreeNode = {
  type: "directory" | "file";
  name: string;
  path: string; // e.g. /a/b/file.jpg or /a
  url?: string; // only for file
  children?: TreeNode[];
};

type LocalFile = { name: string; path: string; url: string };

function getParentDir(p?: string): string {
  if (!p) return "/";
  const idx = p.lastIndexOf("/");
  if (idx <= 0) return "/";
  return p.substring(0, idx);
}

export default function LocalDirBrowser() {
  const [root, setRoot] = useState<TreeNode | null>(null);
  const [allFiles, setAllFiles] = useState<LocalFile[]>([]);
  const [selectedPath, setSelectedPath] = useState<string>("/");
  const [filter, setFilter] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [preview, setPreview] = useState<{ open: boolean; url: string; title: string } | null>(null);
  const [dirDrawerOpen, setDirDrawerOpen] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // 构建 antd TreeData，仅显示目录
  const treeData = useMemo(() => {
    if (!root) return [];

    const nameIncludes = (name: string) => !filter || name.toLowerCase().includes(filter.toLowerCase());

    const walk = (node: TreeNode): any | null => {
      if (node.type === "file") return null;
      const children = (node.children || [])
        .filter((c) => c.type === "directory")
        .map(walk)
        .filter(Boolean) as any[];

      if (!(nameIncludes(node.name) || children.length > 0)) return null;

      return {
        key: node.path || "/",
        title: (
          <Tooltip title={node.name} placement="right">
            <span className="tree-title-ellipsis">{node.name || "root"}</span>
          </Tooltip>
        ),
        selectable: true,
        isLeaf: false,
        children,
      };
    };

    const built = walk(root);
    return built ? [built] : [];
  }, [root, filter]);

  const onChooseDirectory = useCallback(async () => {
    setLoading(true);
    try {
      const w = (window as any);
      if (w.showDirectoryPicker) {
        const dirHandle = await w.showDirectoryPicker();

        const files: LocalFile[] = [];

        async function scanDirectory(handle: any, rel: string): Promise<TreeNode> {
          const dirChildren: TreeNode[] = [];
          for await (const [name, child] of handle.entries()) {
            const childRel = rel ? `${rel}/${name}` : name;
            if (child.kind === "directory") {
              const childNode = await scanDirectory(child, childRel);
              dirChildren.push(childNode);
            } else if (child.kind === "file") {
              const file = await child.getFile();
              const url = URL.createObjectURL(file);
              files.push({ name, path: `/${childRel}`, url });
              dirChildren.push({ type: "file", name, path: `/${childRel}`, url });
            }
          }

          dirChildren.sort((a, b) => {
            if (a.type !== b.type) return a.type === "directory" ? -1 : 1;
            return a.name.localeCompare(b.name);
          });

          return { type: "directory", name: rel || "root", path: `/${rel}`.replace(/\/$/, "/") || "/", children: dirChildren };
        }

        const rootNode = await scanDirectory(dirHandle, "");
        setRoot(rootNode);
        setAllFiles(files);
        setSelectedPath("/");
        setDirDrawerOpen(true);
      } else {
        inputRef.current?.click();
      }
    } catch {}
    finally { setLoading(false); }
  }, []);

  const onPickViaInput = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const list = evt.target.files;
    if (!list || list.length === 0) return;

    const files: LocalFile[] = [];
    const dirMap = new Map<string, TreeNode>();

    function ensureDir(path: string): TreeNode {
      if (dirMap.has(path)) return dirMap.get(path)!;
      const name = path.split("/").filter(Boolean).slice(-1)[0] || "root";
      const node: TreeNode = { type: "directory", name, path: path || "/", children: [] };
      dirMap.set(path, node);
      return node;
    }

    dirMap.set("/", { type: "directory", name: "root", path: "/", children: [] });

    for (const file of Array.from(list)) {
      const anyFile = file as any;
      const rel = (anyFile.webkitRelativePath as string) || file.name;
      const parts = rel.split("/").filter(Boolean);
      let acc = "/";
      for (let i = 0; i < parts.length - 1; i++) {
        acc = acc === "/" ? `/${parts[i]}` : `${acc}/${parts[i]}`;
        ensureDir(acc);
      }
      const parent = ensureDir(acc);
      const path = acc === "/" ? `/${file.name}` : `${acc}/${file.name}`;
      const url = URL.createObjectURL(file);
      files.push({ name: file.name, path, url });
      parent.children!.push({ type: "file", name: file.name, path, url });
    }

    for (const [p, node] of Array.from(dirMap.entries())) {
      if (p === "/") continue;
      const parentPath = getParentDir(p);
      const parent = dirMap.get(parentPath);
      if (parent && node && parent !== node) {
        parent.children = parent.children || [];
        if (!parent.children.find((c) => c.path === node.path)) parent.children.push(node);
      }
    }

    const rootNode = dirMap.get("/")!;
    const sortTree = (node: TreeNode) => {
      if (!node.children) return;
      node.children.sort((a, b) => {
        if (a.type !== b.type) return a.type === "directory" ? -1 : 1;
        return a.name.localeCompare(b.name);
      });
      node.children.forEach(sortTree);
    };
    sortTree(rootNode);

    setRoot(rootNode);
    setAllFiles(files);
    setSelectedPath("/");
    setDirDrawerOpen(true);
  };

  const filteredList = useMemo(() => {
    if (!Array.isArray(allFiles)) return [];
    return allFiles.filter((f) => getParentDir(f.path) === selectedPath);
  }, [allFiles, selectedPath]);

  return (
    <div>
      {/* 顶部操作：选择目录与兼容输入 */}
      <div className="bg-white rounded-xl p-6 mb-6 shadow-sm border border-gray-100">
        <div className="flex items-center gap-3">
          <Button type="primary" size="large" icon={<FolderOpenOutlined />} onClick={onChooseDirectory}>
            选择本地文件夹
          </Button>
          <Tooltip title="兼容模式：不支持系统级目录选择时使用">
            <Button size="large" icon={<UploadOutlined />} onClick={() => inputRef.current?.click()}>
              兼容选择
            </Button>
          </Tooltip>
          <input
            ref={inputRef}
            type="file"
            style={{ display: "none" }}
            multiple
            // @ts-ignore
            webkitdirectory="true"
            directory="true"
            onChange={onPickViaInput}
          />
        </div>
      </div>

      <Spin spinning={loading}>
        {/* 浮动圆形按钮：打开目录抽屉 */}
        <Button
          type="primary"
          shape="circle"
          size="large"
          className="floating-dir-button"
          aria-label="打开目录"
          icon={<FolderOpenOutlined />}
          onClick={() => setDirDrawerOpen(true)}
        />

        {/* 侧边抽屉：目录树与搜索 */}
        <Drawer
          title="本地文件夹"
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
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
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
            <Empty description="未选择或没有可显示的目录" />
          )}
        </Drawer>

        {/* 面包屑与计数 */}
        <div className="grid-header">
          <Breadcrumb
            items={(() => {
              const parts = (selectedPath || '/').split('/').filter(Boolean);
              const items = [{ title: 'root', path: '/' } as any].concat(
                parts.map((p, idx) => ({ title: p, path: '/' + parts.slice(0, idx + 1).join('/') }))
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
          <span className="grid-count">{filteredList.length} 个文件</span>
        </div>

        {/* 文件网格 */}
        {filteredList.length === 0 ? (
          <Empty description="请选择文件夹或该目录暂无文件" className="mt-16 py-10" />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredList.map((file) => (
              <Card
                key={file.path}
                hoverable
                cover={
                  // @ts-ignore
                  <img src={file.url} alt={file.name} className="w-full object-cover" />
                }
                actions={[
                  <EyeOutlined key="view" onClick={() => setPreview({ open: true, url: file.url, title: file.name })} />,
                ]}
              >
                <Card.Meta title={file.name} description={file.path} />
              </Card>
            ))}
          </div>
        )}
      </Spin>

      {/* 预览 */}
      <Modal
        title={preview?.title}
        open={!!preview?.open}
        onCancel={() => setPreview(null)}
        footer={null}
        width={800}
      >
        {preview?.url && (
          // @ts-ignore
          <img src={preview.url} alt={preview.title} style={{ width: "100%" }} />
        )}
      </Modal>
    </div>
  );
}

