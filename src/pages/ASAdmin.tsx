import { useEffect, useState, type CSSProperties } from "react";
import { createPortal } from "react-dom";
import ASRateLimitBanner from "../components/ASRateLimitBanner";
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
  adminUploadPackageImage,
  adminGetComponents,
  adminCreateComponent,
  adminUpdateComponent,
  adminDeleteComponent,
  adminGetComponentUsage,
  adminUpdateTalkProjectStatus,
  adminUpdateQuotationProjectStatus,
  adminGetPackageInquiries,
  adminUpdatePackageInquiry,
  adminDeletePackageInquiry,
  computeMonthlySavings,
  type ApiProject,
  type PackageInquiry,
  type ProjectInput,
  type ProjectCategory as ApiProjectCategory,
  type ApiSolarPackage,
  type PackageInput,
  type ApiSolarComponent,
  type ComponentInput,
  type PackageComponentLine,
  type PackageUsageItem,
} from "../services/ASContent";
import { CATEGORY_SPEC, unitFactor, toCanonical, fromCanonical, formatCapacity } from "../lib/units";
import LocationAutocompleteInput from "../components/ASLocationAutocomplete";

type Tab =
  | "overview" | "inquiries" | "quotations" | "projects" | "inventory" | "packages" | "package-inquiries" | "sections"
  | "hero" | "metrics" | "benefits" | "tropics" | "journey" | "excellence" | "process" | "cta" | "footer";

type SectionVisibility = {
  hero: boolean; metrics: boolean; benefits: boolean; excellence: boolean;
  tropics: boolean; process: boolean; clientJourney: boolean; calculator: boolean; callToAction: boolean;
  packages: boolean;
};

const DEFAULT_VISIBILITY: SectionVisibility = {
  hero: true, metrics: true, benefits: true, excellence: true,
  tropics: true, process: true, clientJourney: true, calculator: true, callToAction: true,
  packages: true,
};

interface Stats {
  totals: { talkInquiries: number; quotations: number; packageInquiries: number; activePackages: number; activeComponents: number; projects: number };
  talkInquiries: { byStatus: Record<string, number>; byType: Record<string, number> };
  quotations: { byStatus: Record<string, number>; byMode: Record<string, number> };
  packageInquiries: { byStatus: Record<string, number> };
  trend30d: {
    talk: Array<{ day: string; count: number }>;
    quotations: Array<{ day: string; count: number }>;
    packages: Array<{ day: string; count: number }>;
  };
  recent: {
    talkInquiries: Array<{ id: string; name: string; email: string; inquiryType: string; status: string; createdAt: string }>;
    quotations: Array<{ id: string; fullName: string; email: string; estimatedSystemSizeDisplayText: string; status: string; createdAt: string }>;
    packageInquiries: Array<{ id: string; name: string; email: string; packageName: string; status: string; createdAt: string }>;
  };
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
  const isSuccess = msg.startsWith("✓");
  const bgColor = isSuccess ? "rgba(34, 197, 94, 0.15)" : "rgba(252, 97, 90, 0.15)";
  const borderColor = isSuccess ? "rgba(34, 197, 94, 0.4)" : "rgba(252, 97, 90, 0.4)";
  const textColor = isSuccess ? "#22c55e" : "#fc615a";
  return (
    <div style={{
      position: "fixed",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      zIndex: 10000,
      background: bgColor,
      border: `1px solid ${borderColor}`,
      color: textColor,
      padding: "14px 20px",
      borderRadius: 8,
      fontSize: 14,
      fontWeight: 500,
      display: "flex",
      alignItems: "center",
      gap: 8,
      animation: "fadeIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
      maxWidth: "90vw",
      minWidth: "250px",
      textAlign: "center",
      justifyContent: "center",
      backdropFilter: "none"
    }}>
      {msg}
    </div>
  );
}

function ConfirmDeleteModal({ open, title, description, onConfirm, onCancel, confirming }: {
  open: boolean; title: string; description?: string;
  onConfirm: () => void; onCancel: () => void; confirming?: boolean;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onCancel(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onCancel]);
  if (!open) return null;
  return createPortal(
    <div className="ad-confirm-backdrop" onClick={onCancel}>
      <div className="ad-confirm-panel" onClick={e => e.stopPropagation()}>
        <div className="ad-confirm-icon">🗑</div>
        <div className="ad-confirm-title">{title}</div>
        {description && <div className="ad-confirm-desc">{description}</div>}
        <div className="ad-confirm-actions">
          <button onClick={onCancel} className="ad-btn ad-btn--ghost">Cancel</button>
          <button onClick={onConfirm} disabled={confirming} className="ad-btn ad-btn--danger">{confirming ? "Deleting…" : "Delete"}</button>
        </div>
      </div>
    </div>,
    document.body
  );
}

function AdminModal({ open, onClose, title, subtitle, children, maxWidth }: {
  open: boolean; onClose: () => void; title: React.ReactNode;
  subtitle?: string; children: React.ReactNode; maxWidth?: number;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);
  if (!open) return null;
  return createPortal(
    <div className="ad-modal-backdrop" onClick={onClose}>
      <div className="ad-modal-panel" style={{ maxWidth: maxWidth ?? 640 }} onClick={e => e.stopPropagation()}>
        <div className="ad-modal-header">
          <div>
            <div className="ad-modal-title">{title}</div>
            {subtitle && <div className="ad-modal-subtitle">{subtitle}</div>}
          </div>
          <button onClick={onClose} className="ad-modal-close" aria-label="Close">✕</button>
        </div>
        <div className="ad-modal-body">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
}

function StatusBadge({ status }: { status: string }) {
  return <span className={`ad-badge ${statusClass(status)}`}>{status.replace(/_/g, " ")}</span>;
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

  return (
    <div className="ad-login-wrap">
      <div className="ad-login-card">
        <div className="ad-login-logo">azari<span>.solar</span></div>
        <div className="ad-login-sub">Admin Panel</div>
        {(localError || error) && <div className="ad-login-error">{localError || error}</div>}
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
          <button type="submit" className="ad-btn" style={{ width: "100%" }}>Sign In</button>
        </form>
      </div>
    </div>
  );
}

function MiniBarChart({ data, color, label }: { data: Array<{ day: string; count: number }>; color: string; label: string }) {
  const maxCount = Math.max(1, ...data.map(d => d.count));
  const barHeight = 40;
  const barWidth = Math.max(2, 360 / Math.max(1, data.length));
  const today = new Date().toISOString().split('T')[0];

  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ fontSize: 12, fontWeight: 600, color: "var(--ad-text)", marginBottom: 8 }}>{label}</div>
      <svg width="100%" height="80" viewBox="0 0 380 80" style={{ border: "1px solid var(--ad-border)", borderRadius: 8, padding: 8, background: "var(--ad-input-bg)" }}>
        {data.map((d, i) => {
          const normalizedHeight = (d.count / maxCount) * barHeight;
          const x = i * barWidth + 2;
          const y = 60 - normalizedHeight;
          const isToday = d.day === today;
          return (
            <g key={d.day}>
              <rect x={x} y={y} width={Math.max(1, barWidth - 1)} height={normalizedHeight} fill={isToday ? color : `${color}80`} rx="2" />
            </g>
          );
        })}
      </svg>
    </div>
  );
}

function OverviewTab({ stats }: { stats: Stats | null }) {
  if (!stats) return <div style={{ color: "var(--ad-text2)", padding: 24 }}>Loading stats…</div>;

  const emailFailures = (stats.talkInquiries.byStatus.email_failed ?? 0) + (stats.quotations.byStatus.email_failed ?? 0);
  const contacted = stats.packageInquiries.byStatus.contacted ?? 0;
  const converted = stats.packageInquiries.byStatus.converted ?? 0;
  const newPkgs = stats.packageInquiries.byStatus.new ?? 0;
  const pkgConversionRate = (contacted + converted) > 0 ? Math.round((converted / (newPkgs + contacted + converted)) * 100) : 0;

  const recentAll = [
    ...stats.recent.talkInquiries.map(r => ({ type: "TALK", name: r.name, email: r.email, meta: r.inquiryType, status: r.status, date: r.createdAt })),
    ...stats.recent.quotations.map(r => ({ type: "QUOTE", name: r.fullName, email: r.email, meta: r.estimatedSystemSizeDisplayText, status: r.status, date: r.createdAt })),
    ...stats.recent.packageInquiries.map(r => ({ type: "PKG", name: r.name, email: r.email, meta: r.packageName, status: r.status, date: r.createdAt }))
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div>
      {/* Stat Cards */}
      <div className="ad-stats-grid">
        {[
          { label: "Talk Inquiries", value: stats.totals.talkInquiries, cls: "is-accent" },
          { label: "Quotations", value: stats.totals.quotations, cls: "" },
          { label: "Package Inquiries", value: stats.totals.packageInquiries, cls: "is-accent" },
          { label: "Active Packages", value: stats.totals.activePackages, cls: "" },
          { label: "Projects", value: stats.totals.projects, cls: "" },
          { label: "Email Failures", value: emailFailures, cls: emailFailures > 0 ? "is-danger" : "" },
        ].map((card) => (
          <div key={card.label} className="ad-stat-card">
            <div className="ad-stat-label">{card.label}</div>
            <div className={`ad-stat-value ${card.cls}`}>{card.value}</div>
          </div>
        ))}
      </div>

      {/* 30-Day Activity Chart */}
      <div className="ad-card" style={{ marginTop: 24, padding: "20px" }}>
        <div className="ad-card-title">30-Day Activity</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20, marginTop: 20 }}>
          <MiniBarChart data={stats.trend30d.talk} color="#3b82f6" label="Talk Inquiries" />
          <MiniBarChart data={stats.trend30d.quotations} color="#f59e0b" label="Quotations" />
          <MiniBarChart data={stats.trend30d.packages} color="#22c55e" label="Package Inquiries" />
        </div>
      </div>

      {/* Breakdowns */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20, marginTop: 24 }}>
        {/* Talk by Type */}
        <div className="ad-card">
          <div className="ad-card-title">Talk Inquiries by Type</div>
          <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 12 }}>
            {Object.entries(stats.talkInquiries.byType).map(([type, count]) => {
              const total = stats.totals.talkInquiries || 1;
              const pct = Math.round((count / total) * 100);
              return (
                <div key={type}>
                  <div style={{ fontSize: 12, color: "var(--ad-text3)", marginBottom: 4 }}>{type} ({count})</div>
                  <div style={{ height: 6, background: "var(--ad-border)", borderRadius: 3, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${pct}%`, background: "#3b82f6" }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quotations by Mode */}
        <div className="ad-card">
          <div className="ad-card-title">Quotations by Mode</div>
          <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 12 }}>
            {Object.entries(stats.quotations.byMode).map(([mode, count]) => {
              const total = stats.totals.quotations || 1;
              const pct = Math.round((count / total) * 100);
              return (
                <div key={mode}>
                  <div style={{ fontSize: 12, color: "var(--ad-text3)", marginBottom: 4 }}>{mode === "with_bill" ? "With Bill" : "No Bill"} ({count})</div>
                  <div style={{ height: 6, background: "var(--ad-border)", borderRadius: 3, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${pct}%`, background: "#f59e0b" }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Package Inquiry Funnel */}
        <div className="ad-card">
          <div className="ad-card-title">Package Inquiry Funnel</div>
          <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 12 }}>
            {["new", "contacted", "converted"].map((stage) => {
              const count = stats.packageInquiries.byStatus[stage] ?? 0;
              const total = stats.totals.packageInquiries || 1;
              const pct = Math.round((count / total) * 100);
              return (
                <div key={stage}>
                  <div style={{ fontSize: 12, color: "var(--ad-text3)", marginBottom: 4 }}>
                    {stage.charAt(0).toUpperCase() + stage.slice(1)} ({count}) {stage === "converted" && `${pkgConversionRate}%`}
                  </div>
                  <div style={{ height: 6, background: "var(--ad-border)", borderRadius: 3, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${pct}%`, background: "#22c55e" }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="ad-card" style={{ marginTop: 24 }}>
        <div className="ad-card-title">Recent Activity (All Sources)</div>
        <div style={{ marginTop: 16 }}>
          {recentAll.slice(0, 10).map((r, i) => (
            <div key={i} className="ad-recent-row">
              <div style={{ display: "flex", gap: 12, alignItems: "center", flex: 1 }}>
                <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 4, background: r.type === "TALK" ? "#3b82f6" : r.type === "QUOTE" ? "#f59e0b" : "#22c55e", color: "white", minWidth: 40 }}>{r.type}</span>
                <div style={{ flex: 1 }}>
                  <div className="ad-recent-name">{r.name}</div>
                  <div className="ad-recent-meta">{r.email} · {r.meta}</div>
                </div>
              </div>
              <div className="ad-recent-footer">
                <span className="ad-recent-date">{fmt(r.date)}</span>
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

const PROJECT_STATUS_OPTIONS = [
  { value: "new",             label: "New" },
  { value: "site_assessment", label: "Site Assessment" },
  { value: "proposal_sent",   label: "Proposal Sent" },
  { value: "ongoing",         label: "Ongoing" },
  { value: "completed",       label: "Completed" },
];

const PROJECT_STATUS_COLORS: Record<string, string> = {
  new:             "var(--ad-text3)",
  site_assessment: "#f59e0b",
  proposal_sent:   "#3b82f6",
  ongoing:         "#a855f7",
  completed:       "#22c55e",
};

function fmtRef(id: string, type: "talk" | "quotations"): string {
  const prefix = type === "talk" ? "INQ" : "QUO";
  return `${prefix}-${(id as string).slice(0, 8).toUpperCase()}`;
}

function SubmissionsTable({ apiKey, type }: { apiKey: string; type: "talk" | "quotations" }) {
  const [data, setData] = useState<unknown[]>([]);
  const [total, setTotal] = useState(0);
  const [offset, setOffset] = useState(0);
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState<string | null>(null);
  const [updatingProject, setUpdatingProject] = useState<string | null>(null);
  const [retrying, setRetrying] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [editingRow, setEditingRow] = useState<Record<string, unknown> | null>(null);
  const [editForm, setEditForm] = useState<Record<string, string>>({});
  const [editSaving, setEditSaving] = useState(false);
  const [editMsg, setEditMsg] = useState("");
  const [previewRow, setPreviewRow] = useState<Record<string, unknown> | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const limit = 20;

  useEffect(() => {
    const t = window.setTimeout(() => setDebouncedSearch(search), 350);
    return () => clearTimeout(t);
  }, [search]);

  const load = async () => {
    setLoading(true);
    try {
      const fn = type === "talk" ? adminGetTalkInquiries : adminGetQuotations;
      const res = await fn(apiKey, { limit, offset, status: statusFilter || undefined, search: debouncedSearch || undefined }) as { data: unknown[]; total: number };
      setData(res.data);
      setTotal(res.total);
    } finally { setLoading(false); }
  };

  useEffect(() => { void load(); }, [offset, statusFilter, debouncedSearch]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleStatusChange = async (id: string, status: string) => {
    setUpdating(id);
    try {
      const fn = type === "talk" ? adminUpdateTalkStatus : adminUpdateQuotationStatus;
      await fn(apiKey, id, status);
      await load();
    } finally { setUpdating(null); }
  };

  const handleProjectStatusChange = async (id: string, projectStatus: string) => {
    setUpdatingProject(id);
    try {
      const fn = type === "talk" ? adminUpdateTalkProjectStatus : adminUpdateQuotationProjectStatus;
      await fn(apiKey, id, projectStatus);
      setData(prev => (prev as Array<Record<string, unknown>>).map(r => r.id === id ? { ...r, projectStatus } : r));
    } catch (e) { setEditMsg(`Failed: ${(e as Error).message}`); }
    finally { setUpdatingProject(null); }
  };

  const handleRetryEmail = async (id: string) => {
    setRetrying(id);
    try {
      const fn = type === "talk" ? adminRetryTalkEmail : adminRetryQuotationEmail;
      await fn(apiKey, id);
      await load();
    } finally { setRetrying(null); }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(deleteTarget);
    try {
      const fn = type === "talk" ? adminDeleteTalkInquiry : adminDeleteQuotation;
      await fn(apiKey, deleteTarget);
      await load();
    } catch (e) {
      setEditMsg(`Delete failed: ${(e as Error).message}`);
    } finally { setDeleting(null); setDeleteTarget(null); }
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
    setEditSaving(true); setEditMsg("");
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
        <input
          type="search"
          className="ad-input"
          style={{ flex: 1, minWidth: 0, maxWidth: 280 }}
          placeholder={`Search by ref (${type === "talk" ? "INQ-" : "QUO-"}...), name or email`}
          value={search}
          onChange={(e) => { setSearch(e.target.value); setOffset(0); }}
        />
        <select className="ad-select" style={{ width: "auto" }} value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setOffset(0); }}>
          <option value="">All Email Statuses</option>
          {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s.replace(/_/g, " ")}</option>)}
        </select>
        <span className="ad-filter-count">{total} records</span>
      </div>

      <ConfirmDeleteModal
        open={!!deleteTarget}
        title="Delete this record?"
        description="This will permanently remove the record and cannot be undone."
        onConfirm={() => void handleDelete()}
        onCancel={() => setDeleteTarget(null)}
        confirming={!!deleting}
      />

      <AdminModal
        open={!!editingRow}
        onClose={() => { setEditingRow(null); setEditMsg(""); }}
        title={`Edit ${type === "talk" ? "Talk Inquiry" : "Quotation Request"}`}
      >
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
          <button onClick={() => void handleEditSave()} disabled={editSaving} className="ad-btn">{editSaving ? "Saving…" : "Save Changes"}</button>
          {editMsg && <Toast msg={editMsg} />}
        </div>
      </AdminModal>

      {previewRow && (
        <AdminModal
          open={!!previewRow}
          onClose={() => setPreviewRow(null)}
          title={type === "talk" ? "Talk Inquiry Details" : "Quotation Request Details"}
          subtitle={fmtRef(previewRow.id as string, type)}
        >
          {type === "talk" ? (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px 20px" }}>
              <div><div style={{ fontSize: 11, fontWeight: 700, color: "var(--ad-text3)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 3 }}>Reference</div><div style={{ fontSize: 14, color: "var(--ad-text)", fontFamily: "monospace" }}>{fmtRef(previewRow.id as string, type)}</div></div>
              <div><div style={{ fontSize: 11, fontWeight: 700, color: "var(--ad-text3)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 3 }}>Date</div><div style={{ fontSize: 14, color: "var(--ad-text)" }}>{fmt(previewRow.createdAt as string)}</div></div>
              <div><div style={{ fontSize: 11, fontWeight: 700, color: "var(--ad-text3)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 3 }}>Name</div><div style={{ fontSize: 14, color: "var(--ad-text)" }}>{previewRow.name as string}</div></div>
              <div><div style={{ fontSize: 11, fontWeight: 700, color: "var(--ad-text3)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 3 }}>Email</div><div style={{ fontSize: 14, color: "var(--ad-text)", wordBreak: "break-all" }}>{previewRow.email as string}</div></div>
              <div><div style={{ fontSize: 11, fontWeight: 700, color: "var(--ad-text3)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 3 }}>Phone</div><div style={{ fontSize: 14, color: "var(--ad-text)" }}>{(previewRow.phone as string) || "—"}</div></div>
              <div><div style={{ fontSize: 11, fontWeight: 700, color: "var(--ad-text3)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 3 }}>Location</div><div style={{ fontSize: 14, color: "var(--ad-text)" }}>{[previewRow.city, previewRow.province].filter(Boolean).join(", ") || "—"}</div></div>
              <div><div style={{ fontSize: 11, fontWeight: 700, color: "var(--ad-text3)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 3 }}>Inquiry Type</div><div style={{ fontSize: 14, color: "var(--ad-text)" }}>{previewRow.inquiryType as string}</div></div>
              <div><div style={{ fontSize: 11, fontWeight: 700, color: "var(--ad-text3)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 3 }}>Email Status</div><div style={{ fontSize: 14, color: "var(--ad-text)" }}><StatusBadge status={previewRow.status as string} /></div></div>
              <div><div style={{ fontSize: 11, fontWeight: 700, color: "var(--ad-text3)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 3 }}>Project Status</div><div style={{ fontSize: 14, color: PROJECT_STATUS_COLORS[(previewRow.projectStatus as string) ?? "new"] ?? "var(--ad-text)" }}>{PROJECT_STATUS_OPTIONS.find(o => o.value === (previewRow.projectStatus ?? "new"))?.label ?? "New"}</div></div>
              <div style={{ gridColumn: "1 / -1" }}><div style={{ fontSize: 11, fontWeight: 700, color: "var(--ad-text3)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 3 }}>Message</div><div style={{ fontSize: 14, color: "var(--ad-text)", lineHeight: 1.6, whiteSpace: "pre-wrap" }}>{(previewRow.message as string) || "—"}</div></div>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px 20px" }}>
              <div><div style={{ fontSize: 11, fontWeight: 700, color: "var(--ad-text3)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 3 }}>Reference</div><div style={{ fontSize: 14, color: "var(--ad-text)", fontFamily: "monospace" }}>{fmtRef(previewRow.id as string, type)}</div></div>
              <div><div style={{ fontSize: 11, fontWeight: 700, color: "var(--ad-text3)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 3 }}>Date</div><div style={{ fontSize: 14, color: "var(--ad-text)" }}>{fmt(previewRow.createdAt as string)}</div></div>
              <div><div style={{ fontSize: 11, fontWeight: 700, color: "var(--ad-text3)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 3 }}>Name</div><div style={{ fontSize: 14, color: "var(--ad-text)" }}>{previewRow.fullName as string}</div></div>
              <div><div style={{ fontSize: 11, fontWeight: 700, color: "var(--ad-text3)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 3 }}>Email</div><div style={{ fontSize: 14, color: "var(--ad-text)", wordBreak: "break-all" }}>{previewRow.email as string}</div></div>
              <div><div style={{ fontSize: 11, fontWeight: 700, color: "var(--ad-text3)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 3 }}>Phone</div><div style={{ fontSize: 14, color: "var(--ad-text)" }}>{(previewRow.phone as string) || "—"}</div></div>
              <div><div style={{ fontSize: 11, fontWeight: 700, color: "var(--ad-text3)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 3 }}>Location</div><div style={{ fontSize: 14, color: "var(--ad-text)" }}>{(previewRow.location as string) || "—"}</div></div>
              <div><div style={{ fontSize: 11, fontWeight: 700, color: "var(--ad-text3)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 3 }}>Property Classification</div><div style={{ fontSize: 14, color: "var(--ad-text)" }}>{(previewRow.propertyClassification as string) || "—"}</div></div>
              <div><div style={{ fontSize: 11, fontWeight: 700, color: "var(--ad-text3)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 3 }}>System Size</div><div style={{ fontSize: 14, color: "var(--ad-text)" }}>{(previewRow.estimatedSystemSizeDisplayText as string) || "—"}</div></div>
              <div><div style={{ fontSize: 11, fontWeight: 700, color: "var(--ad-text3)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 3 }}>Monthly Bill</div><div style={{ fontSize: 14, color: "var(--ad-text)" }}>{previewRow.monthlyBill != null ? `₱${(previewRow.monthlyBill as number).toLocaleString("en-PH")}` : "—"}</div></div>
              <div><div style={{ fontSize: 11, fontWeight: 700, color: "var(--ad-text3)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 3 }}>Estimated Savings</div><div style={{ fontSize: 14, color: "var(--ad-text)" }}>{(previewRow.estimatedSavings as string) || "—"}</div></div>
              <div><div style={{ fontSize: 11, fontWeight: 700, color: "var(--ad-text3)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 3 }}>Configuration</div><div style={{ fontSize: 14, color: "var(--ad-text)" }}>{(previewRow.configuration as string) || "—"}</div></div>
              <div><div style={{ fontSize: 11, fontWeight: 700, color: "var(--ad-text3)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 3 }}>Email Status</div><div style={{ fontSize: 14, color: "var(--ad-text)" }}><StatusBadge status={previewRow.status as string} /></div></div>
              <div><div style={{ fontSize: 11, fontWeight: 700, color: "var(--ad-text3)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 3 }}>Project Status</div><div style={{ fontSize: 14, color: PROJECT_STATUS_COLORS[(previewRow.projectStatus as string) ?? "new"] ?? "var(--ad-text)" }}>{PROJECT_STATUS_OPTIONS.find(o => o.value === (previewRow.projectStatus ?? "new"))?.label ?? "New"}</div></div>
              <div style={{ gridColumn: "1 / -1" }}><div style={{ fontSize: 11, fontWeight: 700, color: "var(--ad-text3)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 3 }}>Message</div><div style={{ fontSize: 14, color: "var(--ad-text)", lineHeight: 1.6, whiteSpace: "pre-wrap" }}>{(previewRow.message as string) || "—"}</div></div>
            </div>
          )}
        </AdminModal>
      )}

      {loading ? (
        <div style={{ color: "var(--ad-text2)", padding: 24 }}>Loading…</div>
      ) : (
        <div className="ad-table-wrap">
          <table className="ad-table">
            <thead>
              <tr>
                <th>Reference</th>
                {type === "talk" ? (
                  <><th>Name</th><th>Email</th><th>Location</th><th>Type</th></>
                ) : (
                  <><th>Name</th><th>Email</th><th>System Size</th><th>Property</th></>
                )}
                <th>Date</th><th>Email Status</th><th>Project Status</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {(data as Array<Record<string, unknown>>).map((row) => (
                <tr key={row.id as string}>
                  <td>
                    <span style={{ fontFamily: "monospace", fontSize: 12, background: "var(--ad-surface)", border: "1px solid var(--ad-border)", borderRadius: 5, padding: "2px 7px", color: "var(--ad-accent)", fontWeight: 700, letterSpacing: "0.06em", whiteSpace: "nowrap" }}>
                      {fmtRef(row.id as string, type)}
                    </span>
                  </td>
                  {type === "talk" ? (
                    <><td>{row.name as string}</td><td style={{ fontSize: 12 }}>{row.email as string}</td>
                    <td style={{ fontSize: 12 }}>{[row.city, row.province].filter(Boolean).join(", ")}</td>
                    <td>{row.inquiryType as string}</td></>
                  ) : (
                    <><td>{row.fullName as string}</td><td style={{ fontSize: 12 }}>{row.email as string}</td>
                    <td>{row.estimatedSystemSizeDisplayText as string}</td>
                    <td>{row.propertyClassification as string}</td></>
                  )}
                  <td style={{ fontSize: 12 }}>{fmt(row.createdAt as string)}</td>
                  <td>
                    <select
                      className="ad-status-select"
                      value={row.status as string}
                      disabled={updating === row.id || retrying === row.id}
                      onChange={(e) => void handleStatusChange(row.id as string, e.target.value)}
                    >
                      {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s.replace(/_/g, " ")}</option>)}
                    </select>
                    <EmailStatusIndicator status={row.status as string} id={row.id as string} onRetry={(id) => void handleRetryEmail(id)} retrying={retrying === row.id} />
                  </td>
                  <td>
                    <select
                      className="ad-status-select"
                      value={(row.projectStatus as string) ?? "new"}
                      disabled={updatingProject === row.id}
                      onChange={(e) => void handleProjectStatusChange(row.id as string, e.target.value)}
                      style={{ color: PROJECT_STATUS_COLORS[(row.projectStatus as string) ?? "new"] ?? "inherit" }}
                    >
                      {PROJECT_STATUS_OPTIONS.map((o) => (
                        <option key={o.value} value={o.value} style={{ color: PROJECT_STATUS_COLORS[o.value] }}>{o.label}</option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <div className="ad-table-actions">
                      <button onClick={() => setPreviewRow(row)} className="ad-btn ad-btn--ghost ad-btn--sm">View</button>
                      <button onClick={() => openEdit(row)} disabled={!!editingRow || deleting === (row.id as string)} className="ad-btn ad-btn--ghost ad-btn--sm">Edit</button>
                      <button onClick={() => setDeleteTarget(row.id as string)} disabled={deleting === (row.id as string) || !!editingRow} className="ad-btn ad-btn--danger ad-btn--sm" style={{ opacity: deleting === (row.id as string) ? 0.5 : 1 }}>
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

type ProjectForm = { title: string; category: ApiProjectCategory; system: string; savings: string; isRecent: boolean };
const EMPTY_PROJECT_FORM: ProjectForm = { title: "", category: "Residential", system: "", savings: "", isRecent: false };

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
  const [previewProject, setPreviewProject] = useState<ApiProject | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; title: string } | null>(null);

  const load = async () => {
    setLoading(true);
    try { const res = await adminGetProjects(apiKey); setProjects(res.data); }
    finally { setLoading(false); }
  };

  useEffect(() => { void load(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const openAdd = () => { setEditingId(null); setForm(EMPTY_PROJECT_FORM); setImageFile(null); setImagePreview(""); setMsg(""); setShowForm(true); };
  const openEdit = (p: ApiProject) => {
    setEditingId(p.id);
    setForm({ title: p.title, category: p.category, system: p.system, savings: p.savings, isRecent: p.isRecent });
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

  const setField = <K extends keyof ProjectForm>(key: K, value: ProjectForm[K]) => setForm((f) => ({ ...f, [key]: value }));

  const handleSave = async () => {
    if (!form.title.trim() || !form.system.trim() || !form.savings.trim()) { setMsg("Error: Title, System, and Savings are required."); return; }
    if (!editingId && !imageFile) { setMsg("Error: Please upload a project image."); return; }
    setSaving(true); setMsg("");
    try {
      const payload: ProjectInput = { ...form, imageFile: imageFile ?? undefined };
      if (editingId) { await adminUpdateProject(apiKey, editingId, payload); setMsg("✓ Project updated"); }
      else { await adminCreateProject(apiKey, payload); setMsg("✓ Project created"); }
      await load(); closeForm();
    } catch (e) { setMsg(`Error: ${(e as Error).message}`); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(deleteTarget.id);
    try { await adminDeleteProject(apiKey, deleteTarget.id); setMsg("✓ Project deleted"); await load(); }
    catch (e) { setMsg(`Error: ${(e as Error).message}`); }
    finally { setDeleting(null); setDeleteTarget(null); }
  };

  return (
    <div>
      <div className="ad-section-header">
        <div className="ad-section-title">Projects Portfolio</div>
        <button onClick={openAdd} className="ad-btn ad-btn--sm">+ Add Project</button>
      </div>
      <Toast msg={msg} />

      <ConfirmDeleteModal
        open={!!deleteTarget}
        title={`Delete "${deleteTarget?.title}"?`}
        description="This will permanently remove the project and cannot be undone."
        onConfirm={() => void handleDelete()}
        onCancel={() => setDeleteTarget(null)}
        confirming={!!deleting}
      />

      {previewProject && (
        <AdminModal
          open={!!previewProject}
          onClose={() => setPreviewProject(null)}
          title={previewProject.title}
          subtitle={`${previewProject.category} · Created ${new Date(previewProject.createdAt).toLocaleDateString()}`}
        >
          {previewProject.imageUrl && (
            <div style={{ marginBottom: 16 }}>
              <img src={previewProject.imageUrl} alt={previewProject.title} style={{ width: "100%", maxHeight: 220, objectFit: "cover", borderRadius: 8, border: "1px solid var(--ad-border)" }} />
            </div>
          )}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px 20px" }}>
            <div><div style={{ fontSize: 11, fontWeight: 700, color: "var(--ad-text3)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 3 }}>Title</div><div style={{ fontSize: 14, color: "var(--ad-text)", fontWeight: 600 }}>{previewProject.title}</div></div>
            <div><div style={{ fontSize: 11, fontWeight: 700, color: "var(--ad-text3)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 3 }}>Category</div><div style={{ fontSize: 14 }}><span className={`ad-badge ${categoryClass(previewProject.category)}`}>{previewProject.category}</span></div></div>
            <div><div style={{ fontSize: 11, fontWeight: 700, color: "var(--ad-text3)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 3 }}>System</div><div style={{ fontSize: 14, color: "var(--ad-text)" }}>{previewProject.system}</div></div>
            <div><div style={{ fontSize: 11, fontWeight: 700, color: "var(--ad-text3)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 3 }}>Estimated Savings</div><div style={{ fontSize: 14, color: "var(--ad-text)" }}>{previewProject.savings}</div></div>
            <div><div style={{ fontSize: 11, fontWeight: 700, color: "var(--ad-text3)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 3 }}>Recent</div><div style={{ fontSize: 14, color: previewProject.isRecent ? "#22c55e" : "var(--ad-text3)" }}>{previewProject.isRecent ? "Yes — shown as recent" : "No"}</div></div>
            <div><div style={{ fontSize: 11, fontWeight: 700, color: "var(--ad-text3)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 3 }}>Created</div><div style={{ fontSize: 14, color: "var(--ad-text)" }}>{new Date(previewProject.createdAt).toLocaleDateString()}</div></div>
          </div>
        </AdminModal>
      )}

      <AdminModal
        open={showForm}
        onClose={closeForm}
        title={editingId ? "Edit Project" : "Add New Project"}
      >
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
              <div className="ad-image-drop" style={{ flex: 1 }} onClick={() => document.getElementById("proj-img-input")?.click()} onDragOver={(e) => e.preventDefault()} onDrop={(e) => { e.preventDefault(); handleImageSelect(e.dataTransfer.files?.[0]); }}>
                <input id="proj-img-input" type="file" accept="image/jpeg,image/png,image/webp,image/gif,image/avif" hidden onChange={(e) => handleImageSelect(e.target.files?.[0])} />
                {imageFile ? <span>{imageFile.name} ({(imageFile.size / 1024).toFixed(0)} KB)</span> : <>Click or drag &amp; drop an image<br /><small>JPEG, PNG, WebP, AVIF — max 8 MB</small></>}
              </div>
              {imagePreview && <img src={imagePreview} alt="Preview" className="ad-image-preview" />}
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, paddingTop: 22 }}>
            <input type="checkbox" id="isRecent" checked={form.isRecent} onChange={(e) => setField("isRecent", e.target.checked)} style={{ width: 16, height: 16, cursor: "pointer", accentColor: "var(--ad-accent)" }} />
            <label htmlFor="isRecent" style={{ color: "var(--ad-text)", fontSize: 13, cursor: "pointer" }}>Mark as Recent Project</label>
          </div>
        </div>
        <div className="ad-form-actions">
          <button onClick={() => void handleSave()} disabled={saving} className="ad-btn">{saving ? "Saving…" : editingId ? "Update Project" : "Create Project"}</button>
        </div>
      </AdminModal>
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
            <thead><tr><th>Title</th><th>Category</th><th>System</th><th>Savings</th><th>Recent</th><th>Created</th><th>Actions</th></tr></thead>
            <tbody>
              {projects.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map((p) => (
                <tr key={p.id}>
                  <td>
                    <div className="ad-proj-title-cell">
                      {p.imageUrl && <img src={p.imageUrl} alt={p.title} className="ad-proj-thumb" />}
                      <span style={{ fontWeight: 600 }}>{p.title}</span>
                    </div>
                  </td>
                  <td><span className={`ad-badge ${categoryClass(p.category)}`}>{p.category}</span></td>
                  <td>{p.system}</td><td>{p.savings}</td>
                  <td>{p.isRecent ? <span className="ad-badge is-recent">Recent</span> : <span style={{ color: "var(--ad-text3)" }}>—</span>}</td>
                  <td style={{ fontSize: 12 }}>{new Date(p.createdAt).toLocaleDateString()}</td>
                  <td>
                    <div className="ad-table-actions">
                      <button onClick={() => setPreviewProject(p)} className="ad-btn ad-btn--ghost ad-btn--sm">View</button>
                      <button onClick={() => openEdit(p)} className="ad-btn ad-btn--ghost ad-btn--sm">Edit</button>
                      <button onClick={() => setDeleteTarget({ id: p.id, title: p.title })} disabled={deleting === p.id} className="ad-btn ad-btn--danger ad-btn--sm" style={{ opacity: deleting === p.id ? 0.5 : 1 }}>
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
  { key: "hero",         name: "Hero",                  desc: "Main hero banner with headline" },
  { key: "metrics",      name: "Metrics",               desc: "Stats strip (installs, warranty, savings…)" },
  { key: "benefits",     name: "Benefits",              desc: "Benefits banner row" },
  { key: "excellence",   name: "Engineered Excellence", desc: "Products & quality section" },
  { key: "tropics",      name: "Tropics",               desc: "Designed for the tropics section" },
  { key: "process",      name: "Process",               desc: "Step-by-step process section" },
  { key: "clientJourney", name: "Client Journey",       desc: "Testimonials map carousel" },
  { key: "calculator",   name: "Calculator",            desc: "Solar impact calculator" },
  { key: "callToAction", name: "Call to Action",        desc: "Final CTA section" },
  { key: "packages",     name: "Packages Page",         desc: "Public /packages route — hides nav link and redirects when off" },
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
        const item = res.data.find((i: { key: string }) => i.key === "section-visibility");
        if (item?.data) setVis({ ...DEFAULT_VISIBILITY, ...(item.data as Partial<SectionVisibility>) });
      } finally { setLoading(false); }
    };
    void load();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSave = async () => {
    setSaving(true); setMsg("");
    try {
      await adminUpsertContent(apiKey, "section-visibility", vis);
      setMsg("✓ Section visibility saved");
    } catch (e) { setMsg(`Error: ${(e as Error).message}`); }
    finally { setSaving(false); }
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
              <input type="checkbox" checked={vis[key]} onChange={(e) => setVis((v) => ({ ...v, [key]: e.target.checked }))} />
              <span className="ad-toggle-track" />
            </label>
          </div>
        ))}
      </div>
      <div className="ad-sections-save-bar">
        <button onClick={() => void handleSave()} disabled={saving} className="ad-btn">{saving ? "Saving…" : "Save Changes"}</button>
        <Toast msg={msg} />
      </div>
    </div>
  );
}

type PkgForm = PackageInput;
const EMPTY_PKG_FORM: PkgForm = { name: "", solarKwp: 0, inverterKw: 0, storageKwh: 0, phase: "single", billRangeMin: 0, billRangeMax: 0, isActive: true, isRecommended: false, mainFeatures: [], imageUrl: null };

const ACCESSORY_CATEGORIES = ['Mounting & Racking', 'Wiring & Protection', 'Monitoring', 'Others'];

function EditableNumber({ value, min = 1, max = null, onChange, className, style }: {
  value: number; min?: number; max?: number | null; onChange: (n: number) => void;
  className?: string; style?: CSSProperties;
}) {
  const [draft, setDraft] = useState<string | null>(null);
  return (
    <input
      type="text"
      inputMode="numeric"
      className={className}
      style={style}
      value={draft !== null ? draft : String(value)}
      onFocus={e => { setDraft(String(value)); e.currentTarget.select(); }}
      onChange={e => setDraft(e.target.value.replace(/[^0-9]/g, ''))}
      onBlur={() => {
        const n = Math.max(min, parseInt(draft ?? '', 10) || min);
        const clamped = max != null ? Math.min(n, max) : n;
        onChange(clamped);
        setDraft(null);
      }}
      onKeyDown={e => { if (e.key === 'Enter') (e.target as HTMLInputElement).blur(); }}
    />
  );
}

function recomputeDerivedQtys(lines: PackageComponentLine[]): PackageComponentLine[] {
  return lines.map(line => {
    if (!line.baseComponentId) return line;
    const baseLine = lines.find(l => l.componentId === line.baseComponentId && !l.baseComponentId);
    if (!baseLine) return { ...line, baseComponentId: null };
    return { ...line, quantity: Math.max(1, Math.ceil(baseLine.quantity * (line.multiplier ?? 1))) };
  });
}

function autoName(kwp: number, kw: number, kwh: number) {
  const parts: string[] = [];
  if (kwp > 0) parts.push(`${kwp.toFixed(2)} kWp`);
  if (kw > 0) parts.push(`${kw.toFixed(1)} kW`);
  if (kwh > 0) parts.push(`${kwh.toFixed(2)} kWh`);
  return parts.length > 0 ? parts.join(" · ") : "Package";
}

// PC Builder - Component Selector
type SelectedComponent = { componentId: string; quantity: number };

function computePackageSpecs(selected: SelectedComponent[], components: ApiSolarComponent[]): { solarKwp: number; inverterKw: number; storageKwh: number } {
  let solarKwp = 0, inverterKw = 0, storageKwh = 0;
  selected.forEach(sel => {
    const comp = components.find(c => c.id === sel.componentId);
    if (!comp) return;
    // Only add to totals if the component has a non-zero spec value
    if (comp.productionCapacityKwp > 0) solarKwp += comp.productionCapacityKwp * sel.quantity;
    if (comp.loadCapacityKw > 0) inverterKw += comp.loadCapacityKw * sel.quantity;
    if (comp.storageCapacityKwh > 0) storageKwh += comp.storageCapacityKwh * sel.quantity;
  });
  return { solarKwp: Math.round(solarKwp * 100) / 100, inverterKw: Math.round(inverterKw * 10) / 10, storageKwh: Math.round(storageKwh * 100) / 100 };
}

// ─── ComponentsManager ────────────────────────────────────────────────────────

type ViolatedPackage = {
  id: string; name: string; isActive: boolean; violations: string[];
  components: PackageUsageItem['components'];
};
type CleanedResult = { id: string; name: string; removed: string[]; error?: string };

function computePkgViolations(
  pkg: PackageUsageItem,
  editedId: string,
  newForm: Pick<ComponentInput, 'pvMaxPower' | 'pvMinPower' | 'batteryMaxCapacity' | 'loadCapacityKw' | 'parallelMax' | 'productionCapacityKwp' | 'storageCapacityKwh'>
): string[] {
  const violations: string[] = [];
  const invLine   = pkg.components.find(l => l.component.category === 'Inverter');
  const panelLine = pkg.components.find(l => l.component.category === 'Solar Panel');
  const battLine  = pkg.components.find(l => l.component.category === 'Battery');
  if (!invLine) return violations;

  const isEditedInv = invLine.componentId === editedId;
  const invQty = invLine.quantity;

  const pvMax = isEditedInv
    ? (newForm.pvMaxPower ?? newForm.loadCapacityKw)
    : (invLine.component.pvMaxPower ?? invLine.component.loadCapacityKw);

  const battMax = isEditedInv
    ? (newForm.batteryMaxCapacity ?? newForm.loadCapacityKw)
    : (invLine.component.batteryMaxCapacity ?? invLine.component.loadCapacityKw);

  if (panelLine) {
    const isEditedPanel = panelLine.componentId === editedId;
    const panelKwp = isEditedPanel
      ? (newForm.productionCapacityKwp ?? 0)
      : panelLine.component.productionCapacityKwp;
    if (panelKwp > 0 && pvMax != null) {
      const maxPanels = Math.floor(pvMax * invQty / panelKwp);
      if (panelLine.quantity > maxPanels) {
        violations.push(
          `Panels: ${panelLine.quantity} installed, new max is ${maxPanels} (${(panelLine.quantity * panelKwp).toFixed(2)} kWp > ${(pvMax * invQty).toFixed(2)} kWp limit)`
        );
      }
    }
  }

  if (battLine) {
    const isEditedBatt = battLine.componentId === editedId;
    const battKwh = isEditedBatt
      ? (newForm.storageCapacityKwh ?? 0)
      : battLine.component.storageCapacityKwh;
    if (battKwh > 0 && battMax != null) {
      const maxBatt = Math.floor(battMax * invQty / battKwh);
      if (battLine.quantity > maxBatt) {
        violations.push(
          `Batteries: ${battLine.quantity} installed, new max is ${maxBatt} (${(battLine.quantity * battKwh).toFixed(1)} kWh > ${(battMax * invQty).toFixed(1)} kWh limit)`
        );
      }
    }
  }

  if (isEditedInv) {
    const newParallelMax = newForm.parallelMax ?? 4;
    if (invQty > newParallelMax) {
      violations.push(`Inverters: ${invQty} installed, new parallel limit is ${newParallelMax}`);
    }
  }

  return violations;
}

const COMPONENT_CATEGORIES = [
  "Solar Panel", "Inverter", "Battery", "Mounting & Racking",
  "Wiring & Protection", "Monitoring", "Others",
];

const EMPTY_COMP: ComponentInput = {
  name: "", brand: "", model: "", category: "Solar Panel",
  pricingEnabled: false, isActive: true,
  productionCapacityKwp: 0, loadCapacityKw: 0, storageCapacityKwh: 0,
  capacityUnit: "Wp",
  parallelMin: 1, parallelMax: 4, perInverterMin: 1, perInverterMax: 4,
  pvMinPower: null, pvMaxPower: null, batteryMaxCapacity: null,
  dataSheetUrl: null,
};

function ComponentsManager({ apiKey, onGoToPackages }: { apiKey: string; onGoToPackages?: () => void }) {
  const [components, setComponents] = useState<ApiSolarComponent[]>([]);
  const [loading, setLoading]       = useState(true);
  const [showForm, setShowForm]     = useState(false);
  const [editingId, setEditingId]   = useState<string | null>(null);
  const [form, setForm]             = useState<ComponentInput>(EMPTY_COMP);
  const [saving, setSaving]         = useState(false);
  const [deleting, setDeleting]     = useState<string | null>(null);
  const [msg, setMsg]               = useState("");
  const [catSearches, setCatSearches] = useState<Record<string, string>>({}); // Search per category
  const [componentPage, setComponentPage] = useState<Record<string, number>>({}); // Page per category
  // Edit-confirmation state — set when editing a component that's used in packages
  const [editConfirm, setEditConfirm] = useState<ViolatedPackage[] | null>(null);
  // Post-save cleanup state — shown after auto-removing violating components from packages
  const [postSaveCleanup, setPostSaveCleanup] = useState<CleanedResult[] | null>(null);
  const [previewComponent, setPreviewComponent] = useState<ApiSolarComponent | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);

  const load = async () => {
    setLoading(true);
    try { const r = await adminGetComponents(apiKey); setComponents(r.data); }
    finally { setLoading(false); }
  };
  useEffect(() => { void load(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-clear messages after a timeout
  useEffect(() => {
    if (!msg) return;
    const isSuccess = msg.startsWith("✓");
    const timeout = setTimeout(() => setMsg(""), isSuccess ? 1500 : 3000);
    return () => clearTimeout(timeout);
  }, [msg]);

  const setF = <K extends keyof ComponentInput>(k: K, v: ComponentInput[K]) =>
    setForm(f => ({ ...f, [k]: v }));

  const openAdd  = () => { setEditingId(null); setForm(EMPTY_COMP); setCatSearches({}); setMsg(""); setShowForm(true); };
  const openEdit = (c: ApiSolarComponent) => {
    setEditingId(c.id);
    const spec = CATEGORY_SPEC[c.category];
    // Reopen in the unit it was saved with; fall back to the category default for
    // pre-existing components that have no persisted unit (constraint 4).
    const unit = (c.capacityUnit && spec?.offer.includes(c.capacityUnit)) ? c.capacityUnit : (spec?.default ?? null);
    // Normalize fields that may be stale or inconsistent in older records.
    // pricingEnabled is coerced false when unitPrice is missing to avoid blocking save.
    const hasPricing = c.pricingEnabled && c.unitPrice != null;
    setForm({
      name: c.name, brand: c.brand, model: c.model, category: c.category,
      unitPrice: c.unitPrice ?? undefined,
      pricingEnabled: hasPricing, isActive: c.isActive,
      productionCapacityKwp: c.productionCapacityKwp ?? 0,
      loadCapacityKw: c.loadCapacityKw ?? 0,
      storageCapacityKwh: c.storageCapacityKwh ?? 0,
      capacityUnit: unit,
      parallelMin: c.parallelMin ?? 1,
      parallelMax: c.parallelMax ?? 4,
      perInverterMin: c.perInverterMin ?? 1,
      perInverterMax: c.perInverterMax ?? 4,
      pvMinPower: c.pvMinPower ?? null,
      pvMaxPower: c.pvMaxPower ?? null,
      batteryMaxCapacity: c.batteryMaxCapacity ?? null,
      dataSheetUrl: c.dataSheetUrl?.trim() || null,
    });
    setMsg(""); setEditConfirm(null); setShowForm(true);
  };
  const closeForm = () => { setShowForm(false); setCatSearches({}); setMsg(""); setEditConfirm(null); setPostSaveCleanup(null); };

  const handleSave = async (bypassConfirm = false) => {
    if (!form.name.trim() || !form.brand.trim() || !form.model.trim()) {
      setMsg("Please enter component name, brand, and model"); return;
    }
    if (form.category === 'Solar Panel' && (!form.productionCapacityKwp || form.productionCapacityKwp <= 0)) {
      setMsg("Please enter Production Capacity (must be greater than 0 kWp)"); return;
    }
    if (form.category === 'Inverter' && (!form.loadCapacityKw || form.loadCapacityKw <= 0)) {
      setMsg("Please enter Load Capacity (must be greater than 0 kW)"); return;
    }
    if (form.category === 'Battery' && (!form.storageCapacityKwh || form.storageCapacityKwh <= 0)) {
      setMsg("Please enter Storage Capacity (must be greater than 0 kWh)"); return;
    }
    if (form.pricingEnabled && (form.unitPrice == null || form.unitPrice <= 0)) {
      setMsg("Please enter a unit price when pricing is enabled"); return;
    }

    // For edits: check if the component is used in packages before proceeding
    if (editingId && !bypassConfirm) {
      setSaving(true);
      try {
        const usage = await adminGetComponentUsage(apiKey, editingId);
        if (usage.data.length > 0) {
          const oldComp = components.find(c => c.id === editingId);
          const ratingChanged = !oldComp || (
            (form.category === 'Inverter' && (
              (form.pvMaxPower ?? null) !== (oldComp.pvMaxPower ?? null) ||
              (form.pvMinPower ?? null) !== (oldComp.pvMinPower ?? null) ||
              (form.batteryMaxCapacity ?? null) !== (oldComp.batteryMaxCapacity ?? null) ||
              form.loadCapacityKw !== oldComp.loadCapacityKw ||
              (form.parallelMax ?? 4) !== (oldComp.parallelMax ?? 4)
            )) ||
            (form.category === 'Solar Panel' && form.productionCapacityKwp !== oldComp.productionCapacityKwp) ||
            (form.category === 'Battery' && form.storageCapacityKwh !== oldComp.storageCapacityKwh)
          );
          const withViolations: ViolatedPackage[] = usage.data.map(pkg => ({
            id: pkg.id,
            name: pkg.name,
            isActive: pkg.isActive,
            violations: ratingChanged ? computePkgViolations(pkg, editingId, form) : [],
            components: pkg.components,
          }));
          setEditConfirm(withViolations);
          return; // Hold — wait for user confirmation in the UI
        }
      } catch { /* if check fails, proceed with save */ }
      finally { setSaving(false); }
    }

    setSaving(true); setMsg("");
    try {
      const spec = CATEGORY_SPEC[form.category];
      const payload = {
        ...form,
        unitPrice: form.pricingEnabled ? form.unitPrice : undefined,
        capacityUnit: spec ? (form.capacityUnit ?? spec.default) : null,
        dataSheetUrl: form.dataSheetUrl?.trim() || null,
      };
      const affectedPackages = editConfirm ?? [];
      const violatedPackages = affectedPackages.filter(p => p.violations.length > 0);
      if (editingId) {
        await adminUpdateComponent(apiKey, editingId, payload);

        if (violatedPackages.length > 0) {
          // Auto-remove the out-of-bounds component lines from each affected package
          const cleanResults: CleanedResult[] = [];
          for (const pkg of violatedPackages) {
            const toRemove = new Set<string>();
            pkg.violations.forEach(v => {
              if (v.startsWith('Panels:'))    toRemove.add('Solar Panel');
              if (v.startsWith('Batteries:')) toRemove.add('Battery');
              if (v.startsWith('Inverters:')) toRemove.add('Inverter');
            });
            const keptComponents = pkg.components
              .filter(l => !toRemove.has(l.component.category))
              .map(l => ({ componentId: l.componentId, quantity: l.quantity, baseComponentId: l.baseComponentId ?? null, multiplier: l.multiplier ?? 1 }));
            try {
              await adminUpdatePackage(apiKey, pkg.id, { components: keptComponents });
              cleanResults.push({ id: pkg.id, name: pkg.name, removed: [...toRemove] });
            } catch (err) {
              cleanResults.push({ id: pkg.id, name: pkg.name, removed: [...toRemove], error: (err as Error).message });
            }
          }
          setEditConfirm(null);
          await load();
          setMsg(`✓ Component updated — ${cleanResults.length} package${cleanResults.length !== 1 ? 's' : ''} cleaned up`);
          setPostSaveCleanup(cleanResults);
        } else if (affectedPackages.length > 0) {
          setEditConfirm(null);
          await load();
          setMsg(`✓ Component updated — review ${affectedPackages.length} affected package${affectedPackages.length !== 1 ? 's' : ''}: ${affectedPackages.map(p => p.name).join(', ')}`);
          setTimeout(closeForm, 3000);
        } else {
          setEditConfirm(null);
          await load();
          setMsg("✓ Component updated successfully");
          setTimeout(closeForm, 1500);
        }
      } else {
        await adminCreateComponent(apiKey, payload);
        setMsg("✓ Component added to inventory");
        setEditConfirm(null);
        await load();
        setTimeout(closeForm, 1500);
      }
    } catch (e) {
      const errorMsg = (e as Error).message;
      if (errorMsg.includes("409") || errorMsg.includes("conflict")) {
        setMsg("This component already exists in your inventory");
      } else {
        setMsg(`Save failed: ${errorMsg}`);
      }
    }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: string, name: string) => {
    // usage check — if component is in packages, block deletion with setMsg
    const usage = await adminGetComponentUsage(apiKey, id).catch(() => ({ data: [] }));
    if (usage.data.length > 0) {
      const packageList = usage.data.map((p: { name: string }) => `"${p.name}"`).join(", ");
      setMsg(`Cannot delete "${name}" — it is used in ${usage.data.length} package${usage.data.length !== 1 ? "s" : ""}: ${packageList}. Remove it from those packages first.`);
      return;
    }
    setDeleteTarget({ id, name });
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(deleteTarget.id);
    try { await adminDeleteComponent(apiKey, deleteTarget.id); setMsg("✓ Component deleted"); await load(); }
    catch (e) { setMsg(`Delete failed: ${(e as Error).message}`); }
    finally { setDeleting(null); setDeleteTarget(null); }
  };

  const grouped = COMPONENT_CATEGORIES.map(cat => ({
    cat,
    items: components.filter(c => c.category === cat),
  })).filter(g => g.items.length > 0);

  const pesoCmp = (n: number | null) => n == null ? "—" : `₱${n.toLocaleString("en-PH", { minimumFractionDigits: 2 })}`;

  return (
    <div>
      <div className="ad-section-header">
        <div>
          <div className="ad-section-title">Solar Component Inventory</div>
          <div className="ad-section-sub">{loading ? "Loading…" : `${components.length} total — manage your solar panels, inverters, batteries, and accessories here. These components are used to build packages.`}</div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {!showForm && <button onClick={openAdd} className="ad-btn ad-btn--sm">+ Add Component</button>}
        </div>
      </div>

      <ConfirmDeleteModal
        open={!!deleteTarget}
        title={`Delete "${deleteTarget?.name}"?`}
        description="This component will be permanently removed."
        onConfirm={() => void confirmDelete()}
        onCancel={() => setDeleteTarget(null)}
        confirming={!!deleting}
      />

      {previewComponent && (
        <AdminModal
          open={!!previewComponent}
          onClose={() => setPreviewComponent(null)}
          title={previewComponent.name}
          subtitle={`${previewComponent.brand} · ${previewComponent.model} · ${previewComponent.category}`}
        >
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px 20px" }}>
            <div><div style={{ fontSize: 11, fontWeight: 700, color: "var(--ad-text3)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 3 }}>Name</div><div style={{ fontSize: 14, color: "var(--ad-text)", fontWeight: 600 }}>{previewComponent.name}</div></div>
            <div><div style={{ fontSize: 11, fontWeight: 700, color: "var(--ad-text3)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 3 }}>Category</div><div style={{ fontSize: 14, color: "var(--ad-text)" }}>{previewComponent.category}</div></div>
            <div><div style={{ fontSize: 11, fontWeight: 700, color: "var(--ad-text3)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 3 }}>Brand</div><div style={{ fontSize: 14, color: "var(--ad-text)" }}>{previewComponent.brand}</div></div>
            <div><div style={{ fontSize: 11, fontWeight: 700, color: "var(--ad-text3)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 3 }}>Model</div><div style={{ fontSize: 14, color: "var(--ad-text)" }}>{previewComponent.model}</div></div>
            <div><div style={{ fontSize: 11, fontWeight: 700, color: "var(--ad-text3)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 3 }}>Unit</div><div style={{ fontSize: 14, color: "var(--ad-text)" }}>{previewComponent.unit || "—"}</div></div>
            {previewComponent.pricingEnabled && <div><div style={{ fontSize: 11, fontWeight: 700, color: "var(--ad-text3)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 3 }}>Unit Price</div><div style={{ fontSize: 14, color: "var(--ad-text)" }}>{pesoCmp(previewComponent.unitPrice)}</div></div>}
            {(previewComponent.loadCapacityKw ?? 0) > 0 && <div><div style={{ fontSize: 11, fontWeight: 700, color: "var(--ad-text3)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 3 }}>Load Capacity</div><div style={{ fontSize: 14, color: "var(--ad-text)" }}>{previewComponent.loadCapacityKw} kW</div></div>}
            {(previewComponent.productionCapacityKwp ?? 0) > 0 && <div><div style={{ fontSize: 11, fontWeight: 700, color: "var(--ad-text3)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 3 }}>Production Capacity</div><div style={{ fontSize: 14, color: "var(--ad-text)" }}>{previewComponent.productionCapacityKwp} kWp</div></div>}
            {(previewComponent.storageCapacityKwh ?? 0) > 0 && <div><div style={{ fontSize: 11, fontWeight: 700, color: "var(--ad-text3)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 3 }}>Storage Capacity</div><div style={{ fontSize: 14, color: "var(--ad-text)" }}>{previewComponent.storageCapacityKwh} kWh</div></div>}
            {previewComponent.pvMinPower != null && <div><div style={{ fontSize: 11, fontWeight: 700, color: "var(--ad-text3)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 3 }}>Min PV Input</div><div style={{ fontSize: 14, color: "var(--ad-text)" }}>{previewComponent.pvMinPower} kWp</div></div>}
            {previewComponent.pvMaxPower != null && <div><div style={{ fontSize: 11, fontWeight: 700, color: "var(--ad-text3)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 3 }}>Max PV Input</div><div style={{ fontSize: 14, color: "var(--ad-text)" }}>{previewComponent.pvMaxPower} kWp</div></div>}
            {previewComponent.batteryMaxCapacity != null && <div><div style={{ fontSize: 11, fontWeight: 700, color: "var(--ad-text3)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 3 }}>Max Battery Capacity</div><div style={{ fontSize: 14, color: "var(--ad-text)" }}>{previewComponent.batteryMaxCapacity} kWh/unit</div></div>}
            {(previewComponent.parallelMin ?? 0) > 0 && <div><div style={{ fontSize: 11, fontWeight: 700, color: "var(--ad-text3)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 3 }}>Parallel Min / Max</div><div style={{ fontSize: 14, color: "var(--ad-text)" }}>{previewComponent.parallelMin} / {previewComponent.parallelMax}</div></div>}
            <div><div style={{ fontSize: 11, fontWeight: 700, color: "var(--ad-text3)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 3 }}>Active</div><div style={{ fontSize: 14, color: previewComponent.isActive ? "#22c55e" : "var(--ad-text3)" }}>{previewComponent.isActive ? "Yes" : "No"}</div></div>
            {previewComponent.dataSheetUrl && (
              <div style={{ gridColumn: "1 / -1" }}><div style={{ fontSize: 11, fontWeight: 700, color: "var(--ad-text3)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 3 }}>Data Sheet</div><div style={{ fontSize: 14 }}><a href={previewComponent.dataSheetUrl} target="_blank" rel="noopener noreferrer" style={{ color: "var(--ad-accent)" }}>{previewComponent.dataSheetUrl}</a></div></div>
            )}
          </div>
        </AdminModal>
      )}

      {msg && <Toast msg={msg} />}

      {showForm && (
        <>
          {/* Modal Overlay */}
          <div style={{
            position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
            background: "rgba(0, 0, 0, 0.5)", zIndex: 999,
            display: "flex", alignItems: "flex-start", justifyContent: "center",
            padding: "16px", overflow: "auto", paddingTop: "max(16px, 10vh)"
          }} onClick={closeForm}>
            {/* Modal Container - Responsive */}
            <div style={{
              background: "var(--ad-bg)", borderRadius: 8, boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
              width: "100%", maxWidth: "min(90vw, 650px)", maxHeight: "85vh",
              overflow: "auto", zIndex: 1000, display: "flex", flexDirection: "column"
            }} onClick={(e) => e.stopPropagation()}>
              {/* Modal Header - Sticky */}
              <div style={{
                padding: "16px 20px", borderBottom: "1px solid var(--ad-border)",
                display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12,
                flexShrink: 0, position: "sticky", top: 0, background: "var(--ad-bg)", zIndex: 10
              }}>
                <div style={{
                  fontSize: "clamp(14px, 4vw, 18px)", fontWeight: 700, color: "var(--ad-text)",
                  minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap"
                }}>
                  {editingId ? "Edit Component" : "Add Component"}
                </div>
                <button
                  onClick={closeForm}
                  style={{
                    background: "none", border: "none", fontSize: "24px", color: "var(--ad-text3)",
                    cursor: "pointer", padding: 0, width: 32, height: 32,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0, transition: "color 0.15s"
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = "var(--ad-accent)"}
                  onMouseLeave={(e) => e.currentTarget.style.color = "var(--ad-text3)"}
                >
                  ✕
                </button>
              </div>

              {/* Modal Body - Scrollable */}
              <div style={{
                padding: "clamp(12px, 4vw, 20px)", overflow: "auto", flex: 1, display: "flex", flexDirection: "column"
              }}>
                {postSaveCleanup ? (
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "#22c55e", marginBottom: 8 }}>✓ Component updated</div>
                    <div style={{ fontSize: 13, color: "var(--ad-text2)", marginBottom: 14, lineHeight: 1.5 }}>
                      Out-of-bounds components were automatically removed from {postSaveCleanup.length} package{postSaveCleanup.length !== 1 ? 's' : ''}. Open each package to reconfigure the quantities.
                    </div>
                    {postSaveCleanup.map(r => (
                      <div key={r.id} style={{ marginBottom: 8, padding: "10px 12px", background: r.error ? "rgba(220,38,38,0.06)" : "rgba(34,197,94,0.06)", border: `1px solid ${r.error ? "rgba(220,38,38,0.22)" : "rgba(34,197,94,0.2)"}`, borderRadius: 6 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: "var(--ad-text)", marginBottom: 3 }}>{r.name}</div>
                        {r.error
                          ? <div style={{ fontSize: 12, color: "#dc2626" }}>⚠ Failed to update: {r.error}</div>
                          : <div style={{ fontSize: 12, color: "var(--ad-text3)" }}>Removed: {r.removed.join(', ')}</div>
                        }
                      </div>
                    ))}
                    <div style={{ display: "flex", gap: 8, marginTop: 16, flexWrap: "wrap" }}>
                      <button onClick={closeForm} className="ad-btn ad-btn--ghost" style={{ flex: "1 1 auto" }}>Done</button>
                      {onGoToPackages && (
                        <button onClick={() => { onGoToPackages(); closeForm(); }} className="ad-btn" style={{ flex: "1 1 auto" }}>
                          Go to Packages →
                        </button>
                      )}
                    </div>
                  </div>
                ) : (<>
                <div style={{
                  display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                  gap: "clamp(12px, 3vw, 16px)"
                }}>
                  <div><label className="ad-label">Name</label>
                    <input className="ad-input" value={form.name} onChange={e => setF("name", e.target.value)} placeholder="410W Monocrystalline Panel" /></div>
                  <div><label className="ad-label">Brand</label>
                    <input className="ad-input" value={form.brand} onChange={e => setF("brand", e.target.value)} placeholder="Canadian Solar" /></div>
                  <div><label className="ad-label">Model</label>
                    <input className="ad-input" value={form.model} onChange={e => setF("model", e.target.value)} placeholder="CS6R-410MS" /></div>
                  <div><label className="ad-label">Category</label>
                    <select className="ad-select" value={form.category} onChange={e => {
                      const cat = e.target.value;
                      const spec = CATEGORY_SPEC[cat];
                      // Keep the chosen unit only if the new category offers it; otherwise its default (or null for spec-less categories).
                      setForm(f => ({ ...f, category: cat, capacityUnit: spec ? ((f.capacityUnit && spec.offer.includes(f.capacityUnit)) ? f.capacityUnit : spec.default) : null }));
                    }}>
                      {COMPONENT_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select></div>
                  {CATEGORY_SPEC[form.category] ? (() => {
                    const catSpec = CATEGORY_SPEC[form.category]!;
                    const code = form.capacityUnit ?? catSpec.default;
                    const canonicalVal = form[catSpec.field];
                    const factor = unitFactor(catSpec.dimension, code);
                    const step = factor < 1 ? "1" : factor === 1 ? "0.01" : "0.001";
                    return (
                    <div style={{ borderTop: "1px solid var(--ad-border)", paddingTop: "clamp(12px, 2vw, 16px)", marginTop: "clamp(12px, 2vw, 16px)", gridColumn: "1 / -1" }}>
                      <div style={{ fontSize: "clamp(11px, 2vw, 12px)", fontWeight: 600, color: "var(--ad-text3)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 12 }}>Component Specifications <span style={{ color: "#fc615a" }}>*</span></div>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "clamp(8px, 2vw, 12px)" }}>
                        <div><label className="ad-label">{catSpec.label} <span style={{ color: "#fc615a" }}>*</span></label>
                          <div style={{ display: "flex", gap: 8 }}>
                            <input type="number" className="ad-input" style={{ flex: 1 }}
                              value={canonicalVal ? String(fromCanonical(canonicalVal, catSpec.dimension, code)) : ""}
                              step={step} min="0"
                              onChange={e => setF(catSpec.field, e.target.value === "" ? 0 : toCanonical(Number(e.target.value), catSpec.dimension, code))}
                              placeholder={String(fromCanonical(catSpec.example, catSpec.dimension, code))} required />
                            <select className="ad-select" style={{ width: 90, flexShrink: 0 }} value={code} onChange={e => setF("capacityUnit", e.target.value)}>
                              {catSpec.offer.map(u => <option key={u} value={u}>{u}</option>)}
                            </select>
                          </div>
                          <small style={{ fontSize: 11, color: "var(--ad-text3)", marginTop: 4 }}>{catSpec.helper} · stored as {canonicalVal ? `${canonicalVal} ${catSpec.canonicalLabel}` : catSpec.canonicalLabel}</small>
                        </div>
                      </div>
                    </div>
                    );
                  })() : (
                    <div style={{ borderTop: "1px solid var(--ad-border)", paddingTop: "clamp(12px, 2vw, 16px)", marginTop: "clamp(12px, 2vw, 16px)", gridColumn: "1 / -1" }}>
                      <div style={{ fontSize: "clamp(11px, 2vw, 12px)", fontWeight: 600, color: "var(--ad-text3)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>Component Type</div>
                      <div style={{ fontSize: 12, color: "var(--ad-text2)", padding: "10px 12px", background: "rgba(34, 197, 94, 0.1)", borderRadius: 6, border: "1px solid rgba(34, 197, 94, 0.2)" }}>
                        ✓ No specifications required for {form.category}
                      </div>
                    </div>
                  )}
                  <div style={{ display: "flex", alignItems: "center", gap: 10, paddingTop: "clamp(12px, 2vw, 16px)", gridColumn: "1 / -1" }}>
                    <input type="checkbox" id="comp-pricing" checked={form.pricingEnabled}
                      onChange={e => setF("pricingEnabled", e.target.checked)}
                      style={{ width: 16, height: 16, cursor: "pointer", accentColor: "var(--ad-accent)" }} />
                    <label htmlFor="comp-pricing" style={{ color: "var(--ad-text)", fontSize: 13, cursor: "pointer" }}>
                      Has pricing (contributes to package total)
                    </label>
                  </div>
                  {form.pricingEnabled && (
                    <div style={{ gridColumn: "1 / -1" }}><label className="ad-label">Unit Price (₱) <span style={{ color: "#fc615a" }}>*</span></label>
                      <input type="number" className="ad-input" value={form.unitPrice ?? ""} min={0}
                        onChange={e => setF("unitPrice", e.target.value ? Number(e.target.value) : undefined)}
                        placeholder="0.00" /></div>
                  )}
                  <div style={{ display: "flex", alignItems: "center", gap: 10, paddingTop: "clamp(12px, 2vw, 16px)", gridColumn: "1 / -1" }}>
                    <input type="checkbox" id="comp-active" checked={form.isActive}
                      onChange={e => setF("isActive", e.target.checked)}
                      style={{ width: 16, height: 16, cursor: "pointer", accentColor: "var(--ad-accent)" }} />
                    <label htmlFor="comp-active" style={{ color: "var(--ad-text)", fontSize: 13, cursor: "pointer" }}>Active</label>
                  </div>

                  {/* Ratio bounds — shown for core component types */}
                  {(form.category === "Inverter" || form.category === "Battery" || form.category === "Solar Panel") && (
                    <div style={{ gridColumn: "1 / -1", borderTop: "1px solid var(--ad-border)", paddingTop: "clamp(12px, 2vw, 16px)", marginTop: 4 }}>
                      <div style={{ fontSize: "clamp(11px, 2vw, 12px)", fontWeight: 600, color: "var(--ad-text3)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>Quantity Range</div>
                      {form.category === "Inverter" ? (
                        <>
                          <div>
                            <label className="ad-label">Max Parallel Units</label>
                            <input type="number" className="ad-input" min={1} max={1000} value={form.parallelMax ?? 4}
                              onChange={e => setF("parallelMax", Math.max(1, Number(e.target.value) || 1))} />
                          </div>
                          <small style={{ fontSize: 11, color: "var(--ad-text3)", marginTop: 6, display: "block" }}>
                            How many of this inverter the customer can add to the package. Min is always 1.
                          </small>
                          {/* PV input range — drives panel quantity window */}
                          <div style={{ marginTop: 14, borderTop: "1px solid var(--ad-border)", paddingTop: 12 }}>
                            <div style={{ fontSize: "clamp(11px, 2vw, 12px)", fontWeight: 600, color: "var(--ad-text3)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>
                              PV Input Range <span style={{ fontWeight: 400, textTransform: "none", letterSpacing: "normal" }}>(optional — enables physics-based panel bounds)</span>
                            </div>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                              <div>
                                <label className="ad-label">Min PV Input (kWp)</label>
                                <input type="number" className="ad-input" min={0} step="0.1"
                                  value={form.pvMinPower ?? ""}
                                  placeholder="e.g. 3.0"
                                  onChange={e => setF("pvMinPower", e.target.value === "" ? null : Number(e.target.value))} />
                              </div>
                              <div>
                                <label className="ad-label">Max PV Input (kWp)</label>
                                <input type="number" className="ad-input" min={0} step="0.1"
                                  value={form.pvMaxPower ?? ""}
                                  placeholder="e.g. 7.5"
                                  onChange={e => setF("pvMaxPower", e.target.value === "" ? null : Number(e.target.value))} />
                              </div>
                            </div>
                            <small style={{ fontSize: 11, color: "var(--ad-text3)", marginTop: 4, display: "block" }}>
                              From the inverter datasheet: "Max. DC Input Power" / "Max. PV Array Power". When set, panel count is derived from <strong>floor(pvMax × Q ÷ panelWp)</strong> instead of rated output.
                            </small>
                          </div>
                          {/* Battery max capacity — drives battery quantity window */}
                          <div style={{ marginTop: 14, borderTop: "1px solid var(--ad-border)", paddingTop: 12 }}>
                            <div style={{ fontSize: "clamp(11px, 2vw, 12px)", fontWeight: 600, color: "var(--ad-text3)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>
                              Battery Support <span style={{ fontWeight: 400, textTransform: "none", letterSpacing: "normal" }}>(optional)</span>
                            </div>
                            <div>
                              <label className="ad-label">Max Battery Capacity (kWh per unit)</label>
                              <input type="number" className="ad-input" min={0} step="0.1"
                                value={form.batteryMaxCapacity ?? ""}
                                placeholder="e.g. 15.0"
                                onChange={e => setF("batteryMaxCapacity", e.target.value === "" ? null : Number(e.target.value))} />
                            </div>
                            <small style={{ fontSize: 11, color: "var(--ad-text3)", marginTop: 4, display: "block" }}>
                              Max battery storage this inverter supports per unit. When set, battery count is derived from <strong>floor(battMax × Q ÷ moduleKWh)</strong>.
                            </small>
                          </div>
                        </>
                      ) : (
                        <div style={{ fontSize: 12, color: "var(--ad-text2)", padding: "10px 12px", background: "rgba(59, 130, 246, 0.08)", borderRadius: 6, border: "1px solid rgba(59, 130, 246, 0.2)" }}>
                          {form.category === "Battery"
                            ? <>Battery count is derived from the paired inverter's <strong>Max Battery Capacity</strong> field. Configure that on the inverter product.</>
                            : <>Panel count is derived from the paired inverter's <strong>PV Input Range</strong> fields. Configure those on the inverter product.</>}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Data sheet URL — only for core component types */}
                  {!ACCESSORY_CATEGORIES.includes(form.category) && (
                    <div style={{ gridColumn: "1 / -1" }}>
                      <label className="ad-label">Product Data Sheet <span style={{ fontWeight: 400, color: "var(--ad-text3)" }}>(optional — paste a link to the PDF)</span></label>
                      <input className="ad-input" value={form.dataSheetUrl ?? ""} placeholder="https://…/datasheet.pdf"
                        onChange={e => setF("dataSheetUrl", e.target.value || null)} />
                    </div>
                  )}
                </div>
                {/* Edit confirmation — shown when the component is in use and user clicked Update */}
                {editConfirm && (() => {
                  const violating    = editConfirm.filter(p => p.violations.length > 0);
                  const nonViolating = editConfirm.filter(p => p.violations.length === 0);
                  const hasViolations = violating.length > 0;
                  return (
                    <div style={{
                      marginTop: "clamp(14px, 3vw, 20px)",
                      padding: "14px 16px",
                      borderRadius: 8,
                      background: hasViolations ? "rgba(220, 38, 38, 0.06)" : "rgba(251, 191, 36, 0.08)",
                      border: hasViolations ? "1px solid rgba(220, 38, 38, 0.3)" : "1px solid rgba(251, 191, 36, 0.35)",
                    }}>
                      {hasViolations ? (
                        <>
                          <div style={{ fontSize: 13, fontWeight: 700, color: "#dc2626", marginBottom: 6 }}>
                            ⚠ Rating change will break {violating.length} package{violating.length !== 1 ? 's' : ''}
                          </div>
                          <div style={{ fontSize: 12, color: "var(--ad-text2)", marginBottom: 10, lineHeight: 1.5 }}>
                            The new values push these packages outside their allowed quantity range. Save anyway — you'll be guided to fix them.
                          </div>
                          {violating.map(p => (
                            <div key={p.id} style={{ marginBottom: 8, padding: "8px 10px", background: "rgba(220,38,38,0.05)", border: "1px solid rgba(220,38,38,0.18)", borderRadius: 6 }}>
                              <div style={{ fontSize: 12, fontWeight: 600, color: "var(--ad-text)", marginBottom: 3 }}>{p.name}{!p.isActive ? " (inactive)" : ""}</div>
                              {p.violations.map((v, i) => <div key={i} style={{ fontSize: 11, color: "#dc2626", lineHeight: 1.5 }}>• {v}</div>)}
                            </div>
                          ))}
                          {nonViolating.length > 0 && (
                            <div style={{ fontSize: 12, color: "var(--ad-text2)", marginTop: 8 }}>
                              Also affected (no quantity issues): {nonViolating.map(p => p.name).join(', ')}
                            </div>
                          )}
                        </>
                      ) : (
                        <>
                          <div style={{ fontSize: 13, fontWeight: 700, color: "#f59e0b", marginBottom: 6 }}>
                            ⚠ This component is used in {editConfirm.length} package{editConfirm.length !== 1 ? 's' : ''}
                          </div>
                          <div style={{ fontSize: 12, color: "var(--ad-text2)", marginBottom: 10, lineHeight: 1.5 }}>
                            Saving will update the component data. Review each affected package afterwards to make sure its specs and pricing are still aligned.
                          </div>
                          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 12 }}>
                            {editConfirm.map(p => (
                              <span key={p.id} style={{
                                fontSize: 11, padding: "3px 10px", borderRadius: 12, fontWeight: 600,
                                background: p.isActive ? "rgba(34,197,94,0.12)" : "var(--ad-surface)",
                                color: p.isActive ? "#22c55e" : "var(--ad-text3)",
                                border: `1px solid ${p.isActive ? "rgba(34,197,94,0.3)" : "var(--ad-border)"}`,
                              }}>
                                {p.name}{!p.isActive ? " (inactive)" : ""}
                              </span>
                            ))}
                          </div>
                        </>
                      )}
                      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: hasViolations ? 12 : 0 }}>
                        <button onClick={() => setEditConfirm(null)} className="ad-btn ad-btn--ghost" style={{ flex: "1 1 auto", minWidth: 90 }}>
                          Cancel
                        </button>
                        <button
                          onClick={() => void handleSave(true)}
                          disabled={saving}
                          className="ad-btn"
                          style={{ flex: "1 1 auto", minWidth: 140, background: hasViolations ? "#dc2626" : "#d97706", borderColor: hasViolations ? "#dc2626" : "#d97706" }}
                        >
                          {saving ? "Saving…" : hasViolations ? "Save & Fix Packages" : "Yes, Update Anyway"}
                        </button>
                      </div>
                    </div>
                  );
                })()}

                {!editConfirm && (
                  <div style={{
                    display: "flex", gap: "clamp(8px, 2vw, 12px)", marginTop: "clamp(16px, 3vw, 20px)",
                    flexWrap: "wrap-reverse", justifyContent: "flex-end"
                  }}>
                    <button onClick={closeForm} className="ad-btn ad-btn--ghost" style={{ flex: "1 1 auto", minWidth: "100px" }}>Cancel</button>
                    <button onClick={() => void handleSave()} disabled={saving} className="ad-btn" style={{ flex: "1 1 auto", minWidth: "120px" }}>
                      {saving ? "Checking…" : editingId ? "Update" : "Add"}
                    </button>
                  </div>
                )}
                </>)}
              </div>
            </div>
          </div>
        </>
      )}

      {loading ? (
        <div style={{ color: "var(--ad-text2)", padding: 24 }}>Loading…</div>
      ) : components.length === 0 ? (
        <div className="ad-card" style={{ textAlign: "center", padding: "48px 24px" }}>
          <div style={{ fontSize: 15, color: "var(--ad-text2)", marginBottom: 8 }}>No components in inventory yet</div>
          <div style={{ fontSize: 13, color: "var(--ad-text3)", marginBottom: 16 }}>Click "+ Add Component" to start building your inventory. You'll use these to create solar packages.</div>
          <div style={{ fontSize: 12, color: "var(--ad-text3)", background: "var(--ad-surface)", padding: "12px 16px", borderRadius: 6, textAlign: "left", display: "inline-block" }}>
            <div style={{ fontWeight: 600, marginBottom: 8, color: "var(--ad-text)" }}>Component Types:</div>
            <div style={{ fontSize: 11, lineHeight: 1.6 }}>
              <div>☀ <strong>Solar Panel, ⚡ Inverter, 🔋 Battery</strong> — require specifications</div>
              <div style={{ marginTop: 4 }}>📦 <strong>Other categories</strong> — no specs needed (brackets, wiring, monitoring, etc.)</div>
            </div>
          </div>
        </div>
      ) : (
        grouped.map(({ cat, items }) => {
          const search = catSearches[cat] ?? '';
          const filtered = items.filter(c =>
            c.name.toLowerCase().includes(search.toLowerCase()) ||
            c.brand.toLowerCase().includes(search.toLowerCase()) ||
            c.model.toLowerCase().includes(search.toLowerCase())
          ).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          if (filtered.length === 0 && !search) return null;

          const itemsPerPage = 20;
          const page = componentPage[cat] ?? 0;
          const maxPages = Math.ceil(Math.max(1, filtered.length) / itemsPerPage);
          const paginatedItems = filtered.slice(page * itemsPerPage, (page + 1) * itemsPerPage);

          const categoryEmojis: Record<string, string> = {
            'Solar Panel': '☀',
            'Inverter': '⚡',
            'Battery': '🔋',
            'Mounting & Racking': '📦',
            'Wiring & Protection': '🔌',
            'Monitoring': '📊',
            'Others': '📦',
          };
          const emoji = categoryEmojis[cat] ?? '📦';

          return (
            <div key={cat} style={{ marginBottom: 24 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12, gap: 12 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "var(--ad-text3)", letterSpacing: "1.4px", textTransform: "uppercase" }}>
                  {emoji} {cat}
                </div>
              </div>
              <input
                type="search"
                className="ad-input"
                placeholder={`Search ${cat}...`}
                value={search}
                onChange={(e) => { setCatSearches(s => ({ ...s, [cat]: e.target.value })); setComponentPage(p => ({ ...p, [cat]: 0 })); }}
                style={{ marginBottom: 12 }}
              />
              {filtered.length === 0 ? (
                <div style={{ padding: 24, textAlign: "center", color: "var(--ad-text3)" }}>
                  {search ? "No components match your search" : "No components in this category"}
                </div>
              ) : (
                <>
                  <div className="ad-table-wrap">
                    <table className="ad-table">
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th style={{ width: "15%" }}>Brand / Model</th>
                          <th style={{ width: "8%" }}>Unit</th>
                          <th style={{ width: "10%" }}>Unit Price</th>
                          <th style={{ width: "8%" }}>Pricing</th>
                          <th style={{ width: "10%" }}>Active</th>
                          <th style={{ width: "12%" }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginatedItems.map(c => (
                          <tr key={c.id}>
                            <td>
                              <div style={{ fontWeight: 500 }}>{c.name}</div>
                              {(c.productionCapacityKwp ?? 0) > 0 && <div style={{ fontSize: 10, color: "var(--ad-text3)", marginTop: 2 }}>☀ {(c.productionCapacityKwp ?? 0).toFixed(2)} kWp</div>}
                              {(c.loadCapacityKw ?? 0) > 0 && <div style={{ fontSize: 10, color: "var(--ad-text3)", marginTop: 2 }}>⚙️ {(c.loadCapacityKw ?? 0).toFixed(1)} kW</div>}
                              {(c.storageCapacityKwh ?? 0) > 0 && <div style={{ fontSize: 10, color: "var(--ad-text3)", marginTop: 2 }}>🔋 {(c.storageCapacityKwh ?? 0).toFixed(2)} kWh</div>}
                            </td>
                            <td style={{ fontSize: 12 }}>{c.brand}<br /><span style={{ opacity: 0.6, fontSize: 10 }}>{c.model}</span></td>
                            <td style={{ fontSize: 12, color: c.unit ? "inherit" : "var(--ad-text3)" }}>{c.unit || "—"}</td>
                            <td style={{ fontFamily: "monospace", fontSize: 12 }}>
                              {c.pricingEnabled ? pesoCmp(c.unitPrice) : <span style={{ opacity: 0.4 }}>—</span>}
                            </td>
                            <td>
                              <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 99,
                                background: c.pricingEnabled ? "rgba(252,97,90,0.12)" : "rgba(255,255,255,0.06)",
                                color: c.pricingEnabled ? "#fc615a" : "var(--ad-text3)", whiteSpace: "nowrap" }}>
                                {c.pricingEnabled ? "Priced" : "No price"}
                              </span>
                            </td>
                            <td style={{ fontSize: 12 }}><span style={{ color: c.isActive ? "#22c55e" : "var(--ad-text3)" }}>{c.isActive ? "Yes" : "No"}</span></td>
                            <td>
                              <div className="ad-table-actions" style={{ display: "flex", gap: 4 }}>
                                <button onClick={() => setPreviewComponent(c)} className="ad-btn ad-btn--ghost ad-btn--sm" style={{ fontSize: 11 }}>View</button>
                                <button onClick={() => openEdit(c)} className="ad-btn ad-btn--ghost ad-btn--sm" style={{ fontSize: 11 }}>Edit</button>
                                <button onClick={() => void handleDelete(c.id, c.name)} disabled={deleting === c.id}
                                  className="ad-btn ad-btn--danger ad-btn--sm" style={{ opacity: deleting === c.id ? 0.5 : 1, fontSize: 11 }}>
                                  {deleting === c.id ? "…" : "Delete"}
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {maxPages > 1 && (
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 12 }}>
                      <button
                        className="ad-btn ad-btn--ghost ad-btn--sm"
                        onClick={() => setComponentPage(m => ({ ...m, [cat]: Math.max(0, (m[cat] ?? 0) - 1) }))}
                        disabled={page === 0}
                      >← Prev</button>
                      <span style={{ fontSize: 12, color: "var(--ad-text)", minWidth: 40, textAlign: "center" }}>
                        {page + 1} / {maxPages}
                      </span>
                      <button
                        className="ad-btn ad-btn--ghost ad-btn--sm"
                        onClick={() => setComponentPage(m => ({ ...m, [cat]: Math.min(maxPages - 1, (m[cat] ?? 0) + 1) }))}
                        disabled={page >= maxPages - 1}
                      >Next →</button>
                    </div>
                  )}
                </>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}

// ─── PackagesManager ──────────────────────────────────────────────────────────

// ─── PackageInquiriesManager ──────────────────────────────────────────────────

function PackageInquiriesManager({ apiKey }: { apiKey: string }) {
  const [inquiries, setInquiries] = useState<PackageInquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [msg, setMsg] = useState("");
  const [selectedInquiry, setSelectedInquiry] = useState<PackageInquiry | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | PackageInquiry["status"]>("all");
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  useEffect(() => {
    void load();
  }, []);

  useEffect(() => {
    if (!msg) return;
    const timeout = setTimeout(() => setMsg(""), msg.startsWith("✓") ? 1500 : 3000);
    return () => clearTimeout(timeout);
  }, [msg]);

  const load = async () => {
    setLoading(true);
    try {
      const res = await adminGetPackageInquiries(apiKey);
      setInquiries(res.data);
    } catch (e) {
      setMsg(`Failed to load inquiries: ${e instanceof Error ? e.message : "Unknown error"}`);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: PackageInquiry['status']) => {
    setUpdating(id);
    try {
      await adminUpdatePackageInquiry(apiKey, id, { status });
      setMsg("✓ Status updated");
      setInquiries(prev => prev.map(i => i.id === id ? { ...i, status } : i));
      setSelectedInquiry(prev => prev?.id === id ? { ...prev, status } : prev);
    } catch (e) {
      setMsg(`Failed to update: ${e instanceof Error ? e.message : "Unknown error"}`);
    } finally {
      setUpdating(null);
    }
  };

  const deleteInquiry = async (id: string) => {
    setDeleting(id);
    try {
      await adminDeletePackageInquiry(apiKey, id);
      setMsg("✓ Inquiry deleted");
      setSelectedInquiry(null);
      setInquiries(prev => prev.filter(i => i.id !== id));
    } catch (e) {
      setMsg(`Failed to delete: ${e instanceof Error ? e.message : "Unknown error"}`);
    } finally {
      setDeleting(null);
    }
  };

  const filtered = inquiries.filter(inq => {
    if (statusFilter !== "all" && inq.status !== statusFilter) return false;
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return inq.name.toLowerCase().includes(q) || inq.email.toLowerCase().includes(q) || inq.packageName.toLowerCase().includes(q);
  });

  const counts = {
    new:       inquiries.filter(i => i.status === "new").length,
    contacted: inquiries.filter(i => i.status === "contacted").length,
    converted: inquiries.filter(i => i.status === "converted").length,
  };

  const InqStatusSelect = ({ inq }: { inq: PackageInquiry }) => (
    <select
      className={`ad-inq-status-select is-${inq.status}`}
      value={inq.status}
      disabled={updating === inq.id}
      onChange={e => void updateStatus(inq.id, e.target.value as PackageInquiry['status'])}
    >
      <option value="new">New</option>
      <option value="contacted">Contacted</option>
      <option value="converted">Converted</option>
    </select>
  );

  const fmtDate = (iso: string) =>
    new Date(iso).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <div>
      <div className="ad-section-header">
        <div>
          <div className="ad-section-title">Package Inquiries</div>
          {!loading && (
            <div className="ad-section-sub">
              {inquiries.length} total
              {inquiries.length > 0 && (
                <> ·&nbsp;
                  <span className="ad-inq-count is-new">{counts.new} New</span>
                  &nbsp;·&nbsp;
                  <span className="ad-inq-count is-contacted">{counts.contacted} Contacted</span>
                  &nbsp;·&nbsp;
                  <span className="ad-inq-count is-converted">{counts.converted} Converted</span>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {msg && <Toast msg={msg} />}

      <ConfirmDeleteModal
        open={!!deleteTarget}
        title="Delete this package inquiry?"
        description="This will permanently remove the inquiry record."
        onConfirm={() => { void deleteInquiry(deleteTarget!); setDeleteTarget(null); }}
        onCancel={() => setDeleteTarget(null)}
        confirming={!!deleting}
      />

      {!loading && inquiries.length > 0 && (
        <div className="ad-inq-toolbar">
          <input
            className="ad-input ad-inq-search"
            type="search"
            placeholder="Search name, email or package…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <select
            className="ad-select ad-inq-filter"
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value as typeof statusFilter)}
          >
            <option value="all">All ({inquiries.length})</option>
            <option value="new">New ({counts.new})</option>
            <option value="contacted">Contacted ({counts.contacted})</option>
            <option value="converted">Converted ({counts.converted})</option>
          </select>
        </div>
      )}

      {loading ? (
        <div style={{ padding: 20, color: "var(--ad-text3)" }}>Loading…</div>
      ) : filtered.length === 0 ? (
        <div style={{ padding: 20, color: "var(--ad-text3)" }}>
          {inquiries.length === 0 ? "No inquiries yet." : "No results match your search."}
        </div>
      ) : (
        <>
          {/* ── Desktop table ── */}
          <div className="ad-inq-table-wrap">
            <table className="ad-table" style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th className="ad-inq-th">Name</th>
                  <th className="ad-inq-th">Contact</th>
                  <th className="ad-inq-th">Package</th>
                  <th className="ad-inq-th">Status</th>
                  <th className="ad-inq-th">Date</th>
                  <th className="ad-inq-th" />
                </tr>
              </thead>
              <tbody>
                {filtered.map(inq => (
                  <tr key={inq.id} className="ad-inq-tr">
                    <td className="ad-inq-td">
                      <div style={{ fontWeight: 600, fontSize: 13 }}>{inq.name}</div>
                      <div className="ad-inq-ref">PKG-{inq.id.slice(0, 8).toUpperCase()}</div>
                    </td>
                    <td className="ad-inq-td">
                      <div style={{ fontSize: 13 }}>{inq.email}</div>
                      <div className="ad-inq-ref">{inq.phone}</div>
                    </td>
                    <td className="ad-inq-td">
                      <div style={{ fontSize: 13, fontWeight: 500 }}>{inq.packageName}</div>
                      <div className="ad-inq-ref">
                        {formatCapacity(inq.packageDetails.inverterKw, "power", { unit: "kW" })}
                        {inq.packageDetails.storageKwh > 0 && ` · ${formatCapacity(inq.packageDetails.storageKwh, "energy", { unit: "kWh" })}`}
                        {` · ${inq.packageDetails.phase === "single" ? "Single" : "Three"} Phase`}
                      </div>
                    </td>
                    <td className="ad-inq-td">
                      <InqStatusSelect inq={inq} />
                    </td>
                    <td className="ad-inq-td">
                      <div style={{ fontSize: 12, color: "var(--ad-text3)" }}>{fmtDate(inq.createdAt)}</div>
                    </td>
                    <td className="ad-inq-td">
                      <button className="ad-btn ad-btn--sm" onClick={() => setSelectedInquiry(inq)}>View</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ── Mobile cards ── */}
          <div className="ad-inq-cards">
            {filtered.map(inq => (
              <div key={inq.id} className="ad-inq-card">
                <div className="ad-inq-card-top">
                  <div>
                    <div className="ad-inq-card-name">{inq.name}</div>
                    <div className="ad-inq-ref">{inq.email} · {inq.phone}</div>
                  </div>
                  <button className="ad-btn ad-btn--sm" onClick={() => setSelectedInquiry(inq)} style={{ flexShrink: 0 }}>Details</button>
                </div>
                <div className="ad-inq-card-pkg">
                  <span style={{ fontWeight: 600, fontSize: 13 }}>{inq.packageName}</span>
                  <span className="ad-inq-ref">
                    {formatCapacity(inq.packageDetails.inverterKw, "power", { unit: "kW" })}
                    {inq.packageDetails.storageKwh > 0 && ` · ${formatCapacity(inq.packageDetails.storageKwh, "energy", { unit: "kWh" })}`}
                    {` · ${inq.packageDetails.phase === "single" ? "Single" : "Three"} Phase`}
                  </span>
                  <span className="ad-inq-ref">{fmtDate(inq.createdAt)} · PKG-{inq.id.slice(0, 8).toUpperCase()}</span>
                </div>
                <div className="ad-inq-card-footer">
                  <InqStatusSelect inq={inq} />
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ── Detail modal ── */}
      {selectedInquiry && createPortal(
        <div className="ad-inq-modal-overlay" onClick={() => setSelectedInquiry(null)}>
          <div className="ad-inq-modal" onClick={e => e.stopPropagation()}>

            {/* Header */}
            <div className="ad-inq-modal-header">
              <div>
                <div className="ad-inq-modal-title">Inquiry Details</div>
                <div className="ad-inq-ref" style={{ marginTop: 3 }}>PKG-{selectedInquiry.id.slice(0, 8).toUpperCase()}</div>
              </div>
              <button className="ad-inq-modal-close" onClick={() => setSelectedInquiry(null)}>×</button>
            </div>

            {/* Status — always visible at top */}
            <div className="ad-inq-modal-section">
              <div className="ad-inq-modal-sec-label">Status</div>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <InqStatusSelect inq={selectedInquiry} />
                <span className="ad-inq-ref">{fmtDate(selectedInquiry.createdAt)} · {new Date(selectedInquiry.createdAt).toLocaleTimeString('en-PH', { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            </div>

            {/* Contact */}
            <div className="ad-inq-modal-section">
              <div className="ad-inq-modal-sec-label">Contact Information</div>
              <div className="ad-inq-modal-grid">
                {[
                  ["Full Name",     selectedInquiry.name],
                  ["Email",         selectedInquiry.email],
                  ["Phone",         selectedInquiry.phone],
                  ["Location",      selectedInquiry.location],
                ].map(([label, value]) => (
                  <div key={label} className="ad-inq-modal-field">
                    <div className="ad-inq-modal-field-label">{label}</div>
                    <div className="ad-inq-modal-field-value" style={{ wordBreak: "break-all" }}>{value}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* System specs */}
            <div className="ad-inq-modal-section">
              <div className="ad-inq-modal-sec-label">System Specifications</div>
              <div className="ad-inq-modal-grid">
                {[
                  ["Package",         selectedInquiry.packageName],
                  ["Load Capacity",   formatCapacity(selectedInquiry.packageDetails.inverterKw,  "power",  { unit: "kW" })],
                  ["Production",      formatCapacity(selectedInquiry.packageDetails.solarKwp,    "power",  { unit: "kWp" })],
                  ...(selectedInquiry.packageDetails.storageKwh > 0 ? [["Storage", formatCapacity(selectedInquiry.packageDetails.storageKwh, "energy", { unit: "kWh" })]] : []),
                  ["Phase",           selectedInquiry.packageDetails.phase === "single" ? "Single Phase" : "Three Phase"],
                  ...(selectedInquiry.packageDetails.billRangeMin != null ? [[
                    "Monthly Savings",
                    `₱${selectedInquiry.packageDetails.billRangeMin.toLocaleString("en-PH")} – ₱${selectedInquiry.packageDetails.billRangeMax?.toLocaleString("en-PH")}`,
                  ]] : []),
                ].map(([label, value]) => (
                  <div key={label} className="ad-inq-modal-field">
                    <div className="ad-inq-modal-field-label">{label}</div>
                    <div className="ad-inq-modal-field-value">{value}</div>
                  </div>
                ))}
                <div className="ad-inq-modal-field">
                  <div className="ad-inq-modal-field-label">Total Price</div>
                  <div className="ad-inq-modal-field-value" style={{ color: selectedInquiry.packageDetails.totalPrice != null ? "var(--ad-accent)" : undefined }}>
                    {selectedInquiry.packageDetails.totalPrice != null
                      ? `₱${selectedInquiry.packageDetails.totalPrice.toLocaleString("en-PH")}`
                      : "Price TBD"}
                  </div>
                </div>
              </div>
            </div>

            {/* Components */}
            {(() => {
              const comps = selectedInquiry.packageDetails.components;
              if (!comps || comps.length === 0) return null;
              const EMOJI: Record<string, string> = { "Solar Panel": "☀️", "Inverter": "⚡", "Battery": "🔋" };
              const order = ["Solar Panel", "Inverter", "Battery"];
              const byCategory = comps.reduce<Record<string, typeof comps>>((acc, c) => { (acc[c.category] ??= []).push(c); return acc; }, {});
              const categories = [...order.filter(c => byCategory[c]), ...Object.keys(byCategory).filter(c => !order.includes(c))];
              return (
                <div className="ad-inq-modal-section">
                  <div className="ad-inq-modal-sec-label">Selected Components</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {categories.map(cat => (
                      <div key={cat} className="ad-inq-modal-field" style={{ gap: 8 }}>
                        <div className="ad-inq-modal-field-label">{EMOJI[cat] ?? "📦"} {cat}</div>
                        {byCategory[cat].map((c, i) => (
                          <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, padding: "3px 0", borderBottom: i < byCategory[cat].length - 1 ? "1px solid var(--ad-border)" : "none" }}>
                            <span><span style={{ fontWeight: 700, marginRight: 6 }}>{c.quantity}×</span>{c.brand} {c.name}</span>
                            {c.unitPrice != null && <span className="ad-inq-ref">₱{c.unitPrice.toLocaleString("en-PH")} ea.</span>}
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}

            {/* Actions */}
            <div className="ad-inq-modal-actions">
              <button
                className="ad-btn ad-btn--danger"
                disabled={deleting === selectedInquiry.id}
                onClick={() => setDeleteTarget(selectedInquiry.id)}
              >
                {deleting === selectedInquiry.id ? "Deleting…" : "Delete"}
              </button>
              <button className="ad-btn ad-btn--ghost" onClick={() => setSelectedInquiry(null)}>Close</button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}

function PackagesManager({ apiKey }: { apiKey: string }) {
  const [packages, setPackages]       = useState<ApiSolarPackage[]>([]);
  const [allComponents, setAllComponents] = useState<ApiSolarComponent[]>([]);
  const [loading, setLoading]         = useState(true);
  const [showForm, setShowForm]       = useState(false);
  const [editingId, setEditingId]     = useState<string | null>(null);
  const [form, setForm]               = useState<PkgForm>(EMPTY_PKG_FORM);
  const [nameEdited, setNameEdited]   = useState(false);
  const [saving, setSaving]           = useState(false);
  const [toggling, setToggling]       = useState<string | null>(null);
  const [deleting, setDeleting]       = useState<string | null>(null);
  const [msg, setMsg]                 = useState("");
  const [previewPackage, setPreviewPackage] = useState<ApiSolarPackage | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ApiSolarPackage | null>(null);
  const [catSearches, setCatSearches] = useState<Record<string, string>>({}); // Search per category
  const [systemType, setSystemType]   = useState<'hybrid' | 'grid-tied'>('hybrid');
  const [pkgImageFile, setPkgImageFile]       = useState<File | null>(null);
  const [pkgImagePreview, setPkgImagePreview] = useState<string>("");
  const [pkgSearch, setPkgSearch]             = useState("");
  const [showFilters, setShowFilters]         = useState(false);
  const [filterPhase, setFilterPhase]         = useState<Set<string>>(new Set());
  const [filterType, setFilterType]           = useState<Set<string>>(new Set());
  const [filterStatus, setFilterStatus]       = useState<Set<string>>(new Set());
  const [filterBillRange, setFilterBillRange] = useState<Set<string>>(new Set());
  const [filterRecommended, setFilterRecommended] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const [pkgRes, cmpRes] = await Promise.all([
        adminGetPackages(apiKey),
        adminGetComponents(apiKey).catch(() => ({ data: [] as ApiSolarComponent[] }))
      ]);
      setPackages(pkgRes.data);
      setAllComponents(cmpRes.data);
    } finally { setLoading(false); }
  };

  useEffect(() => { void load(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-sync package specs + monthly savings when components change
  useEffect(() => {
    if ((form.components ?? []).length > 0) {
      const specs = computePackageSpecs(form.components ?? [], allComponents);
      const { min, max } = computeMonthlySavings(specs.solarKwp);
      setForm(f => ({ ...f, solarKwp: specs.solarKwp, inverterKw: specs.inverterKw, storageKwh: specs.storageKwh, billRangeMin: min, billRangeMax: max }));
    }
  }, [form.components, allComponents]);

  // Auto-clear messages after a timeout
  useEffect(() => {
    if (!msg) return;
    const isSuccess = msg.startsWith("✓");
    const timeout = setTimeout(() => setMsg(""), isSuccess ? 1500 : 3000);
    return () => clearTimeout(timeout);
  }, [msg]);

  const openAdd = () => {
    setEditingId(null); setForm(EMPTY_PKG_FORM); setSystemType('hybrid');
    setNameEdited(false); setCatSearches({}); setMsg("");
    setPkgImageFile(null); setPkgImagePreview("");
    setShowForm(true);
    if (allComponents.length === 0) {
      adminGetComponents(apiKey).then(res => setAllComponents(res.data)).catch(() => {});
    }
  };
  const openEdit = (p: ApiSolarPackage) => {
    setEditingId(p.id);
    setSystemType(p.storageKwh > 0 ? 'hybrid' : 'grid-tied');
    setForm({
      name: p.name, solarKwp: p.solarKwp, inverterKw: p.inverterKw,
      storageKwh: p.storageKwh, phase: p.phase,
      billRangeMin: p.billRangeMin, billRangeMax: p.billRangeMax,
      isActive: p.isActive, isRecommended: p.isRecommended ?? false,
      mainFeatures: p.mainFeatures ?? [],
      imageUrl: p.imageUrl ?? null,
      components: (p.components ?? []).map(pc => ({ componentId: pc.componentId, quantity: pc.quantity, baseComponentId: pc.baseComponentId ?? null, multiplier: pc.multiplier ?? 1 })),
    });
    setPkgImageFile(null); setPkgImagePreview(p.imageUrl ?? "");
    setNameEdited(true); setCatSearches({}); setMsg(""); setShowForm(true);
    if (allComponents.length === 0) {
      adminGetComponents(apiKey).then(res => setAllComponents(res.data)).catch(() => {});
    }
  };
  const closeForm = () => {
    setShowForm(false); setEditingId(null); setNameEdited(false);
    setCatSearches({}); setMsg(""); setSystemType('hybrid');
    setPkgImageFile(null); setPkgImagePreview("");
  };
  const setField = <K extends keyof PkgForm>(key: K, value: PkgForm[K]) => setForm((f) => ({ ...f, [key]: value }));
  const setComponents = (next: PackageComponentLine[]) =>
    setForm(f => ({ ...f, components: recomputeDerivedQtys(next) }));

  const handlePkgImageSelect = (file: File | undefined) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setMsg("Error: Only image files are allowed (JPEG, PNG, WebP, AVIF, GIF)");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setMsg("Error: Image must be 10 MB or smaller");
      return;
    }
    setPkgImageFile(file);
    const reader = new FileReader();
    reader.onload = (e) => setPkgImagePreview(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const validateForm = (): string => {
    if (!form.name.trim()) return "Please enter a package name";
    if ((form.components ?? []).length === 0) return "Please select at least one component from your inventory";

    // Check for required component types and compute specs
    const components = form.components ?? [];
    const componentDetails = components.map(c => allComponents.find(ac => ac.id === c.componentId)).filter(Boolean) as ApiSolarComponent[];
    const hasSolarPanel = componentDetails.some(c => c.category === 'Solar Panel');
    const hasInverter = componentDetails.some(c => c.category === 'Inverter');
    const hasBattery = componentDetails.some(c => c.category === 'Battery');

    if (!hasSolarPanel) return "Package must include at least one Solar Panel";
    if (!hasInverter) return "Package must include at least one Inverter";
    if (systemType === 'hybrid' && !hasBattery) return "Hybrid packages must include at least one Battery";

    // Compute actual specs from selected components
    const specs = computePackageSpecs(components, allComponents);
    if (specs.solarKwp <= 0) return "Total Production Capacity must be greater than 0 kWp (add Solar Panels)";
    if (specs.inverterKw <= 0) return "Total Load Capacity must be greater than 0 kW (add Inverters)";
    if (specs.storageKwh < 0) return "Total Storage Capacity cannot be negative";

    if (form.billRangeMax < form.billRangeMin) return "Maximum monthly bill must be greater than or equal to minimum";

    // Enforce inverter-driven limits for panels and batteries
    const inverterEntry = components.find(c => allComponents.find(a => a.id === c.componentId)?.category === 'Inverter');
    if (inverterEntry) {
      const inverterComp = allComponents.find(c => c.id === inverterEntry.componentId);
      if (inverterComp) {
        const panelEntries = components.filter(c => allComponents.find(a => a.id === c.componentId)?.category === 'Solar Panel');
        if (panelEntries.length > 0) {
          const totalPanelKwp = panelEntries.reduce((sum, entry) => {
            const panelComp = allComponents.find(c => c.id === entry.componentId);
            return sum + entry.quantity * (panelComp?.productionCapacityKwp ?? 0);
          }, 0);
          // Use pvMaxPower when set; fall back to rated output
          const pvCapPerUnit = inverterComp.pvMaxPower ?? inverterComp.loadCapacityKw;
          const maxKwp = pvCapPerUnit * inverterEntry.quantity;
          if (totalPanelKwp > maxKwp + 0.001) {
            return `Total panel array (${totalPanelKwp.toFixed(2)} kWp) exceeds inverter max PV input (${maxKwp.toFixed(1)} kWp). Reduce panel count or use a larger inverter.`;
          }
        }
        const batteryEntry = components.find(c => allComponents.find(a => a.id === c.componentId)?.category === 'Battery');
        if (batteryEntry) {
          const batteryComp = allComponents.find(c => c.id === batteryEntry.componentId);
          if (batteryComp && batteryComp.storageCapacityKwh > 0) {
            const battCapPerUnit = inverterComp.batteryMaxCapacity ?? inverterComp.loadCapacityKw;
            const rawMax = Math.floor(battCapPerUnit * inverterEntry.quantity / batteryComp.storageCapacityKwh);
            // Fallback mode (no batteryMaxCapacity): always allow at least 1 battery, matching public card behaviour
            const maxBatteries = inverterComp.batteryMaxCapacity != null ? rawMax : Math.max(1, rawMax);
            if (batteryEntry.quantity > maxBatteries) {
              return `Battery count (${batteryEntry.quantity}) exceeds inverter limit — max ${maxBatteries} batteries (${(battCapPerUnit * inverterEntry.quantity).toFixed(1)} kWh total) for ${inverterEntry.quantity}× inverter`;
            }
          }
        }
        // Inverter count must not exceed parallelMax
        const maxInverters = inverterComp.parallelMax ?? 4;
        if (inverterEntry.quantity > maxInverters) {
          return `Inverter count (${inverterEntry.quantity}) exceeds the maximum parallel units allowed for this model (${maxInverters})`;
        }
      }
    }

    return "";
  };

  const handleSave = async () => {
    const err = validateForm();
    if (err) { setMsg(err); return; }
    setSaving(true); setMsg("");
    try {
      let pkgId: string;
      if (editingId) {
        await adminUpdatePackage(apiKey, editingId, form);
        pkgId = editingId;
      } else {
        const result = await adminCreatePackage(apiKey, form);
        pkgId = result.data.id;
      }
      if (pkgImageFile) {
        await adminUploadPackageImage(apiKey, pkgId, pkgImageFile);
      }
      setMsg(editingId ? "✓ Package updated successfully" : "✓ Package created successfully");
      await load();
      setTimeout(closeForm, 1500);
    } catch (e) {
      const errorMsg = (e as Error).message;
      if (errorMsg.includes("409") || errorMsg.includes("conflict")) {
        setMsg("A package with this name already exists");
      } else if (errorMsg.includes("401") || errorMsg.includes("unauthorized")) {
        setMsg("Your session has expired. Please refresh and try again");
      } else {
        setMsg(`Failed to save package: ${errorMsg}`);
      }
    }
    finally { setSaving(false); }
  };

  const handleToggleActive = async (p: ApiSolarPackage) => {
    setToggling(p.id);
    try {
      await adminUpdatePackage(apiKey, p.id, { isActive: !p.isActive });
      setMsg(p.isActive ? "✓ Package hidden" : "✓ Package visible");
      await load();
    }
    catch (e) { setMsg("Failed to update package visibility"); }
    finally { setToggling(null); }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(deleteTarget.id);
    try {
      await adminDeletePackage(apiKey, deleteTarget.id);
      setMsg("✓ Package deleted");
      await load();
    }
    catch (e) { setMsg("Failed to delete package. Please try again"); }
    finally { setDeleting(null); setDeleteTarget(null); }
  };


  const peso = (v: number) => `₱${v.toLocaleString("en-PH")}`;
  const activeCount = packages.filter((p) => p.isActive).length;

  const toggleFilterSet = (setter: React.Dispatch<React.SetStateAction<Set<string>>>, val: string) =>
    setter(prev => { const n = new Set(prev); n.has(val) ? n.delete(val) : n.add(val); return n; });

  const BILL_TIERS: Array<[string, string, (p: ApiSolarPackage) => boolean]> = [
    ["bill-low",   "Up to ₱5,000/mo",      p => p.billRangeMin < 5000],
    ["bill-mid",   "₱5,000 – ₱15,000/mo",  p => p.billRangeMin >= 5000 && p.billRangeMin < 15000],
    ["bill-high",  "₱15,000 – ₱30,000/mo", p => p.billRangeMin >= 15000 && p.billRangeMin < 30000],
    ["bill-xhigh", "Above ₱30,000/mo",     p => p.billRangeMin >= 30000],
  ];

  const clearFilters = () => { setFilterPhase(new Set()); setFilterType(new Set()); setFilterStatus(new Set()); setFilterBillRange(new Set()); setFilterRecommended(false); };

  const filteredPackages = (() => {
    let r = packages;
    if (pkgSearch.trim()) {
      const q = pkgSearch.toLowerCase();
      r = r.filter(p =>
        p.name.toLowerCase().includes(q) ||
        (p.components ?? []).some(pc =>
          pc.component.name.toLowerCase().includes(q) ||
          pc.component.brand.toLowerCase().includes(q) ||
          pc.component.model.toLowerCase().includes(q)
        )
      );
    }
    if (filterPhase.size > 0)     r = r.filter(p => filterPhase.has(p.phase));
    if (filterType.size > 0)      r = r.filter(p => filterType.has(p.storageKwh > 0 ? "hybrid" : "grid-tied"));
    if (filterStatus.size > 0)    r = r.filter(p => filterStatus.has(p.isActive ? "active" : "inactive"));
    if (filterBillRange.size > 0) r = r.filter(p => BILL_TIERS.some(([v, , fn]) => filterBillRange.has(v) && fn(p)));
    if (filterRecommended)        r = r.filter(p => p.isRecommended);
    return r;
  })();

  const activeFilterCount = filterPhase.size + filterType.size + filterStatus.size + filterBillRange.size + (filterRecommended ? 1 : 0);
  const isFiltering = pkgSearch.trim().length > 0 || activeFilterCount > 0;

  return (
    <div>
      <div className="ad-section-header">
        <div>
          <div className="ad-section-title">Solar Packages Builder</div>
          <div className="ad-section-sub">{loading ? "Loading…" : `${activeCount} active · ${packages.length} total — create packages by selecting components from your inventory. Specs and pricing auto-calculate.`}</div>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {!showForm && <button onClick={openAdd} className="ad-btn ad-btn--sm">+ Add Package</button>}
        </div>
      </div>
      {msg && <Toast msg={msg} />}

      <ConfirmDeleteModal
        open={!!deleteTarget}
        title={`Delete "${deleteTarget?.name}"?`}
        description="This will permanently delete the package and cannot be undone."
        onConfirm={() => void handleDelete()}
        onCancel={() => setDeleteTarget(null)}
        confirming={!!deleting}
      />

      {previewPackage && (
        <AdminModal
          open={!!previewPackage}
          onClose={() => setPreviewPackage(null)}
          title={previewPackage.name}
          subtitle={`Created ${new Date(previewPackage.createdAt).toLocaleDateString()}`}
          maxWidth={680}
        >
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px 20px" }}>
            <div><div style={{ fontSize: 11, fontWeight: 700, color: "var(--ad-text3)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 3 }}>Name</div><div style={{ fontSize: 14, color: "var(--ad-text)", fontWeight: 600 }}>{previewPackage.name}</div></div>
            <div><div style={{ fontSize: 11, fontWeight: 700, color: "var(--ad-text3)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 3 }}>Phase</div><div style={{ fontSize: 14 }}><span className={`ad-badge ${previewPackage.phase === "single" ? "is-residential" : "is-commercial"}`}>{previewPackage.phase === "single" ? "Single Phase" : "Three Phase"}</span></div></div>
            <div><div style={{ fontSize: 11, fontWeight: 700, color: "var(--ad-text3)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 3 }}>System Type</div><div style={{ fontSize: 14, color: "var(--ad-text)" }}>{previewPackage.storageKwh > 0 ? "Hybrid" : "Grid-Tied"}</div></div>
            <div><div style={{ fontSize: 11, fontWeight: 700, color: "var(--ad-text3)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 3 }}>Solar</div><div style={{ fontSize: 14, color: "var(--ad-text)" }}>{previewPackage.solarKwp} kWp</div></div>
            <div><div style={{ fontSize: 11, fontWeight: 700, color: "var(--ad-text3)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 3 }}>Inverter</div><div style={{ fontSize: 14, color: "var(--ad-text)" }}>{previewPackage.inverterKw} kW</div></div>
            <div><div style={{ fontSize: 11, fontWeight: 700, color: "var(--ad-text3)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 3 }}>Storage</div><div style={{ fontSize: 14, color: "var(--ad-text)" }}>{previewPackage.storageKwh > 0 ? `${previewPackage.storageKwh} kWh` : "None"}</div></div>
            <div><div style={{ fontSize: 11, fontWeight: 700, color: "var(--ad-text3)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 3 }}>Total Price</div><div style={{ fontSize: 14, color: previewPackage.totalPrice != null ? "var(--ad-accent)" : "var(--ad-text3)" }}>{previewPackage.totalPrice != null ? peso(previewPackage.totalPrice) : "Price TBD"}</div></div>
            <div><div style={{ fontSize: 11, fontWeight: 700, color: "var(--ad-text3)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 3 }}>Bill Range</div><div style={{ fontSize: 14, color: "var(--ad-text)" }}>{peso(previewPackage.billRangeMin)} – {peso(previewPackage.billRangeMax)}/mo</div></div>
            <div><div style={{ fontSize: 11, fontWeight: 700, color: "var(--ad-text3)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 3 }}>Active</div><div style={{ fontSize: 14, color: previewPackage.isActive ? "#22c55e" : "var(--ad-text3)" }}>{previewPackage.isActive ? "Yes" : "No"}</div></div>
            <div><div style={{ fontSize: 11, fontWeight: 700, color: "var(--ad-text3)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 3 }}>Recommended</div><div style={{ fontSize: 14, color: (previewPackage.isRecommended ?? false) ? "#fc615a" : "var(--ad-text3)" }}>{(previewPackage.isRecommended ?? false) ? "★ Yes" : "No"}</div></div>
            {(previewPackage.mainFeatures ?? []).length > 0 && (
              <div style={{ gridColumn: "1 / -1" }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "var(--ad-text3)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 3 }}>Main Features</div>
                <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13, color: "var(--ad-text)", lineHeight: 1.8 }}>
                  {(previewPackage.mainFeatures ?? []).map((f, i) => <li key={i}>{f}</li>)}
                </ul>
              </div>
            )}
            {(previewPackage.components ?? []).length > 0 && (() => {
              const EMOJI: Record<string, string> = { "Solar Panel": "☀", "Inverter": "⚡", "Battery": "🔋" };
              const ORDER = ["Solar Panel", "Inverter", "Battery"];
              const grouped = (previewPackage.components ?? []).reduce<Record<string, typeof previewPackage.components>>((acc, c) => { (acc[c.component.category] ??= []).push(c); return acc; }, {});
              const cats = [...ORDER.filter(c => grouped[c]), ...Object.keys(grouped).filter(c => !ORDER.includes(c))];
              return (
                <div style={{ gridColumn: "1 / -1" }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "var(--ad-text3)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 8 }}>Components</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {cats.map(cat => (
                      <div key={cat}>
                        <div style={{ fontSize: 11, fontWeight: 700, color: "var(--ad-text3)", marginBottom: 4 }}>{EMOJI[cat] ?? "📦"} {cat}</div>
                        {(grouped[cat] ?? []).map((line, i) => (
                          <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "var(--ad-text)", padding: "3px 0", borderBottom: "1px solid var(--ad-border)" }}>
                            <span><strong>{line.quantity}×</strong> {line.component.brand} {line.component.name}</span>
                            {line.component.unitPrice != null && <span style={{ color: "var(--ad-text3)", fontSize: 12 }}>₱{line.component.unitPrice.toLocaleString("en-PH")} ea.</span>}
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}
          </div>
        </AdminModal>
      )}

      {showForm && (
        <>
          {/* Modal Overlay */}
          <div style={{
            position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
            background: "rgba(0, 0, 0, 0.5)", zIndex: 999,
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: 16, overflow: "auto"
          }} onClick={closeForm}>
            {/* Modal Container */}
            <div style={{
              background: "var(--ad-bg)", borderRadius: 8, boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
              maxWidth: 1140, width: "100%", maxHeight: "90vh", overflow: "auto", zIndex: 1000,
              display: "flex", flexDirection: "column"
            }} onClick={(e) => e.stopPropagation()}>
              {/* Modal Header */}
              <div style={{
                padding: "18px 20px", borderBottom: "2px solid var(--ad-border)",
                display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12,
                flexShrink: 0, position: "sticky", top: 0, zIndex: 50, background: "var(--ad-bg)"
              }}>
                <div className="ad-pkg-modal-title">
                  <div className="title-main">
                    <span className="accent">{editingId ? "Edit" : "New"}</span> Package
                  </div>
                  <div className="title-sub">
                    {editingId ? "Update components, quantities, and settings" : "Build from inventory — specs and price auto-calculate"}
                  </div>
                </div>
                <button
                  onClick={closeForm}
                  style={{
                    background: "none", border: "none", fontSize: 22, color: "var(--ad-text3)",
                    cursor: "pointer", padding: 0, width: 34, height: 34, flexShrink: 0,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    borderRadius: 6, transition: "background 0.15s, color 0.15s"
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = "var(--ad-surface)"; e.currentTarget.style.color = "var(--ad-text)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "none"; e.currentTarget.style.color = "var(--ad-text3)"; }}
                >
                  ✕
                </button>
              </div>

              {/* Modal Body */}
              <div style={{ padding: 20, overflow: "auto", flex: 1 }}>
                <div className="ad-pkg-builder-layout">

                  {/* ── LEFT: Phase selector + Component search ── */}
                  <div className="ad-pkg-builder-left">
                    <div className="ad-pkg-form-phase">
                      <div className="ad-label">System Type</div>
                      <div className="ad-pkg-phase-toggle">
                        <button
                          type="button"
                          className={`ad-pkg-phase-btn${systemType === 'hybrid' ? " is-active" : ""}`}
                          onClick={() => setSystemType('hybrid')}
                        >
                          Hybrid
                          <span>With battery storage</span>
                        </button>
                        <button
                          type="button"
                          className={`ad-pkg-phase-btn${systemType === 'grid-tied' ? " is-active" : ""}`}
                          onClick={() => {
                            setSystemType('grid-tied');
                            setComponents((form.components ?? []).filter(l => allComponents.find(c => c.id === l.componentId)?.category !== 'Battery'));
                          }}
                        >
                          Grid-Tied
                          <span>No battery storage</span>
                        </button>
                      </div>
                    </div>

                    <div className="ad-pkg-form-phase">
                      <div className="ad-label">System Phase</div>
                      <div className="ad-pkg-phase-toggle">
                        <button type="button" className={`ad-pkg-phase-btn${form.phase === "single" ? " is-active" : ""}`} onClick={() => setField("phase", "single")}>Single Phase<span>Residential</span></button>
                        <button type="button" className={`ad-pkg-phase-btn${form.phase === "three" ? " is-active" : ""}`} onClick={() => setField("phase", "three")}>Three Phase<span>Commercial / Industrial</span></button>
                      </div>
                    </div>

                    <div>
                      <div style={{ marginBottom: 14 }}>
                        <div style={{ fontSize: 14, fontWeight: 700, color: "var(--ad-text)", marginBottom: 4 }}>Build from Inventory</div>
                        <div style={{ fontSize: 12, color: "var(--ad-text2)", lineHeight: 1.45 }}>Search and select components to add to your package.</div>
                      </div>

                      {['Inverter', 'Solar Panel', 'Battery', 'Mounting & Racking', 'Wiring & Protection', 'Monitoring', 'Others'].map((category) => {
                        if (category === 'Battery' && systemType === 'grid-tied') return null;
                        const addedComponentIds = new Set((form.components ?? []).map(c => c.componentId));
                        const catComps = allComponents.filter(c => c.isActive && c.category === category && !addedComponentIds.has(c.id)).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
                        const search = catSearches[category] ?? '';
                        const filtered = catComps.filter(c => c.name.toLowerCase().includes(search.toLowerCase()) || c.brand.toLowerCase().includes(search.toLowerCase()) || c.model.toLowerCase().includes(search.toLowerCase()));
                        const addedInCat = (form.components ?? []).filter(l => allComponents.find(c => c.id === l.componentId)?.category === category);

                        const categoryEmojis: Record<string, string> = {
                          'Solar Panel': '☀', 'Inverter': '⚡', 'Battery': '🔋',
                          'Mounting & Racking': '📦', 'Wiring & Protection': '🔌', 'Monitoring': '📊', 'Others': '🔧',
                        };
                        const emoji = categoryEmojis[category] ?? '📦';

                        // Solar Panel, Inverter, Battery are single-SKU — lock the slot once one is chosen
                        const isSingleSku = category === 'Inverter' || category === 'Solar Panel' || category === 'Battery';
                        const isLocked = isSingleSku && addedInCat.length > 0;
                        const lockedComp = isLocked ? allComponents.find(c => c.id === addedInCat[0].componentId) : null;

                        return (
                          <div key={category} style={{ marginBottom: 10 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 5 }}>
                              <span style={{ fontSize: 13, fontWeight: 600, color: "var(--ad-text)" }}>{emoji} {category}</span>
                              {addedInCat.length > 0 && (
                                <span style={{ fontSize: 10, background: "var(--ad-accent-dim)", color: "var(--ad-accent)", borderRadius: 10, padding: "1px 7px", fontWeight: 600 }}>
                                  {isLocked ? "selected" : `${addedInCat.length} added`}
                                </span>
                              )}
                            </div>

                            {isLocked ? (
                              /* Single-SKU slot is filled — show locked state */
                              <div style={{
                                display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8,
                                padding: "9px 12px", borderRadius: 6, fontSize: 12,
                                background: "rgba(34,197,94,0.06)", border: "1px solid rgba(34,197,94,0.22)",
                              }}>
                                <div style={{ minWidth: 0 }}>
                                  <span style={{ color: "#22c55e", marginRight: 5 }}>✓</span>
                                  <span style={{ fontWeight: 600, color: "var(--ad-text)" }}>{lockedComp?.name ?? category}</span>
                                  {lockedComp && (
                                    <span style={{ color: "var(--ad-text3)", marginLeft: 6, fontSize: 11 }}>{lockedComp.brand} · {lockedComp.model}</span>
                                  )}
                                </div>
                              </div>
                            ) : (
                              /* Search input + dropdown */
                              <div style={{ position: "relative" }}>
                                <input
                                  type="search"
                                  className="ad-input"
                                  placeholder={`Search ${category}…`}
                                  value={search}
                                  onChange={(e) => setCatSearches(s => ({ ...s, [category]: e.target.value }))}
                                  onFocus={() => setCatSearches(s => ({ ...s, [category]: s[category] ?? '' }))}
                                  style={{ width: "100%" }}
                                />
                                {search !== '' && (
                                  <div style={{
                                    position: "absolute", top: "100%", left: 0, right: 0,
                                    background: "var(--ad-input-bg)", border: "1px solid var(--ad-border)",
                                    borderTop: "none", borderRadius: "0 0 8px 8px",
                                    maxHeight: 220, overflowY: "auto", zIndex: 20,
                                    boxShadow: "0 8px 24px rgba(0,0,0,0.18)"
                                  }}>
                                    {filtered.length === 0 ? (
                                      <div style={{ padding: 14, textAlign: "center", color: "var(--ad-text3)", fontSize: 12 }}>No matches</div>
                                    ) : (
                                      filtered.map(comp => {
                                        const spec = (comp.productionCapacityKwp ?? 0) > 0 ? ` · ${(comp.productionCapacityKwp ?? 0).toFixed(2)} kWp` :
                                                     (comp.loadCapacityKw ?? 0) > 0 ? ` · ${(comp.loadCapacityKw ?? 0).toFixed(1)} kW` :
                                                     (comp.storageCapacityKwh ?? 0) > 0 ? ` · ${(comp.storageCapacityKwh ?? 0).toFixed(2)} kWh` : '';
                                        return (
                                          <button key={comp.id} type="button"
                                            onClick={() => {
                                              const existing = (form.components ?? []).find(l => l.componentId === comp.id);
                                              if (existing) {
                                                if (!existing.baseComponentId) {
                                                  setComponents((form.components ?? []).map(l => l.componentId === comp.id ? { ...l, quantity: l.quantity + 1 } : l));
                                                }
                                              } else {
                                                setComponents([...(form.components ?? []), { componentId: comp.id, quantity: 1, baseComponentId: null, multiplier: 1 }]);
                                              }
                                              setCatSearches(s => ({ ...s, [category]: '' }));
                                            }}
                                            style={{
                                              width: "100%", padding: "9px 13px", textAlign: "left",
                                              background: "transparent", border: "none",
                                              borderBottom: "1px solid var(--ad-border)",
                                              color: "var(--ad-text)", cursor: "pointer",
                                              fontSize: 13, transition: "background 0.12s",
                                            }}
                                            onMouseEnter={(e) => e.currentTarget.style.background = "var(--ad-surface)"}
                                            onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                                          >
                                            <div style={{ fontWeight: 600 }}>{comp.name}</div>
                                            <div style={{ fontSize: 11, color: "var(--ad-text3)", marginTop: 2 }}>{comp.brand} · {comp.model}{spec}</div>
                                          </button>
                                        );
                                      })
                                    )}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* ── RIGHT: Summary, specs, settings ── */}
                  <div className="ad-pkg-builder-right">

                    {/* Selected Components */}
                    {(form.components ?? []).length === 0 ? (
                      <div className="ad-pkg-summary-empty">
                        <div style={{ fontSize: 24, marginBottom: 8 }}>📋</div>
                        <div style={{ fontWeight: 700, fontSize: 14, color: "var(--ad-text2)", marginBottom: 5 }}>No components yet</div>
                        <div style={{ fontSize: 12, lineHeight: 1.5 }}>Search and select components from the left panel to build your package.</div>
                      </div>
                    ) : (
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: "var(--ad-text)", marginBottom: 10 }}>
                          Selected Components <span style={{ color: "var(--ad-accent)", fontWeight: 800 }}>({(form.components ?? []).length})</span>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                          {(form.components ?? []).map((line, idx) => {
                            const comp = allComponents.find(c => c.id === line.componentId);
                            if (!comp) return null;
                            const specValue = (comp.productionCapacityKwp ?? 0) > 0 ? `${((comp.productionCapacityKwp ?? 0) * line.quantity).toFixed(2)} kWp total` :
                                              (comp.loadCapacityKw ?? 0) > 0 ? `${((comp.loadCapacityKw ?? 0) * line.quantity).toFixed(1)} kW total` :
                                              (comp.storageCapacityKwh ?? 0) > 0 ? `${((comp.storageCapacityKwh ?? 0) * line.quantity).toFixed(2)} kWh total` : '';
                            const isSolarPanel = comp.category === 'Solar Panel';
                            const isBattery = comp.category === 'Battery';
                            const componentMax = (isSolarPanel || isBattery) ? (() => {
                              const invLine = (form.components ?? []).find(l => allComponents.find(c => c.id === l.componentId)?.category === 'Inverter');
                              if (!invLine) return null;
                              const invComp = allComponents.find(c => c.id === invLine.componentId);
                              if (!invComp) return null;
                              if (isSolarPanel) {
                                if ((comp.productionCapacityKwp ?? 0) <= 0) return null;
                                // Use pvMaxPower when set (physics-based); fall back to rated output
                                const pvCapPerUnit = invComp.pvMaxPower ?? invComp.loadCapacityKw;
                                const totalCapacityKwp = pvCapPerUnit * invLine.quantity;
                                const usedByOtherPanels = (form.components ?? []).reduce((sum, otherLine, otherIdx) => {
                                  if (otherIdx === idx) return sum;
                                  const otherComp = allComponents.find(c => c.id === otherLine.componentId);
                                  if (!otherComp || otherComp.category !== 'Solar Panel') return sum;
                                  return sum + otherLine.quantity * (otherComp.productionCapacityKwp ?? 0);
                                }, 0);
                                const remainingKwp = Math.max(0, totalCapacityKwp - usedByOtherPanels);
                                return Math.max(0, Math.floor(remainingKwp / (comp.productionCapacityKwp ?? 1)));
                              }
                              if ((comp.storageCapacityKwh ?? 0) <= 0) return null;
                              const battCapPerUnit = invComp.batteryMaxCapacity ?? invComp.loadCapacityKw;
                              const rawBattMax = Math.floor(battCapPerUnit * invLine.quantity / (comp.storageCapacityKwh ?? 1));
                              // Fallback mode: always allow at least 1, matching public card behaviour
                              return invComp.batteryMaxCapacity != null ? rawBattMax : Math.max(1, rawBattMax);
                            })() : null;
                            // DC:AC 1.2 suggested panel count, clamped between battery charge floor and hardware max
                            const suggestedPanels: number | null = isSolarPanel ? (() => {
                              const invLine2 = (form.components ?? []).find(l2 => allComponents.find(c2 => c2.id === l2.componentId)?.category === 'Inverter');
                              if (!invLine2) return null;
                              const invComp2 = allComponents.find(c2 => c2.id === invLine2.componentId);
                              if (!invComp2 || (comp.productionCapacityKwp ?? 0) <= 0) return null;
                              const panelKwp = comp.productionCapacityKwp ?? 1;
                              const dcAcTarget = Math.round(invComp2.loadCapacityKw * invLine2.quantity * 1.2 / panelKwp);
                              const battLine2 = (form.components ?? []).find(l2 => allComponents.find(c2 => c2.id === l2.componentId)?.category === 'Battery');
                              const battComp2 = battLine2 ? allComponents.find(c2 => c2.id === battLine2.componentId) : null;
                              const battFloor = (battLine2 && battComp2 && (battComp2.storageCapacityKwh ?? 0) > 0)
                                ? Math.ceil((battLine2.quantity * (battComp2.storageCapacityKwh ?? 0)) / (4 * 0.80 * panelKwp))
                                : 1;
                              const maxQty = componentMax ?? dcAcTarget;
                              return Math.min(maxQty, Math.max(battFloor, dcAcTarget));
                            })() : null;
                            const panelBelowBattFloor: boolean = isSolarPanel ? (() => {
                              const battLine2 = (form.components ?? []).find(l2 => allComponents.find(c2 => c2.id === l2.componentId)?.category === 'Battery');
                              const battComp2 = battLine2 ? allComponents.find(c2 => c2.id === battLine2.componentId) : null;
                              const panelKwp = comp.productionCapacityKwp ?? 0;
                              if (!battLine2 || !battComp2 || panelKwp <= 0 || (battComp2.storageCapacityKwh ?? 0) <= 0) return false;
                              const battFloor = Math.ceil((battLine2.quantity * (battComp2.storageCapacityKwh ?? 0)) / (4 * 0.80 * panelKwp));
                              return line.quantity < battFloor;
                            })() : false;
                            const isAccessory = ACCESSORY_CATEGORIES.includes(comp.category);
                            const isDerived = isAccessory && !!line.baseComponentId;
                            const nonDerivedLines = (form.components ?? []).filter(l => !l.baseComponentId && l.componentId !== line.componentId);
                            const baseLine = isDerived ? (form.components ?? []).find(l => l.componentId === line.baseComponentId) : null;
                            const baseComp = baseLine ? allComponents.find(c => c.id === baseLine.componentId) : null;

                            return (
                              <div key={idx} className={`ad-pkg-component-card${isDerived ? " is-derived" : ""}`}>
                                {/* Component name + category badge */}
                                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
                                  <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ fontSize: 13, fontWeight: 600, color: "var(--ad-text)", lineHeight: 1.3 }}>{comp.name}</div>
                                    <div style={{ fontSize: 11, color: "var(--ad-text3)", marginTop: 3 }}>{comp.brand} · {comp.model}</div>
                                  </div>
                                  <div style={{ display: "flex", alignItems: "center", gap: 4, flexShrink: 0 }}>
                                    {specValue && (
                                      <span style={{ fontSize: 11, color: "var(--ad-accent)", background: "var(--ad-accent-dim)", borderRadius: 4, padding: "2px 6px", fontWeight: 600 }}>{specValue}</span>
                                    )}
                                    <button
                                      className="ad-btn ad-btn--danger ad-btn--sm"
                                      onClick={() => setComponents((form.components ?? []).filter((_, i) => i !== idx))}
                                      style={{ padding: "2px 8px", fontSize: 10 }}
                                    >✕</button>
                                  </div>
                                </div>

                                {/* Accessory: scale-with controls */}
                                {isAccessory && (
                                  <div style={{ borderTop: "1px solid var(--ad-border)", paddingTop: 8, display: "flex", flexDirection: "column", gap: 7 }}>
                                    <div style={{ fontSize: 12, fontWeight: 600, color: "var(--ad-text2)" }}>Quantity mode</div>
                                    <select
                                      value={line.baseComponentId ?? ''}
                                      onChange={e => {
                                        const val = e.target.value || null;
                                        setComponents((form.components ?? []).map((c, i) => i === idx ? { ...c, baseComponentId: val, multiplier: val ? (c.multiplier ?? 1) : 1 } : c));
                                      }}
                                      style={{ padding: "6px 10px", background: "var(--ad-bg)", border: "1px solid var(--ad-border)", borderRadius: 6, color: "var(--ad-text)", width: "100%", cursor: "pointer", fontSize: 13 }}
                                    >
                                      <option value="">Fixed quantity (manual)</option>
                                      {nonDerivedLines.map(nl => {
                                        const nc = allComponents.find(c => c.id === nl.componentId);
                                        if (!nc) return null;
                                        return <option key={nl.componentId} value={nl.componentId}>Scales with: {nc.name} (qty {nl.quantity})</option>;
                                      })}
                                    </select>

                                    {isDerived && baseComp && baseLine ? (
                                      <div className="ad-pkg-multiplier-row">
                                        <span style={{ fontSize: 12, color: "var(--ad-text3)" }}>Each</span>
                                        <span style={{ fontSize: 12, fontWeight: 600, color: "var(--ad-text)" }}>1 × {baseComp.name}</span>
                                        <span style={{ fontSize: 12, color: "var(--ad-text3)" }}>needs</span>
                                        <div className="ad-pkg-multiplier-stepper">
                                          <button type="button" className="ad-pkg-multiplier-btn"
                                            disabled={(line.multiplier ?? 1) <= 1}
                                            onClick={() => {
                                              const m = Math.max(1, (line.multiplier ?? 1) - 1);
                                              setComponents((form.components ?? []).map((c, i) => i === idx ? { ...c, multiplier: m } : c));
                                            }}
                                          >−</button>
                                          <EditableNumber
                                            className="ad-pkg-multiplier-val"
                                            value={line.multiplier ?? 1}
                                            min={1}
                                            onChange={m => setComponents((form.components ?? []).map((c, i) => i === idx ? { ...c, multiplier: m } : c))}
                                          />
                                          <button type="button" className="ad-pkg-multiplier-btn"
                                            onClick={() => {
                                              const m = (line.multiplier ?? 1) + 1;
                                              setComponents((form.components ?? []).map((c, i) => i === idx ? { ...c, multiplier: m } : c));
                                            }}
                                          >+</button>
                                        </div>
                                        <span style={{ fontSize: 12, color: "var(--ad-text3)" }}>unit{(line.multiplier ?? 1) !== 1 ? "s" : ""}</span>
                                        <div className="ad-pkg-multiplier-result">
                                          <span style={{ fontSize: 14, fontWeight: 700, color: "var(--ad-accent)" }}>{line.quantity}</span>
                                          <span style={{ fontSize: 11, color: "var(--ad-text3)" }}>total</span>
                                        </div>
                                        <div style={{ width: "100%", fontSize: 11, color: "var(--ad-text3)", marginTop: 2 }}>
                                          ceil({baseLine.quantity} × {line.multiplier ?? 1}) = {line.quantity} {comp.unit ?? 'pcs'}
                                        </div>
                                      </div>
                                    ) : null}
                                  </div>
                                )}

                                {/* Qty stepper (non-derived) */}
                                {!isDerived && (
                                  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                      <div style={{ display: "flex", alignItems: "center", gap: 3, background: "var(--ad-bg)", border: "1px solid var(--ad-border)", borderRadius: 6, padding: "2px 4px" }}>
                                        <button
                                          onClick={() => { if (line.quantity > 1) setComponents((form.components ?? []).map((c, i) => i === idx ? { ...c, quantity: c.quantity - 1 } : c)); }}
                                          style={{ background: "none", border: "none", color: "var(--ad-text3)", cursor: line.quantity <= 1 ? "not-allowed" : "pointer", fontSize: 15, padding: "0 5px", fontWeight: "bold", opacity: line.quantity <= 1 ? 0.3 : 1 }}
                                        >−</button>
                                        <EditableNumber
                                          style={{ fontSize: 13, fontWeight: 700, color: "var(--ad-text)", width: 32, textAlign: "center", background: "none", border: "none", outline: "none" }}
                                          value={line.quantity}
                                          min={1}
                                          max={componentMax}
                                          onChange={n => setComponents((form.components ?? []).map((c, i) => i === idx ? { ...c, quantity: n } : c))}
                                        />
                                        <button
                                          onClick={() => { if (componentMax === null || line.quantity < componentMax) setComponents((form.components ?? []).map((c, i) => i === idx ? { ...c, quantity: c.quantity + 1 } : c)); }}
                                          disabled={componentMax !== null && line.quantity >= componentMax}
                                          style={{ background: "none", border: "none", color: "var(--ad-text3)", cursor: (componentMax !== null && line.quantity >= componentMax) ? "not-allowed" : "pointer", fontSize: 15, padding: "0 5px", fontWeight: "bold", opacity: (componentMax !== null && line.quantity >= componentMax) ? 0.3 : 1 }}
                                        >+</button>
                                      </div>
                                      {componentMax !== null && (
                                        <button
                                          onClick={() => setComponents((form.components ?? []).map((c, i) => i === idx ? { ...c, quantity: componentMax } : c))}
                                          disabled={line.quantity >= componentMax}
                                          style={{ fontSize: 10, padding: "3px 8px", background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.25)", borderRadius: 5, color: "#3b82f6", cursor: line.quantity >= componentMax ? "not-allowed" : "pointer", opacity: line.quantity >= componentMax ? 0.4 : 1 }}
                                        >Max ({componentMax})</button>
                                      )}
                                      {suggestedPanels !== null && line.quantity !== suggestedPanels && (
                                        <button
                                          onClick={() => setComponents((form.components ?? []).map((c, i) => i === idx ? { ...c, quantity: suggestedPanels! } : c))}
                                          style={{ fontSize: 10, padding: "3px 8px", background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.25)", borderRadius: 5, color: "#22c55e", cursor: "pointer" }}
                                        >Suggest ({suggestedPanels})</button>
                                      )}
                                    </div>
                                    {panelBelowBattFloor && (
                                      <div style={{ fontSize: 10, color: "#f59e0b" }}>⚠ Array may not fully charge batteries at 4 PSH</div>
                                    )}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Computed Specs */}
                    {allComponents.length > 0 && (form.components ?? []).length > 0 && (() => {
                      const specs = computePackageSpecs(form.components ?? [], allComponents);
                      const autoName_ = autoName(specs.solarKwp, specs.inverterKw, specs.storageKwh);
                      if (!nameEdited && form.name !== autoName_) { setField("name", autoName_); }
                      return (
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 700, color: "var(--ad-text)", marginBottom: 10 }}>System Specs</div>
                          <div className="ad-pkg-spec-chips">
                            <div className="ad-pkg-spec-chip">
                              <div className="chip-label">Production</div>
                              <div className="chip-value">{specs.solarKwp.toFixed(2)}</div>
                              <div className="chip-unit">kWp</div>
                            </div>
                            <div className="ad-pkg-spec-chip">
                              <div className="chip-label">Load</div>
                              <div className="chip-value">{specs.inverterKw.toFixed(1)}</div>
                              <div className="chip-unit">kW</div>
                            </div>
                            <div className="ad-pkg-spec-chip">
                              <div className="chip-label">Storage</div>
                              <div className={`chip-value${specs.storageKwh <= 0 ? " no-value" : ""}`} style={specs.storageKwh <= 0 ? { color: "var(--ad-text3)", fontSize: 14 } : {}}>{specs.storageKwh > 0 ? specs.storageKwh.toFixed(2) : "—"}</div>
                              <div className="chip-unit">{specs.storageKwh > 0 ? "kWh" : ""}</div>
                            </div>
                          </div>
                        </div>
                      );
                    })()}

                    {/* Price */}
                    {(form.components ?? []).length > 0 && (() => {
                      const lines = form.components ?? [];
                      const allPriced = lines.every(l => { const c = allComponents.find(c => c.id === l.componentId); return !c?.pricingEnabled || c?.unitPrice != null; });
                      const priced = lines.filter(l => { const c = allComponents.find(c => c.id === l.componentId); return c?.pricingEnabled && c?.unitPrice != null; });
                      const total = (allPriced && priced.length > 0) ? priced.reduce((s, l) => { const c = allComponents.find(c => c.id === l.componentId); return s + (c?.unitPrice ?? 0) * l.quantity; }, 0) : null;
                      return (
                        <div style={{ background: "var(--ad-surface)", border: "1px solid var(--ad-border)", borderRadius: 8, padding: "12px 14px" }}>
                          <div style={{ fontSize: 12, fontWeight: 600, color: "var(--ad-text3)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>Package Price</div>
                          {total != null ? (
                            <div style={{ fontSize: 24, fontWeight: 700, color: "#22c55e", fontFamily: "monospace" }}>₱{total.toLocaleString()}</div>
                          ) : (
                            <div style={{ fontSize: 12, color: "var(--ad-text3)", fontStyle: "italic" }}>⚠ Incomplete pricing data</div>
                          )}
                        </div>
                      );
                    })()}

                    {/* Monthly Savings */}
                    {(form.components ?? []).length > 0 && (
                      <div style={{ background: "var(--ad-surface)", border: "1px solid var(--ad-border)", borderRadius: 8, padding: "12px 14px" }}>
                        <div style={{ fontSize: 12, fontWeight: 600, color: "var(--ad-text3)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>Est. Monthly Savings</div>
                        <div style={{ fontSize: 18, fontWeight: 700, color: "#22c55e", fontFamily: "monospace" }}>₱{(form.billRangeMin || 0).toLocaleString()} – ₱{(form.billRangeMax || 0).toLocaleString()}</div>
                        <div style={{ fontSize: 11, color: "var(--ad-text3)", marginTop: 4 }}>{form.solarKwp.toFixed(2)} kWp × 4h × 30d × ₱12/kWh ± ₱1,000</div>
                      </div>
                    )}

                    {/* Main Features */}
                    <div>
                      <label className="ad-label">Card Features <span style={{ fontWeight: 400, color: "var(--ad-text3)" }}>(optional · one per line)</span></label>
                      <textarea
                        className="ad-input"
                        rows={3}
                        style={{ resize: "vertical", fontFamily: "inherit", fontSize: 11 }}
                        placeholder={"Hybrid System\nMobile Device Monitoring\n5kW Load Capacity"}
                        value={(form.mainFeatures ?? []).join("\n")}
                        onChange={e => setField("mainFeatures", e.target.value.split("\n").map(s => s.trimEnd()).filter(s => s))}
                      />
                      <small style={{ fontSize: 11, color: "var(--ad-text3)", marginTop: 4, display: "block" }}>Leave blank to auto-generate from components.</small>
                    </div>

                    {/* Package Image */}
                    <div>
                      <label className="ad-label">Package Image <span style={{ fontWeight: 400, color: "var(--ad-text3)" }}>(optional — max 10 MB)</span></label>
                      <div className="ad-image-row">
                        <div
                          className="ad-image-drop"
                          style={{ flex: 1 }}
                          onClick={() => document.getElementById("pkg-img-input")?.click()}
                          onDragOver={(e) => e.preventDefault()}
                          onDrop={(e) => { e.preventDefault(); handlePkgImageSelect(e.dataTransfer.files?.[0]); }}
                        >
                          <input
                            id="pkg-img-input"
                            type="file"
                            accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
                            hidden
                            onChange={(e) => handlePkgImageSelect(e.target.files?.[0])}
                          />
                          {pkgImageFile
                            ? <span>{pkgImageFile.name} ({(pkgImageFile.size / 1024).toFixed(0)} KB)</span>
                            : pkgImagePreview
                              ? <span style={{ color: "var(--ad-text2)" }}>Image set — click or drop to replace</span>
                              : <><span>Click or drag &amp; drop an image</span><br /><small>JPEG, PNG, WebP, AVIF, GIF — max 10 MB</small></>
                          }
                        </div>
                        {pkgImagePreview && (
                          <img src={pkgImagePreview} alt="Package preview" className="ad-image-preview" />
                        )}
                      </div>
                    </div>

                    {/* Toggles */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      <label style={{ display: "flex", alignItems: "center", gap: 9, cursor: "pointer" }}>
                        <input type="checkbox" checked={form.isActive} onChange={(e) => setField("isActive", e.target.checked)} style={{ width: 16, height: 16, accentColor: "var(--ad-accent)", cursor: "pointer", flexShrink: 0 }} />
                        <span style={{ color: "var(--ad-text)", fontSize: 13 }}>Active — visible to customers</span>
                      </label>
                      <label style={{ display: "flex", alignItems: "center", gap: 9, cursor: "pointer" }}>
                        <input type="checkbox" checked={form.isRecommended} onChange={(e) => setField("isRecommended", e.target.checked)} style={{ width: 16, height: 16, accentColor: "var(--ad-accent)", cursor: "pointer", flexShrink: 0 }} />
                        <span style={{ color: "var(--ad-text)", fontSize: 13 }}>Recommended — highlighted on packages page</span>
                      </label>
                    </div>

                    {/* Actions */}
                    <div className="ad-form-actions" style={{ paddingTop: 4 }}>
                      <button onClick={() => void handleSave()} disabled={saving} className="ad-btn">{saving ? "Saving…" : editingId ? "Update Package" : "Create Package"}</button>
                      <button onClick={closeForm} className="ad-btn ad-btn--ghost">Cancel</button>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </>
      )}
      {/* Backdrop closes filter panel on outside click */}
      {showFilters && <div style={{ position: "fixed", inset: 0, zIndex: 99 }} onClick={() => setShowFilters(false)} />}

      {/* Search + filter bar — shown only when packages exist */}
      {!loading && packages.length > 0 && (
        <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap", alignItems: "center" }}>
          {/* Search input */}
          <div style={{ position: "relative", flex: "1 1 240px", minWidth: 180 }}>
            <input
              type="text"
              className="ad-input"
              placeholder="Search by package name, inverter, battery, panel…"
              value={pkgSearch}
              onChange={(e) => setPkgSearch(e.target.value)}
              style={{ paddingLeft: 34, paddingTop: 8, paddingBottom: 8 }}
            />
            <svg style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", opacity: 0.35, pointerEvents: "none" }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            {pkgSearch && (
              <button onClick={() => setPkgSearch("")} style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--ad-text3)", fontSize: 14, padding: "2px 4px", lineHeight: 1 }}>✕</button>
            )}
          </div>

          {/* Filter button + dropdown */}
          <div style={{ position: "relative", zIndex: 100 }}>
            <button
              className={`ad-btn ad-btn--sm${activeFilterCount === 0 ? " ad-btn--ghost" : ""}`}
              onClick={() => setShowFilters(s => !s)}
              style={{ display: "flex", alignItems: "center", gap: 6 }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
              </svg>
              Filters
              {activeFilterCount > 0 && (
                <span style={{ background: "#fc615a", color: "#fff", borderRadius: 999, fontSize: 10, padding: "1px 6px", fontWeight: 700, lineHeight: "14px" }}>{activeFilterCount}</span>
              )}
            </button>

            {showFilters && (
              <div style={{ position: "absolute", top: "calc(100% + 6px)", right: 0, background: "var(--ad-surface)", border: "1px solid var(--ad-border)", borderRadius: 10, padding: "16px 18px", minWidth: 280, boxShadow: "0 8px 32px rgba(0,0,0,0.25)" }}>

                {/* Phase */}
                <div style={{ marginBottom: 14 }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: "var(--ad-text3)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 8 }}>Phase</div>
                  <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
                    {[["single", "Single Phase"], ["three", "Three Phase"]] .map(([v, l]) => (
                      <label key={v} style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer", fontSize: 13, color: "var(--ad-text)" }}>
                        <input type="checkbox" checked={filterPhase.has(v)} onChange={() => toggleFilterSet(setFilterPhase, v)} style={{ accentColor: "var(--ad-accent)", width: 14, height: 14, cursor: "pointer" }} />{l}
                      </label>
                    ))}
                  </div>
                </div>

                {/* System type */}
                <div style={{ marginBottom: 14 }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: "var(--ad-text3)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 8 }}>System Type</div>
                  <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
                    {[["hybrid", "Hybrid"], ["grid-tied", "Grid-Tied"]].map(([v, l]) => (
                      <label key={v} style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer", fontSize: 13, color: "var(--ad-text)" }}>
                        <input type="checkbox" checked={filterType.has(v)} onChange={() => toggleFilterSet(setFilterType, v)} style={{ accentColor: "var(--ad-accent)", width: 14, height: 14, cursor: "pointer" }} />{l}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Visibility */}
                <div style={{ marginBottom: 14 }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: "var(--ad-text3)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 8 }}>Visibility</div>
                  <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
                    {[["active", "Active"], ["inactive", "Hidden"]].map(([v, l]) => (
                      <label key={v} style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer", fontSize: 13, color: "var(--ad-text)" }}>
                        <input type="checkbox" checked={filterStatus.has(v)} onChange={() => toggleFilterSet(setFilterStatus, v)} style={{ accentColor: "var(--ad-accent)", width: 14, height: 14, cursor: "pointer" }} />{l}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Price tier — bill range rough buckets */}
                <div style={{ marginBottom: 14 }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: "var(--ad-text3)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 8 }}>Bill Range</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                    {BILL_TIERS.map(([v, l]) => (
                      <label key={v} style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer", fontSize: 13, color: "var(--ad-text)" }}>
                        <input type="checkbox" checked={filterBillRange.has(v)} onChange={() => toggleFilterSet(setFilterBillRange, v)} style={{ accentColor: "var(--ad-accent)", width: 14, height: 14, cursor: "pointer" }} />{l}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Recommended */}
                <div style={{ borderTop: "1px solid var(--ad-border)", paddingTop: 12, marginBottom: activeFilterCount > 0 ? 12 : 0 }}>
                  <label style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer", fontSize: 13, color: "var(--ad-text)" }}>
                    <input type="checkbox" checked={filterRecommended} onChange={(e) => setFilterRecommended(e.target.checked)} style={{ accentColor: "var(--ad-accent)", width: 14, height: 14, cursor: "pointer" }} />
                    Recommended only
                  </label>
                </div>

                {activeFilterCount > 0 && (
                  <button className="ad-btn ad-btn--ghost ad-btn--sm" style={{ width: "100%" }} onClick={clearFilters}>Clear all filters</button>
                )}
              </div>
            )}
          </div>

          {/* Result count */}
          {isFiltering && (
            <span style={{ fontSize: 12, color: "var(--ad-text3)", whiteSpace: "nowrap" }}>
              {filteredPackages.length} of {packages.length} package{packages.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>
      )}

      {loading ? (
        <div style={{ color: "var(--ad-text2)", padding: 24 }}>Loading packages…</div>
      ) : packages.length === 0 ? (
        <div className="ad-card" style={{ textAlign: "center", padding: "48px 24px" }}>
          <div style={{ fontSize: 15, color: "var(--ad-text2)", marginBottom: 8 }}>No packages yet</div>
          <div style={{ fontSize: 13, color: "var(--ad-text3)", maxWidth: 450, margin: "0 auto" }}>Click <strong>+ Add Package</strong> to build a new solar package. Choose components from your <strong>Inventory</strong> tab, and the system will auto-calculate your system specs and total price. Active packages appear on the public <strong>/packages</strong> page.</div>
        </div>
      ) : filteredPackages.length === 0 ? (
        <div className="ad-card" style={{ textAlign: "center", padding: "40px 24px" }}>
          <div style={{ fontSize: 15, color: "var(--ad-text2)", marginBottom: 6 }}>No packages match</div>
          <div style={{ fontSize: 13, color: "var(--ad-text3)" }}>Try adjusting your search or filters.{" "}
            <button onClick={() => { setPkgSearch(""); clearFilters(); }} style={{ background: "none", border: "none", color: "var(--ad-accent)", cursor: "pointer", fontSize: 13, textDecoration: "underline", padding: 0 }}>Clear all</button>
          </div>
        </div>
      ) : (
        <div className="ad-pkg-mgr-grid">
          {filteredPackages.map((p) => (
            <div key={p.id} className={`ad-pkg-mgr-card${!p.isActive ? " is-inactive" : ""}${p.isRecommended ? " is-recommended" : ""} is-${p.phase}-phase`}>
              <div className="ad-pkg-mgr-top">
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
                  <span className={`ad-badge ${p.phase === "single" ? "is-residential" : "is-commercial"}`}>{p.phase === "single" ? "Single Phase" : "Three Phase"}</span>
                  {(p.isRecommended ?? false) && <span className="ad-badge" style={{ background: "rgba(252,97,90,0.15)", color: "#fc615a", border: "1px solid rgba(252,97,90,0.3)", fontSize: 10 }}>★ Recommended</span>}
                </div>
                <label className="ad-toggle-switch" title={p.isActive ? "Active — click to hide" : "Hidden — click to show"}>
                  <input type="checkbox" checked={p.isActive} disabled={toggling === p.id} onChange={() => void handleToggleActive(p)} />
                  <span className="ad-toggle-track" />
                </label>
              </div>
              <div className="ad-pkg-mgr-name">{p.name}</div>
              <div className="ad-pkg-mgr-specs">
                <div className="ad-pkg-mgr-spec"><span>Solar</span><strong>{p.solarKwp} kWp</strong></div>
                <div className="ad-pkg-mgr-spec"><span>Inverter</span><strong>{p.inverterKw} kW</strong></div>
                <div className="ad-pkg-mgr-spec"><span>Battery</span><strong>{p.storageKwh > 0 ? `${p.storageKwh} kWh` : "None"}</strong></div>
              </div>
              <div className="ad-pkg-mgr-price">
                {p.totalPrice != null ? peso(p.totalPrice) : <span style={{ fontSize: 11, opacity: 0.5 }}>Price TBD</span>}
                {(p.components?.length ?? 0) > 0 && <span style={{ fontSize: 10, opacity: 0.4, display: "block" }}>{p.components.length} component{p.components.length !== 1 ? "s" : ""}</span>}
              </div>
              <div className="ad-pkg-mgr-bill">For bills {peso(p.billRangeMin)}–{peso(p.billRangeMax)}/mo</div>
              <div className="ad-pkg-mgr-footer">
                <span className="ad-pkg-mgr-order">Created {new Date(p.createdAt).toLocaleDateString()}</span>
                <div className="ad-table-actions">
                  <button onClick={() => setPreviewPackage(p)} className="ad-btn ad-btn--ghost ad-btn--sm" disabled={showForm}>View</button>
                  <button onClick={() => openEdit(p)} className="ad-btn ad-btn--ghost ad-btn--sm" disabled={showForm}>Edit</button>
                  <button onClick={() => setDeleteTarget(p)} disabled={deleting === p.id || showForm} className="ad-btn ad-btn--danger ad-btn--sm" style={{ opacity: deleting === p.id ? 0.5 : 1 }}>{deleting === p.id ? "…" : "Delete"}</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Shared section editor hook ───────────────────────────────────────────────

function useSectionEditor<T extends object>(apiKey: string, contentKey: string, defaults: T) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [form, setForm] = useState<T>(defaults);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    adminGetAllContent(apiKey)
      .then((res) => {
        if (cancelled) return;
        const item = (res.data as Array<{ key: string; data: unknown }>).find((i) => i.key === contentKey);
        setForm(item?.data ? { ...defaults, ...(item.data as T) } : { ...defaults });
      })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [tick]); // eslint-disable-line react-hooks/exhaustive-deps

  const save = async (data: T) => {
    setSaving(true); setMsg("");
    try {
      const res = await adminUpsertContent(apiKey, contentKey, data) as { success: boolean; data?: unknown };
      if (res?.data) setForm((f) => ({ ...f, ...(res.data as T) }));
      setMsg("✓ Saved successfully");
    }
    catch (e) { setMsg(`Error: ${(e as Error).message}`); }
    finally { setSaving(false); }
  };

  const [resetPending, setResetPending] = useState(false);

  const startReset = () => setResetPending(true);
  const cancelReset = () => setResetPending(false);
  const confirmReset = async () => {
    setResetPending(false);
    try { await adminResetContent(apiKey, contentKey); setMsg("✓ Reset to default"); setTick((t) => t + 1); }
    catch (e) { setMsg(`Error: ${(e as Error).message}`); }
  };

  return { loading, saving, msg, form, setForm, save, resetPending, startReset, cancelReset, confirmReset };
}

function SectionEditorHeader({ title, onReset, resetPending, onConfirmReset, onCancelReset }: {
  title: string; onReset: () => void;
  resetPending?: boolean; onConfirmReset?: () => void; onCancelReset?: () => void;
}) {
  return (
    <>
      <ConfirmDeleteModal
        open={!!resetPending}
        title={`Reset "${title}" to default?`}
        description="All current content will be replaced with the default values. This cannot be undone."
        onConfirm={onConfirmReset ?? (() => {})}
        onCancel={onCancelReset ?? (() => {})}
      />
      <div className="ad-section-header" style={{ marginBottom: 16 }}>
        <div className="ad-section-title">{title}</div>
        <button onClick={onReset} className="ad-btn ad-btn--danger ad-btn--sm">Reset to Default</button>
      </div>
    </>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

const HERO_SECTIONS = [
  { label: "Calculator", value: "#calculator" },
  { label: "Hero", value: "#hero" },
  { label: "Metrics / Stats", value: "#metrics" },
  { label: "Benefits", value: "#benefits" },
  { label: "Excellence", value: "#excellence" },
  { label: "Tropics", value: "#tropics" },
  { label: "Process", value: "#process" },
  { label: "Client Journey", value: "#client-journey" },
  { label: "Call to Action", value: "#call-to-action" },
];

const HERO_PAGES = [
  { label: "Home", value: "/" },
  { label: "Projects", value: "/projects" },
  { label: "Packages", value: "/packages" },
  { label: "Quotation Engine", value: "/quotation-engine" },
];

function CtaDestinationPicker({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  const isSection = value.startsWith("#");
  const typeOptions = [{ label: "Section (scroll)", value: "section" }, { label: "Page (navigate)", value: "page" }];
  const handleTypeChange = (type: string) => {
    onChange(type === "section" ? HERO_SECTIONS[0].value : HERO_PAGES[0].value);
  };
  return (
    <div>
      <label className="ad-label">{label}</label>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        <select className="ad-input" value={isSection ? "section" : "page"} onChange={e => handleTypeChange(e.target.value)}>
          {typeOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        {isSection ? (
          <select className="ad-input" value={value} onChange={e => onChange(e.target.value)}>
            {HERO_SECTIONS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        ) : (
          <select className="ad-input" value={value} onChange={e => onChange(e.target.value)}>
            {HERO_PAGES.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
          </select>
        )}
      </div>
    </div>
  );
}

type HeroForm = { headerPart1: string; headerPart2: string; highlightWords: string; subtext: string; primaryCta: string; secondaryCta: string; primaryCtaUrl: string; secondaryCtaUrl: string };
const DEFAULT_HERO_FORM: HeroForm = { headerPart1: "Affordable", headerPart2: "Solar Power for Every Filipino Home and Business", highlightWords: "Affordable", subtext: "We Provide Solar Solutions Tailored For Your Home And Business", primaryCta: "Calculate Your Savings", secondaryCta: "View Projects", primaryCtaUrl: "#calculator", secondaryCtaUrl: "/projects" };

function HeroEditor({ apiKey }: { apiKey: string }) {
  const { loading, saving, msg, form, setForm, save, resetPending, startReset, cancelReset, confirmReset } = useSectionEditor(apiKey, "hero", DEFAULT_HERO_FORM);
  const ch = (k: keyof HeroForm) => (e: React.ChangeEvent<HTMLInputElement>) => setForm((f) => ({ ...f, [k]: e.target.value }));
  if (loading) return <div style={{ color: "var(--ad-text2)", padding: 24 }}>Loading…</div>;
  return (
    <div>
      <SectionEditorHeader title="Hero Section" onReset={startReset} resetPending={resetPending} onConfirmReset={confirmReset} onCancelReset={cancelReset} />
      <Toast msg={msg} />
      <div className="ad-card">
        <div className="ad-form-grid">
          <div>
            <label className="ad-label">Headline — Part 1</label>
            <input className="ad-input" value={form.headerPart1} onChange={ch("headerPart1")} placeholder="Affordable" />
          </div>
          <div>
            <label className="ad-label">Headline — Part 2</label>
            <input className="ad-input" value={form.headerPart2} onChange={ch("headerPart2")} placeholder="Solar Power for Every Filipino Home and Business" />
          </div>
          <div className="ad-form-full">
            <label className="ad-label">Highlighted Words <span style={{ fontWeight: 400, opacity: 0.6 }}>(comma-separated)</span></label>
            <input className="ad-input" value={form.highlightWords} onChange={ch("highlightWords")} placeholder="Affordable, Filipino" />
            <p className="ad-pkg-hint">Words in Part 1 + Part 2 that match will be shown in the accent colour. Separate multiple words with a comma.</p>
          </div>
          <div className="ad-form-full">
            <label className="ad-label">Subtext</label>
            <input className="ad-input" value={form.subtext} onChange={ch("subtext")} placeholder="We Provide Solar Solutions Tailored For Your Home And Business" />
          </div>
          <div>
            <label className="ad-label">Primary Button Label</label>
            <input className="ad-input" value={form.primaryCta} onChange={ch("primaryCta")} placeholder="Calculate Your Savings" />
          </div>
          <div>
            <label className="ad-label">Secondary Button Label</label>
            <input className="ad-input" value={form.secondaryCta} onChange={ch("secondaryCta")} placeholder="View Projects" />
          </div>
          <CtaDestinationPicker
            label="Primary Button Destination"
            value={form.primaryCtaUrl}
            onChange={v => setForm(f => ({ ...f, primaryCtaUrl: v }))}
          />
          <CtaDestinationPicker
            label="Secondary Button Destination"
            value={form.secondaryCtaUrl}
            onChange={v => setForm(f => ({ ...f, secondaryCtaUrl: v }))}
          />
        </div>
        <div className="ad-form-actions">
          <button onClick={() => void save(form)} disabled={saving} className="ad-btn">{saving ? "Saving…" : "Save Changes"}</button>
        </div>
      </div>
    </div>
  );
}

// ─── Metrics ──────────────────────────────────────────────────────────────────

type MetricItem = { value: string; label: string; order: number };
type MetricsForm = { items: MetricItem[] };
const DEFAULT_METRICS_FORM: MetricsForm = {
  items: [
    { value: "0", label: "INSTALLED", order: 1 },
    { value: "0", label: "ACTIVE CLIENTS", order: 2 },
    { value: "0", label: "CERTIFIED COMPLIANT", order: 3 },
    { value: "0", label: "PERFORMANCE WARRANTY", order: 4 },
  ],
};

function MetricsEditor({ apiKey }: { apiKey: string }) {
  const { loading, saving, msg, form, setForm, save, resetPending, startReset, cancelReset, confirmReset } = useSectionEditor(apiKey, "metrics", DEFAULT_METRICS_FORM);
  const updateItem = (idx: number, key: "value" | "label", val: string) =>
    setForm((f) => ({ ...f, items: f.items.map((item, i) => i === idx ? { ...item, [key]: val } : item) }));
  if (loading) return <div style={{ color: "var(--ad-text2)", padding: 24 }}>Loading…</div>;
  return (
    <div>
      <SectionEditorHeader title="Metrics / Stats" onReset={startReset} resetPending={resetPending} onConfirmReset={confirmReset} onCancelReset={cancelReset} />
      <Toast msg={msg} />
      <div className="ad-card">
        <p style={{ fontSize: 13, color: "var(--ad-text2)", marginBottom: 16 }}>These numbers appear in the stats strip below the hero section.</p>
        {form.items.map((item, i) => (
          <div key={i} className="ad-metrics-row">
            <div>
              {i === 0 && <div className="ad-label">Value</div>}
              <input className="ad-input" style={{ textAlign: "center", fontWeight: 700 }} value={item.value} onChange={(e) => updateItem(i, "value", e.target.value)} placeholder="e.g. 25yr" />
            </div>
            <div>
              {i === 0 && <div className="ad-label">Label</div>}
              <input className="ad-input" value={item.label} onChange={(e) => updateItem(i, "label", e.target.value)} placeholder="e.g. PERFORMANCE WARRANTY" />
            </div>
          </div>
        ))}
        <div className="ad-form-actions">
          <button onClick={() => void save(form)} disabled={saving} className="ad-btn">{saving ? "Saving…" : "Save Changes"}</button>
        </div>
      </div>
    </div>
  );
}

// ─── Benefits ─────────────────────────────────────────────────────────────────

type BenefitItem = { title: string; description: string; order: number };
type BenefitsForm = { items: BenefitItem[] };
const DEFAULT_BENEFITS_FORM: BenefitsForm = {
  items: [
    { title: "Long-Term Durability", description: "25-YEAR WARRANTY", order: 1 },
    { title: "Lower Monthly Bills", description: "CUT YOUR ENERGY COSTS", order: 2 },
    { title: "Monitoring", description: "TRACK YOUR ENERGY & SAVINGS", order: 3 },
    { title: "Peace of Mind", description: "WORRY-FREE ENERGY SINCE DAY ONE", order: 4 },
  ],
};

function BenefitsEditor({ apiKey }: { apiKey: string }) {
  const { loading, saving, msg, form, setForm, save, resetPending, startReset, cancelReset, confirmReset } = useSectionEditor(apiKey, "benefits", DEFAULT_BENEFITS_FORM);
  const updateItem = (idx: number, key: "title" | "description", val: string) =>
    setForm((f) => ({ ...f, items: f.items.map((item, i) => i === idx ? { ...item, [key]: val } : item) }));
  if (loading) return <div style={{ color: "var(--ad-text2)", padding: 24 }}>Loading…</div>;
  return (
    <div>
      <SectionEditorHeader title="Benefits Banner" onReset={startReset} resetPending={resetPending} onConfirmReset={confirmReset} onCancelReset={cancelReset} />
      <Toast msg={msg} />
      <div className="ad-card">
        {form.items.map((item, i) => (
          <div key={i} style={{ marginBottom: i < form.items.length - 1 ? 20 : 0 }}>
            <div style={{ fontWeight: 600, fontSize: 12, color: "var(--ad-text3)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>Benefit {i + 1}</div>
            <div className="ad-form-grid">
              <div><label className="ad-label">Title</label><input className="ad-input" value={item.title} onChange={(e) => updateItem(i, "title", e.target.value)} /></div>
              <div><label className="ad-label">Tag / Descriptor</label><input className="ad-input" value={item.description} onChange={(e) => updateItem(i, "description", e.target.value)} /></div>
            </div>
          </div>
        ))}
        <div className="ad-form-actions">
          <button onClick={() => void save(form)} disabled={saving} className="ad-btn">{saving ? "Saving…" : "Save Changes"}</button>
        </div>
      </div>
    </div>
  );
}

// ─── Tropics ──────────────────────────────────────────────────────────────────

type TropicsForm = { header: string; subtext: string; performanceRating: number };
const DEFAULT_TROPICS_FORM: TropicsForm = {
  header: "Solar Energy for the Tropics",
  subtext: "Standard solar systems are often not equipped to handle the unique challenges of the tropics. At azari.solar we bridge the Trust Gap with resilient design for the philippine archipelago.",
  performanceRating: 87,
};

function TropicsEditor({ apiKey }: { apiKey: string }) {
  const { loading, saving, msg, form, setForm, save, resetPending, startReset, cancelReset, confirmReset } = useSectionEditor(apiKey, "tropics", DEFAULT_TROPICS_FORM);
  if (loading) return <div style={{ color: "var(--ad-text2)", padding: 24 }}>Loading…</div>;
  return (
    <div>
      <SectionEditorHeader title="Tropics Section" onReset={startReset} resetPending={resetPending} onConfirmReset={confirmReset} onCancelReset={cancelReset} />
      <Toast msg={msg} />
      <div className="ad-card">
        <div className="ad-form-grid">
          <div className="ad-form-full">
            <label className="ad-label">Section Header</label>
            <input className="ad-input" value={form.header} onChange={(e) => setForm((f) => ({ ...f, header: e.target.value }))} placeholder="Solar Energy for the Tropics" />
            <p className="ad-pkg-hint">Use &lt;br /&gt; to split into two lines.</p>
          </div>
          <div className="ad-form-full">
            <label className="ad-label">Subtext</label>
            <textarea className="ad-textarea" rows={3} value={form.subtext} onChange={(e) => setForm((f) => ({ ...f, subtext: e.target.value }))} />
          </div>
          <div>
            <label className="ad-label">Performance Rating (%)</label>
            <input
              className="ad-input"
              type="number"
              min={0}
              max={100}
              value={form.performanceRating}
              onChange={(e) => {
                const v = Math.min(100, Math.max(0, Number(e.target.value)));
                setForm((f) => ({ ...f, performanceRating: v }));
              }}
              placeholder="87"
            />
            <p className="ad-pkg-hint">Shown as the bar chart percentage on the Performance Guarantee card (0–100).</p>
          </div>
        </div>
        <div className="ad-form-actions">
          <button onClick={() => void save(form)} disabled={saving} className="ad-btn">{saving ? "Saving…" : "Save Changes"}</button>
        </div>
      </div>
    </div>
  );
}

// ─── Client Journey ───────────────────────────────────────────────────────────

type JourneyEntry = { id: string; name: string; location: string; testimonial: string; videoUrl: string; coords: [number, number] };
type ClientJourneyForm = { entries: JourneyEntry[] };
const DEFAULT_JOURNEY_FORM: ClientJourneyForm = {
  entries: [
    { id: "1", name: "Santos Family", location: "Quezon City, Metro Manila", testimonial: "Our Meralco bill dropped by 87% in the first month. The team handled the entire Net-Metering application perfectly, and now we literally earn credits while we sleep.", videoUrl: "", coords: [121.05, 14.68] },
    { id: "2", name: "Cruz Commercial", location: "Cebu City, Cebu", testimonial: "Operating costs dropped significantly since we installed our solar array. The team handled everything from permits to final inspection.", videoUrl: "", coords: [123.90, 10.32] },
    { id: "3", name: "Reyes Residence", location: "Davao City, Davao del Sur", testimonial: "We were skeptical at first, but the numbers don't lie. Within 18 months we recovered a significant portion of our investment.", videoUrl: "", coords: [125.61, 7.07] },
    { id: "4", name: "De Leon Residence", location: "Angeles City, Pampanga", testimonial: "Professional installation completed in just two days. Our home now runs entirely on solar during daytime hours.", videoUrl: "", coords: [120.59, 15.15] },
    { id: "5", name: "Garcia Business", location: "Iloilo City, Iloilo", testimonial: "As a business owner, the ROI was clear from the start. Our electricity expenses went from our highest operating cost to nearly negligible.", videoUrl: "", coords: [122.57, 10.72] },
    { id: "6", name: "Torres Family", location: "Batangas City, Batangas", testimonial: "Consistent monthly savings since day one. The process from quotation to installation was seamless.", videoUrl: "", coords: [121.05, 13.76] },
    { id: "7", name: "Chua Enterprise", location: "Cagayan de Oro, Misamis Oriental", testimonial: "We installed a 50kWp commercial system across our warehouse rooftops. The project was completed on schedule and within budget.", videoUrl: "", coords: [124.63, 8.48] },
  ],
};

async function geocodePhLocation(location: string): Promise<[number, number] | null> {
  try {
    const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}&countrycodes=ph&limit=1`);
    const data = await res.json() as Array<{ lon: string; lat: string }>;
    if (!data.length) return null;
    return [parseFloat(data[0].lon), parseFloat(data[0].lat)];
  } catch { return null; }
}

function ClientJourneyEditor({ apiKey }: { apiKey: string }) {
  const { loading, saving, msg, form, setForm, save, resetPending, startReset, cancelReset, confirmReset } = useSectionEditor(apiKey, "clientJourney", DEFAULT_JOURNEY_FORM);
  const [geocoding, setGeocoding] = useState<Set<number>>(new Set());
  const [geoMsg, setGeoMsg] = useState("");

  const updateEntry = (idx: number, key: keyof JourneyEntry, val: string) =>
    setForm((f) => ({ ...f, entries: f.entries.map((e, i) => i === idx ? { ...e, [key]: val } : e) }));

  const addEntry = () =>
    setForm((f) => ({
      ...f,
      entries: [...f.entries, { id: crypto.randomUUID(), name: "", location: "", testimonial: "", videoUrl: "", coords: [122.0, 12.0] }],
    }));

  const removeEntry = (idx: number) =>
    setForm((f) => ({ ...f, entries: f.entries.filter((_, i) => i !== idx) }));

  const locate = async (idx: number) => {
    const loc = form.entries[idx]?.location?.trim();
    if (!loc) return;
    setGeocoding((s) => new Set(s).add(idx));
    setGeoMsg("");
    const coords = await geocodePhLocation(loc);
    if (coords) {
      setForm((f) => ({ ...f, entries: f.entries.map((e, i) => i === idx ? { ...e, coords } : e) }));
      setGeoMsg(`✓ Located: ${coords[1].toFixed(4)}°N, ${coords[0].toFixed(4)}°E`);
    } else {
      setGeoMsg("Location not found. Try a more specific place name.");
    }
    setGeocoding((s) => { const n = new Set(s); n.delete(idx); return n; });
  };

  if (loading) return <div style={{ color: "var(--ad-text2)", padding: 24 }}>Loading…</div>;
  return (
    <div>
      <SectionEditorHeader title="Client Journey" onReset={startReset} resetPending={resetPending} onConfirmReset={confirmReset} onCancelReset={cancelReset} />
      <Toast msg={msg} />
      {geoMsg && <div style={{ padding: "8px 0 4px", fontSize: 12, color: geoMsg.startsWith("✓") ? "#22c55e" : "#f87171" }}>{geoMsg}</div>}
      <div className="ad-card">
        <p style={{ fontSize: 13, color: "var(--ad-text2)", marginBottom: 20 }}>Each entry appears as a testimonial card and a location pin on the Philippines map.</p>
        {form.entries.map((entry, i) => (
          <div key={entry.id} style={{ marginBottom: i < form.entries.length - 1 ? 32 : 0 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
              <div style={{ fontWeight: 600, fontSize: 12, color: "var(--ad-text3)", textTransform: "uppercase", letterSpacing: "0.06em" }}>Entry {i + 1}{entry.name ? ` — ${entry.name}` : ""}</div>
              <button onClick={() => removeEntry(i)} className="ad-btn ad-btn--danger ad-btn--sm" style={{ fontSize: 11 }}>Remove</button>
            </div>
            <div className="ad-form-grid">
              <div>
                <label className="ad-label">Client / Business Name</label>
                <input className="ad-input" value={entry.name} onChange={(e) => updateEntry(i, "name", e.target.value)} placeholder="Santos Family" />
              </div>
              <div>
                <label className="ad-label">Location</label>
                <div style={{ display: "flex", gap: 8 }}>
                  <LocationAutocompleteInput
                    value={entry.location}
                    onChange={(val) => updateEntry(i, "location", val)}
                    placeholder="Quezon City, Metro Manila"
                    inputClassName="ad-input"
                    wrapperStyle={{ flex: 1, minWidth: 0 }}
                  />
                  <button
                    className="ad-btn ad-btn--sm"
                    onClick={() => void locate(i)}
                    disabled={geocoding.has(i) || !entry.location.trim()}
                    title="Auto-fill map pin from location name"
                    style={{ whiteSpace: "nowrap", flexShrink: 0 }}
                  >
                    {geocoding.has(i) ? "Locating…" : "Locate Pin"}
                  </button>
                </div>
                {entry.coords[0] !== 0 && (
                  <p className="ad-pkg-hint">Pin: {entry.coords[1].toFixed(4)}°N, {entry.coords[0].toFixed(4)}°E</p>
                )}
              </div>
              <div className="ad-form-full">
                <label className="ad-label">Testimonial</label>
                <textarea className="ad-textarea" rows={3} value={entry.testimonial} onChange={(e) => updateEntry(i, "testimonial", e.target.value)} placeholder="What the client said about their experience…" />
              </div>
              <div className="ad-form-full">
                <label className="ad-label">Video URL (optional)</label>
                <input className="ad-input" value={entry.videoUrl} onChange={(e) => updateEntry(i, "videoUrl", e.target.value)} placeholder="https://youtube.com/watch?v=... or direct video URL" />
                <p className="ad-pkg-hint">YouTube links are auto-converted to embeds. Leave blank to hide the Watch button.</p>
              </div>
            </div>
            {i < form.entries.length - 1 && <hr style={{ margin: "24px 0 0", border: "none", borderTop: "1px solid var(--ad-border)" }} />}
          </div>
        ))}
        <div style={{ marginTop: 24 }}>
          <button onClick={addEntry} className="ad-btn ad-btn--ghost">+ Add Entry</button>
        </div>
        <div className="ad-form-actions">
          <button onClick={() => void save(form)} disabled={saving} className="ad-btn">{saving ? "Saving…" : "Save Changes"}</button>
        </div>
      </div>
    </div>
  );
}

// ─── Engineered Excellence ────────────────────────────────────────────────────

type ExcellenceItem = { number: string; title: string; description: string };
type ExcellenceForm = { items: ExcellenceItem[] };
const DEFAULT_EXCELLENCE_FORM: ExcellenceForm = {
  items: [
    { number: "01", title: "Zero-Bill Future", description: "Eliminate your dependency on fluctuating grid prices. Our net-metering optimized systems turn your roof into a revenue-generating asset that pays you back." },
    { number: "02", title: "Global Tier-1 Standards", description: "We exclusively deploy Tier-1 components like SMA inverters and mounting structures tested for typhoons up to 280kph. Built to last 25+ years." },
    { number: "03", title: "Full Compliance", description: "Navigating local bureaucracy is our headache, not yours. We handle all permits, ERC compliance, and utility interconnection paperwork end-to-end." },
    { number: "04", title: "Smart Monitoring", description: "Real-time data visualization of your energy harvest and consumption. Control your home's power flow from anywhere in the world." },
  ],
};

function ExcellenceEditor({ apiKey }: { apiKey: string }) {
  const { loading, saving, msg, form, setForm, save, resetPending, startReset, cancelReset, confirmReset } = useSectionEditor(apiKey, "excellence", DEFAULT_EXCELLENCE_FORM);
  const updateItem = (idx: number, key: "title" | "description", val: string) =>
    setForm((f) => ({ ...f, items: f.items.map((item, i) => i === idx ? { ...item, [key]: val } : item) }));
  if (loading) return <div style={{ color: "var(--ad-text2)", padding: 24 }}>Loading…</div>;
  return (
    <div>
      <SectionEditorHeader title="Engineered Excellence" onReset={startReset} resetPending={resetPending} onConfirmReset={confirmReset} onCancelReset={cancelReset} />
      <Toast msg={msg} />
      <div className="ad-card">
        {form.items.map((item, i) => (
          <div key={i} style={{ marginBottom: i < form.items.length - 1 ? 28 : 0 }}>
            <div style={{ fontWeight: 600, fontSize: 12, color: "var(--ad-text3)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>Card {item.number}</div>
            <div className="ad-form-grid">
              <div className="ad-form-full"><label className="ad-label">Title</label><input className="ad-input" value={item.title} onChange={(e) => updateItem(i, "title", e.target.value)} /></div>
              <div className="ad-form-full"><label className="ad-label">Description</label><textarea className="ad-textarea" rows={3} value={item.description} onChange={(e) => updateItem(i, "description", e.target.value)} /></div>
            </div>
          </div>
        ))}
        <div className="ad-form-actions">
          <button onClick={() => void save(form)} disabled={saving} className="ad-btn">{saving ? "Saving…" : "Save Changes"}</button>
        </div>
      </div>
    </div>
  );
}

// ─── Process ──────────────────────────────────────────────────────────────────

type ProcessStep = { number: string; title: string; description: string };
type ProcessForm = { stepsDelay: number; steps: ProcessStep[] };
const DEFAULT_PROCESS_FORM: ProcessForm = {
  stepsDelay: 800,
  steps: [
    { number: "01", title: "Consumption Audit", description: "We don't guess; we calculate. Our engineers analyze your historical electricity bill data to build a custom ROI map tailored to your specific energy habits. You'll know exactly how much you'll save before we even touch your roof." },
    { number: "02", title: "Resilient Engineering", description: "A Licensed Professional Electrical Engineer (PEE) conducts a 100-point structural and shading audit. We design your system to withstand 250 kph winds and maintain peak yield in 40°C+ tropical heat using Global Tier-1 components." },
    { number: "03", title: "Turnkey Activation", description: "From Barangay clearances to energy providers Net-Metering permits, we handle the bureaucracy. Our certified in-house teams manage the full installation and grid interconnection, leaving you with nothing to do but flip the switch." },
  ],
};

function ProcessEditor({ apiKey }: { apiKey: string }) {
  const { loading, saving, msg, form, setForm, save, resetPending, startReset, cancelReset, confirmReset } = useSectionEditor(apiKey, "process", DEFAULT_PROCESS_FORM);
  const updateStep = (idx: number, key: "title" | "description", val: string) =>
    setForm((f) => ({ ...f, steps: f.steps.map((s, i) => i === idx ? { ...s, [key]: val } : s) }));
  if (loading) return <div style={{ color: "var(--ad-text2)", padding: 24 }}>Loading…</div>;
  return (
    <div>
      <SectionEditorHeader title="Process Steps" onReset={startReset} resetPending={resetPending} onConfirmReset={confirmReset} onCancelReset={cancelReset} />
      <Toast msg={msg} />
      <div className="ad-card">
        <div style={{ marginBottom: 24 }}>
          <label className="ad-label">Animation Delay Between Steps (ms)</label>
          <input type="number" className="ad-input" style={{ maxWidth: 180 }} value={form.stepsDelay} min={0} step={100} onChange={(e) => setForm((f) => ({ ...f, stepsDelay: Number(e.target.value) }))} />
          <p className="ad-pkg-hint">Time in milliseconds before each step animates in (default: 800).</p>
        </div>
        {form.steps.map((step, i) => (
          <div key={i} style={{ marginBottom: i < form.steps.length - 1 ? 28 : 0 }}>
            <div style={{ fontWeight: 600, fontSize: 12, color: "var(--ad-text3)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>Step {step.number}</div>
            <div className="ad-form-grid">
              <div className="ad-form-full"><label className="ad-label">Title</label><input className="ad-input" value={step.title} onChange={(e) => updateStep(i, "title", e.target.value)} /></div>
              <div className="ad-form-full"><label className="ad-label">Description</label><textarea className="ad-textarea" rows={4} value={step.description} onChange={(e) => updateStep(i, "description", e.target.value)} /></div>
            </div>
          </div>
        ))}
        <div className="ad-form-actions">
          <button onClick={() => void save(form)} disabled={saving} className="ad-btn">{saving ? "Saving…" : "Save Changes"}</button>
        </div>
      </div>
    </div>
  );
}

// ─── Call to Action ───────────────────────────────────────────────────────────

type CtaForm = { title: string; description: string; primaryCta: string; secondaryCta: string };
const DEFAULT_CTA_FORM: CtaForm = { title: "Ready to engineer your energy independence?", description: "Take control of your energy bills. Get a free quote or talk to an expert", primaryCta: "Get a free Quote ↗", secondaryCta: "Talk to an Expert" };

function CtaEditor({ apiKey }: { apiKey: string }) {
  const { loading, saving, msg, form, setForm, save, resetPending, startReset, cancelReset, confirmReset } = useSectionEditor(apiKey, "cta", DEFAULT_CTA_FORM);
  const ch = (k: keyof CtaForm) => (e: React.ChangeEvent<HTMLInputElement>) => setForm((f) => ({ ...f, [k]: e.target.value }));
  if (loading) return <div style={{ color: "var(--ad-text2)", padding: 24 }}>Loading…</div>;
  return (
    <div>
      <SectionEditorHeader title="Call to Action" onReset={startReset} resetPending={resetPending} onConfirmReset={confirmReset} onCancelReset={cancelReset} />
      <Toast msg={msg} />
      <div className="ad-card">
        <div className="ad-form-grid">
          <div className="ad-form-full"><label className="ad-label">Title</label><input className="ad-input" value={form.title} onChange={ch("title")} placeholder="Ready to engineer your energy independence?" /></div>
          <div className="ad-form-full"><label className="ad-label">Description</label><input className="ad-input" value={form.description} onChange={ch("description")} placeholder="Take control of your energy bills…" /></div>
          <div><label className="ad-label">Primary Button</label><input className="ad-input" value={form.primaryCta} onChange={ch("primaryCta")} placeholder="Get a free Quote ↗" /></div>
          <div><label className="ad-label">Secondary Button</label><input className="ad-input" value={form.secondaryCta} onChange={ch("secondaryCta")} placeholder="Talk to an Expert" /></div>
        </div>
        <div className="ad-form-actions">
          <button onClick={() => void save(form)} disabled={saving} className="ad-btn">{saving ? "Saving…" : "Save Changes"}</button>
        </div>
      </div>
    </div>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────

type FooterLink = { name: string; url: string };
type FooterContent = { phone: string; email: string; socials: Record<string, FooterLink>; footer_text: { credits: string; privacy_policy: FooterLink; terms_conditions: FooterLink } };

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
      const item = res.data.find((i: { key: string }) => i.key === "footer");
      if (item) populate(item.data as Partial<FooterContent>);
    } finally { setLoading(false); }
  };

  useEffect(() => { void load(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const buildPayload = (): FooterContent => ({
    phone, email,
    socials: Object.fromEntries(socials.filter((s) => s.key.trim()).map((s) => [s.key.trim(), { name: s.name, url: s.url }])),
    footer_text: { credits, privacy_policy: { name: privacyName, url: privacyUrl }, terms_conditions: { name: termsName, url: termsUrl } },
  });

  const handleSave = async () => {
    setSaving(true); setMsg("");
    try { await adminUpsertContent(apiKey, "footer", buildPayload()); setMsg("✓ Footer saved successfully"); }
    catch (e) { setMsg(`Error: ${(e as Error).message}`); }
    finally { setSaving(false); }
  };

  const [resetPending, setResetPending] = useState(false);

  const handleReset = async () => {
    setResetPending(false);
    try { await adminResetContent(apiKey, "footer"); setMsg("✓ Footer reset to default"); await load(); }
    catch (e) { setMsg(`Error: ${(e as Error).message}`); }
  };

  if (loading) return <div style={{ color: "var(--ad-text2)", padding: 24 }}>Loading footer…</div>;

  return (
    <div className="ad-footer-wrap">
      <ConfirmDeleteModal
        open={resetPending}
        title='Reset "Footer" to default?'
        description="All current footer content will be replaced with the default values. This cannot be undone."
        onConfirm={() => void handleReset()}
        onCancel={() => setResetPending(false)}
      />
      <div className="ad-section-header" style={{ marginBottom: 16 }}>
        <div className="ad-section-title">Footer</div>
        <button onClick={() => setResetPending(true)} className="ad-btn ad-btn--danger ad-btn--sm">Reset to Default</button>
      </div>
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
      </div>
    </div>
  );
}

// ─── Sidebar icon helper ──────────────────────────────────────────────────────

function NavIcon({ children }: { children: React.ReactNode }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {children}
    </svg>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function ASAdmin() {
  const [apiKey, setApiKey] = useState<string>(() => sessionStorage.getItem("azari_admin_key") ?? "");
  const [authError, setAuthError] = useState("");
  const [tab, setTab] = useState<Tab>("overview");
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLight, setIsLight] = useState<boolean>(() => localStorage.getItem("azari-admin-theme") === "light");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Sync is-light class to body so portal-mounted modals (outside .as-admin) inherit CSS variables
  useEffect(() => {
    document.body.classList.toggle("is-light", isLight);
    return () => { document.body.classList.remove("is-light"); };
  }, [isLight]);

  const handleLogin = async (key: string) => {
    try {
      const res = await adminGetStats(key) as { success: boolean; data: Stats };
      sessionStorage.setItem("azari_admin_key", key);
      setApiKey(key); setStats(res.data); setAuthError("");
    } catch { setAuthError("Invalid API key. Please try again."); }
  };

  useEffect(() => {
    if (apiKey) {
      adminGetStats(apiKey)
        .then((res) => setStats((res as { data: Stats }).data))
        .catch(() => { sessionStorage.removeItem("azari_admin_key"); setApiKey(""); });
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleLogout = () => { sessionStorage.removeItem("azari_admin_key"); setApiKey(""); setStats(null); };

  const toggleTheme = () => {
    const next = !isLight;
    setIsLight(next);
    localStorage.setItem("azari-admin-theme", next ? "light" : "dark");
  };

  const navigate = (id: Tab) => { setTab(id); setSidebarOpen(false); };

  type NavItem = { id: Tab; label: string; icon: React.ReactNode };
  type NavGroup = { label: string; items: NavItem[] };

  const NAV_GROUPS: NavGroup[] = [
    {
      label: "Dashboard",
      items: [
        { id: "overview", label: "Overview", icon: <NavIcon><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></NavIcon> },
      ],
    },
    {
      label: "Operations",
      items: [
        { id: "inquiries",         label: "Talk Inquiries",    icon: <NavIcon><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></NavIcon> },
        { id: "quotations",        label: "Quotations",        icon: <NavIcon><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></NavIcon> },
        { id: "package-inquiries", label: "Package Inquiries", icon: <NavIcon><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22 6 12 13 2 6"/></NavIcon> },
      ],
    },
    {
      label: "Products",
      items: [
        { id: "inventory", label: "Inventory", icon: <NavIcon><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></NavIcon> },
        { id: "packages",  label: "Packages",  icon: <NavIcon><line x1="16.5" y1="9.4" x2="7.5" y2="4.21"/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></NavIcon> },
        { id: "projects",  label: "Projects",  icon: <NavIcon><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></NavIcon> },
      ],
    },
    {
      label: "Content",
      items: [
        { id: "sections",   label: "Visibility",    icon: <NavIcon><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></NavIcon> },
        { id: "hero",       label: "Hero",          icon: <NavIcon><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></NavIcon> },
        { id: "metrics",    label: "Metrics",       icon: <NavIcon><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></NavIcon> },
        { id: "benefits",   label: "Benefits",      icon: <NavIcon><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></NavIcon> },
        { id: "tropics",    label: "Tropics",       icon: <NavIcon><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/></NavIcon> },
        { id: "journey",    label: "Journey",       icon: <NavIcon><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></NavIcon> },
        { id: "excellence", label: "Excellence",    icon: <NavIcon><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></NavIcon> },
        { id: "process",    label: "Process",       icon: <NavIcon><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></NavIcon> },
        { id: "cta",        label: "Call to Action", icon: <NavIcon><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></NavIcon> },
        { id: "footer",     label: "Footer",         icon: <NavIcon><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/></NavIcon> },
      ],
    },
  ];

  const currentLabel = NAV_GROUPS.flatMap(g => g.items).find(i => i.id === tab)?.label ?? "";

  if (!apiKey) {
    return (
      <div className={`as-admin${isLight ? " is-light" : ""}`}>
        <LoginScreen onLogin={handleLogin} error={authError} />
      </div>
    );
  }

  return (
    <div className={`as-admin${isLight ? " is-light" : ""}`}>
      <ASRateLimitBanner />

      <nav className="ad-topnav">
        <button className="ad-hamburger" onClick={() => setSidebarOpen(s => !s)} aria-label="Toggle navigation">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
          </svg>
        </button>
        <div className="ad-topnav-logo">azari<span>.solar</span></div>
        <span className="ad-topnav-badge">Admin</span>
        <span className="ad-topnav-section">{currentLabel}</span>
        <div className="ad-topnav-spacer" />
        <div className="ad-topnav-actions">
          <button className={`ad-theme-toggle${isLight ? " is-light" : ""}`} onClick={toggleTheme} aria-label="Toggle theme" title={isLight ? "Switch to dark mode" : "Switch to light mode"} />
          <button onClick={handleLogout} className="ad-btn ad-btn--ghost ad-btn--sm">Sign Out</button>
        </div>
      </nav>

      <div className="ad-body">
        {sidebarOpen && <div className="ad-sidebar-backdrop" onClick={() => setSidebarOpen(false)} />}

        <nav className={`ad-sidebar${sidebarOpen ? " is-open" : ""}`} aria-label="Admin navigation">
          <div className="ad-sidebar-inner">
            {NAV_GROUPS.map((group, gi) => (
              <div key={group.label} className="ad-sidebar-group">
                {gi > 0 && <div className="ad-sidebar-divider" />}
                <div className="ad-sidebar-group-label">{group.label}</div>
                {group.items.map((item) => (
                  <button
                    key={item.id}
                    className={`ad-sidebar-item${tab === item.id ? " is-active" : ""}`}
                    onClick={() => navigate(item.id)}
                  >
                    {item.icon}
                    {item.label}
                  </button>
                ))}
              </div>
            ))}
          </div>
        </nav>

        <main className="ad-main">
          {tab === "overview"          && <OverviewTab stats={stats} />}
          {tab === "inquiries"         && <SubmissionsTable apiKey={apiKey} type="talk" />}
          {tab === "quotations"        && <SubmissionsTable apiKey={apiKey} type="quotations" />}
          {tab === "projects"          && <ProjectsManager apiKey={apiKey} />}
          {tab === "inventory"         && <ComponentsManager apiKey={apiKey} onGoToPackages={() => navigate("packages")} />}
          {tab === "packages"          && <PackagesManager apiKey={apiKey} />}
          {tab === "package-inquiries" && <PackageInquiriesManager apiKey={apiKey} />}
          {tab === "sections"          && <SectionsManager apiKey={apiKey} />}
          {tab === "hero"              && <HeroEditor apiKey={apiKey} />}
          {tab === "metrics"           && <MetricsEditor apiKey={apiKey} />}
          {tab === "benefits"          && <BenefitsEditor apiKey={apiKey} />}
          {tab === "tropics"           && <TropicsEditor apiKey={apiKey} />}
          {tab === "journey"           && <ClientJourneyEditor apiKey={apiKey} />}
          {tab === "excellence"        && <ExcellenceEditor apiKey={apiKey} />}
          {tab === "process"           && <ProcessEditor apiKey={apiKey} />}
          {tab === "cta"               && <CtaEditor apiKey={apiKey} />}
          {tab === "footer"            && <FooterEditor apiKey={apiKey} />}
        </main>
      </div>
    </div>
  );
}
