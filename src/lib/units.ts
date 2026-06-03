// ─── Capacity unit registry ───────────────────────────────────────────────────
// Single source of truth for capacity units across the admin and public pages.
// Components STORE canonical "kilo" values (kW / kWh); this module converts to/from
// the units operators type in, and formats canonical values for display.
// Adding a unit later (e.g. MW/MWh) is a one-line edit to UNITS + the category's `offer`.
export type Dimension = "power" | "energy";

export const UNITS: Record<Dimension, { canonical: string; units: { code: string; factorToCanonical: number }[] }> = {
  power: {
    canonical: "kW",
    units: [
      { code: "W",   factorToCanonical: 0.001 },
      { code: "kW",  factorToCanonical: 1 },
      { code: "MW",  factorToCanonical: 1000 },
      { code: "Wp",  factorToCanonical: 0.001 }, // peak watts (STC) — dimensionally power
      { code: "kWp", factorToCanonical: 1 },
    ],
  },
  energy: {
    canonical: "kWh",
    units: [
      { code: "Wh",  factorToCanonical: 0.001 },
      { code: "kWh", factorToCanonical: 1 },
      { code: "MWh", factorToCanonical: 1000 },
    ],
  },
};

export type CapField = "productionCapacityKwp" | "loadCapacityKw" | "storageCapacityKwh";
export type CatSpec = {
  field: CapField; dimension: Dimension; offer: string[]; default: string;
  label: string; helper: string; canonicalLabel: string; example: number; // example is in canonical units
};
// Per-category: which capacity field it drives, its dimension, the units it offers, and its default.
export const CATEGORY_SPEC: Record<string, CatSpec> = {
  "Solar Panel": { field: "productionCapacityKwp", dimension: "power",  offer: ["Wp", "kWp"], default: "Wp",  label: "Production Capacity", helper: "Per-panel output",          canonicalLabel: "kWp", example: 0.62 },
  "Inverter":    { field: "loadCapacityKw",        dimension: "power",  offer: ["W", "kW"],   default: "kW",  label: "Load Capacity",       helper: "Maximum power conversion", canonicalLabel: "kW",  example: 6 },
  "Battery":     { field: "storageCapacityKwh",    dimension: "energy", offer: ["Wh", "kWh"], default: "kWh", label: "Storage Capacity",    helper: "Total energy storage",     canonicalLabel: "kWh", example: 5.12 },
};

// Explicit rounding absorbs binary float drift (e.g. 620 * 0.001).
export const round = (n: number, dp = 6) => Math.round(n * 10 ** dp) / 10 ** dp;
export const unitFactor = (dimension: Dimension, code: string): number =>
  UNITS[dimension].units.find(u => u.code === code)?.factorToCanonical ?? 1;
export const toCanonical   = (displayVal: number,   dimension: Dimension, code: string): number => round(displayVal * unitFactor(dimension, code));
export const fromCanonical = (canonicalVal: number, dimension: Dimension, code: string): number => round(canonicalVal / unitFactor(dimension, code));

/**
 * Format a canonical capacity value as a "<value> <code>" string.
 * Rendering uses String(round(value)) — a natural number string with NO toFixed and
 * NO forced trailing zeros (6 -> "6", 6.2 -> "6.2", 6.25 -> "6.25").
 *
 * - opts.unit: convert canonical -> that unit code and label it accordingly.
 * - default (no unit): render in the dimension's canonical kilo unit.
 * - opts.humanize: pick the unit whose magnitude lands in [1, 1000).
 * - guards null/undefined/NaN by returning "" so caller template text stays intact.
 */
export function formatCapacity(
  canonicalValue: number,
  dimension: Dimension,
  opts?: { unit?: string; humanize?: boolean; dp?: number },
): string {
  if (!Number.isFinite(canonicalValue)) return "";
  const dp = opts?.dp ?? 6;

  if (opts?.humanize) {
    const sorted = [...UNITS[dimension].units].sort((a, b) => a.factorToCanonical - b.factorToCanonical);
    for (const u of sorted) {
      const v = fromCanonical(canonicalValue, dimension, u.code);
      if (Math.abs(v) >= 1 && Math.abs(v) < 1000) return `${String(round(v, dp))} ${u.code}`;
    }
    // fall through to canonical when nothing lands in range (e.g. exactly 0)
  }

  const code = opts?.unit ?? UNITS[dimension].canonical;
  const value = fromCanonical(canonicalValue, dimension, code);
  return `${String(round(value, dp))} ${code}`;
}
