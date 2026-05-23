import { Link } from "react-router-dom";
import { APP_COLORS, APP_LABELS, formatDate } from "../lib/labels";
import type { ReviewReport } from "../types";

type Props = {
  reports: ReviewReport[];
};

export function ReviewsTab({ reports }: Props) {
  return (
    <section className="tab-panel">
      <div className="toolbar">
        <p style={{ margin: 0, color: "var(--slate-500)", fontSize: "0.9rem" }}>
          评测报告含核心结论、截图与录屏，支持业务标签分类。
        </p>
        <Link to="/upload" className="btn-primary">
          + 上传评测报告
        </Link>
      </div>

      {reports.length === 0 ? (
        <div className="empty-state">
          <p>暂无评测报告</p>
          <p style={{ fontSize: "0.9rem" }}>
            点击「上传评测报告」发布第一篇，发布后顶部将滚动提醒。
          </p>
          <Link to="/upload" className="btn-primary" style={{ marginTop: 16 }}>
            去上传
          </Link>
        </div>
      ) : (
        <div className="card-grid">
          {reports.map((r) => (
            <article key={r.id} className="review-card">
              <div className="card-meta">
                <span
                  className="app-tag"
                  style={{ background: APP_COLORS[r.competitor] }}
                >
                  {APP_LABELS[r.competitor]}
                </span>
                <span>{formatDate(r.publishedAt)}</span>
                {r.author && <span>{r.author}</span>}
              </div>
              <h3>{r.title}</h3>
              <div className="review-tags">
                {r.tags.map((t) => (
                  <span key={t} className="tag">
                    {t}
                  </span>
                ))}
              </div>
              <div className="conclusion">
                <strong style={{ color: "var(--blue-800)" }}>核心结论</strong>
                <p style={{ margin: "6px 0 0" }}>{r.conclusion}</p>
              </div>
              {r.body && <p>{r.body}</p>}
              {r.docLink && (
                <p style={{ fontSize: "0.85rem" }}>
                  <a href={r.docLink} target="_blank" rel="noreferrer">
                    文档链接 →
                  </a>
                </p>
              )}
              {r.fileName && (
                <p style={{ fontSize: "0.85rem", color: "var(--slate-500)" }}>
                  附件：{r.fileName}
                </p>
              )}
              {r.media.length > 0 && (
                <div className="media-grid">
                  {r.media.map((m) => (
                    <div key={m.id} className="media-thumb">
                      {m.type === "video" ? (
                        <video src={m.url} controls muted playsInline />
                      ) : (
                        <img src={m.url} alt={m.name} />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
