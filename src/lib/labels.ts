import type { AppId } from "../types";

export const APP_LABELS: Record<AppId, string> = {
  pdd: "拼多多",
  kuaishou: "快手",
  "ks-lite": "快手极速版",
  hongguo: "红果短剧",
  overseas: "海外 App",
  other: "其他",
};

export const APP_COLORS: Record<AppId, string> = {
  pdd: "#e02e24",
  kuaishou: "#ff4906",
  "ks-lite": "#ff6b00",
  hongguo: "#7c3aed",
  overseas: "#0ea5e9",
  other: "#64748b",
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
