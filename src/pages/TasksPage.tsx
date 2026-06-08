import { useCallback, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  SEED_MATERIAL_SETS,
  SEED_PROJECTS,
  SEED_TASKS,
} from "../data/seedNews";
import { APP_COLORS, APP_LABELS, formatDate } from "../lib/labels";
import {
  addMaterialSet,
  addTask,
  loadMaterialSets,
  loadProjects,
  loadTasks,
  saveMaterialSets,
} from "../lib/storage";
import type {
  AnalysisTask,
  MaterialSet,
  MediaAsset,
  ProjectId,
  ReviewProject,
} from "../types";

type Section = "tasks" | "materials";

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function TasksPage() {
  const [params] = useSearchParams();
  const projectIds = (SEED_PROJECTS as ReviewProject[]).map((p) => p.id);
  const initialProject = (params.get("project") as ProjectId | null) &&
    projectIds.includes(params.get("project") as ProjectId)
    ? (params.get("project") as ProjectId)
    : projectIds[0];

  const [projects] = useState<ReviewProject[]>(() =>
    loadProjects(SEED_PROJECTS as ReviewProject[]),
  );
  const [materialSets, setMaterialSets] = useState<MaterialSet[]>(() =>
    loadMaterialSets(SEED_MATERIAL_SETS),
  );
  const [tasks, setTasks] = useState<AnalysisTask[]>(() =>
    loadTasks(SEED_TASKS),
  );

  const [activeProjectId, setActiveProjectId] =
    useState<ProjectId>(initialProject);
  const [section, setSection] = useState<Section>("tasks");
  const [showMaterialForm, setShowMaterialForm] = useState(false);
  const [showTaskForm, setShowTaskForm] = useState(false);

  const refreshMaterials = useCallback(
    () => setMaterialSets(loadMaterialSets(SEED_MATERIAL_SETS)),
    [],
  );
  const refreshTasks = useCallback(
    () => setTasks(loadTasks(SEED_TASKS)),
    [],
  );

  const activeProject =
    projects.find((p) => p.id === activeProjectId) ?? projects[0];

  const projectTasks = useMemo(
    () =>
      tasks
        .filter((t) => t.projectId === activeProjectId)
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        ),
    [tasks, activeProjectId],
  );

  const projectMaterialSets = useMemo(
    () =>
      materialSets
        .filter((m) => m.projectId === activeProjectId)
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        ),
    [materialSets, activeProjectId],
  );

  return (
    <div className="app-shell upload-page" style={{ maxWidth: 960 }}>
      <p style={{ marginTop: 24 }}>
        <Link to="/?tab=reviews">← 返回竞品评测</Link>
      </p>
      <h1>评测任务</h1>
      <p style={{ color: "var(--slate-500)" }}>
        先选择项目（4 个固定项目，账号隔离），然后在项目下管理任务与物料集。
      </p>

      <div className="review-block">
        <div className="block-header">
          <div>
            <h2 className="block-title">评测项目</h2>
            <p className="block-subtitle">
              当前项目：{activeProject?.name} · 负责人：{activeProject?.owner}
            </p>
          </div>
        </div>
        <div className="projects-grid">
          {projects.map((p) => {
            const isActive = activeProjectId === p.id;
            const pTasks = tasks.filter((t) => t.projectId === p.id);
            const pMs = materialSets.filter((m) => m.projectId === p.id);
            return (
              <article
                key={p.id}
                className={`project-card ${isActive ? "active" : ""}`}
                onClick={() => setActiveProjectId(p.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setActiveProjectId(p.id);
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
                </div>
                <p style={{ marginTop: 8, fontSize: "0.75rem" }}>
                  负责人：{p.owner}
                </p>
              </article>
            );
          })}
        </div>
      </div>

      <div className="sub-nav">
        <button
          type="button"
          className={`sub-tab ${section === "tasks" ? "active" : ""}`}
          onClick={() => setSection("tasks")}
        >
          分析任务（{projectTasks.length}）
        </button>
        <button
          type="button"
          className={`sub-tab ${section === "materials" ? "active" : ""}`}
          onClick={() => setSection("materials")}
        >
          物料集（{projectMaterialSets.length}）
        </button>
      </div>

      {section === "tasks" && (
        <TasksSection
          project={activeProject}
          tasks={projectTasks}
          materialSets={projectMaterialSets}
          showForm={showTaskForm}
          toggleForm={() => setShowTaskForm((v) => !v)}
          onCreated={(t) => {
            addTask(t);
            refreshTasks();
            setShowTaskForm(false);
          }}
        />
      )}

      {section === "materials" && (
        <MaterialsSection
          project={activeProject}
          materialSets={projectMaterialSets}
          showForm={showMaterialForm}
          toggleForm={() => setShowMaterialForm((v) => !v)}
          onCreated={(ms) => {
            addMaterialSet(ms);
            refreshMaterials();
            setShowMaterialForm(false);
          }}
          onUpdated={(list) => {
            // 合并回全局 materialSets（只更新当前项目下的记录）
            const others = materialSets.filter(
              (m) => m.projectId !== activeProjectId,
            );
            const merged = [...list, ...others];
            saveMaterialSets(merged);
            setMaterialSets(merged);
          }}
        />
      )}
    </div>
  );
}

function TasksSection({
  project,
  tasks,
  materialSets,
  showForm,
  toggleForm,
  onCreated,
}: {
  project: ReviewProject;
  tasks: AnalysisTask[];
  materialSets: MaterialSet[];
  showForm: boolean;
  toggleForm: () => void;
  onCreated: (task: AnalysisTask) => void;
}) {
  return (
    <div className="review-block">
      <div className="block-header">
        <div>
          <h2 className="block-title">分析任务 · {project.name}</h2>
          <p className="block-subtitle">
            在此项目下创建分析任务，关联该项目下的物料集。
          </p>
        </div>
        <button
          type="button"
          className="btn-primary"
          onClick={toggleForm}
        >
          {showForm ? "收起" : "+ 创建分析任务"}
        </button>
      </div>

      {showForm && (
        <TaskForm
          project={project}
          materialSets={materialSets}
          onSubmit={(t) => onCreated(t)}
          onCancel={toggleForm}
        />
      )}

      {tasks.length === 0 ? (
        <div className="empty-state">
          <p>暂无分析任务</p>
        </div>
      ) : (
        <div className="card-grid">
          {tasks.map((t) => {
            const ms = materialSets.find((m) => m.id === t.materialSetId);
            return (
              <article key={t.id} className="review-card">
                <div className="card-meta">
                  <span
                    className="app-tag"
                    style={{ background: APP_COLORS[t.competitor] }}
                  >
                    {APP_LABELS[t.competitor]}
                  </span>
                  <span
                    className="tag"
                    style={{
                      background:
                        t.status === "已完成"
                          ? "#e6f6ec"
                          : t.status === "进行中"
                          ? "#fff4e6"
                          : "#eef2ff",
                      color:
                        t.status === "已完成"
                          ? "#1b8a4a"
                          : t.status === "进行中"
                          ? "#c2410c"
                          : "#3730a3",
                    }}
                  >
                    {t.status}
                  </span>
                  <span>{formatDate(t.createdAt)}</span>
                  {t.assignee && <span>{t.assignee}</span>}
                </div>
                <h3>{t.title}</h3>
                {t.focus && <p>{t.focus}</p>}
                {ms && (
                  <p
                    style={{
                      fontSize: "0.85rem",
                      color: "var(--slate-500)",
                    }}
                  >
                    关联物料集：{ms.name}（{ms.assets.length} 个素材）
                  </p>
                )}
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}

function TaskForm({
  project,
  materialSets,
  onSubmit,
  onCancel,
}: {
  project: ReviewProject;
  materialSets: MaterialSet[];
  onSubmit: (task: AnalysisTask) => void;
  onCancel: () => void;
}) {
  const [title, setTitle] = useState("");
  const [competitor, setCompetitor] = useState(project.primaryCompetitor);
  const [status, setStatus] = useState<AnalysisTask["status"]>("待分析");
  const [materialSetId, setMaterialSetId] = useState<string>("");
  const [focus, setFocus] = useState("");
  const [assignee, setAssignee] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    onSubmit({
      id: `t-${Date.now()}`,
      projectId: project.id,
      title: title.trim(),
      competitor,
      status,
      materialSetId: materialSetId || undefined,
      focus: focus.trim() || undefined,
      assignee: assignee.trim() || undefined,
      createdAt: new Date().toISOString(),
    });
  }

  return (
    <form className="form-card" onSubmit={submit}>
      <div className="form-group">
        <label htmlFor="task-title">任务标题 *</label>
        <input
          id="task-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="例：拼多多 618 激励任务链路分析"
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="task-competitor">对标竞品</label>
        <select
          id="task-competitor"
          value={competitor}
          onChange={(e) => setCompetitor(e.target.value as typeof competitor)}
        >
          {Object.entries(APP_LABELS).map(([id, label]) => (
            <option key={id} value={id}>
              {label}
            </option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label htmlFor="task-status">任务状态</label>
        <select
          id="task-status"
          value={status}
          onChange={(e) =>
            setStatus(e.target.value as AnalysisTask["status"])
          }
        >
          <option value="待分析">待分析</option>
          <option value="进行中">进行中</option>
          <option value="已完成">已完成</option>
        </select>
      </div>
      <div className="form-group">
        <label htmlFor="task-material">关联物料集（仅当前项目）</label>
        <select
          id="task-material"
          value={materialSetId}
          onChange={(e) => setMaterialSetId(e.target.value)}
        >
          <option value="">暂不关联</option>
          {materialSets.map((m) => (
            <option key={m.id} value={m.id}>
              {m.name}（{m.assets.length} 素材）
            </option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label htmlFor="task-focus">关注焦点</label>
        <textarea
          id="task-focus"
          value={focus}
          onChange={(e) => setFocus(e.target.value)}
          placeholder="例：任务入口 + 金币兑换上限"
        />
      </div>
      <div className="form-group">
        <label htmlFor="task-assignee">负责人</label>
        <input
          id="task-assignee"
          value={assignee}
          onChange={(e) => setAssignee(e.target.value)}
          placeholder="例：张三"
        />
      </div>

      <div className="form-actions">
        <button type="submit" className="btn-primary">
          创建任务
        </button>
        <button
          type="button"
          className="btn-secondary"
          onClick={onCancel}
        >
          取消
        </button>
      </div>
    </form>
  );
}

function MaterialsSection({
  project,
  materialSets,
  showForm,
  toggleForm,
  onCreated,
  onUpdated,
}: {
  project: ReviewProject;
  materialSets: MaterialSet[];
  showForm: boolean;
  toggleForm: () => void;
  onCreated: (ms: MaterialSet) => void;
  onUpdated: (list: MaterialSet[]) => void;
}) {
  return (
    <div className="review-block">
      <div className="block-header">
        <div>
          <h2 className="block-title">物料集 · {project.name}</h2>
          <p className="block-subtitle">
            截图 / 录屏等素材按物料集分组管理，在创建任务时可选用此项目下的物料集。
          </p>
        </div>
        <button
          type="button"
          className="btn-primary"
          onClick={toggleForm}
        >
          {showForm ? "收起" : "+ 新建物料集"}
        </button>
      </div>

      {showForm && (
        <MaterialForm
          project={project}
          onSubmit={(ms) => onCreated(ms)}
          onCancel={toggleForm}
        />
      )}

      {materialSets.length === 0 ? (
        <div className="empty-state">
          <p>暂无物料集</p>
        </div>
      ) : (
        <div className="card-grid">
          {materialSets.map((ms) => (
            <MaterialSetCard
              key={ms.id}
              materialSet={ms}
              onAssetsChange={(assets) => {
                const next = materialSets.map((m) =>
                  m.id === ms.id ? { ...m, assets } : m,
                );
                onUpdated(next);
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function MaterialForm({
  project,
  onSubmit,
  onCancel,
}: {
  project: ReviewProject;
  onSubmit: (ms: MaterialSet) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [assets, setAssets] = useState<MediaAsset[]>([]);

  async function handleFiles(files: FileList | null) {
    if (!files) return;
    const next: MediaAsset[] = [];
    for (const file of Array.from(files)) {
      const url = await readFileAsDataUrl(file);
      const type = file.type.startsWith("video/") ? "video" : "image";
      next.push({
        id: `m-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        type,
        name: file.name,
        url,
      });
    }
    setAssets((prev) => [...prev, ...next]);
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    onSubmit({
      id: `ms-${Date.now()}`,
      projectId: project.id,
      name: name.trim(),
      description: description.trim() || undefined,
      assets,
      createdAt: new Date().toISOString(),
    });
  }

  return (
    <form className="form-card" onSubmit={submit}>
      <div className="form-group">
        <label htmlFor="ms-name">物料集名称 *</label>
        <input
          id="ms-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={`例：${project.name} 关键页截图合集`}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="ms-desc">描述</label>
        <textarea
          id="ms-desc"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="覆盖首页入口 / 任务列表 / 金币兑换页等关键页面"
        />
      </div>
      <div className="form-group">
        <label>上传截图或录屏</label>
        <div className="media-upload-row">
          <label className="file-label">
            选择图片或视频
            <input
              type="file"
              accept="image/*,video/*"
              multiple
              onChange={(e) => {
                handleFiles(e.target.files);
              }}
            />
          </label>
        </div>
        {assets.length > 0 && (
          <div className="media-grid" style={{ marginTop: 12 }}>
            {assets.map((m) => (
              <div key={m.id} className="media-thumb">
                {m.type === "video" ? (
                  <video src={m.url} muted playsInline controls />
                ) : (
                  <img src={m.url} alt={m.name} />
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="form-actions">
        <button type="submit" className="btn-primary">
          创建物料集
        </button>
        <button
          type="button"
          className="btn-secondary"
          onClick={onCancel}
        >
          取消
        </button>
      </div>
    </form>
  );
}

function MaterialSetCard({
  materialSet,
  onAssetsChange,
}: {
  materialSet: MaterialSet;
  onAssetsChange: (assets: MediaAsset[]) => void;
}) {
  async function handleFiles(files: FileList | null) {
    if (!files) return;
    const next: MediaAsset[] = [];
    for (const file of Array.from(files)) {
      const url = await readFileAsDataUrl(file);
      const type = file.type.startsWith("video/") ? "video" : "image";
      next.push({
        id: `m-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        type,
        name: file.name,
        url,
      });
    }
    onAssetsChange([...materialSet.assets, ...next]);
  }

  return (
    <article className="review-card">
      <div className="card-meta">
        <span className="pill pill-blue">物料集</span>
        <span>{formatDate(materialSet.createdAt)}</span>
        <span>{materialSet.assets.length} 个素材</span>
      </div>
      <h3>{materialSet.name}</h3>
      {materialSet.description && <p>{materialSet.description}</p>}

      {materialSet.assets.length > 0 && (
        <div className="media-grid">
          {materialSet.assets.map((m) => (
            <div key={m.id} className="media-thumb">
              {m.type === "video" ? (
                <video src={m.url} muted playsInline controls />
              ) : (
                <img src={m.url} alt={m.name} />
              )}
            </div>
          ))}
        </div>
      )}

      <div className="media-upload-row" style={{ marginTop: 12 }}>
        <label className="file-label">
          追加素材
          <input
            type="file"
            accept="image/*,video/*"
            multiple
            onChange={(e) => {
              handleFiles(e.target.files);
            }}
          />
        </label>
      </div>
    </article>
  );
}
