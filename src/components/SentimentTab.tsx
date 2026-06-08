import { useMemo, useState } from "react";
import { SEED_SENTIMENT } from "../data/seedNews";
import { formatDate } from "../lib/labels";
import type { SentimentItem } from "../types";

type ChannelFilter = "all" | "xiaohongshu" | "douyin";

const CHANNEL_OPTIONS: { id: ChannelFilter; label: string; color: string }[] = [
  { id: "all", label: "全部渠道", color: "#64748b" },
  { id: "xiaohongshu", label: "小红书", color: "#ff2442" },
  { id: "douyin", label: "抖音", color: "#000000" },
];

function SentimentCard({ item }: { item: SentimentItem }) {
  const channelLabel = item.channel === "xiaohongshu" ? "小红书" : "抖音";
  const channelColor = item.channel === "xiaohongshu" ? "#ff2442" : "#000000";

  return (
    <article className="news-card">
      <div className="card-meta">
        <span className="app-tag" style={{ background: channelColor }}>
          {channelLabel}
        </span>
        <span>{item.author}</span>
        <span>{formatDate(item.date)}</span>
        {typeof item.likes === "number" && <span>❤ {item.likes}</span>}
        {typeof item.comments === "number" && <span>💬 {item.comments}</span>}
      </div>
      <p style={{ margin: "8px 0 0", lineHeight: 1.7 }}>{item.content}</p>
      <div className="incentive-box" style={{ marginTop: 12 }}>
        <strong>关键词</strong>
        <div className="review-tags" style={{ marginTop: 6 }}>
          {item.keywords.map((k) => (
            <span
              key={k}
              className="tag"
              style={{ background: "#eef2ff", color: "#3730a3" }}
            >
              #{k}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}

export function SentimentTab() {
  const [channel, setChannel] = useState<ChannelFilter>("all");
  const [keyword, setKeyword] = useState("");

  const items = useMemo(() => {
    let list = [...SEED_SENTIMENT].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );
    if (channel !== "all") {
      list = list.filter((s) => s.channel === channel);
    }
    const kw = keyword.trim();
    if (kw) {
      list = list.filter(
        (s) =>
          s.keywords.some((k) => k.includes(kw)) ||
          s.content.includes(kw) ||
          s.author.includes(kw),
      );
    }
    return list;
  }, [channel, keyword]);

  return (
    <section className="tab-panel">
      <div className="filter-section">
        <div className="filter-row">
          <span className="filter-label">渠道</span>
          <div className="filter-chips">
            {CHANNEL_OPTIONS.map((o) => (
              <button
                key={o.id}
                type="button"
                className={`chip ${channel === o.id ? "active" : ""}`}
                onClick={() => setChannel(o.id)}
              >
                {o.label}
              </button>
            ))}
          </div>
        </div>
        <div className="filter-row">
          <span className="filter-label">关键词</span>
          <input
            type="text"
            className="keyword-input"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="输入关键词，例如：签到 / 金币 / 提现"
          />
        </div>
      </div>

      <p
        className="disclaimer"
        style={{ marginBottom: 16, fontSize: "0.85rem" }}
      >
        当前内容为样例，实际可接入小红书与抖音上关于「激励玩法」的反馈抓取。
      </p>

      {items.length === 0 ? (
        <div className="empty-state">
          <p>当前筛选下暂无反馈</p>
        </div>
      ) : (
        <div className="card-grid">
          {items.map((item) => (
            <SentimentCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </section>
  );
}
