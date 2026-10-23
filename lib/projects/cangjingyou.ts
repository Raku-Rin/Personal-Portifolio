import type { Project } from "./types"

export const cangjingyouProject: Project = {
  slug: "cangjingyou",
  title: "藏境游",
  shortTitle: "藏境游",
  description:
    "一款聚焦西藏旅行内容与路线体验的沉浸式移动应用，通过场景化叙事和路线编排帮助用户建立更完整的目的地感知。",
  tags: ["C 端产品", "移动端", "旅行", "内容体验"],
  imageUrl: "/images/project-tibet.png",
  year: "2025",
  role: "UX/UI Designer",
  platform: "iOS",
  tools: "Figma / Sora",
  duration: "3 months",
  categories: ["Travel app", "Content design", "Mobile experience"],
  heroSummary:
    "围绕“去之前就先感受到目的地氛围”的目标，构建从启发、规划到收藏的内容旅程。",
  overview:
    "项目背景",
  context: [
    "用户在前期探索阶段更需要情绪上的代入与路线上的判断依据，而不是海量平铺信息。这个项目因此强调叙事感、场景感和路线组织方式。",
    "我主要负责首页氛围、目的地详情结构和路线收藏机制，希望在“美感”和“可用”之间找到更稳定的平衡点。",
  ],
  discovery: {
    summary:
      "通过竞品分析和旅行用户访谈，我们发现用户会反复横跳在灵感内容和实用路线之间，因此页面结构需要允许他们在感性浏览与理性规划之间快速切换。",
    image: {
      src: "/images/gallery-2.jpg",
      alt: "藏境游调研记录",
      caption: "内容偏好与路线规划心智图，帮助确定详情页的信息层次。",
    },
    images: [
      {
        src: "/images/cang-uers protfilio.png",
        alt: "藏境游用户画像分析",
        caption: "用户画像与行为偏好",
      },
      {
        src: "/images/cang-other product.png",
        alt: "藏境游竞品分析",
        caption: "竞品功能与体验对比",
      },
    ],
  },
  problemStatements: [
    "如何在推荐多样文化旅游内容的同时，帮助用户更深入探索文化底蕴并提升认同感？",
    "如何通过智能识别用户当前位置，提供有声有形的导览体验，让出游更省心？",
    "如何让用户只需输入旅游地点，即可获得智能安排的便捷出行服务？",
  ],
  designDecisions: [
    {
      title: "让内容叙事服务路线决策",
      summary:
        "我们不再把景点、攻略、路线拆成完全独立的信息岛，而是在详情页里通过章节化编排，把氛围内容和决策信息串联起来。",
      before: {
        src: "/images/gallery-3.jpg",
        alt: "藏境游改版前详情页",
        caption: "Before：信息分类清楚但过于割裂，用户难以形成完整的出行判断。",
      },
      after: {
        src: "/images/project-tibet.png",
        alt: "藏境游改版后详情页",
        caption: "After：通过叙事节奏与路线信息并置，提升浏览与规划的连续性。",
      },
    },
  ],
  prototypeImage: {
    src: "/images/cang-component.png",
    alt: "藏境游组件展示",
    caption: "组件展示",
  },
  deliverables: [
    { src: "/images/cang-IP design.png", alt: "CangJingYou IP design", caption: "引导页 + IP" },
    { src: "/images/cang-all page.png", alt: "CangJingYou all page", caption: "全部页面" },
  ],
  reflection: [
    "旅行产品的体验价值很大程度上来自节奏设计。用户不是在“看信息”，而是在逐步形成想去的冲动和可执行的计划，这要求页面内容既有情绪张力，也有结构节奏。",
    "如果继续延伸，我会测试更细的路线推荐逻辑，并把出行前准备、天气与海拔提醒自然融入收藏后的旅程管理里。",
  ],
}
