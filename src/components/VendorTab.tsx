import { SEED_VENDOR } from "../data/seedNews";
import { formatDate } from "../lib/labels";

export function VendorTab() {
  return (
    <section className="tab-panel">
      <p className="disclaimer" style={{ marginTop: 0, marginBottom: 16 }}>
        追踪字节、拼多多、快手等平台战略与产品动向，评估对激励增长业务的影响。
      </p>
      <div className="card-grid">
        {SEED_VENDOR.map((v) => (
          <article key={v.id} className="vendor-card">
            <div className="card-meta">
              <span className="pill pill-blue">{v.vendor}</span>
              <span>{formatDate(v.date)}</span>
            </div>
            <h3>{v.title}</h3>
            <p>{v.summary}</p>
            <div className="incentive-box">
              <strong>对激励业务影响</strong>
              {v.impact}
            </div>
            {v.sourceUrl && (
              <p style={{ marginTop: 12, fontSize: "0.85rem" }}>
                <a href={v.sourceUrl} target="_blank" rel="noreferrer">
                  查看来源 →
                </a>
              </p>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
