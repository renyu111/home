'use client';

import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Card, Button, Space } from 'antd';
import { PlayCircleOutlined, ReloadOutlined } from '@ant-design/icons';

export default function AdvancedAnimation() {
  const morphRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 清理函数
    return () => {
      gsap.killTweensOf([morphRef.current, pathRef.current]);
    };
  }, []);

  const playMorphAnimation = () => {
    if (morphRef.current) {
      gsap.to(morphRef.current, {
        borderRadius: "50%",
        duration: 1,
        ease: "power2.inOut",
        yoyo: true,
        repeat: 1,
      });
    }
  };

  const playPathAnimation = () => {
    if (pathRef.current) {
      gsap.to(pathRef.current, {
        motionPath: {
          path: [
            { x: 0, y: 0 },
            { x: 100, y: -50 },
            { x: 200, y: 0 },
            { x: 300, y: 50 },
            { x: 400, y: 0 },
          ],
          curviness: 1,
        },
        duration: 3,
        ease: "power2.inOut",
        yoyo: true,
        repeat: 1,
      });
    }
  };

  const resetAnimations = () => {
    if (morphRef.current) {
      gsap.set(morphRef.current, {
        borderRadius: "8px",
        x: 0,
        y: 0,
      });
    }
    if (pathRef.current) {
      gsap.set(pathRef.current, {
        x: 0,
        y: 0,
      });
    }
  };

  return (
    <Card title="高级动画" className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <Space>
          <Button
            type="primary"
            icon={<PlayCircleOutlined />}
            onClick={playMorphAnimation}
          >
            变形动画
          </Button>
          <Button
            type="primary"
            icon={<PlayCircleOutlined />}
            onClick={playPathAnimation}
          >
            路径动画
          </Button>
          <Button icon={<ReloadOutlined />} onClick={resetAnimations}>
            重置
          </Button>
        </Space>
      </div>

      <div className="space-y-8">
        {/* 变形动画 */}
        <div>
          <h4 className="mb-2 font-semibold">变形动画</h4>
          <div className="relative h-32 bg-gray-100 rounded-lg overflow-hidden">
            <div
              ref={morphRef}
              className="absolute top-1/2 left-1/2 w-16 h-16 bg-purple-500 rounded-lg flex items-center justify-center text-white font-bold"
              style={{ transform: "translate(-50%, -50%)" }}
            >
              变形
            </div>
          </div>
        </div>

        {/* 路径动画 */}
        <div>
          <h4 className="mb-2 font-semibold">路径动画</h4>
          <div className="relative h-32 bg-gray-100 rounded-lg overflow-hidden">
            <div
              ref={pathRef}
              className="absolute top-1/2 left-4 w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold"
              style={{ transform: "translateY(-50%)" }}
            >
              路径
            </div>
            {/* 路径指示线 */}
            <svg
              className="absolute inset-0 w-full h-full"
              style={{ pointerEvents: "none" }}
            >
              <path
                d="M 16 64 Q 100 14 200 64 T 384 64"
                stroke="#e5e7eb"
                strokeWidth="2"
                fill="none"
                strokeDasharray="5,5"
              />
            </svg>
          </div>
        </div>
      </div>
      
      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-semibold mb-2">动画说明：</h4>
        <ul className="text-sm space-y-1">
          <li>• <strong>变形动画：</strong>使用 <code>borderRadius</code> 实现形状变化</li>
          <li>• <strong>路径动画：</strong>使用 <code>motionPath</code> 沿路径移动</li>
          <li>• 支持 <code>yoyo</code> 和 <code>repeat</code> 属性</li>
          <li>• 使用 <code>curviness</code> 控制路径弯曲程度</li>
          <li>• 每个动画都可以独立控制</li>
        </ul>
      </div>
    </Card>
  );
} 