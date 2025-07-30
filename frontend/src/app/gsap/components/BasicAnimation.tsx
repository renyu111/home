"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { Card, Button, Space } from "antd";
import {
  PlayCircleOutlined,
  PauseCircleOutlined,
  ReloadOutlined,
} from "@ant-design/icons";

export default function BasicAnimation() {
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 基础动画
    if (boxRef.current) {
      gsap.to(boxRef.current, {
        x: 300,
        rotation: 360,
        duration: 2,
        ease: "power2.inOut",
        repeat: -1,
        yoyo: true,
      });
    }

    // 清理函数
    return () => {
      gsap.killTweensOf(boxRef.current);
    };
  }, []);

  const playAnimation = () => {
    if (boxRef.current) {
      gsap.to(boxRef.current, {
        x: 300,
        rotation: 360,
        duration: 2,
        ease: "power2.inOut",
      });
    }
  };

  const pauseAnimation = () => {
    gsap.killTweensOf(boxRef.current);
  };

  const resetAnimation = () => {
    if (boxRef.current) {
      gsap.set(boxRef.current, {
        x: 0,
        rotation: 0,
      });
    }
  };

  return (
    <Card title="基础动画" className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <Space>
          <Button
            type="primary"
            icon={<PlayCircleOutlined />}
            onClick={playAnimation}
          >
            播放
          </Button>
          <Button icon={<PauseCircleOutlined />} onClick={pauseAnimation}>
            暂停
          </Button>
          <Button icon={<ReloadOutlined />} onClick={resetAnimation}>
            重置
          </Button>
        </Space>
      </div>

      <div className="relative h-32 bg-gray-100 rounded-lg overflow-hidden">
        <div
          ref={boxRef}
          className="absolute top-1/2 left-4 w-16 h-16 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold"
          style={{ transform: "translateY(-50%)" }}
        >
          GSAP
        </div>
      </div>

      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-semibold mb-2">动画说明：</h4>
        <ul className="text-sm space-y-1">
          <li>• 蓝色方块会自动移动和旋转</li>
          <li>
            • 使用 <code>gsap.to()</code> 创建动画
          </li>
          <li>
            • 支持 <code>repeat</code> 和 <code>yoyo</code> 属性
          </li>
          <li>• 可以通过按钮控制播放、暂停、重置</li>
        </ul>
      </div>
    </Card>
  );
}
