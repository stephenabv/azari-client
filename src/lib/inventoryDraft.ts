/**
 * Deriving an inventory record from the name an admin types while building a
 * package.
 *
 * All of it is pure: the package modal's quick-add form uses it to suggest
 * fields and to spot duplicates before anything is persisted, and it can be
 * exercised without a browser. The rules deliberately mirror what Inventory
 * Management already enforces — same required fields, same canonical units —
 * so an item created either way is the same record.
 */

import {
  CATEGORY_SPEC, UNITS, toCanonical, fromCanonical,
  type CatSpec, type Dimension,
} from "./units";
import type { ApiSolarComponent, ComponentInput } from "../services/ASContent";

/** What the quick-add form holds while it is being filled in. */
export interface InventoryDraft {
  name: string;
  brand: string;
  model: string;
  /** Kept as typed so a half-entered number does not fight the input. */
  capacityValue: string;
  capacityUnit: string;
}

export interface DraftSuggestion {
  brand: string;
  model: string;
  capacityValue: string;
  capacityUnit: string;
}

export const categorySpecFor = (category: string): CatSpec | undefined => CATEGORY_SPEC[category];

/** Whether a rating applies at all — accessories carry no capacity. */
export const categoryHasCapacity = (category: string): boolean => categorySpecFor(category) !== undefined;

const collapse = (s: string) => s.trim().replace(/\s+/g, " ");

/** Case-insensitive lookup that returns the unit's canonical spelling ("kwp" -> "kWp"). */
function canonicalUnitCode(raw: string, dimension: Dimension): string | null {
  const hit = UNITS[dimension].units.find((u) => u.code.toLowerCase() === raw.toLowerCase());
  return hit?.code ?? null;
}

/**
 * Restates a value in a unit the category's own editor offers, keeping the
 * magnitude exactly. A panel typed as "580W" is stored as 580 Wp — same
 * canonical 0.58 kWp — because Inventory Management offers Wp/kWp for panels
 * and would otherwise silently re-label the unit the next time the item is
 * edited. The admin sees the resulting unit in the form and can change it.
 */
export function normaliseToOffered(
  value: number,
  unit: string,
  spec: CatSpec,
): { value: number; unit: string } {
  if (spec.offer.includes(unit)) return { value, unit };

  const canonical = toCanonical(value, spec.dimension, unit);
  const sameMagnitude = spec.offer.find(
    (code) => UNITS[spec.dimension].units.find((u) => u.code === code)?.factorToCanonical ===
              UNITS[spec.dimension].units.find((u) => u.code === unit)?.factorToCanonical,
  );
  const target = sameMagnitude ?? spec.default;
  return { value: fromCanonical(canonical, spec.dimension, target), unit: target };
}

/**
 * Reads brand, model and rating out of an item name.
 *
 * Brand is the first word and the model is what follows, per the agreed
 * convention — the rating stays part of the model, as in
 * "Jinko Tiger Neo 580W" -> brand "Jinko", model "Tiger Neo 580W".
 * A rating is only offered when one is unambiguously present and the category
 * actually has a capacity; anything less is left for the admin to type rather
 * than guessed at.
 */
export function suggestFromName(name: string, category: string): DraftSuggestion {
  const spec = categorySpecFor(category);
  const cleaned = collapse(name);
  const words = cleaned ? cleaned.split(" ") : [];

  const brand = words[0] ?? "";
  const model = words.slice(1).join(" ");

  const empty = { brand, model, capacityValue: "", capacityUnit: spec?.default ?? "" };
  if (!spec || words.length === 0) return empty;

  // Scan from the end: the rating is conventionally the trailing token, and a
  // later match beats an earlier one ("6kW Hybrid 580W" -> 580W).
  for (let i = words.length - 1; i >= 0; i--) {
    const m = /^(\d+(?:\.\d+)?)\s*([a-zA-Z]+)$/.exec(words[i]);
    if (!m) continue;

    const parsed = Number(m[1]);
    if (!Number.isFinite(parsed) || parsed <= 0) continue;

    const unit = canonicalUnitCode(m[2], spec.dimension);
    // A unit from the wrong dimension (kWh on a panel) is not a rating for
    // this category, and an unrecognised suffix is not a unit at all.
    if (!unit) continue;

    const norm = normaliseToOffered(parsed, unit, spec);
    return { brand, model, capacityValue: String(norm.value), capacityUnit: norm.unit };
  }

  return empty;
}

export interface DuplicateMatch {
  component: ApiSolarComponent;
  /** "exact" when the names match outright; "likely" on a looser signal. */
  kind: "exact" | "likely";
  reason: string;
}

/** Lowercased, punctuation- and space-insensitive, for comparing names. */
const fingerprint = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");

/**
 * Looks for inventory that already covers this draft, within the same
 * category. Exact name matches come first, then items whose name differs only
 * by spacing or punctuation, then a matching brand + model pair.
 */
export function findDuplicates(
  draft: Pick<InventoryDraft, "name" | "brand" | "model">,
  category: string,
  components: ApiSolarComponent[],
): DuplicateMatch[] {
  const name = collapse(draft.name);
  if (!name) return [];

  const nameKey = name.toLowerCase();
  const looseKey = fingerprint(name);
  const brandKey = collapse(draft.brand).toLowerCase();
  const modelKey = collapse(draft.model).toLowerCase();

  const matches: DuplicateMatch[] = [];

  for (const c of components) {
    if (c.category !== category) continue;

    if (c.name.trim().toLowerCase() === nameKey) {
      matches.push({ component: c, kind: "exact", reason: "Same name" });
      continue;
    }
    if (fingerprint(c.name) === looseKey) {
      matches.push({ component: c, kind: "likely", reason: "Name differs only by spacing or punctuation" });
      continue;
    }
    if (brandKey && modelKey &&
        c.brand.trim().toLowerCase() === brandKey &&
        c.model.trim().toLowerCase() === modelKey) {
      matches.push({ component: c, kind: "likely", reason: "Same brand and model" });
    }
  }

  return matches.sort((a, b) => (a.kind === b.kind ? 0 : a.kind === "exact" ? -1 : 1));
}

/**
 * The same required fields Inventory Management enforces: name, brand and
 * model always, plus a positive rating for the categories that carry one.
 * Everything else on a component is optional here and stays editable there.
 */
export function validateDraft(draft: InventoryDraft, category: string): Record<string, string> {
  const errors: Record<string, string> = {};

  if (!draft.name.trim()) errors.name = "Item name is required.";
  if (!draft.brand.trim()) errors.brand = "Brand is required.";
  if (!draft.model.trim()) errors.model = "Model is required.";

  const spec = categorySpecFor(category);
  if (spec) {
    const raw = draft.capacityValue.trim();
    if (!raw) {
      errors.capacity = `${spec.label} is required.`;
    } else if (!/^\d*\.?\d+$/.test(raw) || !(Number(raw) > 0)) {
      errors.capacity = `${spec.label} must be a number greater than 0.`;
    } else if (!spec.offer.includes(draft.capacityUnit)) {
      errors.capacity = `Choose a unit (${spec.offer.join(" or ")}).`;
    }
  }

  return errors;
}

/**
 * Turns a validated draft into the payload the inventory API already takes.
 * The rating is converted to the category's canonical field exactly as the
 * Inventory Management form does, and the unit is stored alongside it;
 * every other field keeps the same defaults a blank inventory record gets.
 */
export function draftToComponentInput(draft: InventoryDraft, category: string): ComponentInput {
  const spec = categorySpecFor(category);

  const base: ComponentInput = {
    name: collapse(draft.name),
    brand: collapse(draft.brand),
    model: collapse(draft.model),
    category,
    pricingEnabled: false,
    isActive: true,
    productionCapacityKwp: 0,
    loadCapacityKw: 0,
    storageCapacityKwh: 0,
    capacityUnit: spec ? draft.capacityUnit : null,
    parallelMin: 1,
    parallelMax: 4,
    perInverterMin: 1,
    perInverterMax: 4,
    pvMinPower: null,
    pvMaxPower: null,
    batteryMaxCapacity: null,
    dataSheetUrl: null,
  };

  if (spec) {
    base[spec.field] = toCanonical(Number(draft.capacityValue), spec.dimension, draft.capacityUnit);
  }

  return base;
}
