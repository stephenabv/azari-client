import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { FAQ_LIMITS, type AdminFaq, type FaqInput } from "../../models/faq";
import { AdminFaqClient } from "../../services/faq/FaqClients";

type Notice = { text: string; ok: boolean } | null;

/** What the editor is doing: nothing, adding a new entry, or editing one. */
type EditorTarget = { mode: "closed" } | { mode: "create" } | { mode: "edit"; faq: AdminFaq };

const EMPTY_FORM: Required<FaqInput> = { question: "", answer: "", isPublished: true };

function errorText(error: unknown, fallback: string): string {
  return error instanceof Error && error.message ? error.message : fallback;
}

/**
 * Admin console section for the home page FAQ: add, edit, publish/unpublish,
 * reorder and delete entries. The list starts empty (there are no default
 * entries) and the public section stays hidden until one is published.
 */
export default function ASFaqManager({ apiKey }: { apiKey: string }) {
  const client = useMemo(() => new AdminFaqClient(apiKey), [apiKey]);
  const [faqs, setFaqs] = useState<AdminFaq[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [editor, setEditor] = useState<EditorTarget>({ mode: "closed" });
  const [notice, setNotice] = useState<Notice>(null);
  const noticeTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const notify = useCallback((text: string, ok = true) => {
    clearTimeout(noticeTimer.current);
    setNotice({ text, ok });
    noticeTimer.current = setTimeout(() => setNotice(null), 4000);
  }, []);

  useEffect(() => () => clearTimeout(noticeTimer.current), []);

  /** Fetches the list; state updates happen only once the request settles. */
  const fetchList = useCallback(
    () =>
      client.list().then(
        (list) => {
          setFaqs(list);
          setLoadError(null);
        },
        (error: unknown) => setLoadError(errorText(error, "Could not load FAQs.")),
      ).finally(() => setLoading(false)),
    [client],
  );

  useEffect(() => {
    void fetchList();
  }, [fetchList]);

  const reload = () => {
    setLoading(true);
    void fetchList();
  };

  /** Runs one row action with a busy flag, so a double click cannot send it twice. */
  const runRowAction = async (id: string, action: () => Promise<void>, failure: string) => {
    setBusyId(id);
    try {
      await action();
    } catch (error) {
      notify(errorText(error, failure), false);
    } finally {
      setBusyId(null);
    }
  };

  const handleSaved = (saved: AdminFaq, created: boolean) => {
    setFaqs((list) => (created ? [...list, saved] : list.map((f) => (f.id === saved.id ? saved : f))));
    setEditor({ mode: "closed" });
    notify(created ? "FAQ added." : "FAQ updated.");
  };

  const togglePublished = (faq: AdminFaq) =>
    runRowAction(faq.id, async () => {
      const saved = await client.setPublished(faq.id, !faq.isPublished);
      setFaqs((list) => list.map((f) => (f.id === saved.id ? saved : f)));
      notify(saved.isPublished ? "FAQ published." : "FAQ moved to drafts.");
    }, "Could not change the status.");

  const remove = (faq: AdminFaq) =>
    runRowAction(faq.id, async () => {
      await client.remove(faq.id);
      setFaqs((list) => list.filter((f) => f.id !== faq.id));
      setConfirmDeleteId(null);
      notify("FAQ deleted.");
    }, "Could not delete the FAQ.");

  const move = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    const current = faqs[index];
    if (!current || target < 0 || target >= faqs.length) return;
    const next = [...faqs];
    [next[index], next[target]] = [next[target] as AdminFaq, current];
    void runRowAction(current.id, async () => {
      setFaqs(await client.reorder(next.map((f) => f.id)));
    }, "Could not reorder. Reload and try again.");
  };

  const publishedCount = faqs.filter((f) => f.isPublished).length;

  return (
    <div className="ad-section ad-faq">
      <div className="ad-section-header">
        <div>
          <h2 className="ad-section-title">FAQ</h2>
          <p className="ad-faq-subtitle">
            {faqs.length === 0
              ? "Questions shown in the home page FAQ section."
              : `${publishedCount} of ${faqs.length} published on the home page.`}
          </p>
        </div>
        {editor.mode === "closed" && faqs.length > 0 && (
          <button type="button" className="ad-btn" onClick={() => setEditor({ mode: "create" })}>
            + Add FAQ
          </button>
        )}
      </div>

      <div aria-live="polite">
        {notice && <div className={`ad-toast ${notice.ok ? "is-success" : "is-error"}`}>{notice.text}</div>}
      </div>

      {editor.mode !== "closed" && (
        <FaqEditor
          key={editor.mode === "edit" ? editor.faq.id : "new"}
          client={client}
          faq={editor.mode === "edit" ? editor.faq : null}
          onSaved={handleSaved}
          onCancel={() => setEditor({ mode: "closed" })}
        />
      )}

      {loading ? (
        <p className="ad-faq-status">Loading…</p>
      ) : loadError ? (
        <div className="ad-card ad-faq-empty">
          <p className="ad-faq-empty-title">{loadError}</p>
          <button type="button" className="ad-btn ad-btn--ghost" onClick={reload}>
            Try again
          </button>
        </div>
      ) : faqs.length === 0 ? (
        editor.mode === "closed" && (
          <div className="ad-card ad-faq-empty">
            <svg className="ad-faq-empty-icon" viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="12" cy="12" r="10" />
              <path d="M9.1 9a3 3 0 0 1 5.8 1c0 2-3 3-3 3" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
            <p className="ad-faq-empty-title">No FAQs yet</p>
            <p className="ad-faq-empty-text">
              The FAQ section stays hidden on the home page until you add and publish at least one question.
            </p>
            <button type="button" className="ad-btn" onClick={() => setEditor({ mode: "create" })}>
              + Add your first FAQ
            </button>
          </div>
        )
      ) : (
        <ol className="ad-faq-list">
          {faqs.map((faq, index) => {
            const busy = busyId === faq.id;
            const confirming = confirmDeleteId === faq.id;
            return (
              <li key={faq.id} className={`ad-card ad-faq-row${faq.isPublished ? "" : " is-draft"}`}>
                <div className="ad-faq-order">
                  <button
                    type="button"
                    className="ad-btn ad-btn--ghost ad-btn--sm"
                    onClick={() => move(index, -1)}
                    disabled={index === 0 || busyId !== null}
                    aria-label={`Move "${faq.question}" up`}
                  >
                    ↑
                  </button>
                  <span className="ad-faq-index">{String(index + 1).padStart(2, "0")}</span>
                  <button
                    type="button"
                    className="ad-btn ad-btn--ghost ad-btn--sm"
                    onClick={() => move(index, 1)}
                    disabled={index === faqs.length - 1 || busyId !== null}
                    aria-label={`Move "${faq.question}" down`}
                  >
                    ↓
                  </button>
                </div>

                <div className="ad-faq-body">
                  <div className="ad-faq-head">
                    <h3 className="ad-faq-question">{faq.question}</h3>
                    <span className={`ad-badge ${faq.isPublished ? "is-published" : "is-draft"}`}>
                      {faq.isPublished ? "Published" : "Draft"}
                    </span>
                  </div>
                  <p className="ad-faq-answer">{faq.answer}</p>
                </div>

                <div className="ad-faq-actions">
                  {confirming ? (
                    <>
                      <span className="ad-faq-confirm">Delete this FAQ?</span>
                      <button type="button" className="ad-btn ad-btn--danger ad-btn--sm" disabled={busy} onClick={() => void remove(faq)}>
                        {busy ? "Deleting…" : "Delete"}
                      </button>
                      <button type="button" className="ad-btn ad-btn--ghost ad-btn--sm" onClick={() => setConfirmDeleteId(null)}>
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button type="button" className="ad-btn ad-btn--sm" disabled={busy} onClick={() => setEditor({ mode: "edit", faq })}>
                        Edit
                      </button>
                      <button type="button" className="ad-btn ad-btn--ghost ad-btn--sm" disabled={busy} onClick={() => void togglePublished(faq)}>
                        {faq.isPublished ? "Unpublish" : "Publish"}
                      </button>
                      <button type="button" className="ad-btn ad-btn--ghost ad-btn--sm ad-faq-delete" disabled={busy} onClick={() => setConfirmDeleteId(faq.id)}>
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
}

type FaqEditorProps = {
  client: AdminFaqClient;
  /** The entry being edited, or null to add a new one. */
  faq: AdminFaq | null;
  onSaved: (faq: AdminFaq, created: boolean) => void;
  onCancel: () => void;
};

function FaqEditor({ client, faq, onSaved, onCancel }: FaqEditorProps) {
  const [form, setForm] = useState<Required<FaqInput>>(
    faq ? { question: faq.question, answer: faq.answer, isPublished: faq.isPublished } : EMPTY_FORM,
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const questionRef = useRef<HTMLInputElement>(null);

  useEffect(() => questionRef.current?.focus(), []);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const input: Required<FaqInput> = { ...form, question: form.question.trim(), answer: form.answer.trim() };
    if (!input.question || !input.answer) {
      setError("Enter both a question and an answer.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const saved = faq ? await client.update(faq.id, input) : await client.create(input);
      onSaved(saved, faq === null);
    } catch (err) {
      setError(errorText(err, "Could not save the FAQ."));
      setSaving(false);
    }
  };

  return (
    <form className="ad-card ad-faq-editor" onSubmit={(e) => void submit(e)} noValidate>
      <h3 className="ad-card-title">{faq ? "Edit FAQ" : "New FAQ"}</h3>

      <div className="ad-faq-field">
        <label className="ad-label" htmlFor="faq-question">Question</label>
        <input
          id="faq-question"
          ref={questionRef}
          className="ad-input"
          value={form.question}
          maxLength={FAQ_LIMITS.question}
          onChange={(e) => setForm((f) => ({ ...f, question: e.target.value }))}
          placeholder="e.g. How long does solar installation take?"
          required
        />
        <span className="ad-faq-count">{form.question.length}/{FAQ_LIMITS.question}</span>
      </div>

      <div className="ad-faq-field">
        <label className="ad-label" htmlFor="faq-answer">Answer</label>
        <textarea
          id="faq-answer"
          className="ad-textarea"
          rows={6}
          value={form.answer}
          maxLength={FAQ_LIMITS.answer}
          onChange={(e) => setForm((f) => ({ ...f, answer: e.target.value }))}
          placeholder="Plain text. Leave a blank line between paragraphs."
          required
        />
        <span className="ad-faq-count">{form.answer.length}/{FAQ_LIMITS.answer}</span>
      </div>

      <label className="ad-faq-check">
        <input
          type="checkbox"
          checked={form.isPublished}
          onChange={(e) => setForm((f) => ({ ...f, isPublished: e.target.checked }))}
        />
        Show on the home page
      </label>

      {error && <p className="ad-field-error" role="alert">{error}</p>}

      <div className="ad-form-actions">
        <button type="submit" className="ad-btn" disabled={saving}>
          {saving ? "Saving…" : faq ? "Save changes" : "Add FAQ"}
        </button>
        <button type="button" className="ad-btn ad-btn--ghost" onClick={onCancel} disabled={saving}>
          Cancel
        </button>
      </div>
    </form>
  );
}
