import type {
  AnalysisTask,
  MaterialSet,
  ProjectId,
  ReviewProject,
  ReviewReport,
} from "../types";

const REVIEWS_KEY = "intel_reviews";
const MARQUEE_DISMISSED_KEY = "intel_marquee_dismissed";
const LAST_SEEN_REVIEW_KEY = "intel_last_seen_review";
const MATERIAL_SETS_KEY = "intel_material_sets";
const TASKS_KEY = "intel_tasks";
const PROJECTS_KEY = "intel_projects";

export const FIXED_PROJECT_IDS: ProjectId[] = [
  "pdd-incentive",
  "kuaishou-incentive",
  "xiaohongshu-creator",
  "douyin-incentive",
];

function readList<T>(key: string, fallback: T[]): T[] {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T[];
  } catch {
    return fallback;
  }
}

function writeList<T>(key: string, list: T[]): void {
  localStorage.setItem(key, JSON.stringify(list));
}

export function loadReviews(seed?: ReviewReport[]): ReviewReport[] {
  const current = readList<ReviewReport>(REVIEWS_KEY, []);
  const hasProjectId = current.length === 0 || current.every((r) => "projectId" in r);
  if (current.length > 0 && hasProjectId) return current;
  if (seed && seed.length > 0) {
    writeList(REVIEWS_KEY, seed);
    return seed;
  }
  return current;
}

export function saveReviews(reports: ReviewReport[]): void {
  writeList(REVIEWS_KEY, reports);
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

export function loadMaterialSets(seed?: MaterialSet[]): MaterialSet[] {
  const current = readList<MaterialSet>(MATERIAL_SETS_KEY, []);
  const hasProjectId = current.length === 0 || current.every((r) => "projectId" in r);
  if (current.length > 0 && hasProjectId) return current;
  if (seed && seed.length > 0) {
    writeList(MATERIAL_SETS_KEY, seed);
    return seed;
  }
  return current;
}

export function saveMaterialSets(sets: MaterialSet[]): void {
  writeList(MATERIAL_SETS_KEY, sets);
}

export function addMaterialSet(set: MaterialSet): void {
  const list = loadMaterialSets();
  list.unshift(set);
  saveMaterialSets(list);
}

export function loadTasks(seed?: AnalysisTask[]): AnalysisTask[] {
  const current = readList<AnalysisTask>(TASKS_KEY, []);
  const hasProjectId = current.length === 0 || current.every((r) => "projectId" in r);
  if (current.length > 0 && hasProjectId) return current;
  if (seed && seed.length > 0) {
    writeList(TASKS_KEY, seed);
    return seed;
  }
  return current;
}

export function saveTasks(tasks: AnalysisTask[]): void {
  writeList(TASKS_KEY, tasks);
}

export function addTask(task: AnalysisTask): void {
  const list = loadTasks();
  list.unshift(task);
  saveTasks(list);
}

export function loadProjects(seed?: ReviewProject[]): ReviewProject[] {
  const current = readList<ReviewProject>(PROJECTS_KEY, []);
  if (current.length > 0) return current;
  if (seed && seed.length > 0) {
    saveProjects(seed);
    return seed;
  }
  return current;
}

export function saveProjects(projects: ReviewProject[]): void {
  writeList(PROJECTS_KEY, projects);
}

export function getFixedProjectIds(): ProjectId[] {
  return FIXED_PROJECT_IDS;
}
