import { useMemo, useState } from "react";
import { SEED_NEWS } from "../data/seedNews";
import { APP_COLORS, APP_LABELS, formatDate } from "../lib/labels";
import type { AppId, NewsItem } from "../types";

const FILTERS: { id: AppId | "all"; label: string }[] = [
  { id: "all", label: "全部" },
  { id: "pdd", label: "拼多多" },
  { id: "kuaishou", label: "快手" },
  { id: "ks-lite", label: "快手极速版" },
  { id: "hongguo", label: "红果短剧" },
  { id: "overseas", label: "海外" },
];

function NewsCard({ item }: { item: NewsItem }) {
  return (
    <article className="news-card">
      <div className="card-meta">
        <span
          className="app-tag"
          style={{ background: APP_COLORS[item.app] }}
        >
          {APP_LABELS[item.app]}
        </span>
        <span>{formatDate(item.date)}</span>
        <span>{item.region === "overseas" ? "海外" : "国内"}</span>
        <span>{item.source}</span>
      </div>
      <h3>{item.title}</h3>
      <p>{item.summary}</p>
      <div className="incentive-box">
        <strong>激励增长要点</strong>
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
  const [filter, setFilter] = useState<AppId | "all">("all");

  const items = useMemo(() => {
    const list = [...SEED_NEWS].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );
    if (filter === "all") return list;
    return list.filter((n) => n.app === filter);
  }, [filter]);

  return (
    <section className="tab-panel">
      <div className="toolbar">
        <div className="filter-chips">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              className={`chip ${filter === f.id ? "active" : ""}`}
              onClick={() => setFilter(f.id)}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>
      <p className="disclaimer" style={{ marginTop: 0, marginBottom: 16 }}>
        以下为公开渠道检索的激励增长相关摘要，供内部参考。你可随时补充微信文章、研报等链接与要点。
      </p>
      <div className="card-grid">
        {items.map((item) => (
          <NewsCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}
