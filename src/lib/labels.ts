import type { AppId, ProjectId, VendorId } from "../types";

export const APP_LABELS: Record<AppId, string> = {
  "wechat-shipin": "微信视频号",
  xiaohongshu: "小红书",
  pdd: "拼多多",
  kuaishou: "快手",
  bilibili: "B站",
  douyin: "抖音",
  other: "其他",
};

export const APP_COLORS: Record<AppId, string> = {
  "wechat-shipin": "#07c160",
  xiaohongshu: "#ff2442",
  pdd: "#e02e24",
  kuaishou: "#ff4906",
  bilibili: "#00a1d6",
  douyin: "#000000",
  other: "#64748b",
};

export const VENDOR_LABELS: Record<VendorId, string> = {
  oppo: "OPPO",
  vivo: "vivo",
  huawei: "华为",
  xiaomi: "小米",
  honor: "荣耀",
};

export const VENDOR_COLORS: Record<VendorId, string> = {
  oppo: "#1b8c3f",
  vivo: "#4242ff",
  huawei: "#c7000b",
  xiaomi: "#ff6900",
  honor: "#0055a5",
};

export const PROJECT_LABELS: Record<ProjectId, { name: string; description: string; owner: string }> = {
  "pdd-incentive": {
    name: "拼多多激励任务链路",
    description: "聚焦拼多多签到 / 邀友 / 金币兑换等激励玩法。",
    owner: "增长分析组",
  },
  "kuaishou-incentive": {
    name: "快手极速版激励体系",
    description: "看视频 / 签到 / 邀友分层奖励，形成留存闭环。",
    owner: "增长分析组",
  },
  "xiaohongshu-creator": {
    name: "小红书创作者激励",
    description: "话题任务 / 品牌合作 / 创作者分成体系。",
    owner: "内容生态组",
  },
  "douyin-incentive": {
    name: "抖音激励任务调研",
    description: "签到 / 邀友 / 金币兑换与任务中心演进观察。",
    owner: "增长分析组",
  },
};

export function parseTags(input: string): string[] {
  return input
    .split(/[,，\s#]+/)
    .map((t) => t.trim())
    .filter(Boolean)
    .map((t) => (t.startsWith("#") ? t : `#${t}`));
}

export function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("zh-CN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return iso;
  }
}
