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
} from "../services/ASContent";

// ─── Types ────────────────────────────────────────────────────────────────────

type Tab = "overview" | "inquiries" | "quotations" | "content";

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

// ─── Helpers ──────────────────────────────────────────────────────────────────

const STATUS_COLORS: Record<string, string> = {
  received: "#2563eb",
  emailed: "#16a34a",
  email_failed: "#dc2626",
  archived: "#6b7280",
};

function StatusBadge({ status }: { status: string }) {
  return (
    <span style={{ background: STATUS_COLORS[status] ?? "#6b7280", color: "#fff", fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 10 }}>
      {status.replace(/_/g, " ")}
    </span>
  );
}

function fmt(iso: string) {
  return new Date(iso).toLocaleDateString("en-PH", { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}

// ─── Login Screen ─────────────────────────────────────────────────────────────

function LoginScreen({ onLogin }: { onLogin: (key: string) => void }) {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed) { setError("API key is required."); return; }
    onLogin(trimmed);
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0f172a" }}>
      <div style={{ background: "#1e293b", borderRadius: 16, padding: "40px 48px", width: 360, boxShadow: "0 8px 32px rgba(0,0,0,0.4)" }}>
        <div style={{ fontSize: 22, fontWeight: 800, color: "#f8fafc", letterSpacing: -0.5, marginBottom: 4 }}>
          azari<span style={{ color: "#38bdf8" }}>.solar</span>
        </div>
        <div style={{ fontSize: 13, color: "#64748b", marginBottom: 32 }}>Admin Panel</div>
        <form onSubmit={handleSubmit}>
          <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#94a3b8", marginBottom: 6, letterSpacing: 1, textTransform: "uppercase" }}>
            Admin API Key
          </label>
          <input
            type="password"
            value={value}
            onChange={(e) => { setValue(e.target.value); setError(""); }}
            placeholder="Enter your admin API key"
            style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #334155", background: "#0f172a", color: "#f8fafc", fontSize: 14, boxSizing: "border-box", outline: "none" }}
          />
          {error && <div style={{ color: "#f87171", fontSize: 12, marginTop: 6 }}>{error}</div>}
          <button
            type="submit"
            style={{ marginTop: 20, width: "100%", padding: "11px 0", background: "#38bdf8", color: "#0f172a", fontWeight: 700, fontSize: 14, border: "none", borderRadius: 8, cursor: "pointer" }}
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}

// ─── Overview Tab ─────────────────────────────────────────────────────────────

function OverviewTab({ stats }: { stats: Stats | null }) {
  if (!stats) return <div style={{ color: "#94a3b8", padding: 24 }}>Loading stats…</div>;

  const talkCounts = stats.talkInquiries.byStatus;
  const quotCounts = stats.quotations.byStatus;

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 16, marginBottom: 32 }}>
        {[
          { label: "Total Inquiries", value: stats.totals.talkInquiries, color: "#38bdf8" },
          { label: "Total Quotations", value: stats.totals.quotations, color: "#4ade80" },
          { label: "Email Failures (Talk)", value: talkCounts.email_failed ?? 0, color: "#f87171" },
          { label: "Email Failures (Quot.)", value: quotCounts.email_failed ?? 0, color: "#f87171" },
        ].map((card) => (
          <div key={card.label} style={{ background: "#1e293b", borderRadius: 12, padding: "20px 24px" }}>
            <div style={{ fontSize: 12, color: "#64748b", marginBottom: 4, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1 }}>{card.label}</div>
            <div style={{ fontSize: 32, fontWeight: 800, color: card.color }}>{card.value}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        <div style={{ background: "#1e293b", borderRadius: 12, padding: 20 }}>
          <div style={{ fontWeight: 700, color: "#f8fafc", marginBottom: 12 }}>Recent Inquiries</div>
          {stats.recent.talkInquiries.map((r) => (
            <div key={r.id} style={{ borderBottom: "1px solid #334155", padding: "10px 0", fontSize: 13 }}>
              <div style={{ color: "#f8fafc", fontWeight: 600 }}>{r.name}</div>
              <div style={{ color: "#64748b" }}>{r.email} · {r.inquiryType}</div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
                <span style={{ color: "#475569", fontSize: 11 }}>{fmt(r.createdAt)}</span>
                <StatusBadge status={r.status} />
              </div>
            </div>
          ))}
        </div>
        <div style={{ background: "#1e293b", borderRadius: 12, padding: 20 }}>
          <div style={{ fontWeight: 700, color: "#f8fafc", marginBottom: 12 }}>Recent Quotations</div>
          {stats.recent.quotations.map((r) => (
            <div key={r.id} style={{ borderBottom: "1px solid #334155", padding: "10px 0", fontSize: 13 }}>
              <div style={{ color: "#f8fafc", fontWeight: 600 }}>{r.fullName}</div>
              <div style={{ color: "#64748b" }}>{r.email} · {r.estimatedSystemSizeDisplayText}</div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
                <span style={{ color: "#475569", fontSize: 11 }}>{fmt(r.createdAt)}</span>
                <StatusBadge status={r.status} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Submissions Table ─────────────────────────────────────────────────────────

function SubmissionsTable({
  apiKey,
  type,
}: {
  apiKey: string;
  type: "talk" | "quotations";
}) {
  const [data, setData] = useState<unknown[]>([]);
  const [total, setTotal] = useState(0);
  const [offset, setOffset] = useState(0);
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState<string | null>(null);
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
    } finally {
      setUpdating(null);
    }
  };

  const STATUS_OPTIONS: SubmissionStatus[] = ["received", "emailed", "email_failed", "archived"];

  return (
    <div>
      <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 16 }}>
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setOffset(0); }}
          style={{ padding: "6px 10px", borderRadius: 6, border: "1px solid #334155", background: "#1e293b", color: "#f8fafc", fontSize: 13 }}
        >
          <option value="">All Statuses</option>
          {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s.replace(/_/g, " ")}</option>)}
        </select>
        <span style={{ color: "#64748b", fontSize: 13 }}>{total} records</span>
      </div>

      {loading ? (
        <div style={{ color: "#64748b", padding: 24 }}>Loading…</div>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ background: "#1e293b" }}>
                {type === "talk" ? (
                  <>
                    <th style={TH}>Name</th>
                    <th style={TH}>Email</th>
                    <th style={TH}>Phone</th>
                    <th style={TH}>Location</th>
                    <th style={TH}>Type</th>
                  </>
                ) : (
                  <>
                    <th style={TH}>Name</th>
                    <th style={TH}>Email</th>
                    <th style={TH}>System Size</th>
                    <th style={TH}>Monthly Bill</th>
                    <th style={TH}>Property</th>
                  </>
                )}
                <th style={TH}>Date</th>
                <th style={TH}>Status</th>
              </tr>
            </thead>
            <tbody>
              {(data as Array<Record<string, unknown>>).map((row) => (
                <tr key={row.id as string} style={{ borderBottom: "1px solid #1e293b" }}>
                  {type === "talk" ? (
                    <>
                      <td style={TD}>{row.name as string}</td>
                      <td style={TD}>{row.email as string}</td>
                      <td style={TD}>{row.phone as string}</td>
                      <td style={TD}>{row.city as string}, {row.province as string}</td>
                      <td style={TD}>{row.inquiryType as string}</td>
                    </>
                  ) : (
                    <>
                      <td style={TD}>{row.fullName as string}</td>
                      <td style={TD}>{row.email as string}</td>
                      <td style={TD}>{row.estimatedSystemSizeDisplayText as string}</td>
                      <td style={TD}>₱{Number(row.averageMonthlyBillPhp).toLocaleString()}</td>
                      <td style={TD}>{row.propertyClassification as string}</td>
                    </>
                  )}
                  <td style={TD}>{fmt(row.createdAt as string)}</td>
                  <td style={TD}>
                    <select
                      value={row.status as string}
                      disabled={updating === row.id}
                      onChange={(e) => void handleStatusChange(row.id as string, e.target.value)}
                      style={{ padding: "4px 8px", borderRadius: 6, border: "1px solid #334155", background: STATUS_COLORS[row.status as string] ?? "#334155", color: "#fff", fontSize: 11, fontWeight: 700, cursor: "pointer" }}
                    >
                      {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s.replace(/_/g, " ")}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div style={{ display: "flex", gap: 8, marginTop: 16, justifyContent: "flex-end" }}>
        <button onClick={() => setOffset(Math.max(0, offset - limit))} disabled={offset === 0} style={BTN_SM}>← Prev</button>
        <span style={{ color: "#64748b", fontSize: 13, alignSelf: "center" }}>{Math.floor(offset / limit) + 1} / {Math.max(1, Math.ceil(total / limit))}</span>
        <button onClick={() => setOffset(offset + limit)} disabled={offset + limit >= total} style={BTN_SM}>Next →</button>
      </div>
    </div>
  );
}

// ─── Content Editor ────────────────────────────────────────────────────────────

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
      setItems(res.data);
    } finally {
      setLoading(false);
    }
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
    } finally {
      setSaving(false);
    }
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
    hero: "Hero Section",
    metrics: "Metrics / Stats",
    excellence: "Engineered Excellence",
    process: "Process Steps",
    tropics: "Tropics Section",
    cta: "Call to Action",
    benefits: "Benefits Banner",
  };

  if (loading) return <div style={{ color: "#94a3b8", padding: 24 }}>Loading content…</div>;

  return (
    <div style={{ display: "grid", gridTemplateColumns: editing ? "280px 1fr" : "1fr", gap: 16 }}>
      {/* Section list */}
      <div>
        {msg && <div style={{ padding: "8px 12px", borderRadius: 8, background: msg.startsWith("Error") ? "#7f1d1d" : "#14532d", color: "#fff", fontSize: 13, marginBottom: 12 }}>{msg}</div>}
        {items.map((item) => (
          <div
            key={item.key}
            style={{ background: editing === item.key ? "#2d3f55" : "#1e293b", borderRadius: 10, padding: "14px 16px", marginBottom: 8, cursor: "pointer", border: editing === item.key ? "1px solid #38bdf8" : "1px solid transparent" }}
            onClick={() => startEdit(item)}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontWeight: 600, color: "#f8fafc", fontSize: 14 }}>{SECTION_LABELS[item.key] ?? item.key}</span>
              {item.isCustomized && (
                <span style={{ fontSize: 10, background: "#0284c7", color: "#fff", padding: "2px 6px", borderRadius: 6, fontWeight: 700 }}>CUSTOM</span>
              )}
            </div>
            <div style={{ fontSize: 11, color: "#64748b", marginTop: 4 }}>
              {item.updatedAt ? `Updated ${fmt(item.updatedAt)}` : "Using default"}
            </div>
          </div>
        ))}
      </div>

      {/* Editor panel */}
      {editing && (
        <div style={{ background: "#1e293b", borderRadius: 12, padding: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <div style={{ fontWeight: 700, color: "#f8fafc", fontSize: 16 }}>
              {SECTION_LABELS[editing] ?? editing}
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => void handleReset(editing)} style={{ ...BTN_SM, background: "#7f1d1d", color: "#fca5a5" }}>Reset to Default</button>
              <button onClick={() => setEditing(null)} style={{ ...BTN_SM, background: "#334155", color: "#cbd5e1" }}>Close</button>
            </div>
          </div>

          <div style={{ fontSize: 12, color: "#64748b", marginBottom: 8 }}>
            Edit JSON — changes take effect immediately on the website after saving.
          </div>

          <textarea
            ref={textareaRef}
            value={editorText}
            onChange={(e) => { setEditorText(e.target.value); validateJson(e.target.value); }}
            spellCheck={false}
            style={{
              width: "100%", minHeight: 420, padding: 14, borderRadius: 8,
              border: jsonError ? "1px solid #dc2626" : "1px solid #334155",
              background: "#0f172a", color: "#e2e8f0", fontFamily: "monospace", fontSize: 13,
              lineHeight: 1.6, resize: "vertical", boxSizing: "border-box", outline: "none"
            }}
          />
          {jsonError && <div style={{ color: "#f87171", fontSize: 12, marginTop: 4 }}>JSON error: {jsonError}</div>}

          <div style={{ display: "flex", gap: 10, marginTop: 14, alignItems: "center" }}>
            <button
              onClick={() => void handleSave()}
              disabled={saving || !!jsonError}
              style={{ padding: "9px 24px", background: saving || jsonError ? "#334155" : "#38bdf8", color: saving || jsonError ? "#64748b" : "#0f172a", fontWeight: 700, fontSize: 14, border: "none", borderRadius: 8, cursor: saving || jsonError ? "not-allowed" : "pointer" }}
            >
              {saving ? "Saving…" : "Save Changes"}
            </button>
            {msg && !saving && <span style={{ fontSize: 13, color: msg.startsWith("Error") ? "#f87171" : "#4ade80" }}>{msg}</span>}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Shared table styles ───────────────────────────────────────────────────────

const TH: React.CSSProperties = { padding: "10px 12px", textAlign: "left", color: "#64748b", fontWeight: 700, fontSize: 11, textTransform: "uppercase", letterSpacing: 1, whiteSpace: "nowrap" };
const TD: React.CSSProperties = { padding: "10px 12px", color: "#cbd5e1", verticalAlign: "middle" };
const BTN_SM: React.CSSProperties = { padding: "6px 14px", borderRadius: 6, border: "none", background: "#334155", color: "#cbd5e1", fontSize: 12, fontWeight: 600, cursor: "pointer" };

// ─── Main Admin Page ──────────────────────────────────────────────────────────

export default function ASAdmin() {
  const [apiKey, setApiKey] = useState<string>(() => sessionStorage.getItem("azari_admin_key") ?? "");
  const [authError, setAuthError] = useState("");
  const [tab, setTab] = useState<Tab>("overview");
  const [stats, setStats] = useState<Stats | null>(null);

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
    setApiKey("");
    setStats(null);
  };

  if (!apiKey) {
    return (
      <div>
        <LoginScreen onLogin={handleLogin} />
        {authError && (
          <div style={{ position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)", background: "#7f1d1d", color: "#fca5a5", padding: "10px 20px", borderRadius: 8, fontSize: 14 }}>
            {authError}
          </div>
        )}
      </div>
    );
  }

  const TABS: Array<{ id: Tab; label: string }> = [
    { id: "overview", label: "Overview" },
    { id: "inquiries", label: "Talk Inquiries" },
    { id: "quotations", label: "Quotation Requests" },
    { id: "content", label: "Site Content" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#0f172a", color: "#f8fafc" }}>
      {/* Top nav */}
      <nav style={{ background: "#1e293b", borderBottom: "1px solid #334155", padding: "0 24px", display: "flex", alignItems: "center", height: 56, gap: 24 }}>
        <div style={{ fontSize: 18, fontWeight: 800, letterSpacing: -0.5 }}>
          azari<span style={{ color: "#38bdf8" }}>.solar</span>
          <span style={{ fontSize: 12, color: "#64748b", fontWeight: 400, marginLeft: 8 }}>Admin</span>
        </div>
        <div style={{ flex: 1 }} />
        <button onClick={handleLogout} style={{ ...BTN_SM, fontSize: 13 }}>Sign Out</button>
      </nav>

      {/* Tab bar */}
      <div style={{ background: "#1e293b", borderBottom: "1px solid #334155", padding: "0 24px", display: "flex", gap: 4 }}>
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{
              padding: "14px 16px", background: "transparent", border: "none", borderBottom: tab === t.id ? "2px solid #38bdf8" : "2px solid transparent",
              color: tab === t.id ? "#38bdf8" : "#94a3b8", fontWeight: 600, fontSize: 13, cursor: "pointer", marginBottom: -1
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div style={{ padding: 24, maxWidth: 1400, margin: "0 auto" }}>
        {tab === "overview" && <OverviewTab stats={stats} />}
        {tab === "inquiries" && <SubmissionsTable apiKey={apiKey} type="talk" />}
        {tab === "quotations" && <SubmissionsTable apiKey={apiKey} type="quotations" />}
        {tab === "content" && <ContentEditor apiKey={apiKey} />}
      </div>
    </div>
  );
}
