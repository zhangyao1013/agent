import { Link } from "react-router-dom";
import { APP_COLORS, APP_LABELS, formatDate } from "../lib/labels";
import type {
  AnalysisTask,
  MaterialSet,
  ProjectId,
  ReviewProject,
  ReviewReport,
} from "../types";

type Props = {
  projects: ReviewProject[];
  activeProjectId: ProjectId | null;
  onSelectProject: (id: ProjectId) => void;
  reports: ReviewReport[];
  tasks: AnalysisTask[];
  materialSets: MaterialSet[];
  onOpenTasks: () => void;
};

export function ReviewsTab({
  projects,
  activeProjectId,
  onSelectProject,
  reports,
  tasks,
  materialSets,
  onOpenTasks,
}: Props) {
  const activeProject =
    projects.find((p) => p.id === activeProjectId) ?? null;

  const projectTasks = activeProject
    ? tasks.filter((t) => t.projectId === activeProject.id)
    : tasks;
  const projectReports = activeProject
    ? reports.filter((r) => r.projectId === activeProject.id)
    : reports;
  const projectMaterialSets = activeProject
    ? materialSets.filter((m) => m.projectId === activeProject.id)
    : materialSets;

  return (
    <section className="tab-panel">
      <div className="review-block">
        <div className="block-header">
          <div>
            <h2 className="block-title">评测项目</h2>
            <p className="block-subtitle">
              4 个固定项目，项目间账号隔离。点击选择项目后可查看该项目下的评测任务、物料集与报告结论。
            </p>
          </div>
          <button type="button" className="btn-primary" onClick={onOpenTasks}>
            进入评测任务 →
          </button>
        </div>

        <div className="projects-grid">
          {projects.map((p) => {
            const pTasks = tasks.filter((t) => t.projectId === p.id);
            const pReports = reports.filter((r) => r.projectId === p.id);
            const pMs = materialSets.filter((m) => m.projectId === p.id);
            const isActive = activeProjectId === p.id;
            return (
              <article
                key={p.id}
                className={`project-card ${isActive ? "active" : ""}`}
                onClick={() => onSelectProject(p.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onSelectProject(p.id);
                  }
                }}
              >
                <h4>{p.name}</h4>
                <p>{p.description}</p>
                <div className="project-stats">
                  <span>
                    <strong>{pTasks.length}</strong> 任务
                  </span>
                  <span>
                    <strong>{pMs.length}</strong> 物料集
                  </span>
                  <span>
                    <strong>{pReports.length}</strong> 报告
                  </span>
                </div>
                <p style={{ marginTop: 8, fontSize: "0.75rem" }}>
                  负责人：{p.owner}
                </p>
              </article>
            );
          })}
        </div>
      </div>

      <div className="review-block">
        <div className="block-header">
          <div>
            <h2 className="block-title">
              报告结论
              {activeProject && (
                <span style={{ fontWeight: 400, color: "var(--slate-500)" }}>
                  {" "}
                  · {activeProject.name}
                </span>
              )}
            </h2>
            <p className="block-subtitle">
              已沉淀 {projectReports.length} 份评测结论，点击来源链接跳转到原始报告。
            </p>
          </div>
          <Link to="/upload" className="btn-primary">
            + 上传评测报告
          </Link>
        </div>

        {projectReports.length === 0 ? (
          <div className="empty-state">
            <p>暂无评测报告</p>
            <Link to="/upload" className="btn-primary" style={{ marginTop: 12 }}>
              去上传
            </Link>
          </div>
        ) : (
          <div className="card-scroll">
            {projectReports.slice(0, 5).map((r) => (
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
                  <strong style={{ color: "var(--blue-800)" }}>
                    核心结论
                  </strong>
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
                          <video
                            src={m.url}
                            controls
                            muted
                            playsInline
                          />
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
      </div>
    </section>
  );
}
