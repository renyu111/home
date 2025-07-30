"use client";

import React, { useState } from "react";
import { Tabs, Typography } from "antd";
import AppLayout from "@/components/AppLayout";
import "./style.css";
import "./btn1.scss";
import "./q3.css";
import "./q4.css";

const { Title } = Typography;

export default function CSSPage() {
  const [activeTab, setActiveTab] = useState("basic");

  const tabItems = [
    {
      key: "Anchor",
      label: "磁吸",
      children: (
        <div className="h-[1500px] w-full flex gap-4 p-2 relative">
          <div className="btn-a">按钮A</div>
          <div className="btn-b">按钮B</div>
          <div className="anchor absolute w-[100px] h-[30px] bg-[red]">
            被定位元素C
          </div>
        </div>
      ),
    },
    {
      key: "mask",
      label: "mask",
      children: (
        <div className="h-[1500px] w-full relative">
          <div className="btn1 w-[100px] h-[100px] flex items-center justify-center">
            btn1
          </div>
        </div>
      ),
    },
    {
      key: "variable",
      label: "变量",
      children: (
        <div className="h-[1500px] w-full relative">
          <div
            className="q3"
            onClick={() => {
              console.log("click");
              //  读取
              const root = getComputedStyle(document.documentElement);
              const cssVariable = root
                .getPropertyValue("--color-primary")
                .trim();
              console.log(cssVariable);
              document.documentElement.style.setProperty(
                "--color-primary",
                "red"
              );
            }}
          ></div>
        </div>
      ),
    },
    {
      key: "gradient",
      label: "渐变",
      children: (
        <div className="h-[1500px] w-full relative">
          <div className="gradient"></div>
        </div>
      ),
    },
    // {
    //   key: "advanced",
    //   label: "高级动画",
    // },
    // {
    //   key: "scrolltrigger-learning",
    //   label: "ScrollTrigger学习",
    // },
    // {
    //   key: "scrolltrigger-learning",
    //   label: "ScrollTrigger学习",
    // },
    // {
    //   key: "scrolltrigger-learning",
    //   label: "ScrollTrigger学习",
    // },
    // {
    //   key: "scrolltrigger-learning",
    //   label: "ScrollTrigger学习",
    // },
    // {
    //   key: "scrolltrigger-learning",
    //   label: "ScrollTrigger学习",
    // },
    // {
    //   key: "scrolltrigger-learning",
    //   label: "ScrollTrigger学习",
    // },
    // {
    //   key: "scrolltrigger-learning",
    //   label: "ScrollTrigger学习",
    // },
    // {
    //   key: "scrolltrigger-learning",
    //   label: "ScrollTrigger学习",
    // },
    // {
    //   key: "scrolltrigger-learning",
    //   label: "ScrollTrigger学习",
    // },
    // {
    //   key: "scrolltrigger-learning",
    //   label: "ScrollTrigger学习",
    // },
    // {
    //   key: "scrolltrigger-learning",
    //   label: "ScrollTrigger学习",
    // },
    // {
    //   key: "scrolltrigger-learning",
    //   label: "ScrollTrigger学习",
    // },
    // {
    //   key: "scrolltrigger-learning",
    //   label: "ScrollTrigger学习",
    // },
    // {
    //   key: "scrolltrigger-learning",
    //   label: "ScrollTrigger学习",
    // },
    // {
    //   key: "scrolltrigger-learning",
    //   label: "ScrollTrigger学习",
    // },
  ];

  return (
    <AppLayout>
      <div className="p-6">
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
