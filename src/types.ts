export type AppId = "pdd" | "kuaishou" | "ks-lite" | "hongguo" | "overseas" | "other";

export type NewsItem = {
  id: string;
  app: AppId;
  title: string;
  summary: string;
  incentiveFocus: string;
  source: string;
  sourceUrl?: string;
  date: string;
  region: "domestic" | "overseas";
};

export type VendorItem = {
  id: string;
  vendor: string;
  title: string;
  summary: string;
  impact: string;
  date: string;
  sourceUrl?: string;
};

export type MediaAsset = {
  id: string;
  type: "image" | "video";
  name: string;
  url: string;
};

export type ReviewReport = {
  id: string;
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

export type TabId = "news" | "reviews" | "vendor";
