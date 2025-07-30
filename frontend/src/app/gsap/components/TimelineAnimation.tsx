'use client';

import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Card, Button, Space } from 'antd';
import { PlayCircleOutlined, ReloadOutlined } from '@ant-design/icons';

export default function TimelineAnimation() {
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    // 创建时间轴
    timelineRef.current = gsap.timeline({ paused: true });
    
    // 添加动画序列
    timelineRef.current
      .to("#progress-bar", {
        width: "100%",
        duration: 2,
        ease: "power2.inOut",
      })
      .to("#circle-1", {
        scale: 1.5,
        duration: 0.5,
        ease: "back.out(1.7)",
      }, "-=1")
      .to("#circle-2", {
        scale: 1.5,
        duration: 0.5,
        ease: "back.out(1.7)",
      }, "-=0.5")
      .to("#circle-3", {
        scale: 1.5,
        duration: 0.5,
        ease: "back.out(1.7)",
      }, "-=0.5");

    // 清理函数
    return () => {
      if (timelineRef.current) {
        timelineRef.current.kill();
      }
    };
  }, []);

  const playTimeline = () => {
    if (timelineRef.current) {
      timelineRef.current.play();
    }
  };

  const resetTimeline = () => {
    if (timelineRef.current) {
      timelineRef.current.restart();
      timelineRef.current.pause();
    }
    
    // 重置元素状态
    gsap.set("#progress-bar", { width: "0%" });
    gsap.set(["#circle-1", "#circle-2", "#circle-3"], { scale: 1 });
  };

  return (
    <Card title="时间轴动画" className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <Space>
          <Button
            type="primary"
            icon={<PlayCircleOutlined />}
            onClick={playTimeline}
          >
            播放时间轴
          </Button>
          <Button icon={<ReloadOutlined />} onClick={resetTimeline}>
            重置
          </Button>
        </Space>
      </div>

      <div className="space-y-6">
        {/* 进度条 */}
        <div>
          <h4 className="mb-2 font-semibold">进度条动画</h4>
          <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-green-500 rounded-full"
              style={{ width: "0%" }}
              id="progress-bar"
            />
          </div>
        </div>

        {/* 圆形动画 */}
        <div>
          <h4 className="mb-2 font-semibold">圆形动画</h4>
          <div className="flex justify-center space-x-8">
            <div
              id="circle-1"
              className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center text-white font-bold"
            >
              1
            </div>
            <div
              id="circle-2"
              className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold"
            >
              2
            </div>
            <div
              id="circle-3"
              className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-white font-bold"
            >
              3
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-semibold mb-2">动画说明：</h4>
        <ul className="text-sm space-y-1">
          <li>• 使用 <code>gsap.timeline()</code> 创建时间轴</li>
          <li>• 进度条先开始动画，持续2秒</li>
          <li>• 圆形1在进度条开始1秒后放大</li>
          <li>• 圆形2和3依次错开0.5秒放大</li>
          <li>• 使用 <code>-=1</code> 等相对时间控制</li>
          <li>• 支持暂停、播放、重置功能</li>
        </ul>
      </div>
    </Card>
  );
} 