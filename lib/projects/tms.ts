import type { Project } from "./types"

export const tmsProject: Project = {
  slug: "tms",
  title: "TMS 物流运输管理系统",
  shortTitle: "TMS",
  description:
    "针对复杂调度场景，通过重构异常处理链路与任务信息层级，帮助调度员在高并发订单下更快完成判断与协同。",
  tags: ["B 端产品", "改版", "交互设计", "体验优化"],
  imageUrl: "/images/project-tms.png",
  year: "2025",
  role: "Interaction/UI Designer",
  platform: "Web",
  tools: "Figma",
  duration: "6 months",
  categories: ["B-side product", "TMS", "Interaction design"],
  heroSummary:
    "从“看懂一堆订单”转向“优先处理真正需要注意的异常”，为调度员建立更轻的工作节奏。",
  overview: "项目背景",
  context: [
    "我们为某大型钢铁集团定制了车辆运输平台，第一阶段完成了从纸质运单到电子工单、从电话派单到系统派单的数字化转型。在业务快速扩张的同时，我们也意识到掌控运输流程繁杂、使用低效等问题。",
    "第二阶段我们以低成本掌控运输全流程、降低认知负担、提高操作便捷性为本次产品升级的核心目标，让用户在运输前、运输中、运输后都能拥有更顺畅、清晰、可控的操作体验。",
  ],
  discovery: {
    summary:
      "我们深入调度中心，采用跟岗观察、深度访谈和现场查看，用一周时间跟随不同班次调度员，同时访谈了多家外部承运商。结合行业内相似竞品进行分析与拆解，如路歌、G7 等平台。通过前期访谈和体验自查，归纳出三个核心问题：信息分散、决策困难、过程不可视。",
    image: {
      src: "/images/TMS-User research.png",
      alt: "TMS 用户调研",
      caption: "用户调研：用户访谈、跟岗调研与反馈整理。",
    },
  },
  problemStatements: [
    {
      primary: "信息分散",
      secondary: "项目经理",
      supporting: "合同管理缺乏到期预警与关键状态聚合，导致筛选查询路径过长、关注重点不清晰。",
    },
    {
      primary: "决策困难",
      secondary: "承运商",
      supporting: "询价业务中专有名词晦涩且填项繁琐，列表层级因关键决策信息缺失而高度依赖详情页。",
    },
    {
      primary: "过程不可视",
      secondary: "调度员",
      supporting: "车辆与工单监控信息密度过载且缺乏异常驱动，导致查询费时、协作断层且异常感知滞后。",
    },
  ],
  designGoals: [
    {
      audience: "项目经理",
      goal: "全局管理",
      details: ["筛选结构重置", "信息层级优化", "快捷操作引入", "不同场景视图适配"],
    },
    {
      audience: "承运商",
      goal: "决策信心",
      details: ["高频筛选优化", "决策信息前置", "操作流程简化", "运价趋势引入"],
    },
    {
      audience: "调度员",
      goal: "实时掌控",
      details: ["提升定位效率", "操作路径优化", "状态可视化增强", "轨迹与异常引导", "信息架构与降噪"],
    },
  ],
  designDecisions: [
    {
      title: "项目合同：建立数据总览，优化信息层级",
      summary:
        "旧版中，需多次点击筛选查询快到期的合同，且缺乏数据概览，查询前不清楚哪些合同需要关注。列表中的关键信息不突出，且合同状态难以快速识别。",
      before: {
        src: "/images/Before 项目合同.png",
        alt: "TMS 改版前总览",
        caption: "缺少整体概览，列表关键信息不突出",
      },
      after: {
        src: "/images/After 项目合同.png",
        alt: "TMS 改版后总览",
        caption: "增加数据总览，新版优先暴露异常状态、弱化干扰项",
      },
    },
    {
      title: "询价中心：优化询价流程，减少操作步骤",
      summary:
        "旧版中，许多反馈说部分筛选项理解困难，如 ‘内部、外部订单’，填写选项偏多。浏览报价单时显示信息不足，无法顺利做出决策，许多要依靠详情页的更多内容进行报价。",
      before: {
        src: "/images/Before 询价中心.png",
        alt: "TMS 改版前总览",
        caption: "缺少整体概览，列表关键信息不突出",
      },
      after: {
        src: "/images/After 询价中心.png",
        alt: "TMS 改版后总览",
        caption: "增加数据总览，新版优先暴露异常状态、弱化干扰项",
      },
    },
    {
      title: "车辆监控：聚合关键信息，明晰处理记录",
      summary:
        "旧版本中，查看异常车辆需要跳出地图进入详情页，看完了还得返回，这种频繁的进进出出导致他处理一个报警需要花 2 分钟。甚至有的调度员需要在屏幕上贴便利贴来标记异常车辆，来时刻提醒自己关注异常车辆。",
      before: {
        src: "/images/Before 选择车辆.png",
        alt: "TMS 改版前总览",
        caption: "缺少整体概览，列表关键信息不突出",
      },
      after: {
        src: "/images/After 选择车辆.png",
        alt: "TMS 改版后总览",
        caption: "增加数据总览，新版优先暴露异常状态、弱化干扰项",
      },
    },
  ],
  deliverables: [
    { src: "/images/TMS-case1.png", alt: "TMS project contract", caption: "项目合同" },
    { src: "/images/TMS-case2.png", alt: "TMS quotation center", caption: "询价中心" },
    { src: "/images/TMS-case3.png", alt: "TMS vehicle selection", caption: "选择车辆" },
    { src: "/images/TMS-case4.png", alt: "TMS work order detail", caption: "工单详情" },
  ],
  reflection: [
    "这个项目让我更确信，B 端体验优化的价值往往不在于“页面更好看”，而在于让用户更快建立判断顺序。只有先把注意力机制设计清楚，视觉语言才真正服务业务效率。",
    "如果继续迭代，我会补充更完整的异常前后对比指标，并把协同消息流与履约节点做更细的联动，让调度员在一次进入详情时就完成上下文确认。",
  ],
}
