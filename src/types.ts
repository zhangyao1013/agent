export type AppId =
  | "wechat-shipin"
  | "xiaohongshu"
  | "pdd"
  | "kuaishou"
  | "bilibili"
  | "douyin"
  | "other";

export type VendorId =
  | "oppo"
  | "vivo"
  | "huawei"
  | "xiaomi"
  | "honor";

export type NewsKind = "competitor" | "vendor";

export type NewsItem = {
  id: string;
  kind: NewsKind;
  app: AppId;
  vendor?: VendorId;
  title: string;
  summary: string;
  incentiveFocus: string;
  isIncentive: boolean;
  source: string;
  sourceUrl?: string;
  date: string;
  region: "domestic" | "overseas";
};

export type ReviewReport = {
  id: string;
  projectId: ProjectId;
  title: string;
  tags: string[];
  conclusion: string;
  body: string;
  docLink?: string;
  fileName?: string;
  fileDataUrl?: string;
  media: MediaAsset[];
  competitor: AppId;
  publishedAt: string;
  author?: string;
};

export type MediaAsset = {
  id: string;
  type: "image" | "video";
  name: string;
  url: string;
};

export type MaterialSet = {
  id: string;
  projectId: ProjectId;
  name: string;
  description?: string;
  assets: MediaAsset[];
  createdAt: string;
};

export type AnalysisTask = {
  id: string;
  projectId: ProjectId;
  title: string;
  status: "待分析" | "进行中" | "已完成";
  materialSetId?: string;
  competitor: AppId;
  focus?: string;
  createdAt: string;
  assignee?: string;
};

export type SentimentItem = {
  id: string;
  channel: "xiaohongshu" | "douyin";
  author: string;
  content: string;
  keywords: string[];
  likes?: number;
  comments?: number;
  date: string;
  sourceUrl?: string;
};

export type ProjectId =
  | "pdd-incentive"
  | "kuaishou-incentive"
  | "xiaohongshu-creator"
  | "douyin-incentive";

export type ReviewProject = {
  id: ProjectId;
  name: string;
  description: string;
  primaryCompetitor: AppId;
  owner: string;
};

export type TabId = "info" | "reviews" | "sentiment";
