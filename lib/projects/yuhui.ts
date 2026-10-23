import type { Project } from "./types"

export const yuhuiProject: Project = {
  slug: "yuhui",
  title: "语绘",
  shortTitle: "语绘",
  description:
    "面向艺术教育场景的 AI 创作产品，帮助用户通过自然语言描述快速生成视觉草图，并完成灵感探索与作品沉淀。",
  tags: ["C 端产品", "移动端", "AI", "教育", "艺术"],
  imageUrl: "/images/project-yuhui.png",
  year: "2024",
  role: "Product Designer",
  platform: "iOS",
  tools: "Figma / Stable Diffusion / Photoshop",
  duration: "3 months",
  categories: ["Consumer product", "AI creation", "Mobile app"],
  heroSummary:
    "把“不会画也能开始创作”的体验落到具体的输入引导、结果反馈和作品沉淀机制上。",
  overview:
    "项目背景",
  context: [
    "从 K12 向高等、职业教育的转移，以及校园信息化、智慧化课堂普及，AI 逐渐融入教育场景，从工具型到场景化转变。但目前市场上针对 AI 创作产品的教育价值挖掘不足，用户在使用时仍面临许多挑战，如：难以理解提示词、对结果缺乏信心、创作流程不顺畅等。",
  ],
  discovery: {
    summary:
      "调研显示，一款好的 AI 教育产品应该具备以下功能：1. 提供易于理解的创作引导；2. 提供多样化的创作结果；3. 提供作品点评和学习反馈；4. 提供作品保存和分享。同时，还留存了传统教育 APP 的基础功能，如：课程表、作业、考试等。",
    image: {
      src: "/images/yuhui-User research.png",
      alt: "用户分析路径",
      caption: "用户分析路径：用户画像、问卷调研、旅程地图。",
    },
  },
  problemStatements: [
    {
      primary: "学习路径分散",
      secondary: "学生",
      supporting: "传统学习渠道单一但信息分散，零基础用户难以建立连续、可执行的学习节奏。",
    },
    {
      primary: "教学反馈成本高",
      secondary: "老师",
      supporting: "作业布置与批改耗时，班级管理链路冗长，难以稳定输出及时且有针对性的反馈。",
    },
    {
      primary: "创作闭环不完整",
      secondary: "AI 辅助场景",
      supporting: "生成后反馈不足且滞后，用户难以理解结果优劣并快速迭代，创作流程缺少连续性。",
    },
  ],
  designDecisions: [
    {
      title: "把提示词输入改造成可组合的创作引导",
      summary:
        "相比开放式文本框，模块化输入更适合教育产品。它既保留表达自由度，也能通过示例标签、风格建议和即时反馈降低第一次创作的压力。",
      before: {
        src: "/images/yuhui-wireframe.png",
        alt: "语绘线框图",
        caption: "局部线框图展示",
      },
      after: {
        src: "/images/yuhui-wireframe.png",
        alt: "语绘改版后输入页",
        caption: "After：通过结构化描述、示例和反馈构成更顺滑的创作入口。",
      },
    },
  ],
  prototypeImage: {
    src: "/images/yuhui-wireframe.png",
    alt: "YuHui prototype wireframe",
    caption: "线框原型图",
  },
  deliverables: [
    { src: "/images/yuhui-ai page.png", alt: "YuHui AI page", caption: "AI page" },
    { src: "/images/yuhui-all page.png", alt: "YuHui all page", caption: "All page" },
  ],
  reflection: [
    "AI 产品里最容易被忽略的是用户对结果的不确定感。与其让系统显得“很聪明”，不如让用户在每一步都知道自己为什么会得到这个结果，以及下一步还能怎么改。",
    "如果继续深化，我会进一步补强作品点评和课堂协同能力，让语绘从生成工具延展为可持续使用的学习平台。",
  ],
}
