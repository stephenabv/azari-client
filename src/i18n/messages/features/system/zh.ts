import type { DeepPartial, Messages } from "../../types";

/** Simplified Chinese. Draft translation — have a fluent speaker review before launch. */
export const systemZh: DeepPartial<Messages["system"]> = {
  errorBoundary: {
    title: "出现了一些问题",
    chunkMessage: "应用已有新版本。请重新加载以继续。",
    message: "无法加载{context}。这很可能是暂时性问题。",
    defaultContext: "此部分",
    errorCode: "错误代码：{code}",
    reload: "重新加载页面",
    retry: "重试",
  },
  systemError: {
    eyebrow: "请求失败",
    title: "出现了一些问题",
    message: "我们暂时无法处理您的请求。请稍后再试。",
    checkConnection: "检查网络连接",
    verifyForm: "核对表单信息",
    trySubmitting: "重新提交",
    close: "关闭",
  },
  seconds: {
    count: {
      one: "{n} 秒",
      few: "{n} 秒",
      many: "{n} 秒",
      other: "{n} 秒",
    },
    unit: {
      one: "秒",
      few: "秒",
      many: "秒",
      other: "秒",
    },
  },
  rateLimit: {
    ariaLabel: "请求次数超出限制",
    title: "请求过于频繁",
    body: "由于请求过于频繁，您的访问已被暂时限制。",
    resume: "访问将在 {time}后自动恢复。",
  },
  comingSoon: {
    title: "Azari Solar 正在充电中。",
    body: "我们正在准备此页面，以展示更智能的太阳能发电系统、节能方案和可持续解决方案。",
    redirect: "将在 {time}后返回首页。",
    backHome: "返回首页",
  },
  pageLoader: {
    ariaLabel: "页面加载中",
  },
  partners: {
    ariaLabel: "合作伙伴标志",
  },
  tropics: {
    headerTop: "专为热带打造的",
    headerBottom: "太阳能",
    climateTitle: "气候适应力",
    typhoonRacking: "抗台风支架",
    heatOptimization: "高温环境优化",
    assetsDeployed: "已部署的太阳能装机",
    performanceTitle: "性能保证",
    performanceSubtitle: "客户电费平均降低幅度",
  },
  excellence: {
    titleTop: "为卓越",
    titleBottom: "而设计。",
    description:
      "我们不只是安装太阳能板；我们集成专为应对菲律宾电网基础设施独特挑战而设计的智能能源系统。",
  },
  cta: {
    titlePrefix: "准备好打造属于您的",
    titleHighlight: "能源独立了吗？",
  },
  meta: {
    clientJourney: {
      title: "薄荷岛太阳能安装流程 | Azari Solar",
      description:
        "了解 Azari Solar 如何在薄荷岛（Bohol）为您提供从咨询到安装的全程指导。流程透明、组件优质，并在菲律宾全境提供完善的售后服务。",
    },
    solarCalculator: {
      title: "免费太阳能节省计算器 — 菲律宾薄荷岛 | Azari Solar",
      description:
        "使用我们的免费太阳能计算器，估算您所需的系统规模和每月节省金额。输入您的电费即可找到合适的套餐 — 服务薄荷岛及菲律宾全境。",
    },
    privacyPolicy: {
      title: "隐私政策 — Azari Solar",
      description:
        "Azari Solar 如何依据菲律宾《2012年数据隐私法》（Data Privacy Act of 2012）收集、使用和保护您的个人数据。",
      shareDescription: "Azari Solar 如何收集、使用和保护您的个人数据。",
    },
    termsConditions: {
      title: "条款与条件 — Azari Solar",
      description:
        "适用于您使用 azari.solar 以及 Azari Solar 报价、咨询和安装服务的条款与条件。",
      shareDescription: "适用于您使用 azari.solar 的条款与条件。",
    },
    projects: {
      title: "菲律宾薄荷岛太阳能项目 | Azari Solar",
      description:
        "查看 Azari Solar 在薄荷岛及菲律宾全境完成的住宅和商业太阳能安装项目。真实项目，真实节能。",
    },
    notFound: {
      title: "页面未找到 — Azari Solar",
    },
    projectDetail: {
      title: "{name} — Azari Solar",
      fallbackName: "太阳能项目",
      description: "Azari Solar 在菲律宾薄荷岛的{name}。",
      fallbackDescription: "Azari Solar 在菲律宾薄荷岛的太阳能项目。",
    },
  },
};
