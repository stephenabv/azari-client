import { useMemo, useRef, useState } from "react";
import {
  categorySpecFor, draftToComponentInput, findDuplicates, suggestFromName, validateDraft,
  type DuplicateMatch, type InventoryDraft,
} from "../lib/inventoryDraft";
import type { ApiSolarComponent, ComponentInput } from "../services/ASContent";

export interface ASInventoryQuickAddProps {
  /** Taken from the builder section the admin is in — never asked for. */
  category: string;
  /** Seeded from whatever was typed into that section's search box. */
  initialName?: string;
  /** The loaded inventory, used to spot duplicates before anything is saved. */
  existingComponents: ApiSolarComponent[];
  onCancel: () => void;
  /** Persists through the normal inventory service and returns the new record. */
  onCreate: (input: ComponentInput) => Promise<ApiSolarComponent>;
  /** Chosen instead of creating, when the item turns out to already exist. */
  onUseExisting: (component: ApiSolarComponent) => void;
}

/** Fields the admin has edited by hand, which suggestions must not overwrite. */
type TouchedField = "brand" | "model" | "capacity";

/**
 * Creates an inventory item without leaving the package builder.
 *
 * Only the fields inventory actually requires are asked for — name, brand,
 * model and, where the category has one, a rating. Everything else takes the
 * same defaults a blank inventory record gets and stays editable in Inventory
 * Management afterwards. Brand, model and rating are suggested from the name
 * and stop being suggested the moment the admin edits them.
 *
 * Nothing is persisted until the draft has been checked against the existing
 * inventory; a possible match puts the decision to the admin first.
 */
export default function ASInventoryQuickAdd({
  category, initialName = "", existingComponents, onCancel, onCreate, onUseExisting,
}: ASInventoryQuickAddProps) {
  const spec = categorySpecFor(category);

  const seed = useMemo(() => suggestFromName(initialName, category), [initialName, category]);
  const [draft, setDraft] = useState<InventoryDraft>({
    name: initialName,
    brand: seed.brand,
    model: seed.model,
    capacityValue: seed.capacityValue,
    capacityUnit: seed.capacityUnit,
  });

  const touched = useRef<Set<TouchedField>>(new Set());
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [duplicates, setDuplicates] = useState<DuplicateMatch[] | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [failure, setFailure] = useState("");

  /** Re-derives whatever the admin has not taken over. */
  const onNameChange = (name: string) => {
    const s = suggestFromName(name, category);
    setDraft((d) => ({
      name,
      brand: touched.current.has("brand") ? d.brand : s.brand,
      model: touched.current.has("model") ? d.model : s.model,
      capacityValue: touched.current.has("capacity") ? d.capacityValue : s.capacityValue,
      capacityUnit: touched.current.has("capacity") ? d.capacityUnit : s.capacityUnit,
    }));
    setErrors((e) => ({ ...e, name: "" }));
  };

  const edit = (field: TouchedField, patch: Partial<InventoryDraft>, errorKey: string) => {
    touched.current.add(field);
    setDraft((d) => ({ ...d, ...patch }));
    setErrors((e) => ({ ...e, [errorKey]: "" }));
  };

  const persist = async () => {
    setSubmitting(true);
    setFailure("");
    try {
      const created = await onCreate(draftToComponentInput(draft, category));
      setDuplicates(null);
      return created;
    } catch (err) {
      // Stay open with the draft intact so the admin can retry or cancel —
      // the rest of the package they were building is untouched.
      setFailure((err as Error).message || "Could not create the inventory item.");
      setDuplicates(null);
      return null;
    } finally {
      setSubmitting(false);
    }
  };

  const submit = async () => {
    if (submitting) return; // a second click must not create a second record

    const errs = validateDraft(draft, category);
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});

    const matches = findDuplicates(draft, category, existingComponents);
    if (matches.length > 0) { setDuplicates(matches); return; }

    await persist();
  };

  const req = <span className="ad-qa-req" aria-hidden="true">*</span>;

  return (
    <div className="ad-qa" role="group" aria-label={`New ${category} inventory item`}>
      <div className="ad-qa-head">
        <span className="ad-qa-title">New {category}</span>
        <span className="ad-qa-hint">Saved to Inventory · <span className="ad-qa-req">*</span> required</span>
      </div>

      <label className="ad-qa-field">
        <span className="ad-qa-label">Item name {req}</span>
        <input
          className="ad-input"
          value={draft.name}
          autoFocus
          placeholder={`e.g. Jinko Tiger Neo 580W`}
          onChange={(e) => onNameChange(e.target.value)}
        />
        {errors.name && <span className="ad-qa-error">{errors.name}</span>}
      </label>

      <div className="ad-qa-row">
        <label className="ad-qa-field">
          <span className="ad-qa-label">Brand {req}</span>
          <input
            className="ad-input"
            value={draft.brand}
            onChange={(e) => edit("brand", { brand: e.target.value }, "brand")}
          />
          {errors.brand && <span className="ad-qa-error">{errors.brand}</span>}
        </label>

        <label className="ad-qa-field">
          <span className="ad-qa-label">Model {req}</span>
          <input
            className="ad-input"
            value={draft.model}
            onChange={(e) => edit("model", { model: e.target.value }, "model")}
          />
          {errors.model && <span className="ad-qa-error">{errors.model}</span>}
        </label>
      </div>

      {spec && (
        <label className="ad-qa-field">
          <span className="ad-qa-label">{spec.label} {req}</span>
          <div className="ad-qa-capacity">
            <input
              className="ad-input"
              inputMode="decimal"
              value={draft.capacityValue}
              placeholder={String(spec.example)}
              onChange={(e) => edit("capacity", { capacityValue: e.target.value }, "capacity")}
            />
            <select
              className="ad-input ad-qa-unit"
              value={draft.capacityUnit}
              aria-label={`${spec.label} unit`}
              onChange={(e) => edit("capacity", { capacityUnit: e.target.value }, "capacity")}
            >
              {spec.offer.map((u) => <option key={u} value={u}>{u}</option>)}
            </select>
          </div>
          {errors.capacity
            ? <span className="ad-qa-error">{errors.capacity}</span>
            : <span className="ad-qa-help">{spec.helper}. Other details can be filled in later from Inventory.</span>}
        </label>
      )}

      {failure && <div className="ad-qa-failure" role="alert">{failure}</div>}

      <div className="ad-qa-actions">
        <button type="button" className="ad-btn ad-btn--sm" onClick={() => void submit()} disabled={submitting}>
          {submitting ? "Saving…" : "Save & add to package"}
        </button>
        <button type="button" className="ad-btn ad-btn--sm ad-btn--ghost" onClick={onCancel} disabled={submitting}>
          Cancel
        </button>
      </div>

      {duplicates && (
        <div
          className="ad-qa-dupe-backdrop"
          role="dialog"
          aria-modal="true"
          aria-label="Matching inventory item found"
          onClick={() => setDuplicates(null)}
        >
          <div className="ad-qa-dupe" onClick={(e) => e.stopPropagation()}>
            <div className="ad-qa-dupe-title">
              {duplicates.length > 1 ? "Matching inventory items found" : "An existing inventory item matches this item"}
            </div>
            <p className="ad-qa-dupe-body">
              Would you like to use the existing inventory item instead, or create a new item?
            </p>

            <ul className="ad-qa-dupe-list">
              {duplicates.map((m) => (
                <li key={m.component.id} className="ad-qa-dupe-item">
                  <div className="ad-qa-dupe-info">
                    <span className="ad-qa-dupe-name">{m.component.name}</span>
                    <span className="ad-qa-dupe-meta">
                      {m.component.brand} · {m.component.model}
                      <span className={`ad-qa-dupe-tag is-${m.kind}`}>{m.kind === "exact" ? "exact match" : "likely match"}</span>
                    </span>
                    <span className="ad-qa-dupe-reason">{m.reason}</span>
                  </div>
                  <button
                    type="button"
                    className="ad-btn ad-btn--sm"
                    disabled={submitting}
                    onClick={() => { setDuplicates(null); onUseExisting(m.component); }}
                  >
                    Use Existing Item
                  </button>
                </li>
              ))}
            </ul>

            <div className="ad-qa-dupe-actions">
              <button type="button" className="ad-btn ad-btn--sm ad-btn--ghost" onClick={() => void persist()} disabled={submitting}>
                {submitting ? "Saving…" : "Create New Item"}
              </button>
              <button type="button" className="ad-btn ad-btn--sm ad-btn--ghost" onClick={() => setDuplicates(null)} disabled={submitting}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
