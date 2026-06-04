import { useEffect, useState } from "react";
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
  adminGetComponents,
  adminCreateComponent,
  adminUpdateComponent,
  adminDeleteComponent,
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
    } catch (e) { alert(`Failed: ${(e as Error).message}`); }
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
            <button onClick={() => void handleEditSave()} disabled={editSaving} className="ad-btn">{editSaving ? "Saving…" : "Save Changes"}</button>
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
                      <button onClick={() => openEdit(row)} disabled={!!editingRow || deleting === (row.id as string)} className="ad-btn ad-btn--ghost ad-btn--sm">Edit</button>
                      <button onClick={() => void handleDelete(row.id as string)} disabled={deleting === (row.id as string) || !!editingRow} className="ad-btn ad-btn--danger ad-btn--sm" style={{ opacity: deleting === (row.id as string) ? 0.5 : 1 }}>
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

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    setDeleting(id);
    try { await adminDeleteProject(apiKey, id); setMsg("✓ Project deleted"); await load(); }
    catch (e) { setMsg(`Error: ${(e as Error).message}`); }
    finally { setDeleting(null); }
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
  dataSheetUrl: "",
};

function ComponentsManager({ apiKey }: { apiKey: string }) {
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
    setForm({ name: c.name, brand: c.brand, model: c.model, category: c.category,
      unitPrice: c.unitPrice ?? undefined,
      pricingEnabled: c.pricingEnabled, isActive: c.isActive,
      productionCapacityKwp: c.productionCapacityKwp,
      loadCapacityKw: c.loadCapacityKw,
      storageCapacityKwh: c.storageCapacityKwh,
      capacityUnit: unit,
      parallelMin: c.parallelMin ?? 1,
      parallelMax: c.parallelMax ?? 4,
      perInverterMin: c.perInverterMin ?? 1,
      perInverterMax: c.perInverterMax ?? 4,
      dataSheetUrl: c.dataSheetUrl ?? "",
    });
    setMsg(""); setShowForm(true);
  };
  const closeForm = () => { setShowForm(false); setCatSearches({}); setMsg(""); };

  const handleSave = async () => {
    if (!form.name.trim() || !form.brand.trim() || !form.model.trim()) {
      setMsg("Please enter component name, brand, and model"); return;
    }
    // Validate required specs based on category
    if (form.category === 'Solar Panel' && (!form.productionCapacityKwp || form.productionCapacityKwp <= 0)) {
      setMsg("Please enter Production Capacity (must be greater than 0 kWp)"); return;
    }
    if (form.category === 'Inverter' && (!form.loadCapacityKw || form.loadCapacityKw <= 0)) {
      setMsg("Please enter Load Capacity (must be greater than 0 kW)"); return;
    }
    if (form.category === 'Battery' && (!form.storageCapacityKwh || form.storageCapacityKwh <= 0)) {
      setMsg("Please enter Storage Capacity (must be greater than 0 kWh)"); return;
    }
    if (form.pricingEnabled && !form.unitPrice) {
      setMsg("Please enter a unit price when pricing is enabled"); return;
    }
    setSaving(true); setMsg("");
    try {
      const spec = CATEGORY_SPEC[form.category];
      const payload = {
        ...form,
        unitPrice: form.pricingEnabled ? form.unitPrice : undefined,
        // Persist the display unit only for spec-bearing categories; null otherwise.
        capacityUnit: spec ? (form.capacityUnit ?? spec.default) : null,
      };
      if (editingId) {
        await adminUpdateComponent(apiKey, editingId, payload);
        setMsg("✓ Component updated successfully");
      } else {
        await adminCreateComponent(apiKey, payload);
        setMsg("✓ Component added to inventory");
      }
      await load();
      setTimeout(closeForm, 1500);
    } catch (e) {
      const errorMsg = (e as Error).message;
      if (errorMsg.includes("409") || errorMsg.includes("conflict")) {
        setMsg("This component already exists in your inventory");
      } else {
        setMsg("Failed to save component. Please try again");
      }
    }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? Packages using it may be affected.`)) return;
    setDeleting(id);
    try {
      await adminDeleteComponent(apiKey, id);
      setMsg("✓ Component deleted");
      await load();
    }
    catch (e) { setMsg("Failed to delete component. Please try again"); }
    finally { setDeleting(null); }
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
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                          <div><label className="ad-label">Min</label>
                            <input type="number" className="ad-input" min={1} max={1000} value={form.parallelMin ?? 1}
                              onChange={e => setF("parallelMin", Number(e.target.value))} /></div>
                          <div><label className="ad-label">Max</label>
                            <input type="number" className="ad-input" min={1} max={1000} value={form.parallelMax ?? 4}
                              onChange={e => setF("parallelMax", Number(e.target.value))} /></div>
                        </div>
                      ) : (
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                          <div><label className="ad-label">Min per inverter</label>
                            <input type="number" className="ad-input" min={1} max={1000} value={form.perInverterMin ?? 1}
                              onChange={e => setF("perInverterMin", Number(e.target.value))} /></div>
                          <div><label className="ad-label">Max per inverter</label>
                            <input type="number" className="ad-input" min={1} max={1000} value={form.perInverterMax ?? 4}
                              onChange={e => setF("perInverterMax", Number(e.target.value))} /></div>
                        </div>
                      )}
                      <small style={{ fontSize: 11, color: "var(--ad-text3)", marginTop: 6, display: "block" }}>
                        {form.category === "Inverter"
                          ? "How many of this inverter the customer can add to the package."
                          : "How many of this item the customer can add per inverter."}
                      </small>
                    </div>
                  )}

                  {/* Data sheet URL */}
                  <div style={{ gridColumn: "1 / -1" }}>
                    <label className="ad-label">Product Data Sheet <span style={{ fontWeight: 400, color: "var(--ad-text3)" }}>(optional — paste a link to the PDF)</span></label>
                    <input className="ad-input" value={form.dataSheetUrl ?? ""} placeholder="https://…/datasheet.pdf"
                      onChange={e => setF("dataSheetUrl", e.target.value || null)} />
                  </div>
                </div>
                <div style={{
                  display: "flex", gap: "clamp(8px, 2vw, 12px)", marginTop: "clamp(16px, 3vw, 20px)",
                  flexWrap: "wrap-reverse", justifyContent: "flex-end"
                }}>
                  <button onClick={closeForm} className="ad-btn ad-btn--ghost" style={{ flex: "1 1 auto", minWidth: "100px" }}>Cancel</button>
                  <button onClick={() => void handleSave()} disabled={saving} className="ad-btn" style={{ flex: "1 1 auto", minWidth: "120px" }}>
                    {saving ? "Saving…" : editingId ? "Update" : "Add"}
                  </button>
                </div>
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
                              {c.productionCapacityKwp && <div style={{ fontSize: 10, color: "var(--ad-text3)", marginTop: 2 }}>☀ {c.productionCapacityKwp.toFixed(2)} kWp</div>}
                              {c.loadCapacityKw && <div style={{ fontSize: 10, color: "var(--ad-text3)", marginTop: 2 }}>⚙️ {c.loadCapacityKw.toFixed(1)} kW</div>}
                              {c.storageCapacityKwh && <div style={{ fontSize: 10, color: "var(--ad-text3)", marginTop: 2 }}>🔋 {c.storageCapacityKwh.toFixed(2)} kWh</div>}
                            </td>
                            <td style={{ fontSize: 12 }}>{c.brand}<br /><span style={{ opacity: 0.6, fontSize: 10 }}>{c.model}</span></td>
                            <td style={{ fontSize: 12 }}>{c.unit}</td>
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
      await load();
    } catch (e) {
      setMsg(`Failed to update: ${e instanceof Error ? e.message : "Unknown error"}`);
    } finally {
      setUpdating(null);
    }
  };

  const deleteInquiry = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this inquiry? This action cannot be undone.")) return;
    setDeleting(id);
    try {
      await adminDeletePackageInquiry(apiKey, id);
      setMsg("✓ Inquiry deleted");
      setSelectedInquiry(null);
      await load();
    } catch (e) {
      setMsg(`Failed to delete: ${e instanceof Error ? e.message : "Unknown error"}`);
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div>
      <div className="ad-section-header">
        <div>
          <div className="ad-section-title">Package Inquiries</div>
          <div className="ad-section-sub">
            {loading ? "Loading…" : (
              <>
                <span>{inquiries.length} total inquiries</span>
                {inquiries.length > 0 && (
                  <>
                    <span style={{ margin: "0 12px", color: "var(--ad-border)" }}>•</span>
                    <span>
                      {inquiries.filter(i => i.status === 'new').length} New
                    </span>
                    <span style={{ margin: "0 8px", color: "var(--ad-border)" }}>•</span>
                    <span>
                      {inquiries.filter(i => i.status === 'contacted').length} Contacted
                    </span>
                    <span style={{ margin: "0 8px", color: "var(--ad-border)" }}>•</span>
                    <span>
                      {inquiries.filter(i => i.status === 'converted').length} Converted
                    </span>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {msg && <Toast msg={msg} />}

      {loading ? (
        <div style={{ padding: 20, color: "var(--ad-text3)" }}>Loading inquiries...</div>
      ) : inquiries.length === 0 ? (
        <div style={{ padding: 20, color: "var(--ad-text3)" }}>No inquiries yet</div>
      ) : (
        <table className="ad-table" style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--ad-border)" }}>
              <th style={{ padding: 12, textAlign: "left", fontWeight: 600, fontSize: 12, color: "var(--ad-text3)" }}>Reference</th>
              <th style={{ padding: 12, textAlign: "left", fontWeight: 600, fontSize: 12, color: "var(--ad-text3)" }}>Name</th>
              <th style={{ padding: 12, textAlign: "left", fontWeight: 600, fontSize: 12, color: "var(--ad-text3)" }}>Email</th>
              <th style={{ padding: 12, textAlign: "left", fontWeight: 600, fontSize: 12, color: "var(--ad-text3)" }}>Package</th>
              <th style={{ padding: 12, textAlign: "left", fontWeight: 600, fontSize: 12, color: "var(--ad-text3)" }}>Capacity</th>
              <th style={{ padding: 12, textAlign: "left", fontWeight: 600, fontSize: 12, color: "var(--ad-text3)" }}>Status</th>
              <th style={{ padding: 12, textAlign: "left", fontWeight: 600, fontSize: 12, color: "var(--ad-text3)" }}>Date</th>
            </tr>
          </thead>
          <tbody>
            {inquiries.map((inq) => {
              const ref = `PKG-INQ-${inq.id.slice(0, 8).toUpperCase()}`;
              return (
                <tr key={inq.id} style={{ borderBottom: "1px solid var(--ad-border)" }}>
                  <td style={{ padding: 12, fontSize: 13, fontWeight: 600, color: "var(--ad-primary, #fc615a)" }}>
                    {ref}
                  </td>
                  <td style={{ padding: 12, fontSize: 13 }}>
                    <button
                      onClick={() => setSelectedInquiry(inq)}
                      style={{
                        background: "none",
                        border: "none",
                        color: "var(--ad-primary, #fc615a)",
                        cursor: "pointer",
                        fontWeight: 500,
                        textDecoration: "underline",
                      }}
                    >
                      {inq.name}
                    </button>
                  </td>
                  <td style={{ padding: 12, fontSize: 13, color: "var(--ad-text2)" }}>{inq.email}</td>
                  <td style={{ padding: 12, fontSize: 13 }}>{inq.packageName}</td>
                  <td style={{ padding: 12, fontSize: 13 }}>{formatCapacity(inq.packageDetails.inverterKw, "power", { unit: "kW" })}</td>
                  <td style={{ padding: 12 }}>
                    <select
                      value={inq.status}
                      onChange={(e) => void updateStatus(inq.id, e.target.value as PackageInquiry['status'])}
                      disabled={updating === inq.id}
                      style={{
                        padding: "6px 8px",
                        borderRadius: 4,
                        border: "1px solid var(--ad-border)",
                        background: "var(--ad-input-bg)",
                        color: "var(--ad-text)",
                        fontSize: 12,
                        cursor: updating === inq.id ? "not-allowed" : "pointer",
                      }}
                    >
                      <option value="new">New</option>
                      <option value="contacted">Contacted</option>
                      <option value="converted">Converted</option>
                    </select>
                  </td>
                  <td style={{ padding: 12, fontSize: 12, color: "var(--ad-text3)" }}>
                    {new Date(inq.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      {selectedInquiry && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0, 0, 0, 0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            padding: "16px",
            overflowY: "auto",
          }}
          onClick={() => setSelectedInquiry(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "var(--ad-bg)",
              borderRadius: "12px",
              padding: "32px",
              maxWidth: "700px",
              width: "100%",
              maxHeight: "90vh",
              overflowY: "auto",
              boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
              border: "1px solid var(--ad-border)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "28px",
              }}
            >
              <div>
                <h3 style={{ margin: 0, fontSize: "22px", fontWeight: 700 }}>Inquiry Details</h3>
                <div style={{ fontSize: "12px", color: "var(--ad-text3)", marginTop: "4px", fontWeight: 600 }}>
                  PKG-INQ-{selectedInquiry.id.slice(0, 8).toUpperCase()}
                </div>
              </div>
              <button
                onClick={() => setSelectedInquiry(null)}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "28px",
                  color: "var(--ad-text3)",
                  cursor: "pointer",
                  padding: "0",
                  width: "32px",
                  height: "32px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                ×
              </button>
            </div>

            {/* Contact Information Section */}
            <div style={{ marginBottom: "28px" }}>
              <div style={{ fontSize: "12px", fontWeight: 700, color: "var(--ad-text3)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "14px" }}>Contact Information</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "16px" }}>
                <div style={{ background: "var(--ad-input-bg)", borderRadius: "8px", padding: "14px" }}>
                  <div style={{ fontSize: "11px", fontWeight: 700, color: "var(--ad-text3)", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: "6px" }}>Full Name</div>
                  <div style={{ fontSize: "14px", fontWeight: 500 }}>{selectedInquiry.name}</div>
                </div>
                <div style={{ background: "var(--ad-input-bg)", borderRadius: "8px", padding: "14px" }}>
                  <div style={{ fontSize: "11px", fontWeight: 700, color: "var(--ad-text3)", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: "6px" }}>Email Address</div>
                  <div style={{ fontSize: "14px", fontWeight: 500, wordBreak: "break-all" }}>{selectedInquiry.email}</div>
                </div>
                <div style={{ background: "var(--ad-input-bg)", borderRadius: "8px", padding: "14px" }}>
                  <div style={{ fontSize: "11px", fontWeight: 700, color: "var(--ad-text3)", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: "6px" }}>Phone Number</div>
                  <div style={{ fontSize: "14px", fontWeight: 500 }}>{selectedInquiry.phone}</div>
                </div>
                <div style={{ background: "var(--ad-input-bg)", borderRadius: "8px", padding: "14px" }}>
                  <div style={{ fontSize: "11px", fontWeight: 700, color: "var(--ad-text3)", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: "6px" }}>Location</div>
                  <div style={{ fontSize: "14px", fontWeight: 500 }}>{selectedInquiry.location}</div>
                </div>
              </div>
            </div>

            {/* Package Details Section */}
            <div style={{ marginBottom: "28px", borderTop: "1px solid var(--ad-border)", paddingTop: "28px" }}>
              <div style={{ fontSize: "12px", fontWeight: 700, color: "var(--ad-text3)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "14px" }}>System Specifications</div>
              <div style={{ background: "var(--ad-input-bg)", borderRadius: "8px", padding: "16px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "16px" }}>
                  <div>
                    <div style={{ fontSize: "11px", fontWeight: 700, color: "var(--ad-text3)", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: "8px" }}>Package Name</div>
                    <div style={{ fontSize: "14px", fontWeight: 600 }}>{selectedInquiry.packageName}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: "11px", fontWeight: 700, color: "var(--ad-text3)", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: "8px" }}>Production</div>
                    <div style={{ fontSize: "14px", fontWeight: 600 }}>{formatCapacity(selectedInquiry.packageDetails.solarKwp, "power", { unit: "kWp" })}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: "11px", fontWeight: 700, color: "var(--ad-text3)", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: "8px" }}>Load Capacity</div>
                    <div style={{ fontSize: "14px", fontWeight: 600 }}>{formatCapacity(selectedInquiry.packageDetails.inverterKw, "power", { unit: "kW" })}</div>
                  </div>
                  {selectedInquiry.packageDetails.storageKwh > 0 && (
                    <div>
                      <div style={{ fontSize: "11px", fontWeight: 700, color: "var(--ad-text3)", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: "8px" }}>Storage</div>
                      <div style={{ fontSize: "14px", fontWeight: 600 }}>{formatCapacity(selectedInquiry.packageDetails.storageKwh, "energy", { unit: "kWh" })}</div>
                    </div>
                  )}
                  <div>
                    <div style={{ fontSize: "11px", fontWeight: 700, color: "var(--ad-text3)", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: "8px" }}>Phase Type</div>
                    <div style={{ fontSize: "14px", fontWeight: 600 }}>{selectedInquiry.packageDetails.phase === "single" ? "Single Phase" : "Three Phase"}</div>
                  </div>
                  {(selectedInquiry.packageDetails.billRangeMin != null && selectedInquiry.packageDetails.billRangeMax != null) && (
                    <div>
                      <div style={{ fontSize: "11px", fontWeight: 700, color: "var(--ad-text3)", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: "8px" }}>Monthly Savings</div>
                      <div style={{ fontSize: "14px", fontWeight: 600 }}>₱{(selectedInquiry.packageDetails.billRangeMin).toLocaleString("en-PH")} – ₱{(selectedInquiry.packageDetails.billRangeMax).toLocaleString("en-PH")}</div>
                    </div>
                  )}
                  <div>
                    <div style={{ fontSize: "11px", fontWeight: 700, color: "var(--ad-text3)", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: "8px" }}>Total Price</div>
                    {selectedInquiry.packageDetails.totalPrice != null
                      ? <div style={{ fontSize: "14px", fontWeight: 600, color: "var(--ad-primary, #fc615a)" }}>₱{(selectedInquiry.packageDetails.totalPrice).toLocaleString("en-PH")}</div>
                      : <div style={{ fontSize: "14px", fontWeight: 500, color: "var(--ad-text3)" }}>Price TBD</div>}
                  </div>
                </div>
              </div>
            </div>

            {/* Selected Components Section */}
            <div style={{ marginBottom: "28px", borderTop: "1px solid var(--ad-border)", paddingTop: "28px" }}>
              <div style={{ fontSize: "12px", fontWeight: 700, color: "var(--ad-text3)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "14px" }}>Selected Components</div>
              {(() => {
                const comps = selectedInquiry.packageDetails.components;
                if (!comps || comps.length === 0) {
                  return <div style={{ fontSize: "13px", color: "var(--ad-text3)", fontStyle: "italic", padding: "12px 0" }}>Component breakdown not captured for this inquiry.</div>;
                }
                const EMOJI: Record<string, string> = { "Solar Panel": "☀️", "Inverter": "⚡", "Battery": "🔋" };
                const order = ["Solar Panel", "Inverter", "Battery"];
                const byCategory = comps.reduce<Record<string, typeof comps>>((acc, c) => {
                  (acc[c.category] ??= []).push(c);
                  return acc;
                }, {});
                const categories = [
                  ...order.filter(cat => byCategory[cat]),
                  ...Object.keys(byCategory).filter(cat => !order.includes(cat)),
                ];
                return (
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    {categories.map(cat => (
                      <div key={cat} style={{ background: "var(--ad-input-bg)", borderRadius: "8px", padding: "14px" }}>
                        <div style={{ fontSize: "11px", fontWeight: 700, color: "var(--ad-text3)", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: "10px" }}>
                          {EMOJI[cat] ?? "📦"} {cat}
                        </div>
                        {byCategory[cat].map((c, i) => (
                          <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "13px", padding: "4px 0", borderBottom: i < byCategory[cat].length - 1 ? "1px solid var(--ad-border)" : "none" }}>
                            <span style={{ fontWeight: 500 }}><span style={{ fontWeight: 700, marginRight: 6 }}>{c.quantity}×</span>{c.brand} {c.name}</span>
                            {c.unitPrice != null && <span style={{ color: "var(--ad-text3)", fontSize: 12 }}>₱{c.unitPrice.toLocaleString("en-PH")} ea.</span>}
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>

            {/* Status & Timeline Section */}
            <div style={{ marginBottom: "28px", borderTop: "1px solid var(--ad-border)", paddingTop: "28px" }}>
              <div style={{ fontSize: "12px", fontWeight: 700, color: "var(--ad-text3)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "14px" }}>Status & Timeline</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
                <div>
                  <div style={{ fontSize: "11px", fontWeight: 700, color: "var(--ad-text3)", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: "8px" }}>Current Status</div>
                  <select
                    value={selectedInquiry.status}
                    onChange={(e) => void updateStatus(selectedInquiry.id, e.target.value as PackageInquiry['status'])}
                    disabled={updating === selectedInquiry.id}
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      borderRadius: "6px",
                      border: "1px solid var(--ad-border)",
                      background: "var(--ad-bg)",
                      color: "var(--ad-text)",
                      fontSize: "13px",
                      fontWeight: 600,
                      cursor: updating === selectedInquiry.id ? "not-allowed" : "pointer",
                      opacity: updating === selectedInquiry.id ? 0.6 : 1,
                    }}
                  >
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="converted">Converted</option>
                  </select>
                </div>
                <div>
                  <div style={{ fontSize: "11px", fontWeight: 700, color: "var(--ad-text3)", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: "8px" }}>Submitted On</div>
                  <div style={{ fontSize: "13px", padding: "8px 0" }}>
                    {new Date(selectedInquiry.createdAt).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: "11px", fontWeight: 700, color: "var(--ad-text3)", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: "8px" }}>Time</div>
                  <div style={{ fontSize: "13px", padding: "8px 0" }}>
                    {new Date(selectedInquiry.createdAt).toLocaleTimeString('en-PH', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div style={{ borderTop: "1px solid var(--ad-border)", paddingTop: "20px", display: "flex", gap: "12px", justifyContent: "space-between" }}>
              <button
                onClick={() => void deleteInquiry(selectedInquiry.id)}
                disabled={deleting === selectedInquiry.id}
                style={{
                  padding: "10px 16px",
                  borderRadius: "6px",
                  border: "1px solid #ef4444",
                  background: "rgba(239, 68, 68, 0.1)",
                  color: "#ef4444",
                  fontSize: "13px",
                  fontWeight: 600,
                  cursor: deleting === selectedInquiry.id ? "not-allowed" : "pointer",
                  transition: "all 0.2s",
                  opacity: deleting === selectedInquiry.id ? 0.6 : 1,
                }}
                onMouseEnter={(e) => {
                  if (deleting !== selectedInquiry.id) {
                    e.currentTarget.style.background = "rgba(239, 68, 68, 0.2)";
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(239, 68, 68, 0.1)";
                }}
                title="Delete this inquiry permanently"
              >
                {deleting === selectedInquiry.id ? "Deleting..." : "Delete"}
              </button>
              <button
                onClick={() => setSelectedInquiry(null)}
                style={{
                  padding: "10px 20px",
                  borderRadius: "6px",
                  border: "1px solid var(--ad-border)",
                  background: "var(--ad-input-bg)",
                  color: "var(--ad-text)",
                  fontSize: "13px",
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "var(--ad-border)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "var(--ad-input-bg)";
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
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
  const [catSearches, setCatSearches] = useState<Record<string, string>>({}); // Search per category

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
    setEditingId(null); setForm(EMPTY_PKG_FORM);
    setNameEdited(false); setCatSearches({}); setMsg(""); setShowForm(true);
    // Ensure components are loaded
    if (allComponents.length === 0) {
      adminGetComponents(apiKey).then(res => setAllComponents(res.data)).catch(() => {});
    }
  };
  const openEdit = (p: ApiSolarPackage) => {
    setEditingId(p.id);
    setForm({
      name: p.name, solarKwp: p.solarKwp, inverterKw: p.inverterKw,
      storageKwh: p.storageKwh, phase: p.phase,
      billRangeMin: p.billRangeMin, billRangeMax: p.billRangeMax,
      isActive: p.isActive, isRecommended: p.isRecommended ?? false,
      mainFeatures: p.mainFeatures ?? [],
      imageUrl: p.imageUrl ?? null,
      components: (p.components ?? []).map(pc => ({ componentId: pc.componentId, quantity: pc.quantity })),
    });
    setNameEdited(true); setCatSearches({}); setMsg(""); setShowForm(true);
    // Ensure components are loaded
    if (allComponents.length === 0) {
      adminGetComponents(apiKey).then(res => setAllComponents(res.data)).catch(() => {});
    }
  };
  const closeForm = () => { setShowForm(false); setEditingId(null); setNameEdited(false); setCatSearches({}); setMsg(""); };
  const setField = <K extends keyof PkgForm>(key: K, value: PkgForm[K]) => setForm((f) => ({ ...f, [key]: value }));

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
    if (!hasBattery) return "Package must include at least one Battery";

    // Compute actual specs from selected components
    const specs = computePackageSpecs(components, allComponents);
    if (specs.solarKwp <= 0) return "Total Production Capacity must be greater than 0 kWp (add Solar Panels)";
    if (specs.inverterKw <= 0) return "Total Load Capacity must be greater than 0 kW (add Inverters)";
    if (specs.storageKwh < 0) return "Total Storage Capacity cannot be negative";

    if (form.billRangeMax < form.billRangeMin) return "Maximum monthly bill must be greater than or equal to minimum";
    return "";
  };

  const handleSave = async () => {
    const err = validateForm();
    if (err) { setMsg(err); return; }
    setSaving(true); setMsg("");
    try {
      if (editingId) {
        await adminUpdatePackage(apiKey, editingId, form);
        setMsg("✓ Package updated successfully");
      } else {
        await adminCreatePackage(apiKey, form);
        setMsg("✓ Package created successfully");
      }
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

  const handleDelete = async (p: ApiSolarPackage) => {
    if (!confirm(`Delete "${p.name}"? This cannot be undone.`)) return;
    setDeleting(p.id);
    try {
      await adminDeletePackage(apiKey, p.id);
      setMsg("✓ Package deleted");
      await load();
    }
    catch (e) { setMsg("Failed to delete package. Please try again"); }
    finally { setDeleting(null); }
  };


  const peso = (v: number) => `₱${v.toLocaleString("en-PH")}`;
  const activeCount = packages.filter((p) => p.isActive).length;

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
              maxWidth: 800, width: "100%", maxHeight: "90vh", overflow: "auto", zIndex: 1000,
              display: "flex", flexDirection: "column"
            }} onClick={(e) => e.stopPropagation()}>
              {/* Modal Header */}
              <div style={{
                padding: 20, borderBottom: "1px solid var(--ad-border)",
                display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12,
                flexShrink: 0, position: "sticky", top: 0, zIndex: 50, background: "var(--ad-bg)"
              }}>
                <div style={{ fontSize: 16, fontWeight: 700, color: "var(--ad-text)" }}>
                  {editingId ? "Edit Package" : "Create New Package"}
                </div>
                <button
                  onClick={closeForm}
                  style={{
                    background: "none", border: "none", fontSize: 24, color: "var(--ad-text3)",
                    cursor: "pointer", padding: 0, width: 32, height: 32,
                    display: "flex", alignItems: "center", justifyContent: "center"
                  }}
                >
                  ✕
                </button>
              </div>

              {/* Modal Body */}
              <div style={{ padding: 20, overflow: "auto", flex: 1 }}>
                <div className="ad-pkg-form-phase">
            <div className="ad-label">System Phase</div>
            <div className="ad-pkg-phase-toggle">
              <button type="button" className={`ad-pkg-phase-btn${form.phase === "single" ? " is-active" : ""}`} onClick={() => setField("phase", "single")}>Single Phase<span>Residential</span></button>
              <button type="button" className={`ad-pkg-phase-btn${form.phase === "three" ? " is-active" : ""}`} onClick={() => setField("phase", "three")}>Three Phase<span>Commercial / Industrial</span></button>
            </div>
          </div>

          {/* Component Selection by Category */}
          <div style={{ marginTop: 16 }}>
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: "var(--ad-text3)", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.06em" }}>Build from Inventory</div>
              <div style={{ fontSize: 11, color: "var(--ad-text2)", marginBottom: 12 }}>Search and select components to add to your package. System specs and total price will auto-calculate.</div>
            </div>

            {['Solar Panel', 'Inverter', 'Battery', 'Mounting & Racking', 'Wiring & Protection', 'Monitoring', 'Others'].map((category) => {
              const addedComponentIds = new Set((form.components ?? []).map(c => c.componentId));
              const catComps = allComponents.filter(c => c.isActive && c.category === category && !addedComponentIds.has(c.id)).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
              const search = catSearches[category] ?? '';
              const filtered = catComps.filter(c => c.name.toLowerCase().includes(search.toLowerCase()) || c.brand.toLowerCase().includes(search.toLowerCase()) || c.model.toLowerCase().includes(search.toLowerCase()));

              const categoryEmojis: Record<string, string> = {
                'Solar Panel': '☀',
                'Inverter': '⚡',
                'Battery': '🔋',
                'Mounting & Racking': '📦',
                'Wiring & Protection': '🔌',
                'Monitoring': '📊',
                'Others': '📦',
              };
              const emoji = categoryEmojis[category] ?? '📦';

              return (
                <div key={category} style={{ marginBottom: 12 }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: "var(--ad-text3)", marginBottom: 8 }}>{emoji} {category}</div>

                  {/* Unified Search + Dropdown Input */}
                  <div style={{ position: "relative" }}>
                    <input
                      type="search"
                      className="ad-input"
                      placeholder={`Search ${category}...`}
                      value={search}
                      onChange={(e) => setCatSearches(s => ({ ...s, [category]: e.target.value }))}
                      onFocus={() => setCatSearches(s => ({ ...s, [category]: s[category] ?? '' }))}
                      style={{ width: "100%", fontSize: 11 }}
                    />

                    {/* Dropdown Results */}
                    {search !== '' && (
                      <div style={{
                        position: "absolute",
                        top: "100%",
                        left: 0,
                        right: 0,
                        background: "var(--ad-input-bg)",
                        border: "1px solid var(--ad-border)",
                        borderTop: "none",
                        borderRadius: "0 0 6px 6px",
                        maxHeight: "250px",
                        overflowY: "auto",
                        zIndex: 10
                      }}>
                        {filtered.length === 0 ? (
                          <div style={{ padding: "10px", textAlign: "center", color: "var(--ad-text3)", fontSize: 10 }}>
                            No matches
                          </div>
                        ) : (
                          filtered.map(comp => {
                            const spec = comp.productionCapacityKwp ? ` (${comp.productionCapacityKwp.toFixed(2)} kWp)` :
                                         comp.loadCapacityKw ? ` (${comp.loadCapacityKw.toFixed(1)} kW)` :
                                         comp.storageCapacityKwh ? ` (${comp.storageCapacityKwh.toFixed(2)} kWh)` : '';
                            return (
                              <button
                                key={comp.id}
                                type="button"
                                onClick={() => {
                                  const existing = (form.components ?? []).find(l => l.componentId === comp.id);
                                  if (existing) {
                                    setField("components", (form.components ?? []).map(l => l.componentId === comp.id ? { ...l, quantity: l.quantity + 1 } : l));
                                  } else {
                                    setField("components", [...(form.components ?? []), { componentId: comp.id, quantity: 1 }]);
                                  }
                                  setCatSearches(s => ({ ...s, [category]: '' }));
                                }}
                                style={{
                                  width: "100%",
                                  padding: "8px 10px",
                                  textAlign: "left",
                                  background: "transparent",
                                  border: "none",
                                  borderBottom: "1px solid var(--ad-border)",
                                  color: "var(--ad-text)",
                                  cursor: "pointer",
                                  fontSize: 10,
                                  transition: "background 0.15s",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis"
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.background = "var(--ad-surface)"}
                                onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                              >
                                <div style={{ fontWeight: 500 }}>{comp.name}</div>
                                <div style={{ fontSize: 9, color: "var(--ad-text3)", marginTop: 1 }}>{comp.brand} {comp.model}{spec}</div>
                              </button>
                            );
                          })
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Selected Components Summary */}
            {(form.components ?? []).length > 0 && (
              <div style={{ background: "var(--ad-surface)", padding: 12, borderRadius: 6, marginBottom: 16, marginTop: 16, borderTop: "2px solid var(--ad-border)" }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: "var(--ad-text3)", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.06em" }}>📦 Selected Components ({(form.components ?? []).length})</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: 8 }}>
                  {(form.components ?? []).map((line, idx) => {
                    const comp = allComponents.find(c => c.id === line.componentId);
                    if (!comp) return null;
                    const specValue = comp.productionCapacityKwp ? `${(comp.productionCapacityKwp * line.quantity).toFixed(2)} kWp` :
                                      comp.loadCapacityKw ? `${(comp.loadCapacityKw * line.quantity).toFixed(1)} kW` :
                                      comp.storageCapacityKwh ? `${(comp.storageCapacityKwh * line.quantity).toFixed(2)} kWh` : '';
                    const spec = specValue;
                    return (
                      <div key={idx} style={{ background: "var(--ad-input-bg)", padding: 10, borderRadius: 4, display: "flex", flexDirection: "column", gap: 8 }}>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 11, fontWeight: 600, color: "var(--ad-text)" }}>{comp.name}</div>
                          <div style={{ fontSize: 9, color: "var(--ad-text3)", marginTop: 2 }}>{spec}</div>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 4, background: "var(--ad-bg)", borderRadius: 3, padding: "2px 6px" }}>
                            <button
                              onClick={() => {
                                if (line.quantity > 1) {
                                  setField("components", (form.components ?? []).map((c, i) => i === idx ? { ...c, quantity: c.quantity - 1 } : c));
                                }
                              }}
                              style={{
                                background: "none", border: "none", color: "var(--ad-text3)", cursor: "pointer",
                                fontSize: 14, padding: "0 4px", fontWeight: "bold", transition: "color 0.15s"
                              }}
                              onMouseEnter={(e) => e.currentTarget.style.color = "var(--ad-accent)"}
                              onMouseLeave={(e) => e.currentTarget.style.color = "var(--ad-text3)"}
                            >−</button>
                            <span style={{ fontSize: 11, fontWeight: 600, color: "var(--ad-text)", minWidth: 20, textAlign: "center" }}>{line.quantity}</span>
                            <button
                              onClick={() => {
                                setField("components", (form.components ?? []).map((c, i) => i === idx ? { ...c, quantity: c.quantity + 1 } : c));
                              }}
                              style={{
                                background: "none", border: "none", color: "var(--ad-text3)", cursor: "pointer",
                                fontSize: 14, padding: "0 4px", fontWeight: "bold", transition: "color 0.15s"
                              }}
                              onMouseEnter={(e) => e.currentTarget.style.color = "var(--ad-accent)"}
                              onMouseLeave={(e) => e.currentTarget.style.color = "var(--ad-text3)"}
                            >+</button>
                          </div>
                          <button
                            className="ad-btn ad-btn--danger ad-btn--sm"
                            style={{ whiteSpace: "nowrap", marginLeft: "auto" }}
                            onClick={() => setField("components", (form.components ?? []).filter((_, i) => i !== idx))}
                          >Remove</button>
                        </div>
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
              if (!nameEdited && form.name !== autoName_) {
                setField("name", autoName_);
              }
              return (
                <div className="ad-form-full" style={{ borderTop: "1px solid var(--ad-border)", paddingTop: 16, marginTop: 8 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "var(--ad-accent)", marginBottom: 12 }}>📊 Computed System Specs</div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 16 }}>
                    <div style={{ background: "var(--ad-surface)", padding: 12, borderRadius: 6, textAlign: "center" }}>
                      <div style={{ fontSize: 11, color: "var(--ad-text3)" }}>Production<br />Capacity</div>
                      <div style={{ fontSize: 18, fontWeight: 700, color: "var(--ad-accent)" }}>{specs.solarKwp.toFixed(2)}</div>
                      <div style={{ fontSize: 10, color: "var(--ad-text3)", marginTop: 2 }}>kWp</div>
                    </div>
                    <div style={{ background: "var(--ad-surface)", padding: 12, borderRadius: 6, textAlign: "center" }}>
                      <div style={{ fontSize: 11, color: "var(--ad-text3)" }}>Load<br />Capacity</div>
                      <div style={{ fontSize: 18, fontWeight: 700, color: "var(--ad-accent)" }}>{specs.inverterKw.toFixed(1)}</div>
                      <div style={{ fontSize: 10, color: "var(--ad-text3)", marginTop: 2 }}>kW</div>
                    </div>
                    <div style={{ background: "var(--ad-surface)", padding: 12, borderRadius: 6, textAlign: "center" }}>
                      <div style={{ fontSize: 11, color: "var(--ad-text3)" }}>Storage<br />Capacity</div>
                      <div style={{ fontSize: 18, fontWeight: 700, color: specs.storageKwh > 0 ? "var(--ad-accent)" : "var(--ad-text3)" }}>{specs.storageKwh > 0 ? specs.storageKwh.toFixed(2) : "—"}</div>
                      <div style={{ fontSize: 10, color: specs.storageKwh > 0 ? "var(--ad-text3)" : "var(--ad-text3)", marginTop: 2 }}>{specs.storageKwh > 0 ? "kWh" : ""}</div>
                    </div>
                  </div>
                </div>
              );
            })()}
            {(() => {
              const calcTotal = () => {
                const lines = form.components ?? [];
                const priced = lines.filter(l => {
                  const c = allComponents.find(c => c.id === l.componentId);
                  return c?.pricingEnabled && c?.unitPrice != null;
                });
                const allPriced = lines.every(l => {
                  const c = allComponents.find(c => c.id === l.componentId);
                  return !c?.pricingEnabled || c?.unitPrice != null;
                });
                if (!allPriced || priced.length === 0) return null;
                return priced.reduce((s, l) => {
                  const c = allComponents.find(c => c.id === l.componentId);
                  return s + (c?.unitPrice ?? 0) * l.quantity;
                }, 0);
              };
              const total = calcTotal();
              return (
                <div className="ad-form-full" style={{ borderTop: "1px solid var(--ad-border)", paddingTop: 16, marginTop: 8 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: total != null ? "#22c55e" : "var(--ad-text3)", marginBottom: 12 }}>💰 Total Package Price</div>
                  {total != null ? (
                    <div style={{ fontSize: 28, fontWeight: 700, color: "#22c55e", fontFamily: "monospace", marginBottom: 4 }}>
                      ₱{total.toLocaleString()}
                    </div>
                  ) : (
                    <div style={{ fontSize: 13, color: "var(--ad-text2)", fontStyle: "italic" }}>
                      ⚠ Some components missing pricing — total not available
                    </div>
                  )}
                </div>
              );
            })()}
            <div className="ad-form-full">
              <label className="ad-label">Estimated Monthly Savings <span style={{ fontWeight: 400, color: "var(--ad-text3)" }}>(auto-calculated)</span></label>
              <div style={{ display: "flex", alignItems: "baseline", gap: 8, background: "var(--ad-surface)", padding: "12px 16px", borderRadius: 6 }}>
                <span style={{ fontSize: 22, fontWeight: 700, color: "#22c55e", fontFamily: "monospace" }}>
                  ₱{(form.billRangeMin || 0).toLocaleString()} – ₱{(form.billRangeMax || 0).toLocaleString()}
                </span>
                <span style={{ fontSize: 12, color: "var(--ad-text3)" }}>/ mo</span>
              </div>
              <p className="ad-pkg-hint">Derived from production capacity: {form.solarKwp.toFixed(2)} kWp × 4h × 30d × ₱12/kWh, floored to ₱500, ±₱1,000.</p>
            </div>
            {/* Main Features — extra bullets on the card */}
            <div className="ad-form-full" style={{ borderTop: "1px solid var(--ad-border)", paddingTop: 16, marginTop: 8 }}>
              <label className="ad-label">Main Features <span style={{ fontWeight: 400, color: "var(--ad-text3)" }}>(optional — shown as card bullets; one per line)</span></label>
              <textarea
                className="ad-input"
                rows={4}
                style={{ resize: "vertical", fontFamily: "inherit", fontSize: 12 }}
                placeholder={"Hybrid System\nMobile Device Monitoring\n5kW Load Capacity"}
                value={(form.mainFeatures ?? []).join("\n")}
                onChange={e => setField("mainFeatures", e.target.value.split("\n").map(s => s.trimEnd()).filter(s => s))}
              />
              <small style={{ fontSize: 11, color: "var(--ad-text3)", marginTop: 4, display: "block" }}>Leave blank to auto-generate capacity bullets from components.</small>
            </div>

            {/* Package image URL */}
            <div className="ad-form-full">
              <label className="ad-label">Package Image URL <span style={{ fontWeight: 400, color: "var(--ad-text3)" }}>(optional — shown in More Details)</span></label>
              <input className="ad-input" value={form.imageUrl ?? ""} placeholder="https://…/image.jpg or leave blank"
                onChange={e => setField("imageUrl", e.target.value || null)} />
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 10, paddingTop: 22 }}>
              <input type="checkbox" id="pkg-active" checked={form.isActive} onChange={(e) => setField("isActive", e.target.checked)} style={{ width: 16, height: 16, cursor: "pointer", accentColor: "var(--ad-accent)" }} />
              <label htmlFor="pkg-active" style={{ color: "var(--ad-text)", fontSize: 13, cursor: "pointer" }}>Active — visible to customers</label>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, paddingTop: 4 }}>
              <input type="checkbox" id="pkg-recommended" checked={form.isRecommended} onChange={(e) => setField("isRecommended", e.target.checked)} style={{ width: 16, height: 16, cursor: "pointer", accentColor: "var(--ad-accent)" }} />
              <label htmlFor="pkg-recommended" style={{ color: "var(--ad-text)", fontSize: 13, cursor: "pointer" }}>Recommended — highlighted on the packages page</label>
            </div>
          </div>
                <div className="ad-form-actions" style={{ display: "flex", gap: 8, marginTop: 20 }}>
                  <button onClick={() => void handleSave()} disabled={saving} className="ad-btn">{saving ? "Saving…" : editingId ? "Update Package" : "Create Package"}</button>
                  <button onClick={closeForm} className="ad-btn ad-btn--ghost">Cancel</button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
      {loading ? (
        <div style={{ color: "var(--ad-text2)", padding: 24 }}>Loading packages…</div>
      ) : packages.length === 0 ? (
        <div className="ad-card" style={{ textAlign: "center", padding: "48px 24px" }}>
          <div style={{ fontSize: 15, color: "var(--ad-text2)", marginBottom: 8 }}>No packages yet</div>
          <div style={{ fontSize: 13, color: "var(--ad-text3)", maxWidth: 450, margin: "0 auto" }}>Click <strong>+ Add Package</strong> to build a new solar package. Choose components from your <strong>Inventory</strong> tab, and the system will auto-calculate your system specs and total price. Active packages appear on the public <strong>/packages</strong> page.</div>
        </div>
      ) : (
        <div className="ad-pkg-mgr-grid">
          {packages.map((p) => (
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
                  <button onClick={() => openEdit(p)} className="ad-btn ad-btn--ghost ad-btn--sm" disabled={showForm}>Edit</button>
                  <button onClick={() => void handleDelete(p)} disabled={deleting === p.id || showForm} className="ad-btn ad-btn--danger ad-btn--sm" style={{ opacity: deleting === p.id ? 0.5 : 1 }}>{deleting === p.id ? "…" : "Delete"}</button>
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

  const reset = async () => {
    if (!confirm("Reset to default content? This cannot be undone.")) return;
    try { await adminResetContent(apiKey, contentKey); setMsg("✓ Reset to default"); setTick((t) => t + 1); }
    catch (e) { setMsg(`Error: ${(e as Error).message}`); }
  };

  return { loading, saving, msg, form, setForm, save, reset };
}

function SectionEditorHeader({ title, onReset }: { title: string; onReset: () => void }) {
  return (
    <div className="ad-section-header" style={{ marginBottom: 16 }}>
      <div className="ad-section-title">{title}</div>
      <button onClick={onReset} className="ad-btn ad-btn--danger ad-btn--sm">Reset to Default</button>
    </div>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

type HeroForm = { headerPart1: string; headerPart2: string; highlightWords: string; subtext: string; primaryCta: string; secondaryCta: string };
const DEFAULT_HERO_FORM: HeroForm = { headerPart1: "Affordable", headerPart2: "Solar Power for Every Filipino Home and Business", highlightWords: "Affordable", subtext: "We Provide Solar Solutions Tailored For Your Home And Business", primaryCta: "Calculate Your Savings", secondaryCta: "View Projects" };

function HeroEditor({ apiKey }: { apiKey: string }) {
  const { loading, saving, msg, form, setForm, save, reset } = useSectionEditor(apiKey, "hero", DEFAULT_HERO_FORM);
  const ch = (k: keyof HeroForm) => (e: React.ChangeEvent<HTMLInputElement>) => setForm((f) => ({ ...f, [k]: e.target.value }));
  if (loading) return <div style={{ color: "var(--ad-text2)", padding: 24 }}>Loading…</div>;
  return (
    <div>
      <SectionEditorHeader title="Hero Section" onReset={reset} />
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
  const { loading, saving, msg, form, setForm, save, reset } = useSectionEditor(apiKey, "metrics", DEFAULT_METRICS_FORM);
  const updateItem = (idx: number, key: "value" | "label", val: string) =>
    setForm((f) => ({ ...f, items: f.items.map((item, i) => i === idx ? { ...item, [key]: val } : item) }));
  if (loading) return <div style={{ color: "var(--ad-text2)", padding: 24 }}>Loading…</div>;
  return (
    <div>
      <SectionEditorHeader title="Metrics / Stats" onReset={reset} />
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
  const { loading, saving, msg, form, setForm, save, reset } = useSectionEditor(apiKey, "benefits", DEFAULT_BENEFITS_FORM);
  const updateItem = (idx: number, key: "title" | "description", val: string) =>
    setForm((f) => ({ ...f, items: f.items.map((item, i) => i === idx ? { ...item, [key]: val } : item) }));
  if (loading) return <div style={{ color: "var(--ad-text2)", padding: 24 }}>Loading…</div>;
  return (
    <div>
      <SectionEditorHeader title="Benefits Banner" onReset={reset} />
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
  const { loading, saving, msg, form, setForm, save, reset } = useSectionEditor(apiKey, "tropics", DEFAULT_TROPICS_FORM);
  if (loading) return <div style={{ color: "var(--ad-text2)", padding: 24 }}>Loading…</div>;
  return (
    <div>
      <SectionEditorHeader title="Tropics Section" onReset={reset} />
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
  const { loading, saving, msg, form, setForm, save, reset } = useSectionEditor(apiKey, "clientJourney", DEFAULT_JOURNEY_FORM);
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
      <SectionEditorHeader title="Client Journey" onReset={reset} />
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
  const { loading, saving, msg, form, setForm, save, reset } = useSectionEditor(apiKey, "excellence", DEFAULT_EXCELLENCE_FORM);
  const updateItem = (idx: number, key: "title" | "description", val: string) =>
    setForm((f) => ({ ...f, items: f.items.map((item, i) => i === idx ? { ...item, [key]: val } : item) }));
  if (loading) return <div style={{ color: "var(--ad-text2)", padding: 24 }}>Loading…</div>;
  return (
    <div>
      <SectionEditorHeader title="Engineered Excellence" onReset={reset} />
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
  const { loading, saving, msg, form, setForm, save, reset } = useSectionEditor(apiKey, "process", DEFAULT_PROCESS_FORM);
  const updateStep = (idx: number, key: "title" | "description", val: string) =>
    setForm((f) => ({ ...f, steps: f.steps.map((s, i) => i === idx ? { ...s, [key]: val } : s) }));
  if (loading) return <div style={{ color: "var(--ad-text2)", padding: 24 }}>Loading…</div>;
  return (
    <div>
      <SectionEditorHeader title="Process Steps" onReset={reset} />
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
  const { loading, saving, msg, form, setForm, save, reset } = useSectionEditor(apiKey, "cta", DEFAULT_CTA_FORM);
  const ch = (k: keyof CtaForm) => (e: React.ChangeEvent<HTMLInputElement>) => setForm((f) => ({ ...f, [k]: e.target.value }));
  if (loading) return <div style={{ color: "var(--ad-text2)", padding: 24 }}>Loading…</div>;
  return (
    <div>
      <SectionEditorHeader title="Call to Action" onReset={reset} />
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

  const handleReset = async () => {
    if (!confirm("Reset footer to default content? This cannot be undone.")) return;
    try { await adminResetContent(apiKey, "footer"); setMsg("✓ Footer reset to default"); await load(); }
    catch (e) { setMsg(`Error: ${(e as Error).message}`); }
  };

  if (loading) return <div style={{ color: "var(--ad-text2)", padding: 24 }}>Loading footer…</div>;

  return (
    <div className="ad-footer-wrap">
      <div className="ad-section-header" style={{ marginBottom: 16 }}>
        <div className="ad-section-title">Footer</div>
        <button onClick={() => void handleReset()} className="ad-btn ad-btn--danger ad-btn--sm">Reset to Default</button>
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

// ─── Main ─────────────────────────────────────────────────────────────────────

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

  const TABS: Array<{ id: Tab; label: string }> = [
    { id: "overview",   label: "Overview" },
    { id: "inquiries",  label: "Talk Inquiries" },
    { id: "quotations", label: "Quotations" },
    { id: "projects",    label: "Projects" },
    { id: "inventory",  label: "Inventory" },
    { id: "packages",    label: "Packages" },
    { id: "package-inquiries", label: "Package Inquiries" },
    { id: "sections",   label: "Visibility" },
    { id: "hero",       label: "Hero" },
    { id: "metrics",    label: "Metrics" },
    { id: "benefits",   label: "Benefits" },
    { id: "tropics",    label: "Tropics" },
    { id: "journey",    label: "Journey" },
    { id: "excellence", label: "Excellence" },
    { id: "process",    label: "Process" },
    { id: "cta",        label: "Call to Action" },
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
      <ASRateLimitBanner />
      <nav className="ad-topnav">
        <div className="ad-topnav-logo">azari<span>.solar</span></div>
        <span className="ad-topnav-badge">Admin</span>
        <div className="ad-topnav-spacer" />
        <div className="ad-topnav-actions">
          <button className={`ad-theme-toggle${isLight ? " is-light" : ""}`} onClick={toggleTheme} aria-label="Toggle theme" title={isLight ? "Switch to dark mode" : "Switch to light mode"} />
          <button onClick={handleLogout} className="ad-btn ad-btn--ghost ad-btn--sm">Sign Out</button>
        </div>
      </nav>

      <div className="ad-tabs">
        {TABS.map((t) => (
          <button key={t.id} className={`ad-tab-btn${tab === t.id ? " is-active" : ""}`} onClick={() => setTab(t.id)}>
            {t.label}
          </button>
        ))}
      </div>

      <div className="ad-content">
        {tab === "overview"   && <OverviewTab stats={stats} />}
        {tab === "inquiries"  && <SubmissionsTable apiKey={apiKey} type="talk" />}
        {tab === "quotations" && <SubmissionsTable apiKey={apiKey} type="quotations" />}
        {tab === "projects"    && <ProjectsManager   apiKey={apiKey} />}
        {tab === "inventory"  && <ComponentsManager apiKey={apiKey} />}
        {tab === "packages"    && <PackagesManager   apiKey={apiKey} />}
        {tab === "package-inquiries" && <PackageInquiriesManager apiKey={apiKey} />}
        {tab === "sections"   && <SectionsManager apiKey={apiKey} />}
        {tab === "hero"       && <HeroEditor apiKey={apiKey} />}
        {tab === "metrics"    && <MetricsEditor apiKey={apiKey} />}
        {tab === "benefits"   && <BenefitsEditor apiKey={apiKey} />}
        {tab === "tropics"    && <TropicsEditor apiKey={apiKey} />}
        {tab === "journey"    && <ClientJourneyEditor apiKey={apiKey} />}
        {tab === "excellence" && <ExcellenceEditor apiKey={apiKey} />}
        {tab === "process"    && <ProcessEditor apiKey={apiKey} />}
        {tab === "cta"        && <CtaEditor apiKey={apiKey} />}
        {tab === "footer"     && <FooterEditor apiKey={apiKey} />}
      </div>
    </div>
  );
}
