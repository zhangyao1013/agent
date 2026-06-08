import { useCallback, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { NewsTab } from "../components/NewsTab";
import { ReviewsTab } from "../components/ReviewsTab";
import { SentimentTab } from "../components/SentimentTab";
import {
  SEED_MATERIAL_SETS,
  SEED_PROJECTS,
  SEED_REPORTS,
  SEED_TASKS,
} from "../data/seedNews";
import {
  loadMaterialSets,
  loadProjects,
  loadReviews,
  loadTasks,
} from "../lib/storage";
import type { ProjectId, TabId } from "../types";

const TABS: { id: TabId; label: string }[] = [
  { id: "info", label: "信息资讯" },
  { id: "reviews", label: "竞品评测" },
  { id: "sentiment", label: "外部舆情" },
];

export function HomePage() {
  const [params, setParams] = useSearchParams();
  const tabParam = params.get("tab") as TabId | null;
  const activeTab: TabId =
    tabParam && TABS.some((t) => t.id === tabParam) ? tabParam : "info";

  const navigate = useNavigate();

  const [projects, setProjects] = useState(() => loadProjects(SEED_PROJECTS));
  const [reports, setReports] = useState(() => loadReviews(SEED_REPORTS));
  const [tasks, setTasks] = useState(() => loadTasks(SEED_TASKS));
  const [materialSets, setMaterialSets] = useState(() =>
    loadMaterialSets(SEED_MATERIAL_SETS),
  );

  const defaultProjectId: ProjectId = projects[0]?.id ?? "pdd-incentive";
  const [activeProjectId, setActiveProjectId] =
    useState<ProjectId>(defaultProjectId);

  const refreshAll = useCallback(() => {
    const nextProjects = loadProjects(SEED_PROJECTS);
    const nextReports = loadReviews(SEED_REPORTS);
    const nextTasks = loadTasks(SEED_TASKS);
    const nextMaterialSets = loadMaterialSets(SEED_MATERIAL_SETS);
    setProjects(nextProjects);
    setReports(nextReports);
    setTasks(nextTasks);
    setMaterialSets(nextMaterialSets);
  }, []);

  useEffect(() => {
    refreshAll();
  }, [tabParam, refreshAll]);

  useEffect(() => {
    const onStorage = () => refreshAll();
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [refreshAll]);

  function setTab(id: TabId) {
    setParams({ tab: id });
  }

  return (
    <div className="app-shell">
      <header className="site-header">
        <h1>UG抖音增长 · 竞品情报台</h1>
        <p>
          面向抖音增长业务的「信息资讯 / 竞品评测 / 外部舆情」一体化看板。
        </p>
      </header>

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
          </button>
        ))}
      </nav>

      {activeTab === "info" && <NewsTab />}
      {activeTab === "reviews" && (
        <ReviewsTab
          projects={projects}
          activeProjectId={activeProjectId}
          onSelectProject={(id) => setActiveProjectId(id)}
          reports={reports}
          tasks={tasks}
          materialSets={materialSets}
          onOpenTasks={() =>
            navigate(`/tasks?project=${activeProjectId}`)
          }
        />
      )}
      {activeTab === "sentiment" && <SentimentTab />}
    </div>
  );
}
