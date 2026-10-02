import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { PREFIXED_LOCALES, type LocaleDefinition } from "../../i18n/locales";
import {
  adminDeleteEntityTranslation,
  adminGetEntityTranslation,
  adminSaveEntityTranslation,
  adminTranslateDraft,
  type EntityTranslationView,
  type TranslatableEntityType,
} from "../../services/ASTranslations";
import { TranslationLeaves, type ProseLeaf } from "./TranslationLeaves";

export interface TranslationEditorModalProps {
  open: boolean;
  onClose: () => void;
  apiKey: string;
  entityType: TranslatableEntityType;
  entityId: string;
  /** Shown under the modal title, e.g. the project's English title. */
  displayTitle: string;
}

type Values = Readonly<Record<string, string>>;
type Notice = { kind: "success" | "error" | "info"; text: string } | null;
type PendingDiscard = { kind: "close" } | { kind: "locale"; locale: LocaleDefinition } | null;

const ENTITY_LABELS: Record<TranslatableEntityType, string> = {
  project: "Project",
  package: "Package",
  journeyStep: "Journey step",
  ipRating: "IP rating",
};

/** "systemCardSubtext" -> "System card subtext". */
function humanize(key: string): string {
  const words = key
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .trim()
    .toLowerCase();
  return words.charAt(0).toUpperCase() + words.slice(1);
}

function subLabel(leaf: ProseLeaf): string {
  const rest = leaf.path.slice(1);
  if (rest.length === 0) return "Text";
  return rest.map((p) => (typeof p === "number" ? `#${p + 1}` : humanize(p))).join(" › ");
}

function valuesFromView(leaves: readonly ProseLeaf[], view: EntityTranslationView): Values {
  const out: Record<string, string> = {};
  for (const leaf of leaves) {
    const t = view.translation ? TranslationLeaves.get(view.translation, leaf.path) : undefined;
    out[leaf.id] = typeof t === "string" ? t : "";
  }
  return out;
}

function fmtDate(iso: string | null): string {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-PH", { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}

function ConfirmDialog({
  title,
  description,
  confirmLabel,
  danger,
  busy,
  onConfirm,
  onCancel,
}: {
  title: string;
  description: string;
  confirmLabel: string;
  danger?: boolean;
  busy?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return createPortal(
    <div
      className="ad-confirm-backdrop"
      onClick={(e) => {
        e.stopPropagation();
        onCancel();
      }}
    >
      <div className="ad-confirm-panel" role="alertdialog" aria-modal="true" aria-label={title} onClick={(e) => e.stopPropagation()}>
        <div className="ad-confirm-title">{title}</div>
        <div className="ad-confirm-desc">{description}</div>
        <div className="ad-confirm-actions">
          <button type="button" onClick={onCancel} className="ad-btn ad-btn--ghost">
            Cancel
          </button>
          <button type="button" onClick={onConfirm} disabled={busy} className={`ad-btn${danger ? " ad-btn--danger" : ""}`}>
            {busy ? "Working…" : confirmLabel}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}

function FieldRow({ leaf, value, isDraft, onChange }: { leaf: ProseLeaf; value: string; isDraft: boolean; onChange: (v: string) => void }) {
  const inputId = `ad-tr-${leaf.id.replace(/[^a-z0-9]+/gi, "-")}`;
  return (
    <div className={`ad-tr-row${isDraft ? " is-draft" : ""}`}>
      <div className="ad-tr-cell">
        <div className="ad-tr-cell-label">
          <span>{subLabel(leaf)}</span>
          <span className="ad-tr-tag">English</span>
          {leaf.isHtml && <span className="ad-tr-tag">HTML</span>}
        </div>
        {/* Rendered as text on purpose: HTML in journey blocks is shown as source, never interpreted. */}
        <div className={`ad-tr-source${leaf.isHtml ? " is-code" : ""}`}>{leaf.text}</div>
      </div>
      <div className="ad-tr-cell">
        <label className="ad-tr-cell-label" htmlFor={inputId}>
          <span>Translation</span>
          {isDraft && <span className="ad-tr-tag is-draft">Draft — review</span>}
        </label>
        {leaf.multiline ? (
          <textarea
            id={inputId}
            className={`ad-input ad-tr-input${leaf.isHtml ? " is-code" : ""}`}
            rows={Math.min(10, Math.max(3, Math.ceil(leaf.text.length / 70)))}
            value={value}
            placeholder="Empty — visitors see the English text"
            onChange={(e) => onChange(e.target.value)}
            spellCheck={!leaf.isHtml}
          />
        ) : (
          <input
            id={inputId}
            className="ad-input ad-tr-input"
            value={value}
            placeholder="Empty — visitors see the English text"
            onChange={(e) => onChange(e.target.value)}
          />
        )}
        {leaf.isHtml && <p className="ad-tr-hint">Keep the HTML tags and attributes as they are; translate only the text between them.</p>}
      </div>
    </div>
  );
}

/**
 * Edits one item's translation in any non-English site language, side by
 * side with the English. Untranslated fields are saved empty and fall back to
 * English on the public site.
 */
export default function ASTranslationEditorModal({
  open,
  onClose,
  apiKey,
  entityType,
  entityId,
  displayTitle,
}: TranslationEditorModalProps) {
  const [locale, setLocale] = useState<LocaleDefinition>(PREFIXED_LOCALES[0]!);
  const [view, setView] = useState<EntityTranslationView | null>(null);
  /** Outcome of the latest finished load, tagged with the request it answers. */
  const [loaded, setLoaded] = useState<{ key: string; error: string } | null>(null);
  const [values, setValues] = useState<Values>({});
  const [baseline, setBaseline] = useState<Values>({});
  const [drafts, setDrafts] = useState<ReadonlySet<string>>(new Set());
  const [notice, setNotice] = useState<Notice>(null);
  const [saving, setSaving] = useState(false);
  const [translating, setTranslating] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [confirmRemove, setConfirmRemove] = useState(false);
  const [pendingDiscard, setPendingDiscard] = useState<PendingDiscard>(null);
  const [reloadTick, setReloadTick] = useState(0);
  const requestKey = `${entityType}:${entityId}:${locale.tag}:${reloadTick}`;
  const loading = loaded?.key !== requestKey;
  const loadError = loading ? "" : (loaded?.error ?? "");

  const leaves = useMemo(() => (view ? TranslationLeaves.collect(view.source) : []), [view]);
  const groups = useMemo(() => {
    const byField = new Map<string, ProseLeaf[]>();
    for (const leaf of leaves) {
      const field = String(leaf.path[0]);
      const list = byField.get(field) ?? [];
      list.push(leaf);
      byField.set(field, list);
    }
    return [...byField.entries()];
  }, [leaves]);

  const dirty = useMemo(() => leaves.some((l) => (values[l.id] ?? "") !== (baseline[l.id] ?? "")), [leaves, values, baseline]);
  const translatedCount = useMemo(() => leaves.filter((l) => (values[l.id] ?? "").trim()).length, [leaves, values]);
  const busy = saving || translating || removing;

  const applyView = useCallback((next: EntityTranslationView) => {
    const nextLeaves = TranslationLeaves.collect(next.source);
    const v = valuesFromView(nextLeaves, next);
    setView(next);
    setValues(v);
    setBaseline(v);
    setDrafts(new Set());
  }, []);

  // Load whenever the modal opens, the item or the language changes.
  useEffect(() => {
    if (!open || !entityId) return;
    let cancelled = false;
    adminGetEntityTranslation(apiKey, entityType, entityId, locale.tag)
      .then((res) => {
        if (cancelled) return;
        applyView(res);
        setLoaded({ key: requestKey, error: "" });
      })
      .catch((e: Error) => {
        if (cancelled) return;
        setView(null);
        setLoaded({ key: requestKey, error: e.message });
      });
    return () => {
      cancelled = true;
    };
  }, [open, apiKey, entityType, entityId, locale.tag, requestKey, applyView]);

  const requestClose = useCallback(() => {
    if (busy) return;
    if (dirty) setPendingDiscard({ kind: "close" });
    else onClose();
  }, [busy, dirty, onClose]);

  // Escape closes (through the unsaved-changes guard) unless a confirm dialog is up.
  const escRef = useRef(requestClose);
  useEffect(() => {
    escRef.current = requestClose;
  });
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape" || confirmRemove || pendingDiscard) return;
      escRef.current();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, confirmRemove, pendingDiscard]);

  if (!open) return null;

  const changeLocale = (next: LocaleDefinition) => {
    if (next === locale) return;
    if (dirty) setPendingDiscard({ kind: "locale", locale: next });
    else {
      setNotice(null);
      setLocale(next);
    }
  };

  const confirmDiscard = () => {
    const pending = pendingDiscard;
    setPendingDiscard(null);
    if (!pending) return;
    if (pending.kind === "close") onClose();
    else {
      setNotice(null);
      setValues(baseline);
      setDrafts(new Set());
      setLocale(pending.locale);
    }
  };

  const setValue = (id: string, v: string) => {
    setValues((prev) => ({ ...prev, [id]: v }));
    if (drafts.has(id))
      setDrafts((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
  };

  const autoTranslate = async () => {
    if (!view) return;
    const empty = leaves.filter((l) => !(values[l.id] ?? "").trim());
    if (empty.length === 0) {
      setNotice({ kind: "info", text: "Every field already has a translation. Clear a field to have it auto-translated." });
      return;
    }
    setTranslating(true);
    setNotice(null);
    try {
      // Send only the fields that still have empty leaves; the draft keeps the same top-level keys.
      const neededFields = new Set(empty.map((l) => String(l.path[0])));
      const subset = Object.fromEntries(Object.entries(view.source).filter(([field]) => neededFields.has(field)));
      const draft = await adminTranslateDraft(apiKey, locale.tag, subset);
      const filledIds: string[] = [];
      const additions: Record<string, string> = {};
      for (const leaf of empty) {
        const t = TranslationLeaves.get(draft, leaf.path);
        if (typeof t === "string" && t.trim()) {
          additions[leaf.id] = t;
          filledIds.push(leaf.id);
        }
      }
      // Only fields that are still empty: the admin may have typed while the request ran.
      setValues((prev) => {
        const next = { ...prev };
        for (const id of filledIds) if (!(next[id] ?? "").trim()) next[id] = additions[id]!;
        return next;
      });
      setDrafts((prev) => new Set([...prev, ...filledIds]));
      setNotice(
        filledIds.length > 0
          ? {
              kind: "info",
              text: `Filled ${filledIds.length} empty field${filledIds.length === 1 ? "" : "s"} with a machine translation. Review the highlighted fields, then Save.`,
            }
          : { kind: "info", text: "Auto-translate returned nothing new to fill." },
      );
    } catch (e) {
      setNotice({ kind: "error", text: (e as Error).message });
    } finally {
      setTranslating(false);
    }
  };

  const save = async () => {
    if (!view) return;
    const fields = TranslationLeaves.buildFields(view.source, new Map(Object.entries(values)));
    if (Object.keys(fields).length === 0) {
      setNotice(
        view.translation
          ? { kind: "info", text: "Every field is empty. Use “Remove translation” to show English for this language." }
          : { kind: "info", text: "Enter at least one translation before saving." },
      );
      return;
    }
    setSaving(true);
    setNotice(null);
    try {
      const next = await adminSaveEntityTranslation(apiKey, entityType, entityId, locale.tag, fields);
      applyView(next);
      setNotice({ kind: "success", text: `${locale.nativeName} translation saved.` });
    } catch (e) {
      setNotice({ kind: "error", text: (e as Error).message });
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    setRemoving(true);
    try {
      await adminDeleteEntityTranslation(apiKey, entityType, entityId, locale.tag);
      setConfirmRemove(false);
      setReloadTick((t) => t + 1);
      setNotice({ kind: "success", text: `${locale.nativeName} translation removed. Visitors now see English.` });
    } catch (e) {
      setConfirmRemove(false);
      setNotice({ kind: "error", text: (e as Error).message });
    } finally {
      setRemoving(false);
    }
  };

  let body: ReactNode;
  if (loading) {
    body = <div className="ad-tr-empty">Loading translation…</div>;
  } else if (loadError) {
    body = (
      <div className="ad-tr-alert is-error" role="alert">
        <span>{loadError}</span>
        <button type="button" className="ad-btn ad-btn--ghost ad-btn--sm" onClick={() => setReloadTick((t) => t + 1)}>
          Retry
        </button>
      </div>
    );
  } else if (view && leaves.length === 0) {
    body = <div className="ad-tr-empty">This item has no text to translate yet. Add the English text first.</div>;
  } else if (view) {
    body = groups.map(([field, list]) => (
      <section key={field} className="ad-tr-group">
        <div className="ad-tr-group-title">{humanize(field)}</div>
        {list.map((leaf) => (
          <FieldRow
            key={leaf.id}
            leaf={leaf}
            value={values[leaf.id] ?? ""}
            isDraft={drafts.has(leaf.id)}
            onChange={(v) => setValue(leaf.id, v)}
          />
        ))}
      </section>
    ));
  }

  return (
    <>
      {createPortal(
        <div className="ad-modal-backdrop" onClick={requestClose}>
          <div
            className="ad-modal-panel ad-tr-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="ad-tr-modal-title"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="ad-modal-header">
              <div style={{ minWidth: 0 }}>
                <div className="ad-modal-title" id="ad-tr-modal-title">
                  {ENTITY_LABELS[entityType]} translations
                </div>
                <div className="ad-modal-subtitle ad-tr-subtitle">{displayTitle}</div>
              </div>
              <button type="button" onClick={requestClose} className="ad-modal-close" aria-label="Close" disabled={busy}>
                ✕
              </button>
            </div>

            <div className="ad-tr-toolbar">
              <label className="ad-tr-locale">
                <span className="ad-label" style={{ margin: 0 }}>
                  Language
                </span>
                <select
                  className="ad-select"
                  value={locale.code}
                  disabled={busy}
                  onChange={(e) => {
                    const next = PREFIXED_LOCALES.find((l) => l.code === e.target.value);
                    if (next) changeLocale(next);
                  }}
                >
                  {PREFIXED_LOCALES.map((l) => (
                    <option key={l.code} value={l.code} lang={l.tag}>
                      {l.nativeName}
                    </option>
                  ))}
                </select>
              </label>
              <div className="ad-tr-state">
                {view &&
                  !loading &&
                  (view.translation ? (
                    <span className="ad-tr-pill is-saved">Saved {fmtDate(view.updatedAt)}</span>
                  ) : (
                    <span className="ad-tr-pill">Not translated — English shown</span>
                  ))}
                {view && !loading && leaves.length > 0 && (
                  <span className="ad-tr-count">
                    {translatedCount}/{leaves.length} fields
                  </span>
                )}
              </div>
              <div className="ad-tr-toolbar-actions">
                <button
                  type="button"
                  className="ad-btn ad-btn--secondary ad-btn--sm"
                  onClick={() => void autoTranslate()}
                  disabled={!view || loading || busy || leaves.length === 0}
                  title="Machine-translates the English into this language and fills only the empty fields. Nothing is saved until you click Save."
                >
                  {translating ? "Translating…" : "Auto-translate draft"}
                </button>
                <button
                  type="button"
                  className="ad-btn ad-btn--danger ad-btn--sm"
                  onClick={() => setConfirmRemove(true)}
                  disabled={!view?.translation || loading || busy}
                >
                  Remove translation
                </button>
              </div>
            </div>

            <div className="ad-modal-body ad-tr-body">
              {view?.stale && !loading && (
                <div className="ad-tr-alert is-warning" role="status">
                  The English content was edited after this translation was saved. Check the fields below against the current English.
                </div>
              )}
              {drafts.size > 0 && (
                <div className="ad-tr-alert is-draft" role="status">
                  {drafts.size} field{drafts.size === 1 ? " was" : "s were"} filled by machine translation and need
                  {drafts.size === 1 ? "s" : ""} review before saving.
                </div>
              )}
              {notice && (
                <div className={`ad-tr-alert is-${notice.kind}`} role={notice.kind === "error" ? "alert" : "status"}>
                  {notice.text}
                </div>
              )}
              {body}
            </div>

            <div className="ad-tr-footer">
              <span className="ad-tr-footer-note">{dirty ? "Unsaved changes" : "Empty fields fall back to English."}</span>
              <div className="ad-tr-footer-actions">
                <button type="button" className="ad-btn ad-btn--ghost" onClick={requestClose} disabled={busy}>
                  Close
                </button>
                <button type="button" className="ad-btn" onClick={() => void save()} disabled={!view || loading || busy || !dirty}>
                  {saving ? "Saving…" : "Save translation"}
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body,
      )}
      {confirmRemove && (
        <ConfirmDialog
          title={`Remove the ${locale.nativeName} translation?`}
          description={`Visitors using ${locale.nativeName} will see the English text for this item. This cannot be undone.`}
          confirmLabel="Remove"
          danger
          busy={removing}
          onConfirm={() => void remove()}
          onCancel={() => setConfirmRemove(false)}
        />
      )}
      {pendingDiscard && (
        <ConfirmDialog
          title="Discard unsaved changes?"
          description={
            pendingDiscard.kind === "locale"
              ? `Your ${locale.nativeName} edits have not been saved. Switching to ${pendingDiscard.locale.nativeName} discards them.`
              : `Your ${locale.nativeName} edits have not been saved and will be lost.`
          }
          confirmLabel="Discard"
          danger
          onConfirm={confirmDiscard}
          onCancel={() => setPendingDiscard(null)}
        />
      )}
    </>
  );
}
