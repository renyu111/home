"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Card, Row, Col } from "antd";

// 注册ScrollTrigger插件
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function ScrollAnimation() {
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 卡片动画
    if (cardsRef.current) {
      const cards = cardsRef.current.querySelectorAll(".animate-card");

      gsap.fromTo(
        cards,
        {
          opacity: 0,
          y: 50,
          scale: 0.8,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          stagger: 0.2,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: cardsRef.current,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }

    // 清理函数
    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <div className="pt-[1000px]">
      <Card title="滚动触发动画" className="mb-6">
        <div className="mb-4">
          <p className="text-gray-600">
            向下滚动查看动画效果，卡片会在进入视口时播放动画
          </p>
        </div>

        <Row ref={cardsRef} gutter={[16, 16]}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((item) => (
            <Col xs={24} sm={12} md={8} key={item}>
              <Card
                className="animate-card"
                hoverable
                cover={
                  <div className="h-32 bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center text-white text-2xl font-bold">
                    {item}
                  </div>
                }
              >
                <Card.Meta
                  title={`动画卡片 ${item}`}
                  description="这是一个使用GSAP ScrollTrigger实现的滚动触发动画效果。当卡片进入视口时会播放动画。"
                />
              </Card>
            </Col>
          ))}
        </Row>
      </Card>
    </div>
  );
}
