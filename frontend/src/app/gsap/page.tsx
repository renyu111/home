"use client";

import React, { useState } from "react";
import { Tabs, Typography } from "antd";
import AppLayout from "@/components/AppLayout";
import BasicAnimation from "./components/BasicAnimation";
import TextAnimation from "./components/TextAnimation";
import ScrollAnimation from "./components/ScrollAnimation";
import TimelineAnimation from "./components/TimelineAnimation";
import AdvancedAnimation from "./components/AdvancedAnimation";
import ScrollTriggerLearning from "./components/ScrollTriggerLearning";

const { Title } = Typography;

export default function GsapPage() {
  const [activeTab, setActiveTab] = useState("basic");

  const tabItems = [
    {
      key: "basic",
      label: "基础动画",
      children: <BasicAnimation />,
    },
    {
      key: "text",
      label: "文字动画",
      children: <TextAnimation />,
    },
    {
      key: "scroll",
      label: "滚动触发",
      children: <ScrollAnimation />,
    },
    {
      key: "timeline",
      label: "时间轴",
      children: <TimelineAnimation />,
    },
    {
      key: "advanced",
      label: "高级动画",
      children: <AdvancedAnimation />,
    },
    {
      key: "scrolltrigger-learning",
      label: "ScrollTrigger学习",
      children: <ScrollTriggerLearning />,
    },
  ];

  return (
    <AppLayout>
      <div className="p-6">
        <Title level={2} className="mb-6">
          GSAP 动画演示
        </Title>

        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={tabItems}
          type="card"
          size="large"
          className="gsap-tabs"
        />
      </div>
    </AppLayout>
  );
}
