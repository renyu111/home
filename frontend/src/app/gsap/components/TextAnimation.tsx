"use client";

import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { Card, Button, Space, Tabs } from "antd";
import { PlayCircleOutlined, ReloadOutlined } from "@ant-design/icons";

const { TabPane } = Tabs;

export default function TextAnimation() {
  const textRef = useRef<HTMLDivElement>(null);
  const typewriterRef = useRef<HTMLDivElement>(null);
  const waveRef = useRef<HTMLDivElement>(null);
  const bounceRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState("1");

  // 基础文字动画
  const playTextAnimation = () => {
    if (textRef.current) {
      textRef.current.innerHTML = "";

      const originalText = "GSAP 文字动画";
      const chars = originalText.split("");

      chars.forEach((char, index) => {
        const span = document.createElement("span");
        span.textContent = char;
        span.style.display = "inline-block";
        span.style.opacity = "0";
        span.style.transform = "translateY(20px)";
        textRef.current?.appendChild(span);

        gsap.to(span, {
          opacity: 1,
          y: 0,
          duration: 0.1,
          delay: index * 0.05,
          ease: "back.out(1.7)",
        });
      });
    }
  };

  // 打字机效果
  const playTypewriterAnimation = () => {
    if (typewriterRef.current) {
      typewriterRef.current.innerHTML = "";
      const text = "这是一个打字机效果的文字动画...";
      let currentIndex = 0;

      const typeNextChar = () => {
        if (currentIndex < text.length) {
          const span = document.createElement("span");
          span.textContent = text[currentIndex];
          span.style.display = "inline-block";
          span.style.opacity = "0";
          typewriterRef.current?.appendChild(span);

          gsap.to(span, {
            opacity: 1,
            duration: 0.1,
            ease: "none",
          });

          currentIndex++;
          setTimeout(typeNextChar, 100);
        }
      };

      typeNextChar();
    }
  };

  // 波浪效果
  const playWaveAnimation = () => {
    if (waveRef.current) {
      waveRef.current.innerHTML = "";
      const text = "波浪效果文字动画";
      const chars = text.split("");

      chars.forEach((char, index) => {
        const span = document.createElement("span");
        span.textContent = char;
        span.style.display = "inline-block";
        span.style.opacity = "0";
        span.style.transform = "translateY(0px)";
        waveRef.current?.appendChild(span);

        gsap.to(span, {
          opacity: 1,
          y: -20,
          duration: 0.3,
          delay: index * 0.1,
          ease: "power2.out",
          yoyo: true,
          repeat: -1,
        });
      });
    }
  };

  // 弹跳效果
  const playBounceAnimation = () => {
    if (bounceRef.current) {
      bounceRef.current.innerHTML = "";
      const text = "弹跳效果文字";
      const chars = text.split("");

      chars.forEach((char, index) => {
        const span = document.createElement("span");
        span.textContent = char;
        span.style.display = "inline-block";
        span.style.opacity = "0";
        span.style.transform = "scale(0)";
        bounceRef.current?.appendChild(span);

        gsap.to(span, {
          opacity: 1,
          scale: 1,
          duration: 0.5,
          delay: index * 0.1,
          ease: "back.out(1.7)",
        });
      });
    }
  };

  // 重置所有动画
  const resetAllAnimations = () => {
    if (textRef.current) {
      textRef.current.innerHTML = "GSAP 文字动画";
    }
    if (typewriterRef.current) {
      typewriterRef.current.innerHTML = "这是一个打字机效果的文字动画...";
    }
    if (waveRef.current) {
      waveRef.current.innerHTML = "波浪效果文字动画";
    }
    if (bounceRef.current) {
      bounceRef.current.innerHTML = "弹跳效果文字";
    }
  };

  useEffect(() => {
    // 初始动画
    playTextAnimation();
    playTypewriterAnimation();
    playWaveAnimation();
    playBounceAnimation();
  }, []);

  const tabItems = [
    {
      key: "1",
      label: "基础动画",
      children: (
        <div>
          <div className="flex items-center justify-between mb-4">
            <Space>
              <Button
                type="primary"
                icon={<PlayCircleOutlined />}
                onClick={playTextAnimation}
              >
                重新播放
              </Button>
              <Button icon={<ReloadOutlined />} onClick={resetAllAnimations}>
                重置
              </Button>
            </Space>
          </div>

          <div className="flex justify-center items-center h-32">
            <div
              ref={textRef}
              className="text-3xl font-bold text-center text-blue-600"
            >
              GSAP 文字动画
            </div>
          </div>

          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold mb-2">基础动画说明：</h4>
            <ul className="text-sm space-y-1">
              <li>• 文字逐字符显示动画</li>
              <li>
                • 使用 <code>gsap.to()</code> 控制每个字符
              </li>
              <li>
                • 通过 <code>delay</code> 实现错开效果
              </li>
              <li>
                • 使用 <code>back.out(1.7)</code> 弹性缓动
              </li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      key: "2",
      label: "打字机效果",
      children: (
        <div>
          <div className="flex items-center justify-between mb-4">
            <Space>
              <Button
                type="primary"
                icon={<PlayCircleOutlined />}
                onClick={playTypewriterAnimation}
              >
                重新播放
              </Button>
              <Button icon={<ReloadOutlined />} onClick={resetAllAnimations}>
                重置
              </Button>
            </Space>
          </div>

          <div className="flex justify-center items-center h-32">
            <div
              ref={typewriterRef}
              className="text-2xl font-mono text-center text-green-600"
            >
              这是一个打字机效果的文字动画...
            </div>
          </div>

          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold mb-2">打字机效果说明：</h4>
            <ul className="text-sm space-y-1">
              <li>• 模拟打字机逐字符显示效果</li>
              <li>• 使用 <code>setTimeout</code> 控制时间间隔</li>
              <li>• 每个字符独立动画，营造真实打字感</li>
              <li>• 适合代码展示或重要信息强调</li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      key: "3",
      label: "波浪效果",
      children: (
        <div>
          <div className="flex items-center justify-between mb-4">
            <Space>
              <Button
                type="primary"
                icon={<PlayCircleOutlined />}
                onClick={playWaveAnimation}
              >
                重新播放
              </Button>
              <Button icon={<ReloadOutlined />} onClick={resetAllAnimations}>
                重置
              </Button>
            </Space>
          </div>

          <div className="flex justify-center items-center h-32">
            <div
              ref={waveRef}
              className="text-2xl font-bold text-center text-purple-600"
            >
              波浪效果文字动画
            </div>
          </div>

          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold mb-2">波浪效果说明：</h4>
            <ul className="text-sm space-y-1">
              <li>• 字符上下波浪式运动</li>
              <li>• 使用 <code>yoyo</code> 和 <code>repeat</code> 持续动画</li>
              <li>• 通过 <code>stagger</code> 实现波浪传播</li>
              <li>• 适合活泼、动态的界面元素</li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      key: "4",
      label: "弹跳效果",
      children: (
        <div>
          <div className="flex items-center justify-between mb-4">
            <Space>
              <Button
                type="primary"
                icon={<PlayCircleOutlined />}
                onClick={playBounceAnimation}
              >
                重新播放
              </Button>
              <Button icon={<ReloadOutlined />} onClick={resetAllAnimations}>
                重置
              </Button>
            </Space>
          </div>

          <div className="flex justify-center items-center h-32">
            <div
              ref={bounceRef}
              className="text-2xl font-bold text-center text-orange-600"
            >
              弹跳效果文字
            </div>
          </div>

          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold mb-2">弹跳效果说明：</h4>
            <ul className="text-sm space-y-1">
              <li>• 字符从无到有的弹跳出现</li>
              <li>• 使用 <code>scale</code> 实现缩放效果</li>
              <li>• 结合 <code>back.out</code> 缓动函数</li>
              <li>• 适合强调重要信息或标题</li>
            </ul>
          </div>
        </div>
      ),
    },
  ];

  return (
    <Card title="文字动画" className="mb-6">
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={tabItems}
        type="card"
        size="middle"
      />
    </Card>
  );
}
