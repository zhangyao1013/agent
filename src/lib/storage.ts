import type { ReviewReport } from "../types";

const REVIEWS_KEY = "intel_reviews";
const MARQUEE_DISMISSED_KEY = "intel_marquee_dismissed";
const LAST_SEEN_REVIEW_KEY = "intel_last_seen_review";

export function loadReviews(): ReviewReport[] {
  try {
    const raw = localStorage.getItem(REVIEWS_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as ReviewReport[];
  } catch {
    return [];
  }
}

export function saveReviews(reports: ReviewReport[]): void {
  localStorage.setItem(REVIEWS_KEY, JSON.stringify(reports));
}

export function addReview(report: ReviewReport): void {
  const list = loadReviews();
  list.unshift(report);
  saveReviews(list);
}

export function isMarqueeDismissed(): boolean {
  return localStorage.getItem(MARQUEE_DISMISSED_KEY) === "1";
}

export function dismissMarquee(): void {
  localStorage.setItem(MARQUEE_DISMISSED_KEY, "1");
}

export function resetMarqueeDismissed(): void {
  localStorage.removeItem(MARQUEE_DISMISSED_KEY);
}

export function getLastSeenReviewId(): string | null {
  return localStorage.getItem(LAST_SEEN_REVIEW_KEY);
}

export function setLastSeenReviewId(id: string): void {
  localStorage.setItem(LAST_SEEN_REVIEW_KEY, id);
}

export function getUnreadReviewIds(reports: ReviewReport[]): string[] {
  const last = getLastSeenReviewId();
  if (!last) return reports.map((r) => r.id);
  const idx = reports.findIndex((r) => r.id === last);
  if (idx <= 0) return idx === 0 ? [] : reports.slice(0, idx).map((r) => r.id);
  return reports.slice(0, idx).map((r) => r.id);
}
