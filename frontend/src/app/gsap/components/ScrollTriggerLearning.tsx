"use client";

import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Card, Button, Space, Tabs, Typography, Progress } from "antd";
import {
  PlayCircleOutlined,
  ReloadOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";

const { Title, Paragraph } = Typography;

// 注册ScrollTrigger插件
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function ScrollTriggerLearning() {
  const [activeTab, setActiveTab] = useState("1");
  const [scrollProgress, setScrollProgress] = useState(0);

  // 基础触发动画
  const basicTriggerRef = useRef<HTMLDivElement>(null);
  // 进度条动画
  const progressRef = useRef<HTMLDivElement>(null);
  // 视差滚动
  const parallaxRef = useRef<HTMLDivElement>(null);
  // 高级触发
  const advancedRef = useRef<HTMLDivElement>(null);
  // 演示元素
  const demo1Ref = useRef<HTMLDivElement>(null);
  const demo2Ref = useRef<HTMLDivElement>(null);
  const demo3Ref = useRef<HTMLDivElement>(null);
  const demo4Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 基础触发动画
    if (basicTriggerRef.current) {
      gsap.fromTo(
        basicTriggerRef.current,
        {
          opacity: 0,
          y: 50,
          scale: 0.8,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: basicTriggerRef.current,
            start: "top 80%", // 元素顶部到达视口80%时触发
            end: "bottom 20%", // 元素底部到达视口20%时结束
            toggleActions: "play none none reverse", // 播放一次，反向播放
            markers: true, // 显示标记（开发时使用）
          },
        }
      );
    }

    // 进度条动画
    if (progressRef.current) {
      gsap.to(progressRef.current, {
        width: "100%",
        duration: 1,
        ease: "none",
        scrollTrigger: {
          trigger: progressRef.current,
          start: "top center",
          end: "bottom center",
          scrub: true, // 跟随滚动进度
          markers: true,
        },
      });
    }

    // 视差滚动
    if (parallaxRef.current) {
      gsap.to(parallaxRef.current, {
        y: -200,
        ease: "none",
        scrollTrigger: {
          trigger: parallaxRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1, // 1秒延迟的视差效果
          markers: true,
        },
      });
    }

    // 高级触发 - 多元素序列
    if (advancedRef.current) {
      const cards = advancedRef.current.querySelectorAll(".card");

      gsap.fromTo(
        cards,
        {
          opacity: 0,
          y: 100,
          rotation: -15,
        },
        {
          opacity: 1,
          y: 0,
          rotation: 0,
          duration: 0.8,
          stagger: 0.2,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: advancedRef.current,
            start: "top 70%",
            end: "bottom 30%",
            toggleActions: "play none none reverse",
            markers: true,
          },
        }
      );
    }

    // 演示1: top 80% 触发
    if (demo1Ref.current) {
      gsap.fromTo(
        demo1Ref.current,
        { opacity: 0, scale: 0.8 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.8,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: demo1Ref.current,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse",
            markers: true,
          },
        }
      );
    }

    // 演示2: center center 触发
    if (demo2Ref.current) {
      gsap.fromTo(
        demo2Ref.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: demo2Ref.current,
            start: "center center",
            end: "center center",
            toggleActions: "play none none reverse",
            markers: true,
          },
        }
      );
    }

    // 演示3: bottom 20% 触发
    if (demo3Ref.current) {
      gsap.fromTo(
        demo3Ref.current,
        { opacity: 0, rotation: -15 },
        {
          opacity: 1,
          rotation: 0,
          duration: 0.8,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: demo3Ref.current,
            start: "bottom 20%",
            end: "top 80%",
            toggleActions: "play none none reverse",
            markers: true,
          },
        }
      );
    }

    // 演示4: top 100px 触发
    if (demo4Ref.current) {
      gsap.fromTo(
        demo4Ref.current,
        { opacity: 0, x: -100 },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: demo4Ref.current,
            start: "top 100px",
            end: "bottom 100px",
            toggleActions: "play none none reverse",
            markers: true,
          },
        }
      );
    }

    // 全局滚动进度监听
    ScrollTrigger.create({
      trigger: "body",
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        setScrollProgress(self.progress * 100);
      },
    });

    // 清理函数
    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  const resetAllAnimations = () => {
    ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    // 重新初始化动画
    window.location.reload();
  };

  const tabItems = [
    {
      key: "1",
      label: "基础概念",
      children: (
        <div>
          <div className="mb-6">
            <Title level={4}>ScrollTrigger 基础概念</Title>
            <div className="space-y-4">
              <Card>
                <Title level={5}>什么是 ScrollTrigger？</Title>
                <Paragraph>
                  ScrollTrigger 是 GSAP
                  的一个插件，它可以让动画在滚动到特定位置时触发。
                  它提供了强大的滚动控制功能，是创建现代网页动画的重要工具。
                </Paragraph>
              </Card>

              <Card>
                <Title level={5}>核心概念</Title>
                <ul className="space-y-2">
                  <li>
                    <strong>trigger:</strong> 触发元素，当它进入视口时开始动画
                  </li>
                  <li>
                    <strong>start:</strong> 触发开始的位置，如 "top 80%"
                  </li>
                  <li>
                    <strong>end:</strong> 触发结束的位置，如 "bottom 20%"
                  </li>
                  <li>
                    <strong>toggleActions:</strong> 控制动画行为，如 "play none
                    none reverse"
                  </li>
                  <li>
                    <strong>scrub:</strong> 让动画跟随滚动进度
                  </li>
                </ul>
              </Card>

              <Card>
                <Title level={5}>位置语法</Title>
                <div className="bg-gray-50 p-4 rounded">
                  <code className="text-sm">
                    "top center" // 元素顶部到达视口中心
                    <br />
                    "center bottom" // 元素中心到达视口底部
                    <br />
                    "top 80%" // 元素顶部到达视口80%位置
                    <br />
                    "+=100" // 相对于当前位置偏移100px
                  </code>
                </div>
              </Card>

              <Card>
                <Title level={5}>start 和 end 参数详解</Title>
                <div className="space-y-4">
                  <div>
                    <h6 className="font-semibold mb-2">基本语法</h6>
                    <p className="text-sm mb-2">
                      start 和 end 的格式为：<code>"元素位置 视口位置"</code>
                    </p>
                    <div className="bg-blue-50 p-3 rounded">
                      <p className="text-sm">
                        <strong>元素位置：</strong> top, center, bottom
                        <br />
                        <strong>视口位置：</strong> top, center, bottom, 百分比, px值
                      </p>
                    </div>
                  </div>

                  <div>
                    <h6 className="font-semibold mb-2">支持的格式类型</h6>
                    <div className="space-y-2">
                      <div>
                        <h6 className="font-medium text-sm">1. 相对位置</h6>
                        <code className="text-xs bg-gray-100 p-2 rounded block">
                          "top center" // 元素顶部到达视口中心
                          <br />
                          "center bottom" // 元素中心到达视口底部
                          <br />
                          "bottom top" // 元素底部到达视口顶部
                        </code>
                      </div>
                      
                      <div>
                        <h6 className="font-medium text-sm">2. 百分比</h6>
                        <code className="text-xs bg-gray-100 p-2 rounded block">
                          "top 80%" // 元素顶部到达视口80%位置
                          <br />
                          "center 20%" // 元素中心到达视口20%位置
                          <br />
                          "bottom 90%" // 元素底部到达视口90%位置
                        </code>
                      </div>
                      
                      <div>
                        <h6 className="font-medium text-sm">3. 像素值</h6>
                        <code className="text-xs bg-gray-100 p-2 rounded block">
                          "top 100px" // 元素顶部到达视口100px位置
                          <br />
                          "center 200px" // 元素中心到达视口200px位置
                          <br />
                          "bottom 50px" // 元素底部到达视口50px位置
                        </code>
                      </div>
                      
                      <div>
                        <h6 className="font-medium text-sm">4. 相对偏移</h6>
                        <code className="text-xs bg-gray-100 p-2 rounded block">
                          "+=100" // 相对于当前位置偏移100px
                          <br />
                          "-=50" // 相对于当前位置偏移-50px
                          <br />
                          "+=20%" // 相对于当前位置偏移20%
                        </code>
                      </div>
                      
                      <div>
                        <h6 className="font-medium text-sm">5. 绝对位置</h6>
                        <code className="text-xs bg-gray-100 p-2 rounded block">
                          "100px center" // 视口100px位置到达元素中心
                          <br />
                          "50% bottom" // 视口50%位置到达元素底部
                        </code>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h6 className="font-semibold mb-2">实际应用示例</h6>
                    <div className="space-y-3">
                      <div className="p-3 bg-green-50 rounded">
                        <h6 className="font-medium text-sm text-green-800">常见触发场景</h6>
                        <ul className="text-xs space-y-1 text-green-700">
                          <li>• <code>"top 80%"</code> - 元素刚进入视口时触发</li>
                          <li>• <code>"center center"</code> - 元素完全居中时触发</li>
                          <li>• <code>"bottom 20%"</code> - 元素即将离开视口时触发</li>
                          <li>• <code>"top 100px"</code> - 元素顶部到达视口100px时触发</li>
                        </ul>
                      </div>
                      
                      <div className="p-3 bg-yellow-50 rounded">
                        <h6 className="font-medium text-sm text-yellow-800">Scrub 动画场景</h6>
                        <ul className="text-xs space-y-1 text-yellow-700">
                          <li>• <code>"top center"</code> 到 <code>"bottom center"</code> - 元素完全通过视口</li>
                          <li>• <code>"top bottom"</code> 到 <code>"bottom top"</code> - 元素从进入到底部离开</li>
                          <li>• <code>"center 20%"</code> 到 <code>"center 80%"</code> - 元素在视口中心区域</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h6 className="font-semibold mb-2">注意事项</h6>
                    <ul className="text-sm space-y-1 text-gray-600">
                      <li>• 百分比相对于视口高度，不是元素高度</li>
                      <li>• px值可以是正数或负数</li>
                      <li>• 相对偏移 <code>+=</code> 和 <code>-=</code> 基于当前位置计算</li>
                      <li>• 可以混合使用，如 <code>"top 80% +=50"</code></li>
                      <li>• 支持小数，如 <code>"top 75.5%"</code></li>
                    </ul>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          <div className="mb-6">
            <Title level={4}>基础触发动画</Title>
            <div className="flex items-center justify-between mb-4">
              <Space>
                <Button icon={<InfoCircleOutlined />} type="text">
                  向下滚动查看动画效果
                </Button>
                <Button icon={<ReloadOutlined />} onClick={resetAllAnimations}>
                  重置
                </Button>
              </Space>
            </div>

            <div className="space-y-4">
              <div className="h-32 bg-gray-200 rounded flex items-center justify-center">
                <p className="text-gray-500">滚动区域 1</p>
              </div>

              <div
                ref={basicTriggerRef}
                className="h-32 bg-blue-500 rounded flex items-center justify-center text-white font-bold text-xl"
              >
                基础触发动画
              </div>

              <div className="h-32 bg-gray-200 rounded flex items-center justify-center">
                <p className="text-gray-500">滚动区域 2</p>
              </div>
              <div className="h-32 bg-gray-200 rounded flex items-center justify-center">
                <p className="text-gray-500">滚动区域 2</p>
              </div>
              <div className="h-32 bg-gray-200 rounded flex items-center justify-center">
                <p className="text-gray-500">滚动区域 2</p>
              </div>
              <div className="h-32 bg-gray-200 rounded flex items-center justify-center">
                <p className="text-gray-500">滚动区域 2</p>
              </div>
              <div className="h-32 bg-gray-200 rounded flex items-center justify-center">
                <p className="text-gray-500">滚动区域 2</p>
              </div>
              <div className="h-32 bg-gray-200 rounded flex items-center justify-center">
                <p className="text-gray-500">滚动区域 2</p>
              </div>
              <div className="h-32 bg-gray-200 rounded flex items-center justify-center">
                <p className="text-gray-500">滚动区域 2</p>
              </div>
              <div className="h-32 bg-gray-200 rounded flex items-center justify-center">
                <p className="text-gray-500">滚动区域 2</p>
              </div>
              <div className="h-32 bg-gray-200 rounded flex items-center justify-center">
                <p className="text-gray-500">滚动区域 2</p>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <Title level={4}>不同触发配置演示</Title>
            <div className="space-y-4">
              {/* 演示1: top 80% */}
              <div className="h-32 bg-gray-200 rounded flex items-center justify-center">
                <p className="text-gray-500">演示区域</p>
              </div>
              
              <div
                ref={demo1Ref}
                className="h-32 bg-green-500 rounded flex items-center justify-center text-white"
              >
                <div className="text-center">
                  <div className="font-bold">"top 80%" 触发</div>
                  <div className="text-sm">元素顶部到达视口80%时触发</div>
                </div>
              </div>
              
              <div className="h-32 bg-gray-200 rounded flex items-center justify-center">
                <p className="text-gray-500">间隔区域</p>
              </div>
              
              {/* 演示2: center center */}
              <div
                ref={demo2Ref}
                className="h-32 bg-orange-500 rounded flex items-center justify-center text-white"
              >
                <div className="text-center">
                  <div className="font-bold">"center center" 触发</div>
                  <div className="text-sm">元素完全居中时触发</div>
                </div>
              </div>
              
              <div className="h-32 bg-gray-200 rounded flex items-center justify-center">
                <p className="text-gray-500">间隔区域</p>
              </div>
              
              {/* 演示3: bottom 20% */}
              <div
                ref={demo3Ref}
                className="h-32 bg-purple-500 rounded flex items-center justify-center text-white"
              >
                <div className="text-center">
                  <div className="font-bold">"bottom 20%" 触发</div>
                  <div className="text-sm">元素底部到达视口20%时触发</div>
                </div>
              </div>
              
              <div className="h-32 bg-gray-200 rounded flex items-center justify-center">
                <p className="text-gray-500">间隔区域</p>
              </div>
              
              {/* 演示4: top 100px */}
              <div
                ref={demo4Ref}
                className="h-32 bg-red-500 rounded flex items-center justify-center text-white"
              >
                <div className="text-center">
                  <div className="font-bold">"top 100px" 触发</div>
                  <div className="text-sm">元素顶部到达视口100px时触发</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "2",
      label: "进度条动画",
      children: (
        <div>
          <div className="mb-6">
            <Title level={4}>Scrub 进度条动画</Title>
            <Paragraph>
              Scrub 功能让动画跟随滚动进度，非常适合创建进度条、时间轴等效果。
            </Paragraph>
          </div>

          <div className="space-y-4">
            <div className="h-32 bg-gray-200 rounded flex items-center justify-center">
              <p className="text-gray-500">开始区域</p>
            </div>

            <div className="h-64 bg-gray-100 rounded p-4">
              <h4 className="mb-4 font-semibold">进度条动画</h4>
              <div className="h-4 bg-gray-300 rounded-full overflow-hidden">
                <div
                  ref={progressRef}
                  className="h-full bg-green-500 rounded-full"
                  style={{ width: "0%" }}
                />
              </div>
              <p className="mt-4 text-sm text-gray-600">
                滚动时进度条会跟随填充，使用 <code>scrub: true</code> 实现
              </p>
            </div>

            <div className="h-32 bg-gray-200 rounded flex items-center justify-center">
              <p className="text-gray-500">结束区域</p>
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "3",
      label: "视差滚动",
      children: (
        <div>
          <div className="mb-6">
            <Title level={4}>视差滚动效果</Title>
            <Paragraph>
              视差滚动让背景元素以不同速度移动，创造深度感。使用{" "}
              <code>scrub</code> 实现。
            </Paragraph>
          </div>

          <div className="space-y-4">
            <div className="h-32 bg-gray-200 rounded flex items-center justify-center">
              <p className="text-gray-500">视差开始</p>
            </div>

            <div className="relative h-96 bg-gradient-to-b from-blue-400 to-purple-600 rounded overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-white text-center">
                  <h3 className="text-2xl font-bold mb-2">视差背景</h3>
                  <p>滚动时背景会移动</p>
                </div>
              </div>
              <div
                ref={parallaxRef}
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-lg"
              >
                <span className="text-blue-600 font-bold">视差元素</span>
              </div>
            </div>

            <div className="h-32 bg-gray-200 rounded flex items-center justify-center">
              <p className="text-gray-500">视差结束</p>
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "4",
      label: "高级应用",
      children: (
        <div>
          <div className="mb-6">
            <Title level={4}>高级 ScrollTrigger 应用</Title>
            <Paragraph>
              结合多个元素和复杂触发条件，创建更丰富的动画效果。
            </Paragraph>
          </div>

          <div className="space-y-4">
            <div className="h-32 bg-gray-200 rounded flex items-center justify-center">
              <p className="text-gray-500">高级动画开始</p>
            </div>

            <div
              ref={advancedRef}
              className="grid grid-cols-1 md:grid-cols-3 gap-4"
            >
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="card h-32 bg-gradient-to-r from-pink-400 to-orange-400 rounded flex items-center justify-center text-white font-bold text-xl"
                >
                  卡片 {item}
                </div>
              ))}
            </div>

            <div className="h-32 bg-gray-200 rounded flex items-center justify-center">
              <p className="text-gray-500">高级动画结束</p>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <Title level={5}>高级特性说明</Title>
            <ul className="space-y-2 text-sm">
              <li>
                • <strong>stagger:</strong> 错开动画时间，创造序列效果
              </li>
              <li>
                • <strong>rotation:</strong> 结合旋转动画增加动感
              </li>
              <li>
                • <strong>toggleActions:</strong> 精确控制动画播放行为
              </li>
              <li>
                • <strong>markers:</strong> 开发时显示触发位置标记
              </li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      key: "5",
      label: "实战技巧",
      children: (
        <div>
          <div className="mb-6">
            <Title level={4}>ScrollTrigger 实战技巧</Title>
          </div>

          <div className="space-y-6">
            <Card>
              <Title level={5}>1. 性能优化</Title>
              <ul className="space-y-2 text-sm">
                <li>
                  • 使用 <code>markers: false</code> 在生产环境
                </li>
                <li>• 合理设置触发区域，避免过度触发</li>
                <li>
                  • 使用 <code>once: true</code> 让动画只播放一次
                </li>
                <li>• 及时清理 ScrollTrigger 实例</li>
              </ul>
            </Card>

            <Card>
              <Title level={5}>2. 常见配置</Title>
              <div className="space-y-4">
                <div>
                  <h6 className="font-semibold">基础触发</h6>
                  <code className="text-xs bg-gray-100 p-2 rounded block">
                    scrollTrigger:{" "}
                    {`{
  trigger: element,
  start: "top 80%",
  end: "bottom 20%",
  toggleActions: "play none none reverse"
}`}
                  </code>
                </div>
                <div>
                  <h6 className="font-semibold">跟随滚动</h6>
                  <code className="text-xs bg-gray-100 p-2 rounded block">
                    scrollTrigger:{" "}
                    {`{
  trigger: element,
  start: "top center",
  end: "bottom center",
  scrub: true
}`}
                  </code>
                </div>
                <div>
                  <h6 className="font-semibold">视差效果</h6>
                  <code className="text-xs bg-gray-100 p-2 rounded block">
                    scrollTrigger:{" "}
                    {`{
  trigger: element,
  start: "top bottom",
  end: "bottom top",
  scrub: 1
}`}
                  </code>
                </div>
              </div>
            </Card>

            <Card>
              <Title level={5}>3. 调试技巧</Title>
              <ul className="space-y-2 text-sm">
                <li>
                  • 使用 <code>markers: true</code> 查看触发位置
                </li>
                <li>• 在控制台查看 ScrollTrigger 实例</li>
                <li>
                  • 使用 <code>console.log</code> 调试回调函数
                </li>
                <li>• 测试不同设备和滚动行为</li>
              </ul>
            </Card>

            <Card>
              <Title level={5}>4. 全局滚动进度</Title>
              <div className="mb-4">
                <p className="text-sm mb-2">当前页面滚动进度：</p>
                <Progress percent={Math.round(scrollProgress)} />
              </div>
              <p className="text-xs text-gray-600">
                使用全局 ScrollTrigger 监听整个页面的滚动进度
              </p>
            </Card>
          </div>
        </div>
      ),
    },
  ];

  return (
    <Card title="ScrollTrigger 学习指南" className="mb-6">
      <div className="mb-4">
        <Paragraph>
          这是一个循序渐进的学习指南，从基础概念到高级应用，帮助你掌握
          ScrollTrigger 插件。 每个标签页都包含理论知识和实践演示。
        </Paragraph>
      </div>

      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={tabItems}
        type="card"
        size="large"
      />
    </Card>
  );
}
