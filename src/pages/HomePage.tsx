import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { MarqueeBanner } from "../components/MarqueeBanner";
import { NewsTab } from "../components/NewsTab";
import { ReviewsTab } from "../components/ReviewsTab";
import { VendorTab } from "../components/VendorTab";
import {
  getUnreadReviewIds,
  isMarqueeDismissed,
  loadReviews,
  setLastSeenReviewId,
} from "../lib/storage";
import type { TabId } from "../types";

const TABS: { id: TabId; label: string }[] = [
  { id: "news", label: "竞品资讯" },
  { id: "reviews", label: "竞品评测" },
  { id: "vendor", label: "厂商动态" },
];

export function HomePage() {
  const [params, setParams] = useSearchParams();
  const tabParam = params.get("tab") as TabId | null;
  const activeTab: TabId =
    tabParam && TABS.some((t) => t.id === tabParam) ? tabParam : "news";

  const [reviews, setReviews] = useState(loadReviews);
  const [showMarquee, setShowMarquee] = useState(() => !isMarqueeDismissed());

  const refreshReviews = useCallback(() => {
    setReviews(loadReviews());
  }, []);

  useEffect(() => {
    refreshReviews();
  }, [tabParam, refreshReviews]);

  useEffect(() => {
    const onStorage = () => refreshReviews();
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [refreshReviews]);

  const unreadIds = useMemo(
    () => getUnreadReviewIds(reviews),
    [reviews],
  );

  const marqueeMessages = useMemo(() => {
    if (unreadIds.length === 0) return [];
    return reviews
      .filter((r) => unreadIds.includes(r.id))
      .map((r) => `【新评测】${r.title} — ${r.conclusion.slice(0, 60)}${r.conclusion.length > 60 ? "…" : ""}`);
  }, [reviews, unreadIds]);

  useEffect(() => {
    if (activeTab === "reviews" && reviews[0]) {
      setLastSeenReviewId(reviews[0].id);
    }
  }, [activeTab, reviews]);

  function setTab(id: TabId) {
    setParams({ tab: id });
  }

  return (
    <div className="app-shell">
      <header className="site-header">
        <h1>激励增长 · 竞品情报台</h1>
        <p>
          面向激励增长业务的竞品动态追踪：资讯摘要、评测沉淀与厂商战略一览。
        </p>
        <div className="badge-row">
          <span className="pill pill-blue">专业洞察</span>
          <span className="pill pill-orange">激励增长</span>
        </div>
      </header>

      {showMarquee && unreadIds.length > 0 && activeTab !== "reviews" && (
        <MarqueeBanner
          messages={marqueeMessages}
          onClose={() => setShowMarquee(false)}
        />
      )}

      <nav className="tab-nav" role="tablist">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={activeTab === t.id}
            className={`tab-btn ${activeTab === t.id ? "active" : ""}`}
            onClick={() => setTab(t.id)}
          >
            {t.label}
            {t.id === "reviews" && unreadIds.length > 0 && (
              <span
                style={{
                  marginLeft: 6,
                  background: "var(--orange-500)",
                  color: "#fff",
                  borderRadius: 999,
                  padding: "0 6px",
                  fontSize: "0.7rem",
                }}
              >
                {unreadIds.length}
              </span>
            )}
          </button>
        ))}
      </nav>

      {activeTab === "news" && <NewsTab />}
      {activeTab === "reviews" && <ReviewsTab reports={reviews} />}
      {activeTab === "vendor" && <VendorTab />}
    </div>
  );
}
