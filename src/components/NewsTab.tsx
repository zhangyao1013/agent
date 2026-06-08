import { useMemo, useState } from "react";
import { SEED_NEWS } from "../data/seedNews";
import {
  APP_COLORS,
  APP_LABELS,
  VENDOR_COLORS,
  VENDOR_LABELS,
  formatDate,
} from "../lib/labels";
import type { AppId, NewsItem, NewsKind, VendorId } from "../types";

type AppFilter = AppId | "all";
type KindFilter = NewsKind | "all";
type IncentiveFilter = "all" | "incentive" | "non-incentive";

const APP_OPTIONS: { id: AppFilter; label: string }[] = [
  { id: "all", label: "全部 App" },
  { id: "wechat-shipin", label: "微信视频号" },
  { id: "xiaohongshu", label: "小红书" },
  { id: "pdd", label: "拼多多" },
  { id: "kuaishou", label: "快手" },
  { id: "bilibili", label: "B站" },
  { id: "douyin", label: "抖音" },
];

const KIND_OPTIONS: { id: KindFilter; label: string }[] = [
  { id: "all", label: "竞品动态 + 商场动态" },
  { id: "competitor", label: "竞品动态" },
  { id: "vendor", label: "商场动态" },
];

const INCENTIVE_OPTIONS: { id: IncentiveFilter; label: string }[] = [
  { id: "all", label: "激励 + 非激励" },
  { id: "incentive", label: "仅激励相关" },
  { id: "non-incentive", label: "仅非激励" },
];

function NewsCard({ item }: { item: NewsItem }) {
  const isVendor = item.kind === "vendor";
  const tagLabel = isVendor && item.vendor
    ? VENDOR_LABELS[item.vendor]
    : APP_LABELS[item.app];
  const tagColor = isVendor && item.vendor
    ? VENDOR_COLORS[item.vendor]
    : APP_COLORS[item.app];

  return (
    <article className="news-card">
      <div className="card-meta">
        <span className="app-tag" style={{ background: tagColor }}>
          {tagLabel}
        </span>
        <span>{isVendor ? "商场动态" : "竞品动态"}</span>
        <span>{formatDate(item.date)}</span>
        <span>{item.isIncentive ? "激励相关" : "非激励"}</span>
        <span>{item.source}</span>
      </div>
      <h3>{item.title}</h3>
      <p>{item.summary}</p>
      <div className="incentive-box">
        <strong>{isVendor ? "对激励业务影响" : "激励增长要点"}</strong>
        {item.incentiveFocus}
      </div>
      {item.sourceUrl && (
        <p style={{ marginTop: 12, fontSize: "0.85rem" }}>
          <a href={item.sourceUrl} target="_blank" rel="noreferrer">
            查看来源 →
          </a>
        </p>
      )}
    </article>
  );
}

export function NewsTab() {
  const [appFilter, setAppFilter] = useState<AppFilter>("all");
  const [kindFilter, setKindFilter] = useState<KindFilter>("all");
  const [incentiveFilter, setIncentiveFilter] =
    useState<IncentiveFilter>("all");

  const items = useMemo(() => {
    let list = [...SEED_NEWS].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );
    if (appFilter !== "all") {
      list = list.filter((n) => n.app === appFilter);
    }
    if (kindFilter !== "all") {
      list = list.filter((n) => n.kind === kindFilter);
    }
    if (incentiveFilter === "incentive") {
      list = list.filter((n) => n.isIncentive);
    } else if (incentiveFilter === "non-incentive") {
      list = list.filter((n) => !n.isIncentive);
    }
    return list;
  }, [appFilter, kindFilter, incentiveFilter]);

  return (
    <section className="tab-panel">
      <div className="filter-section filter-horizontal">
        <div className="filter-item">
          <span className="filter-label">竞品 App</span>
          <select
            className="dropdown"
            value={appFilter}
            onChange={(e) => setAppFilter(e.target.value as AppFilter)}
          >
            {APP_OPTIONS.map((o) => (
              <option key={o.id} value={o.id}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
        <div className="filter-item">
          <span className="filter-label">动态类型</span>
          <select
            className="dropdown"
            value={kindFilter}
            onChange={(e) => setKindFilter(e.target.value as KindFilter)}
          >
            {KIND_OPTIONS.map((o) => (
              <option key={o.id} value={o.id}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
        <div className="filter-item">
          <span className="filter-label">业务场景</span>
          <select
            className="dropdown"
            value={incentiveFilter}
            onChange={(e) =>
              setIncentiveFilter(e.target.value as IncentiveFilter)
            }
          >
            {INCENTIVE_OPTIONS.map((o) => (
              <option key={o.id} value={o.id}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="empty-state">
          <p>当前筛选下暂无信息</p>
        </div>
      ) : (
        <div className="card-grid">
          {items.map((item) => (
            <NewsCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </section>
  );
}
