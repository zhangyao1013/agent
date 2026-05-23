import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { APP_LABELS, parseTags } from "../lib/labels";
import { addReview, resetMarqueeDismissed } from "../lib/storage";
import type { AppId, MediaAsset, ReviewReport } from "../types";

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function UploadPage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [tagsInput, setTagsInput] = useState("#激励Widget");
  const [conclusion, setConclusion] = useState("");
  const [body, setBody] = useState("");
  const [docLink, setDocLink] = useState("");
  const [competitor, setCompetitor] = useState<AppId>("pdd");
  const [author, setAuthor] = useState("");
  const [reportFile, setReportFile] = useState<File | null>(null);
  const [media, setMedia] = useState<MediaAsset[]>([]);
  const [submitting, setSubmitting] = useState(false);

  async function handleMediaFiles(files: FileList | null) {
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
    setMedia((prev) => [...prev, ...next]);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !conclusion.trim()) {
      alert("请填写报告标题和核心结论");
      return;
    }

    setSubmitting(true);
    try {
      let fileDataUrl: string | undefined;
      let fileName: string | undefined;
      if (reportFile) {
        fileDataUrl = await readFileAsDataUrl(reportFile);
        fileName = reportFile.name;
      }

      const report: ReviewReport = {
        id: `r-${Date.now()}`,
        title: title.trim(),
        tags: parseTags(tagsInput),
        conclusion: conclusion.trim(),
        body: body.trim(),
        docLink: docLink.trim() || undefined,
        fileName,
        fileDataUrl,
        media,
        competitor,
        publishedAt: new Date().toISOString(),
        author: author.trim() || undefined,
      };

      addReview(report);
      resetMarqueeDismissed();
      navigate("/?tab=reviews");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="app-shell upload-page">
      <p style={{ marginTop: 24 }}>
        <Link to="/?tab=reviews">← 返回竞品评测</Link>
      </p>
      <h1>上传评测报告</h1>
      <p style={{ color: "var(--slate-500)" }}>
        支持文档链接、本地报告文件，以及截图/录屏素材。发布后将在竞品评测 Tab 展示，并触发顶部滚动通知。
      </p>

      <form className="form-card" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">报告标题 *</label>
          <input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="例：拼多多 618 激励任务链路评测"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="competitor">对标竞品</label>
          <select
            id="competitor"
            value={competitor}
            onChange={(e) => setCompetitor(e.target.value as AppId)}
          >
            {Object.entries(APP_LABELS).map(([id, label]) => (
              <option key={id} value={id}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="tags">业务标签</label>
          <input
            id="tags"
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            placeholder="#激励Widget, #签到, #邀友"
          />
          <p className="form-hint">多个标签用逗号或空格分隔，自动补全 # 前缀</p>
        </div>

        <div className="form-group">
          <label htmlFor="conclusion">核心结论 *</label>
          <textarea
            id="conclusion"
            value={conclusion}
            onChange={(e) => setConclusion(e.target.value)}
            placeholder="3–5 条要点：激励入口、任务链路、提现/兑换规则、与己方差异…"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="body">详细内容</label>
          <textarea
            id="body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="评测过程、版本号、测试账号说明等"
          />
        </div>

        <div className="form-group">
          <label htmlFor="docLink">文档链接（飞书 / Notion / 内网文档）</label>
          <input
            id="docLink"
            type="url"
            value={docLink}
            onChange={(e) => setDocLink(e.target.value)}
            placeholder="https://..."
          />
        </div>

        <div className="form-group">
          <label>本地报告文件</label>
          <label className="file-label">
            选择 PDF / Word / Markdown 等
            <input
              type="file"
              accept=".pdf,.doc,.docx,.md,.txt,.ppt,.pptx"
              onChange={(e) => setReportFile(e.target.files?.[0] ?? null)}
            />
          </label>
          {reportFile && (
            <p className="form-hint">已选：{reportFile.name}</p>
          )}
        </div>

        <div className="form-group">
          <label>截图 / 录屏</label>
          <div className="media-upload-row">
            <label className="file-label">
              添加图片或视频
              <input
                type="file"
                accept="image/*,video/*"
                multiple
                onChange={(e) => void handleMediaFiles(e.target.files)}
              />
            </label>
          </div>
          {media.length > 0 && (
            <div className="media-grid" style={{ marginTop: 12 }}>
              {media.map((m) => (
                <div key={m.id} className="media-thumb">
                  {m.type === "video" ? (
                    <video src={m.url} muted playsInline />
                  ) : (
                    <img src={m.url} alt={m.name} />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="author">撰写人（可选）</label>
          <input
            id="author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="增长分析组"
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-primary" disabled={submitting}>
            {submitting ? "发布中…" : "确认发布"}
          </button>
          <Link to="/?tab=reviews" className="btn-secondary">
            取消
          </Link>
        </div>
      </form>

      <p className="disclaimer">
        报告与附件保存在浏览器本地（localStorage），适合内部分享原型。正式上线建议对接后端存储与权限。
      </p>
    </div>
  );
}
