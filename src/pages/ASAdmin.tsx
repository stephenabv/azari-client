import { useEffect, useRef, useState } from "react";
import {
  adminGetStats,
  adminGetAllContent,
  adminUpsertContent,
  adminResetContent,
  adminGetTalkInquiries,
  adminGetQuotations,
  adminUpdateTalkStatus,
  adminUpdateQuotationStatus,
  adminRetryTalkEmail,
  adminRetryQuotationEmail,
  adminGetProjects,
  adminCreateProject,
  adminUpdateProject,
  adminDeleteProject,
  adminDeleteTalkInquiry,
  adminUpdateTalkInquiry,
  adminDeleteQuotation,
  adminUpdateQuotation,
  adminGetPackages,
  adminCreatePackage,
  adminUpdatePackage,
  adminDeletePackage,
  type ApiProject,
  type ProjectInput,
  type ProjectCategory as ApiProjectCategory,
  type ApiSolarPackage,
  type PackageInput,
} from "../services/ASContent";
import { SOLAR_PACKAGES } from "../models/packages";

type Tab = "overview" | "inquiries" | "quotations" | "projects" | "packages" | "sections" | "content" | "footer";

type SectionVisibility = {
  hero: boolean;
  metrics: boolean;
  benefits: boolean;
  excellence: boolean;
  tropics: boolean;
  process: boolean;
  clientJourney: boolean;
  calculator: boolean;
  callToAction: boolean;
};

const DEFAULT_VISIBILITY: SectionVisibility = {
  hero: true,
  metrics: true,
  benefits: true,
  excellence: true,
  tropics: true,
  process: true,
  clientJourney: true,
  calculator: true,
  callToAction: true,
};

interface Stats {
  totals: { talkInquiries: number; quotations: number };
  talkInquiries: { byStatus: Record<string, number> };
  quotations: { byStatus: Record<string, number> };
  recent: {
    talkInquiries: Array<{ id: string; name: string; email: string; inquiryType: string; status: string; createdAt: string }>;
    quotations: Array<{ id: string; fullName: string; email: string; estimatedSystemSizeDisplayText: string; status: string; createdAt: string }>;
  };
}

interface ContentItem {
  key: string;
  data: unknown;
  isCustomized: boolean;
  updatedAt: string | null;
}

type SubmissionStatus = "received" | "emailed" | "email_failed" | "archived";

function fmt(iso: string) {
  return new Date(iso).toLocaleDateString("en-PH", { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}

function statusClass(s: string) {
  if (s === "emailed") return "is-emailed";
  if (s === "email_failed") return "is-failed";
  if (s === "archived") return "is-archived";
  return "is-received";
}

function Toast({ msg }: { msg: string }) {
  if (!msg) return null;
  const cls = msg.startsWith("Error") ? "is-error" : "is-success";
  return <div className={`ad-toast ${cls}`}>{msg}</div>;
}

function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`ad-badge ${statusClass(status)}`}>
      {status.replace(/_/g, " ")}
    </span>
  );
}

function LoginScreen({ onLogin, error }: { onLogin: (key: string) => void; error: string }) {
  const [value, setValue] = useState("");
  const [localError, setLocalError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed) { setLocalError("API key is required."); return; }
    onLogin(trimmed);
  };

  const displayError = localError || error;

  return (
    <div className="ad-login-wrap">
      <div className="ad-login-card">
        <div className="ad-login-logo">azari<span>.solar</span></div>
        <div className="ad-login-sub">Admin Panel</div>
        {displayError && <div className="ad-login-error">{displayError}</div>}
        <form onSubmit={handleSubmit}>
          <label className="ad-label">Admin API Key</label>
          <input
            type="password"
            className="ad-input"
            value={value}
            onChange={(e) => { setValue(e.target.value); setLocalError(""); }}
            placeholder="Enter your admin API key"
            style={{ marginBottom: 20 }}
          />
          <button type="submit" className="ad-btn" style={{ width: "100%" }}>
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}

function OverviewTab({ stats }: { stats: Stats | null }) {
  if (!stats) return <div style={{ color: "var(--ad-text2)", padding: 24 }}>Loading stats…</div>;

  const talkCounts = stats.talkInquiries.byStatus;
  const quotCounts = stats.quotations.byStatus;

  return (
    <div>
      <div className="ad-stats-grid">
        {[
          { label: "Total Inquiries", value: stats.totals.talkInquiries, cls: "is-accent" },
          { label: "Total Quotations", value: stats.totals.quotations, cls: "" },
          { label: "Email Failures (Talk)", value: talkCounts.email_failed ?? 0, cls: "is-danger" },
          { label: "Email Failures (Quot.)", value: quotCounts.email_failed ?? 0, cls: "is-danger" },
        ].map((card) => (
          <div key={card.label} className="ad-stat-card">
            <div className="ad-stat-label">{card.label}</div>
            <div className={`ad-stat-value ${card.cls}`}>{card.value}</div>
          </div>
        ))}
      </div>

      <div className="ad-recent-grid">
        <div className="ad-card">
          <div className="ad-card-title">Recent Inquiries</div>
          {stats.recent.talkInquiries.map((r) => (
            <div key={r.id} className="ad-recent-row">
              <div className="ad-recent-name">{r.name}</div>
              <div className="ad-recent-meta">{r.email} · {r.inquiryType}</div>
              <div className="ad-recent-footer">
                <span className="ad-recent-date">{fmt(r.createdAt)}</span>
                <StatusBadge status={r.status} />
              </div>
            </div>
          ))}
        </div>
        <div className="ad-card">
          <div className="ad-card-title">Recent Quotations</div>
          {stats.recent.quotations.map((r) => (
            <div key={r.id} className="ad-recent-row">
              <div className="ad-recent-name">{r.fullName}</div>
              <div className="ad-recent-meta">{r.email} · {r.estimatedSystemSizeDisplayText}</div>
              <div className="ad-recent-footer">
                <span className="ad-recent-date">{fmt(r.createdAt)}</span>
                <StatusBadge status={r.status} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function EmailStatusIndicator({ status, id, onRetry, retrying }: { status: string; id: string; onRetry: (id: string) => void; retrying: boolean }) {
  if (status === "emailed") return <div className="ad-email-status is-sent">✓ Email sent</div>;
  if (status === "email_failed") return (
    <div className="ad-email-status is-failed" style={{ display: "flex", alignItems: "center", gap: 6 }}>
      ✗ Email failed
      <button onClick={() => onRetry(id)} disabled={retrying} className="ad-btn ad-btn--sm ad-btn--secondary">
        {retrying ? "…" : "Retry"}
      </button>
    </div>
  );
  if (status === "received") return <div className="ad-email-status is-pending">Pending email</div>;
  return null;
}

function SubmissionsTable({ apiKey, type }: { apiKey: string; type: "talk" | "quotations" }) {
  const [data, setData] = useState<unknown[]>([]);
  const [total, setTotal] = useState(0);
  const [offset, setOffset] = useState(0);
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState<string | null>(null);
  const [retrying, setRetrying] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [editingRow, setEditingRow] = useState<Record<string, unknown> | null>(null);
  const [editForm, setEditForm] = useState<Record<string, string>>({});
  const [editSaving, setEditSaving] = useState(false);
  const [editMsg, setEditMsg] = useState("");
  const limit = 20;

  const load = async () => {
    setLoading(true);
    try {
      const fn = type === "talk" ? adminGetTalkInquiries : adminGetQuotations;
      const res = await fn(apiKey, { limit, offset, status: statusFilter || undefined }) as { data: unknown[]; total: number };
      setData(res.data);
      setTotal(res.total);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void load(); }, [offset, statusFilter]);

  const handleStatusChange = async (id: string, status: string) => {
    setUpdating(id);
    try {
      const fn = type === "talk" ? adminUpdateTalkStatus : adminUpdateQuotationStatus;
      await fn(apiKey, id, status);
      await load();
    } finally { setUpdating(null); }
  };

  const handleRetryEmail = async (id: string) => {
    setRetrying(id);
    try {
      const fn = type === "talk" ? adminRetryTalkEmail : adminRetryQuotationEmail;
      await fn(apiKey, id);
      await load();
    } finally { setRetrying(null); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this record permanently? This cannot be undone.")) return;
    setDeleting(id);
    try {
      const fn = type === "talk" ? adminDeleteTalkInquiry : adminDeleteQuotation;
      await fn(apiKey, id);
      await load();
    } catch (e) {
      alert(`Delete failed: ${(e as Error).message}`);
    } finally { setDeleting(null); }
  };

  const openEdit = (row: Record<string, unknown>) => {
    setEditingRow(row);
    setEditMsg("");
    if (type === "talk") {
      setEditForm({
        name: String(row.name ?? ""), email: String(row.email ?? ""),
        phone: String(row.phone ?? ""), province: String(row.province ?? ""),
        city: String(row.city ?? ""), inquiryType: String(row.inquiryType ?? "general"),
        message: String(row.message ?? ""),
      });
    } else {
      setEditForm({
        fullName: String(row.fullName ?? ""), email: String(row.email ?? ""),
        phone: String(row.phone ?? ""), location: String(row.location ?? ""),
        propertyClassification: String(row.propertyClassification ?? ""),
        message: String(row.message ?? ""),
      });
    }
  };

  const handleEditSave = async () => {
    if (!editingRow) return;
    setEditSaving(true);
    setEditMsg("");
    try {
      const fn = type === "talk" ? adminUpdateTalkInquiry : adminUpdateQuotation;
      await fn(apiKey, editingRow.id as string, editForm);
      setEditingRow(null);
      await load();
    } catch (e) {
      setEditMsg(`Error: ${(e as Error).message}`);
    } finally { setEditSaving(false); }
  };

  const STATUS_OPTIONS: SubmissionStatus[] = ["received", "emailed", "email_failed", "archived"];

  return (
    <div>
      <div className="ad-filter-bar">
        <select
          className="ad-select"
          style={{ width: "auto" }}
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setOffset(0); }}
        >
          <option value="">All Statuses</option>
          {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s.replace(/_/g, " ")}</option>)}
        </select>
        <span className="ad-filter-count">{total} records</span>
      </div>

      {editingRow && (
        <div className="ad-edit-panel">
          <div className="ad-edit-panel-header">
            <div className="ad-edit-panel-title">Edit {type === "talk" ? "Inquiry" : "Quotation Request"}</div>
            <button onClick={() => { setEditingRow(null); setEditMsg(""); }} className="ad-btn ad-btn--ghost ad-btn--sm">Cancel</button>
          </div>

          <div className="ad-form-grid">
            {type === "talk" ? (
              <>
                <div><label className="ad-label">Name</label><input className="ad-input" value={editForm.name ?? ""} onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))} /></div>
                <div><label className="ad-label">Email</label><input className="ad-input" value={editForm.email ?? ""} onChange={(e) => setEditForm((f) => ({ ...f, email: e.target.value }))} /></div>
                <div><label className="ad-label">Phone</label><input className="ad-input" value={editForm.phone ?? ""} onChange={(e) => setEditForm((f) => ({ ...f, phone: e.target.value }))} /></div>
                <div>
                  <label className="ad-label">Inquiry Type</label>
                  <select className="ad-select" value={editForm.inquiryType ?? "general"} onChange={(e) => setEditForm((f) => ({ ...f, inquiryType: e.target.value }))}>
                    <option value="general">General</option>
                    <option value="quote">Quote</option>
                    <option value="consultation">Consultation</option>
                  </select>
                </div>
                <div><label className="ad-label">Province</label><input className="ad-input" value={editForm.province ?? ""} onChange={(e) => setEditForm((f) => ({ ...f, province: e.target.value }))} /></div>
                <div><label className="ad-label">City</label><input className="ad-input" value={editForm.city ?? ""} onChange={(e) => setEditForm((f) => ({ ...f, city: e.target.value }))} /></div>
                <div className="ad-form-full"><label className="ad-label">Message</label><textarea className="ad-textarea" value={editForm.message ?? ""} onChange={(e) => setEditForm((f) => ({ ...f, message: e.target.value }))} /></div>
              </>
            ) : (
              <>
                <div><label className="ad-label">Full Name</label><input className="ad-input" value={editForm.fullName ?? ""} onChange={(e) => setEditForm((f) => ({ ...f, fullName: e.target.value }))} /></div>
                <div><label className="ad-label">Email</label><input className="ad-input" value={editForm.email ?? ""} onChange={(e) => setEditForm((f) => ({ ...f, email: e.target.value }))} /></div>
                <div><label className="ad-label">Phone</label><input className="ad-input" value={editForm.phone ?? ""} onChange={(e) => setEditForm((f) => ({ ...f, phone: e.target.value }))} /></div>
                <div><label className="ad-label">Location</label><input className="ad-input" value={editForm.location ?? ""} onChange={(e) => setEditForm((f) => ({ ...f, location: e.target.value }))} /></div>
                <div className="ad-form-full"><label className="ad-label">Property Classification</label><input className="ad-input" value={editForm.propertyClassification ?? ""} onChange={(e) => setEditForm((f) => ({ ...f, propertyClassification: e.target.value }))} /></div>
                <div className="ad-form-full"><label className="ad-label">Message</label><textarea className="ad-textarea" value={editForm.message ?? ""} onChange={(e) => setEditForm((f) => ({ ...f, message: e.target.value }))} /></div>
              </>
            )}
          </div>

          <div className="ad-form-actions">
            <button onClick={() => void handleEditSave()} disabled={editSaving} className="ad-btn">
              {editSaving ? "Saving…" : "Save Changes"}
            </button>
            <Toast msg={editMsg} />
          </div>
        </div>
      )}

      {loading ? (
        <div style={{ color: "var(--ad-text2)", padding: 24 }}>Loading…</div>
      ) : (
        <div className="ad-table-wrap">
          <table className="ad-table">
            <thead>
              <tr>
                {type === "talk" ? (
                  <><th>Name</th><th>Email</th><th>Phone</th><th>Location</th><th>Type</th></>
                ) : (
                  <><th>Name</th><th>Email</th><th>System Size</th><th>Monthly Bill</th><th>Property</th></>
                )}
                <th>Date</th>
                <th>Status / Email</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {(data as Array<Record<string, unknown>>).map((row) => (
                <tr key={row.id as string}>
                  {type === "talk" ? (
                    <><td>{row.name as string}</td><td>{row.email as string}</td><td>{row.phone as string}</td>
                    <td>{row.city as string}, {row.province as string}</td><td>{row.inquiryType as string}</td></>
                  ) : (
                    <><td>{row.fullName as string}</td><td>{row.email as string}</td>
                    <td>{row.estimatedSystemSizeDisplayText as string}</td>
                    <td>₱{Number(row.averageMonthlyBillPhp).toLocaleString()}</td>
                    <td>{row.propertyClassification as string}</td></>
                  )}
                  <td>{fmt(row.createdAt as string)}</td>
                  <td>
                    <select
                      className="ad-status-select"
                      value={row.status as string}
                      disabled={updating === row.id || retrying === row.id}
                      onChange={(e) => void handleStatusChange(row.id as string, e.target.value)}
                    >
                      {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s.replace(/_/g, " ")}</option>)}
                    </select>
                    <EmailStatusIndicator
                      status={row.status as string}
                      id={row.id as string}
                      onRetry={(id) => void handleRetryEmail(id)}
                      retrying={retrying === row.id}
                    />
                  </td>
                  <td>
                    <div className="ad-table-actions">
                      <button onClick={() => openEdit(row)} disabled={!!editingRow || deleting === (row.id as string)} className="ad-btn ad-btn--ghost ad-btn--sm">Edit</button>
                      <button
                        onClick={() => void handleDelete(row.id as string)}
                        disabled={deleting === (row.id as string) || !!editingRow}
                        className="ad-btn ad-btn--danger ad-btn--sm"
                        style={{ opacity: deleting === (row.id as string) ? 0.5 : 1 }}
                      >
                        {deleting === (row.id as string) ? "…" : "Delete"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="ad-pagination">
        <button onClick={() => setOffset(Math.max(0, offset - limit))} disabled={offset === 0} className="ad-btn ad-btn--ghost ad-btn--sm">← Prev</button>
        <span className="ad-pagination-info">{Math.floor(offset / limit) + 1} / {Math.max(1, Math.ceil(total / limit))}</span>
        <button onClick={() => setOffset(offset + limit)} disabled={offset + limit >= total} className="ad-btn ad-btn--ghost ad-btn--sm">Next →</button>
      </div>
    </div>
  );
}

interface MetricItem { value: string; label: string; order: number }

function MetricsEditorForm({ editorText, onChange }: { editorText: string; onChange: (text: string) => void }) {
  let items: MetricItem[] = [];
  try { items = (JSON.parse(editorText) as { items: MetricItem[] }).items ?? []; } catch { }

  const update = (idx: number, key: "value" | "label", val: string) => {
    const next = items.map((item, i) => i === idx ? { ...item, [key]: val } : item);
    onChange(JSON.stringify({ items: next }, null, 2));
  };

  return (
    <div>
      <div style={{ fontSize: 12, color: "var(--ad-text2)", marginBottom: 16 }}>
        Edit each metric's displayed value and label.
      </div>
      {items.map((item, i) => (
        <div key={i} className="ad-metrics-row">
          <div>
            {i === 0 && <div className="ad-label">Value</div>}
            <input className="ad-input" style={{ textAlign: "center", fontWeight: 700 }} value={item.value} onChange={(e) => update(i, "value", e.target.value)} placeholder="e.g. 25yr" />
          </div>
          <div>
            {i === 0 && <div className="ad-label">Label</div>}
            <input className="ad-input" value={item.label} onChange={(e) => update(i, "label", e.target.value)} placeholder="e.g. PERFORMANCE WARRANTY" />
          </div>
        </div>
      ))}
    </div>
  );
}

function ContentEditor({ apiKey }: { apiKey: string }) {
  const [items, setItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);
  const [editorText, setEditorText] = useState("");
  const [jsonError, setJsonError] = useState("");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await adminGetAllContent(apiKey);
      setItems(res.data.filter((i) => i.key !== "section-visibility"));
    } finally { setLoading(false); }
  };

  useEffect(() => { void load(); }, []);

  const startEdit = (item: ContentItem) => {
    setEditing(item.key);
    setEditorText(JSON.stringify(item.data, null, 2));
    setJsonError("");
    setMsg("");
    setTimeout(() => textareaRef.current?.focus(), 50);
  };

  const validateJson = (text: string) => {
    try { JSON.parse(text); setJsonError(""); return true; }
    catch (e) { setJsonError((e as Error).message); return false; }
  };

  const handleSave = async () => {
    if (!editing) return;
    if (!validateJson(editorText)) return;
    setSaving(true);
    try {
      await adminUpsertContent(apiKey, editing, JSON.parse(editorText) as unknown);
      setMsg("✓ Saved successfully");
      await load();
    } catch (e) {
      setMsg(`Error: ${(e as Error).message}`);
    } finally { setSaving(false); }
  };

  const handleReset = async (key: string) => {
    if (!confirm(`Reset "${key}" to default content? This cannot be undone.`)) return;
    try {
      await adminResetContent(apiKey, key);
      setMsg(`✓ "${key}" reset to default`);
      if (editing === key) setEditing(null);
      await load();
    } catch (e) {
      setMsg(`Error: ${(e as Error).message}`);
    }
  };

  const SECTION_LABELS: Record<string, string> = {
    hero: "Hero Section", metrics: "Metrics / Stats", excellence: "Engineered Excellence",
    process: "Process Steps", tropics: "Tropics Section", cta: "Call to Action",
    benefits: "Benefits Banner", footer: "Footer",
  };

  if (loading) return <div style={{ color: "var(--ad-text2)", padding: 24 }}>Loading content…</div>;

  return (
    <div>
      <Toast msg={msg} />
      <div className="ad-content-layout">
        <div>
          {items.map((item) => (
            <div
              key={item.key}
              className={`ad-content-list-item${editing === item.key ? " is-active" : ""}`}
              onClick={() => startEdit(item)}
            >
              <div className="ad-content-list-name">
                {SECTION_LABELS[item.key] ?? item.key}
                {item.isCustomized && <span className="ad-badge is-custom">Custom</span>}
              </div>
              <div className="ad-content-list-meta">
                {item.updatedAt ? `Updated ${fmt(item.updatedAt)}` : "Using default"}
              </div>
            </div>
          ))}
        </div>

        {editing && (
          <div className="ad-card">
            <div className="ad-edit-panel-header" style={{ marginBottom: 12 }}>
              <div className="ad-edit-panel-title">{SECTION_LABELS[editing] ?? editing}</div>
              <div className="ad-table-actions">
                <button onClick={() => void handleReset(editing)} className="ad-btn ad-btn--danger ad-btn--sm">Reset to Default</button>
                <button onClick={() => setEditing(null)} className="ad-btn ad-btn--ghost ad-btn--sm">Close</button>
              </div>
            </div>

            {editing === "metrics" ? (
              <MetricsEditorForm editorText={editorText} onChange={(text) => { setEditorText(text); validateJson(text); }} />
            ) : (
              <>
                <div style={{ fontSize: 12, color: "var(--ad-text2)", marginBottom: 8 }}>
                  Edit JSON — changes take effect on the website after saving.
                </div>
                <textarea
                  ref={textareaRef}
                  className={`ad-code-textarea${jsonError ? " has-error" : ""}`}
                  value={editorText}
                  onChange={(e) => { setEditorText(e.target.value); validateJson(e.target.value); }}
                  spellCheck={false}
                />
                {jsonError && <div className="ad-json-error">JSON error: {jsonError}</div>}
              </>
            )}

            <div className="ad-form-actions">
              <button onClick={() => void handleSave()} disabled={saving || !!jsonError} className="ad-btn">
                {saving ? "Saving…" : "Save Changes"}
              </button>
              {msg && !saving && <Toast msg={msg} />}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

type ProjectForm = {
  title: string; category: ApiProjectCategory; system: string;
  savings: string; isRecent: boolean; sortOrder: number;
};

const EMPTY_PROJECT_FORM: ProjectForm = {
  title: "", category: "Residential", system: "", savings: "", isRecent: false, sortOrder: 0,
};

function categoryClass(c: string) {
  if (c === "Commercial") return "is-commercial";
  if (c === "Industrial") return "is-industrial";
  return "is-residential";
}

function ProjectsManager({ apiKey }: { apiKey: string }) {
  const [projects, setProjects] = useState<ApiProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ProjectForm>(EMPTY_PROJECT_FORM);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [msg, setMsg] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const res = await adminGetProjects(apiKey);
      setProjects(res.data);
    } finally { setLoading(false); }
  };

  useEffect(() => { void load(); }, []);

  const openAdd = () => {
    setEditingId(null); setForm(EMPTY_PROJECT_FORM);
    setImageFile(null); setImagePreview(""); setMsg(""); setShowForm(true);
  };

  const openEdit = (p: ApiProject) => {
    setEditingId(p.id);
    setForm({ title: p.title, category: p.category, system: p.system, savings: p.savings, isRecent: p.isRecent, sortOrder: p.sortOrder });
    setImageFile(null); setImagePreview(p.imageUrl); setMsg(""); setShowForm(true);
  };

  const closeForm = () => { setShowForm(false); setEditingId(null); setImageFile(null); setImagePreview(""); setMsg(""); };

  const handleImageSelect = (file: File | undefined) => {
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (e) => setImagePreview(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const setField = <K extends keyof ProjectForm>(key: K, value: ProjectForm[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const handleSave = async () => {
    if (!form.title.trim() || !form.system.trim() || !form.savings.trim()) { setMsg("Error: Title, System, and Savings are required."); return; }
    if (!editingId && !imageFile) { setMsg("Error: Please upload a project image."); return; }
    setSaving(true); setMsg("");
    try {
      const payload: ProjectInput = { ...form, sortOrder: Number(form.sortOrder), imageFile: imageFile ?? undefined };
      if (editingId) {
        await adminUpdateProject(apiKey, editingId, payload);
        setMsg("✓ Project updated");
      } else {
        await adminCreateProject(apiKey, payload);
        setMsg("✓ Project created");
      }
      await load(); closeForm();
    } catch (e) {
      setMsg(`Error: ${(e as Error).message}`);
    } finally { setSaving(false); }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    setDeleting(id);
    try {
      await adminDeleteProject(apiKey, id);
      setMsg("✓ Project deleted");
      await load();
    } catch (e) {
      setMsg(`Error: ${(e as Error).message}`);
    } finally { setDeleting(null); }
  };

  return (
    <div>
      <div className="ad-section-header">
        <div className="ad-section-title">Projects Portfolio</div>
        {!showForm && <button onClick={openAdd} className="ad-btn ad-btn--sm">+ Add Project</button>}
      </div>

      <Toast msg={msg} />

      {showForm && (
        <div className="ad-card" style={{ marginBottom: 20 }}>
          <div className="ad-edit-panel-header">
            <div className="ad-edit-panel-title">{editingId ? "Edit Project" : "Add New Project"}</div>
            <button onClick={closeForm} className="ad-btn ad-btn--ghost ad-btn--sm">Cancel</button>
          </div>

          <div className="ad-form-grid">
            <div><label className="ad-label">Title</label><input className="ad-input" value={form.title} onChange={(e) => setField("title", e.target.value)} placeholder="Client name or project title" /></div>
            <div>
              <label className="ad-label">Category</label>
              <select className="ad-select" value={form.category} onChange={(e) => setField("category", e.target.value as ApiProjectCategory)}>
                <option value="Residential">Residential</option>
                <option value="Commercial">Commercial</option>
                <option value="Industrial">Industrial</option>
              </select>
            </div>
            <div><label className="ad-label">System</label><input className="ad-input" value={form.system} onChange={(e) => setField("system", e.target.value)} placeholder="e.g. 5.2 kWp On-Grid" /></div>
            <div><label className="ad-label">Estimated Savings (10-Year)</label><input className="ad-input" value={form.savings} onChange={(e) => setField("savings", e.target.value)} placeholder="e.g. ₱312,000" /></div>
            <div className="ad-form-full">
              <label className="ad-label">Project Image {editingId && <span style={{ fontWeight: 400, opacity: 0.6 }}>(leave empty to keep current)</span>}</label>
              <div className="ad-image-row">
                <div
                  className="ad-image-drop"
                  style={{ flex: 1 }}
                  onClick={() => document.getElementById("proj-img-input")?.click()}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => { e.preventDefault(); handleImageSelect(e.dataTransfer.files?.[0]); }}
                >
                  <input id="proj-img-input" type="file" accept="image/jpeg,image/png,image/webp,image/gif,image/avif" hidden onChange={(e) => handleImageSelect(e.target.files?.[0])} />
                  {imageFile
                    ? <span>{imageFile.name} ({(imageFile.size / 1024).toFixed(0)} KB)</span>
                    : <>Click or drag &amp; drop an image<br /><small>JPEG, PNG, WebP, AVIF — max 8 MB</small></>}
                </div>
                {imagePreview && <img src={imagePreview} alt="Preview" className="ad-image-preview" />}
              </div>
            </div>
            <div><label className="ad-label">Sort Order</label><input type="number" className="ad-input" value={form.sortOrder} onChange={(e) => setField("sortOrder", Number(e.target.value))} /></div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, paddingTop: 22 }}>
              <input type="checkbox" id="isRecent" checked={form.isRecent} onChange={(e) => setField("isRecent", e.target.checked)} style={{ width: 16, height: 16, cursor: "pointer", accentColor: "var(--ad-accent)" }} />
              <label htmlFor="isRecent" style={{ color: "var(--ad-text)", fontSize: 13, cursor: "pointer" }}>Mark as Recent Project</label>
            </div>
          </div>

          <div className="ad-form-actions">
            <button onClick={() => void handleSave()} disabled={saving} className="ad-btn">
              {saving ? "Saving…" : editingId ? "Update Project" : "Create Project"}
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div style={{ color: "var(--ad-text2)", padding: 24 }}>Loading projects…</div>
      ) : projects.length === 0 ? (
        <div className="ad-card" style={{ textAlign: "center", padding: "48px 24px" }}>
          <div style={{ fontSize: 15, color: "var(--ad-text2)", marginBottom: 8 }}>No projects yet</div>
          <div style={{ fontSize: 13, color: "var(--ad-text3)" }}>Click "+ Add Project" to publish your first installation.</div>
        </div>
      ) : (
        <div className="ad-table-wrap">
          <table className="ad-table">
            <thead>
              <tr><th>Title</th><th>Category</th><th>System</th><th>Savings</th><th>Recent</th><th>Order</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {projects.map((p) => (
                <tr key={p.id}>
                  <td>
                    <div className="ad-proj-title-cell">
                      {p.imageUrl && <img src={p.imageUrl} alt={p.title} className="ad-proj-thumb" />}
                      <span style={{ fontWeight: 600 }}>{p.title}</span>
                    </div>
                  </td>
                  <td><span className={`ad-badge ${categoryClass(p.category)}`}>{p.category}</span></td>
                  <td>{p.system}</td>
                  <td>{p.savings}</td>
                  <td>{p.isRecent ? <span className="ad-badge is-recent">Recent</span> : <span style={{ color: "var(--ad-text3)" }}>—</span>}</td>
                  <td style={{ textAlign: "center" }}>{p.sortOrder}</td>
                  <td>
                    <div className="ad-table-actions">
                      <button onClick={() => openEdit(p)} className="ad-btn ad-btn--ghost ad-btn--sm">Edit</button>
                      <button onClick={() => void handleDelete(p.id, p.title)} disabled={deleting === p.id} className="ad-btn ad-btn--danger ad-btn--sm" style={{ opacity: deleting === p.id ? 0.5 : 1 }}>
                        {deleting === p.id ? "…" : "Delete"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

const SECTION_INFO: Array<{ key: keyof SectionVisibility; name: string; desc: string }> = [
  { key: "hero",         name: "Hero",              desc: "Main hero banner with headline" },
  { key: "metrics",      name: "Metrics",           desc: "Stats strip (installs, warranty, savings…)" },
  { key: "benefits",     name: "Benefits",          desc: "Benefits banner row" },
  { key: "excellence",   name: "Engineered Excellence", desc: "Products & quality section" },
  { key: "tropics",      name: "Tropics",           desc: "Designed for the tropics section" },
  { key: "process",      name: "Process",           desc: "Step-by-step process section" },
  { key: "clientJourney", name: "Client Journey",   desc: "Testimonials map carousel" },
  { key: "calculator",   name: "Calculator",        desc: "Solar impact calculator" },
  { key: "callToAction", name: "Call to Action",    desc: "Final CTA section" },
];

function SectionsManager({ apiKey }: { apiKey: string }) {
  const [vis, setVis] = useState<SectionVisibility>(DEFAULT_VISIBILITY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await adminGetAllContent(apiKey);
        const item = res.data.find((i) => i.key === "section-visibility");
        if (item?.data) setVis({ ...DEFAULT_VISIBILITY, ...(item.data as Partial<SectionVisibility>) });
      } finally { setLoading(false); }
    };
    void load();
  }, []);

  const handleSave = async () => {
    setSaving(true); setMsg("");
    try {
      await adminUpsertContent(apiKey, "section-visibility", vis);
      setMsg("✓ Section visibility saved");
    } catch (e) {
      setMsg(`Error: ${(e as Error).message}`);
    } finally { setSaving(false); }
  };

  if (loading) return <div style={{ color: "var(--ad-text2)", padding: 24 }}>Loading…</div>;

  return (
    <div>
      <div className="ad-section-header">
        <div>
          <div className="ad-section-title">Section Visibility</div>
          <div style={{ fontSize: 13, color: "var(--ad-text2)", marginTop: 4 }}>Toggle which sections are shown on the public website.</div>
        </div>
      </div>

      <div className="ad-sections-grid">
        {SECTION_INFO.map(({ key, name, desc }) => (
          <div key={key} className={`ad-section-toggle-card${vis[key] ? " is-enabled" : ""}`}>
            <div className="ad-section-toggle-info">
              <div className="ad-section-toggle-name">{name}</div>
              <div className="ad-section-toggle-desc">{desc}</div>
            </div>
            <label className="ad-toggle-switch">
              <input
                type="checkbox"
                checked={vis[key]}
                onChange={(e) => setVis((v) => ({ ...v, [key]: e.target.checked }))}
              />
              <span className="ad-toggle-track" />
            </label>
          </div>
        ))}
      </div>

      <div className="ad-sections-save-bar">
        <button onClick={() => void handleSave()} disabled={saving} className="ad-btn">
          {saving ? "Saving…" : "Save Changes"}
        </button>
        <Toast msg={msg} />
      </div>
    </div>
  );
}

type PkgForm = Omit<PackageInput, never>;

const EMPTY_PKG_FORM: PkgForm = {
  name: "", solarKwp: 0, inverterKw: 0, storageKwh: 0,
  phase: "single", totalPrice: 0, billRangeMin: 0, billRangeMax: 0,
  isActive: true, sortOrder: 0,
};

function autoName(kwp: number, kw: number, kwh: number) {
  const parts: string[] = [];
  if (kwp > 0) parts.push(`${kwp} kWp`);
  if (kw > 0) parts.push(`${kw} kW`);
  if (kwh > 0) parts.push(`${kwh} kWh`);
  return parts.join(" · ");
}

function PkgNumInput({
  label, hint, value, unit, step = "0.01", onChange,
}: {
  label: string; hint: string; value: number; unit: string;
  step?: string; onChange: (v: number) => void;
}) {
  return (
    <div>
      <label className="ad-label">{label}</label>
      <div className="ad-pkg-num-wrap">
        <input
          type="number"
          className="ad-input"
          min={0}
          step={step}
          value={value || ""}
          placeholder="0"
          onChange={(e) => onChange(Number(e.target.value))}
        />
        <span className="ad-pkg-num-unit">{unit}</span>
      </div>
      <p className="ad-pkg-hint">{hint}</p>
    </div>
  );
}

function PackagesManager({ apiKey }: { apiKey: string }) {
  const [packages, setPackages] = useState<ApiSolarPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<PkgForm>(EMPTY_PKG_FORM);
  const [nameEdited, setNameEdited] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toggling, setToggling] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [seeding, setSeeding] = useState(false);
  const [msg, setMsg] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const res = await adminGetPackages(apiKey);
      setPackages(res.data);
    } finally { setLoading(false); }
  };

  useEffect(() => { void load(); }, []);

  const openAdd = () => {
    setEditingId(null); setForm(EMPTY_PKG_FORM); setNameEdited(false); setMsg(""); setShowForm(true);
  };

  const openEdit = (p: ApiSolarPackage) => {
    setEditingId(p.id);
    setForm({
      name: p.name, solarKwp: p.solarKwp, inverterKw: p.inverterKw, storageKwh: p.storageKwh,
      phase: p.phase, totalPrice: p.totalPrice, billRangeMin: p.billRangeMin,
      billRangeMax: p.billRangeMax, isActive: p.isActive, sortOrder: p.sortOrder,
    });
    setNameEdited(true); setMsg(""); setShowForm(true);
  };

  const closeForm = () => { setShowForm(false); setEditingId(null); setNameEdited(false); setMsg(""); };

  const setField = <K extends keyof PkgForm>(key: K, value: PkgForm[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const handleSpecChange = (key: "solarKwp" | "inverterKw" | "storageKwh", val: number) => {
    setForm((f) => {
      const next = { ...f, [key]: val };
      if (!nameEdited) next.name = autoName(next.solarKwp, next.inverterKw, next.storageKwh);
      return next;
    });
  };

  const validateForm = (): string => {
    if (!form.name.trim()) return "Package name is required.";
    if (form.solarKwp <= 0) return "Solar panel capacity must be greater than 0.";
    if (form.inverterKw <= 0) return "Inverter size must be greater than 0.";
    if (form.storageKwh < 0) return "Battery storage cannot be negative.";
    if (form.totalPrice <= 0) return "Package price must be greater than 0.";
    if (form.billRangeMax < form.billRangeMin) return "Maximum bill must be ≥ minimum bill.";
    return "";
  };

  const handleSave = async () => {
    const err = validateForm();
    if (err) { setMsg(`Error: ${err}`); return; }
    setSaving(true); setMsg("");
    try {
      if (editingId) {
        await adminUpdatePackage(apiKey, editingId, form);
      } else {
        await adminCreatePackage(apiKey, form);
      }
      await load(); closeForm();
    } catch (e) {
      setMsg(`Error: ${(e as Error).message}`);
    } finally { setSaving(false); }
  };

  const handleToggleActive = async (p: ApiSolarPackage) => {
    setToggling(p.id);
    try {
      await adminUpdatePackage(apiKey, p.id, { isActive: !p.isActive });
      await load();
    } catch (e) {
      setMsg(`Error: ${(e as Error).message}`);
    } finally { setToggling(null); }
  };

  const handleDelete = async (p: ApiSolarPackage) => {
    if (!confirm(`Delete "${p.name}"? This cannot be undone.`)) return;
    setDeleting(p.id);
    try {
      await adminDeletePackage(apiKey, p.id);
      setMsg("✓ Package deleted");
      await load();
    } catch (e) {
      setMsg(`Error: ${(e as Error).message}`);
    } finally { setDeleting(null); }
  };

  const handleSeedDefaults = async () => {
    if (!confirm("Add the 7 built-in KSTAR packages to your catalog? You can edit them afterward.")) return;
    setSeeding(true); setMsg("");
    try {
      for (const pkg of SOLAR_PACKAGES) {
        await adminCreatePackage(apiKey, {
          name: pkg.name, solarKwp: pkg.solarKwp, inverterKw: pkg.inverterKw,
          storageKwh: pkg.storageKwh, phase: pkg.phase, totalPrice: pkg.totalPrice,
          billRangeMin: pkg.monthlyBillRange[0], billRangeMax: pkg.monthlyBillRange[1],
          isActive: true, sortOrder: 0,
        });
      }
      setMsg("✓ Default packages loaded — you can now edit or add more.");
      await load();
    } catch (e) {
      setMsg(`Error: ${(e as Error).message}`);
    } finally { setSeeding(false); }
  };

  const peso = (v: number) => `₱${v.toLocaleString("en-PH")}`;
  const activeCount = packages.filter((p) => p.isActive).length;

  return (
    <div>
      <div className="ad-section-header">
        <div>
          <div className="ad-section-title">Solar Packages</div>
          <div className="ad-section-sub">
            {loading ? "Loading…" : `${activeCount} active · ${packages.length} total — packages shown to customers after their quotation submission.`}
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {packages.length === 0 && !loading && (
            <button onClick={() => void handleSeedDefaults()} disabled={seeding} className="ad-btn ad-btn--secondary ad-btn--sm">
              {seeding ? "Loading…" : "Load Default Packages"}
            </button>
          )}
          {!showForm && (
            <button onClick={openAdd} className="ad-btn ad-btn--sm">+ Add Package</button>
          )}
        </div>
      </div>

      <Toast msg={msg} />

      {showForm && (
        <div className="ad-card" style={{ marginBottom: 20 }}>
          <div className="ad-edit-panel-header">
            <div className="ad-edit-panel-title">{editingId ? "Edit Package" : "Add New Package"}</div>
            <button onClick={closeForm} className="ad-btn ad-btn--ghost ad-btn--sm">Cancel</button>
          </div>

          <div className="ad-pkg-form-phase">
            <div className="ad-label">System Phase</div>
            <div className="ad-pkg-phase-toggle">
              <button
                type="button"
                className={`ad-pkg-phase-btn${form.phase === "single" ? " is-active" : ""}`}
                onClick={() => setField("phase", "single")}
              >
                Single Phase
                <span>Residential</span>
              </button>
              <button
                type="button"
                className={`ad-pkg-phase-btn${form.phase === "three" ? " is-active" : ""}`}
                onClick={() => setField("phase", "three")}
              >
                Three Phase
                <span>Commercial / Industrial</span>
              </button>
            </div>
          </div>

          <div className="ad-form-grid" style={{ marginTop: 16 }}>
            <div className="ad-form-full">
              <label className="ad-label">Package Name</label>
              <input
                className="ad-input"
                value={form.name}
                placeholder="e.g. 3.72 kWp · 3.6 kW · 5.1 kWh"
                onChange={(e) => { setNameEdited(true); setField("name", e.target.value); }}
              />
              <p className="ad-pkg-hint">This name is shown to customers in the recommendation panel. Fill in the specs below first — the name will auto-fill.</p>
            </div>

            <PkgNumInput label="Solar Panel Capacity" hint="Total solar array size." value={form.solarKwp} unit="kWp" onChange={(v) => handleSpecChange("solarKwp", v)} />
            <PkgNumInput label="Inverter Size" hint="The inverter's power output rating." value={form.inverterKw} unit="kW" onChange={(v) => handleSpecChange("inverterKw", v)} />
            <PkgNumInput label="Battery Storage" hint="Battery capacity. Enter 0 for grid-tied (no battery)." value={form.storageKwh} unit="kWh" step="0.1" onChange={(v) => handleSpecChange("storageKwh", v)} />

            <div>
              <label className="ad-label">Package Price</label>
              <div className="ad-pkg-num-wrap">
                <span className="ad-pkg-num-prefix">₱</span>
                <input
                  type="number"
                  className="ad-input"
                  min={0}
                  step={1}
                  value={form.totalPrice || ""}
                  placeholder="0"
                  onChange={(e) => setField("totalPrice", Number(e.target.value))}
                />
              </div>
              <p className="ad-pkg-hint">Indicative starting price shown to customers.</p>
            </div>

            <div />

            <div>
              <label className="ad-label">Minimum Monthly Bill</label>
              <div className="ad-pkg-num-wrap">
                <span className="ad-pkg-num-prefix">₱</span>
                <input
                  type="number"
                  className="ad-input"
                  min={0}
                  step={100}
                  value={form.billRangeMin || ""}
                  placeholder="0"
                  onChange={(e) => setField("billRangeMin", Number(e.target.value))}
                />
                <span className="ad-pkg-num-unit">/ mo</span>
              </div>
              <p className="ad-pkg-hint">Customers with bills above this amount are a good fit.</p>
            </div>

            <div>
              <label className="ad-label">Maximum Monthly Bill</label>
              <div className="ad-pkg-num-wrap">
                <span className="ad-pkg-num-prefix">₱</span>
                <input
                  type="number"
                  className="ad-input"
                  min={0}
                  step={100}
                  value={form.billRangeMax || ""}
                  placeholder="0"
                  onChange={(e) => setField("billRangeMax", Number(e.target.value))}
                />
                <span className="ad-pkg-num-unit">/ mo</span>
              </div>
              <p className="ad-pkg-hint">Customers with bills below this amount are best suited.</p>
            </div>

            <div>
              <label className="ad-label">Display Order</label>
              <input
                type="number"
                className="ad-input"
                value={form.sortOrder}
                onChange={(e) => setField("sortOrder", Number(e.target.value))}
              />
              <p className="ad-pkg-hint">Lower numbers appear first. Use 0 for default ordering.</p>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 10, paddingTop: 22 }}>
              <input
                type="checkbox"
                id="pkg-active"
                checked={form.isActive}
                onChange={(e) => setField("isActive", e.target.checked)}
                style={{ width: 16, height: 16, cursor: "pointer", accentColor: "var(--ad-accent)" }}
              />
              <label htmlFor="pkg-active" style={{ color: "var(--ad-text)", fontSize: 13, cursor: "pointer" }}>
                Active — visible to customers
              </label>
            </div>
          </div>

          <div className="ad-form-actions">
            <button onClick={() => void handleSave()} disabled={saving} className="ad-btn">
              {saving ? "Saving…" : editingId ? "Update Package" : "Create Package"}
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div style={{ color: "var(--ad-text2)", padding: 24 }}>Loading packages…</div>
      ) : packages.length === 0 ? (
        <div className="ad-card" style={{ textAlign: "center", padding: "48px 24px" }}>
          <div style={{ fontSize: 15, color: "var(--ad-text2)", marginBottom: 8 }}>No packages yet</div>
          <div style={{ fontSize: 13, color: "var(--ad-text3)", maxWidth: 380, margin: "0 auto" }}>
            Click <strong>Load Default Packages</strong> to seed the 7 built-in KSTAR configurations, or <strong>+ Add Package</strong> to create one from scratch.
          </div>
        </div>
      ) : (
        <div className="ad-pkg-mgr-grid">
          {packages.map((p) => (
            <div key={p.id} className={`ad-pkg-mgr-card${!p.isActive ? " is-inactive" : ""} is-${p.phase}-phase`}>
              <div className="ad-pkg-mgr-top">
                <span className={`ad-badge ${p.phase === "single" ? "is-residential" : "is-commercial"}`}>
                  {p.phase === "single" ? "Single Phase" : "Three Phase"}
                </span>
                <label className="ad-toggle-switch" title={p.isActive ? "Active — click to hide" : "Hidden — click to show"}>
                  <input
                    type="checkbox"
                    checked={p.isActive}
                    disabled={toggling === p.id}
                    onChange={() => void handleToggleActive(p)}
                  />
                  <span className="ad-toggle-track" />
                </label>
              </div>

              <div className="ad-pkg-mgr-name">{p.name}</div>

              <div className="ad-pkg-mgr-specs">
                <div className="ad-pkg-mgr-spec">
                  <span>Solar</span>
                  <strong>{p.solarKwp} kWp</strong>
                </div>
                <div className="ad-pkg-mgr-spec">
                  <span>Inverter</span>
                  <strong>{p.inverterKw} kW</strong>
                </div>
                <div className="ad-pkg-mgr-spec">
                  <span>Battery</span>
                  <strong>{p.storageKwh > 0 ? `${p.storageKwh} kWh` : "None"}</strong>
                </div>
              </div>

              <div className="ad-pkg-mgr-price">{peso(p.totalPrice)}</div>
              <div className="ad-pkg-mgr-bill">
                For bills {peso(p.billRangeMin)}–{peso(p.billRangeMax)}/mo
              </div>

              <div className="ad-pkg-mgr-footer">
                <span className="ad-pkg-mgr-order">Order #{p.sortOrder}</span>
                <div className="ad-table-actions">
                  <button onClick={() => openEdit(p)} className="ad-btn ad-btn--ghost ad-btn--sm" disabled={showForm}>Edit</button>
                  <button
                    onClick={() => void handleDelete(p)}
                    disabled={deleting === p.id || showForm}
                    className="ad-btn ad-btn--danger ad-btn--sm"
                    style={{ opacity: deleting === p.id ? 0.5 : 1 }}
                  >
                    {deleting === p.id ? "…" : "Delete"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

type FooterLink = { name: string; url: string };
type FooterContent = {
  phone: string; email: string;
  socials: Record<string, FooterLink>;
  footer_text: { credits: string; privacy_policy: FooterLink; terms_conditions: FooterLink };
};

function FooterEditor({ apiKey }: { apiKey: string }) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [socials, setSocials] = useState<Array<{ key: string; name: string; url: string }>>([]);
  const [credits, setCredits] = useState("");
  const [privacyName, setPrivacyName] = useState("");
  const [privacyUrl, setPrivacyUrl] = useState("");
  const [termsName, setTermsName] = useState("");
  const [termsUrl, setTermsUrl] = useState("");

  const populate = (d: Partial<FooterContent>) => {
    setPhone(d.phone ?? ""); setEmail(d.email ?? "");
    setSocials(Object.entries(d.socials ?? {}).map(([k, v]) => ({ key: k, name: v.name, url: v.url })));
    setCredits(d.footer_text?.credits ?? "");
    setPrivacyName(d.footer_text?.privacy_policy?.name ?? ""); setPrivacyUrl(d.footer_text?.privacy_policy?.url ?? "");
    setTermsName(d.footer_text?.terms_conditions?.name ?? ""); setTermsUrl(d.footer_text?.terms_conditions?.url ?? "");
  };

  const load = async () => {
    setLoading(true);
    try {
      const res = await adminGetAllContent(apiKey);
      const item = res.data.find((i) => i.key === "footer");
      if (item) populate(item.data as Partial<FooterContent>);
    } finally { setLoading(false); }
  };

  useEffect(() => { void load(); }, []);

  const buildPayload = (): FooterContent => ({
    phone, email,
    socials: Object.fromEntries(socials.filter((s) => s.key.trim()).map((s) => [s.key.trim(), { name: s.name, url: s.url }])),
    footer_text: {
      credits,
      privacy_policy: { name: privacyName, url: privacyUrl },
      terms_conditions: { name: termsName, url: termsUrl },
    },
  });

  const handleSave = async () => {
    setSaving(true); setMsg("");
    try {
      await adminUpsertContent(apiKey, "footer", buildPayload());
      setMsg("✓ Footer saved successfully");
    } catch (e) {
      setMsg(`Error: ${(e as Error).message}`);
    } finally { setSaving(false); }
  };

  const handleReset = async () => {
    if (!confirm("Reset footer to default content? This cannot be undone.")) return;
    try {
      await adminResetContent(apiKey, "footer");
      setMsg("✓ Footer reset to default");
      await load();
    } catch (e) {
      setMsg(`Error: ${(e as Error).message}`);
    }
  };

  if (loading) return <div style={{ color: "var(--ad-text2)", padding: 24 }}>Loading footer…</div>;

  return (
    <div className="ad-footer-wrap">
      <Toast msg={msg} />

      <div className="ad-card" style={{ marginBottom: 16 }}>
        <div className="ad-card-title">Contact Info</div>
        <div className="ad-form-grid">
          <div><label className="ad-label">Phone</label><input className="ad-input" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+63 961 618 3436" /></div>
          <div><label className="ad-label">Email</label><input className="ad-input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="sales@azari.solar" /></div>
        </div>
      </div>

      <div className="ad-card" style={{ marginBottom: 16 }}>
        <div className="ad-section-header" style={{ marginBottom: 12 }}>
          <div className="ad-card-title" style={{ margin: 0 }}>Social Links</div>
          <button onClick={() => setSocials((prev) => [...prev, { key: "", name: "", url: "" }])} className="ad-btn ad-btn--sm ad-btn--secondary">+ Add Link</button>
        </div>
        {socials.length === 0 && <div style={{ fontSize: 13, color: "var(--ad-text3)" }}>No social links. Click "+ Add Link" to add one.</div>}
        {socials.map((s, i) => (
          <div key={i} className="ad-socials-row">
            <div>
              {i === 0 && <div className="ad-label">Key (ID)</div>}
              <input className="ad-input" value={s.key} onChange={(e) => setSocials((prev) => prev.map((x, j) => j === i ? { ...x, key: e.target.value } : x))} placeholder="facebook" />
            </div>
            <div>
              {i === 0 && <div className="ad-label">Display Name</div>}
              <input className="ad-input" value={s.name} onChange={(e) => setSocials((prev) => prev.map((x, j) => j === i ? { ...x, name: e.target.value } : x))} placeholder="Facebook" />
            </div>
            <div className="ad-socials-url">
              {i === 0 && <div className="ad-label">URL</div>}
              <input className="ad-input" value={s.url} onChange={(e) => setSocials((prev) => prev.map((x, j) => j === i ? { ...x, url: e.target.value } : x))} placeholder="https://..." />
            </div>
            <div>
              {i === 0 && <div style={{ height: 23 }} />}
              <button onClick={() => setSocials((prev) => prev.filter((_, j) => j !== i))} className="ad-btn ad-btn--danger ad-btn--sm">✕</button>
            </div>
          </div>
        ))}
      </div>

      <div className="ad-card" style={{ marginBottom: 16 }}>
        <div className="ad-card-title">Footer Text</div>
        <div style={{ marginBottom: 16 }}>
          <label className="ad-label">Credits</label>
          <input className="ad-input" value={credits} onChange={(e) => setCredits(e.target.value)} placeholder="Designed by..." />
        </div>
        <div className="ad-form-grid" style={{ marginBottom: 16 }}>
          <div><label className="ad-label">Privacy Policy Label</label><input className="ad-input" value={privacyName} onChange={(e) => setPrivacyName(e.target.value)} placeholder="Privacy Policy" /></div>
          <div><label className="ad-label">Privacy Policy URL</label><input className="ad-input" value={privacyUrl} onChange={(e) => setPrivacyUrl(e.target.value)} placeholder="https://..." /></div>
        </div>
        <div className="ad-form-grid">
          <div><label className="ad-label">Terms & Conditions Label</label><input className="ad-input" value={termsName} onChange={(e) => setTermsName(e.target.value)} placeholder="Terms and Conditions" /></div>
          <div><label className="ad-label">Terms & Conditions URL</label><input className="ad-input" value={termsUrl} onChange={(e) => setTermsUrl(e.target.value)} placeholder="https://..." /></div>
        </div>
      </div>

      <div className="ad-form-actions">
        <button onClick={() => void handleSave()} disabled={saving} className="ad-btn">{saving ? "Saving…" : "Save Changes"}</button>
        <button onClick={() => void handleReset()} className="ad-btn ad-btn--danger">Reset to Default</button>
      </div>
    </div>
  );
}

export default function ASAdmin() {
  const [apiKey, setApiKey] = useState<string>(() => sessionStorage.getItem("azari_admin_key") ?? "");
  const [authError, setAuthError] = useState("");
  const [tab, setTab] = useState<Tab>("overview");
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLight, setIsLight] = useState<boolean>(() => localStorage.getItem("azari-admin-theme") === "light");

  const handleLogin = async (key: string) => {
    try {
      const res = await adminGetStats(key) as { success: boolean; data: Stats };
      sessionStorage.setItem("azari_admin_key", key);
      setApiKey(key);
      setStats(res.data);
      setAuthError("");
    } catch {
      setAuthError("Invalid API key. Please try again.");
    }
  };

  useEffect(() => {
    if (apiKey) {
      adminGetStats(apiKey)
        .then((res) => setStats((res as { data: Stats }).data))
        .catch(() => { sessionStorage.removeItem("azari_admin_key"); setApiKey(""); });
    }
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem("azari_admin_key");
    setApiKey(""); setStats(null);
  };

  const toggleTheme = () => {
    const next = !isLight;
    setIsLight(next);
    localStorage.setItem("azari-admin-theme", next ? "light" : "dark");
  };

  const TABS: Array<{ id: Tab; label: string }> = [
    { id: "overview",   label: "Overview" },
    { id: "inquiries",  label: "Talk Inquiries" },
    { id: "quotations", label: "Quotation Requests" },
    { id: "projects",   label: "Projects" },
    { id: "packages",   label: "Solar Packages" },
    { id: "sections",   label: "Sections" },
    { id: "content",    label: "Site Content" },
    { id: "footer",     label: "Footer" },
  ];

  if (!apiKey) {
    return (
      <div className={`as-admin${isLight ? " is-light" : ""}`}>
        <LoginScreen onLogin={handleLogin} error={authError} />
      </div>
    );
  }

  return (
    <div className={`as-admin${isLight ? " is-light" : ""}`}>
      <nav className="ad-topnav">
        <div className="ad-topnav-logo">azari<span>.solar</span></div>
        <span className="ad-topnav-badge">Admin</span>
        <div className="ad-topnav-spacer" />
        <div className="ad-topnav-actions">
          <button
            className={`ad-theme-toggle${isLight ? " is-light" : ""}`}
            onClick={toggleTheme}
            aria-label="Toggle theme"
            title={isLight ? "Switch to dark mode" : "Switch to light mode"}
          />
          <button onClick={handleLogout} className="ad-btn ad-btn--ghost ad-btn--sm">Sign Out</button>
        </div>
      </nav>

      <div className="ad-tabs">
        {TABS.map((t) => (
          <button
            key={t.id}
            className={`ad-tab-btn${tab === t.id ? " is-active" : ""}`}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="ad-content">
        {tab === "overview"   && <OverviewTab stats={stats} />}
        {tab === "inquiries"  && <SubmissionsTable apiKey={apiKey} type="talk" />}
        {tab === "quotations" && <SubmissionsTable apiKey={apiKey} type="quotations" />}
        {tab === "projects"   && <ProjectsManager apiKey={apiKey} />}
        {tab === "packages"   && <PackagesManager apiKey={apiKey} />}
        {tab === "sections"   && <SectionsManager apiKey={apiKey} />}
        {tab === "content"    && <ContentEditor apiKey={apiKey} />}
        {tab === "footer"     && <FooterEditor apiKey={apiKey} />}
      </div>
    </div>
  );
}
